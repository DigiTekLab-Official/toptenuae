import { client } from '@/sanity/lib/client';
import {
  ALL_CATEGORIES,
  CATEGORY_BY_SLUG,
  CATEGORY_POSTS,
  CATEGORY_PRODUCTS,
} from '@/sanity/queries';

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  mainImage?: {
    url: string;
    alt?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export class CategoryRepository {
  /**
   * Fetch all categories
   */
  async findAll(): Promise<Category[]> {
    return client.fetch<Category[]>(ALL_CATEGORIES);
  }

  /**
   * Fetch a single category by slug
   */
  async findBySlug(slug: string): Promise<Category | null> {
    return client.fetch<Category | null>(CATEGORY_BY_SLUG, { slug });
  }

  /**
   * Fetch posts in a specific category
   */
  async findPosts(categorySlug: string) {
    return client.fetch(CATEGORY_POSTS, { category: categorySlug });
  }

  /**
   * Fetch products in a specific category
   */
  async findProducts(categorySlug: string) {
    return client.fetch(CATEGORY_PRODUCTS, { slug: categorySlug });
  }
}

export const categoryRepository = new CategoryRepository();
