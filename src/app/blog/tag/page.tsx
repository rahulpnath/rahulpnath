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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Tags</h1>
      <p className="text-gray-600 mb-8">
        Browse posts by topic. Found {sortedTags.length} unique tags.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTags.map(([tagSlug, count]) => {
          const displayName = tagSlug.replace(/-/g, ' ')
          return (
            <Link
              key={tagSlug}
              href={`/blog/tag/${tagSlug}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium capitalize">{displayName}</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {count} post{count !== 1 ? 's' : ''}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
