export type AmazonAffiliateProduct = {
  url: string;
  title?: string;
  rank?: number;
};

export const getAmazonUaeAsin = (value?: string) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    if (hostname !== 'amazon.ae' && !hostname.endsWith('.amazon.ae')) return null;
    const match = url.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d|gp\/aw\/product|gp\/offer-listing|exec\/obidos\/ASIN)\/([a-z0-9]{10})(?:[/?]|$)/i);
    return match?.[1].toUpperCase() || null;
  } catch {
    return null;
  }
};

export const createAmazonAffiliateLookup = (products: AmazonAffiliateProduct[]) => {
  const lookup = new Map<string, AmazonAffiliateProduct>();
  products.forEach((product) => {
    const asin = getAmazonUaeAsin(product.url);
    if (asin && !lookup.has(asin)) lookup.set(asin, product);
  });
  return lookup;
};
