/**
 * Feature Flags Configuration
 * Use environment variables to control feature availability
 */

export const features = {
  // ========================================
  // PRODUCT FEATURES
  // ========================================

  /** Enable new product card design */
  newProductCardDesign: process.env.FEATURE_NEW_CARD === 'true',

  /** Enable product comparison feature */
  productComparison: process.env.FEATURE_PRODUCT_COMPARISON === 'true',

  /** Enable Amazon sync feature */
  amazonSync: process.env.FEATURE_AMAZON_SYNC === 'true',

  // ========================================
  // UI/UX FEATURES
  // ========================================

  /** Enable newsletter popup on page load */
  newsletterPopup: process.env.FEATURE_NEWSLETTER_POPUP === 'true',

  /** Enable breadcrumb navigation */
  breadcrumbs: process.env.FEATURE_BREADCRUMBS !== 'false', // Enabled by default

  /** Enable user testimonials section */
  testimonials: process.env.FEATURE_TESTIMONIALS === 'true',

  // ========================================
  // PERFORMANCE FEATURES
  // ========================================

  /** Enable image optimization with WebP */
  imageOptimization: process.env.FEATURE_IMAGE_OPT !== 'false', // Enabled by default

  /** Enable lazy loading for images */
  lazyLoading: process.env.FEATURE_LAZY_LOADING !== 'false', // Enabled by default

  // ========================================
  // ANALYTICS & TRACKING
  // ========================================

  /** Enable Google Tag Manager */
  googleTagManager: process.env.FEATURE_GTM === 'true',

  /** Enable Microsoft Clarity */
  clarity: process.env.FEATURE_CLARITY === 'true',

  /** Enable custom event tracking */
  eventTracking: process.env.FEATURE_EVENT_TRACKING === 'true',

  // ========================================
  // ADVANCED FEATURES
  // ========================================

  /** Enable advanced search filters */
  advancedSearch: process.env.FEATURE_ADVANCED_SEARCH === 'true',

  /** Enable user saved lists/wishlist */
  wishlist: process.env.FEATURE_WISHLIST === 'true',

  /** Enable user reviews/ratings */
  userReviews: process.env.FEATURE_USER_REVIEWS === 'true',

  // ========================================
  // EXPERIMENTAL FEATURES
  // ========================================

  /** Enable React Query caching */
  reactQueryCache: process.env.FEATURE_REACT_QUERY === 'true',

  /** Enable new layout system */
  newLayout: process.env.FEATURE_NEW_LAYOUT === 'true',
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
if (process.env.NODE_ENV === 'development') {
  console.log('✅ Enabled Features:', getEnabledFeatures());
}
