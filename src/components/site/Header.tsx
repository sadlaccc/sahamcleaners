import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { commercialServices, domesticServices } from "@/lib/services";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { isAdmin } = useAuth();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const accountLink = isAdmin
    ? { to: "/admin" as const, label: "Admin Dashboard" }
    : null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 text-sm font-medium lg:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary" }}
            className="transition-colors hover:text-primary"
          >
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((open) => !open)}
              className="flex items-center gap-1 transition-colors hover:text-primary aria-expanded:text-primary"
            >
              Services
              <ChevronDown className={`size-4 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
            </button>

            {megaOpen && (
              <div className="absolute right-0 top-full w-[min(56rem,calc(100vw-3rem))] pt-4">
                <div className="grid gap-10 border border-border bg-background p-8 shadow-xl lg:grid-cols-[1fr_1fr_16rem]">
                  <MegaColumn
                    title="Commercial Solutions"
                    services={commercialServices}
                    onNavigate={() => setMegaOpen(false)}
                  />
                  <MegaColumn
                    title="Domestic Services"
                    services={domesticServices}
                    onNavigate={() => setMegaOpen(false)}
                  />
                  <div className="flex flex-col justify-between border-l border-border pl-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                        Need a tailored plan?
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Our supervisors will assess your site and build a cleaning schedule around
                        your operating hours.
                      </p>
                    </div>
                    <Link
                      to="/contact"
                      onClick={() => setMegaOpen(false)}
                      className="mt-6 inline-flex justify-center bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Request a quote
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {links.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "text-primary" }}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          {accountLink && (
            <Link
              to={accountLink.to}
              className="rounded-full bg-navy px-4 py-2 text-xs text-navy-foreground transition-opacity hover:opacity-90"
            >
              {accountLink.label}
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/contact"
            className="bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Get a quote
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="border border-border p-2 text-foreground"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-background lg:hidden">
          <div className="container-page flex flex-col py-4">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary" }}
              className="border-b border-border py-4 text-sm font-medium"
            >
              Home
            </Link>

            <button
              type="button"
              aria-expanded={mobileServicesOpen}
              onClick={() => setMobileServicesOpen((open) => !open)}
              className="flex items-center justify-between border-b border-border py-4 text-sm font-medium"
            >
              Services
              <ChevronDown
                className={`size-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileServicesOpen && (
              <div className="border-b border-border bg-surface/60 px-4 py-4">
                <MegaColumn title="Commercial Solutions" services={commercialServices} />
                <div className="mt-6">
                  <MegaColumn title="Domestic Services" services={domesticServices} />
                </div>
                <Link
                  to="/services"
                  className="mt-6 block text-xs font-semibold uppercase tracking-wider text-primary"
                >
                  View full catalogue
                </Link>
              </div>
            )}

            {links.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{ className: "text-primary" }}
                className="border-b border-border py-4 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}

            {accountLink && (
              <Link
                to={accountLink.to}
                className="mt-4 bg-navy px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-navy-foreground"
              >
                {accountLink.label}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function MegaColumn({
  title,
  services,
  onNavigate,
}: {
  title: string;
  services: { slug: string; name: string }[];
  onNavigate?: () => void;
}) {
  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <span className="h-[2px] w-6 bg-primary" />
        {title}
      </p>
      <ul className="grid gap-1">
        {services.map((service) => (
          <li key={service.slug}>
            <Link
              to="/services"
              hash={service.slug}
              onClick={onNavigate}
              className="block py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {service.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
