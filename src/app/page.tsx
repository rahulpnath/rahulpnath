
// app/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { getAllPosts } from '@/lib/posts';

// Hero Section Component
function HeroSection() {
  return (
    <section className="hero-section py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section with Profile Photo */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <Image
                src="/rahul-logo.png"
                alt="Rahul Nath"
                width={120}
                height={120}
                className="profile-image rounded-full"
                priority
              />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              {/* Greeting */}
              <h1 className="text-4xl md:text-6xl font-bold text-theme-text mb-4">
                Hey, I'm Rahul Nath 👋
              </h1>
              
              {/* Role Tagline */}
              <p className="text-xl md:text-2xl font-medium text-primary-500 mb-6">
                Web Developer. Blogger. Mentor. Runner.
              </p>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-theme-text-secondary leading-relaxed max-w-2xl mb-8">
                I build modern web applications and share practical development insights. From AWS tutorials to career advice, I help developers write better code and grow their skills.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="mailto:hello@rahulpnath.com"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-primary-500 hover:bg-primary-600 focus:bg-primary-700 active:bg-primary-800 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
                >
                  Get In Touch
                </a>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-theme-text-secondary border-2 border-transparent hover:border-primary-500 hover:text-primary-600 focus:border-primary-600 focus:text-primary-700 active:border-primary-700 active:text-primary-800 rounded-lg transition-colors duration-200"
                >
                  Read My Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Blog Post Card Component
interface BlogPostCardProps {
  post: BlogPost;
}

function EnhancedBlogPostCard({ post }: BlogPostCardProps) {
  // Mock enhanced data for demonstration (in real app, this would come from your CMS)
  const mockPost = {
    ...post,
    contentType: 'tutorial-series' as const,
    technologies: [
      { name: 'Azure', color: 'text-brand', category: 'cloud' as const },
      { name: 'DevOps', color: 'text-brand-secondary', category: 'devops' as const }
    ],
    difficulty: 'intermediate' as const,
    youtubeUrl: 'https://youtube.com/watch?v=example',
    githubUrl: 'https://github.com/rahulpnath/azure-devops-sample',
    whyThisMatters: 'Understanding Azure DevOps pipelines is crucial for modern cloud deployment strategies.',
    estimatedTime: '15 min read'
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        );
      case 'tutorial-series':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'guide':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl shadow-brand ring-1 ring-gray-200 hover:shadow-brand-lg hover:ring-gray-300 transition-all duration-300 hover:-translate-y-1">
      {post.coverImage && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Content Type Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium">
            {getContentTypeIcon(mockPost.contentType)}
            <span className="capitalize">{mockPost.contentType.replace('-', ' ')}</span>
          </div>
          
          {/* Difficulty Badge */}
          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mockPost.difficulty)}`}>
            {mockPost.difficulty}
          </div>
        </div>
      )}
      
      <div className="flex flex-1 flex-col p-6">
        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-x-4">
            <time dateTime={post.publishedAt} className="text-theme-text-secondary">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span className="text-theme-text-secondary">{mockPost.estimatedTime}</span>
          </div>
        </div>

        {/* Technology Stack */}
        {mockPost.technologies && mockPost.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {mockPost.technologies.map((tech) => (
              <span
                key={tech.name}
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${tech.color} bg-gray-100 ring-1 ring-inset ring-gray-200`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        )}
        
        {/* Title and Description */}
        <div className="group relative flex-1">
          <h3 className="text-lg font-semibold leading-6 text-theme-text group-hover:text-primary-600 transition-colors duration-200">
            <Link href={`/blog/${post.slug}`}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <p className="mt-3 text-sm leading-6 text-theme-text-secondary line-clamp-2">
            {post.description}
          </p>
          
          {/* Why This Matters */}
          {mockPost.whyThisMatters && (
            <div className="mt-3 p-3 bg-primary-light rounded-lg">
              <p className="text-xs text-brand font-medium mb-1">Why this matters:</p>
              <p className="text-xs text-theme-text-secondary line-clamp-2">{mockPost.whyThisMatters}</p>
            </div>
          )}
        </div>

        {/* Cross-Platform Links */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mockPost.youtubeUrl && (
              <a
                href={mockPost.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch
              </a>
            )}
            {mockPost.githubUrl && (
              <a
                href={mockPost.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Code
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {post.author.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}



// Featured Posts Section
interface FeaturedPostsProps {
  posts: BlogPost[];
}

function FeaturedPosts({ posts }: FeaturedPostsProps) {
  const featuredPost = posts[0];

  return (
    <section className="bg-transparent">
      <div className="w-full">
        {/* Featured Article */}
        {featuredPost && (
          <Link 
            href={`/blog/${featuredPost.slug}`}
            className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 group rounded-lg p-6 bg-gray-50 border-2 border-transparent hover:border-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100 cursor-pointer mb-12"
          >
            {/* Content */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-medium text-theme-text-secondary mb-4">Featured article</h2>
                <h3 className="text-2xl md:text-3xl font-bold text-theme-text mb-4">
                  {featuredPost.title}
                </h3>
                {featuredPost.publishedAt && (
                  <div className="text-sm text-theme-text-secondary mb-4">
                    {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })} — 5 min read
                  </div>
                )}
                {featuredPost.description && (
                  <p className="text-theme-text-secondary">
                    {featuredPost.description}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <span className="inline-flex items-center text-[#823EB7] font-medium hover:text-[#6B2D9E] transition-colors">
                  Read full article →
                </span>
              </div>
            </div>
            
            {/* Image */}
            {featuredPost.coverImage && (
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    width={400}
                    height={300}
                    className="w-full h-48 lg:h-full object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 1023px) 100vw, 400px"
                    quality={95}
                    priority
                  />
                </div>
              </div>
            )}
          </Link>
        )}

        {/* Enhanced Blog Cards Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Latest Articles & Tutorials
          </h2>
          {posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 6).map((post) => (
                <EnhancedBlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center space-x-2 px-11 py-6 rounded-full border border-primary-500 text-sm font-medium text-primary-500 hover:bg-primary-500 hover:text-white focus:bg-primary-600 focus:text-white active:bg-primary-700 active:text-white transition-all duration-200"
          >
            <span>Load more articles</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 17L17 7"></path>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h10v10"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Newsletter Section
function NewsletterSection() {
  return (
    <section className="bg-gray-50 /50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900  sm:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 ">
            Get the latest articles and insights delivered directly to your inbox
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-auto rounded-lg border-0 bg-white  px-4 py-3 text-gray-900  shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400  focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
            />
            <button
              type="submit"
              className="flex-none rounded-lg px-6 py-3 text-sm font-semibold bg-primary-500 text-white hover:bg-primary-600 focus:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition-all duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// Main Homepage Component
export default async function HomePage() {
  const allPosts = await getAllPosts();
  const featuredPosts = allPosts.slice(0, 6); // Show latest 6 posts

  return (
    <main className="min-h-screen">
      {/* Hero Section - Full Width */}
      <HeroSection />
      
      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <Suspense fallback={
          <div className="flex items-center justify-center py-24">
            <div className="animate-pulse text-gray-600">
              Loading posts...
            </div>
          </div>
        }>
          <FeaturedPosts posts={featuredPosts} />
        </Suspense>
      </div>
      
      {/* Newsletter Section - Full Width */}
      <NewsletterSection />
    </main>
  );
}