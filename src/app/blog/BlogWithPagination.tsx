'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="relative h-full cursor-pointer rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-sm transition-all duration-300 hover:border-[#823EB7] hover:shadow-md">
      {/* Decorative inner border background */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl" aria-hidden="true">
        <div className="absolute inset-0 rounded-3xl bg-zinc-900" />
      </div>

      <Link
        href={`/blog/${post.slug}`}
        className="group relative z-[1] flex h-full flex-col justify-between rounded-3xl"
      >
        <div className="space-y-4">
          {/* Feature Image */}
          {post.coverImage && (
            <div className="relative h-[240px] w-full overflow-hidden rounded-3xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
              <span className="pointer-events-none absolute inset-0 rounded-3xl" />
            </div>
          )}

          {/* Title + Excerpt */}
          <div className="px-5 md:px-6">
            <h3 className="font-clash text-[32px] font-medium leading-[1.2] text-white group-hover:text-[#B07BE0]">
              {post.title}
            </h3>

            {post.description && (
              <p className="mt-4 text-[17px] leading-[1.4] text-white/70 line-clamp-3">
                {post.description}
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

            {post.publishedAt && (
              <>
                {/* desktop/tablet date */}
                <span className="hidden text-[13px] font-medium uppercase text-white/50 md:inline">
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {/* mobile date */}
                <span className="inline text-[13px] font-medium uppercase text-white/50 md:hidden">
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
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
  );
}

interface BlogWithPaginationProps {
  posts: BlogPost[];
}

export default function BlogWithPagination({ posts }: BlogWithPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <section className="border-b border-gray py-8 section-article-featured">
        <div className="mx-auto max-w-[1345px] px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-12 gap-8">
            {currentPosts.map((post) => (
              <div
                key={post.slug}
                className="col-span-12 md:col-span-6 xl:col-span-4"
              >
                <BlogPostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-12 bg-black">
          <div className="mx-auto max-w-[1345px] px-4 md:px-8 lg:px-16">
            <div className="flex flex-col items-center gap-6">
              {/* Page Info */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Showing {startIndex + 1} to {Math.min(startIndex + postsPerPage, posts.length)} of {posts.length} posts
                </p>
                <p className="text-white/70 text-sm mt-1">
                  Page {currentPage} of {totalPages}
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-4">
                {/* Previous Button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-gray-300 hover:text-white hover:border-[#823EB7] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-zinc-700 disabled:hover:bg-zinc-900 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-10 h-10 rounded-lg border transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-[#823EB7] border-[#823EB7] text-white'
                            : 'bg-zinc-900 border-zinc-700 text-gray-300 hover:text-white hover:border-[#823EB7] hover:bg-zinc-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-gray-300 hover:text-white hover:border-[#823EB7] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-zinc-700 disabled:hover:bg-zinc-900 transition-all duration-200"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Quick Jump */}
              {totalPages > 10 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Jump to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        goToPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-white text-center focus:outline-none focus:border-[#823EB7]"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}