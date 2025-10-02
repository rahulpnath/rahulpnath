const remarkBlogCards = require("./src/lib/remark-blog-cards.js");

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "./src/mdx-components", // 👈 point to your file
    remarkPlugins: [remarkBlogCards],
    // Using prism-react-renderer instead of rehype-prism-plus
  },
});

module.exports = withMDX({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript checking during builds
    ignoreBuildErrors: false,
  },
  
  // Compiler options for better browser compatibility
  compiler: {
    // Remove console.log in production but keep error tracking
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  
  // Image optimization settings for better performance
  images: {
    // AVIF first for best compression, WebP as fallback
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // Faster dev builds - disable optimization in development
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ]
  },
  // Remove X-Powered-By header
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
  
  // Enable React strict mode for better development
  reactStrictMode: true,
});
