// src/types/sanity.ts

/**
 * Sanity content model TypeScript definitions
 * - Improved typing for images, affiliate links, price, availability, and timestamps
 * - Keeps original Deal shape but with clearer, safer types
 */

export type ISODateString = string; // e.g. "2025-12-31T12:00:00Z"

export interface SanitySlug {
  current: string;
}

/** Minimal image mapping from Sanity asset */
export interface SanityImage {
  url: string;
  alt?: string;
  caption?: string;
  credit?: string;
  // optional width/height if available from the asset metadata
  width?: number;
  height?: number;
}

/** Affiliate link metadata */
export interface AffiliateLink {
  url: string;
  /** e.g. 'amazon.ae', 'noon.com' */
  host?: string;
  /** optional tracking id or UTM */
  trackingId?: string;
  /** whether the link is validated/allowed by server-side allowlist */
  isAllowed?: boolean;
  /** canonical product URL (non-affiliate) if available */
  canonicalUrl?: string;
}

/** Price object to map to schema.org Offer */
export interface Price {
  amount: number;
  currency: string; // ISO 4217 e.g. 'AED'
  /** optional original price before discount */
  originalAmount?: number;
  /** optional validity window for the price */
  validFrom?: ISODateString;
  validUntil?: ISODateString;
}

/** Availability enum aligned with schema.org where useful */
export type Availability =
  | 'InStock'
  | 'OutOfStock'
  | 'PreOrder'
  | 'Discontinued'
  | 'LimitedAvailability'
  | string; // allow custom values if needed

/** Seller / retailer info */
export interface Seller {
  name?: string;
  url?: string;
  id?: string;
}

/** Primary Deal interface (improved) */
export interface Deal {
  _id: string;
  _createdAt: ISODateString;
  _updatedAt?: ISODateString;

  title: string;
  slug?: SanitySlug;
  description?: string;

  /** Primary image and optional gallery */
  image?: string; // legacy single image URL (kept for backward compatibility)
  mainImage?: SanityImage;
  images?: SanityImage[];

  /** Affiliate / commerce data */
  // NOTE: Your queries might return a string or an object depending on version. 
  // We allow string here for backward compatibility with your existing Groq queries.
  affiliateLink?: string | AffiliateLink;
  
  originalPrice?: number;
  dealPrice?: number;
  price?: Price;

  /** Computed or stored discount percentage (0-100) */
  discountPercentage?: number;

  /** Category reference or simple string */
  category?: string | { id?: string; title?: string; slug?: string };

  /** Deal timing */
  dealStartDate?: ISODateString;
  dealEndDate?: ISODateString;
  isActive?: boolean;

  /** Flags */
  isPrimeExclusive?: boolean;
  featured?: boolean;

  /** Ratings and reviews */
  rating?: number; // average rating (e.g., 4.5)
  reviewCount?: number;

  /** Coupon / promo */
  couponCode?: string;
  couponNote?: string;

  /** Availability and seller */
  availability?: Availability;
  seller?: Seller;

  /** Optional editorial / moderation fields */
  createdBy?: { id?: string; name?: string };
  updatedBy?: { id?: string; name?: string };

  /** Optional tags and metadata */
  tags?: string[];
  notes?: string;

  /** Source URL in case the deal was imported from another site */
  sourceUrl?: string;

  /** Soft-delete or visibility control */
  isVisible?: boolean;

  /** Any raw Sanity payload you want to keep for debugging (avoid in production) */
  _raw?: unknown;
}