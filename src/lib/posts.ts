//  import fs from "fs";
// import path from "path";
// import matter from "gray-matter";

// const postsDirectory = path.join(process.cwd(), "src/posts");

// export type PostMeta = {
//   slug: string;
//   title: string;
//   date?: string;          // ISO string in front matter (e.g., "2025-08-10")
//   excerpt?: string;
//   featureImage?: string;  // e.g., "/images/whatever.jpg"
// };

// export function getAllPosts(): (PostMeta & { dateObj: Date })[] {
//   const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

//   const posts = files.map((fileName) => {
//     const slug = fileName.replace(/\.mdx$/, "");
//     const filePath = path.join(postsDirectory, fileName);
//     const fileContents = fs.readFileSync(filePath, "utf8");
//     const { data } = matter(fileContents);

//     const meta: PostMeta = {
//       slug,
//       title: data.title || slug,
//       date: data.date || undefined,
//       excerpt: data.excerpt || undefined,
//       featureImage: data.featureImage || undefined,
//     };

//     // build a Date object for sorting (fallback to epoch if missing)
//     const dateObj = meta.date ? new Date(meta.date) : new Date(0);

//     return { ...meta, dateObj };
//   });

//   // newest first
//   posts.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
//   return posts;
// }

// export function getPostBySlug(slug: string): (PostMeta & { content: string }) | null {
//   const filePath = path.join(postsDirectory, `${slug}.mdx`);
//   if (!fs.existsSync(filePath)) return null;

//   const fileContents = fs.readFileSync(filePath, "utf8");
//   const { data, content } = matter(fileContents);

//   const meta: PostMeta = {
//     slug,
//     title: data.title || slug,
//     date: data.date || undefined,
//     excerpt: data.excerpt || undefined,
//     featureImage: data.featureImage || undefined,
//   };

//   return { ...meta, content };
// }
// src/lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost, BlogMetadata } from '@/types/blog';

const postsDirectory = path.join(process.cwd(), "src/posts");

// Interface for your current frontmatter format
interface YourFrontmatter {
  title: string;
  slug: string;
  date: string;
  feature_image?: string;
  tags?: string[];
  excerpt: string;
}

// Get all posts metadata only (without content) - for listing pages
export async function getAllPostsMetadata(): Promise<Omit<BlogPost, 'content'>[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const slug = name.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const frontmatter = data as YourFrontmatter;

      // Return metadata only, no content - reduces memory usage
      return {
        slug: frontmatter.slug || slug,
        title: frontmatter.title,
        description: frontmatter.excerpt,
        publishedAt: frontmatter.date,
        author: {
          name: "Rahul Nath",
          avatar: undefined,
          bio: "Software engineer passionate about AWS, .NET, and building better developer experiences. I write about cloud architecture, productivity, and the lessons learned from over a decade in software development.",
          email: "rahulpnath@gmail.com",
          social: {
            twitter: "https://twitter.com/rahulpnath",
            linkedin: "https://linkedin.com/in/rahulpnath",
            youtube: "https://youtube.com/@RahulNath",
            github: "https://github.com/rahulpnath",
            website: "https://rahulpnath.com"
          }
        },
        coverImage: frontmatter.feature_image,
        tags: frontmatter.tags || [],
        readingTime: calculateReadingTime(content), // Still need content briefly for reading time
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return allPosts;
}

// Backward compatibility - keep for existing imports
export async function getAllPosts(): Promise<BlogPost[]> {
  console.warn('getAllPosts() loads full content - use getAllPostsMetadata() for better performance');
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const slug = name.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const frontmatter = data as YourFrontmatter;

      return {
        slug: frontmatter.slug || slug,
        content,
        title: frontmatter.title,
        description: frontmatter.excerpt,
        publishedAt: frontmatter.date,
        author: {
          name: "Rahul Nath",
          avatar: undefined,
          bio: "Software engineer passionate about AWS, .NET, and building better developer experiences. I write about cloud architecture, productivity, and the lessons learned from over a decade in software development.",
          email: "rahulpnath@gmail.com",
          social: {
            twitter: "https://twitter.com/rahulpnath",
            linkedin: "https://linkedin.com/in/rahulpnath",
            youtube: "https://youtube.com/@RahulNath",
            github: "https://github.com/rahulpnath",
            website: "https://rahulpnath.com"
          }
        },
        coverImage: frontmatter.feature_image,
        tags: frontmatter.tags || [],
        readingTime: calculateReadingTime(content),
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return allPosts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Try to find the file by slug in frontmatter first
    const fileNames = fs.readdirSync(postsDirectory);
    let fileName = '';
    
    for (const name of fileNames) {
      if (!name.endsWith('.mdx')) continue;
      
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      const frontmatter = data as YourFrontmatter;
      
      if (frontmatter.slug === slug) {
        fileName = name;
        break;
      }
    }
    
    // Fallback to filename if slug not found in frontmatter
    if (!fileName) {
      fileName = `${slug}.mdx`;
    }
    
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter = data as YourFrontmatter;

    return {
      slug: frontmatter.slug || slug,
      content,
      title: frontmatter.title,
      description: frontmatter.excerpt,
      publishedAt: frontmatter.date,
      author: {
        name: "Rahul Nath",
        avatar: undefined, // Add your avatar image to public/images/ when ready
        bio: "Software engineer passionate about AWS, .NET, and building better developer experiences. I write about cloud architecture, productivity, and the lessons learned from over a decade in software development.",
        email: "rahulpnath@gmail.com",
        social: {
          twitter: "https://twitter.com/rahulpnath",
          linkedin: "https://linkedin.com/in/rahulpnath",
          youtube: "https://youtube.com/@RahulNath",
          github: "https://github.com/rahulpnath",
          website: "https://rahulpnath.com"
        }
      },
      coverImage: frontmatter.feature_image,
      tags: frontmatter.tags || [],
      readingTime: calculateReadingTime(content),
    };
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
}

// Get metadata for a single post (for generateMetadata) - avoids loading content
export async function getPostMetadata(slug: string): Promise<Omit<BlogPost, 'content'> | null> {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    let fileName = '';
    
    // Find file by slug in frontmatter first
    for (const name of fileNames) {
      if (!name.endsWith('.mdx')) continue;
      
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents); // Only parse frontmatter, not content
      const frontmatter = data as YourFrontmatter;
      
      if (frontmatter.slug === slug) {
        fileName = name;
        break;
      }
    }
    
    // Fallback to filename if slug not found in frontmatter
    if (!fileName) {
      fileName = `${slug}.mdx`;
    }
    
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter = data as YourFrontmatter;

    return {
      slug: frontmatter.slug || slug,
      title: frontmatter.title,
      description: frontmatter.excerpt,
      publishedAt: frontmatter.date,
      author: {
        name: "Rahul Nath",
        avatar: undefined,
        bio: "Software engineer passionate about AWS, .NET, and building better developer experiences. I write about cloud architecture, productivity, and the lessons learned from over a decade in software development.",
        email: "rahulpnath@gmail.com",
        social: {
          twitter: "https://twitter.com/rahulpnath",
          linkedin: "https://linkedin.com/in/rahulpnath",
          youtube: "https://youtube.com/@RahulNath",
          github: "https://github.com/rahulpnath",
          website: "https://rahulpnath.com"
        }
      },
      coverImage: frontmatter.feature_image,
      tags: frontmatter.tags || [],
      readingTime: calculateReadingTime(content), // Calculate once here
    };
  } catch (error) {
    console.error('Error getting post metadata:', error);
    return null;
  }
}

// Export function to get all unique tags - uses metadata only
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPostsMetadata(); // Use metadata version
  const allTags = posts.flatMap(post => post.tags || []);
  return Array.from(new Set(allTags)).sort();
}

// Export function to get posts by tag - uses metadata only for performance
export async function getPostsByTag(tag: string): Promise<Omit<BlogPost, 'content'>[]> {
  const posts = await getAllPostsMetadata(); // Use metadata version
  return posts.filter(post => post.tags?.includes(tag));
}
// export type PostMeta = {
//   slug: string;
//   title: string;
//   date?: string;
//   excerpt?: string;
//   featureImage?: string;
//   tags?: string[];
// };

// export type Post = PostMeta & { content: string };

// Get all posts metadata
// export function getAllPosts(): (PostMeta & { dateObj: Date })[] {
//   const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

//   const posts = files.map((fileName) => {
//     const slug = fileName.replace(/\.mdx$/, "");
//     const filePath = path.join(postsDirectory, fileName);
//     const fileContents = fs.readFileSync(filePath, "utf8");
//     const { data } = matter(fileContents);

//     const meta: PostMeta = {
//       slug,
//       title: data.title || slug,
//       date: data.date || undefined,
//       excerpt: data.excerpt || undefined,
//       featureImage: data.featureImage || data.feature_image || undefined,
//       tags: Array.isArray(data.tags) ? data.tags : [],
//     };

//     const dateObj = meta.date ? new Date(meta.date) : new Date(0);
//     return { ...meta, dateObj };
//   });

//   posts.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
//   return posts;
// }

// Get full post content safely
// export function getPostBySlug(slug: string): Post | null {
//   const filePath = path.join(postsDirectory, `${slug}.mdx`);
//   if (!fs.existsSync(filePath)) return null;

//   try {
//     const fileContents = fs.readFileSync(filePath, "utf8");
//     const { data, content } = matter(fileContents);

//     const meta: PostMeta = {
//       slug,
//       title: data.title || slug,
//       date: data.date || undefined,
//       excerpt: data.excerpt || undefined,
//       featureImage: data.featureImage || data.feature_image || undefined,
//       tags: Array.isArray(data.tags) ? data.tags : [],
//     };

//     return { ...meta, content };
//   } catch (err: any) {
//     console.error(`❌ Error parsing MDX file: ${filePath}`);
//     console.error(err.message);
//     return null;
//   }
// }
