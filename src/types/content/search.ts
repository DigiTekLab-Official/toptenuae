export interface SearchResult {
  _id: string;
  _type: string;
  contentType: string;
  title: string;
  slug: string;
  image?: {url?: string; alt?: string} | string;
  excerpt?: unknown;
  metadata?: Record<string, unknown>;
  publishedAt?: string;
}

export interface SearchSuggestion {
  _type: string;
  title: string;
  slug: string;
}
