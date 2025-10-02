import { getAllPostsMetadata } from '@/lib/posts'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Tags | Rahul Nath',
  description: 'Browse all blog post tags and discover articles by topic. Find content about AWS, .NET, web development, and software engineering.',
  keywords: ['tags', 'blog topics', 'AWS', '.NET', 'web development', 'programming'],
  openGraph: {
    title: 'All Tags | Rahul Nath',
    description: 'Browse all blog post tags and discover articles by topic. Find content about AWS, .NET, web development, and software engineering.',
    type: 'website',
    url: 'https://www.rahulpnath.com/blog/tag',
    images: [
      {
        url: '/rahul-logo.png',
        width: 1200,
        height: 630,
        alt: 'Rahul Nath Blog Tags',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Tags | Rahul Nath',
    description: 'Browse all blog post tags and discover articles by topic. Find content about AWS, .NET, web development, and software engineering.',
    creator: '@rahulpnath',
    images: ['/rahul-logo.png'],
  },
  alternates: {
    canonical: 'https://www.rahulpnath.com/blog/tag',
  },
}

export default async function TagsPage() {
  const allPosts = await getAllPostsMetadata()
  
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
                        className="text-3xl sm:text-4xl font-bold text-theme-text-high-contrast tracking-tight"
                      >
                        Tags
                      </h1>
                    </div>
                    <p className="mt-4 text-lg text-theme-text-secondary">
                      All tags used in this blog
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Tags Grid Section */}
          <section className="mt-8 pb-24" aria-labelledby="tags-heading">
            <h2 id="tags-heading" className="sr-only">Available tags</h2>
            <div className="flex flex-wrap place-content-evenly gap-5 mt-4" role="list" aria-label="Browse by tag">
              {sortedTags.map(([tagSlug, count]) => {
                const displayName = tagSlug.replace(/-/g, ' ')
                return (
                  <div key={tagSlug} className="relative inline-flex items-center justify-center flex-shrink-0" role="listitem">
                    <Link
                      href={`/blog/tag/${tagSlug}`}
                      className="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset text-theme-text bg-theme-bg-card hover:bg-theme-bg-muted ring-theme-border-muted hover:ring-theme-border-muted hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
                      aria-label={`View ${count} article${count !== 1 ? 's' : ''} tagged as ${displayName}`}
                    >
                      <span className="capitalize">{displayName}</span>
                    </Link>
                    <span 
                      className="absolute rounded-full ring-1 ring-theme-bg bg-primary-500 text-white flex items-center justify-center font-medium whitespace-nowrap h-4 min-w-[1rem] text-[12px] p-1 top-0 right-0 -translate-y-1/2 translate-x-1/2 transform"
                      aria-label={`${count} articles`}
                    >
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
