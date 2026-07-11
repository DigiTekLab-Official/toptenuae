// src/sanity/queries/settings.queries.ts --- QUERIES FOR GLOBAL SETTINGS AND DATA ---
import groq from 'groq';

// =============================================================================
// GLOBAL QUERIES
// =============================================================================

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    _type,
    title,
    description,
    "logoMain": logoMain.asset->url,
    "logoIcon": logoIcon.asset->url,
    "logoBimi": logoBimi.asset->url,
    "ogImage": ogImage.asset->url,
    socialLinks[] { platform, url },
    contactEmail
  }
`;

// Aliased title→label, url→href here to match the existing NavigationLink
// type (src/types/site/navigation.ts), which was already written expecting
// that shape. Schema fields themselves are still "title"/"url".
export const NAVIGATION_MENU = groq`
  *[_type == "navigationMenu"][0] {
    _id,
    title,
    items[] {
      _key,
      "label": title,
      "href": url,
      children[] {
        _key,
        "label": title,
        "href": url
      }
    }
  }
`;

// NOTE: FooterData (src/types/site/footer.ts) expects grouped
// `columns: FooterColumn[]`, but footerSettings only stores a flat `links`
// array with no grouping key. Left un-aliased/un-grouped pending a decision
// - see conversation for options.
export const FOOTER_DATA = groq`
  *[_type == "footerSettings"][0] {
    _id,
    companyInfo,
    links[] { title, url },
    socialLinks[] { platform, url },
    copyrightText
  }
`;