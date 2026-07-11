// src/sanity/lib/queries.ts
// ⚠️  TRANSITIONAL SHIM - Phase 1 Backward Compatibility Layer
//
// This file is a temporary re-export layer to support the query refactor.
// It will be DELETED in Phase 2 after all imports are updated.
//
// PHASE 2 MIGRATION:
// Replace all imports from this file with direct imports from query files:
//
//   FROM: import { PRODUCT_BY_SLUG } from "@/sanity/lib/queries";
//   TO:   import { PRODUCT_BY_SLUG } from "@/sanity/queries";
//   OR:   import { PRODUCT_BY_SLUG } from "@/sanity/queries/product.queries";
//
// Then delete this file entirely.
// =============================================================================

export {
  ALL_CATEGORIES,
  CATEGORY_BY_SLUG,
  CATEGORY_POSTS,
  CATEGORY_PRODUCTS,
  CATEGORY_PAGE_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_ARCHIVE_QUERY,
  CATEGORY_PRODUCTS_QUERY,
} from '@/sanity/queries/category.queries';

export {
  PRODUCT_BY_SLUG,
  PRODUCT_BY_SLUG_QUERY,
  RELATED_FOR_PRODUCT,
  ALL_PRODUCTS,
  PRODUCTS_BY_CATEGORY,
  PRODUCT_SEARCH,
} from '@/sanity/queries/product.queries';

export {
  TOP_TEN_BY_SLUG,
  TOP_TEN_LIST_QUERY,
  ALL_TOP_TEN_LISTS,
  TOP_TEN_LISTS_BY_CATEGORY,
} from '@/sanity/queries/topten.queries';

export {
  ALL_ACTIVE_DEALS,
  ALL_DEALS_QUERY,
  FEATURED_DEALS,
  DEALS_BY_CATEGORY,
} from '@/sanity/queries/deal.queries';

export {
  SITE_SETTINGS_QUERY,
  NAVIGATION_MENU,
  FOOTER_DATA,
} from '@/sanity/queries/settings.queries';

export {
  HOME_QUERY,
} from '@/sanity/queries/home.queries';

export {
  GENERIC_POST_QUERY,
} from '@/sanity/queries/post.queries';

export {
  REVIEWS_HUB_QUERY,
} from '@/sanity/queries/review.queries';