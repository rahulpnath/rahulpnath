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
    ignoreBuildErrors: true,
  },
});
