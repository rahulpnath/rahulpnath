'use client';

import { useState, useEffect, useMemo } from 'react';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchProps {
  posts: BlogPost[];
  placeholder?: string;
  onClose?: () => void;
}

interface SearchResult extends BlogPost {
  matchScore: number;
  highlightedTitle?: string;
  highlightedDescription?: string;
}

export default function Search({ posts, placeholder = "Search articles...", onClose }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [visibleResults, setVisibleResults] = useState(10);
  const { theme, toggleTheme, mounted } = useTheme();

  // Create search index with content for better matching
  const searchIndex = useMemo(() => {
    return posts.map(post => ({
      ...post,
      searchText: [
        post.title,
        post.description || '',
        post.tags?.join(' ') || '',
        // Add first 200 characters of content for context
        post.content?.substring(0, 200) || ''
      ].join(' ').toLowerCase()
    }));
  }, [posts]);

  // Advanced search with scoring
  const searchResults = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const results: SearchResult[] = searchIndex
      .map(post => {
        let score = 0;
        const titleLower = (post.title || '').toLowerCase();
        const descriptionLower = (post.description || '').toLowerCase();
        
        searchTerms.forEach(term => {
          // Title matches get highest score
          if (titleLower.includes(term)) {
            score += titleLower.startsWith(term) ? 10 : 5;
          }
          
          // Description matches get medium score
          if (descriptionLower.includes(term)) {
            score += 3;
          }
          
          // Tag matches get medium score
          if (post.tags?.some(tag => tag.toLowerCase().includes(term))) {
            score += 4;
          }
          
          // Content matches get lower score
          if (post.searchText.includes(term)) {
            score += 1;
          }
        });

        if (score === 0) return null;

        // Create highlighted versions
        const highlightedTitle = highlightText(post.title, searchTerms);
        const highlightedDescription = highlightText(post.description || '', searchTerms);

        return {
          ...post,
          matchScore: score,
          highlightedTitle,
          highlightedDescription
        };
      })
      .filter((result): result is NonNullable<typeof result> => result !== null)
      .sort((a, b) => b.matchScore - a.matchScore)
      // No slice here - we'll handle pagination in the display

    return results;
  }, [query, searchIndex]);

  // Highlight matching text
  function highlightText(text: string, terms: string[]): string {
    if (!text || terms.length === 0) return text;
    
    // Filter out empty terms and sort by length (longest first) to avoid nested highlighting
    const validTerms = terms.filter(term => term.trim().length > 0).sort((a, b) => b.length - a.length);
    
    if (validTerms.length === 0) return text;
    
    // Create a single regex that matches any of the terms
    const escapedTerms = validTerms.map(term => escapeRegExp(term));
    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    
    return text.replace(regex, '<mark style="--tw-bg-opacity: 1; background-color: var(--color-primary-400);" class="text-white px-1">$1</mark>');
  }

  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || searchResults.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            window.location.href = `/blog/${searchResults[selectedIndex].slug}`;
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          setSelectedIndex(-1);
          onClose?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  // Reset selection and visible results when query changes
  useEffect(() => {
    setSelectedIndex(-1);
    setVisibleResults(10);
  }, [query]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-theme-bg divide-y divide-gray-100 dark:divide-gray-800" role="search" aria-label="Article search">
      {/* Search Input */}
      <div className="relative flex items-center search-input-border">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            setQuery('');
            setSelectedIndex(-1);
            onClose?.();
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-sm gap-x-1.5 p-1.5 text-theme-text-secondary hover:text-theme-text hover:bg-gray-100/50 dark:hover:bg-gray-800/50 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
          aria-label="Close search"
        >
          <svg className="flex-shrink-0 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Search Icon */}
        <svg 
          className="pointer-events-none absolute start-4 text-theme-text-light h-5 w-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full placeholder-theme-text-light bg-transparent border-0 text-theme-text focus:ring-0 focus:outline-none sm:text-sm h-12 px-4 ps-11 pe-12"
          aria-label="Search articles"
          aria-describedby="search-instructions"
          autoComplete="off"
          role="searchbox"
          aria-expanded={isOpen && searchResults.length > 0}
          aria-haspopup="listbox"
          aria-owns="search-results"
        />
        <div id="search-instructions" className="sr-only">
          Type to search articles. Use arrow keys to navigate results, Enter to select, Escape to close.
        </div>

      </div>

      {/* Search Results */}
      <div 
        id="search-results"
        className="relative flex-1 overflow-y-auto divide-y divide-theme-border-light scroll-py-10 search-scrollbar" 
        role="listbox" 
        aria-label="Search results"
        aria-live="polite"
        aria-atomic="false"
      >
        {query.trim() && query.trim().length >= 2 ? (
          searchResults.length > 0 ? (
            <div className="p-2" role="none">
              <h2 className="px-2.5 my-2 text-xs font-semibold text-theme-text" role="none">Blog</h2>
              <div className="text-sm text-theme-text" aria-label="Blog" role="none">
                {searchResults.slice(0, visibleResults).map((result, index) => (
                  <Link
                    key={result.slug}
                    href={`/blog/${result.slug}`}
                    className={`flex justify-between select-none items-center rounded-md px-2.5 py-1.5 gap-2 relative cursor-pointer hover:bg-theme-bg-muted transition-colors ${
                      index === selectedIndex ? 'bg-theme-bg-muted text-theme-text' : ''
                    }`}
                    role="option"
                    tabIndex={-1}
                    aria-selected={index === selectedIndex}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                      onClose?.();
                    }}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {/* Document Icon */}
                      <svg 
                        className={`flex-shrink-0 w-5 h-5 ${
                          index === selectedIndex ? 'text-theme-text' : 'text-theme-text-secondary'
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      
                      <div className="flex items-center gap-1.5 min-w-0">
                        {/* Article title */}
                        <span 
                          className="truncate flex-none text-theme-text"
                          dangerouslySetInnerHTML={{ __html: result.highlightedTitle || result.title }}
                        />
                        
                        {/* Description */}
                        {(result.highlightedDescription || result.description) && (
                          <span 
                            className="truncate text-theme-text-secondary"
                            dangerouslySetInnerHTML={{ __html: result.highlightedDescription || result.description }}
                          />
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* Show more button */}
                {visibleResults < searchResults.length && (
                  <button
                    onClick={() => setVisibleResults(prev => prev + 10)}
                    className="w-full flex justify-center items-center px-2.5 py-2 mt-2 text-sm text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-muted rounded-md transition-colors"
                  >
                    Show more results
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="px-2.5 py-8 text-center text-theme-text-secondary">
              <svg className="w-8 h-8 mx-auto mb-2 text-theme-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No articles found for "{query}"</p>
              <p className="text-xs text-theme-text-secondary mt-1">Try different keywords or check spelling</p>
            </div>
          )
        ) : (
          // Default state - show all posts when no search query
          <div className="p-2" role="none">
            <h2 className="px-2.5 my-2 text-xs font-semibold text-theme-text" role="none">Blog</h2>
            <div className="text-sm text-theme-text" aria-label="Blog" role="none">
              {posts.slice(0, 12).map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`flex justify-between select-none items-center rounded-md px-2.5 py-1.5 gap-2 relative cursor-pointer hover:bg-theme-bg-muted transition-colors ${
                    index === selectedIndex ? 'bg-theme-bg-muted text-theme-text' : ''
                  }`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={index === selectedIndex}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                    onClose?.();
                  }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {/* Document Icon */}
                    <svg 
                      className={`flex-shrink-0 w-5 h-5 ${
                        index === selectedIndex ? 'text-theme-text' : 'text-theme-text-secondary'
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    
                    <div className="flex items-center gap-1.5 min-w-0">
                      {/* Article title */}
                      <span className="truncate flex-none text-theme-text">
                        {post.title}
                      </span>
                      
                      {/* Description */}
                      {post.description && (
                        <span className="truncate text-theme-text-secondary">
                          {post.description}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Theme Section - Always visible */}
        {mounted && (
          <div className="p-2" role="none">
            <h2 className="px-2.5 my-2 text-xs font-semibold text-theme-text" role="none">Theme</h2>
            <div className="text-sm text-theme-text" aria-label="Theme" role="none">
              {/* Light Theme Option */}
              <button
                onClick={() => {
                  if (theme !== 'light') {
                    toggleTheme();
                  }
                }}
                className={`flex justify-between select-none items-center rounded-md px-2.5 py-1.5 gap-2 relative w-full text-left transition-colors ${
                  theme === 'light' 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'cursor-pointer hover:bg-theme-bg-muted'
                }`}
                role="option"
                tabIndex={-1}
                aria-selected={theme === 'light'}
                aria-disabled={theme === 'light'}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {/* Sun Icon */}
                  <svg 
                    className="flex-shrink-0 w-5 h-5 text-theme-text-secondary"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate">Light</span>
                  </div>
                </div>
              </button>
              
              {/* Dark Theme Option */}
              <button
                onClick={() => {
                  if (theme !== 'dark') {
                    toggleTheme();
                  }
                }}
                className={`flex justify-between select-none items-center rounded-md px-2.5 py-1.5 gap-2 relative w-full text-left transition-colors ${
                  theme === 'dark' 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'cursor-pointer hover:bg-theme-bg-muted'
                }`}
                role="option"
                tabIndex={-1}
                aria-selected={theme === 'dark'}
                aria-disabled={theme === 'dark'}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {/* Moon Icon */}
                  <svg 
                    className="flex-shrink-0 w-5 h-5 text-theme-text-secondary"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate">Dark</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}