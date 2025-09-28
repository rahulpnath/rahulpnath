
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
  
  // Enhanced educator-focused properties
  contentType?: 'blog' | 'video' | 'tutorial-series' | 'guide';
  technologies?: Technology[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  youtubeUrl?: string;
  githubUrl?: string;
  estimatedTime?: string;
  whyThisMatters?: string;
  videoChapters?: VideoChapter[];
  featured?: boolean;
}

export interface Technology {
  name: string;
  color: string;
  icon?: string;
  category: 'frontend' | 'backend' | 'cloud' | 'devops' | 'tools';
}

export interface VideoChapter {
  title: string;
  timestamp: string;
  url: string;
  description?: string;
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
