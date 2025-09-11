import BlogWithPagination from './BlogWithPagination';

export default async function BlogPage() {
  const { getAllPosts } = await import('@/lib/posts');
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <div className="mx-auto max-w-[1345px] px-4 md:px-8 lg:px-16 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            All Articles
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Thoughts, tutorials, and insights on web development
          </p>
        </div>
      </div>

      <BlogWithPagination posts={posts} />
    </div>
  );
}