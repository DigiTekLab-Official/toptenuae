
import React, { useMemo } from "react";

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
  intro: any; 
  body: any; 
  closingContent?: any;
  mainImage?: { url: string; alt?: string }; 
  category?: { title: string; slug: string; menuLabel?: string } | string;
  publishedAt?: string;
  faqs?: { _key: string; question: string; answer: string }[];
  listItems?: ListItem[];
  relatedBuyerGuide?: { title: string; slug: string; category?: string };
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
  skipIf?: string;
  customVerdict?: string;
  product: Product;
}

const getAffiliateCategory = (slug = '', title = '') => {
  const value = `${slug} ${title}`.toLowerCase();
  if (value.includes('electric-shaver') || value.includes('electric shaver')) return 'electric_shaver';
  if (value.includes('beard-trimmer') || value.includes('beard trimmer')) return 'beard_trimmer';
  if (value.includes('air-fryer') || value.includes('air fryer')) return 'air_fryer';
  if (value.includes('baby-monitor') || value.includes('baby monitor')) return 'baby_monitor';
  if (value.includes('coffee-maker') || value.includes('coffee maker')) return 'coffee_maker';
  if (value.includes('earbud')) return 'earbuds';
  if (value.includes('laptop')) return 'laptop';
  if (value.includes('headphone')) return 'headphones';
  return undefined;
};

const phase3Categories = new Set(['laptop', 'air_fryer', 'electric_shaver', 'beard_trimmer', 'baby_monitor', 'coffee_maker']);
const phase3CommercialSlugs = new Set([
  'best-laptops-uae',
  'best-air-fryers-uae-2026',
  'best-electric-shaver-uae',
  'best-beard-trimmers-uae',
  'best-baby-monitors-uae',
  'best-coffee-makers-uae',
]);

const directAnswers: Record<string, string> = {
  laptop: 'For most UAE students and office users, 16GB RAM and a 512GB SSD are practical starting points. Gaming and demanding creative work also need an appropriate dedicated GPU.',
  air_fryer: 'For most UAE households, a 5–7L air fryer suits three or four people. Larger households or cooks making two foods at once should consider a 7–10L or dual-basket model.',
  electric_shaver: 'Choose a foil shaver for frequent straight passes and precise edges; choose a rotary shaver for multidirectional growth and the curves of the jaw and neck.',
  beard_trimmer: 'Choose a beard trimmer by the length range and comb increments you will actually use. Roughly 0.5–2mm suits stubble, 3–5mm a short beard, and 6–10mm a medium beard.',
  baby_monitor: 'Choose a non-Wi-Fi baby monitor for simple local viewing and fewer cloud dependencies, or a Wi-Fi model for remote app access. Hybrid monitors provide both but require more setup and security care.',
  coffee_maker: 'For most UAE buyers, the right coffee maker is determined by drink style and daily effort: capsule for speed, filter for several mugs, manual espresso for control, or bean-to-cup for one-touch fresh coffee.',
};

const uaeChecks: Record<string, string[]> = {
  laptop: [
    'Confirm the exact processor, RAM and storage variant; marketplace titles can group several configurations.',
    'Check whether the keyboard is English-only or Arabic/English and whether that matches your preference.',
    'Verify the seller, UAE warranty coverage and included Type-G-compatible charger before ordering.',
    'For gaming or creator laptops, allow clear ventilation in warm rooms rather than using the device on soft furnishings.',
  ],
  air_fryer: [
    'Confirm 220–240V compatibility and a UAE Type-G plug; avoid relying on a travel adaptor for a high-power appliance.',
    'Compare usable basket floor area and external footprint, not litres alone, and leave the maker’s required ventilation clearance.',
    'Check the exact seller, return terms and UAE warranty shown on the current Amazon.ae listing.',
  ],
  electric_shaver: [
    'Confirm charger voltage and plug compatibility, especially for an imported marketplace variant.',
    'Check the local cost and availability of replacement foils, cutters or rotary heads before choosing a model.',
    'If stored in a humid bathroom, clean and dry the head as directed rather than leaving it wet.',
  ],
  beard_trimmer: [
    'Verify the exact combs and attachments included with the listed regional variant.',
    'Check charging and UAE plug compatibility, plus the stated waterproof or washable-parts guidance.',
    'Compare seller and UAE warranty details, especially for marketplace imports.',
  ],
  baby_monitor: [
    'For Wi-Fi models, check app support, update policy and whether recordings stay local or use cloud storage.',
    'Use a unique password and current firmware; non-Wi-Fi does not automatically mean every radio link has the same privacy design.',
    'Reinforced walls can reduce quoted range, so judge placement around your actual apartment or villa layout.',
    'Verify the included plug, seller and UAE warranty for the exact Amazon.ae variant.',
  ],
  coffee_maker: [
    'Confirm 220–240V compatibility and that the exact offer includes a UAE Type-G plug; a plug adaptor does not convert voltage.',
    'Check the current seller, written UAE warranty terms and authorised service route before ordering.',
    'Measure width, depth, overhead refill access and ventilation clearance for your counter.',
    'Confirm local availability of capsules, water filters, descaler, milk-system parts and replacement jugs before choosing a format.',
  ],
};

const overallAudience: Record<string, string> = {
  laptop: 'most students, office users and everyday buyers',
  air_fryer: 'most households wanting a versatile everyday air fryer',
  electric_shaver: 'most buyers balancing shave quality, comfort and cost',
  beard_trimmer: 'most buyers who need dependable everyday beard maintenance',
  baby_monitor: 'parents wanting the strongest all-round feature balance',
  coffee_maker: 'most households wanting fresh coffee without a manual espresso workflow',
};

// --- MAIN TEMPLATE ---
export default function TopTenTemplate({ data }: { data: TopTenData }) {
  const affiliateCategory = getAffiliateCategory(data.slug, data.title);
  const isPhase3Cluster = !!affiliateCategory && phase3Categories.has(affiliateCategory) && phase3CommercialSlugs.has(data.slug || '');
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

  const toQuickPick = (item: ListItem, tag = item.badgeLabel || (item.rank === 1 ? 'Best Overall' : 'Recommended')) => ({
    rank: item.rank,
    tag,
    title: item.product.title,
    rating: item.product.customerRating,
    priceEstimate: item.product.priceTier ? `${item.product.priceTier} Tier` : undefined,
    imageUrl: item.product.mainImage?.url || "",
    affiliateLink: item.product.affiliateLink,
    bestFor: (() => {
      if (tag === 'Best Overall' && affiliateCategory) return overallAudience[affiliateCategory];
      if (tag === 'Best Value') return 'buyers prioritising useful features at a lower price tier';
      if (tag === 'Best Premium') return 'buyers willing to pay more for higher-end features';
      const labelledUse = item.badgeLabel
        ?.replace(/^best\s+(overall|value|premium)(?:\s*[-:])?\s*/i, '')
        .replace(/^best\s+for\s+/i, '')
        .replace(/^best\s+/i, '');
      if (labelledUse) return labelledUse;
      return tag;
    })(),
    whySelected: item.whySelected || item.customVerdict || item.product.pros?.[0] || 'A strong fit for the use case shown above.',
    limitation: item.skipIf || item.product.cons?.[0] || 'Check the exact specification and seller terms before ordering.',
  });

  // Preserve the original shortlist elsewhere; only the five proven clusters
  // get semantic, deduplicated recommendation roles.
  const defaultQuickPicks = data.listItems?.slice(0, 3).map((item) =>
    toQuickPick(item, item.badgeLabel || (item.rank === 1 ? 'Best Overall' : item.rank === 2 ? 'Runner Up' : 'Great Value'))
  ) || [];
  const recommendationCandidates = (data.listItems || []).filter((item) =>
    item.product?.title && !/unavailable|verify stock/i.test(item.badgeLabel || '')
  );
  const selectedItems: { item: ListItem; tag: string }[] = [];
  const addPick = (item: ListItem | undefined, tag: string) => {
    if (item && !selectedItems.some(({ item: selected }) => selected._key === item._key)) selectedItems.push({ item, tag });
  };
  addPick(recommendationCandidates.find((item) => /best overall/i.test(item.badgeLabel || '')) || recommendationCandidates[0], 'Best Overall');
  addPick(recommendationCandidates.find((item) => /best (?:simple )?value/i.test(item.badgeLabel || '')), 'Best Value');
  addPick(recommendationCandidates.find((item) => /best premium/i.test(item.badgeLabel || '')), 'Best Premium');
  addPick(recommendationCandidates.find((item) => /best for|best gaming|best hybrid|best non.?wi.?fi/i.test(item.badgeLabel || '')), recommendationCandidates.find((item) => /best for|best gaming|best hybrid|best non.?wi.?fi/i.test(item.badgeLabel || ''))?.badgeLabel || 'Best for a specific need');
  const quickPicks = isPhase3Cluster ? selectedItems.slice(0, 4).map(({ item, tag }) => toQuickPick(item, tag)) : defaultQuickPicks;

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
            // offers removed: price-less Offer fails GSC Merchant-listings
            // ("missing field price"); confirmed flagging /top-ten/ URLs.
            // Must match the server generateTopTenListSchema removal — both
            // sources emit the same ItemList, so fixing one alone leaves the flag.
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
    <div className="w-full min-w-0" data-affiliate-category={affiliateCategory}>
      
      {/* Inline ItemList ONLY for aviation/school lists — the server
          generateTopTenListSchema types every item as Product and cannot
          represent Airline/Airport/School. For product lists, the richer
          server ItemList (with per-item aggregateRating) is the single
          source; rendering this too would duplicate the ItemList (Carousel
          "multiple ListItem" error). One ItemList per page, by type. */}
      {(isAviationPost || isEducationPost) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* --- TOP DISCLAIMER --- */}
      {showDisclaimer && !isEducationPost && !isAviationPost && (
        <div className="mb-2 text-sm text-gray-500 text-center md:text-left opacity-90 hover:opacity-100 transition-opacity">
          <AffiliateDisclosure />
        </div>
      )}

      <div className="mb-6 space-y-6">
        <EditorialTrust data={data} />
      </div>

      {isPhase3Cluster && affiliateCategory && (
        <section className="mb-8 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 md:p-6" aria-labelledby="quick-answer-heading">
          <h2 id="quick-answer-heading" className="text-sm font-black uppercase tracking-wider text-primary">Quick answer</h2>
          <p className="mt-2 text-base font-semibold leading-relaxed text-slate-800">{directAnswers[affiliateCategory]}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Recommendations are based on the documented specifications and buyer fit shown below, not an unsupported claim of hands-on testing. Confirm the current Amazon.ae variant, seller and warranty before ordering.</p>
        </section>
      )}

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

      {isPhase3Cluster && quickPicks.length > 0 && (
        <QuickVerdict picks={quickPicks} category={affiliateCategory} showRationale />
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
          <img
            src={heroImageUrl}
            alt={data.title || "Top 10 List"}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
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

      {/* Purchase-decision summary is intentionally near the top so readers
          can compare verified CMS attributes before scrolling through cards. */}
      {data.listItems && data.listItems.length > 0 && !isEducationPost && !isAviationPost && (
        <ComparisonSummaryTable items={data.listItems} category={affiliateCategory} />
      )}

      {isPhase3Cluster && affiliateCategory && (
        <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6" aria-labelledby="uae-buying-checks">
          <h2 id="uae-buying-checks" className="text-xl font-black text-slate-900">UAE buying checks</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-slate-700 md:grid-cols-2">
            {uaeChecks[affiliateCategory].map((check) => <li key={check} className="flex gap-2"><span aria-hidden="true" className="font-black text-primary">✓</span><span>{check}</span></li>)}
          </ul>
        </section>
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
          {!isPhase3Cluster && !isEducationPost && !isAviationPost && quickPicks.length > 0 && (
             <QuickVerdict picks={quickPicks} category={affiliateCategory} />
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
