// src/sanity/lib/image.ts
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || ''

// 1. Error guard for missing env vars
if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity configuration. Please check NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in your .env or Cloudflare dashboard."
  );
}

const builder = createImageUrlBuilder({ projectId, dataset })

// 2. Strongly typed urlFor
export const urlFor = (source: SanityImageSource) => builder.image(source)

// --------------------------------------------------
// HELPERS FOR COMPONENTS
// --------------------------------------------------

// General Image (Paired with next.config.ts loader)
export const mainImage = (source: SanityImageSource) => {
  if (!source) return undefined 
  // We return the base URL; the global loader adds w, q, and auto=format
  return urlFor(source).url() 
}

// SEO & Google Discover (Strict 16:9 ratio)
export const discoverImage = (source: SanityImageSource) => {
  if (!source) return undefined
  return urlFor(source)
    .width(1200)
    .height(675) 
    .fit('crop')
    .auto('format') // Serves AVIF/WebP
    .url()
}

// Sidebar/Thumbnail (Strict 16:9 ratio)
export const sidebarImage = (source: SanityImageSource) => {
  if (!source) return undefined
  return urlFor(source)
    .width(400)
    .height(225) 
    .fit('crop')
    .auto('format') // Added for consistency
    .url()
}