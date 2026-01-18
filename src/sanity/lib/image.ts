// src/sanity/lib/image.ts
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

/**
 * ✅ CARD IMAGE
 * Enforces 1.42 Aspect Ratio (1600x1125)
 */
export const cardImage = (source: any) => {
  if (!source || !source.asset) return undefined
  
  return builder.image(source)
    .width(1600)
    .height(1125)
    .fit('crop')
    .crop('center')
    .auto('format')
    .quality(85)
    .url()
}

/**
 * ✅ Main Image
 * 1600w for high-res hero sections
 */
export const mainImage = (source: any) => {
  if (!source || !source.asset) return undefined 
  
  return builder.image(source)
    .width(1600)
    .auto('format') 
    .quality(85) 
    .url()
}

/**
 * ✅ List/Grid Image (CRITICAL PERFORMANCE FIX)
 * Reduced to 640px to match mobile viewport width.
 * This fixes the LCP "Image too large" warning.
 */
export const listImage = (source: any) => {
  if (!source || !source.asset) return undefined

  return builder.image(source)
    .width(640) // ✅ Updated to 640 (was 800)
    .auto('format')
    .quality(80)
    .url()
}

export const discoverImage = (source: any) => {
  if (!source || !source.asset) return undefined
  return builder.image(source).width(1920).height(1080).fit('crop').auto('format').quality(85).url()
}

export const sidebarImage = (source: any) => {
  if (!source || !source.asset) return undefined
  return builder.image(source).width(400).height(225).fit('crop').crop('center').auto('format').quality(75).url()
}

export const productCardImage = (source: any) => {
  if (!source || !source.asset) return undefined
  return builder.image(source).width(414).height(459).fit('max').auto('format').quality(85).url()
}

export const responsiveImage = (source: any) => {
  if (!source || !source.asset) return undefined
  const sizes = [400, 800, 1200, 1600];
  return {
    src: builder.image(source).width(1200).auto('format').quality(85).url(),
    srcset: sizes.map(width => `${builder.image(source).width(width).auto('format').quality(85).url()} ${width}w`).join(', '),
  }
}

export const optimizedImage = (source: any, options: { width: number; height?: number; quality?: number; fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'; }) => {
  if (!source || !source.asset) return undefined
  let imageBuilder = builder.image(source).width(options.width).auto('format').quality(options.quality || 85);
  if (options.height) imageBuilder = imageBuilder.height(options.height);
  if (options.fit) imageBuilder = imageBuilder.fit(options.fit);
  return imageBuilder.url();
}

export const urlForImage = urlFor;