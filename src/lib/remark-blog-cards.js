const { visit } = require('unist-util-visit');

function remarkBlogCards() {
  return (tree) => {
    const nodesToReplace = [];
    console.log('🔍 Remark plugin running...');
    
    // First pass: identify blog card patterns
    visit(tree, (node, _, parent) => {
      if (!parent || !parent.children) return;
      
      // Look for links that start with /blog/ and contain complex content
      if (node.type === 'paragraph' && 
          node.children && 
          node.children.length === 1 && 
          node.children[0].type === 'link' &&
          node.children[0].url &&
          node.children[0].url.startsWith('/blog/')) {
        
        const link = node.children[0];
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
          console.log('📝 Found blog card:', { textNodes: textNodes.length, images: images.length, href: link.url });
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
            href: link.url
          });
        }
      }
    });
    
    // Second pass: perform replacements (in reverse order to maintain indices)
    nodesToReplace.reverse().forEach(({ parentIndex, parent, title, description, authorImage, featureImage, href }) => {
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
            value: authorImage
          },
          {
            type: 'mdxJsxAttribute',
            name: 'featureImage',
            value: featureImage
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