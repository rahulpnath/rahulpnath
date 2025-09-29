import Search from '@/components/Search';
import BlogPostCard from '@/components/BlogPostCard';
import { getAllPosts } from '@/lib/posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Articles | Rahul Nath',
  description: 'Search through articles and tutorials about web development, AWS, .NET, software engineering, and modern technologies. Find exactly what you\'re looking for.',
  keywords: ['search', 'articles', 'tutorials', 'web development', 'AWS', '.NET', 'programming'],
  openGraph: {
    title: 'Search Articles | Rahul Nath',
    description: 'Search through articles and tutorials about web development, AWS, .NET, software engineering, and modern technologies. Find exactly what you\'re looking for.',
    type: 'website',
    url: 'https://www.rahulpnath.com/search',
    images: [
      {
        url: '/rahul-logo.png',
        width: 1200,
        height: 630,
        alt: 'Search Rahul Nath Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Articles | Rahul Nath',
    description: 'Search through articles and tutorials about web development, AWS, .NET, software engineering, and modern technologies.',
    creator: '@rahulpnath',
    images: ['/rahul-logo.png'],
  },
  alternates: {
    canonical: 'https://www.rahulpnath.com/search',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function SearchPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium z-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      {/* Header */}
      <main 
        id="main-content" 
        className="mx-auto max-w-[1345px] px-4 md:px-8 lg:px-16 py-12" 
        role="main" 
        aria-labelledby="page-title"
      >
        <header className="text-center mb-8">
          <h1 
            id="page-title" 
            className="text-4xl font-bold tracking-tight text-theme-text-high-contrast sm:text-5xl mb-4"
          >
            Search Articles
          </h1>
          <p className="text-lg text-theme-text-secondary mb-8">
            Search through {posts.length} articles and tutorials
          </p>
          
          {/* Search Component */}
          <div className="max-w-2xl mx-auto" role="search" aria-labelledby="search-section">
            <h2 id="search-section" className="sr-only">Article search</h2>
            <Search 
              posts={posts} 
              placeholder="Search articles, tags, or topics..."
            />
          </div>
        </header>
        
        {/* Search Tips */}
        <section className="max-w-4xl mx-auto mt-12" aria-labelledby="search-tips">
          <div className="bg-theme-bg-card rounded-lg p-6 border border-theme-border-muted">
            <h2 id="search-tips" className="text-lg font-semibold text-theme-text-high-contrast mb-4">Search Tips</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-theme-text-secondary">
              <div>
                <h3 className="font-medium text-theme-text-high-contrast mb-2">Basic Search</h3>
                <ul className="space-y-1" role="list">
                  <li role="listitem">• Type any keyword to search titles and content</li>
                  <li role="listitem">• Use multiple words for better results</li>
                  <li role="listitem">• Search is case-insensitive</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-theme-text-high-contrast mb-2">Popular Topics</h3>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Popular search topics">
                  {['AWS', 'React', 'Next.js', 'TypeScript', 'Azure', 'DynamoDB'].map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-theme-bg-muted text-theme-text-secondary rounded text-xs border border-theme-border-muted"
                      role="listitem"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Articles */}
        <section className="mt-16" aria-labelledby="recent-articles">
          <h2 id="recent-articles" className="text-2xl font-bold text-theme-text-high-contrast mb-8">Recent Articles</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Recent blog articles">
            {posts.slice(0, 6).map((post) => (
              <div key={post.slug} role="listitem">
                <BlogPostCard post={post} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}