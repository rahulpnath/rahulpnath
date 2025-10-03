'use client';

import Image from 'next/image';

interface BookmarkCardProps {
  href: string;
  title: string;
  description?: string;
  icon?: string;
}

export default function BookmarkCard({ href, title, description, icon }: BookmarkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#823EB7] hover:shadow-lg transition-all duration-200 my-6 no-underline"
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 relative">
            <Image
              src={icon}
              alt=""
              width={48}
              height={48}
              className="rounded-lg object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#823EB7] transition-colors mb-2 line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <span>🔗</span>
            <span className="truncate">
              {href.startsWith('http') ? new URL(href).hostname : 'rahulpnath.com'}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}