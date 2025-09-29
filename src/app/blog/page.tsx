
import { Metadata } from 'next';
import BlogWithPagination from './BlogWithPagination';

export const metadata: Metadata = {
  title: 'Articles | Rahul Nath',
  description: 'Thoughts, tutorials, and insights on modern web development, AWS, and building better software.',
  openGraph: {
    title: 'Articles | Rahul Nath',
    description: 'Thoughts, tutorials, and insights on modern web development, AWS, and building better software.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles | Rahul Nath',
    description: 'Thoughts, tutorials, and insights on modern web development, AWS, and building better software.',
  },
};

export default async function BlogPage() {
  const { getAllPosts } = await import('@/lib/posts');
  const posts = await getAllPosts();

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
        aria-label="Blog articles"
      >
        <BlogWithPagination posts={posts} />
      </main>
    </div>
  );
}
