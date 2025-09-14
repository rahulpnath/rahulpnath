const remarkBlogCards = require('./src/lib/remark-blog-cards.js');

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "./src/mdx-components", // 👈 point to your file
    remarkPlugins: [remarkBlogCards],
  },
});

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});