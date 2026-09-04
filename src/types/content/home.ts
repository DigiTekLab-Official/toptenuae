// src/types/content/home.ts

import type { SupportedContentType } from '@/lib/contentRoute';

export interface HomeHeroPost {
  _id: string;
  _type: SupportedContentType;
  title: string;
  slug: string;
  intro?: string;
  mainImage?: {
    url: string;
    alt?: string;
  };
  categorySlug?: string;
}

export interface HomeSectionPost {
  _id: string;
  _type: SupportedContentType;
  title: string;
  slug: string;
  publishedAt?: string;
  mainImage?: {
    url: string;
    alt?: string;
  };
}

export interface HomeSection {
  title: string;
  slug: string;
  description?: string;
  posts: HomeSectionPost[];
}

export interface HomeUpcomingPost {
  _id: string;
  _type: SupportedContentType;
  title: string;
  slug: string;
  categorySlug?: string;
  mainImage?: {
    url: string;
    alt?: string;
  };
}

export interface HomeBuyerGuide {
  _id: string;
  _type: 'buyerGuide';
  title: string;
  slug: string;
  categorySlug: string;
  categoryTitle?: string;
  summary?: unknown;
  mainImage?: {
    url: string;
    alt?: string;
  };
}

export interface HomeCommercialGuide {
  _id: string;
  _type: 'topTenList';
  title: string;
  slug: string;
  reviewSection: string;
  publishedAt?: string;
}

export interface HomePageData {
  heroPost: HomeHeroPost | null;
  sections: HomeSection[];
  upcomingPosts: HomeUpcomingPost[];
  buyerGuides: HomeBuyerGuide[];
  commercialGuides: HomeCommercialGuide[];
  /** true if the Sanity fetch itself failed (distinct from "fetched fine, just empty") */
  error: boolean;
}
