// src/sanity/lib/fetchers.ts
// ⚠️  DEPRECATED - This file is being phased out
//
// MIGRATION PATH:
// Types have been moved to src/types/content/ and src/types/site/
// Fetch functions have been moved to src/repositories/
//
// OLD → NEW:
// - fetchProductBySlug()    → @/repositories/product.repository
// - fetchTopTenListBySlug() → @/repositories/topten.repository
// - fetchAllDeals()         → @/repositories/deal.repository
// - fetchSiteSettings()     → @/repositories/settings.repository
//
// TYPE IMPORTS:
// - Product    → @/types/content/product
// - TopTenList → @/types/content/topten
// - Deal       → @/types/content/deal
// - SiteSettings → @/types/site/settings
//
// This file will be deleted in the next refactor phase.
// =============================================================================

// Re-exports for backward compatibility during migration
export {
  getProductBySlug as fetchProductBySlug,
} from '@/repositories/product.repository';

export {
  getTopTenBySlug as fetchTopTenListBySlug,
} from '@/repositories/topten.repository';

export {
  getAllDeals as fetchAllDeals,
} from '@/repositories/deal.repository';

export {
  getSiteSettings as fetchSiteSettings,
} from '@/repositories/settings.repository';

// Type re-exports for backward compatibility
export type { Product } from '@/types/content/product';
export type { TopTenList } from '@/types/content/topten';
export type { Deal } from '@/types/content/deal';
export type { SiteSettings } from '@/types/site/settings';
