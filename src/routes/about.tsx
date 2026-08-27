import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Saham Cleaning Services | Our Team & Standards" },
      {
        name: "description",
        content:
          "Meet the Saham Cleaning Services team — trained commercial and domestic cleaning specialists working across Nairobi and beyond.",
      },
      { property: "og:title", content: "About Saham Cleaning Services" },
      {
        property: "og:description",
        content: "Our standards, our divisions and the cleaners who deliver them.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: employees } = useQuery({
    queryKey: ["employees", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("id, full_name, role, division")
        .eq("status", "active")
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-navy py-20 text-navy-foreground">
        <div className="container-page">
          <span className="eyebrow">Who we are</span>
          <h1 className="mt-2 max-w-3xl font-display text-5xl font-light">
            A cleaning company built on <span className="font-semibold">accountability</span>
          </h1>
        </div>
      </div>

      <section className="container-page grid gap-12 py-24 lg:grid-cols-2">
        <div className="space-y-5 text-muted-foreground">
          <p>
            Saham Cleaning Services provides professional hygiene solutions to businesses, estates
            and private homes. We run two dedicated divisions — commercial and domestic — so every
            job is staffed with the right people and the right equipment.
          </p>
          <p>
            Every assignment is supervised, every cleaner is vetted and trained, and every client
            receives a documented scope of work. From high-rise facades to freshly sanded hardwood
            floors, the standard is the same: spotless, on time, without disruption.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "16", label: "Specialist services" },
            { value: "2", label: "Operating divisions" },
            { value: "24h", label: "Quote turnaround" },
            { value: "100%", label: "Vetted, trained crews" },
          ].map((stat) => (
            <div key={stat.label} className="border border-border bg-surface/60 p-6">
              <p className="font-display text-3xl text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <span className="eyebrow">Our people</span>
          <h2 className="mt-2 mb-12 font-display text-4xl">The cleaning team</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(employees ?? []).map((employee) => (
              <div key={employee.id} className="border border-border bg-card p-6">
                <p className="font-semibold">{employee.full_name}</p>
                <p className="text-sm text-muted-foreground">{employee.role}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-primary">
                  {employee.division} division
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
