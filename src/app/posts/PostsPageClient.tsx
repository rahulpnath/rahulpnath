"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export default function PostsPageClient({ posts }: { posts: any[] }) {
  const postsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-black border-b border-zinc-800 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="https://www.rahulpnath.com/content/images/size/w256h256/2022/10/logo-512x512.png"
              alt="Logo"
              className="h-10 w-10"
            />
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex space-x-8 font-semibold text-sm">
            <Link href="/" className="hover:text-[#823EB7] transition-colors">
              Home
            </Link>
            <Link
              href="/blog"
              className="hover:text-[#823EB7] transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/archives"
              className="hover:text-[#823EB7] transition-colors"
            >
              Archives
            </Link>
            <Link
              href="/youtube"
              className="hover:text-[#823EB7] transition-colors"
            >
              YouTube
            </Link>
          </nav>

          {/* Search */}
          <div className="relative w-40 md:w-60">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-zinc-900 text-gray-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#823EB7] border border-zinc-700"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </header>
      {/* Posts Section Updated */}
      <section className="border-b border-gray py-8 section-article-featured">
        <div className="mx-auto max-w-[1345px] px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-12 gap-8">
            {currentPosts.map((post) => (<div
              key={post.slug}
              className="col-span-12 md:col-span-6 xl:col-span-4"
            >
              <article
                className="relative h-full cursor-pointer rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-sm transition-all duration-300 hover:border-[#823EB7] hover:shadow-md"
              >
                {/* Decorative inner border background */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 rounded-3xl bg-zinc-900" />
                </div>

                <Link
                  href={`/posts/${post.slug}`}
                  className="group relative z-[1] flex h-full flex-col justify-between rounded-3xl"
                >
                  <div className="space-y-4">
                    {/* Feature Image */}
                    {post.featureImage && (
                      <div className="relative h-[240px] w-full overflow-hidden rounded-3xl">
                        <img
                          src={post.featureImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="pointer-events-none absolute inset-0 rounded-3xl" />
                      </div>
                    )}

                    {/* Title + Excerpt */}
                    <div className="px-5 md:px-6">
                      <h3 className="font-clash text-[32px] font-medium leading-[1.2] text-white group-hover:text-[#B07BE0]">
                        {post.title}
                      </h3>
                      <h3 className="font-clash text-2xl">Test Clash</h3>

                      {post.excerpt && (
                        <p className="mt-4 text-[17px] leading-[1.4] text-white/70 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Meta row + arrow */}
                  <div className="z-[1] mt-4 flex items-center justify-between px-5 pb-5 md:px-6 md:pb-6">
                    <div className="flex items-center gap-3">
                      {post.author?.name && (
                        <Link
                          href={post.author?.url ?? "#"}
                          className="text-[13px] uppercase text-[#9BF6FF] font-medium leading-[1.2]"
                        >
                          {post.author.name}
                        </Link>
                      )}

                      {post.date && (
                        <>
                          {/* desktop/tablet date */}
                          <span className="hidden text-[13px] font-medium uppercase text-white/50 md:inline">
                            {new Date(post.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                          {/* mobile date */}
                          <span className="inline text-[13px] font-medium uppercase text-white/50 md:hidden">
                            {new Date(post.date).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Read more arrow */}
                    <span
                      aria-label={`Read more ${post.title}`}
                      className="inline-flex items-center justify-center rounded-full bg-[#9BF6FF] p-2 transition-transform duration-300 group-hover:scale-105"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <path
                          d="M6.99902 17L16.999 6.99997M16.999 6.99997V17M16.999 6.99997H6.99902"
                          stroke="#1F1F1F"
                          strokeWidth="2"
                          strokeLinecap="square"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            </div>))}
          </div>
        </div>
        ß
      </section>

      {/* Posts Section */}
      {/* <main className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-white mb-12">
            Latest Posts
          </h1>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((post) => (
              <Link
  key={post.slug}
  href={`/posts/${post.slug}`}
  className="block group"
>
  <article className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#823EB7] transition-all duration-300 h-[420px]"> */}

      {/* Feature Image */}
      {/* {post.featureImage && (
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={post.featureImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    )} */}

      {/* Content */}
      {/* <div className="flex flex-col flex-1 p-6">
      <h2 className="text-xl font-semibold text-white group-hover:text-[#823EB7] leading-snug line-clamp-2">
        {post.title}
      </h2>
      
      {post.date && (
        <p className="text-sm text-gray-400 mt-2">
          {new Date(post.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
      
      {post.excerpt && (
        <p className="text-gray-300 mt-3 text-sm line-clamp-3">
          {post.excerpt}
        </p>
      )} */}

      {/* Read more link pinned to bottom */}
      {/* <span className="mt-auto pt-4 text-sm font-medium text-[#823EB7] group-hover:underline">
        Read More →
      </span>
    </div>
  </article>
</Link>
             ))}
           </div>  */}

          // {/* Pagination */}
      {/* {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-gray-300 hover:text-white hover:border-[#823EB7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <span className="text-gray-400">
                Page <span className="text-white">{currentPage}</span> of{" "}
                {totalPages}
              </span>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-gray-300 hover:text-white hover:border-[#823EB7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>  */}
    </div>
  );
}
