# Ghost to MDX Migration Guide

This guide walks you through migrating your Ghost blog content to MDX files for your Next.js blog.

## Overview

The migration process converts Ghost's HTML content to properly formatted MDX files with frontmatter, preserving:
- ✅ Code blocks with syntax highlighting
- ✅ Headings and subheadings (for ToC generation)
- ✅ Lists, blockquotes, inline code, and links
- ✅ Images (with local download option)
- ✅ YouTube embeds and other media
- ✅ Proper frontmatter generation
- ✅ Content filtering (published posts only)

## Prerequisites

Make sure you have the required dependencies installed:
```bash
npm install turndown-plugin-gfm node-html-parser axios slugify
```

## Step 1: Export from Ghost

1. Go to your Ghost Admin panel
2. Navigate to **Settings** > **Labs**
3. Click **Export your content**
4. Download the JSON file (usually named like `your-site-2024-01-15.json`)
5. Place it in your project root as `ghost-export.json`

## Step 2: Configure Migration

Edit `ghost-migration.config.js` to customize the migration:

```javascript
module.exports = {
  ghostExportPath: './ghost-export.json',    // Path to your Ghost export
  outputDir: './src/posts',                  // Where to save MDX files
  imagesDir: './public/images',              // Where to save images
  downloadImages: true,                      // Download images locally
  skipDrafts: true,                         // Skip draft posts
  // ... more options
};
```

## Step 3: Run Migration

### Option 1: Basic Migration (Keep Remote Images)
```bash
npm run migrate:ghost
```

### Option 2: Download Images Locally (Recommended)
```bash
npm run migrate:ghost:images
```

### Option 3: Custom Migration
```bash
node scripts/ghost-to-mdx.js --input your-export.json --output ./content/posts --download-images
```

## Available Scripts

- `npm run migrate:ghost` - Basic migration with remote images
- `npm run migrate:ghost:images` - Migration with local image download
- `npm run migrate:ghost:help` - Show all available options

## Command Line Options

```bash
node scripts/ghost-to-mdx.js [options]

Options:
  --input <path>        Path to Ghost JSON export (default: ./ghost-export.json)
  --output <path>       Output directory for MDX files (default: ./src/posts)
  --images <path>       Images directory (default: ./public/images)
  --download-images     Download images locally
  --image-base <url>    Base URL for images if not downloading
  --include-drafts      Include draft posts
  --help, -h            Show help
```

## What Gets Converted

### Frontmatter Structure
Each MDX file will have frontmatter like this:

```yaml
---
title: "Your Post Title"
slug: "your-post-title"
date: "2024-01-15"
feature_image: "/images/feature-image.jpg"
tags: ["JavaScript", "React", "Next.js"]
excerpt: "A brief description of your post..."
---
```

### Content Conversions

| Ghost Element | MDX Output |
|---------------|------------|
| `<h1>`, `<h2>`, etc. | `#`, `##`, etc. |
| `<p>` | Regular paragraphs |
| `<ul>`, `<ol>` | Markdown lists |
| `<blockquote>` | `> Quote text` |
| `<code>` | `` `inline code` `` |
| `<pre><code class="language-js">` | ````js` code blocks |
| `<img src="...">` | `![alt](src)` |
| Ghost embeds | Custom components |

### Embed Conversions

- **YouTube videos**: `<iframe src="https://youtube.com/embed/..." />`
- **Twitter embeds**: `<Tweet url="..." />` (requires custom component)
- **Code blocks**: Proper syntax highlighting with language detection

## Testing the Migration

1. Create a test export with a few posts:
```bash
# Use the example file to test
cp ghost-export-example.json ghost-export.json
npm run migrate:ghost
```

2. Check the generated files in `src/posts/`
3. Verify images are downloaded to `public/images/` (if using `--download-images`)

## Troubleshooting

### Common Issues

**Error: Cannot find module 'turndown-plugin-gfm'**
```bash
npm install turndown-plugin-gfm
```

**Images not downloading**
- Check your internet connection
- Verify image URLs are accessible
- Check write permissions to `public/images/`

**Posts not appearing**
- Ensure posts have `status: "published"`
- Check the `skipDrafts` option in config
- Verify the Ghost export file structure

**HTML not converting properly**
- Ghost cards may need custom handling
- Check the `customReplacements` in config
- Some complex HTML might need manual cleanup

### Debugging

Enable verbose logging by editing the script:
```javascript
// Add at the top of ghost-to-mdx.js
const DEBUG = true;
if (DEBUG) console.log('Debug info:', data);
```

## Post-Migration Steps

1. **Review generated files** - Check a few MDX files for formatting issues
2. **Test your blog** - Run `npm run dev` and browse your posts
3. **Update image paths** - Ensure all images load correctly
4. **SEO check** - Verify meta descriptions and titles
5. **Clean up** - Remove unused Ghost export files

## Customization

### Adding Custom Components

For Ghost cards that need special handling, add to `customReplacements`:

```javascript
customReplacements: [
  {
    pattern: /<div class="kg-callout-card">(.*?)<\/div>/gs,
    replacement: '<Callout>$1</Callout>'
  }
]
```

Then create the component in your MDX setup:

```jsx
// mdx-components.tsx
export function Callout({ children }) {
  return <div className="callout">{children}</div>
}
```

### Filtering Posts

Use the `filters` configuration to control which posts get migrated:

```javascript
filters: {
  status: ['published'],
  tags: {
    exclude: ['private', 'draft']
  },
  dateRange: {
    from: '2023-01-01'
  }
}
```

## Support

- Check the console output for detailed error messages
- Review the generated MDX files for formatting issues
- For Ghost-specific export problems, consult [Ghost's documentation](https://ghost.org/docs/migration/)

## Example Workflow

```bash
# 1. Export from Ghost Admin panel
# 2. Place export file in project root
mv ~/Downloads/my-blog-2024-01-15.json ./ghost-export.json

# 3. Run migration with image download
npm run migrate:ghost:images

# 4. Review generated files
ls src/posts/

# 5. Test your blog
npm run dev

# 6. Clean up
rm ghost-export.json
```

Your Ghost content is now ready to use in your Next.js MDX blog! 🎉