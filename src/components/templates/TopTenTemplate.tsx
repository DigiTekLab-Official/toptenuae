
import React, { useMemo } from "react";
import { directAnswers, uaeChecks } from "./topTenFallbacks";
import { splitBuyingGuideContent } from "@/lib/topTenSections";
import { parseAmazonAffiliateDestination } from "@/lib/affiliate/click-tracking.js";

import { ArrowDown, Shield } from "@/components/icons";

// --- COMPONENTS ---
import ComparisonSummaryTable from "./ComparisonSummaryTable";
import QuickVerdict from "./QuickVerdict"; 
import DisclaimerBlock from "../ui/DisclaimerBlock"; 
import PortableText from "@/components/sanity/PortableText";
import FAQAccordion from "@/components/FAQAccordion";
import AffiliateDisclosure from "../ui/AffiliateDisclosure";
import LogoIcon from "@/components/icons/LogoIcon";
import EditorialTrust from "@/components/EditorialTrust";
import { buildContentPath } from "@/lib/contentRoute";
import { getAffiliateCategory } from "@/lib/affiliate/category.js";

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
  slug?: string;
  reviewSection?: string;
  intro: any; 
  body: any; 
  closingContent?: any;
  mainImage?: { url: string; alt?: string }; 
  category?: { title: string; slug: string; menuLabel?: string } | string;
  publishedAt?: string;
  faqs?: { _key: string; question: string; answer: string }[];
  listItems?: ListItem[];
  relatedBuyerGuide?: { title: string; slug: string; category?: string };
  relatedContent?: { _id?: string; _type: 'topTenList' | 'buyerGuide' | 'howTo' | 'review'; title: string; slug: string; categorySlug?: string }[];
  showAffiliateDisclosure?: boolean;
  affiliateDisclosure?: string;
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
  skipIf?: string;
  customVerdict?: string;
  product: Product;
}

// --- MAIN TEMPLATE ---
export default function TopTenTemplate({ data }: { data: TopTenData }) {
  const affiliateCategory = getAffiliateCategory(data.slug, data.title, data.reviewSection);
  const items = (data.listItems || []).filter(item => item?.product?.title);
  // Product references are the schema's commercial discriminator; titles are not.
  const isCommercial = items.some(item => item.product._type === 'product');
  const sections = splitBuyingGuideContent(data.body, data.closingContent);
  const bestOverall = items.find(item => /best (overall|all.round)/i.test(item.badgeLabel || ''));
  const quickAnswer = sections.quickAnswer.length ? sections.quickAnswer : affiliateCategory ? directAnswers[affiliateCategory] : undefined;
  const checks = sections.checks.length ? sections.checks : undefined;
  const fallbackChecks = !checks && affiliateCategory ? uaeChecks[affiliateCategory] : undefined;
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
    !isCommercial && (firstItemType === 'aviationEntity' ||
    checkText.includes('airline') || 
    checkText.includes('airport'));

  const isEducationPost = 
    !isCommercial && !isAviationPost && (
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

  const quickPicks = items
    .filter(item => item.product._type === 'product' && (item.badgeLabel || item.product.heroFeature)
      && !/unavailable|verify stock/i.test(item.badgeLabel || ''))
    .slice(0, 4).map(item => ({
      rank: item.rank,
      tag: item.badgeLabel || item.product.heroFeature || '',
      title: item.product.title,
      rating: item.product.customerRating,
      priceEstimate: item.product.priceTier ? `${item.product.priceTier} Tier` : undefined,
      imageUrl: item.product.mainImage?.url || '',
      imageAlt: item.product.mainImage?.alt || item.product.title,
      affiliateLink: item.product.affiliateLink,
      bestFor: item.product.heroFeature,
      whySelected: item.whySelected || item.customVerdict || item.product.pros?.[0],
      limitation: item.skipIf || item.product.cons?.[0],
    }));

  // --- SCHEMA.ORG JSON-LD GENERATOR ---
  // Google Structured Data for Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": data.title,
    "description": "Top recommendations and independent reviews.",
    "itemListOrder": "http://schema.org/ItemListOrderDescending",
    "itemListElement": items.map((item) => {
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
      // LOGIC C: Editorial ranking item (Laptops, Tech, etc.)
      else {
        return {
          "@type": "ListItem",
          "position": item.rank,
          "name": entity.title,
          "url": entity.slug?.current
            ? `https://toptenuae.com/reviews/${entity.slug.current}`
            : undefined
        };
      }
    })
  };

  return (
    <div className="w-full min-w-0" data-affiliate-category={affiliateCategory}>
      
      {/* Inline ItemList ONLY for aviation/school lists because those entries
          need Airline/Airport/School typing. Product ranking pages receive the
          server-rendered editorial ItemList, avoiding duplicate ItemLists. */}
      {(isAviationPost || isEducationPost) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* --- TOP DISCLAIMER --- */}
      {(showDisclaimer || data.affiliateDisclosure) && !isEducationPost && !isAviationPost && (
        <div className="mb-2 text-sm text-gray-500 text-center md:text-left opacity-90 hover:opacity-100 transition-opacity">
          {isCommercial && data.affiliateDisclosure
            ? <p className="text-left text-xs leading-relaxed"><strong>Affiliate disclosure:</strong> {data.affiliateDisclosure} <a href="/about-us" className="underline">Learn more</a></p>
            : <AffiliateDisclosure compact={isCommercial} />}
        </div>
      )}

      {isCommercial ? <EditorialTrust data={data} section="metadata" /> : <div className="mb-6 space-y-6"><EditorialTrust data={data} /></div>}

      {isCommercial && quickAnswer && (
        <section className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 md:p-5" aria-labelledby="quick-answer-heading">
          <h2 id="quick-answer-heading" className="text-lg font-black text-primary">Quick answer</h2>
          <div className="mt-2"><PortableText value={quickAnswer} /></div>
          {bestOverall && <p className="mt-2 font-bold"><a href={`#item-${bestOverall.rank}`} className="text-primary underline">{bestOverall.badgeLabel}: {bestOverall.product.title}</a></p>}
          {bestOverall?.product.affiliateLink && parseAmazonAffiliateDestination(bestOverall.product.affiliateLink) && (
            <a href={bestOverall.product.affiliateLink} data-affiliate-product={bestOverall.product.title}
              data-affiliate-cta="quick_picks" data-affiliate-category={affiliateCategory} data-affiliate-position={bestOverall.rank}
              target="_blank" rel="nofollow sponsored noopener noreferrer"
              className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-3 text-center font-bold text-white hover:bg-blue-700">
              Check latest price on Amazon.ae
            </a>
          )}
        </section>
      )}
      {isCommercial && quickPicks.length > 0 && <QuickVerdict picks={quickPicks} category={affiliateCategory} showRationale />}
      {isCommercial && (checks || fallbackChecks?.length) && (
        <section className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4" aria-labelledby="uae-buying-checks">
          <h2 id="uae-buying-checks" className="text-lg font-bold text-slate-900">UAE buying checks</h2>
          {checks ? <PortableText value={checks} /> : <ul className="mt-2 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            {fallbackChecks?.map(check => <li key={check}>✓ {check}</li>)}
          </ul>}
        </section>
      )}
      {isCommercial && <ComparisonSummaryTable items={items} category={affiliateCategory} />}

      {data.relatedBuyerGuide?.slug && (
        <aside className="mb-8 rounded-2xl border border-primary-200 bg-primary-50 p-5" aria-label="Related buyer guide">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Choose before you compare</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Not sure which type or specification fits your needs?{' '}
            <a
              href={`/${data.relatedBuyerGuide.category || 'reviews'}/${data.relatedBuyerGuide.slug}`}
              className="font-bold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >
              Read {data.relatedBuyerGuide.title}
            </a>
            {' '}before comparing the recommendations below.
          </p>
        </aside>
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
      {!isCommercial && heroImageUrl && (
        <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-lg mb-6">
          <img
            src={heroImageUrl}
            alt={data.mainImage?.alt || data.title || "Top 10 List"}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}

      {/* QUICK JUMP NAVIGATION */}
      {items.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 flex items-center gap-2 ml-1">
            <ArrowDown className="w-3 h-3" /> Quick Jump To:
          </h2>
          <nav className="flex flex-wrap gap-2">
            {items
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
        {!isCommercial && data.body?.length > 0 && <div className="prose prose-lg max-w-none"><PortableText value={data.body} /></div>}
        {/* RECOMMENDATIONS LOOP */}
        {items.length > 0 && (
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
              {items.map((item) => (
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
                     <ProductCard item={item as any} category={affiliateCategory} />
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

        {isCommercial ? <>
          {sections.guide.length > 0 && <section className="mt-10 prose prose-lg max-w-none" aria-label="Buying guide"><PortableText value={sections.guide} /></section>}
          <EditorialTrust data={data} section="context" />
          {sections.editorial.length > 0 && <div className="mt-8 prose prose-lg max-w-none"><PortableText value={sections.editorial} /></div>}
          <EditorialTrust data={data} section="audience" />
        </> : data.closingContent?.length > 0 && <section className="mt-10 prose prose-lg max-w-none">
          <h2>{isEducationPost ? "Admission & Parents' Guide" : isAviationPost ? "Traveler's Guide & Tips" : "Guide & Maintenance"}</h2>
          <PortableText value={data.closingContent} />
        </section>}

        {/* FAQ ACCORDION */}
        {data.faqs && data.faqs.length > 0 && <FAQAccordion faqs={data.faqs} />}

        {isCommercial && <>
          <EditorialTrust data={data} section="methodology" />
          {sections.methodology.length > 0 && <section className="prose max-w-none" aria-label="Research methodology"><PortableText value={sections.methodology} /></section>}
          <EditorialTrust data={data} section="sources" />
          {sections.sources.length > 0 && <section className="prose max-w-none" aria-label="Product documentation"><PortableText value={sections.sources} /></section>}
        </>}

        {data.relatedContent && data.relatedContent.length > 0 && (
          <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="related-buying-guides-heading">
            <h2 id="related-buying-guides-heading" className="text-2xl font-black text-slate-900">Related UAE buying guides</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {data.relatedContent.map((item) => {
                const href = buildContentPath({
                  _type: item._type === 'review' ? 'article' : item._type,
                  slug: item.slug,
                  categorySlug: item.categorySlug || 'reviews',
                });
                if (!href) return null;
                return (
                  <a key={item._id || `${item._type}-${item.slug}`} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 font-bold leading-snug text-slate-900 shadow-sm transition hover:border-primary/30 hover:text-primary hover:shadow-md">
                    {item.title} <span aria-hidden="true">→</span>
                  </a>
                );
              })}
            </div>
          </section>
        )}
        
        {/* DISCLAIMER FOOTER */}
        {(showDisclaimer || isMedicalPost) && !isEducationPost && !isAviationPost && (
          <DisclaimerBlock type={isMedicalPost ? 'medical' : 'general'} />
        )}

      </div>
    </div>
  );
}
