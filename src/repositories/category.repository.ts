// src/repositories/category.repository.ts
// Category content repository - single source for category data fetching
import { client } from '@/sanity/lib/client';
import {
  ALL_CATEGORIES,
  CATEGORY_BY_SLUG,
  CATEGORY_POSTS,
  CATEGORY_PRODUCTS,
} from '@/sanity/queries';
import type { Category } from '@/types/content/category';

/**
 * Fetch all categories
 * @returns Array of categories or empty array on error
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    return await client.fetch<Category[]>(ALL_CATEGORIES);
  } catch (error) {
    console.error('[CategoryRepository] Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch a single category by slug
 * @returns Category or null if not found / on error
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await client.fetch<Category | null>(CATEGORY_BY_SLUG, { slug });
  } catch (error) {
    console.error('[CategoryRepository] Error fetching category by slug:', error);
    return null;
  }
}

/**
 * Fetch posts belonging to a category
 * @returns Array of posts or empty array on error
 */
export async function getCategoryPosts(categorySlug: string) {
  try {
    return await client.fetch(CATEGORY_POSTS, { category: categorySlug });
  } catch (error) {
    console.error('[CategoryRepository] Error fetching category posts:', error);
    return [];
  }
}

/**
 * Fetch products belonging to a category
 * @returns Array of products or empty array on error
 */
export async function getCategoryProducts(categorySlug: string) {
  try {
    return await client.fetch(CATEGORY_PRODUCTS, { slug: categorySlug });
  } catch (error) {
    console.error('[CategoryRepository] Error fetching category products:', error);
    return [];
  }
}

/**
 * Fetch everything a category page needs in one call: the category itself,
 * its posts, and its products.
 *
 * NOTE: this currently composes three separate Sanity requests. Once
 * `CATEGORY_PAGE_QUERY` exists in `@/sanity/queries/category.queries`, swap
 * the body of this function for a single `client.fetch(CATEGORY_PAGE_QUERY, { slug })`
 * call and drop the Promise.all below — same signature, no caller changes needed.
 *
 * @returns null if the category itself isn't found; otherwise the page data
 */
export async function getCategoryPage(slug: string): Promise<{
  category: Category;
  posts: unknown[];
  products: unknown[];
} | null> {
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) return null;

    const [posts, products] = await Promise.all([
      getCategoryPosts(slug),
      getCategoryProducts(slug),
    ]);

    return { category, posts, products };
  } catch (error) {
    console.error('[CategoryRepository] Error fetching category page:', error);
    return null;
  }
}