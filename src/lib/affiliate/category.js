// Preserve established topic labels; use the CMS section for other guide types.
export const getAffiliateCategory = (slug = '', title = '', reviewSection = '') => {
  const value = `${slug} ${title}`.toLowerCase();
  if (value.includes('electric-shaver') || value.includes('electric shaver')) return 'electric_shaver';
  if (value.includes('beard-trimmer') || value.includes('beard trimmer')) return 'beard_trimmer';
  if (value.includes('air-fryer') || value.includes('air fryer')) return 'air_fryer';
  if (value.includes('baby-monitor') || value.includes('baby monitor')) return 'baby_monitor';
  if (value.includes('coffee-maker') || value.includes('coffee maker')) return 'coffee_maker';
  if (value.includes('tyre-inflator') || value.includes('tyre inflator')) return 'tyre_inflator';
  if (value.includes('earbud')) return 'earbuds';
  if (value.includes('laptop')) return 'laptop';
  if (value.includes('headphone')) return 'headphones';
  return typeof reviewSection === 'string' && reviewSection.trim() ? reviewSection.trim() : undefined;
};
