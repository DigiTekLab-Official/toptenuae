// src/sanity/queries/legacy.queries.ts --- LEGACY QUERIES STILL IN USE ---
import groq from 'groq';

// =============================================================================
// ADDITIONAL LEGACY QUERIES - Still used in pages
// =============================================================================

/**
 * Homepage query - Returns featured post, categorized sections, and upcoming posts
 */
export const HOME_QUERY = groq`{
  "heroPost": coalesce(
    *[_type in ["topTenList", "article"] && isFeaturedOnHome == true] | order(publishedAt desc) [0],
    *[_type in ["topTenList", "article"]] | order(publishedAt desc) [0]
  ) {
    _id,
    title,
    "slug": slug.current,
    intro,
    mainImage { "url": asset->url, alt },
    "categorySlug": coalesce(categories[0]->slug.current, category->slug.current)
  },
  "sections": *[_type == "category" && slug.current in $categories] | order(order asc, title asc) {
    title,
    "slug": slug.current,
    description,
    "posts": *[
      (_type in ["topTenList", "article", "tool", "product", "howTo", "holiday"]) &&
      (
        ^._id in categories[]._ref ||
        ^._id in displayCategories[]._ref ||
        category._ref == ^._id ||
        categories[0]._ref == ^._id
      )
    ] | order(publishedAt desc)[0...4] {
      _id,
      _type,
      title,
      "slug": slug.current,
      publishedAt,
      mainImage { "url": asset->url, alt }
    }
  },
  "upcomingPosts": *[_type in ["topTenList", "article"] && category->slug.current == "upcoming"] | order(publishedAt desc)[0...4] {
    _id,
    title,
    "slug": slug.current,
    mainImage { "url": asset->url, alt }
  }
}`;

/**
 * Category page query - Returns category with all related items
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
    ] | order(publishedAt desc)[0...100] { 
      _type, title, "slug": slug.current, publishedAt,
      "mainImage": coalesce(mainImage, image, product->mainImage) { "url": asset->url, alt },
      "rawExcerpt": coalesce(description, intro, "")
    }
  }
`;

/**
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
    startDate, endDate, locationName, address, ticketPrice, ticketUrl, isTicketAvailable, status
  }
`;

/**
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
