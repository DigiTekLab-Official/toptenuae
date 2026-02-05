"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { ArrowDown, Shield } from "@/components/icons";

// --- COMPONENTS ---
import ComparisonSummaryTable from "./ComparisonSummaryTable";
import QuickVerdict from "./QuickVerdict"; 
import DisclaimerBlock from "../ui/DisclaimerBlock"; 
import PortableText from "@/components/sanity/PortableText";
import FAQAccordion from "@/components/FAQAccordion";
import AffiliateDisclosure from "../ui/AffiliateDisclosure";
import LogoIcon from "@/components/icons/LogoIcon";

// --- CARDS ---
import ProductCard from "../ui/ProductCard";       
import InstitutionCard from "../ui/InstitutionCard"; 
import AviationCard from "../ui/AviationCard";

// DEBUG: Log component mount to verify client-side hydration
if (typeof window !== "undefined") {
  console.log("[TopTenTemplate] Client component mounted");
} 

// --- INTERFACES ---
interface TopTenData {
  title: string;
  intro: any; 
  body: any; 
  closingContent?: any;
  mainImage?: { url: string; alt?: string }; 
  category?: { title: string; slug: string; menuLabel?: string } | string;
  publishedAt?: string;
  faqs?: { _key: string; question: string; answer: string }[];
  listItems?: ListItem[];
  showAffiliateDisclosure?: boolean;
}

interface Product {
  _id?: string;
  _type?: "product" | "institution" | "aviationEntity";
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
  
  // Aviation specific fields
  entityType?: "airline" | "airport"; 
  code?: string;     
  country?: string; 
  
  // Common Product fields
  title: string;
  slug?: { current: string }; 
  mainImage?: { url: string; alt?: string };
  affiliateLink?: string;
  retailer?: string;
  priceTier?: string;  
  itemDescription?: any;
  keyFeatures?: string[];
  
  // ✅ ADDED: Tech Specs Support (Label/Value pairs)
  specifications?: { specLabel: string; specValue: string }[];
  
  pros?: string[];
  cons?: string[];
  customerRating?: number;
  ratingCount?: number;   
  heroFeature?: string; 
  price?: number;         
  currency?: string;      
  availability?: string;  
  
  // Education/Location fields
  location?: string;
  address?: string;      
  curriculum?: string;    
  rating?: string | number;        
  feeRange?: string;      
  realityCheck?: string[];
  website?: string;       
  verdict?: string;
}

interface ListItem {
  _key: string;
  rank: number;
  badgeLabel?: string;
  whySelected?: string;
  customVerdict?: string;
  product: Product;
}

// --- MAIN TEMPLATE ---
export default function TopTenTemplate({ data }: { data: TopTenData }) {
  // ✅ FIXED: Use useMemo to stabilize heroImageUrl across re-renders
  const heroImageUrl = useMemo(() => {
    return data?.mainImage?.url || null;
  }, [data?.mainImage?.url]);
  
  const showDisclaimer = useMemo(() => {
    return data?.showAffiliateDisclosure ?? true;
  }, [data?.showAffiliateDisclosure]);

  // DEBUG LOGGING
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("[TopTenTemplate] Received data:", {
        title: data?.title,
        listItemsCount: data?.listItems?.length || 0,
        heroImageUrl,
      });
    }
  }, [data?.title, data?.listItems?.length, heroImageUrl]);

  // --- 2. SMART DETECTION LOGIC ---
  // Detects if this is a School, Airline, or Medical post to adjust layout
  const categoryString = typeof data.category === 'string' 
    ? data.category 
    : data.category?.slug || "";

  const normalizedCat = categoryString === 'baby-kid' ? 'parenting-kids' : categoryString;
  const checkText = ((data.title || "") + " " + normalizedCat).toLowerCase();
  
  // Safe access to first item type
  const firstItemType = data.listItems?.[0]?.product?._type;

  const isAviationPost = 
    firstItemType === 'aviationEntity' || 
    checkText.includes('airline') || 
    checkText.includes('airport');

  const isEducationPost = 
    !isAviationPost && ( 
      firstItemType === 'institution' || 
      checkText.includes('education') || 
      checkText.includes('school') ||
      checkText.includes('university') ||
      checkText.includes('college')
    );

  const hasMedicalKeywords = 
    checkText.includes("skincare") || checkText.includes("skin") ||    
    checkText.includes("lotion") || checkText.includes("dermatologist");

  const isMedicalPost = hasMedicalKeywords && !checkText.includes("trimmer");

  // --- QUICK VERDICT DATA ---
  // Extract top 3 picks for the "Quick Verdict" component
  const quickPicks = data.listItems?.slice(0, 3).map(item => ({
    tag: item.badgeLabel || (item.rank === 1 ? "Best Overall" : item.rank === 2 ? "Runner Up" : "Great Value"),
    title: item.product.title,
    rating: item.product.customerRating || 0,
    priceEstimate: item.product.price ? `${item.product.currency || 'AED'} ${item.product.price}` : undefined,
    imageUrl: item.product.mainImage?.url || "",
    affiliateLink: item.product.affiliateLink
  })) || [];

  // --- SCHEMA.ORG JSON-LD GENERATOR ---
  // Google Structured Data for Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": data.title,
    "description": "Top recommendations and independent reviews.",
    "itemListOrder": "http://schema.org/ItemListOrderDescending",
    "itemListElement": data.listItems?.map((item) => {
      const entity = item.product;
      const isInstitution = entity._type === 'institution' || isEducationPost;
      
      // LOGIC A: Aviation Schema
      if (entity._type === 'aviationEntity') {
        const schemaType = entity.entityType === 'airport' ? 'Airport' : 'Airline';
        return {
          "@type": "ListItem",
          "position": item.rank,
          "item": {
            "@type": schemaType,
            "name": entity.title,
            "iataCode": entity.code,
            "image": entity.mainImage?.url,
            "url": entity.website,
            "description": item.customVerdict || entity.verdict,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": entity.country
            }
          }
        };
      }
      // LOGIC B: School Schema
      else if (isInstitution) {
        return {
          "@type": "ListItem",
          "position": item.rank,
          "item": {
            "@type": "School",
            "name": entity.title,
            "description": item.customVerdict || entity.verdict,
            "url": entity.website,
            "image": entity.mainImage?.url,
            "address": entity.address || entity.location,
            "hasCredential": {
               "@type": "EducationalOccupationalCredential",
               "credentialCategory": entity.curriculum || "School Curriculum"
            }
          }
        };
      } 
      // LOGIC C: Product Schema (Laptops, Tech, etc.)
      else {
        return {
          "@type": "ListItem",
          "position": item.rank,
          "item": {
            "@type": "Product",
            "name": entity.title,
            "description": item.customVerdict || entity.verdict,
            "image": entity.mainImage?.url,
            "offers": {
              "@type": "Offer",
              "price": entity.price || "0", 
              "priceCurrency": entity.currency || "AED",
              "availability": "http://schema.org/InStock"
            },
            // ✅ SEO BOOST: Include Tech Specs in Schema
            "additionalProperty": entity.specifications?.map(spec => ({
              "@type": "PropertyValue",
              "name": spec.specLabel,
              "value": spec.specValue
            }))
          }
        };
      }
    })
  };

  return (
    <div className="w-full min-w-0">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- TOP DISCLAIMER --- */}
      {showDisclaimer && !isEducationPost && !isAviationPost && (
        <div className="mb-2 text-sm text-gray-500 text-center md:text-left opacity-90 hover:opacity-100 transition-opacity">
          <AffiliateDisclosure />
        </div>
      )}

      {isEducationPost && (
         <div className="bg-slate-50 border-b border-gray-100 py-2 px-4 mb-6 text-sm text-gray-600 flex items-start gap-2 leading-relaxed">
           <Shield className="w-4 h-4 mt-0.5 shrink-0 opacity-80" />
           <p>
             <strong>Transparency Note:</strong> Independent school rankings based on research and KHDA reports.
           </p>
         </div>
      )}

      {/* HERO IMAGE */}
      {heroImageUrl && (
        <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-lg mb-6">
          <Image
            src={heroImageUrl}
            alt={data.title || "Top 10 List"}
            fill
            priority={false}
            loading="lazy"
            className="object-cover hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            quality={75}
          />
        </div>
      )}

      {/* QUICK JUMP NAVIGATION */}
      {data.listItems && data.listItems.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 flex items-center gap-2 ml-1">
            <ArrowDown className="w-3 h-3" /> Quick Jump To:
          </h2>
          <nav className="flex flex-wrap gap-2">
            {data.listItems
              .filter((item) => item.product?.title)
              .map((item) => (
                <a
                  key={item._key}
                  href={`#item-${item.rank}`}
                  className="group flex items-center gap-2 pl-2 pr-3 py-1.5 bg-primary-100 border border-primary-200 rounded-full shadow-sm hover:shadow-md hover:bg-primary-50 transition-all duration-200"
                >
                  <span className="bg-primary text-white text-xs font-black w-5 h-5 flex items-center justify-center rounded-full" aria-hidden="true">
                    {item.rank}
                  </span>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors line-clamp-1 max-w-37.5">
                    {item.product.title.split(" ").slice(0, 3).join(" ")}...
                  </span>
                </a>
              ))}
          </nav>
        </div>
      )}

      <div className="space-y-2">
          {/* INTRO CONTENT BLOCK */}
          <div className="prose prose-lg max-w-none text-slate-800 leading-relaxed bg-linear-to-b from-slate-100 to-white px-6 py-0 rounded-2xl border border-slate-200 shadow-inner mb-6">
             {(() => {
               const content = data.body;
               const normalizedContent = Array.isArray(content) ? content : (content ? [content] : []);
               return <PortableText value={normalizedContent} />;
             })()}
          </div>

          {/* --- 3. QUICK VERDICT (Hide for Schools & Aviation) --- */}
          {!isEducationPost && !isAviationPost && quickPicks.length > 0 && (
             <QuickVerdict picks={quickPicks} />
          )}
   
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
                  
                  {/* CARD SWITCHER LOGIC */}
                  {item.product._type === 'aviationEntity' ? (
                     <AviationCard item={item} />
                  ) 
                  : isEducationPost && item.product._type === 'institution' ? (
                     <InstitutionCard item={item} />
                  ) 
                  : (
                     // ✅ PASSES ITEM + SPECS TO PRODUCT CARD
                     <ProductCard item={item as any} />
                  )}

                  {/* Visual Separator */}
                  <div className="flex items-center justify-center py-2 opacity-40">
                    <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* COMPARISON TABLE (Only for Products) */}
        {data.listItems && data.listItems.length > 0 && !isEducationPost && !isAviationPost && (
          <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
             <div className="min-w-150"> 
               <ComparisonSummaryTable items={data.listItems} />
             </div>
          </div>
        )}

        {/* CLOSING CONTENT & BUYER'S GUIDE */}
        {data.closingContent && (
          <div className="mb-12"> 
            {data.listItems && data.listItems.length > 0 ? (
              <div className="mt-12 prose prose-lg max-w-none text-slate-800 leading-relaxed bg-blue-50/50 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm">
                
                {/* DYNAMIC FOOTER TITLE */}
                <div className="flex items-center gap-2 mb-4 text-blue-800 border-b border-blue-200 pb-2">
                  <Shield className="w-6 h-6" />
                  <h2 className="text-xl font-bold m-0! p-0!">
                    {isEducationPost ? "Admission & Parents' Guide" : 
                     isAviationPost ? "Traveler's Guide & Tips" : 
                     "Guide & Maintenance"}
                  </h2>
                </div>
                
                {(() => {
                  const content = data.closingContent;
                  const normalizedContent = Array.isArray(content) ? content : (content ? [content] : []);
                  return <PortableText value={normalizedContent} />;
                })()}
              </div>
            ) : (
              // Fallback for standard articles without list items
              <div className="mt-4 pt-4 border-t border-gray-100 prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:first:mt-0 prose-p:first:mt-0">
                {(() => {
                  const content = data.closingContent;
                  const normalizedContent = Array.isArray(content) ? content : (content ? [content] : []);
                  return <PortableText value={normalizedContent} />;
                })()}
              </div>
            )}
          </div>
        )}

        {/* FAQ ACCORDION */}
        {data.faqs && data.faqs.length > 0 && <FAQAccordion faqs={data.faqs} />}
        
        {/* DISCLAIMER FOOTER */}
        {(showDisclaimer || isMedicalPost) && !isEducationPost && !isAviationPost && (
          <DisclaimerBlock type={isMedicalPost ? 'medical' : 'general'} />
        )}

      </div>
    </div>
  );
}