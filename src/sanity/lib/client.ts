import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'

// ✅ ADD THIS SECTION: Re-export the variables so index.ts can see them
export { apiVersion, dataset, projectId, useCdn }

// --- CLIENT CREATION ---
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
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
      revalidate: 60,
      tags,
    },
  })
}