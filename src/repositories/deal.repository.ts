// src/repositories/deal.repository.ts
// Deal content repository - single source for deal data fetching
import { client } from '@/sanity/lib/client';
import {
  ALL_ACTIVE_DEALS,
  FEATURED_DEALS,
  DEALS_BY_CATEGORY,
} from '@/sanity/queries';
import type { Deal } from '@/types/content/deal';

/**
 * Fetch all active deals
 * @returns Array of deals or empty array on error
 */
export async function getAllDeals(): Promise<Deal[]> {
  try {
    return await client.fetch<Deal[]>(ALL_ACTIVE_DEALS, {});
  } catch (error) {
    console.error('[DealRepository] Error fetching deals:', error);
    return [];
  }
}

/**
 * Fetch featured deals
 * @returns Array of featured deals or empty array on error
 */
export async function getFeaturedDeals(): Promise<Deal[]> {
  try {
    return await client.fetch<Deal[]>(FEATURED_DEALS, {});
  } catch (error) {
    console.error('[DealRepository] Error fetching featured deals:', error);
    return [];
  }
}

/**
 * Fetch deals by category
 * @param category - category slug/name to filter by
 * @returns Array of deals in the category or empty array on error
 */
export async function getDealsByCategory(category: string): Promise<Deal[]> {
  try {
    return await client.fetch<Deal[]>(DEALS_BY_CATEGORY, { category });
  } catch (error) {
    console.error('[DealRepository] Error fetching deals by category:', error);
    return [];
  }
}