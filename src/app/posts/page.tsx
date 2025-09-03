
// src/app/posts/page.tsx
// import Link from "next/link";
// import { getAllPosts } from "@/lib/posts";

// export default function PostsPage() {
//   const posts = getAllPosts(); // synchronous

//   return (
//     <main className="max-w-2xl mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">All Posts</h1>
//       <ul className="space-y-4">
//         {posts.map(post => (
//           <li key={post.slug}>
//             <Link href={`/posts/${post.slug}`} className="text-blue-600 underline">
//               {post.title}
//             </Link>
//             {post.date && (
//               <p className="text-sm text-gray-500">
//                 {new Date(post.date).toLocaleDateString()}
//               </p>
//             )}
//             {post.excerpt && <p>{post.excerpt}</p>}
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }


// src/app/posts/page.tsx
import { getAllPosts } from "@/lib/posts";
import PostsPageClient from "./PostsPageClient";

export default function PostsPage() {
  const posts = getAllPosts(); // safe on server
  return <PostsPageClient posts={posts} />;
}