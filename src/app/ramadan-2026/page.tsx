import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import DealsFeed from '@/components/deals/DealsFeed';
import CountdownTimer from '@/components/deals/CountdownTimer';

// --- CONFIGURATION ---
// Revalidate data every 60 seconds. 
// Change to 0 if you want instant updates during development.
export const revalidate = 60; 

// --- 1. SEO METADATA GENERATOR ---
export async function generateMetadata(): Promise<Metadata> {
  const eventQuery = `*[_type == "holiday" && title match "Ramadan" && status == "scheduled"][0].startDate`;
  const startDate = await client.fetch(eventQuery) || '2026-02-17';
  
  const dateStr = new Date(startDate).toLocaleDateString('en-AE', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  return {
    title: 'Ramadan 2026 UAE: Expected Dates, Iftar Deals & Prayer Times',
    description: `Complete guide to Ramadan 2026 in Dubai & Abu Dhabi. Expected start: ${dateStr}. Discover exclusive Iftar buffets, Suhoor deals, and Eid shopping offers.`,
    alternates: {
      canonical: 'https://toptenuae.com/ramadan-2026',
    },
    openGraph: {
      title: 'Ramadan 2026 UAE - The Ultimate Guide',
      description: `Countdown to Ramadan 2026 (Expected ${dateStr}). Best Iftar deals and shopping offers in UAE.`,
      images: [{ url: '/images/ramadan-2026-og.jpg', width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

// --- 2. DATA FETCHING ---
async function getData() {
  // A. Fetch the Ramadan Event (Start Date)
  // Ensure your Sanity document has 'Event Status' set to 'Scheduled (Normal)'
  const eventQuery = `*[_type == "holiday" && title match "Ramadan" && status == "scheduled"][0] {
    startDate,
    title
  }`;

  // B. Fetch Deals tagged "ramadan-2026"
  const dealsQuery = `*[_type == "deal" && isActive == true && "ramadan-2026" in tags] | order(dealEndDate asc) {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    dealPrice,
    originalPrice,
    discountPercentage,
    couponCode,
    couponNote,
    isPrimeExclusive,
    dealEndDate,
    // Handle image fallback: Use deal image OR product image
    "image": coalesce(image.asset->url, product->mainImage.asset->url),
    // Handle category fallback: Use string or stringify object title
    "category": coalesce(category, "Ramadan Deal"), 
    affiliateLink,
    description,
    rating
  }`;

  const [eventData, dealsData] = await Promise.all([
    client.fetch(eventQuery),
    client.fetch(dealsQuery)
  ]);

  // --- DEBUGGING LOGS ---
  // Check your VS Code Terminal to see these outputs
  console.log("--- RAMADAN PAGE DEBUG ---");
  console.log("Event Data Found:", eventData ? "YES" : "NO");
  if (eventData) console.log("Start Date:", eventData.startDate);
  console.log("Deals Found:", dealsData.length);
  console.log("--------------------------");

  return { eventData, dealsData };
}

// --- 3. MAIN PAGE COMPONENT ---
export default async function RamadanPage() {
  const { eventData, dealsData } = await getData();

  // Fallback Logic: If Sanity has no data, use the estimated date to prevent crash
  const ramadanStart = eventData?.startDate || '2026-02-17T00:00:00Z';

  return (
    <main className="bg-slate-50 min-h-screen pb-20">
      
      {/* --- HERO SECTION --- */}
      <div className="relative bg-gradient-to-b from-[#2E0249] to-[#4b0082] text-white min-h-[600px] flex flex-col justify-center overflow-hidden z-0">
        
        {/* Background Pattern & Stars */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-yellow-200 opacity-40 animate-pulse">✦</div>
          <div className="absolute bottom-20 right-10 text-yellow-200 opacity-40 animate-pulse">✦</div>
          <div className="absolute inset-0 opacity-10 bg-black/20" /> 
        </div>

        {/* THE MOON ANIMATION */}
        <div className="absolute top-10 right-4 md:right-20 md:top-16 opacity-90 z-0">
           <div className="relative w-32 h-32 md:w-48 md:h-48 animate-bounce [animation-duration:3s]">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-amber-400 rounded-full blur-[40px] opacity-30"></div>
              
              {/* Crescent SVG */}
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-full h-full text-amber-400 drop-shadow-2xl"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
           </div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 text-center z-10 pt-12">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-amber-300 text-sm font-bold tracking-wider mb-6">
            RAMADAN KAREEM 2026
          </span>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Ramadan 2026 <br />
            <span className="text-amber-400">Exclusive Deals</span>
          </h1>
          
          <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-10">
            Your ultimate guide to Iftar buffets, Suhoor gatherings, and Eid shopping discounts across UAE.
          </p>

          {/* Countdown Timer */}
          <div className="inline-block bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <span className="block text-xs font-semibold uppercase tracking-widest text-purple-200 mb-4">
              Countdown to First Iftar
            </span>
            <CountdownTimer endDate={ramadanStart} />
          </div>
        </div>
      </div>

      {/* --- DEALS FEED SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
          <div className="mb-8 border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-800">Top Trending Deals</h2>
            <p className="text-slate-500">Hand-picked discounts updated daily.</p>
          </div>
          
          {/* Passes the fetched deals to your Client Component */}
          <DealsFeed initialDeals={dealsData} />
        </div>
      </div>

    </main>
  );
}