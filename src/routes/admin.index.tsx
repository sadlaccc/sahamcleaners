import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const [posts, published, clients, employees, users] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("employees").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      return {
        posts: posts.count ?? 0,
        published: published.count ?? 0,
        clients: clients.count ?? 0,
        employees: employees.count ?? 0,
        users: users.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Posts", value: stats?.posts ?? 0, to: "/admin/posts" as const },
    { label: "Published posts", value: stats?.published ?? 0, to: "/admin/posts" as const },
    { label: "Clients", value: stats?.clients ?? 0, to: "/admin/clients" as const },
    { label: "Employees", value: stats?.employees ?? 0, to: "/admin/employees" as const },
    { label: "Registered users", value: stats?.users ?? 0, to: "/admin/users" as const },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Management Console</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the website content, client list, cleaning crews and user access.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <p className="font-display text-4xl text-primary">{card.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
