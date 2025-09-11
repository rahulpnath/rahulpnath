import { getAllPosts } from '@/lib/posts'
import BlogWithPagination from '@/app/blog/BlogWithPagination'
import { Metadata } from 'next'

interface TagPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tagName = params.slug.replace(/-/g, ' ')
  
  return {
    title: `Posts tagged with "${tagName}" | Rahul Nath`,
    description: `All blog posts tagged with ${tagName}`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const allPosts = await getAllPosts()
  
  // Filter posts by tag
  const taggedPosts = allPosts.filter(post => 
    post.tags?.some(tag => 
      tag.toLowerCase().replace(/\s+/g, '-') === params.slug.toLowerCase()
    )
  )

  const tagName = params.slug.replace(/-/g, ' ')

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <div className="mx-auto max-w-[1345px] px-4 md:px-8 lg:px-16 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-8 capitalize text-white">
            Posts tagged with "{tagName}"
          </h1>
          <p className="text-gray-300 mb-8">
            Found {taggedPosts.length} post{taggedPosts.length !== 1 ? 's' : ''} with this tag.
          </p>
        </div>
      </div>

      <BlogWithPagination posts={taggedPosts} />
    </div>
  )
}

// Generate static params for all tags
export async function generateStaticParams() {
  const allPosts = await getAllPosts()
  const tags = new Set<string>()
  
  allPosts.forEach(post => {
    post.tags?.forEach(tag => {
      tags.add(tag.toLowerCase().replace(/\s+/g, '-'))
    })
  })
  
  return Array.from(tags).map(tag => ({
    slug: tag,
  }))
}
