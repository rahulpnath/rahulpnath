import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import { mdxComponents } from '@/mdx-components';
import TableOfContents from '@/components/TableOfContents';

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
      {/* Header Navigation */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <a href="/" className="text-xl font-bold text-gray-900 hover:text-[#823EB7] transition-colors">
                Rahul Nath
              </a>
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <a href="/blog" className="text-gray-600 hover:text-[#823EB7] transition-colors">Blog</a>
                <a href="/about" className="text-gray-600 hover:text-[#823EB7] transition-colors">About</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Article */}
          <article className="flex-1 max-w-4xl">
            <header className="mb-12">
              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                {post.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {post.author.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                  </div>
                </div>
                
                <span className="text-gray-400">•</span>
                
                <time dateTime={post.publishedAt} className="text-gray-600">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                
                {post.readingTime && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{post.readingTime}</span>
                  </>
                )}
              </div>

              {/* Description */}
              {post.description && (
                <p className="text-xl text-gray-700 mb-8 leading-relaxed font-light">
                  {post.description}
                </p>
              )}

              {/* Cover Image */}
              {post.coverImage && (
                <div className="relative mb-8">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg border border-gray-200"
                    sizes="(min-width: 1024px) 800px, 100vw"
                    priority
                  />
                </div>
              )}
            </header>

            {/* Article Content - Clean, professional styling */}
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed
              prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-16 prose-h1:leading-tight
              prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-100
              prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:font-semibold
              prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-8 prose-h4:font-semibold
              prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
              prose-a:text-[#823EB7] prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-colors
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-em:text-gray-700 prose-em:italic
              prose-code:text-[#823EB7] prose-code:bg-gray-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:border-0 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:p-6 prose-pre:shadow-lg prose-pre:my-8
              prose-blockquote:border-l-4 prose-blockquote:border-[#823EB7] prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg prose-blockquote:my-8
              prose-ul:text-gray-800 prose-ul:my-6 prose-ol:text-gray-800 prose-ol:my-6
              prose-li:text-gray-800 prose-li:mb-2 prose-li:leading-relaxed
              prose-table:border-collapse prose-table:border prose-table:border-gray-200 prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-sm prose-table:my-8
              prose-th:border prose-th:border-gray-200 prose-th:bg-gray-50 prose-th:px-6 prose-th:py-4 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
              prose-td:border prose-td:border-gray-200 prose-td:px-6 prose-td:py-4 prose-td:text-gray-800
              prose-img:rounded-xl prose-img:border prose-img:border-gray-100 prose-img:shadow-sm prose-img:my-8
              prose-hr:border-gray-100 prose-hr:my-12
            ">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <a
                      key={tag}
                      href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-purple-50 text-[#823EB7] hover:bg-purple-100 hover:text-[#6a2c96] transition-all duration-200 border border-purple-100 hover:border-purple-200"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <footer className="mt-16 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#823EB7] transition-colors group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to All Articles
                </a>
                
                <div className="text-sm text-gray-500">
                  {post.readingTime && `${post.readingTime} • `}
                  Published {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </footer>
          </article>

          {/* Sidebar with Table of Contents */}
          <aside className="lg:w-80 lg:flex-shrink-0">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </div>
    </div>
  );
}