// src/sanity/queries/search.queries.ts
// Search queries - Frontend search across content types
import groq from 'groq';

// =============================================================================
// SITE SEARCH QUERIES
// =============================================================================

/**
 * SITE_SEARCH_QUERY - Search across all searchable content types
 * Searches: products (title, brand), articles (title), top-ten lists (title), deals (title)
 * Returns minimal card result shape for search UI display
 * Use for: Site search results page, search dropdown
 */
export const SITE_SEARCH_QUERY = groq`
  [
    *[_type == "product" && (title match $searchTerm || brand match $searchTerm)] {
      _type,
      _id,
      "contentType": "product",
      title,
      "slug": slug.current,
      brand,
      "image": mainImage { "url": asset->url, alt },
      "excerpt": coalesce(verdict, itemDescription, ""),
      "metadata": {
        "rating": customerRating,
        "reviewCount": reviewCount,
        "price": price
      },
      _score
    }[0...5],
    *[_type == "topTenList" && (title match $searchTerm || intro match $searchTerm)] {
      _type,
      _id,
      "contentType": "topTenList",
      title,
      "slug": slug.current,
      "image": mainImage { "url": asset->url, alt },
      "excerpt": intro,
      "metadata": {
        "itemCount": count(listItems),
        "category": category->title
      },
      _score
    }[0...3],
    *[_type == "article" && (title match $searchTerm || description match $searchTerm)] {
      _type,
      _id,
      "contentType": "article",
      title,
      "slug": slug.current,
      "image": mainImage { "url": asset->url, alt },
      "excerpt": description,
      publishedAt,
      _score
    }[0...3],
    *[_type == "deal" && isActive == true && (title match $searchTerm || description match $searchTerm) && (!defined(dealEndDate) || dealEndDate > now())] {
      _type,
      _id,
      "contentType": "deal",
      "title": coalesce(title, product->title),
      "slug": product->slug.current,
      "image": coalesce(image.asset->url, product->mainImage.asset->url),
      "excerpt": description,
      "metadata": {
        "discount": discountPercentage,
        "endDate": dealEndDate
      },
      _score
    }[0...2]
  ] | sort(_score desc)
`;

export const SEARCH_SUGGESTIONS_QUERY = groq`
  *[_type in ["product", "topTenList", "howTo", "holiday", "tool"] && title match $searchTerm]
    | order(_score desc)[0...8] {
      _type,
      title,
      "slug": slug.current
    }
`;
