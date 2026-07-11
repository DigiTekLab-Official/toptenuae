// src/types/site/settings.ts
export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteSettings {
  title?: string;
  description?: string;
  logoMain?: string;
  logoIcon?: string;
  logoBimi?: string;
  ogImage?: string;
  socialLinks?: SocialLink[];
  contactEmail?: string;
  _id?: string;
  _type?: 'siteSettings';
  _updatedAt?: string;
  _createdAt?: string;
}