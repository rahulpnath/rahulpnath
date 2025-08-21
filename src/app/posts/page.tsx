
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

import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-xl mx-auto py-10">
      <div className="relative -top-[10px] flex flex-col gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="block py-4 hover:scale-[1.005] transition-transform will-change-transform"
          >
            <article>
              <h2 className="text-xl font-bold text-pink-400 leading-snug">
                {post.title}
              </h2>
              {post.date && (
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
              {post.excerpt && (
                <p className="text-gray-300 mt-1">{post.excerpt}</p>
              )}
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}