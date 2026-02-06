import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn as envUseCdn } from '../env'

// ✅ Re-export the variables so index.ts can see them
export { apiVersion, dataset, projectId }
// We export the original env variable, but we won't use it for the client below
export const useCdn = false 

// --- CLIENT CREATION ---
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // ⚠️ CRITICAL CHANGE: Set to false for Instant ISR Updates
  // This forces Next.js to fetch fresh data from Sanity, avoiding the 60s CDN cache.
  useCdn: false, 
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})

/**
 * HELPER: Fetch with Revalidation
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
      // We keep a fallback revalidate time, but 'tags' are the main trigger
      revalidate: 60,
      tags,
    },
  })
}