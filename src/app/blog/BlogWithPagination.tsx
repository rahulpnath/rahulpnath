'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';


function BlogPostCard({ post }: { post: BlogPost }) {

  return (
    <article className="relative group flex flex-col w-full gap-y-6">
      {/* Image */}
      {post.coverImage && (
        <div className="ring-1 ring-gray-200 dark:ring-gray-800 relative overflow-hidden aspect-[16/9] w-full rounded-lg pointer-events-none">
          <Image
            src={post.coverImage}
            alt={`Cover image for: ${post.title}`}
            fill
            className="object-cover object-top w-full h-full transform transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-col justify-between flex-1">
        <div className="flex-1">
          <Link 
            href={`/blog/${post.slug}`} 
            className="focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-theme-bg rounded-lg" 
            aria-describedby={`article-${post.slug}`}
          >
            <span className="absolute inset-0" aria-hidden="true"></span>
          </Link>
          
          {/* Category/Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2" role="list" aria-label="Article tags">
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center font-medium rounded-md text-xs px-2 py-1 gap-1 bg-primary-100 text-primary-700 ring-1 ring-inset ring-primary-200"
                  role="listitem"
                >
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-theme-text-high-contrast text-xl font-semibold truncate group-hover:text-theme-text-hover transition-colors duration-200" style={{lineHeight: '24px'}}>
            {post.title}
          </h2>

          {/* Description */}
          {post.description && (
            <div className="text-base text-theme-text-secondary mt-1 line-clamp-2">
              {post.description}
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="relative flex items-center gap-x-3 mt-4">
          {post.publishedAt && (
            <time 
              dateTime={post.publishedAt} 
              className="text-sm text-theme-text-secondary font-medium pointer-events-none"
              aria-label={`Published on ${new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}`}
            >
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
      </div>
      
      {/* Screen reader description */}
      <div id={`article-${post.slug}`} className="sr-only">
        Article: {post.title}. {post.description}. 
        Published {new Date(post.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}. 
        {post.tags && post.tags.length > 0 && `Tagged as: ${post.tags.join(', ')}.`}
        Click to read the full article.
      </div>
    </article>
  );
}

interface BlogWithPaginationProps {
  posts: BlogPost[];
  showHeader?: boolean;
}

export default function BlogWithPagination({ posts, showHeader = true }: BlogWithPaginationProps) {
  const [visiblePosts, setVisiblePosts] = useState(7); // Initial posts to show: 1 featured + 3 below + 3 more
  const postsPerLoad = 9; // Posts to load when clicking "Load more" (3 full rows of 3 columns)

  // Get the featured post (latest post)
  const featuredPost = posts[0] || null;
  const belowFeaturedPosts = posts.slice(1, 4); // Next 3 posts
  const remainingPosts = posts.slice(4, visiblePosts); // All other posts up to visible limit
  const hasMorePosts = visiblePosts < posts.length;

  const loadMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + postsPerLoad, posts.length));
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Articles Header Section */}
        {showHeader && (
          <header className="py-8 sm:py-16 lg:py-24" role="banner" aria-labelledby="articles-title">
            <div className="gap-8 sm:gap-y-16 grid lg:grid-cols-2 lg:items-center">
              <div className="">
                <h1 id="articles-title" className="text-3xl font-bold tracking-tight text-theme-text sm:text-4xl lg:text-5xl">
                  Articles
                </h1>
                <p className="mt-4 text-lg text-theme-text-secondary">
                  Here is a list of articles I wrote to share my learnings about Development, Tooling and DevOps.
                </p>
                <nav className="mt-8 flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Article navigation">
                  <a 
                    className="focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-xs gap-x-1.5 px-2.5 py-1.5 shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 inline-flex items-center" 
                    href="/feed.xml" 
                    rel="noopener noreferrer" 
                    target="_blank"
                    aria-label="Subscribe to RSS feed for new articles"
                  >
                    <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M3.429 2.343c8.844 0 16 7.156 16 16h-2.286c0-7.583-6.131-13.714-13.714-13.714V2.343zM3.429 8.457A9.714 9.714 0 0113.143 18.171h2.286c0-6.857-5.572-12.428-12.428-12.428v2.714zm.571 5.714a2.286 2.286 0 012.286 2.286A2.286 2.286 0 014 18.743a2.286 2.286 0 01-2.286-2.286A2.286 2.286 0 014 14.171z"/>
                    </svg>
                    <span>RSS Feed</span>
                  </a>
                  <a 
                    className="focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-xs gap-x-1.5 px-2.5 py-1.5 shadow-sm ring-1 ring-inset text-theme-text bg-theme-bg-card hover:bg-theme-bg-muted ring-theme-border-muted hover:ring-theme-border-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-text-light inline-flex items-center" 
                    href="/blog/tag"
                    aria-label="Browse articles by tags"
                  >
                    <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.673.686L10.4 4.5h2.15a.75.75 0 010 1.5H10.4l-.4 3h2.15a.75.75 0 010 1.5H10.4l-.063 1.495a.75.75 0 01-1.436-.19L8.9 10.5H6.4l-.063 1.495a.75.75 0 01-1.436-.19L4.9 10.5H3.75a.75.75 0 010-1.5H4.9l.4-3H3.75a.75.75 0 010-1.5H5.3l.063-1.495a.75.75 0 011.436.19L6.6 4.5h2.5l.063-1.495a.75.75 0 011.501-.186zM6.6 6l-.4 3h2.5l.4-3H6.6z" clipRule="evenodd" />
                    </svg>
                    <span>See all tags</span>
                  </a>
                </nav>
              </div>
              <img 
                alt="Workspace showing article writing environment with modern development tools" 
                sizes="400px" 
                srcSet="/article-img.jpg 400w, /article-img.jpg 800w" 
                className="hidden lg:block mx-auto rounded-md shadow-xl ring-1 ring-theme-border-muted w-96" 
                src="/article-img.jpg" 
              />
            </div>
          </header>
        )}

        {/* Blog Posts Section */}
        <section className="mt-8 pb-24" aria-labelledby="blog-posts-heading">
          <h2 id="blog-posts-heading" className="sr-only">Blog posts</h2>
          
          {/* Featured Post */}
          {featuredPost && (
            <aside className="mb-8 sm:mb-16" aria-labelledby="featured-post-heading">
              <h3 id="featured-post-heading" className="sr-only">Featured article</h3>
              <article className="relative group flex flex-col w-full gap-y-6 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-center col-span-full">
                {/* Featured Image */}
                {featuredPost.coverImage && (
                  <div className="ring-1 ring-gray-200 dark:ring-gray-800 relative overflow-hidden aspect-[16/9] w-full rounded-lg pointer-events-none">
                    <Image
                      src={featuredPost.coverImage}
                      alt={`Featured article cover image: ${featuredPost.title}`}
                      fill
                      className="object-cover object-top w-full h-full transform transition-transform duration-200 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      onError={(e) => e.currentTarget.setAttribute('data-error', '1')}
                    />
                  </div>
                )}
                
                {/* Featured Content */}
                <div className="flex flex-col justify-between flex-1">
                  <div className="flex-1">
                    <Link 
                      href={`/blog/${featuredPost.slug}`} 
                      className="focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-theme-bg rounded-lg" 
                      aria-describedby={`featured-${featuredPost.slug}`}
                    >
                      <span className="absolute inset-0" aria-hidden="true"></span>
                    </Link>
                    
                    {/* Category/Tags */}
                    {featuredPost.tags && featuredPost.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2" role="list" aria-label="Featured article tags">
                        {featuredPost.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center font-medium rounded-md text-xs px-2 py-1 gap-1 bg-primary-100 text-primary-700 ring-1 ring-inset ring-primary-200"
                            role="listitem"
                          >
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Title */}
                    <h4 className="text-theme-text-high-contrast text-xl font-semibold truncate group-hover:text-theme-text-hover transition-colors duration-200">
                      {featuredPost.title}
                    </h4>
                    
                    {/* Description */}
                    {featuredPost.description && (
                      <p className="text-base text-theme-text-secondary mt-1 line-clamp-2">
                        {featuredPost.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Meta info */}
                  <div className="relative flex items-center gap-x-3 mt-4">
                    {featuredPost.publishedAt && (
                      <time 
                        dateTime={featuredPost.publishedAt} 
                        className="text-sm text-theme-text-secondary font-medium pointer-events-none"
                        aria-label={`Published on ${new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}`}
                      >
                        {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                  </div>
                </div>
                
                {/* Screen reader description for featured post */}
                <div id={`featured-${featuredPost.slug}`} className="sr-only">
                  Featured article: {featuredPost.title}. {featuredPost.description}. 
                  Published {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}. 
                  {featuredPost.tags && featuredPost.tags.length > 0 && `Tagged as: ${featuredPost.tags.join(', ')}.`}
                  Click to read the full article.
                </div>
              </article>
            </aside>
          )}

          {/* All posts grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-x-8 gap-y-16" role="list" aria-label="All blog articles">
            {/* Three posts below featured */}
            {belowFeaturedPosts.length > 0 && (
              <>
                {belowFeaturedPosts.map((post) => (
                  <div key={post.slug} role="listitem">
                    <BlogPostCard post={post} />
                  </div>
                ))}
              </>
            )}

            {/* Rest of the posts */}
            {remainingPosts.length > 0 && (
              <>
                {remainingPosts.map((post) => (
                  <div key={post.slug} role="listitem">
                    <BlogPostCard post={post} />
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Load More Button */}
          {hasMorePosts && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={loadMorePosts}
                className="focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-sm gap-x-1.5 px-6 py-3 shadow-sm ring-1 ring-inset text-theme-text bg-theme-bg-card hover:bg-theme-bg-muted ring-theme-border-muted hover:ring-theme-border-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-text-light inline-flex items-center transition-all duration-200"
                aria-label={`Load ${Math.min(postsPerLoad, posts.length - visiblePosts)} more articles. Currently showing ${visiblePosts} of ${posts.length} articles.`}
              >
                <span>Load more articles</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 17L17 7"></path>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h10v10"></path>
                </svg>
              </button>
            </div>
          )}
        </section>
        </div>
  );
}