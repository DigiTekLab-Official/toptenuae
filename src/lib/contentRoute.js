// Shared by Astro and the plain Node sitemap builder.
const ROUTE_PREFIX_BY_TYPE = {
  topTenList: 'top-ten',
  product: 'reviews',
  howTo: 'how-to-guides',
  tool: 'finance-tools',
  holiday: 'events-holidays',
  event: 'events-holidays',
};

const TOOL_ROUTE_BY_CATEGORY = {
  'finance-tools': 'finance-tools',
  calculators: 'calculators',
};

const ARTICLE_ROUTE_BY_CATEGORY = {
  'how-to-guides': 'how-to-guides',
  guides: 'how-to-guides',
  'travel-tourism': 'travel-tourism',
  travel: 'travel-tourism',
  reviews: 'reviews',
  'buyers-guide': 'reviews',
  // Verified dynamic category route and published category document.
  upcoming: 'upcoming',
};

// Exact content migrations take precedence over the legacy document type.
// This keeps deploys safe while Sanity and the frontend roll out separately.
const CONTENT_PATH_BY_SLUG = Object.freeze({
  'samsung-galaxy-s26-ultra-specs-uae-price':
    '/smartphones/samsung-galaxy-s26-ultra-specs-uae-price',
});

const normalizeRouteSegment = (value) => {
  if (!value) return null;

  const normalized = value.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!normalized || normalized.includes('/') || /\s/.test(normalized)) return null;

  return normalized;
};

/**
 * Resolve a Sanity document to its terminal, site-relative canonical path.
 * Dedicated types own their routes. Tools may select a registered hub through
 * their primary category, while uncategorized/legacy tools retain finance-tools.
 * @param {import('./contentRoute').ContentRouteInput} input
 * @returns {string | null}
 */
export const buildContentPath = ({
  _type,
  slug,
  categorySlug,
}) => {
  const normalizedSlug = normalizeRouteSegment(slug);
  if (!normalizedSlug || !_type || _type === 'category') return null;

  const migratedPath = CONTENT_PATH_BY_SLUG[normalizedSlug];
  if (migratedPath) return migratedPath;

  if (_type === 'tool') {
    const normalizedCategory = normalizeRouteSegment(categorySlug);
    const prefix = Object.hasOwn(TOOL_ROUTE_BY_CATEGORY, normalizedCategory || '')
      ? TOOL_ROUTE_BY_CATEGORY[normalizedCategory]
      : ROUTE_PREFIX_BY_TYPE.tool;
    return `/${prefix}/${normalizedSlug}`;
  }

  const typePrefix = ROUTE_PREFIX_BY_TYPE[_type];
  if (typePrefix) return `/${typePrefix}/${normalizedSlug}`;

  if (_type === 'buyerGuide') {
    const normalizedCategory = normalizeRouteSegment(categorySlug);
    return `/${normalizedCategory || 'reviews'}/${normalizedSlug}`;
  }

  if (_type === 'article' || _type === 'post') {
    const normalizedCategory = normalizeRouteSegment(categorySlug);
    const articlePrefix = normalizedCategory
      ? ARTICLE_ROUTE_BY_CATEGORY[normalizedCategory]
      : null;

    return `/${articlePrefix || 'reviews'}/${normalizedSlug}`;
  }

  return null;
};
