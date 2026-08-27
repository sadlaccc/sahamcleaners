import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-navy px-6 py-16 text-navy-foreground">
      <div className="container-page flex flex-col items-start justify-between gap-12 md:flex-row">
        <div>
          <div className="mb-6 flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded bg-primary font-bold italic tracking-tighter text-primary-foreground">
              S
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">SAHAM</span>
          </div>
          <p className="max-w-xs text-sm opacity-70">
            Setting the benchmark in premium cleaning solutions for commercial and domestic clients
            across Kenya.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-16">
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest">Contact</h5>
            <ul className="space-y-2 text-sm opacity-70">
              <li>service@saham.co.ke</li>
              <li>+254 700 000 000</li>
              <li>Nairobi, Kenya</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest">Company</h5>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <Link to="/services" className="hover:opacity-100">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:opacity-100">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:opacity-100">
                  Insights
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container-page mt-12 border-t border-navy-foreground/10 pt-12 text-xs opacity-50">
        &copy; {new Date().getFullYear()} Saham Cleaning Services. All rights reserved.
      </div>
    </footer>
  );
}
