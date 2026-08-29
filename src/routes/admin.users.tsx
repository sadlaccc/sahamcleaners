import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

type RoleName = "admin" | "staff" | "user";

function AdminUsers() {
  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const [{ data: profiles, error: profileError }, { data: roles, error: roleError }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id, full_name, email, phone, created_at")
            .order("created_at", { ascending: false }),
          supabase.from("user_roles").select("user_id, role"),
        ]);
      if (profileError) throw profileError;
      if (roleError) throw roleError;
      return (profiles ?? []).map((profile) => ({
        ...profile,
        roles: (roles ?? [])
          .filter((role) => role.user_id === profile.id)
          .map((role) => role.role as RoleName),
      }));
    },
  });

  const setRole = useMutation({
    mutationFn: async ({
      userId,
      role,
      grant,
    }: {
      userId: string;
      role: RoleName;
      grant: boolean;
    }) => {
      if (grant) {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);
        if (error) throw error;
      }
    },
    onSuccess: async () => {
      toast.success("Access updated");
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Update failed"),
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Users & roles</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everyone who has registered an account. Grant the admin role to give console access.
      </p>

      <div className="mt-8 overflow-x-auto border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Roles</th>
              <th className="px-6 py-4 text-right">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(users.data ?? []).map((user) => {
              const isAdmin = user.roles.includes("admin");
              const isStaff = user.roles.includes("staff");
              return (
                <tr key={user.id}>
                  <td className="px-6 py-4 font-medium">{user.full_name ?? "—"}</td>
                  <td className="px-6 py-4">{user.email ?? "—"}</td>
                  <td className="px-6 py-4">{user.phone ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-accent px-2 py-1 text-xs text-accent-foreground">
                      {user.roles.join(", ") || "none"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setRole.mutate({ userId: user.id, role: "admin", grant: !isAdmin })
                      }
                      className="font-medium text-primary"
                    >
                      {isAdmin ? "Revoke admin" : "Make admin"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRole.mutate({ userId: user.id, role: "staff", grant: !isStaff })
                      }
                      className="ml-4 font-medium text-primary"
                    >
                      {isStaff ? "Revoke staff" : "Make staff"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.isLoading && <p className="px-6 py-6 text-sm text-muted-foreground">Loading…</p>}
        {!users.isLoading && (users.data ?? []).length === 0 && (
          <p className="px-6 py-6 text-sm text-muted-foreground">No registered users yet.</p>
        )}
      </div>
    </div>
  );
}
