import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { isAdmin } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between">
        <Logo />
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={isAdmin ? "/admin" : "/auth"}
            className="rounded-full bg-navy px-4 py-2 text-xs text-navy-foreground transition-opacity hover:opacity-90"
          >
            {isAdmin ? "Admin Dashboard" : "Staff Login"}
          </Link>
        </div>
        <Link
          to="/contact"
          className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground md:hidden"
        >
          Get a quote
        </Link>
      </div>
    </nav>
  );
}
