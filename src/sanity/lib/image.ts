// src/sanity/lib/image.ts
import { createImageUrlBuilder } from '@sanity/image-url' 
import type { SanityImageSource } from '@sanity/image-url'

const projectId = process.env.SANITY_PROJECT_ID || ''
const dataset = process.env.SANITY_DATASET || ''

const builder = createImageUrlBuilder({
  projectId,
  dataset,
})
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

// --------------------------------------------------
// AMAZON + CONVERSION IMAGES (FIXED)
// --------------------------------------------------

export const mainImage = (source: any) => {
  if (!source || !source.asset) return undefined 
  
  // FIX: Removed .height() and .fit(). 
  // We only define width to control file size. 
  // This guarantees the FULL uncropped aspect ratio is returned.
  return builder.image(source)
    .width(1600) 
    .auto('format')
    .quality(90)
    .url()
}

export const listImage = (source: any) => {
  if (!source || !source.asset) return undefined

  // FIX: Removed .height(). 
  // This prevents Sanity from forcing it into a square box calculation.
  return builder.image(source)
    .width(800)
    .auto('format')
    .quality(80)
    .url()
}

// --------------------------------------------------
// SEO + GOOGLE DISCOVER (Keep as is)
// --------------------------------------------------

export const discoverImage = (source: any) => {
  if (!source || !source.asset) return undefined

  // Discover REQUIRES 16:9, so we MUST keep the crop here.
  return builder.image(source)
    .width(1920)
    .height(1080)
    .fit('crop') 
    .auto('format')
    .quality(85)
    .url()
}

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

export const urlForImage = urlFor;