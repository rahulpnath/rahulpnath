
// types/blog.ts
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
    email?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      youtube?: string;
      github?: string;
      website?: string;
    };
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
    bio?: string;
    email?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      youtube?: string;
      github?: string;
      website?: string;
    };
  };
  coverImage?: string;
  tags?: string[];
}
