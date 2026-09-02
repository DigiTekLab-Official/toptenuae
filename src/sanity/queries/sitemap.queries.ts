// src/sanity/queries/sitemap.queries.ts
// Sitemap queries - Fetch all indexable routes for XML sitemap generation
import groq from 'groq';

// =============================================================================
// SITEMAP QUERIES - Per-type for easier debugging and granular updates
// =============================================================================

/**
 * SITEMAP_TOPTEN_QUERY - All published top-ten lists
 * Returns: slug, publishedAt, updatedAt for sitemap priority/frequency
 * Use for: Dynamic sitemap generation
 */
export const SITEMAP_TOPTEN_QUERY = groq`
  *[_type == "topTenList" && defined(slug.current)]
    | order(_updatedAt desc) {
      "slug": slug.current,
      "path": "/top-ten/" + slug.current,
      "lastmod": coalesce(_updatedAt, publishedAt, _createdAt),
      "priority": 0.8,
      "frequency": "weekly"
    }
`;

/**
 * SITEMAP_PRODUCTS_QUERY - All published product reviews
 * Returns: slug, lastmod for sitemap
 * Use for: Dynamic sitemap generation
 */
export const SITEMAP_PRODUCTS_QUERY = groq`
  *[_type == "product" && defined(slug.current)]
    | order(_updatedAt desc) {
      "slug": slug.current,
      "path": "/reviews/" + slug.current,
      "lastmod": coalesce(_updatedAt, publishedAt, _createdAt),
      "priority": 0.8,
      "frequency": "monthly"
    }
`;

/**
 * SITEMAP_POSTS_QUERY - All published articles and content pages
 * Returns: slug, lastmod for sitemap
 * Use for: Dynamic sitemap generation
 */
export const SITEMAP_POSTS_QUERY = groq`
  *[_type in ["article", "howTo", "post"] && defined(slug.current)]
    | order(_updatedAt desc) {
      "slug": slug.current,
      "path": "/" + slug.current,
      "lastmod": coalesce(_updatedAt, publishedAt, _createdAt),
      "priority": 0.7,
      "frequency": "weekly"
    }
`;

/**
 * SITEMAP_CATEGORIES_QUERY - All published categories
 * Returns: slug, lastmod for sitemap
 * Use for: Dynamic sitemap generation
 */
export const SITEMAP_CATEGORIES_QUERY = groq`
  *[_type == "category" && defined(slug.current)]
    | order(_updatedAt desc) {
      "slug": slug.current,
      "path": "/" + slug.current,
      "lastmod": coalesce(_updatedAt, _createdAt),
      "priority": 0.6,
      "frequency": "daily"
    }
`;

export const SITEMAP_ENTRIES_QUERY = groq`
  *[
    _type in ["category", "topTenList", "product", "buyerGuide", "howTo", "holiday", "tool"] &&
    defined(slug.current) &&
    coalesce(seo.noIndex, false) != true
  ] {
    _type,
    "slug": slug.current,
    "categorySlug": coalesce(categories[0]->slug.current, category->slug.current),
    "_updatedAt": coalesce(_updatedAt, publishedAt, _createdAt)
  }
`;

/**
 * TODO: SITEMAP_DEALS_QUERY - Active deals (optional)
 * Only include non-expired deals in sitemap
 * Exclude if deals are not intended as indexed content
 *
 * export const SITEMAP_DEALS_QUERY = groq`
 *   *[_type == "deal" && isActive == true && (!defined(dealEndDate) || dealEndDate > now())]
 *     | order(_updatedAt desc) {
 *       "slug": _id,
 *       "path": "/deals/" + _id,
 *       "lastmod": _updatedAt,
 *       "priority": 0.5,
 *       "frequency": "daily"
 *     }
 * `;
 */
