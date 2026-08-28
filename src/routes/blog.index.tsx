import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Cleaning Insights & Guides | Saham Cleaning Services" },
      {
        name: "description",
        content:
          "Practical cleaning guides from the Saham team: office cleaning schedules, post-construction cleanup, floor care, fumigation and more.",
      },
      { property: "og:title", content: "Cleaning Insights | Saham Cleaning Services" },
      {
        property: "og:description",
        content: "Advice and guides from Kenya's commercial and domestic cleaning specialists.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, category, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-navy py-20 text-navy-foreground">
        <div className="container-page">
          <span className="eyebrow">Insights</span>
          <h1 className="mt-2 font-display text-5xl font-light">
            Cleaning <span className="font-semibold">knowledge</span>
          </h1>
        </div>
      </div>
      <section className="container-page py-24">
        {isLoading && <p className="text-muted-foreground">Loading articles…</p>}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(posts ?? []).map((post) => (
            <Link
              key={post.id}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="border border-border bg-surface/60 p-6 transition-colors hover:border-primary/30"
            >
              <span className="text-xs uppercase tracking-widest text-primary">
                {post.category}
              </span>
              <h2 className="mt-3 font-display text-xl">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
        {!isLoading && (posts ?? []).length === 0 && (
          <p className="text-muted-foreground">No articles published yet.</p>
        )}
      </section>
      <Footer />
    </div>
  );
}
