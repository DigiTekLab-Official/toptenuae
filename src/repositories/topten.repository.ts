// src/repositories/topten.repository.ts
// Top Ten List content repository - single source for top ten data fetching
import { client } from '@/sanity/lib/client';
import {
  TOP_TEN_BY_SLUG,
  ALL_TOP_TEN_LISTS,
  TOP_TEN_LISTS_BY_CATEGORY,
} from '@/sanity/queries/topten.queries';
import type { TopTenList } from '@/types/content/topten';

/**
 * Fetch single top ten list by slug
 * @param slug - Top ten list slug
 * @returns Top ten list data or null
 */
export async function getTopTenBySlug(slug: string): Promise<TopTenList | null> {
  if (!slug) return null;

  try {
    return await client.fetch<TopTenList>(TOP_TEN_BY_SLUG, { slug });
  } catch (error) {
    console.error(`[TopTenRepository] Error fetching list [${slug}]:`, error);
    return null;
  }
}

/**
 * Fetch all top ten lists
 * @returns Array of top ten lists or empty array on error
 */
export async function getAllTopTenLists(): Promise<TopTenList[]> {
  try {
    return await client.fetch<TopTenList[]>(ALL_TOP_TEN_LISTS);
  } catch (error) {
    console.error('[TopTenRepository] Error fetching all lists:', error);
    return [];
  }
}

/**
 * Fetch top ten lists belonging to a category
 * @param categorySlug - Category slug to filter by
 * @returns Array of top ten lists or empty array on error
 */
export async function getTopTenListsByCategory(categorySlug: string): Promise<TopTenList[]> {
  if (!categorySlug) return [];

  try {
    return await client.fetch<TopTenList[]>(TOP_TEN_LISTS_BY_CATEGORY, { categorySlug });
  } catch (error) {
    console.error('[TopTenRepository] Error fetching lists by category:', error);
    return [];
  }
}