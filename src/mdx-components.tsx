import type { MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";
import PostCard from "./components/PostCard";
import BlogPostCard from "./components/BlogPostCard";
import BlogLink from "./components/BlogLink";
import AuthorCard from "./components/AuthorCard";
import ImageCard from "./components/ImageCard";
import TableOfContents from "./components/TableOfContents";
import Search from "./components/Search";
import CodeBlock from "./components/CodeBlock";
import Image from "next/image";

// Lazy load components used in specific posts only
const BookmarkCard = dynamic(() => import("./components/BookmarkCard"), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />,
});

const EmbedCard = dynamic(() => import("./components/EmbedCard"), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-48" />,
});

// Custom components for better MDX styling

const Callout = ({ type = 'info', icon, children }: { type?: 'info' | 'warning' | 'success' | 'error' | 'tip', icon?: string, children: React.ReactNode }) => {
  const styles = {
    info: 'bg-gray-50 border-gray-400 text-gray-900',
    tip: 'bg-blue-50 border-blue-400 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-900',
    success: 'bg-green-50 border-green-400 text-green-900',
    error: 'bg-red-50 border-red-400 text-red-900'
  };

  const icons = {
    info: 'ℹ️',
    tip: '💡',
    warning: '⚠️',
    success: '✅',
    error: '❌'
  };

  return (
    <div className={`p-4 border-l-4 rounded-r-lg ${styles[type]} my-6`}>
      <div className="flex-1">{children}</div>
    </div>
  );
};

const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6 my-8 shadow-sm">
    <div className="text-gray-800 dark:text-gray-200 leading-relaxed">{children}</div>
  </div>
);

const StepCard = ({ step, title, children }: { step: number, title: string, children: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-8 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center justify-center w-10 h-10 bg-[#823EB7] text-white rounded-full text-sm font-bold shadow-sm">
        {step}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    </div>
    <div className="text-gray-800 dark:text-gray-200 leading-relaxed">{children}</div>
  </div>
);

const YoutubeEmbed = ({ src, title = "YouTube video" }: { src: string, title?: string }) => {
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(src);
  
  if (!videoId) return null;

  return (
    <div className="relative w-full my-8">
      <div className="relative w-full h-0 pb-[56.25%] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
};

const TechStack = ({ technologies }: { technologies: string[] }) => (
  <div className="flex flex-wrap gap-3 my-8">
    {technologies.map((tech) => (
      <span
        key={tech}
        className="px-4 py-2 bg-purple-50 text-[#823EB7] rounded-lg text-sm font-medium border border-purple-100 hover:bg-purple-100 transition-colors"
      >
        {tech}
      </span>
    ))}
  </div>
);

const Figure = ({ src, alt, caption, ...props }: { src: string, alt?: string, caption?: string }) => (
  <figure className="my-8">
    <Image
      src={src}
      alt={alt || caption || ''}
      width={800}
      height={400}
      className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
      {...props}
    />
    {caption && (
      <figcaption className="text-sm text-gray-600 dark:text-gray-300 text-center mt-3 italic">
        {caption}
      </figcaption>
    )}
  </figure>
);

// Helper function to generate heading IDs
const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// Heading components with automatic ID generation
const createHeading = (level: number) => (props: any) => {
  const { children, className = '', ...rest } = props;
  const text = typeof children === 'string' ? children : children?.toString?.() || '';
  const id = generateHeadingId(text);
  
  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  // Define styling for each heading level
  const headingStyles = {
    1: 'text-4xl font-bold text-gray-900 mt-0 mb-6 tracking-tight leading-tight',
    2: 'text-2xl font-bold text-gray-900 mt-12 mb-4 tracking-tight leading-tight',
    3: 'text-xl font-bold text-gray-900 mt-8 mb-3 tracking-tight leading-tight',
    4: 'text-lg font-bold text-gray-900 mt-6 mb-2 tracking-tight leading-tight',
    5: 'text-base font-bold text-gray-900 mt-4 mb-2 tracking-tight leading-tight',
    6: 'text-sm font-bold text-gray-900 mt-3 mb-1 tracking-tight leading-tight'
  };
  
  const combinedClassName = `${headingStyles[level as keyof typeof headingStyles]} ${className}`.trim();
  
  return (
    <HeadingTag id={id} className={combinedClassName} {...rest}>
      {children}
    </HeadingTag>
  );
};

// Export components for server-side usage
export const mdxComponents: MDXComponents = {
  // Custom components
  PostCard,
  BlogPostCard,
  BlogLink,
  AuthorCard,
  BookmarkCard,
  EmbedCard,
  ImageCard,
  TableOfContents,
  Search,
  Callout,
  HighlightBox,
  StepCard,
  YoutubeEmbed,
  TechStack,
  Figure,
  
  // Heading components with auto-generated IDs
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  
  // Enhanced default components
  pre: CodeBlock,
  iframe: (props: any) => {
    if (props.src?.includes('youtube.com')) {
      return <YoutubeEmbed src={props.src} title={props.title} />;
    }
    return <iframe {...props} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg" />;
  },
  img: (props: any) => (
    <Image
      {...props}
      width={800}
      height={400}
      className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
      alt={props.alt || ''}
    />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-[#823EB7] pl-6 py-4 my-8 italic text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 rounded-r-xl shadow-sm" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  td: (props: any) => (
    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300" {...props} />
  ),
  figcaption: (props: any) => (
    <figcaption className="text-sm text-gray-600 dark:text-gray-300 text-center mt-3 mb-6 italic" {...props} />
  ),
  figure: (props: any) => (
    <figure className="my-8" {...props} />
  ),
  a: (props: any) => {
    const isExternal = props.href?.startsWith('http') && !props.href?.includes('rahulpnath.com');
    return (
      <a
        {...props}
        className="text-[#823EB7] hover:text-purple-700 transition-colors font-medium"
        {...(isExternal && {
          target: '_blank',
          rel: 'noopener noreferrer'
        })}
      />
    );
  },
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
