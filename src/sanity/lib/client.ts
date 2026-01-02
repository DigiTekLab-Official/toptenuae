// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'

export const projectId = process.env.SANITY_PROJECT_ID
export const dataset = process.env.SANITY_DATASET
export const apiVersion = process.env.SANITY_API_VERSION || '2024-01-01'

// ✅ 1. ADD VALIDATION TO PREVENT BUILD CRASHES
if (!projectId || !dataset) {
  console.warn(
    "Missing Sanity configuration. Check your Environment Variables in Cloudflare."
  );
}

export const client = createClient({
  projectId: projectId || 'missing-id', // Prevents the client from throwing a fatal error
  dataset: dataset || 'production',
  apiVersion,
  // ✅ 2. FORCE 'false' FOR CLOUDFLARE EDGE
  // Cloudflare Workers sometimes have issues with the global CDN cache during builds
  useCdn: false, 
  // ✅ 3. ADD PERSPECTIVE FOR NEXT.JS 16
  perspective: 'published',
})