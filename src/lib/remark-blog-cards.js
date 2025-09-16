const { visit } = require('unist-util-visit');

// Helper function to extract metadata from URLs
function getUrlMetadata(url) {
  if (url.includes('youtube.com') && url.includes('playlist')) {
    return {
      title: 'AWS Lambda Powertools',
      description: 'Powertools for AWS Lambda (.NET) is a suite of utilities for AWS Lambda functions to ease the adoption of best practices such as tracing, structured logging, and more.',
      authorImage: '/images/favicon_144x144.png',
      featureImage: '/images/studio_square_thumbnail.jpg',
      authorName: 'YouTube'
    };
  }
  
  // Add more URL patterns as needed
  if (url.includes('youtube.com')) {
    return {
      title: 'YouTube Video',
      description: 'Watch this video on YouTube',
      authorImage: '/images/favicon_144x144.png',
      featureImage: '/images/default-video-thumbnail.jpg',
      authorName: 'YouTube'
    };
  }
  
  return null;
}

function remarkBlogCards() {
  return (tree) => {
    const nodesToReplace = [];
    console.log('🔍 Remark plugin running...');
    
    // First pass: identify blog card patterns
    visit(tree, (node, _, parent) => {
      if (!parent || !parent.children) return;
      
      // Look for links with complex content (both internal /blog/ and external)
      if (node.type === 'paragraph' && 
          node.children && 
          node.children.length === 1 && 
          node.children[0].type === 'link' &&
          node.children[0].url) {
        
        const link = node.children[0];
        const url = link.url;
        
        // Handle internal blog links
        if (url.startsWith('/blog/')) {
          const linkContent = link.children || [];
          
          // Check if this link has the blog card pattern (text nodes and images)
          let textNodes = [];
          let images = [];
          
          function extractFromChildren(children) {
            for (const child of children) {
              if (child.type === 'text' && child.value.trim()) {
                textNodes.push(child.value.trim());
              } else if (child.type === 'image') {
                images.push(child);
              } else if (child.children) {
                extractFromChildren(child.children);
              }
            }
          }
          
          extractFromChildren(linkContent);
          
          // If we have multiple text nodes and images, it's likely a blog card
          if (textNodes.length >= 2 && images.length >= 1) {
            console.log('📝 Found internal blog card:', { textNodes: textNodes.length, images: images.length, href: url });
            const title = textNodes[0];
            const description = textNodes[1];
            
            let authorImage = '';
            let featureImage = '';
            
            // Categorize images
            for (const img of images) {
              if (img.url && (img.url.includes('logo') || img.url.includes('512x512'))) {
                authorImage = img.url;
              } else if (img.url) {
                featureImage = img.url;
              }
            }
            
            // Store replacement info
            nodesToReplace.push({
              parentIndex: parent.children.indexOf(node),
              parent: parent,
              title: title,
              description: description,
              authorImage: authorImage,
              featureImage: featureImage,
              href: url,
              type: 'internal'
            });
          }
        } else {
          // Handle external links with complex content
          const linkContent = link.children || [];
          
          // Check if this external link has rich content
          let textNodes = [];
          let images = [];
          
          function extractFromChildren(children) {
            for (const child of children) {
              if (child.type === 'text' && child.value.trim()) {
                textNodes.push(child.value.trim());
              } else if (child.type === 'image') {
                images.push(child);
              } else if (child.children) {
                extractFromChildren(child.children);
              }
            }
          }
          
          extractFromChildren(linkContent);
          
          // If we have text and images, try to create a rich card
          if (textNodes.length >= 1 && images.length >= 1) {
            console.log('📝 Found external link card:', { textNodes: textNodes.length, images: images.length, href: url });
            
            // Try to get metadata from URL pattern
            const metadata = getUrlMetadata(url);
            
            if (metadata) {
              // Use extracted text if available, otherwise use metadata
              const title = textNodes[0] || metadata.title;
              const description = textNodes[1] || metadata.description;
              
              // Use first image as feature image
              let featureImage = images[0]?.url || metadata.featureImage;
              let authorImage = metadata.authorImage;
              
              // Look for author/logo images
              for (const img of images) {
                if (img.url && (img.url.includes('logo') || img.url.includes('favicon') || img.url.includes('144x144'))) {
                  authorImage = img.url;
                } else if (!featureImage) {
                  featureImage = img.url;
                }
              }
              
              // Store replacement info
              nodesToReplace.push({
                parentIndex: parent.children.indexOf(node),
                parent: parent,
                title: title,
                description: description,
                authorImage: authorImage,
                featureImage: featureImage,
                href: url,
                type: 'external'
              });
            }
          }
        }
      }
    });
    
    // Second pass: perform replacements (in reverse order to maintain indices)
    nodesToReplace.reverse().forEach(({ parentIndex, parent, title, description, authorImage, featureImage, href, type }) => {
      console.log(`🔄 Creating ${type} BlogLink for: ${title}`);
      
      const jsxElement = {
        type: 'mdxJsxFlowElement',
        name: 'BlogLink',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'href',
            value: href
          },
          {
            type: 'mdxJsxAttribute',
            name: 'title',
            value: title
          },
          {
            type: 'mdxJsxAttribute',
            name: 'description',
            value: description
          },
          {
            type: 'mdxJsxAttribute',
            name: 'authorImage',
            value: authorImage || '/images/logo-512x512-24.png'
          },
          {
            type: 'mdxJsxAttribute',
            name: 'featureImage',
            value: featureImage || '/images/default-feature.jpg'
          }
        ],
        children: []
      };
      
      // Replace the paragraph containing the complex link
      parent.children[parentIndex] = jsxElement;
    });
  };
}

module.exports = remarkBlogCards;