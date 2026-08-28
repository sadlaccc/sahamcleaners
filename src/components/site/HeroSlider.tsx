import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    lead: "Pristine Spaces,",
    emphasis: "Professional Care.",
    copy: "Elevating the standards of cleanliness for commercial estates and private residences across Kenya.",
  },
  {
    image: hero2,
    lead: "Facade Cleaning,",
    emphasis: "Safely Executed.",
    copy: "Rope-access certified crews restoring glass and cladding on Nairobi's tallest buildings.",
  },
  {
    image: hero3,
    lead: "Homes Restored,",
    emphasis: "Down to the Grain.",
    copy: "Floor sanding, varnishing, pool care and fumigation handled by specialists you can trust.",
  },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const current = slides[active] as (typeof slides)[number];

  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-navy">
      {slides.map((slide, index) => (
        <img
          key={slide.image}
          src={slide.image}
          alt={`${slide.lead} ${slide.emphasis}`}
          width={1920}
          height={1088}
          loading={index === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
            index === active ? "opacity-60" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 flex items-center">
        <div className="container-page w-full">
          <div className="max-w-2xl">
            <h1 className="mb-6 font-display text-5xl font-light leading-tight text-navy-foreground md:text-7xl">
              {current.lead}
              <br />
              <span className="font-semibold">{current.emphasis}</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg text-navy-foreground/75">{current.copy}</p>
            <div className="flex gap-4">
              <Link
                to="/contact"
                className="rounded-sm bg-primary px-8 py-4 font-semibold text-primary-foreground"
              >
                Book a Service
              </Link>
              <Link
                to="/services"
                className="border border-navy-foreground/30 px-8 py-4 font-medium text-navy-foreground transition-colors hover:bg-navy-foreground/10"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 flex gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-1 w-12 transition-colors ${
              index === active ? "bg-primary" : "bg-navy-foreground/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
