// src/components/templates/TopTenTemplate.tsx
"use client";

import React from "react";
import Image from "next/image";
import ComparisonSummaryTable from "./ComparisonSummaryTable";
import DisclaimerBlock from "../ui/DisclaimerBlock"; 
import PortableText from "@/components/PortableText";
import {
  ArrowDown,
  Shield,
} from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";
import AffiliateDisclosure from "../ui/AffiliateDisclosure";
import LogoIcon from "@/components/icons/LogoIcon";
import { discoverImage } from "@/sanity/lib/image";

// ✅ IMPORT THE NEW SAFE PRODUCT CARD
import ProductCard from "../ui/ProductCard"; 

// --- 1. INTERFACES ---
interface TopTenData {
  title: string;
  intro: any; 
  body: any; 
  closingContent?: any;
  mainImage?: any;
  category?: string;
  publishedAt?: string;
  faqs?: { _key: string; question: string; answer: string }[];
  listItems?: ListItem[];
  showAffiliateDisclosure?: boolean;
}

// ✅ UPDATED: Matches your new 'product.ts' schema exactly
interface Product {
  title: string;
  slug?: string;
  mainImage?: any;
  affiliateLink?: string;
  retailer?: string;
  priceTier?: string;  
  verdict?: string;
  itemDescription?: any;
  keyFeatures?: string[];
  pros?: string[];
  cons?: string[];
  customerRating?: number;
  ratingCount?: number;   // Updated to number
  heroFeature?: string; 
  
  // 🔥 NEW FIELDS (Replaces priceEstimate)
  price?: number;         
  currency?: string;      
  availability?: string;  
}

interface ListItem {
  _key: string;
  rank: number;
  badgeLabel?: string;
  whySelected?: string;
  customVerdict?: string;
  product: Product;
}

// --- 2. HELPER: GENERATE FAQ SCHEMA (SEO BOOSTER) ---
const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// --- MAIN TEMPLATE ---
export default function TopTenTemplate({ data }: { data: TopTenData }) {
  const heroImageUrl = data.mainImage ? discoverImage(data.mainImage) : null;
  const showDisclaimer = (data.showAffiliateDisclosure ?? true);

  // SMART DETECTION LOGIC
  const checkText = (data.title + " " + (data.category || "")).toLowerCase();

  const hasMedicalKeywords = 
    checkText.includes("skincare") || checkText.includes("skin") ||    
    checkText.includes("lotion") || checkText.includes("cream") || 
    checkText.includes("oil") || checkText.includes("shampoo") || 
    checkText.includes("serum") || checkText.includes("ointment") ||
    checkText.includes("supplement") || checkText.includes("medicine") ||
    checkText.includes("dermatologist");

  const isElectronicDevice = 
    checkText.includes("trimmer") || checkText.includes("shaver") || 
    checkText.includes("clipper") || checkText.includes("monitor") || 
    checkText.includes("camera") || checkText.includes("stroller") ||  
    checkText.includes("seat") || checkText.includes("toy");        

  const isMedicalPost = hasMedicalKeywords && !isElectronicDevice;

  // ✅ GENERATE FAQ SCHEMA IF DATA EXISTS
  const faqSchema = (data.faqs && data.faqs.length > 0) 
    ? generateFAQSchema(data.faqs) 
    : null;

  return (
    <div className="w-full">
      
      {/* ✅ INJECT FAQ SCHEMA INTO HEAD */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      {/* TOP DISCLAIMER */}
      {showDisclaimer && (
        <div className="mb-2 text-sm text-gray-500 text-center md:text-left opacity-90 hover:opacity-100 transition-opacity">
          <AffiliateDisclosure />
        </div>
      )}

      {heroImageUrl && (
        <div className="relative w-full aspect-[3/2] lg:aspect-[16/9] overflow-hidden rounded-xl shadow-lg mb-8">
          <Image
            src={heroImageUrl}
            alt={data.title}
            fill
            priority
            className="object-cover hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>
      )}

      {/* QUICK NAVIGATION */}
      {data.listItems && data.listItems.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 flex items-center gap-2 ml-1">
            <ArrowDown className="w-3 h-3" /> Quick Jump To:
          </h2>
          <nav className="flex flex-wrap gap-2">
            {data.listItems
              .filter((item) => item.product?.title) // Safety check
              .map((item) => (
                <a
                  key={item._key}
                  href={`#item-${item.rank}`}
                  className="group flex items-center gap-2 pl-2 pr-3 py-1.5 bg-violet-200 border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
                >
                  <span className="bg-primary/10 text-primary text-sm font-black w-5 h-5 flex items-center justify-center rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    {item.rank}
                  </span>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors line-clamp-1 max-w-[150px]">
                    {item.product.title.split(" ").slice(0, 3).join(" ")}...
                  </span>
                </a>
              ))}
          </nav>
        </div>
      )}

      <div className="space-y-2">
          {/* INTRO CONTENT */}
          <div className="prose prose-lg max-w-none text-slate-800 leading-relaxed bg-gradient-to-b from-slate-100 to-white px-6 py-0 rounded-2xl border border-slate-200 shadow-inner mb-2">
             <PortableText value={data.body || data.intro} />
          </div>
   
        {/* RECOMMENDATIONS LOOP */}
        {data.listItems && data.listItems.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-100 mt-4">
              <div className="text-primary">
                <LogoIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Our Top Recommendations
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              {data.listItems.map((item) => (
                <React.Fragment key={item._key}>
                  {/* ✅ USES THE NEW IMPORTED PRODUCT CARD */}
                  <ProductCard item={item} />
                  
                  {/* Visual Divider */}
                  <div className="flex items-center justify-center py-2 opacity-40">
                    <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* COMPARISON TABLE */}
        {data.listItems && data.listItems.length > 0 && (
          <ComparisonSummaryTable items={data.listItems} />
        )}

        {/* CLOSING CONTENT */}
        {data.closingContent && (
          <div className="mb-12"> 
            {data.listItems && data.listItems.length > 0 ? (
              <div className="mt-12 prose prose-lg max-w-none text-slate-800 leading-relaxed bg-blue-50/50 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-blue-800 border-b border-blue-200 pb-2">
                  <Shield className="w-6 h-6" />
                  <h2 className="text-xl font-bold m-0! p-0!">Guide & Maintenance</h2>
                </div>
                <PortableText value={data.closingContent} />
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-100 prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:first:mt-0 prose-p:first:mt-0">
                <PortableText value={data.closingContent} />
              </div>
            )}
          </div>
        )}

        {data.faqs && data.faqs.length > 0 && <FAQAccordion faqs={data.faqs} />}
        
        {/* BOTTOM DISCLAIMER */}
        {(showDisclaimer || isMedicalPost) && (
          <DisclaimerBlock type={isMedicalPost ? 'medical' : 'general'} />
        )}

      </div>
    </div>
  );
}