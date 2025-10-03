# Claude Code Instructions

This file contains essential rules, guidelines, and conventions for working on this Next.js blog project.

**Last Updated:** 2025-10-03

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [General Rules](#general-rules)
3. [Styling Guidelines](#styling-guidelines)
4. [Component Guidelines](#component-guidelines)
5. [Dark Mode](#dark-mode)
6. [File Structure](#file-structure)
7. [Common Patterns](#common-patterns)
8. [Responsive Design](#responsive-design)
9. [MDX Integration](#mdx-integration)
10. [Dependencies Notes](#dependencies-notes)
11. [Troubleshooting](#troubleshooting)

---

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS v4 + CSS Variables
- **Content:** MDX for blog posts
- **Syntax Highlighting:** prism-react-renderer
- **Theme Management:** Custom ThemeContext (class-based dark mode)

---

## General Rules

### CSS Best Practices
1. **NEVER use `!important`** - We have proper CSS specificity, so it's unnecessary and makes debugging harder
2. **Remove all existing `!important` declarations** when refactoring CSS
3. **Use semantic class names** - Prefer descriptive names over generic ones

### Code Quality
1. **Keep code clean and maintainable** - Remove unnecessary complexity
2. **DRY principle** - Don't repeat yourself, extract reusable patterns
3. **Comment complex logic** - Help future developers understand why, not what

---

## Styling Guidelines

### Tailwind CSS v4 Configuration
- **Import:** Uses `@import "tailwindcss";` (NOT `@tailwind` directives)
- **Dark Mode:** Requires `@custom-variant dark (&:where(.dark, .dark *));` in globals.css
- **Full features available:** All utilities, variants, and dark: prefix work correctly

### When to Use Tailwind vs CSS Variables

#### USE TAILWIND CLASSES FOR:
- ✅ Layout and spacing (`p-4`, `my-6`, `gap-2`)
- ✅ Common UI patterns (`rounded-lg`, `shadow-sm`)
- ✅ Responsive utilities (`md:text-lg`, `sm:p-2`)
- ✅ Interactive states (`hover:bg-gray-100`, `dark:hover:bg-gray-800`)
- ✅ Simple borders and backgrounds on components
- ✅ Flexbox and grid layouts

#### USE CSS VARIABLES FOR:
- ✅ Syntax highlighting colors (10+ color variations)
- ✅ Theme-dependent values used in multiple places
- ✅ Integration with prism-react-renderer (requires string values)
- ✅ Complex color schemes (Material Theme colors)
- ✅ Custom properties that need to be referenced in JS

#### NEVER USE:
- ❌ Tailwind `dark:` variants were broken until we added `@custom-variant` - now they work!
- ❌ Inline styles except when required by third-party libraries
- ❌ `!important` declarations

### CSS Variables Location
- **File:** `src/styles/prism-theme.css`
- **Light mode:** Defined in `:root {}`
- **Dark mode:** Defined in `.dark {}`
- **Naming:** Use `--code-*` prefix for code-related variables

#### Example CSS Variables:
```css
:root {
  --code-bg: #FAFAFA;
  --code-text: #90A4AE;
  --code-border: #E0E0E0;
  --code-keyword: #9C27B0;
  --code-string: #91B859;
  /* ... more colors ... */
}

.dark {
  --code-bg: #292D3E;
  --code-text: #A6ACCD;
  --code-border: #3d4556;
  /* ... more colors ... */
}
```

---

## Component Guidelines

### CodeBlock Component (src/components/CodeBlock.tsx)

**Responsibilities:**
- Syntax highlighting using prism-react-renderer
- Copy to clipboard functionality
- Responsive code display (wrap on mobile, scroll on desktop)
- Language detection and mapping

**Styling Rules:**

1. **Theme object colors:** MUST use CSS variables as strings
   ```tsx
   // ✅ Correct
   color: "var(--code-keyword)"

   // ❌ Wrong
   color: "#C792EA"
   ```

2. **Wrapper div:** Use Tailwind classes for layout/borders
   ```tsx
   className="my-6 rounded-lg max-w-full relative group border border-gray-200 dark:border-gray-700"
   ```

3. **Copy button:** Use Tailwind for all states
   ```tsx
   className="absolute top-2.5 right-2.5 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
   ```

**Copy Button Requirements:**
- Always visible (not opacity-based hover)
- Position: absolute top-right
- Icons: Simple SVG (clipboard and checkmark)
- Feedback: Shows "copied" state for 2 seconds
- Styling: Minimal, subtle, circular

**Responsive Behavior:**
- **Mobile (≤768px):** Code wraps with `white-space: pre-wrap`
- **Desktop (≥769px):** Code scrolls horizontally with `white-space: pre`
- **Implementation:** Media queries in globals.css

---

## Dark Mode

### Implementation Details
- **System:** Custom ThemeContext.tsx in src/contexts/
- **Toggle method:** `document.documentElement.classList.toggle('dark', theme === 'dark')`
- **Target:** Adds/removes `dark` class on `<html>` element
- **Persistence:** Saves preference to localStorage

### Tailwind v4 Dark Mode Setup
Required in globals.css:
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```
Without this, Tailwind `dark:` variants won't work!

### Dark Mode Styling Approaches

**For Components:**
```tsx
// ✅ Use Tailwind dark: variants
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
```

**For Syntax Highlighting:**
```css
/* ✅ Use CSS variables with .dark selector */
:root {
  --code-bg: #FAFAFA;
}

.dark {
  --code-bg: #292D3E;
}
```

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   └── globals.css         # Global styles, Tailwind import
├── components/
│   └── CodeBlock.tsx       # Syntax highlighting component
├── contexts/
│   └── ThemeContext.tsx    # Dark mode logic
├── styles/
│   └── prism-theme.css     # Syntax highlighting colors
└── mdx-components.tsx      # MDX component mappings
```

---

## Common Patterns

### Adding New Color Variables
1. Add to both `:root` and `.dark` in prism-theme.css
2. Use descriptive names with `--code-` prefix
3. Update corresponding token styles if needed

### Creating New Components
1. Use Tailwind classes for layout and spacing
2. Extract repeated Tailwind patterns into reusable components
3. Use CSS variables only for theme-dependent colors

### Updating Syntax Highlighting
1. Colors go in prism-theme.css as CSS variables
2. Token mappings stay in same file
3. Theme object in CodeBlock.tsx references these variables
4. Never hardcode colors in the component

### Testing Dark Mode
1. Toggle theme using the theme switcher
2. Verify `<html>` element has/removes `dark` class
3. Check that all themed elements update (not just Tailwind classes)
4. Test code blocks, inline code, and UI elements

---

## Responsive Design

### Breakpoints (Tailwind defaults)
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

### Code Block Responsive Rules

**Mobile (≤768px):**
- Font size: 13px → 12px
- Padding: reduced
- Code wraps to prevent horizontal scroll

**Desktop (≥769px):**
- Font size: 14px
- Normal padding
- Code scrolls horizontally

---

## MDX Integration

### Configuration
- **File:** next.config.js
- **Component mapping:** src/mdx-components.tsx
- **Code blocks:** `<pre>` tags map to CodeBlock component

### Adding Custom MDX Components
1. Create component in src/components/
2. Export from mdx-components.tsx
3. Map HTML element to custom component

---

## Dependencies Notes

### Key Packages
- **prism-react-renderer:** ^2.4.1 - Syntax highlighting
- **@next/mdx:** For MDX support
- **next:** 15+ (App Router)

### DO NOT Use
- ❌ **rehype-prism-plus** - We use prism-react-renderer instead
- ❌ **prismjs directly** - Handled by prism-react-renderer

---

## Troubleshooting

### Dark Mode Not Working
1. Check if `@custom-variant dark` is in globals.css
2. Verify `<html>` gets `dark` class in DevTools
3. Ensure ThemeContext is wrapping app in layout.tsx

### Tailwind Classes Not Applying
1. Check if class name is correct (typos are common)
2. Verify globals.css has `@import "tailwindcss";`
3. Restart dev server after config changes
4. Check browser DevTools for compiled CSS

### Code Blocks Not Styling
1. Verify CSS variables are defined in prism-theme.css
2. Check customTheme object uses CSS variable strings
3. Ensure prism-theme.css is imported somewhere
4. Check for CSS specificity issues (remove !important)

---

## Adding New Rules

When you discover a new convention or rule:
1. Add it to the appropriate section above
2. Update the "Last Updated" date at the top
3. If it's a major change, add to a "Changelog" section
4. Keep this file as the single source of truth
