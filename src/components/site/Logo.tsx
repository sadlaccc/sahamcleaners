import { Link } from "@tanstack/react-router";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-10 place-items-center rounded-lg bg-primary text-xl font-bold italic tracking-tighter text-primary-foreground">
        S
      </span>
      <span
        className={`font-display text-xl font-semibold tracking-tight ${
          tone === "light" ? "text-navy-foreground" : "text-foreground"
        }`}
      >
        SAHAM <span className="text-primary">CLEANING</span>
      </span>
    </Link>
  );
}
