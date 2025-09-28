import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Tags | Rahul Nath',
  description: 'Browse all blog post tags',
}

export default async function TagsPage() {
  const allPosts = await getAllPosts()
  
  // Get all tags with post counts
  const tagCounts = new Map<string, number>()
  
  allPosts.forEach(post => {
    post.tags?.forEach(tag => {
      const tagSlug = tag.toLowerCase().replace(/\s+/g, '-')
      tagCounts.set(tagSlug, (tagCounts.get(tagSlug) || 0) + 1)
    })
  })
  
  // Sort tags by post count (descending)
  const sortedTags = Array.from(tagCounts.entries())
    .sort(([,a], [,b]) => b - a)

  return (
    <div className="min-h-screen blog-container">
      <main className="min-h-[calc(100vh-var(--header-height))]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8">
            <div className="lg:col-span-10">
              <div className="relative border-b theme-border py-8">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <h1 className="text-3xl sm:text-4xl font-bold hero-title tracking-tight">Tags</h1>
                    </div>
                    <div className="mt-4 text-lg hero-subtitle">All tags used in this blog</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags Grid Section */}
          <div className="mt-8 pb-24">
            <div className="flex flex-wrap place-content-evenly gap-5 mt-4">
              {sortedTags.map(([tagSlug, count]) => {
                const displayName = tagSlug.replace(/-/g, ' ')
                return (
                  <div key={tagSlug} className="relative inline-flex items-center justify-center flex-shrink-0">
                    <Link
                      href={`/blog/tag/${tagSlug}`}
                      className="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset text-theme-text bg-theme-bg-card hover:bg-theme-bg-muted ring-theme-border-muted hover:ring-theme-border-muted hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
                    >
                      <span className="capitalize">{displayName}</span>
                    </Link>
                    <span className="absolute rounded-full ring-1 ring-theme-bg bg-primary-500 text-white flex items-center justify-center font-medium whitespace-nowrap h-4 min-w-[1rem] text-[12px] p-1 top-0 right-0 -translate-y-1/2 translate-x-1/2 transform">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
