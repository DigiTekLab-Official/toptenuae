// src/sanity/lib/image.ts
// ✅ PERFORMANCE OPTIMIZED VERSION

import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { dataset, projectId } from './client'

const builder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

// --------------------------------------------------
// OPTIMIZED IMAGE FUNCTIONS
// --------------------------------------------------

/**
 * ✅ PERFORMANCE FIX: Responsive Main Image
 * Uses auto format, WebP/AVIF when supported
 * Appropriate sizing for modern devices
 */
export const mainImage = (source: any) => {
  if (!source || !source.asset) return undefined 
  
  return builder.image(source)
    .width(1200) // ✅ Reduced from 1600 (adequate for most displays)
    .auto('format') // ✅ Serves WebP/AVIF when supported
    .quality(85) // ✅ Reduced from 90 (imperceptible quality loss, better compression)
    .url()
}

/**
 * ✅ PERFORMANCE FIX: List/Grid Image
 * Optimized for product cards and list views
 */
export const listImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(600) // ✅ Reduced from 800 (sufficient for grid cards)
    .auto('format')
    .quality(80)
    .url()
}

/**
 * ✅ PERFORMANCE FIX: Hero/Discover Image
 * For large hero sections and Google Discover
 */
export const discoverImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(1920)
    .height(1080)
    .fit('crop') 
    .auto('format')
    .quality(85) // ✅ Quality appropriate for large images
    .url()
}

/**
 * ✅ PERFORMANCE FIX: Sidebar/Thumbnail Image
 * For small previews and thumbnails
 */
export const sidebarImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(400)
    .height(225) 
    .fit('crop')
    .crop('center')
    .auto('format')
    .quality(75)
    .url()
}

/**
 * ✅ NEW: Product Card Image
 * Optimized specifically for product cards
 * Matches the displayed size in ProductCard.tsx (414x459)
 */
export const productCardImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(414)
    .height(459)
    .fit('max') // Maintain aspect ratio
    .auto('format')
    .quality(85)
    .url()
}

/**
 * ✅ NEW: Responsive Image with srcset
 * Returns multiple sizes for responsive images
 */
export const responsiveImage = (source: any) => {
  if (!source || !source.asset) return undefined

  const sizes = [400, 800, 1200, 1600];
  
  return {
    src: builder.image(source).width(1200).auto('format').quality(85).url(),
    srcset: sizes.map(width => 
      `${builder.image(source).width(width).auto('format').quality(85).url()} ${width}w`
    ).join(', '),
  }
}

/**
 * ✅ NEW: Get optimized image at specific dimensions
 * Use this when you know exact display dimensions
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
    .quality(options.quality || 85);

  if (options.height) {
    imageBuilder = imageBuilder.height(options.height);
  }

  if (options.fit) {
    imageBuilder = imageBuilder.fit(options.fit);
  }

  return imageBuilder.url();
}

// Legacy export (for backwards compatibility)
export const urlForImage = urlFor;