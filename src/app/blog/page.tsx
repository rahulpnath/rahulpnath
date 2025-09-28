
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
      <main className="min-h-[calc(100vh-var(--header-height))]">
        <BlogWithPagination posts={posts} />
      </main>
    </div>
  );
}
