'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Safe localStorage helper functions
  const getSavedTheme = (): Theme | null => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme
      }
      return null
    } catch (error) {
      console.warn('localStorage unavailable (Safari private mode?), using default theme:', error)
      return null
    }
  }

  const saveTheme = (newTheme: Theme): void => {
    try {
      localStorage.setItem('theme', newTheme)
    } catch (error) {
      console.warn('localStorage unavailable, theme will not persist across sessions:', error)
      // Theme will still work for current session, just won't persist
    }
  }

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = getSavedTheme()
    
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      // Default to system preference if no saved theme or localStorage unavailable
      try {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const defaultTheme = systemPrefersDark ? 'dark' : 'light'
        setTheme(defaultTheme)
        document.documentElement.classList.toggle('dark', defaultTheme === 'dark')
      } catch (error) {
        // Fallback to light theme if even matchMedia fails
        console.warn('System preference detection failed, defaulting to light theme:', error)
        setTheme('light')
        document.documentElement.classList.remove('dark')
      }
    }
    setMounted(true)
  }, [])

  // Apply theme when it changes
  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    saveTheme(theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}