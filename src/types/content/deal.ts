// src/types/content/deal.ts
export interface Deal {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  affiliateLink?: string;
  originalPrice?: number;
  dealPrice?: number;
  discountPercentage?: number;
  category?: string;
  dealEndDate?: string;
  isPrimeExclusive?: boolean;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  couponCode?: string;
  couponNote?: string;
  _type?: 'deal';
  _updatedAt?: string;
  _createdAt?: string;
}
