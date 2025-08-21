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

const postsDirectory = path.join(process.cwd(), "src/posts");

export type PostMeta = {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  featureImage?: string;
  tags?: string[];
};

export type Post = PostMeta & { content: string };

// Get all posts metadata
export function getAllPosts(): (PostMeta & { dateObj: Date })[] {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    const meta: PostMeta = {
      slug,
      title: data.title || slug,
      date: data.date || undefined,
      excerpt: data.excerpt || undefined,
      featureImage: data.featureImage || data.feature_image || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
    };

    const dateObj = meta.date ? new Date(meta.date) : new Date(0);
    return { ...meta, dateObj };
  });

  posts.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
  return posts;
}

// Get full post content safely
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const meta: PostMeta = {
      slug,
      title: data.title || slug,
      date: data.date || undefined,
      excerpt: data.excerpt || undefined,
      featureImage: data.featureImage || data.feature_image || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
    };

    return { ...meta, content };
  } catch (err: any) {
    console.error(`❌ Error parsing MDX file: ${filePath}`);
    console.error(err.message);
    return null;
  }
}
