// 1. FIX LIBRARY IMPORT (Standard Usage)
import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

// 2. IMPORT CONFIG FROM CLIENT
// This ensures we use the same Project ID that works for the rest of the app
import { dataset, projectId } from './client'

const builder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

// --------------------------------------------------
// AMAZON + CONVERSION IMAGES (FIXED)
// --------------------------------------------------

export const mainImage = (source: any) => {
  if (!source || !source.asset) return undefined 
  
  return builder.image(source)
    .width(1600) 
    .auto('format')
    .quality(90)
    .url()
}

export const listImage = (source: any) => {
  if (!source || !source.asset) return undefined

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

// Legacy export (just in case)
export const urlForImage = urlFor;