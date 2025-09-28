'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/types/blog'

interface BlogPostCardProps {
  post: BlogPost
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group block border border-theme-border-light rounded-lg overflow-hidden shadow-brand hover:shadow-brand-lg transition-shadow duration-300 no-underline text-inherit bg-theme-bg-card"
    >
      <div className="flex flex-col h-full">
        {post.coverImage && (
          <div className="aspect-video overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={225}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-theme-text-high-contrast group-hover:text-theme-text-hover transition-colors duration-200">
            {post.title}
          </h3>
          
          <p className="text-theme-text-muted mb-4 flex-grow text-sm leading-relaxed">
            {post.description}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-300/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-3">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-theme-bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium text-theme-text-muted">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="text-sm">
                <div className="font-medium text-theme-text-high-contrast">{post.author.name}</div>
              </div>
            </div>
            
            <div className="text-xs text-theme-text-light">
              {new Date(post.publishedAt).toLocaleDateString()}
              {post.readingTime && (
                <>
                  <span className="mx-1">•</span>
                  {post.readingTime}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}