/**
 * Exact, audited legacy URL migrations from the 2026-09-13 GSC remediation.
 *
 * Keep this list explicit. Content-type wildcards can redirect unrelated or
 * newly published content and must not be added here.
 */
export const LEGACY_REDIRECTS: Readonly<Record<string, string>> = Object.freeze({
  '/best-baby-monitor': '/top-ten/best-baby-monitors-uae',
  '/best-baby-skincare-uae': '/top-ten/best-baby-skincare-uae',
  '/best-beard-trimmers-uae': '/top-ten/best-beard-trimmers-uae',
  '/best-educational-toys-in-uae': '/top-ten/best-educational-toys-uae',
  '/best-educational-toys-uae': '/top-ten/best-educational-toys-uae',
  '/best-electric-shaver-uae': '/top-ten/best-electric-shaver-uae',
  '/best-wireless-earbuds-uae': '/top-ten/best-wireless-earbuds-uae',
  '/charity-organizations-uae-donations': '/how-to-guides/charity-organizations-uae-donations',
  '/deals/kenwood-grill-xl-45l-hfp40-airfryer': '/reviews/kenwood-air-fryer-grill-xl',
  '/deals/latest': '/deals',
  '/deals/nutricook-extra-large-slim-xl-7l-air-fryer': '/reviews/nutricook-air-fryer-slim-xl',
  '/deals/samsung-galaxy-s25-ultra-deal-jan-2026': '/reviews/samsung-galaxy-s25-ultra-5g-uae-smartphone',
  '/deals/sony-wh-1000xm6-wireless-headphone': '/reviews/sony-wh-1000xm6-wireless-headphone',
  '/deepseek-ai-revolutionary-data-retrieval-method': '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis',
  '/deepseek-ai-revolutionary-data-retrieval-method/amp': '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis',
  '/deepseek-ai-startup-disrupting-big-tech-with-innovation': '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis',
  '/deepseek-ai-startup-disrupting-big-tech-with-innovation/amp': '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis',
  '/eid-al-fitr-uae-prayer-timings-free-events': '/events-holidays/eid-al-fitr-uae-prayer-timings-free-events',
  '/events-holidays/ramadan-2026': '/events-holidays/ramadan-2026-uae',
  '/how-to-clean-washing-machine': '/how-to-guides/how-to-clean-washing-machine',
  '/laptops/best-laptop-under-1500-aed-uae': '/top-ten/best-laptop-under-1500-aed-uae',
  '/lifestyle/charity-organizations-uae-donations': '/how-to-guides/charity-organizations-uae-donations',
  '/lifestyle/how-to-pay-zakat-in-uae-online': '/how-to-guides/how-to-pay-zakat-in-uae-online',
  '/nutricook-air-fryer-slim-xl-review': '/reviews/nutricook-air-fryer-slim-xl',
  '/parenting-kids/best-baby-monitors-uae': '/top-ten/best-baby-monitors-uae',
  '/parenting-kids/best-baby-skincare-uae': '/top-ten/best-baby-skincare-uae',
  '/parenting-kids/top-10-schools-dubai-2026-khda-fees-reviews': '/top-ten/top-10-schools-dubai-2026-khda-fees-reviews',
  '/parenting-kids/where-to-donate-used-toys-uae': '/how-to-guides/where-to-donate-used-toys-uae',
  '/reviews/apple-airpods-max-usb-c': '/reviews/apple-airpods-max-usb-c-wireless-headphone',
  '/reviews/apple-airpods-pro-3-review': '/reviews/apple-airpods-pro-3',
  '/reviews/best-air-fryers-uae-2026': '/top-ten/best-air-fryers-uae-2026',
  '/reviews/best-baby-skincare-uae': '/top-ten/best-baby-skincare-uae',
  '/reviews/best-beard-trimmers-uae': '/top-ten/best-beard-trimmers-uae',
  '/reviews/best-laptop-under-1500-aed-uae': '/top-ten/best-laptop-under-1500-aed-uae',
  '/reviews/best-wireless-earbuds-uae': '/top-ten/best-wireless-earbuds-uae',
  '/reviews/charity-organizations-uae-donations': '/how-to-guides/charity-organizations-uae-donations',
  '/reviews/eid-al-fitr-uae-prayer-timings-free-events': '/events-holidays/eid-al-fitr-uae-prayer-timings-free-events',
  '/reviews/eid-holidays-uae-2026-best-places-to-visit': '/events-holidays/eid-holidays-uae-2026-best-places-to-visit',
  '/reviews/gmail-gemini-ai-features-2026': '/how-to-guides/gmail-gemini-ai-features-2026',
  '/reviews/gratuity-calculator-uae': '/finance-tools/gratuity-calculator-uae',
  '/reviews/how-to-clean-washing-machine': '/how-to-guides/how-to-clean-washing-machine',
  '/reviews/how-to-connect-laptop-projector-tv': '/how-to-guides/how-to-connect-laptop-projector-tv',
  '/reviews/how-to-connect-second-monitor-laptop': '/how-to-guides/how-to-connect-second-monitor-laptop',
  '/reviews/how-to-pay-zakat-in-uae-online': '/how-to-guides/how-to-pay-zakat-in-uae-online',
  '/reviews/how-to-screen-record-laptop': '/how-to-guides/how-to-screen-record-laptop',
  '/reviews/how-to-take-screenshot-laptop-pc': '/how-to-guides/how-to-take-screenshot-laptop-pc',
  '/reviews/how-to-use-deepseek-ai-data-extraction-analysis': '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis',
  '/reviews/jbl-tune-770nc': '/reviews/jbl-tune-770nc-wireless-headphone',
  '/reviews/new-year-tech-upgrades-uae-2026': '/top-ten/new-year-tech-upgrades-uae-2026',
  '/reviews/olov-for-man-grooming-kit-review': '/reviews/olov-for-man-grooming-kit-trimmer',
  '/reviews/quantum-computing-guide-uae': '/how-to-guides/quantum-computing-guide-uae',
  '/reviews/quantum-computing-strategy-uae-2026': '/how-to-guides/quantum-computing-strategy-uae-2026',
  '/reviews/ramadan-2026-uae': '/events-holidays/ramadan-2026-uae',
  '/reviews/samsung-galaxy-s26-ultra-specs-uae-price': '/how-to-guides/samsung-galaxy-s26-ultra-specs-uae-price',
  '/reviews/sony-wh-1000xm6-headphones-review': '/reviews/sony-wh-1000xm6-wireless-headphone',
  '/reviews/state-of-ai-december-2025-uae-report': '/how-to-guides/state-of-ai-december-2025-uae-report',
  '/reviews/uae-holidays-2026': '/events-holidays/uae-holidays-2026',
  '/reviews/uae-vat-calculator': '/finance-tools/uae-vat-calculator',
  '/reviews/where-to-donate-used-toys-uae': '/how-to-guides/where-to-donate-used-toys-uae',
  '/reviews/zakat-calculator': '/finance-tools/zakat-calculator',
  '/smart-home/how-to-clean-washing-machine': '/how-to-guides/how-to-clean-washing-machine',
  '/smartphones/samsung-galaxy-s26-ultra-specs-uae-price': '/how-to-guides/samsung-galaxy-s26-ultra-specs-uae-price',
  '/tech/asus-vivobook-go-15-e1504fa': '/reviews/asus-vivobook-go-15-e1504fa',
  '/tech/best-noise-cancelling-headphones-uae': '/top-ten/best-noise-cancelling-headphones-uae',
  '/tech/deepseek-ai-revolutionary-data-retrieval-method': '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis',
  '/tech/deepseek-ai-startup-disrupting-big-tech-with-innovation': '/how-to-guides/how-to-use-deepseek-ai-data-extraction-analysis',
  '/tech/hp-14-n150-16gb-student': '/reviews/hp-14-n150-16gb-student',
  '/tech/hp-stream-14-n150': '/reviews/hp-stream-14-n150',
  '/tech/lenovo-slim-3-chromebook-14': '/reviews/lenovo-slim-3-chromebook-14',
  '/tech/quantum-computing-strategy-uae-2026': '/how-to-guides/quantum-computing-strategy-uae-2026',
  '/tech/samsung-galaxy-s26-ultra-specs-uae-price': '/how-to-guides/samsung-galaxy-s26-ultra-specs-uae-price',
  '/tech/state-of-ai-december-2025-uae-report': '/how-to-guides/state-of-ai-december-2025-uae-report',
  '/top-ten/apple-macbook-air-m2-2022': '/reviews/apple-macbook-air-m2-2022',
  '/top-ten/best-air-fryers-uae': '/top-ten/best-air-fryers-uae-2026',
  '/top-ten/braun-pocketgo-m90-mobile-shaver': '/reviews/braun-pocketgo-m90-mobile-shaver',
  '/top-ten/braun-series-5-51-b1000s-shaver': '/reviews/braun-series-5-51-b1000s-shaver',
  '/top-ten/braun-series-9-pro-plus-shaver': '/reviews/braun-series-9-pro-plus-shaver',
  '/top-ten/kemei-2299-professional-trimmer': '/reviews/kemei-2299-professional-trimmer',
  '/top-ten/kenwood-air-fryer-grill-xl': '/reviews/kenwood-air-fryer-grill-xl',
  '/top-ten/microsoft-surface-laptop': '/reviews/microsoft-surface-laptop',
  '/top-ten/nutricook-air-fryer-slim-xl': '/reviews/nutricook-air-fryer-slim-xl',
  '/top-ten/panasonic-es-sa40-pro-curve-shaver': '/reviews/panasonic-es-sa40-pro-curve-shaver',
  '/top-ten/philips-norelco-9000-prestige': '/reviews/philips-norelco-9000-prestige',
  '/top-ten/philips-shaver-series-1000-s1151': '/reviews/philips-shaver-series-1000-s1151',
  '/top-ten/pritech-3-in-1-grooming-set-shaver': '/reviews/pritech-3-in-1-grooming-set-shaver',
  '/top-ten/quantum-computing-guide-uae': '/how-to-guides/quantum-computing-guide-uae',
  '/top-ten/quantum-computing-strategy-uae-2026': '/how-to-guides/quantum-computing-strategy-uae-2026',
  '/top-ten/remington-f5-5800-foil-shaver': '/reviews/remington-f5-5800-foil-shaver',
  '/top-ten/skull-shaver-pitbull-gold-pro': '/reviews/skull-shaver-pitbull-gold-pro',
  '/top-ten/soundcore-p30i-noise-cancelling-earbuds': '/reviews/soundcore-p30i-noise-cancelling-earbuds',
  '/top-ten/ugreen-clipbuds-open-earbuds': '/reviews/ugreen-clipbuds-open-earbuds',
  '/top-ten/wahl-travel-shaver-3615-1027': '/reviews/wahl-travel-shaver-3615-1027',
  '/top-ten/xiaomi-redmi-buds-6-play-earbuds': '/reviews/xiaomi-redmi-buds-6-play-earbuds',
  '/travel-tourism/world-safest-airlines-2026': '/top-ten/world-safest-airlines-2026',
  '/upcoming/samsung-galaxy-s26-ultra-specs-uae-price': '/how-to-guides/samsung-galaxy-s26-ultra-specs-uae-price',
  '/where-to-donate-used-toys-uae': '/how-to-guides/where-to-donate-used-toys-uae',
  '/zakat-calculator': '/finance-tools/zakat-calculator',
});

/** Explicitly removed pages for which the audit found no equivalent successor. */
export const KNOWN_GONE_PATHS: ReadonlySet<string> = new Set([
  '/best-baby-toys',
  '/best-beauty-personal-care-products-uae',
  '/best-beauty-products-uae',
  '/best-books-for-babys-first-library',
  '/best-budget-buys-uae-amazon-deals-march-2025/amp',
  '/best-diaper-bags-in-uae',
  '/best-diaper-bags-uae',
  '/best-eid-holiday-travel-destinations-uae',
  '/free-eid-events-festive-activities-uae',
  '/nasa-astronaut-don-pettit-burj-khalifa-image-from-space',
  '/ninja-air-fryer-max-xl-af160me-review',
  '/uae-holidays-2025',
]);

export const getLegacyRedirect = (pathname: string): string | null =>
  LEGACY_REDIRECTS[pathname] || null;

export const isKnownGonePath = (pathname: string): boolean =>
  KNOWN_GONE_PATHS.has(pathname) ||
  pathname.startsWith('/category/') ||
  pathname.startsWith('/author/') ||
  pathname.startsWith('/tag/') ||
  pathname === '/feed' ||
  pathname.startsWith('/feed/') ||
  pathname === '/rss' ||
  pathname.startsWith('/rss/');

const AUDITED_INTERNAL_LINK_PATHS: Readonly<Record<string, string>> = {
  '/finance-tools/zakat-calculator/': '/finance-tools/zakat-calculator',
  '/how-to-guides/how-to-pay-zakat-in-uae-online/': '/how-to-guides/how-to-pay-zakat-in-uae-online',
};

/** Clean the three audited Sanity-authored links without rewriting other URLs. */
export const canonicalizeAuditedInternalLink = (href: string): string => {
  try {
    const isRelative = href.startsWith('/');
    const parsed = new URL(href, 'https://toptenuae.com');
    if (!isRelative && !['toptenuae.com', 'www.toptenuae.com'].includes(parsed.hostname)) {
      return href;
    }

    const canonicalPath = AUDITED_INTERNAL_LINK_PATHS[parsed.pathname];
    if (!canonicalPath) return href;

    parsed.pathname = canonicalPath;
    return isRelative
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : parsed.toString();
  } catch {
    return href;
  }
};
