import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as SupabaseClient;

export type FieldType = "text" | "textarea" | "select" | "checkbox" | "date";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
};

export type Row = Record<string, unknown>;

type Props = {
  table: string;
  title: string;
  description: string;
  fields: Field[];
  columns: { key: string; label: string }[];
  orderBy?: { column: string; ascending?: boolean };
  defaults?: Row;
};

function emptyForm(fields: Field[], defaults?: Row): Row {
  const form: Row = { ...defaults };
  for (const field of fields) {
    if (form[field.name] === undefined) {
      form[field.name] = field.type === "checkbox" ? false : "";
    }
  }
  return form;
}

export function ResourceManager({
  table,
  title,
  description,
  fields,
  columns,
  orderBy,
  defaults,
}: Props) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>(() => emptyForm(fields, defaults));
  const [open, setOpen] = useState(false);

  const list = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      let query = db.from(table).select("*");
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Row) => {
      const payload: Row = {};
      for (const field of fields) {
        const value = values[field.name];
        payload[field.name] = value === "" ? null : value;
      }
      if (editing) {
        const { error } = await db.from(table).update(payload).eq("id", editing["id"] as string);
        if (error) throw error;
      } else {
        const { error } = await db.from(table).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: async () => {
      toast.success(editing ? "Changes saved" : "Record created");
      setOpen(false);
      setEditing(null);
      setForm(emptyForm(fields, defaults));
      await queryClient.invalidateQueries({ queryKey: ["admin", table] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Save failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Record deleted");
      await queryClient.invalidateQueries({ queryKey: ["admin", table] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Delete failed"),
  });

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm(fields, defaults));
    setOpen(true);
  };

  const startEdit = (row: Row) => {
    setEditing(row);
    const next = emptyForm(fields, defaults);
    for (const field of fields) {
      const value = row[field.name];
      next[field.name] = value === null || value === undefined ? next[field.name] : value;
    }
    setForm(next);
    setOpen(true);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          New record
        </button>
      </div>

      {open && (
        <form
          className="mb-8 grid gap-4 border border-border bg-card p-6 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate(form);
          }}
        >
          {fields.map((field) => (
            <label
              key={field.name}
              className={`grid gap-2 text-sm font-medium ${
                field.type === "textarea" ? "md:col-span-2" : ""
              }`}
            >
              {field.label}
              {field.type === "textarea" ? (
                <textarea
                  rows={6}
                  required={field.required}
                  value={String(form[field.name] ?? "")}
                  onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                  className="border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              ) : field.type === "select" ? (
                <select
                  value={String(form[field.name] ?? "")}
                  onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                  className="border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {(field.options ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(form[field.name])}
                  onChange={(event) => setForm({ ...form, [field.name]: event.target.checked })}
                  className="size-5 justify-self-start accent-primary"
                />
              ) : (
                <input
                  type={field.type === "date" ? "date" : "text"}
                  required={field.required}
                  value={String(form[field.name] ?? "")}
                  onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                  className="border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              )}
            </label>
          ))}
          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={save.isPending}
              className="rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {editing ? "Save changes" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setEditing(null);
              }}
              className="border border-input px-6 py-2.5 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4">
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(list.data ?? []).map((row) => (
              <tr key={String(row["id"])}>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {formatCell(row[column.key])}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="font-medium text-primary"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove.mutate(row["id"] as string)}
                    className="ml-4 font-medium text-destructive"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.isLoading && <p className="px-6 py-6 text-sm text-muted-foreground">Loading…</p>}
        {!list.isLoading && (list.data ?? []).length === 0 && (
          <p className="px-6 py-6 text-sm text-muted-foreground">No records yet.</p>
        )}
      </div>
    </div>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) return new Date(text).toLocaleDateString();
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}
