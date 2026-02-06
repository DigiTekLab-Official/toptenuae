import Image, { ImageProps } from 'next/image';
import React from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  aspectRatio?: 'square' | 'video' | '3/2' | '16/9' | number;
  containerClassName?: string;
}

const ASPECT_RATIOS = {
  square: 1,
  video: 16 / 9,
  '3/2': 3 / 2,
  '16/9': 16 / 9,
} as const;

/**
 * OptimizedImage: High-performance image component with:
 * - Automatic aspect ratio enforcement (prevents CLS)
 * - Modern format support via Sanity CDN (AVIF/WebP)
 * - Responsive sizing with intelligent breakpoints
 * - Quality optimization (85 by default)
 * - Direct Sanity CDN loading (unoptimized mode)
 */
export default function OptimizedImage({
  src,
  alt,
  aspectRatio = 'square',
  containerClassName = '',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const ratio = typeof aspectRatio === 'number' 
    ? aspectRatio 
    : ASPECT_RATIOS[aspectRatio as keyof typeof ASPECT_RATIOS] || 1;

  return (
    <div
      className={`relative w-full overflow-hidden ${containerClassName}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        quality={85}
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
}
