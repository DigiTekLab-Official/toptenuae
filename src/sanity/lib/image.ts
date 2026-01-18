// src/sanity/lib/image.ts
// ✅ PERFORMANCE OPTIMIZED & FIXED FOR REVIEWS PAGE

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
 * ✅ CARD IMAGE (The Fix for Reviews Page)
 * Enforces 1.42 Aspect Ratio (1600x1125)
 * Fixes "Low Resolution" & "Aspect Ratio" errors in Lighthouse
 */
export const cardImage = (source: any) => {
  if (!source || !source.asset) return undefined
  
  return builder.image(source)
    .width(1600)      // High res for Retina screens (matches 1335px display slot)
    .height(1125)     // Enforces 1.42 Aspect Ratio (7:5)
    .fit('crop')      // Crops specifically to center
    .crop('center')
    .auto('format')
    .quality(85)
    .url()
}

/**
 * ✅ Main Image (Updated)
 * Bumped to 1600w to prevent blurriness on desktop screens >1200px
 */
export const mainImage = (source: any) => {
  if (!source || !source.asset) return undefined 
  
  return builder.image(source)
    .width(1600) // ✅ Increased from 1200 to fix low-res on desktop
    .auto('format') 
    .quality(85) 
    .url()
}

/**
 * ✅ List/Grid Image
 * Optimized for smaller grid cards
 */
export const listImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(800) // ✅ Bumped to 800 to be safe for 2-column mobile grids
    .auto('format')
    .quality(80)
    .url()
}

/**
 * ✅ Hero/Discover Image
 * For large hero sections and Google Discover
 */
export const discoverImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(1920)
    .height(1080)
    .fit('crop') 
    .auto('format')
    .quality(85)
    .url()
}

/**
 * ✅ Sidebar/Thumbnail Image
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
 * ✅ Product Card Image
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
 * ✅ Responsive Image with srcset
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
 * ✅ Get optimized image at specific dimensions
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