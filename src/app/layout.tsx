import './globals.css';
import localFont from "next/font/local";
import { Inter, Playfair_Display } from 'next/font/google';
import Header from '@/components/Header';
import { getAllPosts } from '@/lib/posts';

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
    <html lang="en" className={`${clashGrotesk.variable} ${inter.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-white">
        <Header posts={posts} />
        {children}
      </body>
    </html>
  );
}