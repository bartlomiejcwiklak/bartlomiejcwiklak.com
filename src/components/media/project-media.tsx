import Image from 'next/image';

type ProjectMediaProps = {
  src: string;
  alt: string;
  mediaType?: 'image' | 'gif' | 'video';
  posterUrl?: string;
  sizes?: string;
  className: string;
  priority?: boolean;
  autoPlay?: boolean;
};

export function ProjectMedia({
  src,
  alt,
  mediaType = 'image',
  posterUrl,
  sizes,
  className,
  priority,
  autoPlay = true
}: ProjectMediaProps) {
  if (mediaType === 'video') {
    return (
      <video
        src={src}
        poster={posterUrl}
        className={className}
        autoPlay={autoPlay}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }

  if (mediaType === 'gif') {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1400}
      height={900}
      sizes={sizes}
      className={className}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
    />
  );
}
