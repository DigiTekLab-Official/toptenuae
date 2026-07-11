// src/types/content/product.ts
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
  mainImage?: { url: string; alt?: string };
  itemDescription?: unknown[];
  whoItsFor?: string;
  whoShouldAvoid?: string;
  testingMethodology?: unknown[];
  sources?: Array<{title: string; publisher?: string; url: string; accessedAt?: string}>;
  lastReviewedAt?: string;
  originalPublishedAt?: string;
  lastPriceCheckedAt?: string;
  affiliateDisclosure?: string;
  author?: {name: string; role?: string; bio?: string; profileUrl?: string};
  reviewedBy?: {name: string; role?: string; profileUrl?: string};
  seo?: {metaTitle?: string; metaDescription?: string; canonicalUrl?: string; noIndex?: boolean};
  seoTitle?: string;
  seoDescription?: string;
  _type?: 'product';
  _updatedAt?: string;
  _createdAt?: string;
  publishedAt?: string;
}
