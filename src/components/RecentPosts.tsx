import Link from 'next/link';
import { BlogPost } from '@/types/blog';

interface SidebarProps {
  posts: BlogPost[];
}

export default function Sidebar({ posts }: SidebarProps) {
  // Get the 5 most recent posts
  const recentPosts = posts.slice(0, 5);
  
  // Mock popular posts (in real app, would be based on view counts)
  const popularPosts = posts.slice(1, 6);

  return (
    <aside className="w-full lg:w-80 xl:w-96 space-y-6 lg:sticky lg:top-8">
      {/* Recent Posts Widget */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-4 border border-light-border dark:border-dark-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-light-text-primary dark:text-dark-text-primary">
          <svg className="w-5 h-5 mr-2 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Recent Posts
        </h3>
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <div key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <h4 className="font-medium text-sm leading-5 group-hover:text-accent-primary transition-colors line-clamp-2 text-light-text-primary dark:text-dark-text-primary">
                  {post.title}
                </h4>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })} • 5 min read
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Posts Widget */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-4 border border-light-border dark:border-dark-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-light-text-primary dark:text-dark-text-primary">
          <svg className="w-5 h-5 mr-2 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Popular Posts
        </h3>
        <div className="space-y-3">
          {popularPosts.map((post, index) => (
            <div key={post.slug} className="flex items-start gap-3 group">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary text-white text-xs flex items-center justify-center font-semibold">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={`/blog/${post.slug}`} className="block">
                  <h4 className="font-medium text-sm leading-5 group-hover:text-accent-primary transition-colors line-clamp-2 text-light-text-primary dark:text-dark-text-primary">
                    {post.title}
                  </h4>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    {Math.floor(Math.random() * 1000) + 100} views • 5 min read
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Widget */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-4 border border-light-border dark:border-dark-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-light-text-primary dark:text-dark-text-primary">
          <svg className="w-5 h-5 mr-2 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {['AWS', 'React', 'Next.js', 'JavaScript', 'TypeScript', 'DevOps'].map(category => (
            <Link 
              key={category}
              href={`/blog?category=${category.toLowerCase()}`}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-accent-primary/10 hover:bg-accent-primary hover:text-white transition-colors text-accent-primary"
            >
              {category}
              <span className="ml-1 text-xs opacity-75">({Math.floor(Math.random() * 20) + 5})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tutorial Series Widget */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-4 border border-light-border dark:border-dark-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-light-text-primary dark:text-dark-text-primary">
          <svg className="w-5 h-5 mr-2 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Tutorial Series
        </h3>
        <div className="space-y-3">
          {['AWS Complete Guide', 'React Mastery', 'DevOps Fundamentals'].map((series, index) => (
            <Link 
              key={series}
              href={`/series/${series.toLowerCase().replace(' ', '-')}`}
              className="block p-3 border border-light-border dark:border-dark-border rounded-lg hover:border-accent-primary hover:bg-accent-primary/5 transition-all group"
            >
              <h4 className="font-medium text-sm mb-1 group-hover:text-accent-primary transition-colors text-light-text-primary dark:text-dark-text-primary">
                {series}
              </h4>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                {8 + index} parts • {20 + (index * 5)} min total
              </p>
              <div className="mt-2 flex items-center text-xs text-accent-primary">
                <span>{85 + (index * 3)}% readers complete this series</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}