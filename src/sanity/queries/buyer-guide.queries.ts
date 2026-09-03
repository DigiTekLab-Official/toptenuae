import groq from 'groq';

/** One bounded, minimal read for the public buying-guides directory. */
export const BUYER_GUIDES_INDEX_QUERY = groq`
  *[
    _type == "buyerGuide" &&
    defined(slug.current) &&
    coalesce(seo.noIndex, false) != true
  ] | order(coalesce(categories[0]->title, category->title) asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    "categorySlug": coalesce(categories[0]->slug.current, category->slug.current),
    "categoryTitle": coalesce(categories[0]->title, category->title, "Other buying guides"),
    "summary": coalesce(description, intro, ""),
    "mainImage": coalesce(featuredImage, mainImage) {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      alt,
      crop,
      hotspot,
      "url": asset->url
    },
    "updatedAt": coalesce(_updatedAt, publishedAt, _createdAt)
  }
`;
