
import { ArrowRight, Star, Trophy } from "@/components/icons";

interface QuickPick {
  rank: number;
  tag: string;
  title: string;
  rating: number;
  priceEstimate?: string;
  imageUrl: string;
  affiliateLink?: string;
}

export default function QuickVerdict({ picks, category }: { picks: QuickPick[]; category?: string }) {
  if (!picks || picks.length === 0) return null;

  return (
    <div className="mb-12 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden font-sans">
      
      {/* Table Title Section */}
        <div className="bg-gray-50 p-5 border-b border-gray-200 flex items-center gap-4">
          {/* ✅ FIX: Perfect Color Match (Light Purple BG + Dark Purple Icon) */}
          <div className="p-3 bg-indigo-50 text-primary rounded-xl shadow-sm border border-indigo-100">
            <Trophy className="w-8 h-8 stroke-[2.0px]" />
          </div>
          
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Top 3 Shortlist
            </h2>
            <p className="text-base font-medium text-gray-500 mt-0.5">
              Start with these picks, then check the trade-offs below.
            </p>
          </div>
        </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {picks.map((pick, index) => {
          return (
            <div key={index} className="flex flex-col h-full group relative">
              
              {/* --- FIX 1 & 2: Uniform Height & Primary Color --- */}
              {/* min-h-[4rem] ensures alignment even if text breaks to 2 lines */}
              <div className="bg-primary text-white text-base font-bold uppercase tracking-wider px-4 py-2 text-center min-h-16 flex items-center justify-center">
                {pick.tag}
              </div>

              <div className="p-6 flex flex-col flex-1">
                
                {/* Product Title */}
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-4 min-h-14 shrink-0">
                   {pick.title}
                </h3>

                {/* Clickable Image */}
                <div className="relative w-full h-40 mb-4 flex items-center justify-center">
                   {pick.imageUrl ? (
                     <img 
                       src={pick.imageUrl} 
                       alt={pick.title} 
                       className="absolute inset-0 w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                       loading="lazy"
                     />
                   ) : (
                     <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 text-xs">No Image</div>
                   )}
                </div>

                {/* Rating & Price */}
                <div className="mt-auto space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm font-bold text-gray-700">{pick.rating}/5</span>
                      </div>
                      {pick.priceEstimate && (
                        <div className="text-sm font-bold text-gray-900">
                           {pick.priceEstimate}
                        </div>
                      )}
                   </div>

                   {/* --- FIX 3: Blue Button --- */}
                   <a 
                     href={pick.affiliateLink || "#"}
                     data-affiliate-product={pick.title}
                     data-affiliate-cta="quick_picks"
                     data-affiliate-category={category}
                     data-affiliate-position={pick.rank}
                     target="_blank"
                     rel="nofollow sponsored noopener"
                     className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-95"
                   >
                     Check latest price on Amazon.ae <ArrowRight className="w-4 h-4 inline ml-1" />
                   </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
