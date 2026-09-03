// src/sanity/queries/product.queries.ts
// Product queries - Note: For TopTenUAE, products function as review entities
import groq from 'groq';

// =============================================================================
// PRODUCT QUERIES
// =============================================================================

/**
 * PRODUCT_BY_SLUG - Fetch single product/review by slug
 * Returns full product data including SEO, images, and category relationships
 * NOTE: Product data should be normalized by the repository into review-oriented DTOs
 */
export const PRODUCT_BY_SLUG = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _type,
    _id,
    _createdAt,
    _updatedAt,
    title,
    brand,
    "slug": slug.current,
    price,
    currency,
    availability,
    availabilityStatus,
    availabilityCheckedAt,
    priceTier,
    retailer,
    affiliateLink,
    affiliateLinks[]->{merchant, merchantLabel, affiliateUrl, note, isPrimary, lastCheckedAt},
    pros,
    cons,
    keyFeatures,
    specifications[] { specLabel, specValue },
    customerRating,
    reviewCount,
    verdict,
    realComplaint,
    mainImage { "url": asset->url, alt },
    itemDescription, 
    whoItsFor,
    whoShouldAvoid,
    testingMethodology,
    researchType,
    sources[]{title, publisher, url, accessedAt},
    alternatives[]->{_id, title, "slug": slug.current, brand, verdict, mainImage{"url": asset->url, alt}},
    uaeCommerce,
    lastPriceCheckedAt,
    originalPublishedAt,
    lastReviewedAt,
    affiliateDisclosure,
    author->{name, "slug": slug.current, role, bio, expertise, credentials, socialLinks, profileUrl, image{"url": asset->url, alt}},
    reviewedBy->{name, "slug": slug.current, role, bio, expertise, credentials, profileUrl},
    seo,
    // SEO Data
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, itemDescription, ""),
    "seoImage": coalesce(seo.ogImage.asset->url, mainImage.asset->url),
    "category": coalesce(category, subCategory)->{title, "slug": slug.current},
    "categories": coalesce(categories, displayCategories)[]->{ "slug": slug.current, title }
  }
`;

/**
 * @deprecated Use PRODUCT_BY_SLUG directly - alias will be removed in future refactor
 */
export const PRODUCT_BY_SLUG_QUERY = PRODUCT_BY_SLUG;

/**
 * PRODUCT_PAGE_QUERY - One request for a review, its route fallback metadata,
 * and related content. The previous route issued a product request followed by
 * a second related-content request for every successful review page.
 */
export const PRODUCT_PAGE_QUERY = groq`{
  "data": *[_type == "product" && slug.current == $slug][0] {
    _type,
    _id,
    _createdAt,
    _updatedAt,
    title,
    brand,
    "slug": slug.current,
    price,
    currency,
    availability,
    availabilityStatus,
    availabilityCheckedAt,
    priceTier,
    retailer,
    affiliateLink,
    affiliateLinks[]->{merchant, merchantLabel, affiliateUrl, note, isPrimary, lastCheckedAt},
    pros,
    cons,
    keyFeatures,
    specifications[] { specLabel, specValue },
    customerRating,
    reviewCount,
    verdict,
    realComplaint,
    mainImage { "url": asset->url, alt },
    itemDescription,
    whoItsFor,
    whoShouldAvoid,
    testingMethodology,
    researchType,
    sources[]{title, publisher, url, accessedAt},
    alternatives[]->{_id, title, "slug": slug.current, brand, verdict, mainImage{"url": asset->url, alt}},
    uaeCommerce,
    lastPriceCheckedAt,
    originalPublishedAt,
    lastReviewedAt,
    affiliateDisclosure,
    author->{name, "slug": slug.current, role, bio, expertise, credentials, socialLinks, profileUrl, image{"url": asset->url, alt}},
    reviewedBy->{name, "slug": slug.current, role, bio, expertise, credentials, profileUrl},
    seo,
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, itemDescription, ""),
    "seoImage": coalesce(seo.ogImage.asset->url, mainImage.asset->url),
    "category": coalesce(category, subCategory)->{title, "slug": slug.current},
    "categories": coalesce(categories, displayCategories)[]->{ "slug": slug.current, title }
  },
  "fallback": *[slug.current == $slug][0]{
    _type,
    "categorySlug": coalesce(category->slug.current, subCategory->slug.current),
    "categories": coalesce(categories, displayCategories)[]->slug.current
  },
  "related": {
    "lists": *[
      _type == "topTenList" &&
      references(*[_type == "product" && slug.current == $slug][0]._id)
    ] | order(publishedAt desc)[0...3]{
      title,
      "slug": slug.current,
      mainImage { asset->{ url } }
    },
    "products": *[
      _type == "product" &&
      slug.current != $slug &&
      count(*[
        _type == "topTenList" &&
        references(^._id) &&
        references(*[_type == "product" && slug.current == $slug][0]._id)
      ]) > 0
    ] | order(_updatedAt desc)[0...8]{
      title,
      "slug": slug.current,
      brand,
      priceTier,
      mainImage { asset->{ url } }
    }
  }
}`;

/**
 * RELATED_FOR_PRODUCT - Fetch related content for a product review page
 * Returns top-ten lists featuring this product + co-featured products for crawl link signals
 * Use for: "Related articles" and "Similar products" sections on review pages
 */
export const RELATED_FOR_PRODUCT = groq`{
  "lists": *[_type == "topTenList" && references($id)] | order(publishedAt desc)[0...3]{
    title,
    "slug": slug.current,
    mainImage { asset->{ url } }
  },
  "products": *[_type == "product" && _id != $id && count(*[_type == "topTenList" && references(^._id) && references($id)]) > 0]
    | order(_updatedAt desc)[0...8]{
      title,
      "slug": slug.current,
      brand,
      priceTier,
      mainImage { asset->{ url } }
    }
}`;

/**
 * ALL_PRODUCTS - Fetch all products with basic metadata
 * Use for: Product listings, archives, feeds
 */
export const ALL_PRODUCTS = groq`
  *[_type == "product"] | order(publishedAt desc)[0...100]{
    _id,
    title,
    "slug": slug.current,
    brand,
    price,
    currency,
    mainImage { "url": asset->url, alt },
    customerRating,
    reviewCount,
    "category": category->title,
    publishedAt
  }
`;

/**
 * PRODUCTS_BY_CATEGORY - Fetch products in a specific category
 * Use for: Category-specific product listings
 */
export const PRODUCTS_BY_CATEGORY = groq`
  *[_type == "product" && category->slug.current == $categorySlug] 
    | order(publishedAt desc)[0...50]{
      _id,
      title,
      "slug": slug.current,
      brand,
      price,
      currency,
      mainImage { "url": asset->url, alt },
      customerRating,
      reviewCount,
      publishedAt
    }
`;

/**
 * PRODUCT_SEARCH - Search products by title or brand
 * Use for: Search results, autocomplete
 */
export const PRODUCT_SEARCH = groq`
  *[_type == "product" && (title match $searchTerm || brand match $searchTerm)]
    | order(publishedAt desc)[0...50]{
      _id,
      title,
      "slug": slug.current,
      brand,
      price,
      currency,
      mainImage { "url": asset->url, alt },
      customerRating,
      reviewCount
    }
`;
