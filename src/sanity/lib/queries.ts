// src/sanity/lib/queries.ts
// Re-export from centralized queries folder for backward compatibility
export {
  ALL_CATEGORIES,
  CATEGORY_BY_SLUG,
  CATEGORY_POSTS,
  CATEGORY_PRODUCTS,
} from '@/sanity/queries/category.queries';

export {
  PRODUCT_BY_SLUG,
  PRODUCT_BY_SLUG_QUERY,
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
} from '@/sanity/queries/global.queries';

export {
  HOME_QUERY,
  CATEGORY_PAGE_QUERY,
  GENERIC_POST_QUERY,
  REVIEWS_HUB_QUERY,
} from '@/sanity/queries/legacy.queries';