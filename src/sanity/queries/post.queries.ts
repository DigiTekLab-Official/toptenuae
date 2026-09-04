// src/sanity/queries/post.queries.ts --- GENERIC POST QUERIES ---
import groq from 'groq';

// =============================================================================
// GENERIC POST QUERIES - Works across multiple content types
// =============================================================================

/**
 * GENERIC_POST_QUERY - Fetch single post by slug, works for articles, tools, how-tos, and other content types
 * Use for: individual post/article pages with full content and metadata
 * Returns: full post data including body, SEO, category, FAQs, and related content
 */
export const GENERIC_POST_QUERY = groq`
  *[slug.current == $slug][0]{
    _type,
    "slug": slug.current, _id, title, description,
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, description, ""),
    seo,
    "mainImage": coalesce(featuredImage, mainImage, image, coverImage, product->mainImage) {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          },
          lqip
        }
      },
      alt,
      hotspot,
      crop,
      "url": asset->url
    },
    "category": coalesce(categories[0], category)->{ "title": title, "slug": slug.current, "menuLabel": menuLabel },
    "categorySlug": coalesce(categories[0]->slug.current, category->slug.current),
    "categories": categories[]->{ "slug": slug.current, title },
    publishedAt, originalPublishedAt, lastReviewedAt,
    "_updatedAt": _updatedAt, "_createdAt": _createdAt, schemaType,
    "author": coalesce(author, Author)->{ name, role, image, bio },
    reviewedBy->{name, role},
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
    methodology,
    sources[]{title, publisher, url, accessedAt},
    affiliateDisclosure,
    showAffiliateDisclosure,
    faqs[] { _key, question, answer },
    howToSteps,
    startDate, endDate, isAllDay, locationName, address, ticketPrice, ticketUrl, isTicketAvailable, status,
    "sidebarPosts": *[
      _type in ["topTenList", "howTo", "post"] &&
      slug.current != $slug
    ] | order(publishedAt desc)[0...5] {
      _type,
      title,
      "slug": slug.current,
      "category": coalesce(categories[0]->slug.current, category->slug.current),
      publishedAt,
      "imageUrl": mainImage.asset->url
    }
  }
`;
