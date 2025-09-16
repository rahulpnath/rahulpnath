import Image from 'next/image';

interface ImageCardProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export default function ImageCard({ src, alt, caption, width = 800, height = 400 }: ImageCardProps) {
  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg border border-gray-200">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
          priority={false}
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-gray-600 text-center mt-3 italic leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}