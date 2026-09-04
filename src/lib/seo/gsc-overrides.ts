/**
 * Evidence-led search snippets for pages with substantial GSC impressions and
 * weak click-through rates. Keep this list deliberately small: Sanity remains
 * the default source of truth, while these overrides let us react quickly to
 * proven search demand without rewriting editorial page headings.
 */
const GSC_SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  'where-to-donate-used-toys-uae': {
    title: 'Where to Donate Toys in UAE: Drop-Off & Pickup Guide',
    description: 'Check UAE toy donation options, including organisations offering drop-off or pickup routes, accepted condition, and what to confirm before travelling.',
  },
  'charity-organizations-uae-donations': {
    title: 'UAE Charity Organisations: Licensed Giving Guide',
    description: 'Compare established UAE charity organisations, official donation channels, and the legal rules to check before giving or fundraising online.',
  },
  'best-electric-shaver-uae': {
    title: 'Best Electric Shavers UAE: 10 Picks for Men',
    description: 'Compare 10 electric shavers for UAE buyers, including foil, rotary, wet-and-dry and sensitive-skin picks with clear pros, cons and use cases.',
  },
  'best-beard-trimmers-uae': {
    title: 'Best Beard Trimmers UAE: 7 Picks for Men',
    description: 'Compare the best beard trimmers available to UAE shoppers, with picks for stubble, long beards, travel and multi-grooming plus honest trade-offs.',
  },
  'best-wireless-earbuds-uae': {
    title: 'Best Wireless Earbuds UAE: 10 Picks',
    description: 'Compare the best wireless earbuds for UAE buyers, with picks for calls, commuting, workouts, noise cancelling and value at different budgets.',
  },
  'best-laptop-under-1500-aed-uae': {
    title: 'Best Laptops Under AED 1,500 in UAE',
    description: 'Compare reliable laptops under AED 1,500 in the UAE for students, home use and everyday work, with specs, limitations and buying advice.',
  },
  'uae-vat-calculator': {
    title: 'UAE VAT Calculator: Add or Remove 5% VAT',
    description: 'Use this free UAE VAT calculator to add 5% VAT, remove VAT from an inclusive price, and see the net amount and tax instantly.',
  },
  'gratuity-calculator-uae': {
    title: 'UAE Gratuity Calculator: Estimate Your Benefit',
    description: 'Estimate UAE end-of-service gratuity from your basic salary, contract dates and reason for leaving, with a clear calculation breakdown.',
  },
};

export const getGscSeoOverride = (slug?: string | null) =>
  slug ? GSC_SEO_OVERRIDES[slug] : undefined;
