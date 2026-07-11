// src/types/content/category.ts
export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  mainImage?: {
    url: string;
    alt?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}