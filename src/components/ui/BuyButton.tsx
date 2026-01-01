// src/components/ui/BuyButton.tsx
"use client";

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { sendGTMEvent } from '@/lib/gtm'; 

export type Retailer = 'amazon' | 'noon' | 'sharaf' | 'carrefour' | 'lifestyle' | 'generic';

interface BuyButtonProps {
  url: string;
  retailer?: string;
  customLabel?: string;
  itemName?: string;
}

// ✅ 1. Restore these constants
const retailerStyles: Record<string, string> = {
  amazon: 'bg-[#FFD814] text-[#0F1111] hover:bg-[#F7CA00]',
  noon: 'bg-[#3866DF] text-white hover:bg-[#2C52B3]',
  sharaf: 'bg-[#58A618] text-white hover:bg-[#468513]',
  carrefour: 'bg-[#00387B] text-white hover:bg-[#002855]',
  lifestyle: 'bg-[#EC008C] text-white hover:bg-[#C20073]',
  generic: 'bg-[#FFD814] text-[#0F1111] hover:bg-[#F7CA00]', 
};

// ✅ 2. Restore these names
const retailerNames: Record<string, string> = {
  amazon: 'Amazon',
  noon: 'Noon',
  sharaf: 'Sharaf DG',
  carrefour: 'Carrefour',
  lifestyle: 'Lifestyle',
  generic: 'Amazon', 
};

export default function BuyButton({ url, retailer = 'amazon', customLabel, itemName }: BuyButtonProps) {
  // Normalize retailer input
  const retailerKey = retailer?.toLowerCase() || 'amazon';
  
  // Get style and name
  const styleClass = retailerStyles[retailerKey] || retailerStyles.generic;
  const storeName = retailerNames[retailerKey] || retailerNames.generic;
  
  const label = customLabel || `Check Price on ${storeName}`;

  // TRACKING FUNCTION
  const handleClick = () => {
    sendGTMEvent({
      event: 'affiliate_click',
      product_name: itemName || 'Unknown Item',
      retailer: storeName,
      click_url: url
    });
  };

  return (
    <Link
      href={url}
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={handleClick}
      className={`group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-bold rounded-full shadow-sm hover:shadow-md transition-all transform active:scale-[0.98] ${styleClass}`}
    >
      <span>{label}</span>
      <ExternalLink className="w-5 h-5 ml-2 opacity-80 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}