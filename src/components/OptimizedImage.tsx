
interface OptimizedImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | '3/2' | '16/9' | number;
  containerClassName?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  [key: string]: any;
}

const ASPECT_RATIOS = {
  square: 1,
  video: 16 / 9,
  '3/2': 3 / 2,
  '16/9': 16 / 9,
} as const;

export default function OptimizedImage({
  src,
  alt,
  aspectRatio = 'square',
  containerClassName = '',
  loading = 'lazy',
  className = '',
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
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        loading={loading}
        {...props}
      />
    </div>
  );
}
