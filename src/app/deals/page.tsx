// src/app/deals/page.tsx
import { client } from '@/sanity/lib/client';
import DealsFeed from '@/components/deals/DealsFeed';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ALL_DEALS_QUERY } from '@/sanity/lib/queries';
import { Percent } from 'lucide-react';
import JsonLd from '@/components/sanity/JsonLd';
import { generateSchema } from '@/lib/schemaGenerator';

/**
 * Senior Developer Note: 
 * We use dynamic metadata to target high-volume seasonal searches 
 * while maintaining a clean canonical link for SEO.
 */
export const metadata: Metadata = {
  title: "Ramadan Sale 2026: Top Deals in UAE | Amazon & Noon Discounts",
  description: "Verified Ramadan 2026 price drops and exclusive coupon codes for UAE shoppers. Save up to 70% on Electronics, Fashion, and Home essentials.",
  alternates: { canonical: 'https://toptenuae.com/deals' }
};

// --- Loading Skeleton ---
function DealsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-[#4b0082] h-80 animate-pulse"></div>
      <div className="container mx-auto px-4 max-w-7xl py-10">
        <div className="h-24 bg-white rounded-xl mb-10 w-full animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-96 p-8 border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Data Fetching ---
async function getDeals() {
  try {
    // ✅ Uses Cache Tags for On-Demand Revalidation via Sanity Webhooks
    return await client.fetch(ALL_DEALS_QUERY, {}, {
      next: { tags: ['deal', 'product'] } 
    });
  } catch (error) {
    console.error('Failed to fetch deals:', error);
    return [];
  }
}

// --- Main Component ---
export default async function DealsPage() {
  // 1. Fetch Data
  const deals = await getDeals();

  // 2. SCHEMA GENERATION (2026 Optimization)
  // Extracting prices to build an AggregateOffer (high-CTR Rich Snippet)
  const validPrices = deals
    .map((d: any) => d.dealPrice)
    .filter((p: any) => typeof p === 'number' && p > 0);
  
  const lowPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const highPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;

  // Use the master utility for standard schemas (Organization, Breadcrumbs, etc.)
  const baseSchemas = generateSchema(
    { title: 'Top Deals in UAE', _type: 'deal' }, 
    'deals', 
    'latest'
  );

  // Transactional Product Schema specifically for the Feed
  const aggregateDealSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Latest TopTenUAE Ramadan Deals 2026",
    "description": "Daily verified discounts from Amazon.ae and Noon. Hand-picked electronics and home deals for UAE residents.",
    "brand": {
      "@type": "Brand",
      "name": "TopTenUAE"
    },
    "offers": {
      "@type": "AggregateOffer",
      "offerCount": deals.length,
      "lowPrice": lowPrice,
      "highPrice": highPrice,
      "priceCurrency": "AED",
      "availability": "https://schema.org/InStock",
      "offers": deals.slice(0, 15).map((deal: any) => ({
        "@type": "Offer",
        "name": deal.title,
        "price": deal.dealPrice,
        "priceCurrency": "AED",
        "url": deal.affiliateLink || 'https://toptenuae.com/deals'
      }))
    }
  };

  // Merge everything into a clean array for the script tag
  const allSchemas = [
    ...(Array.isArray(baseSchemas) ? baseSchemas : [baseSchemas]), 
    aggregateDealSchema
  ];

  return (
    <Suspense fallback={<DealsLoading />}>
      {/* 3. Inject Combined Schema Data */}
      <JsonLd data={allSchemas} />

      <div className="min-h-screen bg-slate-50 font-sans pb-20">

        {/* HERO SECTION */}
        <div className="bg-[#4b0082] text-white py-12 px-4 text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto">
            {/* Live Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-400 text-[#4b0082] text-xs font-black uppercase tracking-wider shadow-lg animate-pulse">
                <Percent className="w-4 h-4" />
                Ramadan Sale is Live Now 2026
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Save Big with <br className="md:hidden"/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-orange-400">
                Ramadan Sale 2026
              </span>
            </h1>
            
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
              We track the biggest price drops across Amazon.ae and Noon. Use the codes below for extra discounts at checkout.
            </p>

            {/* Coupon Codes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              {/* ADCB */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors">
                <span className="text-[10px] text-indigo-200 font-bold uppercase mb-1 tracking-widest">ADCB Cards</span>
                <div className="text-2xl font-black text-white mb-2">30% OFF</div>
                <div className="bg-white text-[#4b0082] px-3 py-1 rounded border border-dashed border-[#4b0082] text-sm font-mono font-bold select-all cursor-pointer">
                  Code: ADCB150
                </div>
              </div>
              
              {/* Prime */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors">
                <span className="text-[10px] text-amber-200 font-bold uppercase mb-1 tracking-widest">Prime Members</span>
                <div className="text-2xl font-black text-white mb-2">Extra 15%</div>
                <div className="bg-amber-400 text-[#4b0082] px-3 py-1 rounded border border-dashed border-[#4b0082] text-sm font-mono font-bold select-all cursor-pointer">
                  Code: SAVE15
                </div>
              </div>

              {/* New User */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors">
                <span className="text-[10px] text-green-200 font-bold uppercase mb-1 tracking-widest">First Order</span>
                <div className="text-2xl font-black text-white mb-2">Flat 10%</div>
                <div className="bg-green-400 text-[#064e3b] px-3 py-1 rounded border border-dashed border-[#064e3b] text-sm font-mono font-bold select-all cursor-pointer">
                  Code: NEW10
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="container mx-auto px-4 max-w-7xl py-10 relative z-20">
          <DealsFeed initialDeals={deals} />
        </div>

        {/* FOOTER NOTE */}
        <div className="container mx-auto px-4 max-w-4xl mt-12 text-center">
          <p className="text-slate-400 text-xs leading-relaxed">
            <strong>Transparency:</strong> TopTenUAE is a participant in the Amazon Services LLC Associates Program.
            Prices and availability are subject to change. Verified as of 2026.
          </p>
        </div>

      </div>
    </Suspense>
  );
}