import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/posts")({
  component: AdminPosts,
});

function AdminPosts() {
  return (
    <ResourceManager
      table="posts"
      title="Posts"
      description="Write and publish articles for the Insights section."
      orderBy={{ column: "created_at" }}
      defaults={{ category: "Commercial", published: false }}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug (url)", required: true },
        { name: "category", label: "Category", type: "select", options: ["Commercial", "Domestic", "General"] },
        { name: "cover_image_url", label: "Cover image URL" },
        { name: "excerpt", label: "Excerpt" },
        { name: "published", label: "Published", type: "checkbox" },
        { name: "content", label: "Content", type: "textarea" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "published", label: "Published" },
        { key: "created_at", label: "Created" },
      ]}
    />
  );
}
