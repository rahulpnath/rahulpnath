#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { parse } = require('node-html-parser');
const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');
const axios = require('axios');
const slugify = require('slugify');
const matter = require('gray-matter');
const glob = require('glob');

class GhostToMDX {
  constructor(options = {}) {
    this.options = {
      ghostExportPath: options.ghostExportPath || './ghost-export.json',
      outputDir: options.outputDir || './src/posts',
      imagesDir: options.imagesDir || './public/images',
      downloadImages: options.downloadImages || false,
      imageBaseUrl: options.imageBaseUrl || '',
      skipDrafts: options.skipDrafts !== false,
      runPostProcessing: options.runPostProcessing !== false,
      ...options
    };

    // Initialize Turndown with GFM plugin
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
      fence: '```',
      emDelimiter: '_',
      strongDelimiter: '**',
      linkStyle: 'inlined',
      linkReferenceStyle: 'full'
    });

    this.turndownService.use(gfm);
    this.setupTurndownRules();
  }

  setupTurndownRules() {
    // Handle Ghost cards and embeds
    this.turndownService.addRule('ghostCards', {
      filter: (node) => {
        return node.classList && (
          node.classList.contains('kg-card') ||
          node.classList.contains('kg-embed-card') ||
          node.classList.contains('kg-bookmark-card') ||
          node.classList.contains('kg-image-card')
        );
      },
      replacement: (content, node) => {
        // Handle Ghost bookmark cards
        if (node.classList.contains('kg-bookmark-card')) {
          const titleEl = node.querySelector('.kg-bookmark-title');
          const descEl = node.querySelector('.kg-bookmark-description');
          const iconEl = node.querySelector('.kg-bookmark-icon');
          const linkEl = node.querySelector('a[href]');
          
          const title = titleEl?.textContent?.trim() || '';
          const description = descEl?.textContent?.trim() || '';
          const icon = iconEl?.getAttribute('src') || '';
          const href = linkEl?.getAttribute('href') || '';
          
          if (href && title) {
            const props = [
              `href="${href}"`,
              `title="${title.replace(/"/g, '&quot;')}"`,
              description ? `description="${description.replace(/"/g, '&quot;')}"` : '',
              icon ? `icon="${icon}"` : ''
            ].filter(Boolean).join(' ');
            
            return `<BookmarkCard ${props} />`;
          }
        }
        
        // Handle Ghost embed cards
        if (node.classList.contains('kg-embed-card')) {
          const iframe = node.querySelector('iframe');
          if (iframe) {
            const src = iframe.getAttribute('src');
            const title = iframe.getAttribute('title') || '';
            
            if (src) {
              const props = [
                `src="${src}"`,
                title ? `title="${title.replace(/"/g, '&quot;')}"` : ''
              ].filter(Boolean).join(' ');
              
              return `<EmbedCard ${props} />`;
            }
          }
        }
        
        // Handle Ghost image cards
        if (node.classList.contains('kg-image-card')) {
          const img = node.querySelector('img');
          const figcaption = node.querySelector('figcaption');
          
          if (img) {
            const src = img.getAttribute('src') || '';
            let alt = img.getAttribute('alt') || '';
            const caption = figcaption?.textContent?.trim() || '';
            
            // If alt is empty, use caption as alt text (accessibility)
            if (!alt && caption) {
              alt = caption;
            }
            
            // Process image path for local images
            let imageSrc = src;
            if (this.options.downloadImages && (src.startsWith('http') || src.includes('__GHOST_URL__'))) {
              const filename = this.getImageFilename(src, this.currentPostSlug);
              imageSrc = `/images/${filename}`;
            }
            
            const props = [
              `src="${imageSrc}"`,
              `alt="${alt.replace(/"/g, '&quot;')}"`,
              caption ? `caption="${caption.replace(/"/g, '&quot;')}"` : ''
            ].filter(Boolean).join(' ');
            
            return `<ImageCard ${props} />`;
          }
        }
        
        return content;
      }
    });

    // Handle images with better formatting
    this.turndownService.addRule('images', {
      filter: 'img',
      replacement: (content, node) => {
        const alt = node.getAttribute('alt') || '';
        const src = node.getAttribute('src') || '';
        const title = node.getAttribute('title') || '';
        
        if (this.options.downloadImages && (src.startsWith('http') || src.includes('__GHOST_URL__'))) {
          const filename = this.getImageFilename(src, this.currentPostSlug);
          return title ? `![${alt}](/images/${filename} "${title}")` : `![${alt}](/images/${filename})`;
        }
        
        return title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`;
      }
    });

    // Handle code blocks with language detection
    this.turndownService.addRule('codeBlocks', {
      filter: (node) => {
        return node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE';
      },
      replacement: (content, node) => {
        const code = node.firstChild;
        const language = this.extractLanguageFromClassName(code.className);
        const codeContent = code.textContent || code.innerText || '';
        
        return `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n`;
      }
    });

    // Handle inline code
    this.turndownService.addRule('inlineCode', {
      filter: (node) => {
        return node.nodeName === 'CODE' && node.parentNode.nodeName !== 'PRE';
      },
      replacement: (content, node) => {
        return `\`${node.textContent || node.innerText || ''}\``;
      }
    });

    // Handle figure elements - only process if not a Ghost card
    this.turndownService.addRule('figures', {
      filter: (node) => {
        return node.nodeName === 'FIGURE' && 
               !(node.classList && (
                 node.classList.contains('kg-card') ||
                 node.classList.contains('kg-embed-card') ||
                 node.classList.contains('kg-bookmark-card') ||
                 node.classList.contains('kg-image-card')
               ));
      },
      replacement: (content, node) => {
        let figureContent = [];
        let hasContent = false;
        
        // Convert all children while preserving structure
        for (const child of node.childNodes) {
          if (child.nodeType === 1) { // Element node
            if (child.nodeName === 'IMG') {
              let alt = child.getAttribute('alt') || '';
              const src = child.getAttribute('src') || '';
              
              // Process image path for local images
              let imageSrc = src;
              if (this.options.downloadImages && (src.startsWith('http') || src.includes('__GHOST_URL__'))) {
                const filename = this.getImageFilename(src, this.currentPostSlug);
                imageSrc = `/images/${filename}`;
              }
              
              // For regular figures with images, use ImageCard component
              const caption = node.querySelector('figcaption')?.textContent?.trim() || '';
              
              // If alt is empty, use caption as alt text (accessibility)
              if (!alt && caption) {
                alt = caption;
              }
              
              const props = [
                `src="${imageSrc}"`,
                `alt="${alt.replace(/"/g, '&quot;')}"`,
                caption ? `caption="${caption.replace(/"/g, '&quot;')}"` : ''
              ].filter(Boolean).join(' ');
              
              return `<ImageCard ${props} />`;
            } else if (child.nodeName === 'FIGCAPTION') {
              const captionText = child.textContent || child.innerText || '';
              if (captionText.trim()) {
                figureContent.push(`<figcaption>${captionText}</figcaption>`);
                hasContent = true;
              }
            } else if (child.nodeName === 'IFRAME') {
              // Handle iframe embeds in figures
              const src = child.getAttribute('src') || '';
              const title = child.getAttribute('title') || '';
              
              if (src) {
                const props = [
                  `src="${src}"`,
                  title ? `title="${title.replace(/"/g, '&quot;')}"` : ''
                ].filter(Boolean).join(' ');
                
                return `<EmbedCard ${props} />`;
              }
            }
          }
        }
        
        // Only create figure if it has actual content and no specific handling was done
        if (hasContent && figureContent.length > 0) {
          return `<figure>\n${figureContent.join('\n')}\n</figure>`;
        }
        
        // If no processable content, return empty string to avoid empty figures
        return '';
      }
    });

    // Handle standalone figcaption (preserve if not inside figure)
    this.turndownService.addRule('figcaption', {
      filter: 'figcaption',
      replacement: (content, node) => {
        // Only handle if not already processed by figure rule
        if (node.parentNode && node.parentNode.nodeName !== 'FIGURE') {
          return `<figcaption>${content}</figcaption>`;
        }
        return content;
      }
    });
  }

  extractLanguageFromClassName(className) {
    if (!className) return '';
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : '';
  }

  getImageFilename(url, postSlug) {
    const urlObj = new URL(url);
    const originalFilename = path.basename(urlObj.pathname) || 'image.jpg';
    const extension = path.extname(originalFilename) || '.jpg';
    const nameWithoutExt = path.basename(originalFilename, extension);
    
    // Create unique filename by prefixing with post slug
    return `${postSlug}-${nameWithoutExt}${extension}`;
  }

  async downloadImage(url, filename) {
    // Skip download for Ghost URLs since they're placeholder URLs
    if (url.includes('__GHOST_URL__')) {
      console.log(`Skipping Ghost URL: ${url}`);
      return;
    }
    
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });

      const filepath = path.join(this.options.imagesDir, filename);
      await fs.ensureDir(path.dirname(filepath));
      
      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      console.warn(`Failed to download image ${url}:`, error.message);
    }
  }

  createSlug(title) {
    return slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  extractExcerpt(content, maxLength = 160) {
    const text = content.replace(/[#*`_\[\]]/g, '').replace(/\n/g, ' ').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  async processImages(content, postSlug) {
    if (!this.options.downloadImages) return content;

    const root = parse(content);
    const images = root.querySelectorAll('img');
    
    for (const img of images) {
      const src = img.getAttribute('src');
      if (src && (src.startsWith('http') || src.includes('__GHOST_URL__'))) {
        const filename = this.getImageFilename(src, postSlug);
        await this.downloadImage(src, filename);
        console.log(`Downloaded image: ${filename}`);
      }
    }

    return content;
  }

  async convertPost(post) {
    const { title, slug, html, published_at, feature_image, tags, custom_excerpt, status } = post;

    // Skip drafts if configured
    if (this.options.skipDrafts && status !== 'published') {
      return null;
    }

    // Process images if downloading is enabled
    const processedHtml = await this.processImages(html, slug);

    // Set current post slug for turndown service
    this.currentPostSlug = slug;

    // Convert HTML to Markdown
    const markdownContent = this.turndownService.turndown(processedHtml);

    // Generate frontmatter
    const frontmatter = {
      title: title,
      slug: slug || this.createSlug(title),
      date: this.formatDate(published_at),
      ...(feature_image && {
        feature_image: this.options.downloadImages && (feature_image.startsWith('http') || feature_image.includes('__GHOST_URL__'))
          ? `/images/${this.getImageFilename(feature_image, slug)}`
          : feature_image
      }),
      ...(tags && tags.length > 0 && {
        tags: tags.map(tag => tag.name)
      }),
      ...(custom_excerpt && { excerpt: custom_excerpt })
    };

    // Download feature image if needed
    if (this.options.downloadImages && feature_image && (feature_image.startsWith('http') || feature_image.includes('__GHOST_URL__'))) {
      const filename = this.getImageFilename(feature_image, slug);
      await this.downloadImage(feature_image, filename);
      console.log(`Downloaded feature image: ${filename}`);
    }

    // Create full MDX content
    const fullContent = matter.stringify(markdownContent, frontmatter);

    return {
      filename: `${frontmatter.slug}.mdx`,
      content: fullContent
    };
  }

  // Post-processing functions
  async fixGhostUrls() {
    console.log('\n🔧 Post-processing: Fixing Ghost URL placeholders...');
    const files = await fs.readdir(this.options.outputDir);
    const mdxFiles = files.filter(file => file.endsWith('.mdx')).map(file => path.join(this.options.outputDir, file));
    
    let fixedCount = 0;
    let totalReplacements = 0;

    for (const filePath of mdxFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        if (content.includes('__GHOST_URL__')) {
          let fixedContent = content.replace(/__GHOST_URL__/g, '');
          fixedContent = fixedContent.replace(/\/\/+/g, '/');
          
          const replacements = (content.match(/__GHOST_URL__/g) || []).length;
          totalReplacements += replacements;
          
          await fs.writeFile(filePath, fixedContent, 'utf-8');
          fixedCount++;
        }
      } catch (error) {
        console.error(`Error fixing Ghost URLs in ${filePath}:`, error.message);
      }
    }

    console.log(`  ✓ Fixed Ghost URLs in ${fixedCount} files (${totalReplacements} replacements)`);
  }

  async fixImagePaths() {
    console.log('🔧 Post-processing: Fixing image paths...');
    const files = await fs.readdir(this.options.outputDir);
    const mdxFiles = files.filter(file => file.endsWith('.mdx')).map(file => path.join(this.options.outputDir, file));
    
    let fixedCount = 0;
    let totalReplacements = 0;

    for (const filePath of mdxFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        if (content.includes('/content/images/')) {
          let fixedContent = content.replace(/\/content\/images\//g, '/images/');
          
          const replacements = (content.match(/\/content\/images\//g) || []).length;
          totalReplacements += replacements;
          
          await fs.writeFile(filePath, fixedContent, 'utf-8');
          fixedCount++;
        }
      } catch (error) {
        console.error(`Error fixing image paths in ${filePath}:`, error.message);
      }
    }

    console.log(`  ✓ Fixed image paths in ${fixedCount} files (${totalReplacements} replacements)`);
  }

  async fixDateImagePaths() {
    console.log('🔧 Post-processing: Fixing date-based image paths...');
    const imagesDir = this.options.imagesDir;
    
    // Get list of actual images in the images directory
    const actualImages = await fs.readdir(imagesDir);
    const imageMap = new Map();
    
    actualImages.forEach(img => {
      imageMap.set(img.toLowerCase(), img);
    });
    
    const files = await fs.readdir(this.options.outputDir);
    const mdxFiles = files.filter(file => file.endsWith('.mdx')).map(file => path.join(this.options.outputDir, file));
    
    let fixedCount = 0;
    let totalReplacements = 0;

    for (const filePath of mdxFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        let fixedContent = content;
        let hasChanges = false;
        
        const datePathRegex = /\/images\/\d{4}\/\d{2}\/([^\/\s"')]+)/g;
        
        let match;
        while ((match = datePathRegex.exec(content)) !== null) {
          const fullPath = match[0];
          const filename = match[1];
          
          const actualFilename = imageMap.get(filename.toLowerCase());
          if (actualFilename) {
            const newPath = `/images/${actualFilename}`;
            fixedContent = fixedContent.replace(fullPath, newPath);
            hasChanges = true;
            totalReplacements++;
          }
        }
        
        if (hasChanges) {
          await fs.writeFile(filePath, fixedContent, 'utf-8');
          fixedCount++;
        }
      } catch (error) {
        console.error(`Error fixing date paths in ${filePath}:`, error.message);
      }
    }

    console.log(`  ✓ Fixed date-based image paths in ${fixedCount} files (${totalReplacements} replacements)`);
  }

  async fixMalformedUrls() {
    console.log('🔧 Post-processing: Fixing malformed URLs...');
    const files = await fs.readdir(this.options.outputDir);
    const mdxFiles = files.filter(file => file.endsWith('.mdx')).map(file => path.join(this.options.outputDir, file));
    
    let fixedCount = 0;
    let totalReplacements = 0;

    for (const filePath of mdxFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        let fixedContent = content;
        let hasChanges = false;
        
        const urlFixes = [
          { pattern: /http:\/([^\/])/g, replacement: 'http://$1' },
          { pattern: /https:\/([^\/])/g, replacement: 'https://$1' },
          { pattern: /\]\(([^)]+)%22\)/g, replacement: ']($1")' },
          { pattern: /\(\(http/g, replacement: '(http' },
        ];
        
        for (const fix of urlFixes) {
          const beforeLength = fixedContent.length;
          fixedContent = fixedContent.replace(fix.pattern, fix.replacement);
          const afterLength = fixedContent.length;
          
          if (beforeLength !== afterLength) {
            hasChanges = true;
            const replacements = (content.match(fix.pattern) || []).length;
            totalReplacements += replacements;
          }
        }
        
        if (hasChanges) {
          await fs.writeFile(filePath, fixedContent, 'utf-8');
          fixedCount++;
        }
      } catch (error) {
        console.error(`Error fixing URLs in ${filePath}:`, error.message);
      }
    }

    console.log(`  ✓ Fixed malformed URLs in ${fixedCount} files (${totalReplacements} replacements)`);
  }

  async fixImageSubdirectories() {
    console.log('🔧 Post-processing: Fixing image subdirectories...');
    const files = glob.sync('**/*.mdx', { cwd: this.options.outputDir });
    
    let fixedCount = 0;
    let totalReplacements = 0;

    for (const file of files) {
      try {
        const filePath = path.join(this.options.outputDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        let fileReplacements = 0;

        const patterns = [
          { search: /\/images\/icon\//g, replace: '/images/' },
          { search: /\/images\/thumbnail\//g, replace: '/images/' }
        ];

        patterns.forEach(pattern => {
          const matches = content.match(pattern.search);
          if (matches) {
            content = content.replace(pattern.search, pattern.replace);
            modified = true;
            fileReplacements += matches.length;
          }
        });

        if (modified) {
          fs.writeFileSync(filePath, content);
          totalReplacements += fileReplacements;
          fixedCount++;
        }
      } catch (error) {
        console.error(`Error fixing subdirectories in ${file}:`, error.message);
      }
    }

    console.log(`  ✓ Fixed image subdirectories in ${fixedCount} files (${totalReplacements} replacements)`);
  }

  async addTagsToFrontmatter() {
    console.log('🔧 Post-processing: Adding tags to frontmatter...');
    
    const ghostData = await fs.readJson(this.options.ghostExportPath);
    const data = ghostData.db[0].data;
    
    const posts = data.posts || [];
    const tags = data.tags || [];
    const postsTags = data.posts_tags || [];
    
    // Create lookup maps
    const tagMap = new Map();
    tags.forEach(tag => {
      tagMap.set(tag.id, tag.name);
    });
    
    const postTagMap = new Map();
    postsTags.forEach(relationship => {
      const postId = relationship.post_id;
      const tagId = relationship.tag_id;
      const tagName = tagMap.get(tagId);
      
      if (tagName) {
        if (!postTagMap.has(postId)) {
          postTagMap.set(postId, []);
        }
        postTagMap.get(postId).push(tagName);
      }
    });
    
    const slugToTagsMap = new Map();
    posts.forEach(post => {
      if (post.slug && postTagMap.has(post.id)) {
        slugToTagsMap.set(post.slug, postTagMap.get(post.id));
      }
    });
    
    const files = glob.sync('**/*.mdx', { cwd: this.options.outputDir });
    
    let updatedCount = 0;
    let addedTagsCount = 0;
    
    for (const file of files) {
      const filePath = path.join(this.options.outputDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      const parsed = matter(fileContent);
      const slug = parsed.data.slug;
      
      if (slug && slugToTagsMap.has(slug)) {
        const tags = slugToTagsMap.get(slug);
        
        if (!parsed.data.tags || parsed.data.tags.length === 0) {
          parsed.data.tags = tags;
          
          const newContent = matter.stringify(parsed.content, parsed.data);
          await fs.writeFile(filePath, newContent);
          
          updatedCount++;
          addedTagsCount += tags.length;
        }
      }
    }

    console.log(`  ✓ Added tags to ${updatedCount} files (${addedTagsCount} total tags)`);
  }

  async fixAllExcerpts() {
    console.log('🔧 Post-processing: Fixing excerpts...');
    
    const ghostData = await fs.readJson(this.options.ghostExportPath);
    const ghostPosts = ghostData.db[0].data.posts;
    
    const excerptMap = new Map();
    ghostPosts.forEach(post => {
      if (post.custom_excerpt) {
        excerptMap.set(post.slug, post.custom_excerpt);
      }
    });
    
    const files = await fs.readdir(this.options.outputDir);
    const mdxFiles = files.filter(file => file.endsWith('.mdx')).map(file => path.join(this.options.outputDir, file));
    
    let updatedCount = 0;
    let removedCount = 0;
    
    for (const filePath of mdxFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const { data: frontmatter, content: markdownContent } = matter(content);
        
        const slug = frontmatter.slug;
        const ghostExcerpt = excerptMap.get(slug);
        
        let hasChanges = false;
        
        if (ghostExcerpt) {
          if (frontmatter.excerpt !== ghostExcerpt) {
            frontmatter.excerpt = ghostExcerpt;
            hasChanges = true;
            updatedCount++;
          }
        } else {
          if (frontmatter.excerpt) {
            delete frontmatter.excerpt;
            hasChanges = true;
            removedCount++;
          }
        }
        
        if (hasChanges) {
          const newContent = matter.stringify(markdownContent, frontmatter);
          await fs.writeFile(filePath, newContent, 'utf-8');
        }
        
      } catch (error) {
        console.error(`Error fixing excerpts in ${filePath}:`, error.message);
      }
    }
    
    console.log(`  ✓ Updated excerpts in ${updatedCount} files, removed from ${removedCount} files`);
  }

  async runPostProcessing() {
    if (!this.options.runPostProcessing) {
      return;
    }

    console.log('\n=== Running Post-Processing ===');
    
    try {
      await this.fixGhostUrls();
      // Disabled image path fixing to preserve unique filenames
      // await this.fixImagePaths();
      // await this.fixDateImagePaths();
      // await this.fixMalformedUrls();
      // await this.fixImageSubdirectories();
      
      console.log('\n✅ Post-processing complete!');
    } catch (error) {
      console.error('❌ Post-processing failed:', error);
    }
  }

  async migrate() {
    try {
      console.log('Starting Ghost to MDX migration...');

      // Read Ghost export
      const ghostData = await fs.readJson(this.options.ghostExportPath);
      const posts = ghostData.db[0].data.posts;

      console.log(`Found ${posts.length} posts to process`);

      // Ensure output directory exists
      await fs.ensureDir(this.options.outputDir);
      if (this.options.downloadImages) {
        await fs.ensureDir(this.options.imagesDir);
      }

      let processedCount = 0;
      let skippedCount = 0;

      for (const post of posts) {
        try {
          const result = await this.convertPost(post);
          
          if (result) {
            const filepath = path.join(this.options.outputDir, result.filename);
            await fs.writeFile(filepath, result.content, 'utf-8');
            console.log(`✓ Converted: ${result.filename}`);
            processedCount++;
          } else {
            console.log(`⏭ Skipped: ${post.title} (draft or unpublished)`);
            skippedCount++;
          }
        } catch (error) {
          console.error(`✗ Failed to convert "${post.title}":`, error.message);
        }
      }

      console.log('\n=== Migration Complete ===');
      console.log(`Processed: ${processedCount} posts`);
      console.log(`Skipped: ${skippedCount} posts`);
      console.log(`Output directory: ${this.options.outputDir}`);
      if (this.options.downloadImages) {
        console.log(`Images directory: ${this.options.imagesDir}`);ws
      }

      // Run post-processing
      await this.runPostProcessing();

    } catch (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Ghost to MDX Migration Tool with Post-Processing

Usage: node ghost-to-mdx.js [options]

Options:
  --input <path>        Path to Ghost JSON export (default: ./ghost-export.json)
  --output <path>       Output directory for MDX files (default: ./src/posts)
  --images <path>       Images directory (default: ./public/images)
  --download-images     Download images locally
  --image-base <url>    Base URL for images if not downloading
  --include-drafts      Include draft posts
  --skip-post-processing Skip automatic post-processing steps
  --help, -h            Show this help

Post-processing includes:
  • Fix Ghost URL placeholders (__GHOST_URL__)
  • Fix image paths (/content/images/ → /images/)
  • Fix date-based image paths (/images/2024/12/ → /images/)
  • Fix malformed URLs and encoding issues
  • Remove unwanted image subdirectories

Note: Tags and excerpts are automatically handled during conversion

Examples:
  node ghost-to-mdx.js --input export.json --download-images
  node ghost-to-mdx.js --output ./content/posts --include-drafts
  node ghost-to-mdx.js --skip-post-processing
    `);
    process.exit(0);
  }

  const options = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--input':
        options.ghostExportPath = value;
        break;
      case '--output':
        options.outputDir = value;
        break;
      case '--images':
        options.imagesDir = value;
        break;
      case '--download-images':
        options.downloadImages = true;
        i--; // No value for this flag
        break;
      case '--image-base':
        options.imageBaseUrl = value;
        break;
      case '--include-drafts':
        options.skipDrafts = false;
        i--; // No value for this flag
        break;
      case '--skip-post-processing':
        options.runPostProcessing = false;
        i--; // No value for this flag
        break;
    }
  }

  const migrator = new GhostToMDX(options);
  migrator.migrate();
}

module.exports = GhostToMDX;