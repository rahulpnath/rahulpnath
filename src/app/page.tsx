import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { BlogPost } from '@/types/blog';
import { getAllPosts } from '@/lib/posts';
// import { getLatestYouTubeVideos, YouTubeVideo } from '@/lib/youtube'; // COMMENTED OUT

export const metadata: Metadata = {
  title: 'Rahul Nath - Developer Blog',
  description: 'Hey, I\'m Rahul Nath! Coder, Blogger, YouTuber, Teacher. Explore my thoughts, tutorials, and insights on web development, AWS, .NET, and modern technologies.',
  keywords: ['Rahul Nath', 'Developer', 'Blog', 'AWS', '.NET', 'Web Development', 'YouTube', 'Teaching', 'Software Engineering'],
  openGraph: {
    title: 'Rahul Nath - Developer Blog',
    description: 'Hey, I\'m Rahul Nath! Coder, Blogger, YouTuber, Teacher. Explore my thoughts, tutorials, and insights on web development, AWS, .NET, and modern technologies.',
    type: 'website',
    url: 'https://www.rahulpnath.com',
    images: [
      {
        url: '/rahul-logo.png',
        width: 1200,
        height: 630,
        alt: 'Rahul Nath - Developer Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rahul Nath - Developer Blog',
    description: 'Hey, I\'m Rahul Nath! Coder, Blogger, YouTuber, Teacher. Explore my thoughts, tutorials, and insights on web development, AWS, .NET, and modern technologies.',
    creator: '@rahulpnath',
    images: ['/rahul-logo.png'],
  },
  alternates: {
    canonical: 'https://www.rahulpnath.com',
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'Rahul Nath Blog RSS Feed' },
      ],
    },
  },
};

// Hero Section Component
function HeroSection() {
  return (
    <section 
      className="relative bg-theme-bg py-24 sm:py-32 overflow-hidden"
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-50" aria-hidden="true"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main headline */}
          <h1 
            id="hero-heading"
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-theme-text-high-contrast"
          >
            Hey, I'm Rahul Nath <span role="img" aria-label="waving hand">👋</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-500 max-w-3xl mx-auto mb-6 leading-relaxed">
            Coder. Blogger. YouTuber. Teacher.
          </p>
          
          <p className="text-lg md:text-xl text-theme-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
            I enjoy running. Blogs are usually technical and about life in general.
          </p>
          
          {/* Single prominent CTA */}
          <div className="flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-500 hover:bg-primary-600 focus:bg-primary-700 active:bg-primary-800 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 hover:scale-105 transform focus:ring-offset-theme-bg"
              aria-describedby="cta-description"
            >
              <span>Start Reading</span>
              <svg 
                className="ml-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <p id="cta-description" className="sr-only">
            Navigate to the blog section to read articles about web development, tutorials, and insights
          </p>
        </div>
      </div>
    </section>
  );
}

// Latest on YouTube Section - REMOVED

// Recent Articles Section
interface RecentArticlesProps {
  posts: BlogPost[];
}

function RecentArticlesSection({ posts }: RecentArticlesProps) {
  const recentPosts = posts.slice(0, 6);

  return (
    <section 
      className="py-16 sm:py-24 bg-theme-bg-muted"
      aria-labelledby="articles-heading"
      role="region"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 id="articles-heading" className="text-3xl md:text-4xl font-bold text-theme-text mb-4">
            Recent Articles
          </h2>
          <p className="text-lg text-theme-text-secondary max-w-2xl mx-auto">
            Deep dives into web development, cloud architecture, and building better software.
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {recentPosts.map((post, index) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`} 
              className="group block focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-theme-bg-muted rounded-2xl"
              aria-describedby={`article-${post.slug}`}
            >
              <article 
                className="bg-theme-bg-card rounded-2xl overflow-hidden border border-theme-border-light hover:border-primary-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full"
                role="listitem"
              >
                {/* Article image */}
                {post.coverImage && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={`Cover image for article: ${post.title}`}
                      fill
                      priority={index < 3}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
                  </div>
                )}
                
                {/* Article content */}
                <div className="p-6">
                  {/* Meta info */}
                  <div className="flex items-center text-sm text-theme-text-light mb-3">
                    <time 
                      dateTime={post.publishedAt}
                      aria-label={`Published on ${new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}`}
                    >
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <span className="mx-2" aria-hidden="true">•</span>
                    <span aria-label={`Estimated reading time: ${post.readingTime || '5 minutes'}`}>
                      {post.readingTime || '5 min read'}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-theme-text mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-theme-text-secondary text-sm line-clamp-3 mb-4">
                    {post.description}
                  </p>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2" role="list" aria-label="Article tags">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                          role="listitem"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span 
                          className="text-xs text-theme-text-light"
                          aria-label={`${post.tags.length - 2} more tags`}
                        >
                          +{post.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Screen reader description */}
                <div id={`article-${post.slug}`} className="sr-only">
                  Article: {post.title}. {post.description}. 
                  Published {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}. 
                  Reading time: {post.readingTime || '5 minutes'}. 
                  {post.tags && post.tags.length > 0 && `Tagged as: ${post.tags.join(', ')}.`}
                  Click to read the full article.
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View all articles link */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-theme-text-high-contrast bg-theme-bg-muted hover:bg-theme-bg-card disabled:bg-theme-bg-muted border-2 border-gray-200 hover:border-primary-400 focus:border-primary-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-theme-bg-muted"
            aria-label="View all blog articles"
          >
            <span>View all articles</span>
            <svg 
              className="ml-2 h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  const socialLinks = [
    {
      name: 'YouTube',
      href: 'https://youtube.com/@rahulpnath',
      ariaLabel: 'Visit Rahul Nath\'s YouTube channel',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/rahulpnath',
      ariaLabel: 'Follow Rahul Nath on Twitter',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      href: 'https://github.com/rahulpnath',
      ariaLabel: 'View Rahul Nath\'s projects on GitHub',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/rahulpnath',
      ariaLabel: 'Connect with Rahul Nath on LinkedIn',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    }
  ];

  return (
    <footer 
      className="bg-theme-bg border-t border-theme-border-light"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="text-center">
          {/* Social links */}
          <nav aria-label="Social media links">
            <ul className="flex justify-center space-x-6 mb-8" role="list">
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-text-light hover:text-primary-600 focus:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-theme-bg rounded-lg p-2"
                    aria-label={item.ariaLabel}
                  >
                    {item.icon}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Copyright */}
          <p className="text-theme-text-secondary text-sm">
            © {new Date().getFullYear()} Rahul Nath. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Homepage Component
export default async function HomePage() {
  const [allPosts] = await Promise.all([
    getAllPosts()
    // getLatestYouTubeVideos(6) // Get 6 videos (1 featured + 5 recent) - COMMENTED OUT
  ]);

  // Structured data for the website and person
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rahul Nath - Developer Blog',
    url: 'https://www.rahulpnath.com',
    description: 'Thoughts, tutorials, and insights on web development, AWS, .NET, and modern technologies by Rahul Nath.',
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.rahulpnath.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Person',
      name: 'Rahul Nath',
      url: 'https://www.rahulpnath.com',
      sameAs: [
        'https://twitter.com/rahulpnath',
        'https://www.youtube.com/rahulnathp',
        'https://github.com/rahulpnath',
        'https://www.linkedin.com/in/rahulpnath'
      ]
    }
  };

  const personStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rahul Nath',
    jobTitle: 'Software Engineer',
    description: 'Coder, Blogger, YouTuber, Teacher. Passionate about web development, AWS, .NET, and modern technologies.',
    url: 'https://www.rahulpnath.com',
    image: 'https://www.rahulpnath.com/rahul-logo.png',
    sameAs: [
      'https://twitter.com/rahulpnath',
      'https://www.youtube.com/rahulnathp',
      'https://github.com/rahulpnath',
      'https://www.linkedin.com/in/rahulpnath'
    ],
    knowsAbout: [
      'Web Development',
      'AWS',
      '.NET',
      'Software Engineering',
      'React',
      'Next.js',
      'TypeScript',
      'Azure',
      'DynamoDB',
      'Lambda'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Independent'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
      />
    <main 
      className="min-h-screen bg-theme-bg"
      id="main-content"
      role="main"
    >
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium z-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Latest on YouTube Section - REMOVED */}
      
      {/* Recent Articles Section */}
      <Suspense fallback={
        <div 
          className="flex items-center justify-center py-24"
          role="status"
          aria-live="polite"
          aria-label="Loading articles"
        >
          <div className="animate-pulse text-theme-text-secondary">
            Loading articles...
          </div>
        </div>
      }>
        <RecentArticlesSection posts={allPosts} />
      </Suspense>
      
      {/* Footer */}
      <Footer />
    </main>
    </>
  );
}