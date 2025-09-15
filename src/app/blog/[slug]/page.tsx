import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import { mdxComponents } from '@/mdx-components';

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
    <div className="min-h-screen bg-white text-gray-900 font-[Inter,sans-serif]">
      {/* Minimal Header Navigation */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="text-lg font-semibold text-gray-900 hover:text-[#823EB7] transition-colors">
              Rahul Nath
            </a>
            <div className="flex items-center space-x-6 text-sm">
              <a href="/blog" className="text-gray-600 hover:text-[#823EB7] transition-colors">Blog</a>
              <a href="/about" className="text-gray-600 hover:text-[#823EB7] transition-colors">About</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Clean Professional Blog Layout */}
      <main className="flex justify-center bg-white py-12 px-4">
        <article className="
          max-w-3xl w-full 
          prose prose-lg prose-slate
          leading-relaxed

          /* Headings */
          prose-headings:font-bold 
          prose-headings:tracking-tight
          prose-h1:text-4xl prose-h1:mt-0 prose-h1:mb-6
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3

          /* Paragraphs */
          prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-800
          [&_p]:text-lg [&_p]:my-[1em]

          /* Links */
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:transition-all

          /* Lists */
          prose-ul:list-disc prose-ol:list-decimal
          prose-li:mb-2

          /* Blockquotes */
          prose-blockquote:border-l-4 prose-blockquote:pl-4
          prose-blockquote:italic prose-blockquote:text-gray-600

          /* Inline code */
          prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5
          prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none

          /* Code blocks */
          prose-pre:bg-gray-900 prose-pre:text-gray-100
          prose-pre:rounded-xl prose-pre:p-4

          /* Images */
          prose-img:rounded-xl prose-img:my-8

          /* Tables */
          prose-table:border-collapse prose-table:border prose-table:border-gray-200 prose-table:rounded-lg
          prose-th:border prose-th:border-gray-200 prose-th:bg-gray-50 prose-th:px-6 prose-th:py-4 prose-th:text-left prose-th:font-semibold
          prose-td:border prose-td:border-gray-200 prose-td:px-6 prose-td:py-4

          /* HR */
          prose-hr:my-12 prose-hr:border-gray-200
        ">
          {/* Article Header */}
          <header className="mb-12 not-prose">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
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
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
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
    </div>
  );
}