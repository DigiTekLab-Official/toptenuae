export const DEFAULT_AMAZON_AE_TRACKING_ID = 'apfunbox06-21';

export const LAPTOP_AFFILIATE_CATEGORIES = Object.freeze([
  'laptops-general',
  'laptops-gaming',
  'laptops-student',
  'laptops-business',
  'laptops-ai',
]);

const TRACKING_ID_ENV_KEYS = Object.freeze({
  'laptops-general': 'AMAZON_TRACKING_ID_LAPTOPS_GENERAL',
  'laptops-gaming': 'AMAZON_TRACKING_ID_LAPTOPS_GAMING',
  'laptops-student': 'AMAZON_TRACKING_ID_LAPTOPS_STUDENT',
  'laptops-business': 'AMAZON_TRACKING_ID_LAPTOPS_BUSINESS',
  'laptops-ai': 'AMAZON_TRACKING_ID_LAPTOPS_AI',
});

const TRACKING_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,57}-21$/i;
const ASIN_PATTERN = /^[A-Z0-9]{10}$/;

export const isApprovedAmazonAeTrackingId = value =>
  typeof value === 'string' && TRACKING_ID_PATTERN.test(value.trim());

const approvedOrUndefined = value => {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return isApprovedAmazonAeTrackingId(normalized) ? normalized : undefined;
};

export const getAmazonTrackingIdMapping = (environment = {}) => {
  const fallbackTrackingId = approvedOrUndefined(environment.AMAZON_PARTNER_TAG)
    || DEFAULT_AMAZON_AE_TRACKING_ID;

  return Object.fromEntries(LAPTOP_AFFILIATE_CATEGORIES.map(category => {
    const environmentKey = TRACKING_ID_ENV_KEYS[category];
    const configuredTrackingId = approvedOrUndefined(environment[environmentKey]);
    return [category, {
      amazonTrackingId: configuredTrackingId || fallbackTrackingId,
      configured: Boolean(configuredTrackingId),
      source: configuredTrackingId ? environmentKey : 'AMAZON_PARTNER_TAG_FALLBACK',
    }];
  }));
};

export const resolveAmazonTrackingId = (category, environment = {}) =>
  getAmazonTrackingIdMapping(environment)[category]?.amazonTrackingId;

const parseDirectAmazonAeProduct = value => {
  let destination;
  try {
    destination = new URL(value);
  } catch {
    return null;
  }

  const hostname = destination.hostname.toLowerCase();
  if (hostname !== 'amazon.ae' && !hostname.endsWith('.amazon.ae')) return null;

  const match = destination.pathname.match(/\/dp\/([A-Z0-9]{10})(?:[/?]|$)/i);
  if (!match) return null;

  return { destination, asin: match[1].toUpperCase() };
};

export const createClusterAmazonDestination = ({
  affiliateLink,
  asin,
  category,
  environment = {},
}) => {
  if (!LAPTOP_AFFILIATE_CATEGORIES.includes(category)) return null;

  const parsed = parseDirectAmazonAeProduct(affiliateLink);
  if (!parsed) return null;

  const expectedAsin = typeof asin === 'string' ? asin.trim().toUpperCase() : parsed.asin;
  if (!ASIN_PATTERN.test(expectedAsin) || parsed.asin !== expectedAsin) return null;

  const trackingId = resolveAmazonTrackingId(category, environment);
  if (!trackingId) return null;

  parsed.destination.protocol = 'https:';
  parsed.destination.hostname = 'www.amazon.ae';
  parsed.destination.pathname = `/dp/${expectedAsin}`;
  parsed.destination.searchParams.delete('tag');
  parsed.destination.searchParams.set('tag', trackingId);

  return {
    href: parsed.destination.href,
    asin: expectedAsin,
    category,
    trackingId,
    configured: getAmazonTrackingIdMapping(environment)[category].configured,
  };
};

export const applyLaptopTrackingToListItems = (items = [], category, environment = {}) => {
  if (!LAPTOP_AFFILIATE_CATEGORIES.includes(category)) return items;

  return items.map(item => {
    const product = item?.product;
    if (!product) return item;

    if (product.availabilityStatus === 'unavailable') {
      return {...item, product: {...product, affiliateLink: undefined}};
    }

    if (!product.affiliateLink) return item;
    const destination = createClusterAmazonDestination({
      affiliateLink: product.affiliateLink,
      asin: product.asin,
      category,
      environment,
    });

    return {
      ...item,
      product: {
        ...product,
        affiliateLink: destination?.href,
      },
    };
  });
};
