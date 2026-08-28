import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/clients")({
  component: AdminClients,
});

function AdminClients() {
  return (
    <ResourceManager
      table="clients"
      title="Clients"
      description="Companies and estates Saham serves, shown on the homepage."
      orderBy={{ column: "name", ascending: true }}
      defaults={{ featured: true }}
      fields={[
        { name: "name", label: "Client name", required: true },
        { name: "industry", label: "Industry" },
        { name: "location", label: "Location" },
        { name: "website", label: "Website" },
        { name: "logo_url", label: "Logo URL" },
        { name: "featured", label: "Show on homepage", type: "checkbox" },
      ]}
      columns={[
        { key: "name", label: "Client" },
        { key: "industry", label: "Industry" },
        { key: "location", label: "Location" },
        { key: "featured", label: "Featured" },
      ]}
    />
  );
}
