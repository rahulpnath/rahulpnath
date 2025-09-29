import { getPostBySlug } from "@/lib/posts";
import { mdxComponents } from "@/mdx-components";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'About | Rahul Nath',
  description: 'Learn about Rahul Nath - Developer, Blogger, YouTuber, and Teacher. Discover my journey in web development, AWS, .NET, and software engineering.',
  keywords: ['Rahul Nath', 'About', 'Developer', 'AWS', '.NET', 'Software Engineer', 'Biography'],
  openGraph: {
    title: 'About | Rahul Nath',
    description: 'Learn about Rahul Nath - Developer, Blogger, YouTuber, and Teacher. Discover my journey in web development, AWS, .NET, and software engineering.',
    type: 'profile',
    url: 'https://www.rahulpnath.com/about',
    images: [
      {
        url: '/rahul-logo.png',
        width: 1200,
        height: 630,
        alt: 'About Rahul Nath',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Rahul Nath',
    description: 'Learn about Rahul Nath - Developer, Blogger, YouTuber, and Teacher. Discover my journey in web development, AWS, .NET, and software engineering.',
    creator: '@rahulpnath',
    images: ['/rahul-logo.png'],
  },
  alternates: {
    canonical: 'https://www.rahulpnath.com/about',
  },
};

export default async function AboutPage() {
  const aboutPost = await getPostBySlug("about");

  if (!aboutPost) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-transparent text-theme-text">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main>
          <article
            className="
            prose prose-lg prose-slate max-w-none font-sans
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
            prose-a:text-purple-600 prose-a:no-underline prose-a:transition-all
            prose-a:font-medium hover:prose-a:text-purple-700

            /* Lists */
            prose-ul:list-disc prose-ol:list-decimal prose-ul:my-6 prose-ol:my-6 prose-ul:ml-6 prose-ol:ml-6
            prose-li:mb-2 prose-li:text-lg prose-li:leading-relaxed prose-li:list-item

            /* Blockquotes */
            prose-blockquote:border-l-4 prose-blockquote:border-purple-600 prose-blockquote:pl-6
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
            prose-th:border prose-th:border-gray-200 prose-th:bg-gray-50 prose-th:px-6 prose-th:py-4 prose-th:text-left prose-th:font-semibold
            prose-td:border prose-td:border-gray-200 prose-td:px-6 prose-td:py-4

            /* HR */
            prose-hr:my-12 prose-hr:border-gray-200

            /* Strong/Bold */
            prose-strong:font-semibold prose-strong:text-gray-900
          "
          >
            {/* Article Header */}
            <header className="mb-12 not-prose">
              <h1 className="font-serif text-5xl font-semibold text-theme-text-high-contrast mb-6 leading-tight tracking-tight">
                {aboutPost.title}
              </h1>

              {aboutPost.coverImage && (
                <div className="my-8">
                  <Image
                    src={aboutPost.coverImage}
                    alt={aboutPost.title}
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
            <MDXRemote source={aboutPost.content} components={mdxComponents} />
          </article>
        </main>
      </div>
    </div>
  );
}