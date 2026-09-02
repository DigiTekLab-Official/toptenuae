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

const ROUTE_PREFIX_BY_TYPE: Partial<Record<SupportedContentType, string>> = {
  topTenList: 'top-ten',
  product: 'reviews',
  howTo: 'how-to-guides',
  tool: 'finance-tools',
  holiday: 'events-holidays',
  event: 'events-holidays',
};

const ARTICLE_ROUTE_BY_CATEGORY: Record<string, string> = {
  'how-to-guides': 'how-to-guides',
  guides: 'how-to-guides',
  'travel-tourism': 'travel-tourism',
  travel: 'travel-tourism',
  reviews: 'reviews',
  'buyers-guide': 'reviews',
  // Verified dynamic category route and published category document.
  upcoming: 'upcoming',
};

const normalizeRouteSegment = (value?: string | null): string | null => {
  if (!value) return null;

  const normalized = value.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!normalized || normalized.includes('/') || /\s/.test(normalized)) return null;

  return normalized;
};

/**
 * Resolve a Sanity document to its terminal, site-relative canonical path.
 * Document type owns dedicated routes; editorial category is only used by
 * generic article/post content routed through the category dispatcher.
 */
export const buildContentPath = ({
  _type,
  slug,
  categorySlug,
}: ContentRouteInput): string | null => {
  const normalizedSlug = normalizeRouteSegment(slug);
  if (!normalizedSlug || !_type || _type === 'category') return null;

  const typePrefix = ROUTE_PREFIX_BY_TYPE[_type];
  if (typePrefix) return `/${typePrefix}/${normalizedSlug}`;

  if (_type === 'article' || _type === 'post' || _type === 'buyerGuide') {
    const normalizedCategory = normalizeRouteSegment(categorySlug);
    const articlePrefix = normalizedCategory
      ? ARTICLE_ROUTE_BY_CATEGORY[normalizedCategory]
      : null;

    return `/${articlePrefix || 'reviews'}/${normalizedSlug}`;
  }

  return null;
};
