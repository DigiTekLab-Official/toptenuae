export const AMAZON_TRACKING_IDS = Object.freeze({
  grooming: 'apfunbox-groom-21',
  automotive: 'apfunbox-auto-21',
  home: 'apfunbox-home-21',
  luggage: 'apfunbox-luggage-21',
  tech: 'apfunbox-tech-21',
  default: 'apfunbox06-21',
});

const MANAGED_TRACKING_IDS = new Set(Object.values(AMAZON_TRACKING_IDS));
const PROTECTED_TRACKING_IDS = new Set([
  'onamzapfunbox-21',
  'ameerparveen-21',
]);

const normalizeCategory = (value = '') => String(value)
  .trim()
  .toLowerCase()
  .replace(/[_/]+/g, '-')
  .replace(/\s+/g, '-');

export const getAmazonTrackingId = (category) => {
  const value = normalizeCategory(category);

  if (/(electric-?shaver|beard-?trimmer|groom|personal-?care|hair-?(dryer|straightener|clipper)|epilator)/.test(value)) {
    return AMAZON_TRACKING_IDS.grooming;
  }
  if (/(automotive|tyre-?inflator|tire-?inflator|dash-?cam|car-?vacuum|jump-?starter)/.test(value)) {
    return AMAZON_TRACKING_IDS.automotive;
  }
  if (/^(home|home-kitchen)$/.test(value) || /(air-?fryer|coffee-?maker|home-?appliance|kitchen-?appliance)/.test(value)) {
    return AMAZON_TRACKING_IDS.home;
  }
  if (/(luggage|travel|suitcase|carry-?on)/.test(value)) {
    return AMAZON_TRACKING_IDS.luggage;
  }
  if (/(tech|electronic|laptop|earbud|headphone|baby-?monitor|smartphone|mobile-?phone|tablet|camera|router)/.test(value)) {
    return AMAZON_TRACKING_IDS.tech;
  }
  return AMAZON_TRACKING_IDS.default;
};

const isAmazonUaeHost = (hostname) =>
  hostname === 'amazon.ae' || hostname.endsWith('.amazon.ae');

/**
 * Routes direct Amazon.ae URLs while leaving short links and foreign/unknown
 * affiliate ownership untouched. Existing managed TopTenUAE IDs may be
 * re-routed; protected and third-party IDs are preserved verbatim.
 */
export const routeAmazonAffiliateUrl = (value, category) => {
  if (!value) return value;

  let destination;
  try {
    destination = new URL(value);
  } catch {
    return value;
  }

  if (!['http:', 'https:'].includes(destination.protocol) ||
      !isAmazonUaeHost(destination.hostname.toLowerCase())) return value;

  const currentTags = destination.searchParams.getAll('tag');
  if (currentTags.some((tag) => tag && (
    PROTECTED_TRACKING_IDS.has(tag) || !MANAGED_TRACKING_IDS.has(tag)
  ))) return value;

  const trackingId = getAmazonTrackingId(category);
  if (currentTags.length === 1 && currentTags[0] === trackingId) return value;

  destination.searchParams.set('tag', trackingId);
  return destination.href;
};

const categoryForLink = (link) =>
  link.dataset?.affiliateCategory ||
  link.closest?.('[data-affiliate-category]')?.dataset?.affiliateCategory;

export const routeAmazonAffiliateLink = (link) => {
  const routedUrl = routeAmazonAffiliateUrl(link.href, categoryForLink(link));
  if (routedUrl !== link.href) link.href = routedUrl;

  try {
    const destination = new URL(link.href);
    const trackingId = destination.searchParams.get('tag');
    if (link.dataset) link.dataset.affiliateTrackingId = trackingId || '';
  } catch {
    // Invalid anchors remain unchanged.
  }

  return routedUrl;
};

export const routeAmazonAffiliateLinks = (root) => {
  root?.querySelectorAll?.('a[href]').forEach(routeAmazonAffiliateLink);
};
