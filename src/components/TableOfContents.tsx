'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content?: string;
  className?: string;
}

export default function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Extract headings from content or from the page
  useEffect(() => {
    const extractHeadingsFromDOM = () => {
      // Get headings from the actual DOM with more specific selectors
      const headings = document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6, main h1, main h2, main h3, main h4, main h5, main h6');
      
      const items: TOCItem[] = Array.from(headings)
        .filter((heading) => {
          // Skip headings that are in the header section (article title)
          return !heading.closest('header');
        })
        .map((heading) => {
          const level = parseInt(heading.tagName.charAt(1));
          let text = heading.textContent || '';
          
          // Clean up the text (remove any extra whitespace)
          text = text.trim();
          
          // Generate or get existing ID
          let id = heading.id;
          if (!id) {
            id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .trim();
            heading.id = id;
          }

          return { id, text, level };
        });

      return items;
    };

    const extractHeadingsFromContent = () => {
      if (!content) return [];
      
      // Parse headings from content using regex
      const headingRegex = /^(#{2,6})\s+(.+)$/gm;
      const items: TOCItem[] = [];
      let match;
      
      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        
        items.push({ id, text, level });
      }
      
      return items;
    };

    const extractHeadings = () => {
      const domItems = extractHeadingsFromDOM();
      
      if (domItems.length > 0) {
        setTocItems(domItems);
      } else if (content) {
        // Fallback to parsing content
        const contentItems = extractHeadingsFromContent();
        setTocItems(contentItems);
      }
    };

    // Extract headings after multiple delays to ensure content is fully rendered
    const timer1 = setTimeout(extractHeadings, 100);
    const timer2 = setTimeout(extractHeadings, 500);
    const timer3 = setTimeout(extractHeadings, 1000);
    
    // Immediate extraction for content-based parsing
    if (content) {
      extractHeadings();
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [content]);

  // Handle scroll spy for active heading
  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      const headings = tocItems.map(item => {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return {
            id: item.id,
            top: rect.top,
            element
          };
        }
        return null;
      }).filter(Boolean);

      // Find the heading that's currently visible (with some offset)
      const current = headings.find(heading => heading!.top >= -100 && heading!.top <= 200);
      
      if (current) {
        setActiveId(current.id);
      } else {
        // If no heading is in the viewport, find the closest one above
        const aboveViewport = headings.filter(heading => heading!.top < -100);
        if (aboveViewport.length > 0) {
          const closest = aboveViewport[aboveViewport.length - 1];
          setActiveId(closest!.id);
        }
      }
    };

    handleScroll(); // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <style jsx>{`
        .ez-toc-counter ul {
          list-style: none;
          padding-left: 30px;
        }
        .ez-toc-counter ul li {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          position: relative;
        }
        .ez-toc-counter ul li::after {
          content: "";
          display: block;
          position: absolute;
          width: 16px;
          height: 16px;
          top: 3px;
          left: -28px;
          background: url('/chevron-right-orange.png');
          background-repeat: no-repeat;
          background-size: contain;
          filter: hue-rotate(280deg) saturate(1.5) brightness(0.7);
          transition: all 0.2s ease-out;
          transform: scale(1);
          opacity: 0.7;
        }
        .ez-toc-counter ul li:hover::after {
          transform: scale(1.15);
          filter: hue-rotate(280deg) saturate(1.8) brightness(0.6);
        }
        .ez-toc-counter ul li.active::after {
          filter: hue-rotate(280deg) saturate(1.8) brightness(0.6);
          opacity: 1;
        }
      `}</style>
      
      {/* TOC Items - Ali Abdaal exact styling with header inside */}
      <div 
        className="ez-toc-counter mt-8 border-l-2 border-theme-border-light pl-4 pt-2"
      >
        {/* Header inside the bordered area */}
        <div className="mb-4">
          <p className="font-medium text-theme-text">In this article:</p>
        </div>
        <nav>
          <ul className="list-disc ml-4">
            {tocItems.map((item) => (
              <li key={item.id} className={`ez-toc-page-1 ${activeId === item.id ? 'active' : ''}`}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(item.id);
                  }}
                  className={`
                    ez-toc-link transition-colors duration-200
                    ${activeId === item.id 
                      ? 'font-medium' 
                      : 'text-theme-text-secondary hover:text-theme-text'
                    }
                  `}
                  style={{ 
                    color: activeId === item.id ? '#823EB7' : undefined
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}