// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'

// --- CONFIGURATION ---
// 1. PROJECT ID: Matches your "Top Ten UAE" workspace
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kxdjzy8e'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-22' // Updated to current date context

// --- CLIENT CREATION ---
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  
  // 2. CDN STRATEGY
  // true = Faster, cheaper (cached on Sanity's Edge).
  // false = Always fresh, but slower and costs more API calls.
  // RECOMMENDATION: Use 'true' for production, 'false' for development.
  useCdn: process.env.NODE_ENV === 'production', 
  
  // 3. PERSPECTIVE
  // 'published' ensures you never accidentally show drafts to visitors.
  perspective: 'published',
  
  // 4. STEGA (Visual Editing)
  // Kept false as per your request, unless you start using Sanity Presentation.
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})

/**
 * HELPER: Fetch with Revalidation
 * Use this function in your page.tsx files to ensure data refreshes every 60s
 * even when using the CDN.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: any
  tags?: string[]
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: 60, // Revalidate every 60 seconds
      tags,
    },
  })
}