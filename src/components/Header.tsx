'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { SearchIcon, MoonIcon, SunIcon } from './icons';
import { BlogPost } from '@/types/blog';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

const SearchComponent = dynamic(() => import('./Search'), {
  ssr: false,
  loading: () => null,
});

interface HeaderProps {
  posts?: Omit<BlogPost, 'content'>[];
}

export default function Header({ posts = [] }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();

  // Dynamic viewport height calculation for iOS Safari compatibility
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const updateViewportHeight = () => {
      // Use the actual viewport height, accounting for iOS Safari address bar
      const vh = window.innerHeight;
      
      // Debounce updates to prevent jumping during keyboard events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewportHeight(vh);
      }, 100);
    };

    // Set initial height immediately
    const vh = window.innerHeight;
    setViewportHeight(vh);

    // Update on resize (iOS Safari address bar show/hide)
    // Don't update on every resize to prevent jumping when keyboard appears
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);


  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };


  return (
    <>
      <header className="bg-background/75 backdrop-blur border-b border-theme-border-light -mb-px sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between h-24 gap-0">
          
          {/* Logo/Brand - Left side with flex-1 */}
          <div className="lg:flex-1 flex items-center gap-1.5">
            <Link 
              href="/" 
              className="flex-shrink-0 font-bold flex gap-1.5 text-lg sm:text-2xl items-center text-theme-text-high-contrast"
              aria-label="Rahul Nath"
            >
              <span className="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-8 w-8 text-sm sm:w-10 sm:h-10">
                <Image
                  src="/rahul-logo.png"
                  alt="Picture of Rahul Nath"
                  width={40}
                  height={40}
                  className="rounded-full h-8 w-8 text-sm"
                />
              </span>
              Rahul Nath
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-x-8">
            {navigation.map((item) => (
              <li key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={`text-xl font-semibold flex items-center gap-1 transition-colors ${
                    isActive(item.href) ? 'text-primary-500' : 'text-theme-text hover:text-primary-500'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side Icons */}
          <div className="flex items-center justify-end lg:flex-1 gap-1.5">
            {/* Search Icon */}
            <div className="relative inline-flex">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-base gap-x-2.5 p-2.5 text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-muted focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 inline-flex items-center"
                aria-label="Search"
              >
                <SearchIcon className="flex-shrink-0 h-6 w-6" />
              </button>
            </div>
            
            {/* Theme Toggle */}
            {mounted && (
              <div className="relative inline-flex">
                <button
                  onClick={toggleTheme}
                  className="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-base gap-x-2.5 p-2.5 text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-muted focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 inline-flex items-center"
                  aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {theme === 'dark' ? <MoonIcon className="flex-shrink-0 h-6 w-6" /> : <SunIcon className="flex-shrink-0 h-6 w-6" />}
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-full text-sm gap-x-2 p-2 text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-muted focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 inline-flex items-center lg:hidden"
              aria-label="Open Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="flex-shrink-0 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="flex-shrink-0 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-theme-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-theme-text"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Search overlay */}
      {isSearchOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 transition-opacity bg-gray-200/75 dark:bg-gray-800/75 backdrop-blur-sm" 
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed inset-0 z-60 flex items-start justify-center pt-4 sm:pt-32 px-4 sm:px-6 lg:px-8" onClick={() => setIsSearchOpen(false)}>
            <div 
              className="relative text-left flex flex-col bg-theme-bg-card shadow-xl w-full sm:max-w-3xl rounded-none sm:rounded-lg safe-area-modal"
              style={{
                // Dynamic height for iOS Safari compatibility
                height: typeof window !== 'undefined' && window.innerWidth >= 640 
                  ? '36rem' 
                  : viewportHeight > 0 
                    ? `${viewportHeight - 32}px` 
                    : 'calc(100vh - 64px)',
                maxHeight: viewportHeight > 0 
                  ? `${viewportHeight - 32}px` 
                  : 'calc(100vh - 64px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <SearchComponent 
                posts={posts} 
                placeholder="Search..."
                onClose={() => setIsSearchOpen(false)}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Global keyboard shortcut hook for Command+K
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}