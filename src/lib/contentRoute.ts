import { buildContentPath as resolveContentPath } from './contentRoute.js';

export type SupportedContentType =
  | 'topTenList'
  | 'article'
  | 'post'
  | 'product'
  | 'buyerGuide'
  | 'howTo'
  | 'tool'
  | 'holiday'
  | 'event'
  | 'category';

export interface ContentRouteInput {
  _type?: SupportedContentType | null;
  slug?: string | null;
  categorySlug?: string | null;
}

// Preserve the typed public API; the implementation also runs directly in Node.
export const buildContentPath: (input: ContentRouteInput) => string | null = resolveContentPath;
