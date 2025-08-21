// src/app/posts/[slug]/page.tsx
// import { getAllPosts, getPostBySlug } from "@/lib/posts";
// import { MdxProvider } from "@/components/mdx-provider";
// import { MDXRemote } from "next-mdx-remote/rsc";

// interface PostPageProps {
// params: { slug: string };
// }

// // ✅ Generate static params
// export async function generateStaticParams() {
//   const posts = getAllPosts();
//   return posts.map((post) => ({ slug: post.slug }));
// }

// export default async function PostPage({ params }: PostPageProps) {
//    console.log("🔍 params:", params); // ✅ Debug
//    const post = getPostBySlug(params.slug); // ✅ use directly

//   if (!post) return <div>Post not found</div>;

//   return (
//     <article className="max-w-2xl mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
//       <MdxProvider>
//         {/* 👇 This renders MDX content as React */}
//         <MDXRemote source={post.content} />
//       </MdxProvider>
//     </article>
//   );
// }
// src/app/posts/[slug]/page.tsx
// src/app/posts/[slug]/page.tsx
// src/app/posts/[slug]/page.tsx
import { getPostBySlug } from "@/lib/posts";
import { MdxProvider } from "@/components/mdx-provider";
import { MDXRemote } from "next-mdx-remote/rsc";

type Props = {
  params: Promise<{ slug: string }>;
};

// Pre-generate all slugs
export async function generateStaticParams() {
  const { getAllPosts } = await import("@/lib/posts");
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params; // ✅ must await
  const post = getPostBySlug(slug); // synchronous

  if (!post) {
    return <div className="max-w-2xl mx-auto py-10">Post not found</div>;
  }

  return (
    <article className="max-w-3xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

      {post.date && (
        <p className="text-sm text-gray-500 mb-4">
          {new Date(post.date).toLocaleDateString()}
        </p>
      )}

      {post.featureImage && (
        <img
          src={post.featureImage}
          alt={post.title}
          className="w-full rounded-lg mb-8"
        />
      )}

      <div className="prose prose-lg">
        <MdxProvider>
          <MDXRemote source={post.content} />
        </MdxProvider>
      </div>
      {/* Optional: Social sharing buttons can be added here */}
    </article>
  );
}

