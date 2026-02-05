// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'

// --- CLIENT CREATION ---
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use the useCdn logic centralized in your env.ts, or override here if needed
  useCdn, 
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
      revalidate: 60, // Consider using false or 0 for real-time, or 60 for cache
      tags,
    },
  })
}