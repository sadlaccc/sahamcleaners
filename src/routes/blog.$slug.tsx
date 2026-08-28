import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Article | Saham Cleaning Services" },
      {
        name: "description",
        content: "Cleaning guidance and practical advice from the Saham Cleaning Services team.",
      },
      { property: "og:title", content: "Article | Saham Cleaning Services" },
      {
        property: "og:description",
        content: "Cleaning guidance and practical advice from the Saham Cleaning Services team.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["posts", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, excerpt, content, category, published_at")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="container-page max-w-3xl py-24">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {!isLoading && !post && (
          <div>
            <h1 className="font-display text-3xl">Article not found</h1>
            <Link to="/blog" className="mt-4 inline-block text-primary">
              Back to insights
            </Link>
          </div>
        )}
        {post && (
          <>
            <span className="text-xs uppercase tracking-widest text-primary">{post.category}</span>
            <h1 className="mt-3 font-display text-4xl">{post.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
            <div className="mt-8 whitespace-pre-line leading-relaxed">{post.content}</div>
            <Link to="/blog" className="mt-12 inline-block text-primary">
              ← Back to insights
            </Link>
          </>
        )}
      </article>
      <Footer />
    </div>
  );
}
