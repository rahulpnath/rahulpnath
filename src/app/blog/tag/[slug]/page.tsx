import BlogWithPagination from "@/app/blog/BlogWithPagination";
import { getAllPosts } from "@/lib/posts";
import { Metadata } from "next";

interface TagPageProps {
  readonly params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tagName = slug.replace(/-/g, " ");

  return {
    title: `Posts tagged with "${tagName}" | Rahul Nath`,
    description: `All blog posts tagged with ${tagName}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const allPosts = await getAllPosts();

  // Filter posts by tag
  const taggedPosts = allPosts.filter((post) =>
    post.tags?.some(
      (tag) => tag.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
    )
  );

  const tagName = slug.replace(/-/g, " ");

  return (
    <div className="min-h-screen blog-container">
      <main className="min-h-[calc(100vh-var(--header-height))]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8">
            <div className="lg:col-span-10">
              <div className="relative border-b border-theme-border-light py-8">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <h1 className="text-3xl sm:text-4xl font-bold text-theme-text-high-contrast tracking-tight capitalize">
                        Posts tagged with "{tagName}"
                      </h1>
                    </div>
                    <div className="mt-4 text-lg text-theme-text-secondary">
                      Found {taggedPosts.length} post{taggedPosts.length !== 1 ? "s" : ""} with this tag.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BlogWithPagination posts={taggedPosts} showHeader={false} />
      </main>
    </div>
  );
}

// Generate static params for all tags
export async function generateStaticParams() {
  const allPosts = await getAllPosts();
  const tags = new Set<string>();

  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tags.add(tag.toLowerCase().replace(/\s+/g, "-"));
    });
  });

  return Array.from(tags).map((tag) => ({
    slug: tag,
  }));
}
