'use client'

interface BlogPostCardProps {
  title: string
  description: string
  authorImage: string
  authorName: string
  authorTitle: string
  featureImage: string
  href: string
}

export default function BlogPostCard({
  title,
  description,
  authorImage,
  authorName,
  authorTitle,
  featureImage,
  href
}: BlogPostCardProps) {
  return (
    <a 
      href={href}
      className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 no-underline text-inherit bg-white dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flex flex-col h-full">
        {featureImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={featureImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-white">
            {title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow text-sm leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center space-x-3 mt-auto">
            {authorImage && (
              <img
                src={authorImage}
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div className="text-sm">
              <div className="font-medium text-gray-900 dark:text-white">{authorName}</div>
              {authorTitle && (
                <div className="text-gray-500 dark:text-gray-400">{authorTitle}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}