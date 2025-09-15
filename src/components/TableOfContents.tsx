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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm">Table of Contents</h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? 'Expand table of contents' : 'Collapse table of contents'}
        >
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* TOC Items */}
      {!isCollapsed && (
        <nav className="p-4">
          <ul className="space-y-1">
            {tocItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToHeading(item.id)}
                  className={`
                    block w-full text-left text-sm py-1.5 px-2 rounded transition-all duration-200
                    hover:bg-gray-50 hover:text-blue-600
                    ${activeId === item.id 
                      ? 'text-blue-600 bg-blue-50 font-medium border-l-2 border-blue-600 -ml-2 pl-4' 
                      : 'text-gray-600'
                    }
                  `}
                  style={{ 
                    paddingLeft: `${(item.level - 1) * 0.75 + 0.5}rem`,
                    marginLeft: activeId === item.id ? '-0.5rem' : '0'
                  }}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Reading Progress Bar */}
      <div className="px-4 pb-4">
        <ReadingProgressBar />
      </div>
    </div>
  );
}

// Reading Progress Bar Component
function ReadingProgressBar() {
  const progress = useReadingProgress();
  
  return (
    <>
      <div className="w-full bg-gray-200 rounded-full h-1">
        <div 
          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">Reading Progress</p>
    </>
  );
}

// Hook for reading progress (can be used separately)
export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial call

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return progress;
}