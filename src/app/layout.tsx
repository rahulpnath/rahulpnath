import './globals.css';
import localFont from "next/font/local";
import Header from '@/components/Header';
import { getAllPosts } from '@/lib/posts';

const clashGrotesk = localFont({
  src: "../fonts/ClashGrotesk-Variable.woff2", // path is from /public
  variable: "--font-clash",
  weight: "100 700", // variable range
  display: "swap",
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
    <html lang="en" className={clashGrotesk.variable}>
      <body className="antialiased">
        <Header posts={posts} />
        {children}
      </body>
    </html>
  );
}