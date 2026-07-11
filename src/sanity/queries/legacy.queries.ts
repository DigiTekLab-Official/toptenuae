// src/sanity/queries/legacy.queries.ts --- DEPRECATED: PHASE OUT IN PROGRESS ---
import groq from 'groq';

// =============================================================================
// ⚠️  DEPRECATION NOTICE
// =============================================================================
// This file is being phased out. Queries have been moved to domain-specific files:
//
// - HOME_QUERY                → src/sanity/queries/home.queries.ts (moved in this refactor)
// - GENERIC_POST_QUERY        → src/sanity/queries/post.queries.ts
// - REVIEWS_HUB_QUERY         → src/sanity/queries/review.queries.ts
// - CATEGORY_PAGE_QUERY       → src/sanity/queries/category.queries.ts (moved in previous refactor)
//
// Import from the specific query files instead of this file.
// This file will be removed in a future refactor.
// =============================================================================

/**
 * @deprecated Use `GENERIC_POST_QUERY` from `@/sanity/queries/post.queries` instead
 * Generic post query - Works for articles, tools, how-tos, and other content types
 */
export const GENERIC_POST_QUERY = groq`
  *[slug.current == $slug][0]{
    _type,
    "slug": slug.current, _id, title, description,
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, description, ""),
    "mainImage": coalesce(mainImage, image, coverImage, product->mainImage) { "url": asset->url, alt },
    "category": coalesce(categories[0], category)->{ "title": title, "slug": slug.current, "menuLabel": menuLabel },
    "categories": categories[]->{ "slug": slug.current, title },
    publishedAt, "_updatedAt": _updatedAt, "_createdAt": _createdAt, schemaType,
    "intro": intro,
    "body": body[]{
      ...,
      _type == "relatedLink" => {
        ...,
        "targetPost": targetPost->{
          title,
          "slug": slug.current,
          "category": coalesce(categories[0]->slug.current, category->slug.current)
        }
      }
    },
    "content": content,
    "procedure": procedure,
    "closingContent": closingContent,
    showAffiliateDisclosure,
    faqs[] { _key, question, answer },
    howToSteps,
    startDate, endDate, isAllDay, locationName, address, ticketPrice, ticketUrl, isTicketAvailable, status
  }
`;

/**
 * @deprecated Use `REVIEWS_HUB_QUERY` from `@/sanity/queries/review.queries` instead
 * Reviews hub query - Returns featured reviews and all reviews
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