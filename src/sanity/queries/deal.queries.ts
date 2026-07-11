// src/sanity/queries/deal.queries.ts
// Deal queries - Active time-limited offers linked to products
import groq from 'groq';

// =============================================================================
// DEAL QUERIES
// =============================================================================

/**
 * ALL_ACTIVE_DEALS - Fetch all active, non-expired deals
 * Filters: isActive == true, dealEndDate not in past
 * Returns deals with fallback to linked product data (title, image, rating)
 * Use for: Deals page, deals hub, deal listings
 */
export const ALL_ACTIVE_DEALS = groq`
  *[_type == "deal" && isActive == true && (!defined(dealEndDate) || dealEndDate > now())] | order(featured desc, _createdAt desc) {
    _type, _id, _createdAt, _updatedAt,
    "title": coalesce(title, product->title),
    description,
    "image": coalesce(image.asset->url, product->mainImage.asset->url),
    "affiliateLink": coalesce(affiliateLink, product->affiliateLink),
    "reviewSlug": product->slug.current, 
    originalPrice, 
    dealPrice, 
    discountPercentage, 
    category,
    dealEndDate, 
    isPrimeExclusive, 
    featured, 
    couponCode, 
    couponNote,
    "rating": coalesce(rating, product->customerRating),
    "reviewCount": coalesce(reviewCount, product->reviewCount)
  }
`;

/**
 * @deprecated Use ALL_ACTIVE_DEALS directly - alias will be removed in future refactor
 */
export const ALL_DEALS_QUERY = ALL_ACTIVE_DEALS;

/**
 * FEATURED_DEALS - Fetch featured/promoted deals only
 * Most recent first, limited to 10 results
 * Use for: Homepage deals section, hero carousel
 */
export const FEATURED_DEALS = groq`
  *[_type == "deal" && isActive == true && featured == true && (!defined(dealEndDate) || dealEndDate > now())]
    | order(_createdAt desc)[0...10] {
      _type, _id, _createdAt, _updatedAt,
      "title": coalesce(title, product->title),
      description,
      "image": coalesce(image.asset->url, product->mainImage.asset->url),
      "affiliateLink": coalesce(affiliateLink, product->affiliateLink),
      "reviewSlug": product->slug.current,
      originalPrice, dealPrice, discountPercentage, category,
      dealEndDate, isPrimeExclusive, couponCode, couponNote,
      "rating": coalesce(rating, product->customerRating),
      "reviewCount": coalesce(reviewCount, product->reviewCount)
    }
`;

/**
 * DEALS_BY_CATEGORY - Fetch active deals filtered by category
 * Use for: Category-specific deal listings
 * TODO: If individual deal pages are added, create DEAL_BY_SLUG
 * TODO: If archive page needs grouping, create DEALS_ARCHIVE_QUERY
 */
export const DEALS_BY_CATEGORY = groq`
  *[_type == "deal" && isActive == true && category == $category && (!defined(dealEndDate) || dealEndDate > now())]
    | order(_createdAt desc)[0...50] {
      _type, _id, _createdAt, _updatedAt,
      "title": coalesce(title, product->title),
      description,
      "image": coalesce(image.asset->url, product->mainImage.asset->url),
      "affiliateLink": coalesce(affiliateLink, product->affiliateLink),
      "reviewSlug": product->slug.current,
      originalPrice, dealPrice, discountPercentage,
      dealEndDate, isPrimeExclusive, couponCode, couponNote,
      "rating": coalesce(rating, product->customerRating),
      "reviewCount": coalesce(reviewCount, product->reviewCount)
    }
`;