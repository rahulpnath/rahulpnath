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
