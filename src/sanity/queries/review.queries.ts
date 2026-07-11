// src/sanity/queries/review.queries.ts --- REVIEW HUB QUERIES ---
import groq from 'groq';

// =============================================================================
// REVIEW HUB QUERIES - Editorial surface for product reviews
// =============================================================================

/**
 * REVIEWS_HUB_QUERY - Fetch featured reviews and all reviews for hub page
 * Use for: reviews hub/archive page showing all product reviews
 * Returns: featured reviews and paginated list of all reviews with ratings and metadata
 */
export const REVIEWS_HUB_QUERY = groq`{
  "featured": *[_type == "product" && isFeaturedReview == true] | order(_updatedAt desc) [0...8] {
    _id, title, "rating": customerRating, "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url)
  },
  "reviews": *[_type == "product"] | order(_createdAt desc) [0...50] {
    _id, title, "rating": customerRating, "slug": slug.current,
    "section": reviewSection,
    "subCategoryTitle": subCategory->menuLabel,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url)
  }
}`;
