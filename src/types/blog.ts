
// types/blog.ts
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  coverImage?: string;
  tags?: string[];
  readingTime?: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  tags?: string[];
}
