// import Link from "next/link";

// export default function HomePage() {
//   return (
//     <main className="max-w-2xl mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-4">Welcome</h1>
//       <p className="mb-6">This is the homepage. Head to the blog to see posts.</p>
//       <Link href="/posts" className="text-blue-600 underline">
//         View all posts →
//       </Link>
//     </main>
//   );
// }
// app/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { getAllPosts } from '@/lib/posts';

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Welcome to My
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Digital Space
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Exploring the intersection of technology, design, and innovation. 
            Join me as I share insights, tutorials, and thoughts on modern web development.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/blog"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              Read Articles
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold leading-6 text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              About Me <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Blog Post Card Component
interface BlogPostCardProps {
  post: BlogPost;
}

function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:shadow-lg hover:ring-slate-300 dark:hover:ring-slate-600 transition-all duration-300 hover:-translate-y-1">
      {post.coverImage && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-x-4 text-xs">
          <time 
            dateTime={post.publishedAt} 
            className="text-slate-500 dark:text-slate-400"
          >
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.readingTime && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">
                {post.readingTime}
              </span>
            </>
          )}
        </div>
        
        <div className="group relative flex-1">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            <Link href={`/blog/${post.slug}`}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-3">
            {post.description}
          </p>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-300/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center gap-x-3">
          {post.author.avatar ? (
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {post.author.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="text-sm leading-6">
            <p className="font-semibold text-slate-900 dark:text-white">
              {post.author.name}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

// Featured Posts Section
interface FeaturedPostsProps {
  posts: BlogPost[];
}

function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <section className="bg-white dark:bg-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Latest Articles
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Discover insights, tutorials, and thoughts on modern web development
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <Link
            href="/blog"
            className="rounded-lg bg-slate-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-slate-900 shadow-sm hover:bg-slate-700 dark:hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:focus-visible:outline-white transition-all duration-200 transform hover:scale-105"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

// Newsletter Section
function NewsletterSection() {
  return (
    <section className="bg-slate-50 dark:bg-slate-800/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Get the latest articles and insights delivered directly to your inbox
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-auto rounded-lg border-0 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            <button
              type="submit"
              className="flex-none rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// Main Homepage Component
export default async function HomePage() {
  const allPosts = await getAllPosts();
  const featuredPosts = allPosts.slice(0, 6); // Show latest 6 posts

  return (
    <main className="min-h-screen">
      <HeroSection />
      <Suspense fallback={
        <div className="flex items-center justify-center py-24">
          <div className="animate-pulse text-slate-600 dark:text-slate-400">
            Loading posts...
          </div>
        </div>
      }>
        <FeaturedPosts posts={featuredPosts} />
      </Suspense>
      <NewsletterSection />
    </main>
  );
}