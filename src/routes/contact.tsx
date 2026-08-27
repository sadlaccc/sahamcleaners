import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { commercialServices, domesticServices } from "@/lib/services";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Request a Cleaning Quote | Saham Cleaning Services" },
      {
        name: "description",
        content:
          "Tell us about your site and receive a detailed cleaning quote from Saham Cleaning Services within 24 hours. Nairobi, Kenya.",
      },
      { property: "og:title", content: "Contact Saham Cleaning Services" },
      {
        property: "og:description",
        content: "Book a free site assessment for commercial or domestic cleaning in Kenya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-navy py-20 text-navy-foreground">
        <div className="container-page">
          <span className="eyebrow">Get in touch</span>
          <h1 className="mt-2 font-display text-5xl font-light">
            Request a <span className="font-semibold">quote</span>
          </h1>
        </div>
      </div>

      <section className="container-page grid gap-16 py-24 lg:grid-cols-[1.2fr_1fr]">
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
            toast.success("Request received", {
              description: "Our team will respond within 24 hours.",
            });
            (event.target as HTMLFormElement).reset();
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Full name
              <input
                required
                name="name"
                className="border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Phone
              <input
                required
                name="phone"
                className="border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input
              required
              type="email"
              name="email"
              className="border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Service needed
            <select
              name="service"
              className="border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <optgroup label="Commercial">
                {commercialServices.map((service) => (
                  <option key={service.slug}>{service.name}</option>
                ))}
              </optgroup>
              <optgroup label="Domestic">
                {domesticServices.map((service) => (
                  <option key={service.slug}>{service.name}</option>
                ))}
              </optgroup>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Tell us about the site
            <textarea
              name="details"
              rows={5}
              className="border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            className="justify-self-start rounded-sm bg-primary px-8 py-4 font-semibold text-primary-foreground"
          >
            Send request
          </button>
          {sent && (
            <p className="text-sm text-primary">
              Thanks — your request has been noted. We will call you back shortly.
            </p>
          )}
        </form>

        <div className="space-y-6 border border-border bg-surface/60 p-8 text-sm">
          <div>
            <h2 className="font-display text-xl">Head office</h2>
            <p className="mt-2 text-muted-foreground">Westlands, Nairobi, Kenya</p>
          </div>
          <div>
            <h2 className="font-display text-xl">Call us</h2>
            <p className="mt-2 text-muted-foreground">+254 700 000 000</p>
          </div>
          <div>
            <h2 className="font-display text-xl">Email</h2>
            <p className="mt-2 text-muted-foreground">service@saham.co.ke</p>
          </div>
          <div>
            <h2 className="font-display text-xl">Hours</h2>
            <p className="mt-2 text-muted-foreground">
              Mon–Sat 7:00–19:00 · Emergency callouts on request
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
