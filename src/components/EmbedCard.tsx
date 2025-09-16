interface EmbedCardProps {
  src: string;
  title?: string;
  type?: 'youtube' | 'twitter' | 'generic';
}

export default function EmbedCard({ src, title, type }: EmbedCardProps) {
  // Auto-detect type if not provided
  if (!type) {
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      type = 'youtube';
    } else if (src.includes('twitter.com') || src.includes('x.com')) {
      type = 'twitter';
    } else {
      type = 'generic';
    }
  }

  const getEmbedProps = () => {
    switch (type) {
      case 'youtube':
        return {
          className: "w-full aspect-video rounded-lg border border-gray-200",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowFullScreen: true,
          referrerPolicy: "strict-origin-when-cross-origin" as const
        };
      case 'twitter':
        return {
          className: "w-full h-96 rounded-lg border border-gray-200",
          allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        };
      default:
        return {
          className: "w-full h-96 rounded-lg border border-gray-200"
        };
    }
  };

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <iframe
          src={src}
          title={title || 'Embedded content'}
          frameBorder="0"
          {...getEmbedProps()}
        />
      </div>
    </div>
  );
}