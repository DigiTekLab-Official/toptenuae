import { groq } from 'next-sanity';

// =============================================================================
// DEAL QUERIES
// =============================================================================

export const ALL_ACTIVE_DEALS = groq`
  *[_type == "deal" && isActive == true] | order(featured desc, _createdAt desc) {
    _type, _id, _createdAt,
    "title": coalesce(title, product->title),
    description,
    "image": coalesce(image.asset->url, product->mainImage.asset->url),
    "affiliateLink": coalesce(affiliateLink, product->affiliateLink),
    // ✅ CRITICAL ADDITION: Fetch the slug of the related product review
    "reviewSlug": product->slug.current, 
    originalPrice, dealPrice, discountPercentage, category,
    dealEndDate, isPrimeExclusive, featured, couponCode, couponNote,
    "rating": coalesce(rating, product->customerRating),
    "reviewCount": coalesce(reviewCount, product->reviewCount)
  }
`;

// Backward compatibility alias
export const ALL_DEALS_QUERY = ALL_ACTIVE_DEALS;

export const FEATURED_DEALS = groq`
  *[_type == "deal" && isActive == true && featured == true] 
    | order(_createdAt desc)[0...10] {
      _type, _id, _createdAt,
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

export const DEALS_BY_CATEGORY = groq`
  *[_type == "deal" && isActive == true && category == $category] 
    | order(_createdAt desc)[0...50] {
      _type, _id, _createdAt,
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