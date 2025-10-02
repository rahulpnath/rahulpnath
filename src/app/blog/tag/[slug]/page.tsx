import BlogWithPagination from "@/app/blog/BlogWithPagination";
import { getAllPostsMetadata } from "@/lib/posts";
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
  const allPosts = await getAllPostsMetadata();
  const taggedPosts = allPosts.filter((post) =>
    post.tags?.some(
      (tag) => tag.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
    )
  );
  const tagName = slug.replace(/-/g, " ");
  const postsCount = taggedPosts.length;
  const url = `https://www.rahulpnath.com/blog/tag/${slug}`;

  return {
    title: `Posts tagged with "${tagName}" | Rahul Nath`,
    description: `Discover ${postsCount} blog post${postsCount !== 1 ? 's' : ''} about ${tagName}. Learn about web development, AWS, software engineering, and modern technologies.`,
    keywords: [tagName, 'blog posts', 'tutorials', 'web development', 'programming'],
    openGraph: {
      title: `Posts tagged with "${tagName}" | Rahul Nath`,
      description: `Discover ${postsCount} blog post${postsCount !== 1 ? 's' : ''} about ${tagName}. Learn about web development, AWS, software engineering, and modern technologies.`,
      type: 'website',
      url,
      images: [
        {
          url: '/rahul-logo.png',
          width: 1200,
          height: 630,
          alt: `${tagName} articles by Rahul Nath`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Posts tagged with "${tagName}" | Rahul Nath`,
      description: `Discover ${postsCount} blog post${postsCount !== 1 ? 's' : ''} about ${tagName}. Learn about web development, AWS, software engineering, and modern technologies.`,
      creator: '@rahulpnath',
      images: ['/rahul-logo.png'],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const allPosts = await getAllPostsMetadata();

  // Filter posts by tag
  const taggedPosts = allPosts.filter((post) =>
    post.tags?.some(
      (tag) => tag.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
    )
  );

  const tagName = slug.replace(/-/g, " ");

  return (
    <div className="min-h-screen blog-container">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium z-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      <main 
        id="main-content" 
        className="min-h-[calc(100vh-var(--header-height))]"
        role="main" 
        aria-labelledby="page-title"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <header className="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8">
            <div className="lg:col-span-10">
              <div className="relative border-b border-theme-border-light py-8">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <h1 
                        id="page-title" 
                        className="text-3xl sm:text-4xl font-bold text-theme-text-high-contrast tracking-tight capitalize"
                      >
                        Posts tagged with "{tagName}"
                      </h1>
                    </div>
                    <p className="mt-4 text-lg text-theme-text-secondary">
                      Found {taggedPosts.length} post{taggedPosts.length !== 1 ? "s" : ""} with this tag.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>

        <section aria-labelledby="tagged-posts-heading">
          <h2 id="tagged-posts-heading" className="sr-only">Articles tagged with {tagName}</h2>
          <BlogWithPagination posts={taggedPosts} showHeader={false} />
        </section>
      </main>
    </div>
  );
}

// Generate static params for all tags
export async function generateStaticParams() {
  const allPosts = await getAllPostsMetadata();
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
