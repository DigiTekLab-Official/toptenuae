// src/sanity/queries/home.queries.ts
import groq from 'groq';

/**
 * Homepage query - Returns featured post, categorized sections, and upcoming posts
 * Moved from legacy.queries.ts.
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
      (_type in ["topTenList", "article", "tool", "product", "howTo", "holiday", "deal", "post", "event"]) &&
      (
        ^._id in categories[]._ref ||
        ^._id in displayCategories[]._ref ||
        category._ref == ^._id ||
        categories[0]._ref == ^._id
      )
    ] | order(coalesce(publishedAt, _createdAt) desc)[0...4] {
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