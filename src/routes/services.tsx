import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ServiceColumn } from "@/components/site/ServiceGrid";
import { commercialServices, domesticServices } from "@/lib/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Cleaning Services in Kenya | Saham Cleaning Services" },
      {
        name: "description",
        content:
          "Full catalogue of Saham services: commercial property, event, executive office, facade, waste, post-construction cleaning plus floor sanding, fumigation, pest control, pools and gardens.",
      },
      { property: "og:title", content: "Our Cleaning Services | Saham Cleaning Services" },
      {
        property: "og:description",
        content: "Nine commercial and seven domestic cleaning services delivered across Kenya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-navy py-20 text-navy-foreground">
        <div className="container-page">
          <span className="eyebrow">What we do</span>
          <h1 className="mt-2 font-display text-5xl font-light">
            Commercial & <span className="font-semibold">domestic services</span>
          </h1>
        </div>
      </div>
      <section className="container-page grid gap-16 py-24 lg:grid-cols-2">
        <ServiceColumn title="Commercial Services" services={commercialServices} />
        <ServiceColumn title="Domestic Services" services={domesticServices} />
      </section>
      <Footer />
    </div>
  );
}
