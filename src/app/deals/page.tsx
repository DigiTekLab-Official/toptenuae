import { client } from '@/sanity/lib/client';
import DealsFeed from '@/components/deals/DealsFeed';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ALL_DEALS_QUERY } from '@/sanity/lib/queries';
import { Percent } from 'lucide-react';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "Top Deals in UAE | Amazon & Noon Discounts",
  description: "Curated list of the best price drops in UAE. Electronics, Fashion, and Home essentials at up to 70% off.",
};

export const revalidate = 3600;

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
    return await client.fetch(ALL_DEALS_QUERY);
  } catch (error) {
    console.error('Failed to fetch deals:', error);
    return [];
  }
}

// --- Main Component ---
export default async function DealsPage() {
  // 1. Fetch Data
  const deals = await getDeals();

  // 2. ✅ DEFINE SCHEMA HERE (Inside the function, after fetching deals)
  const feedSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Top Deals in UAE",
    "description": "Daily updated discounts for Amazon.ae and Noon.",
    "numberOfItems": deals.length, // Now 'deals' is defined!
    "itemListElement": deals.map((deal: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Offer",
        "name": deal.title,
        "price": deal.dealPrice,
        "priceCurrency": "AED",
        "url": deal.affiliateLink
      }
    }))
  };

  return (
    <Suspense fallback={<DealsLoading />}>
      {/* 3. Inject Schema */}
      <JsonLd data={feedSchema} />

      <div className="min-h-screen bg-slate-50 font-sans pb-20">

        {/* HERO SECTION - SUPER SAVER WEEK CAMPAIGN */}
        <div className="bg-[#4b0082] text-white py-12 px-4 text-center relative overflow-hidden shadow-lg">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto">
            {/* 1. Live Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-400 text-[#4b0082] text-xs font-black uppercase tracking-wider shadow-lg animate-pulse">
                <Percent className="w-4 h-4" />
                🔴 LIVE: Amazon Super Saver Week (Jan 1–7)
              </span>
            </div>
            
            {/* 2. Main Headline */}
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Save Big with <br className="md:hidden"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                Super Saver Week & ADCB
              </span>
            </h1>
            
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
              We track the biggest price drops across Amazon.ae. Use the codes below for extra discounts at checkout.
            </p>

            {/* 3. Coupon Codes Grid (Bank Offers) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              {/* Card 1: ADCB */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors">
                <span className="text-[10px] text-indigo-200 font-bold uppercase mb-1 tracking-widest">ADCB Cards</span>
                <div className="text-2xl font-black text-white mb-2">30% OFF</div>
                <div className="bg-white text-[#4b0082] px-3 py-1 rounded border border-dashed border-[#4b0082] text-sm font-mono font-bold select-all cursor-pointer">
                  Code: ADCB150
                </div>
              </div>
              
              {/* Card 2: Prime */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors">
                <span className="text-[10px] text-amber-200 font-bold uppercase mb-1 tracking-widest">Prime Members</span>
                <div className="text-2xl font-black text-white mb-2">Extra 15%</div>
                <div className="bg-amber-400 text-[#4b0082] px-3 py-1 rounded border border-dashed border-[#4b0082] text-sm font-mono font-bold select-all cursor-pointer">
                  Code: SAVE15
                </div>
              </div>

              {/* Card 3: New User */}
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
            Prices and availability are subject to change.
          </p>
        </div>

      </div>
    </Suspense>
  );
}