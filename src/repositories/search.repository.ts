// src/repositories/search.repository.ts
// Site search repository - single source for search data fetching.
// Backs /search, header search, and any command-palette style search UI.
import { client } from '@/sanity/lib/client';
import { SITE_SEARCH_QUERY, SEARCH_SUGGESTIONS_QUERY } from '@/sanity/queries/search.queries';
import type { SearchResult, SearchSuggestion } from '@/types/content/search';

/**
 * Full site search across all searchable content types.
 * @param query - raw search term from the user
 * @returns Array of matching results or empty array on error/empty query
 */
export async function searchSite(query: string): Promise<SearchResult[]> {
  const trimmed = query?.trim();
  if (!trimmed) return [];

  try {
    return await client.fetch<SearchResult[]>(SITE_SEARCH_QUERY, { searchTerm: `*${trimmed}*` });
  } catch (error) {
    console.error('[SearchRepository] Error searching site:', error);
    return [];
  }
}

/**
 * Lightweight live-suggestion search, for search-as-you-type UI.
 * @param query - raw partial search term from the user
 * @returns Array of matching suggestions or empty array on error/empty query
 */
export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  const trimmed = query?.trim();
  if (!trimmed) return [];

  try {
    return await client.fetch<SearchSuggestion[]>(SEARCH_SUGGESTIONS_QUERY, { searchTerm: `*${trimmed}*` });
  } catch (error) {
    console.error('[SearchRepository] Error fetching search suggestions:', error);
    return [];
  }
}
