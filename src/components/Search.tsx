'use client';

import { useState, useEffect, useMemo } from 'react';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';

interface SearchProps {
  posts: BlogPost[];
  placeholder?: string;
  className?: string;
}

interface SearchResult extends BlogPost {
  matchScore: number;
  highlightedTitle?: string;
  highlightedDescription?: string;
}

export default function Search({ posts, placeholder = "Search articles...", className = "" }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

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
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const results: SearchResult[] = searchIndex
      .map(post => {
        let score = 0;
        const titleLower = post.title.toLowerCase();
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
      .filter((result): result is SearchResult => result !== null)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8); // Limit to top 8 results

    return results;
  }, [query, searchIndex]);

  // Highlight matching text
  function highlightText(text: string, terms: string[]): string {
    if (!text || terms.length === 0) return text;
    
    let highlighted = text;
    terms.forEach(term => {
      const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark class="bg-yellow-200 text-gray-900 px-1 rounded">$1</mark>');
    });
    
    return highlighted;
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
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg 
            className="w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              setSelectedIndex(-1);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </div>
              {searchResults.map((result, index) => (
                <Link
                  key={result.slug}
                  href={`/blog/${result.slug}`}
                  className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                >
                  <div className="flex flex-col space-y-1">
                    <h3 
                      className="text-sm font-medium text-gray-900 line-clamp-1"
                      dangerouslySetInnerHTML={{ __html: result.highlightedTitle || result.title }}
                    />
                    {result.highlightedDescription && (
                      <p 
                        className="text-xs text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: result.highlightedDescription }}
                      />
                    )}
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <time>{new Date(result.publishedAt).toLocaleDateString()}</time>
                      {result.tags && result.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="line-clamp-1">
                            {result.tags.slice(0, 3).join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No articles found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords or check spelling</p>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsOpen(false);
            setSelectedIndex(-1);
          }}
        />
      )}
    </div>
  );
}