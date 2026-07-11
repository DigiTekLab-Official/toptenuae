// src/repositories/product.repository.ts
// Product content repository - single source for product data fetching
import { client } from '@/sanity/lib/client';
import {
  ALL_PRODUCTS,
  PRODUCTS_BY_CATEGORY,
  PRODUCT_SEARCH,
  PRODUCT_BY_SLUG,
  RELATED_FOR_PRODUCT,
} from '@/sanity/queries/product.queries';
import type { Product } from '@/types/content/product';

/**
 * Fetch a single product by slug
 * @param slug - Product slug
 * @returns Product data or null
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;

  try {
    return await client.fetch<Product | null>(PRODUCT_BY_SLUG, { slug });
  } catch (error) {
    console.error(`[ProductRepository] Error fetching product [${slug}]:`, error);
    return null;
  }
}

/**
 * Fetch all products
 * @returns Array of products or empty array on error
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await client.fetch<Product[]>(ALL_PRODUCTS);
  } catch (error) {
    console.error('[ProductRepository] Error fetching all products:', error);
    return [];
  }
}

/**
 * Fetch products belonging to a category
 * @param categorySlug - Category slug to filter by
 * @returns Array of products or empty array on error
 */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    return await client.fetch<Product[]>(PRODUCTS_BY_CATEGORY, { categorySlug });
  } catch (error) {
    console.error('[ProductRepository] Error fetching products by category:', error);
    return [];
  }
}

/**
 * Search products by title or brand
 * @param searchTerm - Raw search term (wildcard wrapping applied here)
 * @returns Array of matching products or empty array on error
 */
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  if (!searchTerm) return [];

  try {
    return await client.fetch<Product[]>(PRODUCT_SEARCH, {
      searchTerm: `*${searchTerm}*`,
    });
  } catch (error) {
    console.error('[ProductRepository] Error searching products:', error);
    return [];
  }
}

/**
 * Fetch related content (reviews/lists/etc.) for a given product,
 * used on product review pages to surface related items.
 * @param productId - The product's `_id`
 * @returns Array of related content or empty array on error
 */
export async function getRelatedProductContent(productId: string) {
  if (!productId) return [];

  try {
    return await client.fetch(RELATED_FOR_PRODUCT, { id: productId });
  } catch (error) {
    console.error('[ProductRepository] Error fetching related product content:', error);
    return [];
  }
}
