// src/types/content/topten.ts
export interface TopTenList {
  title: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  socialShareImage?: string;
  intro?: string;
  body?: any[];
  closingContent?: any[];
  showAffiliateDisclosure?: boolean;
  mainImage?: { url: string; alt?: string };
  faqs?: Array<{ _key: string; question: string; answer: string }>;
  listItems?: any[];
  relatedLists?: any[];
  relatedProducts?: any[];
  keyTakeaways?: string[];
  whoItsFor?: string;
  whoShouldAvoid?: string;
  methodology?: any[];
  uaeContext?: any[];
  sources?: Array<{title: string; publisher?: string; url: string; accessedAt?: string}>;
  lastReviewedAt?: string;
  originalPublishedAt?: string;
  affiliateDisclosure?: string;
  author?: {name: string; role?: string; bio?: string; profileUrl?: string};
  reviewedBy?: {name: string; role?: string; profileUrl?: string};
  seo?: {metaTitle?: string; metaDescription?: string; canonicalUrl?: string; noIndex?: boolean};
  _type?: 'topTenList';
  _id?: string;
  _updatedAt?: string;
  _createdAt?: string;
}
