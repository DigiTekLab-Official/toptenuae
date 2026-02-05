// src/sanity/lib/fetchers.ts

import { client } from "@/sanity/lib/client";
import {
  PRODUCT_BY_SLUG,
  TOP_TEN_BY_SLUG,
  SITE_SETTINGS_QUERY,
  ALL_ACTIVE_DEALS,
} from "@/sanity/lib/queries";

// =============================================================================
// 1. CENTRALIZED TYPES (Export these to use in your Pages!)
// =============================================================================

export interface Product {
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
  customerRating?: number;
  reviewCount?: number;
  verdict?: string;
  // Standardized Image Format from your Query
  mainImage?: { url: string; alt?: string }; 
  itemDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  _type?: "product";
  _updatedAt?: string;
  _createdAt?: string;
  publishedAt?: string;
}

export interface TopTenList {
  title: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  socialShareImage?: string;
  intro?: string;
  // You can type these strictly if you want, or keep as any[] for flexibility
  body?: any[]; 
  closingContent?: any[];
  showAffiliateDisclosure?: boolean;
  mainImage?: { url: string; alt?: string };
  faqs?: Array<{ _key: string; question: string; answer: string }>;
  listItems?: any[];
  relatedLists?: any[];
  relatedProducts?: any[];
  _type?: "topTenList";
}

export interface Deal {
  _id: string;
  title: string;
  description?: string;
  image?: string; // Resolved URL string
  affiliateLink?: string;
  originalPrice?: number;
  dealPrice?: number;
  discountPercentage?: number;
  category?: string;
  dealEndDate?: string;
  isPrimeExclusive?: boolean;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  couponCode?: string;
  couponNote?: string;
}

export interface SiteSettings {
  title?: string;
  description?: string;
  logoMain?: string;
  logoIcon?: string;
  // ... add other settings fields
}

// ----------------------------
// FETCH OPTIONS
// ----------------------------
const DEFAULT_FETCH_OPTIONS = {
  // force-cache is good, but ensure you have a revalidation strategy
  next: { revalidate: 3600 }, 
};

// ----------------------------
// FETCH FUNCTIONS
// ----------------------------

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;
  try {
    return await client.fetch<Product>(PRODUCT_BY_SLUG, { slug }, DEFAULT_FETCH_OPTIONS);
  } catch (error) {
    console.error(`Error fetching product [${slug}]:`, error);
    return null;
  }
}

export async function fetchTopTenListBySlug(slug: string): Promise<TopTenList | null> {
  if (!slug) return null;
  try {
    return await client.fetch<TopTenList>(TOP_TEN_BY_SLUG, { slug }, DEFAULT_FETCH_OPTIONS);
  } catch (error) {
    console.error(`Error fetching list [${slug}]:`, error);
    return null;
  }
}

export async function fetchAllDeals(): Promise<Deal[]> {
  try {
    return await client.fetch<Deal[]>(ALL_ACTIVE_DEALS, {}, DEFAULT_FETCH_OPTIONS);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, DEFAULT_FETCH_OPTIONS);
  } catch (error) {
    return null;
  }
}