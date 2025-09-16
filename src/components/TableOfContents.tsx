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
      {/* Header */}
      <h3 className="font-medium text-gray-900 text-sm mb-4">In this article</h3>

      {/* TOC Items */}
      <nav className="border-l-2 border-gray-200 pl-4">
        <ul className="space-y-2">
          {tocItems.map((item) => (
            <li key={item.id} className="flex items-start">
              <span className={`mr-2 text-base mt-0.5 transition-colors duration-200 font-bold ${
                activeId === item.id 
                  ? 'text-[#823EB7]' 
                  : 'text-gray-400'
              }`}>›</span>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(item.id);
                }}
                className={`
                  block text-sm py-1 transition-colors duration-200
                  hover:text-gray-800 hover:underline
                  ${activeId === item.id 
                    ? 'text-gray-800 font-medium' 
                    : 'text-gray-600'
                  }
                `}
                style={{ 
                  paddingLeft: `${(item.level - 2) * 1}rem`
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Reading Progress Bar */}
      <div className="mt-6">
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
          className="bg-[#823EB7] h-1 rounded-full transition-all duration-300"
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