// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'

// --- CONFIGURATION ---
// 1. Validate required environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-22'

// 2. Fail fast if projectId is missing
if (!projectId) {
  throw new Error(
    '❌ SANITY CONFIG ERROR: Missing NEXT_PUBLIC_SANITY_PROJECT_ID\n\n' +
    'Please add to your .env.local file:\n' +
    'NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id\n\n' +
    'Get your project ID from: https://sanity.io/manage'
  )
}

// Export validated config
export { projectId, dataset, apiVersion }

// --- CLIENT CREATION ---
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  
  // 2. CDN STRATEGY
  // true = Faster, cheaper (cached on Sanity's Edge).
  // false = Always fresh, but slower and costs more API calls.
  useCdn: process.env.NODE_ENV === 'production', 
  
  // 3. PERSPECTIVE
  perspective: 'published',
  
  // 4. STEGA (Visual Editing)
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})

/**
 * HELPER: Fetch with Revalidation
 * 
 * @template QueryResponse - The expected return type of the query
 * @param query - GROQ query string
 * @param params - Query parameters (type-safe in TypeScript)
 * @param tags - Revalidation tags for ISR
 * @returns Promise with typed response
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: 60, 
      tags,
    },
  })
}