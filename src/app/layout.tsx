import './globals.css';
import localFont from "next/font/local";
import { Inter, Playfair_Display, DM_Sans } from 'next/font/google';
import ClientHeader from '@/components/ClientHeader';
import { getAllPosts } from '@/lib/posts';
import ThemeWrapper from '@/components/ThemeWrapper';

const clashGrotesk = localFont({
  src: "../fonts/ClashGrotesk-Variable.woff2", // path is from /public
  variable: "--font-clash",
  weight: "100 700", // variable range
  display: "swap",
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Rahul Nath - Developer Blog',
  description: 'Thoughts, tutorials, and insights on web development, AWS, and modern technologies.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Get posts for search functionality
  const posts = await getAllPosts();

  return (
    <html lang="en" className={`${clashGrotesk.variable} ${inter.variable} ${playfairDisplay.variable} ${dmSans.variable}`}>
      <body className={`${dmSans.className} antialiased`} suppressHydrationWarning>
        <ThemeWrapper>
          <div className="min-h-screen bg-theme-bg text-theme-text transition-colors">
            <ClientHeader posts={posts} />
            {children}
          </div>
        </ThemeWrapper>
      </body>
    </html>
  );
}