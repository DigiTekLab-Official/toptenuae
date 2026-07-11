// src/types/site/footer.ts
export interface FooterLink {
  _key?: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterColumn {
  _key?: string;
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  _key?: string;
  platform: string;
  url: string;
}

export interface FooterData {
  _id: string;
  columns: FooterColumn[];
  socialLinks?: SocialLink[];
  copyrightText?: string;
  legalLinks?: FooterLink[];
}