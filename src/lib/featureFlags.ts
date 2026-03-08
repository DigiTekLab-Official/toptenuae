/**
 * Feature Flags Configuration
 * Use environment variables to control feature availability
 */

export const features = {
  // ========================================
  // PRODUCT FEATURES
  // ========================================

  /** Enable new product card design */
  newProductCardDesign: import.meta.env.FEATURE_NEW_CARD === 'true',

  /** Enable product comparison feature */
  productComparison: import.meta.env.FEATURE_PRODUCT_COMPARISON === 'true',

  /** Enable Amazon sync feature */
  amazonSync: import.meta.env.FEATURE_AMAZON_SYNC === 'true',

  // ========================================
  // UI/UX FEATURES
  // ========================================

  /** Enable newsletter popup on page load */
  newsletterPopup: import.meta.env.FEATURE_NEWSLETTER_POPUP === 'true',

  /** Enable breadcrumb navigation */
  breadcrumbs: import.meta.env.FEATURE_BREADCRUMBS !== 'false', // Enabled by default

  /** Enable user testimonials section */
  testimonials: import.meta.env.FEATURE_TESTIMONIALS === 'true',

  // ========================================
  // PERFORMANCE FEATURES
  // ========================================

  /** Enable image optimization with WebP */
  imageOptimization: import.meta.env.FEATURE_IMAGE_OPT !== 'false', // Enabled by default

  /** Enable lazy loading for images */
  lazyLoading: import.meta.env.FEATURE_LAZY_LOADING !== 'false', // Enabled by default

  // ========================================
  // ANALYTICS & TRACKING
  // ========================================

  /** Enable Google Tag Manager */
  googleTagManager: import.meta.env.FEATURE_GTM === 'true',

  /** Enable Microsoft Clarity */
  clarity: import.meta.env.FEATURE_CLARITY === 'true',

  /** Enable custom event tracking */
  eventTracking: import.meta.env.FEATURE_EVENT_TRACKING === 'true',

  // ========================================
  // ADVANCED FEATURES
  // ========================================

  /** Enable advanced search filters */
  advancedSearch: import.meta.env.FEATURE_ADVANCED_SEARCH === 'true',

  /** Enable user saved lists/wishlist */
  wishlist: import.meta.env.FEATURE_WISHLIST === 'true',

  /** Enable user reviews/ratings */
  userReviews: import.meta.env.FEATURE_USER_REVIEWS === 'true',

  // ========================================
  // EXPERIMENTAL FEATURES
  // ========================================

  /** Enable React Query caching */
  reactQueryCache: import.meta.env.FEATURE_REACT_QUERY === 'true',

  /** Enable new layout system */
  newLayout: import.meta.env.FEATURE_NEW_LAYOUT === 'true',
} as const;

/**
 * Type-safe feature flag check
 */
export function isFeatureEnabled(feature: keyof typeof features): boolean {
  return features[feature];
}

/**
 * Get all enabled features (useful for debugging)
 */
export function getEnabledFeatures(): (keyof typeof features)[] {
  return Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key as keyof typeof features);
}

/**
 * Log enabled features in development
 */
if (import.meta.env.MODE === 'development') {
  console.log('✅ Enabled Features:', getEnabledFeatures());
}
