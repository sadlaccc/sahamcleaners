import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HeroSlider } from "@/components/site/HeroSlider";
import { ServiceColumn } from "@/components/site/ServiceGrid";
import { commercialServices, domesticServices } from "@/lib/services";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saham Cleaning Services | Commercial & Domestic Cleaning in Kenya" },
      {
        name: "description",
        content:
          "Saham Cleaning Services delivers commercial property, facade, post-construction and domestic cleaning, fumigation, pool and landscaping care across Kenya.",
      },
      { property: "og:title", content: "Saham Cleaning Services | Cleaning Experts in Kenya" },
      {
        property: "og:description",
        content:
          "Commercial and domestic cleaning specialists — offices, facades, waste management, floor sanding, fumigation, pools and gardens.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: clients } = useQuery({
    queryKey: ["clients", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, industry")
        .eq("featured", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSlider />

      <section className="container-page py-24">
        <div className="mb-16">
          <span className="eyebrow">Our Expertise</span>
          <h2 className="mt-2 font-display text-4xl">Service Catalogue</h2>
        </div>
        <div className="grid gap-16 lg:grid-cols-2">
          <ServiceColumn title="Commercial Solutions" services={commercialServices.slice(0, 4)} />
          <ServiceColumn title="Domestic Services" services={domesticServices.slice(0, 4)} />
        </div>
        <div className="mt-12">
          <Link to="/services" className="font-medium text-primary">
            See all 16 services →
          </Link>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="container-page">
          <div className="mb-12">
            <span className="eyebrow">Trusted By</span>
            <h2 className="mt-2 font-display text-4xl">Clients across East Africa</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(clients ?? []).map((client) => (
              <div key={client.id} className="border border-border bg-card p-6">
                <p className="font-semibold">{client.name}</p>
                <p className="text-sm text-muted-foreground">{client.industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-24">
        <div className="flex flex-col items-start justify-between gap-8 bg-navy p-12 text-navy-foreground md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl">Ready for a spotless space?</h2>
            <p className="mt-3 text-navy-foreground/70">
              Book a free site assessment and receive a detailed quote within 24 hours.
            </p>
          </div>
          <Link
            to="/contact"
            className="rounded-sm bg-primary px-8 py-4 font-semibold text-primary-foreground"
          >
            Request a quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
