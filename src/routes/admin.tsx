import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Management Console | Saham Cleaning Services" },
      {
        name: "description",
        content:
          "Internal Saham Cleaning Services console for managing posts, clients, employees and users.",
      },
      { property: "og:title", content: "Management Console | Saham Cleaning Services" },
      { property: "og:description", content: "Internal Saham management console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/posts", label: "Posts" },
  { to: "/admin/clients", label: "Clients" },
  { to: "/admin/employees", label: "Employees" },
  { to: "/admin/users", label: "Users & roles" },
] as const;

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!user) {
    return (
      <Gate
        title="Sign in required"
        body="The management console is only available to Saham staff accounts."
        actionLabel="Go to sign in"
        onAction={() => void navigate({ to: "/auth" })}
      />
    );
  }

  if (!isAdmin) {
    return (
      <Gate
        title="Administrator access needed"
        body={`Signed in as ${user.email ?? "your account"}, but this account has no admin role yet. Ask an administrator to grant it.`}
        actionLabel="Sign out"
        onAction={async () => {
          await supabase.auth.signOut();
          void navigate({ to: "/" });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container-page flex h-20 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user.email}</span>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                void navigate({ to: "/" });
              }}
              className="rounded-full bg-navy px-4 py-2 text-xs text-navy-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: Boolean("exact" in item && item.exact) }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-md px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent/60"
            >
              {item.label}
            </Link>
          ))}
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Gate({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-6">
      <div className="max-w-md border border-border bg-card p-8 text-center">
        <h1 className="font-display text-2xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{body}</p>
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
