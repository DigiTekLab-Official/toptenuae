import { client } from '@/sanity/lib/client';
import { ALL_ACTIVE_DEALS, FEATURED_DEALS, DEALS_BY_CATEGORY } from '@/sanity/queries';

export interface Deal {
  _type: string;
  _id: string;
  title: string;
  description?: string;
  image?: string;
  affiliateLink?: string;
  originalPrice?: number;
  dealPrice?: number;
  discountPercentage?: number;
  category?: string;
  dealEndDate?: string;
  isPrimeExclusive?: boolean;
  featured?: boolean;
  couponCode?: string;
  couponNote?: string;
  rating?: number;
  reviewCount?: number;
}

export class DealRepository {
  /**
   * Fetch all active deals
   */
  async findAll(): Promise<Deal[]> {
    return client.fetch<Deal[]>(ALL_ACTIVE_DEALS);
  }

  /**
   * Fetch featured deals
   */
  async findFeatured(): Promise<Deal[]> {
    return client.fetch<Deal[]>(FEATURED_DEALS);
  }

  /**
   * Fetch deals by category
   */
  async findByCategory(category: string): Promise<Deal[]> {
    return client.fetch<Deal[]>(DEALS_BY_CATEGORY, { category });
  }
}

export const dealRepository = new DealRepository();
