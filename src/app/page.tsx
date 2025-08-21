import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Welcome</h1>
      <p className="mb-6">This is the homepage. Head to the blog to see posts.</p>
      <Link href="/posts" className="text-blue-600 underline">
        View all posts →
      </Link>
    </main>
  );
}
