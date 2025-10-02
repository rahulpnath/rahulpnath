'use client';

import Header from './Header';
import { BlogPost } from '@/types/blog';

interface ClientHeaderProps {
  posts: Omit<BlogPost, 'content'>[];
}

export default function ClientHeader({ posts }: ClientHeaderProps) {
  return <Header posts={posts} />;
}