// src/sanity/lib/image.ts
// Sanity image optimization helpers - named around usage intent, not component history
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

// =============================================================================
// CORE BUILDER
// =============================================================================

/**
 * Base builder for any custom image optimization
 * Use this to build your own image URLs with custom dimensions
 */
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

// =============================================================================
// NAMED PRESET HELPERS - Usage-intent based naming
// =============================================================================

/**
 * Hero/LCP image - Large Contentful Paint optimized
 * SIZE: 1200px @ 75% quality
 * USE: Homepage hero, article headers, featured banners
 */
export const mainImage = (source: any) => {
  if (!source || !source.asset) return undefined 
  
  return builder.image(source)
    .width(1200)
    .auto('format')
    .quality(75)
    .fit('max')
    .url()
}

/**
 * Archive/list card image - Retina-ready for grid layouts
 * SIZE: 800px @ 80% quality
 * USE: Article grids, category pages, archive listings
 */
export const archiveCardImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(800)
    .auto('format')
    .quality(80)
    .fit('max')
    .url()
}

/**
 * Feature card image - Higher-priority card content
 * SIZE: 1600x1125 (1.42:1 aspect ratio) @ 80% quality
 * USE: Featured articles, highlighted products, hero cards
 */
export const featureCardImage = (source: any) => {
  if (!source || !source.asset) return undefined
  
  return builder.image(source)
    .width(1600)
    .height(1125)
    .fit('crop')
    .crop('center')
    .auto('format')
    .quality(80)
    .url()
}

/**
 * Thumbnail image - Small supporting images
 * SIZE: 400px @ 85% quality
 * USE: Related posts, author avatars, sidebar images
 */
export const thumbnailImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(400)
    .auto('format')
    .quality(85)
    .fit('max')
    .url()
}

/**
 * Hero banner image - Full-width sections
 * SIZE: 1600x900 (16:9) @ 75% quality
 * USE: Section banners, discover cards, full-width visuals
 */
export const heroBannerImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(1600)
    .height(900)
    .fit('crop')
    .crop('center')
    .auto('format')
    .quality(75)
    .url()
}

/**
 * Product card image - Product-specific aspect ratio
 * SIZE: 414x459 @ 85% quality
 * USE: Product cards, ecommerce listings
 */
export const productCardImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(414)
    .height(459)
    .fit('max')
    .auto('format')
    .quality(85)
    .url()
}

/**
 * Open Graph image - Social media sharing
 * SIZE: 1200x630 (Facebook/Twitter standard) @ 85% quality
 * USE: og:image meta tags
 */
export const ogImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(1200)
    .height(630)
    .fit('crop')
    .crop('center')
    .auto('format')
    .quality(85)
    .url()
}

/**
 * Blur placeholder - Low-quality image placeholder for progressive loading
 * SIZE: 20px @ 10% quality
 * USE: <Image placeholder="blur" blurDataURL={blurImage(source)} />
 */
export const blurImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(20)
    .quality(10)
    .blur(50)
    .auto('format')
    .url()
}

/**
 * Optimized image - Custom dimensions and settings
 * Flexible function for edge cases and special layouts
 */
export const optimizedImage = (
  source: any, 
  options: { 
    width: number; 
    height?: number; 
    quality?: number;
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  }
) => {
  if (!source || !source.asset) return undefined

  let imageBuilder = builder.image(source)
    .width(options.width)
    .auto('format')
    .quality(options.quality || 80);

  if (options.height) {
    imageBuilder = imageBuilder.height(options.height);
  }

  if (options.fit) {
    imageBuilder = imageBuilder.fit(options.fit);
  }

  return imageBuilder.url();
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get image dimensions from Sanity asset metadata
 * Returns: { width, height } or null
 * USE: Calculate aspect ratios, reserve space for lazy-loaded images
 */
export const getImageDimensions = (source: any): { width: number; height: number } | null => {
  if (!source?.asset?._ref) return null
  
  // Parse Sanity asset reference format: image-{assetId}-{width}x{height}-{format}
  const ref = source.asset._ref
  const match = ref.match(/image-[a-f0-9]+-(\d+)x(\d+)-/)
  
  if (!match) return null
  
  return {
    width: parseInt(match[1], 10),
    height: parseInt(match[2], 10),
  }
}

/**
 * Calculate aspect ratio from image dimensions
 * Returns: CSS aspect-ratio string like "16/9" or null
 */
export const getAspectRatio = (source: any): string | null => {
  const dimensions = getImageDimensions(source)
  if (!dimensions) return null
  
  const { width, height } = dimensions
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const divisor = gcd(width, height)
  
  return `${width / divisor}/${height / divisor}`
}

/**
 * Validate that image source is usable
 * Returns: boolean
 */
export const isValidImage = (source: any): boolean => {
  return !!(source && (source.asset?._ref || source.asset?._id))
}

/**
 * Get dominant color from Sanity metadata
 * Returns: hex color string or fallback
 * USE: Background color while image loads
 */
export const getDominantColor = (source: any, fallback: string = '#f3f4f6'): string => {
  return source?.asset?.metadata?.palette?.dominant?.background || fallback
}

/**
 * Get LQIP (Low Quality Image Placeholder) from Sanity metadata
 * Returns: base64 data URL or blur image fallback
 * USE: Progressive image loading
 */
export const getLQIP = (source: any): string | undefined => {
  // Prefer Sanity's built-in LQIP from metadata
  if (source?.asset?.metadata?.lqip) {
    return source.asset.metadata.lqip
  }
  
  // Fallback to blur image
  return blurImage(source)
}

/**
 * Generate optimized Sanity CDN URL with query parameters
 * Platform-agnostic helper for raw URLs
 */
export function sanityImageUrl(src: string, width: number, quality: number = 75): string {
  if (!src.includes("cdn.sanity.io")) {
    return src;
  }

  const url = new URL(src);
  url.searchParams.set("w", width.toString());
  url.searchParams.set("q", quality.toString());
  url.searchParams.set("auto", "format");

  return url.toString();
}

// =============================================================================
// LEGACY ALIASES - For backward compatibility during migration
// =============================================================================

/**
 * @deprecated Use `archiveCardImage` instead
 */
export const listImage = archiveCardImage

/**
 * @deprecated Use `featureCardImage` instead
 */
export const cardImage = featureCardImage

/**
 * @deprecated Use `thumbnailImage` instead
 */
export const thumbImage = thumbnailImage

/**
 * @deprecated Use `heroBannerImage` instead
 */
export const discoverImage = heroBannerImage

/**
 * @deprecated Use `thumbnailImage` instead
 */
export const sidebarImage = thumbnailImage

/**
 * @deprecated Use `urlFor` instead
 */
export const urlForImage = urlFor