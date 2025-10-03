/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', '"DM Sans Fallback: Arial"', 'ui-sans-serif', 'system-ui', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
        mono: ['"Cartograph CF"', 'monospace'],
      },
      fontSize: {
        // Fluid Typography System using CSS clamp()
        // Format: clamp(min-size, preferred-size, max-size)
        
        // Heading Scales
        'fluid-h1': ['clamp(1.75rem, 5vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '600' }],        // 28px - 40px
        'fluid-h2': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.3', fontWeight: '600' }],           // 24px - 32px  
        'fluid-h3': ['clamp(1.25rem, 3vw, 1.75rem)', { lineHeight: '1.4', fontWeight: '600' }],       // 20px - 28px
        'fluid-h4': ['clamp(1.125rem, 2.5vw, 1.5rem)', { lineHeight: '1.4', fontWeight: '500' }],     // 18px - 24px
        'fluid-h5': ['clamp(1rem, 2vw, 1.25rem)', { lineHeight: '1.5', fontWeight: '500' }],          // 16px - 20px
        'fluid-h6': ['clamp(0.875rem, 1.5vw, 1.125rem)', { lineHeight: '1.5', fontWeight: '500' }],   // 14px - 18px
        
        // Body Text Scales - Optimized for long-form reading
        'fluid-body': ['clamp(1rem, 2vw, 1.125rem)', { lineHeight: '1.7' }],                          // 16px - 18px, improved readability
        'fluid-body-sm': ['clamp(0.875rem, 1.5vw, 1rem)', { lineHeight: '1.6' }],                    // 14px - 16px
        'fluid-body-lg': ['clamp(1.125rem, 2.5vw, 1.25rem)', { lineHeight: '1.7' }],                 // 18px - 20px
        
        // Hero & Display Text - With better spacing
        'fluid-hero': ['clamp(2.5rem, 8vw, 4.5rem)', { 
          lineHeight: '1.1', 
          fontWeight: '800',
          letterSpacing: '-0.02em' // Tighter for large text
        }],
        'fluid-display': ['clamp(2rem, 6vw, 3rem)', { 
          lineHeight: '1.2', 
          fontWeight: '700',
          letterSpacing: '-0.01em'
        }],
        
        // Blog-specific scales matching your current patterns
        'fluid-blog-title': ['clamp(2rem, 6vw, 3rem)', { 
          lineHeight: '1.15',  // More breathing room
          fontWeight: '600',
          letterSpacing: '-0.01em'
        }],
        'fluid-blog-subtitle': ['clamp(1.125rem, 3vw, 1.5rem)', { 
          lineHeight: '1.5', 
          fontWeight: '500' 
        }],
        'fluid-blog-meta': ['clamp(0.875rem, 1.5vw, 1rem)', { 
          lineHeight: '1.5', 
          fontWeight: '500' 
        }],
        
        // Utility scales
        'fluid-title': 'fluid-h1',  // Alias to fluid-h1 for consistency
        'fluid-subtitle': 'fluid-h3', // Alias to fluid-h3
        'fluid-caption': ['clamp(0.75rem, 1vw, 0.875rem)', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
