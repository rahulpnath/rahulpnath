import AuthorCard from "@/components/AuthorCard";
import dynamic from "next/dynamic";
import {
  getAllPostsMetadata,
  getPostBySlug,
  getPostMetadata,
} from "@/lib/posts";
import { mdxComponents } from "@/mdx-components";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { notFound } from "next/navigation";

const TableOfContents = dynamic(() => import("@/components/TableOfContents"), {
  loading: () => (
    <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
  ),
});

interface BlogPostPageProps {
  readonly params: Promise<{
    slug: string;
  }>;
}

// ISR: Only generate static params for most recent posts to reduce build time
// Other posts will be generated on-demand with revalidation
export async function generateStaticParams() {
  const posts = await getAllPostsMetadata(); // Use metadata only - much faster

  // Only pre-generate the 20 most recent posts
  // Other posts will be generated on first request (ISR)
  return posts.slice(0, 20).map((post) => ({
    slug: post.slug,
  }));
}

// Enable ISR for better performance and reduced HTML bloat
export const dynamicParams = true; // Allow dynamic params for posts not in generateStaticParams
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Use metadata-only function to avoid loading full content for SEO
  const post = await getPostMetadata(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const publishedTime = new Date(post.publishedAt).toISOString();
  const modifiedTime = publishedTime;
  const url = `https://www.rahulpnath.com/blog/${slug}`;
  const imageUrl = post.coverImage || "/rahul-logo.png";

  return {
    title: post.title,
    description:
      post.description ||
      `Read about ${post.title} by Rahul Nath. Learn about web development, AWS, .NET, and software engineering best practices.`,
    keywords: post.tags || [
      "Web Development",
      "Programming",
      "Software Engineering",
    ],
    authors: [{ name: "Rahul Nath", url: "https://www.rahulpnath.com" }],
    creator: "Rahul Nath",
    publisher: "Rahul Nath",
    openGraph: {
      title: post.title,
      description: post.description || `Read about ${post.title} by Rahul Nath`,
      type: "article",
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime,
      modifiedTime,
      authors: ["Rahul Nath"],
      section: "Technology",
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || `Read about ${post.title} by Rahul Nath`,
      creator: "@rahulpnath",
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    other: {
      "article:author": "Rahul Nath",
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      "article:section": "Technology",
      "article:tag": post.tags?.join(", ") || "",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Load full content only when rendering the actual page
  // This keeps the content out of metadata generation
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Create a smaller, optimized JSON-LD object
  // Move non-essential structured data to reduce HTML size
  const publishedTime = new Date(post.publishedAt).toISOString();
  const url = `https://www.rahulpnath.com/blog/${slug}`;
  const imageUrl = post.coverImage || "/rahul-logo.png";

  // Minimal JSON-LD for essential SEO only
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    publisher: {
      "@type": "Organization",
      name: "Rahul Nath",
      url: "https://www.rahulpnath.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.rahulpnath.com/content/images/size/w256h256/2022/10/logo-512x512.png",
        width: 60,
        height: 60,
      },
    },
    author: {
      "@type": "Person",
      name: "Rahul Pulikkot Nath",
      image: {
        "@type": "ImageObject",
        url: "https://www.gravatar.com/avatar/52158e6893b81b7fbcf1af52c6a5a81d?s=250&r=x&d=mp",
        width: 250,
        height: 250,
      },
      url: "https://www.rahulpnath.com/",
      sameAs: [
        "https://www.youtube.com/user/rahulnathp",
        "https://www.facebook.com/rahulpnath/",
        "https://x.com/rahulpnath",
        "https://github.com/rahulpnath",
        "https://www.linkedin.com/in/rahulpnath/",
        "https://www.instagram.com/rahulpnath",
      ],
    },
    headline: post.title,
    url: url,
    datePublished: publishedTime,
    dateModified: publishedTime,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 675,
    },
    keywords: post.tags?.join(", ") || "",
    description: post.description,
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-theme-bg text-theme-text">
        {/* Skip to main content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium z-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        >
          Skip to main content
        </a>

        {/* Main Layout with Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <main
              id="main-content"
              className="flex-1 lg:max-w-4xl"
              role="main"
              aria-labelledby="article-title"
            >
              <article
                className="
              prose prose-lg prose-slate max-w-4xl font-sans
              leading-relaxed

              /* Headings - Use Serif for elegant typography */
              prose-headings:font-serif prose-headings:font-medium
              prose-headings:tracking-tight prose-headings:text-theme-text-high-contrast
              prose-h1:text-4xl prose-h1:mt-0 prose-h1:mb-6 prose-h1:leading-tight prose-h1:font-semibold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:leading-tight prose-h2:font-medium
              prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:leading-tight prose-h3:font-medium
              prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3 prose-h4:leading-tight prose-h4:font-medium

              /* Paragraphs - Use Inter with medium weight */
              prose-p:text-lg prose-p:leading-relaxed prose-p:text-theme-text prose-p:font-medium
              [&_p]:text-lg [&_p]:my-6 [&_p]:font-sans

              /* Links */
              prose-a:text-[#823EB7] prose-a:no-underline prose-a:transition-all
              prose-a:font-medium

              /* Lists */
              prose-ul:list-disc prose-ol:list-decimal prose-ul:my-6 prose-ol:my-6 prose-ul:ml-6 prose-ol:ml-6
              prose-li:mb-2 prose-li:text-lg prose-li:leading-relaxed prose-li:list-item

              /* Blockquotes */
              prose-blockquote:border-l-4 prose-blockquote:border-[#823EB7] prose-blockquote:pl-6
              prose-blockquote:italic prose-blockquote:text-theme-text-secondary prose-blockquote:my-8
              prose-blockquote:text-xl prose-blockquote:leading-relaxed

              /* Inline code */
              prose-code:bg-theme-bg-muted prose-code:px-2 prose-code:py-1
              prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-code:font-mono prose-code:text-theme-text

              /* Code blocks */
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8
              prose-pre:font-mono prose-pre:text-sm prose-pre:leading-relaxed

              /* Images */
              prose-img:rounded-xl prose-img:my-10 prose-img:shadow-lg

              /* Tables */
              prose-table:border-collapse prose-table:border prose-table:border-gray-200 prose-table:rounded-lg prose-table:my-8
              prose-th:border prose-th:border-gray-200 prose-th:bg-gray-50 prose-th:px-6 prose-th:py-4 prose-th:text-left prose-th:font-semibold prose-th:font-clash
              prose-td:border prose-td:border-gray-200 prose-td:px-6 prose-td:py-4

              /* HR */
              prose-hr:my-12 prose-hr:border-gray-200

              /* Strong/Bold */
              prose-strong:font-semibold prose-strong:text-theme-text-high-contrast
            "
              >
                {/* Article Header */}
                <header className="mb-12 not-prose">
                  <h1
                    id="article-title"
                    className="font-serif text-5xl font-semibold text-theme-text-high-contrast mb-6 leading-tight tracking-tight"
                  >
                    {post.title}
                  </h1>

                  <div className="flex items-center gap-6 text-sm text-theme-text-secondary mb-8 font-medium">
                    <time
                      dateTime={post.publishedAt}
                      aria-label={`Published on ${new Date(
                        post.publishedAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`}
                    >
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>

                    {post.readingTime && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span
                          aria-label={`Estimated reading time: ${post.readingTime}`}
                        >
                          {post.readingTime}
                        </span>
                      </>
                    )}
                  </div>

                  {post.description && (
                    <p className="font-sans text-xl text-theme-text-secondary mb-8 leading-relaxed max-w-3xl font-medium">
                      {post.description}
                    </p>
                  )}

                </header>

                {/* Article Content - Rendered server-side, not serialized in __NEXT_DATA__ */}
                <div>
                  <MDXRemote source={post.content} components={mdxComponents} />
                </div>
                {/* Tags Section - Minimal */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-20 pt-12 border-t border-theme-border-light not-prose">
                    <div
                      className="flex flex-wrap gap-3"
                      role="list"
                      aria-label="Article tags"
                    >
                      {post.tags.map((tag) => (
                        <a
                          key={tag}
                          href={`/blog/tag/${tag
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-theme-bg-muted text-theme-text-secondary hover:bg-primary-500 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-theme-bg"
                          role="listitem"
                          aria-label={`View articles tagged as ${tag}`}
                        >
                          {tag}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Navigation - Clean */}
                <footer className="mt-20 pt-12 border-t border-theme-border-light not-prose">
                  <nav aria-label="Blog navigation">
                    <a
                      href="/blog"
                      className="inline-flex items-center gap-2 text-sm font-medium text-theme-text-secondary hover:text-primary-500 transition-colors group focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-theme-bg rounded-md"
                      aria-label="Return to blog article listing"
                    >
                      <svg
                        className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to Blog
                    </a>
                  </nav>
                </footer>
              </article>
            </main>

            {/* Sidebar with Table of Contents */}
            <aside
              className="hidden lg:block lg:w-80 lg:flex-shrink-0"
              role="complementary"
              aria-labelledby="toc-heading"
            >
              <div className="sticky top-20">
                <h2 id="toc-heading" className="sr-only">
                  Table of contents
                </h2>
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>

          {/* Author Card - Spans full width including TOC area */}
          <section className="mt-12" aria-labelledby="author-info">
            <h2 id="author-info" className="sr-only">
              About the author
            </h2>
            <AuthorCard author={post.author} />
          </section>
        </div>
      </div>
    </>
  );
}
