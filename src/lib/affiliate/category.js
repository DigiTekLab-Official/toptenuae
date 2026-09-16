// Preserve established topic labels; use the CMS section for other guide types.
export const getAffiliateCategory = (slug = '', title = '', reviewSection = '') => {
  const normalizedSlug = String(slug).toLowerCase();
  const value = `${slug} ${title}`.toLowerCase();
  if (value.includes('electric-shaver') || value.includes('electric shaver')) return 'electric_shaver';
  if (value.includes('beard-trimmer') || value.includes('beard trimmer')) return 'beard_trimmer';
  if (value.includes('air-fryer') || value.includes('air fryer')) return 'air_fryer';
  if (value.includes('baby-monitor') || value.includes('baby monitor')) return 'baby_monitor';
  if (value.includes('coffee-maker') || value.includes('coffee maker')) return 'coffee_maker';
  if (value.includes('tyre-inflator') || value.includes('tyre inflator')) return 'tyre_inflator';
  if (value.includes('earbud')) return 'earbuds';
  // Laptop money pages need page-cluster attribution in GA4 even while the
  // Amazon Associates account continues to use its established partner tag.
  // The general money-page title can mention gaming as a buyer role, so its
  // canonical slug must win before topic words in the title are considered.
  if (normalizedSlug === 'best-laptops-uae') return 'laptops-general';
  if (value.includes('gaming') && value.includes('laptop')) return 'laptops-gaming';
  if (value.includes('student') && value.includes('laptop')) return 'laptops-student';
  if ((value.includes('business') || value.includes('office')) && value.includes('laptop')) return 'laptops-business';
  if (value.includes('ai') && value.includes('laptop')) return 'laptops-ai';
  if (value.includes('laptop')) return 'laptops-general';
  if (value.includes('headphone')) return 'headphones';
  return typeof reviewSection === 'string' && reviewSection.trim() ? reviewSection.trim() : undefined;
};
