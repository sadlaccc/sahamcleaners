import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/employees")({
  component: AdminEmployees,
});

function AdminEmployees() {
  return (
    <ResourceManager
      table="employees"
      title="Employees (cleaners)"
      description="Your cleaning crews, their divisions and current status."
      orderBy={{ column: "full_name", ascending: true }}
      defaults={{ division: "commercial", status: "active", role: "Cleaner" }}
      fields={[
        { name: "full_name", label: "Full name", required: true },
        { name: "role", label: "Role / specialisation" },
        { name: "division", label: "Division", type: "select", options: ["commercial", "domestic"] },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "on_leave", "inactive"],
        },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email" },
        { name: "hire_date", label: "Hire date", type: "date" },
        { name: "photo_url", label: "Photo URL" },
      ]}
      columns={[
        { key: "full_name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "division", label: "Division" },
        { key: "status", label: "Status" },
        { key: "phone", label: "Phone" },
      ]}
    />
  );
}
