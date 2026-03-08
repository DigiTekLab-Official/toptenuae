// src/sanity/lib/client.ts
import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../env'

export { apiVersion, dataset, projectId }

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

/**
 * Fetch from Sanity with typed response
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: {
  query: string
  params?: Record<string, unknown>
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params)
}