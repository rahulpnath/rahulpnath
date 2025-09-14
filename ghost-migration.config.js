module.exports = {
  // Path to your Ghost export JSON file
  ghostExportPath: './ghost-export.json',
  
  // Output directory for generated MDX files
  outputDir: './src/posts',
  
  // Directory for downloaded images
  imagesDir: './public/images',
  
  // Whether to download images locally (recommended for production)
  downloadImages: true,
  
  // Base URL for images if not downloading them locally
  // Useful if you want to keep images on Ghost/CDN
  imageBaseUrl: 'https://your-ghost-site.com',
  
  // Skip draft and unpublished posts
  skipDrafts: true,
  
  // Custom slug generation options
  slugOptions: {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  },
  
  // Excerpt settings
  excerpt: {
    maxLength: 160,
    fallbackFromContent: true
  },
  
  // Turndown service options for HTML to Markdown conversion
  turndownOptions: {
    headingStyle: 'atx',        // # ## ### style headings
    hr: '---',                  // Horizontal rule style
    bulletListMarker: '-',      // Use - for bullet lists
    codeBlockStyle: 'fenced',   // Use ``` for code blocks
    fence: '```',               // Code block fence characters
    emDelimiter: '_',           // Use _ for emphasis
    strongDelimiter: '**',      // Use ** for strong text
    linkStyle: 'inlined',       // Inline link style
    linkReferenceStyle: 'full'  // Reference link style
  },
  
  // Custom replacements for specific HTML patterns
  customReplacements: [
    {
      // Convert Ghost callout cards to custom components
      pattern: /<div class="kg-callout-card kg-callout-card-(\w+)">(.*?)<\/div>/gs,
      replacement: '<Callout type="$1">$2</Callout>'
    },
    {
      // Convert Ghost button cards to custom components
      pattern: /<div class="kg-button-card kg-align-center"><a href="([^"]+)" class="kg-btn kg-btn-accent">([^<]+)<\/a><\/div>/g,
      replacement: '<Button href="$1">$2</Button>'
    }
  ],
  
  // Image processing options
  imageOptions: {
    // Maximum width for downloaded images (optional)
    maxWidth: 1200,
    
    // Image formats to process
    formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    
    // Whether to optimize images during download
    optimize: false
  },
  
  // Frontmatter template
  frontmatterTemplate: {
    title: true,          // Always include title
    slug: true,           // Always include slug
    date: true,           // Always include publication date
    feature_image: true,  // Include feature image if present
    tags: true,           // Include tags if present
    excerpt: true,        // Include excerpt
    author: false,        // Skip author info
    reading_time: false,  // Skip reading time
    featured: false       // Skip featured flag
  },
  
  // Post filtering options
  filters: {
    // Only include posts with these statuses
    status: ['published'],
    
    // Only include posts with these visibility settings
    visibility: ['public'],
    
    // Date range filter (optional)
    dateRange: {
      // from: '2023-01-01',
      // to: '2024-12-31'
    },
    
    // Tag filtering (optional)
    tags: {
      // include: ['javascript', 'react'], // Only posts with these tags
      // exclude: ['draft', 'private']     // Exclude posts with these tags
    }
  }
};