import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import './globals.css';
import '../styles/accessibility.css';
import ClientHeader from '@/components/ClientHeader';
import { getAllPostsMetadata } from '@/lib/posts';
import ThemeWrapper from '@/components/ThemeWrapper';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.rahulpnath.com'),
  title: {
    default: 'Rahul Nath - Developer Blog',
    template: '%s | Rahul Nath'
  },
  description: 'Thoughts, tutorials, and insights on web development, AWS, modern technologies. Learn about .NET, Azure, Lambda, and software engineering best practices.',
  keywords: ['Rahul Nath', 'Web Development', 'AWS', 'Azure', '.NET', 'Software Engineering', 'Lambda', 'DynamoDB', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Rahul Nath', url: 'https://www.rahulpnath.com' }],
  creator: 'Rahul Nath',
  publisher: 'Rahul Nath',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.rahulpnath.com',
    siteName: 'Rahul Nath - Developer Blog',
    title: 'Rahul Nath - Developer Blog',
    description: 'Thoughts, tutorials, and insights on web development, AWS, modern technologies. Learn about .NET, Azure, Lambda, and software engineering best practices.',
    images: [
      {
        url: '/rahul-logo.png',
        width: 1200,
        height: 630,
        alt: 'Rahul Nath - Developer Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rahul Nath - Developer Blog',
    description: 'Thoughts, tutorials, and insights on web development, AWS, modern technologies. Learn about .NET, Azure, Lambda, and software engineering best practices.',
    creator: '@rahulpnath',
    images: ['/rahul-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Get posts metadata for search functionality
  const posts = await getAllPostsMetadata();

  return (
    <html lang="en">
      <GoogleAnalytics />
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning>
        <ThemeWrapper>
          <div className="min-h-screen bg-theme-bg text-theme-text transition-colors overflow-x-hidden">
            <ClientHeader posts={posts} />
            {children}
          </div>
        </ThemeWrapper>
      </body>
    </html>
  );
}