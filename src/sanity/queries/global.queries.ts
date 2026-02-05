import { groq } from 'next-sanity';

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

export const NAVIGATION_MENU = groq`
  *[_type == "navigationMenu"][0] {
    _id,
    title,
    items[] {
      _key,
      title,
      url,
      children[] {
        _key,
        title,
        url
      }
    }
  }
`;

export const FOOTER_DATA = groq`
  *[_type == "footerSettings"][0] {
    _id,
    companyInfo,
    links[] { title, url },
    socialLinks[] { platform, url },
    copyrightText
  }
`;
