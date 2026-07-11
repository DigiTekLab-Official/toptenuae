// src/sanity/queries/post.queries.ts
import groq from 'groq';

/**
 * Generic post query - Works for articles, tools, how-tos, holidays,
 * events, and other non-topten editorial content types.
 * Moved from legacy.queries.ts.
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