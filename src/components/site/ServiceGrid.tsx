import type { Service } from "@/lib/services";

export function ServiceColumn({ title, services }: { title: string; services: Service[] }) {
  return (
    <div>
      <h3 className="mb-8 flex items-center gap-3 font-display text-2xl font-semibold">
        <span className="h-[2px] w-8 bg-primary" /> {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service, index) => (
          <div
            key={service.slug}
            id={service.slug}
            className="scroll-mt-28 border border-border bg-surface/60 p-6 transition-colors hover:border-primary/30"
          >
            <div className="mb-4 font-bold italic text-primary">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h4 className="mb-2 font-semibold">{service.name}</h4>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
