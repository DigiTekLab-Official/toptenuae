// src/sanity/queries/category.queries.ts --- QUERIES FOR CATEGORIES ---
import groq from 'groq';

// =============================================================================
// CATEGORY QUERIES - Single source of truth for all category-related data
// =============================================================================

/**
 * ALL_CATEGORIES - Fetch all categories for navigation/archives
 * Use for: dropdowns, category listings, navigation menus
 */
export const ALL_CATEGORIES = groq`
  *[_type == "category" && defined(slug.current)] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    mainImage { "url": asset->url, alt }
  }
`;

/**
 * CATEGORY_BY_SLUG_QUERY - Fetch single category with basic metadata
 * Use for: category header info, SEO metadata
 */
export const CATEGORY_BY_SLUG_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    mainImage { "url": asset->url, alt },
    seo { metaTitle, metaDescription }
  }
`;

/**
 * CATEGORY_PAGE_QUERY - Full category page with all related items
 * Use for: category landing pages, archive pages
 * Returns category with comprehensive content (topTenList, howTo, tool, holiday, deal, article)
 */
export const CATEGORY_PAGE_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0]{
    title,
    description,
    "slug": slug.current,
    "seo": seo { metaTitle, metaDescription },
    "mainImage": coalesce(
      mainImage,
      image,
      *[references(^._id)][0].mainImage
    ) { "url": asset->url, alt },
    "items": *[
      _type in ["topTenList", "howTo", "tool", "holiday", "deal", "article"] &&
      (references(^._id) || category._ref == ^._id || categories[]._ref == ^._id)
    ] | order(coalesce(publishedAt, _createdAt) desc)[0...100] {
      _type, title, "slug": slug.current, publishedAt,
      "mainImage": coalesce(mainImage, image, product->mainImage) { "url": asset->url, alt },
      "rawExcerpt": coalesce(description, intro, "")
    }
  }
`;

/**
 * CATEGORY_ARCHIVE_QUERY - Fetch all items in a category for archive/listing
 * Use for: category archives, filtered content displays
 */
export const CATEGORY_ARCHIVE_QUERY = groq`
  *[_type in ["article", "product", "topTenList", "howTo"] 
    && references(*[_type == "category" && slug.current == $category]._id)]
    | order(publishedAt desc)[0...50]{
      _id,
      _type,
      title,
      "slug": slug.current,
      mainImage { "url": asset->url, alt },
      publishedAt
    }
`;

/**
 * CATEGORY_PRODUCTS_QUERY - Fetch all products in a category
 * Use for: product listings within category
 */
export const CATEGORY_PRODUCTS_QUERY = groq`
  *[_type == "product" && category->slug.current == $slug]
    | order(publishedAt desc)[0...50]{
      _id,
      title,
      "slug": slug.current,
      price,
      currency,
      mainImage { "url": asset->url, alt },
      customerRating,
      intro,
      reviewCount
    }
`;

// Legacy aliases for backward compatibility
export const CATEGORY_BY_SLUG = CATEGORY_BY_SLUG_QUERY;
export const CATEGORY_POSTS = CATEGORY_ARCHIVE_QUERY;
export const CATEGORY_PRODUCTS = CATEGORY_PRODUCTS_QUERY;
