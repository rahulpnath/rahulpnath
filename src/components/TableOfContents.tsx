'use client';

import React, { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  headings?: Heading[];
}

const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

export default function TableOfContents({ content, headings: propsHeadings }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>(propsHeadings || []);
  const [activeHeading, setActiveHeading] = useState<string>('');

  useEffect(() => {
    // If headings were provided as props, use them
    if (propsHeadings && propsHeadings.length > 0) {
      setHeadings(propsHeadings);
      return;
    }

    // Otherwise extract from markdown content
    if (!content) return;
    
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const extractedHeadings: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateId(text);
      
      extractedHeadings.push({ id, text, level });
    }
    
    setHeadings(extractedHeadings);
  }, [content, propsHeadings]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0% -80% 0%',
        threshold: 0
      }
    );

    // Observe all heading elements
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Account for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) {
    return (
      <div className="hidden lg:block">
        <nav className="sticky top-24">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Table of Contents</h3>
            <p className="text-sm text-gray-600 mt-2">Loading...</p>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="hidden lg:block">
      <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#823EB7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Table of Contents
          </h3>
          <ul className="space-y-2">
            {headings.map(({ id, text, level }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToHeading(id)}
                  className={`
                    w-full text-left text-sm hover:text-[#823EB7] transition-colors duration-200
                    ${level === 1 ? 'font-semibold text-gray-900' : ''}
                    ${level === 2 ? 'font-medium text-gray-800 pl-3' : ''}
                    ${level === 3 ? 'text-gray-700 pl-6' : ''}
                    ${level === 4 ? 'text-gray-600 pl-9' : ''}
                    ${level === 5 ? 'text-gray-500 pl-12' : ''}
                    ${level === 6 ? 'text-gray-500 pl-15' : ''}
                    ${activeHeading === id ? 'text-[#823EB7] font-medium' : ''}
                    py-1 block hover:bg-white hover:bg-opacity-60 rounded px-2 -mx-2
                  `}
                >
                  <span className={`
                    block border-l-2 pl-2
                    ${activeHeading === id ? 'border-[#823EB7]' : 'border-transparent'}
                  `}>
                    {text}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}