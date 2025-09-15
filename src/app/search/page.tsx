import Search from '@/components/Search';
import BlogPostCard from '@/components/BlogPostCard';
import { getAllPosts } from '@/lib/posts';

export default async function SearchPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <div className="mx-auto max-w-[1345px] px-4 md:px-8 lg:px-16 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Search Articles
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Search through {posts.length} articles and tutorials
          </p>
          
          {/* Search Component */}
          <div className="max-w-2xl mx-auto">
            <Search 
              posts={posts} 
              placeholder="Search articles, tags, or topics..."
              className="w-full"
            />
          </div>
        </div>
        
        {/* Search Tips */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">Search Tips</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h3 className="font-medium text-gray-200 mb-2">Basic Search</h3>
                <ul className="space-y-1">
                  <li>• Type any keyword to search titles and content</li>
                  <li>• Use multiple words for better results</li>
                  <li>• Search is case-insensitive</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-200 mb-2">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['AWS', 'React', 'Next.js', 'TypeScript', 'Azure', 'DynamoDB'].map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">Recent Articles</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}