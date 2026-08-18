const clean = (value, limit = 120) =>
  String(value || '').trim().replace(/\s+/g, ' ').slice(0, limit);

export const parseAmazonAffiliateDestination = (value, baseUrl = 'https://toptenuae.com/') => {
  let destination;
  try {
    destination = new URL(value, baseUrl);
  } catch {
    return null;
  }

  const hostname = destination.hostname.toLowerCase();
  const isAmazonUae = hostname === 'amazon.ae' || hostname.endsWith('.amazon.ae');
  const isAmazonShortLink = hostname === 'amzn.to' || hostname.endsWith('.amzn.to');
  return isAmazonUae || isAmazonShortLink ? destination : null;
};

export const createAffiliateClickPayload = ({
  pagePath,
  destination,
  product,
  cta,
  category,
  position,
  trackingId,
}) => ({
  event: 'affiliate_click',
  affiliate_network: 'amazon_ae',
  page_path: clean(pagePath),
  affiliate_product: clean(product),
  affiliate_cta: clean(cta || 'affiliate_link', 60),
  affiliate_destination: destination.href,
  affiliate_category: clean(category, 60),
  affiliate_position: clean(position, 30),
  affiliate_tracking_id: clean(trackingId || destination.searchParams.get('tag'), 60),
});

export const installAffiliateClickTracking = (browserWindow) => {
  const listenerFlag = '__topTenAffiliateClickListenerBound';
  if (browserWindow[listenerFlag]) return;
  browserWindow[listenerFlag] = true;

  browserWindow.document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof browserWindow.Element)) return;

    const link = target.closest('a[href]');
    if (!(link instanceof browserWindow.HTMLAnchorElement)) return;

    const destination = parseAmazonAffiliateDestination(link.href, browserWindow.location.href);
    if (!destination) return;

    const productContainer = link.closest('article, tr, [data-affiliate-product]');
    const categoryContainer = link.closest('[data-affiliate-category]');
    const productHeading = productContainer?.querySelector('h2, h3, h4');
    const explicitProduct = link.dataset.affiliateProduct || productContainer?.dataset.affiliateProduct;
    const contextualProduct = productHeading?.textContent || link.getAttribute('aria-label');

    browserWindow.dataLayer = browserWindow.dataLayer || [];
    browserWindow.dataLayer.push(createAffiliateClickPayload({
      pagePath: browserWindow.location.pathname,
      destination,
      product: explicitProduct || contextualProduct || link.textContent,
      cta: link.dataset.affiliateCta,
      category: link.dataset.affiliateCategory || categoryContainer?.dataset.affiliateCategory,
      position: link.dataset.affiliatePosition,
      trackingId: link.dataset.affiliateTrackingId,
    }));
  }, { capture: true });
};
