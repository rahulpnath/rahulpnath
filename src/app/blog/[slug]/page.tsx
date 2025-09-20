import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import { mdxComponents } from '@/mdx-components';
import TableOfContents from '@/components/TableOfContents';
import AuthorCard from '@/components/AuthorCard';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Main Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 lg:max-w-4xl">
            <article className="
              prose prose-lg prose-slate max-w-none font-sans
              leading-relaxed

              /* Headings - Use Serif for elegant typography */
              prose-headings:font-serif prose-headings:font-medium 
              prose-headings:tracking-tight prose-headings:text-gray-900
              prose-h1:text-4xl prose-h1:mt-0 prose-h1:mb-6 prose-h1:leading-tight prose-h1:font-semibold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:leading-tight prose-h2:font-medium
              prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:leading-tight prose-h3:font-medium
              prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3 prose-h4:leading-tight prose-h4:font-medium

              /* Paragraphs - Use Inter with medium weight */
              prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-800 prose-p:font-medium
              [&_p]:text-lg [&_p]:my-6 [&_p]:font-sans

              /* Links */
              prose-a:text-[#823EB7] prose-a:no-underline prose-a:transition-all
              prose-a:font-medium

              /* Lists */
              prose-ul:list-disc prose-ol:list-decimal prose-ul:my-6 prose-ol:my-6 prose-ul:ml-6 prose-ol:ml-6
              prose-li:mb-2 prose-li:text-lg prose-li:leading-relaxed prose-li:list-item

              /* Blockquotes */
              prose-blockquote:border-l-4 prose-blockquote:border-[#823EB7] prose-blockquote:pl-6
              prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-8
              prose-blockquote:text-xl prose-blockquote:leading-relaxed

              /* Inline code */
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1
              prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-code:font-mono prose-code:text-gray-800

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
              prose-strong:font-semibold prose-strong:text-gray-900
            ">
          {/* Article Header */}
          <header className="mb-12 not-prose">
            <h1 className="font-serif text-5xl font-semibold text-gray-900 mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 font-medium">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              
              {post.readingTime && (
                <>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </>
              )}
            </div>

            {post.description && (
              <p className="font-sans text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl font-medium">
                {post.description}
              </p>
            )}

            {post.coverImage && (
              <div className="my-8">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-auto rounded-xl"
                  sizes="800px"
                  priority
                />
              </div>
            )}
          </header>

          {/* Article Content */}
          <MDXRemote source={post.content} components={mdxComponents} />
          {/* Tags Section - Minimal */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-100 not-prose">
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-[#823EB7] hover:text-white transition-all duration-200"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          )}

              {/* Footer Navigation - Clean */}
              <footer className="mt-20 pt-12 border-t border-gray-100 not-prose">
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#823EB7] transition-colors group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Blog
                </a>
              </footer>
            </article>
          </main>

          {/* Sidebar with Table of Contents */}
          <aside className="lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-20">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>

        {/* Author Card - Spans full width including TOC area */}
        <div className="mt-12">
          <AuthorCard author={post.author} />
        </div>
      </div>
    </div>
  );
}