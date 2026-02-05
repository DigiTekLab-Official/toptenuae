import { client } from '@/sanity/lib/client';
import {
  PRODUCT_BY_SLUG,
  ALL_PRODUCTS,
  PRODUCTS_BY_CATEGORY,
  PRODUCT_SEARCH,
} from '@/sanity/queries';

export interface Product {
  _type: string;
  _id: string;
  title: string;
  brand?: string;
  slug: string;
  price?: number;
  currency?: string;
  availability?: string;
  priceTier?: string;
  retailer?: string;
  affiliateLink?: string;
  pros?: string[];
  cons?: string[];
  keyFeatures?: string[];
  specifications?: Array<{ specLabel?: string; specValue?: string }>;
  customerRating?: number;
  reviewCount?: number;
  verdict?: string;
  mainImage?: { url?: string; alt?: string };
  itemDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export class ProductRepository {
  /**
   * Fetch a single product by slug
   */
  async findBySlug(slug: string): Promise<Product | null> {
    return client.fetch<Product | null>(PRODUCT_BY_SLUG, { slug });
  }

  /**
   * Fetch all products
   */
  async findAll(): Promise<Product[]> {
    return client.fetch<Product[]>(ALL_PRODUCTS);
  }

  /**
   * Fetch products by category
   */
  async findByCategory(categorySlug: string): Promise<Product[]> {
    return client.fetch<Product[]>(PRODUCTS_BY_CATEGORY, {
      categorySlug,
    });
  }

  /**
   * Search products by title or brand
   */
  async search(searchTerm: string): Promise<Product[]> {
    return client.fetch<Product[]>(PRODUCT_SEARCH, {
      searchTerm: `*${searchTerm}*`,
    });
  }
}

export const productRepository = new ProductRepository();
