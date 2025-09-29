import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscribe | Rahul Nath',
  description: 'Subscribe to my newsletter and get weekly updates on new blog posts, exclusive tips and tutorials, early access to new content, and behind-the-scenes insights.',
  keywords: ['newsletter', 'subscribe', 'updates', 'blog posts', 'tutorials', 'web development'],
  openGraph: {
    title: 'Subscribe | Rahul Nath',
    description: 'Subscribe to my newsletter and get weekly updates on new blog posts, exclusive tips and tutorials, early access to new content, and behind-the-scenes insights.',
    type: 'website',
    url: 'https://www.rahulpnath.com/subscribe',
    images: [
      {
        url: '/rahul-logo.png',
        width: 1200,
        height: 630,
        alt: 'Subscribe to Rahul Nath Newsletter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subscribe | Rahul Nath',
    description: 'Subscribe to my newsletter and get weekly updates on new blog posts, exclusive tips and tutorials, early access to new content, and behind-the-scenes insights.',
    creator: '@rahulpnath',
    images: ['/rahul-logo.png'],
  },
  alternates: {
    canonical: 'https://www.rahulpnath.com/subscribe',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}