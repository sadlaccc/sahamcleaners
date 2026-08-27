export type Service = {
  slug: string;
  name: string;
  description: string;
};

export const commercialServices: Service[] = [
  {
    slug: "commercial-property-cleaning",
    name: "Commercial Property Cleaning",
    description: "Scheduled upkeep for malls, banks, schools and mixed-use buildings.",
  },
  {
    slug: "event-cleanup",
    name: "Event Cleanup",
    description: "Rapid pre- and post-event teams for conferences, weddings and expos.",
  },
  {
    slug: "executive-office-cleaning",
    name: "Executive Office Cleaning",
    description: "Discreet daily maintenance for boardrooms and corporate headquarters.",
  },
  {
    slug: "facade-cleaning",
    name: "Facade Cleaning",
    description: "High-rise glass and cladding washing by safety-certified rope teams.",
  },
  {
    slug: "garbage-collection",
    name: "Garbage Collection",
    description: "Reliable scheduled collection routes for estates and business parks.",
  },
  {
    slug: "waste-management-service",
    name: "Waste Management Service",
    description: "Segregation, hauling and compliant disposal with documentation.",
  },
  {
    slug: "post-construction-cleaning",
    name: "Post Construction Cleaning",
    description: "Debris clearing and HEPA fine-dust extraction before handover.",
  },
  {
    slug: "post-renovation-cleaning",
    name: "Post Renovation Cleaning",
    description: "Paint, adhesive and dust removal so refreshed spaces open spotless.",
  },
  {
    slug: "sanitary-and-washroom-cleaning",
    name: "Sanitary & Washroom Cleaning",
    description: "Hygiene programmes, consumables and sanitary bin servicing.",
  },
];

export const domesticServices: Service[] = [
  {
    slug: "floor-sanding",
    name: "Floor Sanding",
    description: "Dust-controlled sanding that restores timber floors to bare grain.",
  },
  {
    slug: "floor-varnishing",
    name: "Floor Varnishing",
    description: "Durable sealing and finishing coats with a mirror-smooth cure.",
  },
  {
    slug: "fumigation-and-sanitization",
    name: "Fumigation & Sanitization",
    description: "Certified fogging and surface disinfection for homes and offices.",
  },
  {
    slug: "pest-control",
    name: "Pest Control",
    description: "Targeted treatment for roaches, termites, bedbugs and rodents.",
  },
  {
    slug: "garden-and-landscaping",
    name: "Garden & Landscaping",
    description: "Lawn care, hedging, planting and ongoing compound maintenance.",
  },
  {
    slug: "swimming-pool-cleaning",
    name: "Swimming Pool Cleaning & Vacuuming",
    description: "Vacuuming, brushing, backwashing and water chemistry balancing.",
  },
  {
    slug: "area-rug-and-carpet-cleaning",
    name: "Area Rug & Carpet Cleaning",
    description: "Deep extraction cleaning and drying for rugs, carpets and upholstery.",
  },
];
