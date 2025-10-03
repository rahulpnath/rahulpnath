import React from "react";

type PostCardProps = {
  href: string;
  title: string;
  description: string;
  authorImg?: string;
  author?: string;
  cover?: string;
};

export default function PostCard({
  href,
  title,
  description,
  authorImg,
  author,
  cover,
}: PostCardProps) {
  return (
    <a
      href={href}
      className="block rounded-xl shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="mb-2 text-gray-700 dark:text-gray-300">{description}</p>

      {(authorImg || author) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          {authorImg && (
            <img
              src={authorImg}
              alt={author || "Author"}
              className="w-5 h-5 rounded-full"
            />
          )}
          {author}
        </div>
      )}

      {cover && <img src={cover} alt={title} className="rounded-md" />}
    </a>
  );
}
