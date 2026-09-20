// src/sanity/lib/client.ts
// Low-level Sanity transport layer - no page logic, no content mappers
import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../env'

export { apiVersion, dataset, projectId }

// Local production-preview switch. Draft credentials remain server-only and
// production builds always use the published perspective.
const previewDrafts = import.meta.env.DEV && process.env.SANITY_PREVIEW_DRAFTS === 'true'

/**
 * Sanity client instance - use via sanityFetch() wrapper
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !previewDrafts,
  perspective: previewDrafts ? 'drafts' : 'published',
  token: previewDrafts ? process.env.SANITY_WRITE_TOKEN : undefined,
  stega: false,
})

/**
 * Fetch from Sanity with typed response
 * @template QueryResponse - The expected return type from the query
 * @param query - GROQ query string
 * @param params - Query parameters (variables)
 * @returns Typed query result
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

/**
 * TODO: Future helper for common single-document queries
 * export async function sanityFetchFirst<QueryResponse>({
 *   query,
 *   params = {},
 * }: {
 *   query: string
 *   params?: Record<string, unknown>
 * }): Promise<QueryResponse | null> {
 *   const result = await client.fetch<QueryResponse[]>(query, params)
 *   return result[0] ?? null
 * }
 */
