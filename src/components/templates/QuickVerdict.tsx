
import { ArrowRight, Star, Trophy } from "@/components/icons";

interface QuickPick {
  rank: number;
  tag: string;
  title: string;
  rating?: number;
  priceEstimate?: string;
  imageUrl: string;
  imageAlt?: string;
  affiliateLink?: string;
  bestFor?: string;
  whySelected?: string;
  limitation?: string;
}

export default function QuickVerdict({ picks, category, showRationale = false }: { picks: QuickPick[]; category?: string; showRationale?: boolean }) {
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
              {showRationale ? 'Best picks by buyer need' : 'Top 3 Shortlist'}
            </h2>
            <p className="text-base font-medium text-gray-500 mt-0.5">
              {showRationale
                ? 'A concise shortlist with the buyer fit, reason and main trade-off for each recommendation.'
                : 'Start with these picks, then check the trade-offs below.'}
            </p>
          </div>
        </div>

      {/* Grid Layout */}
      <div className={`grid grid-cols-1 ${picks.length >= 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : picks.length === 3 ? 'md:grid-cols-3' : picks.length === 2 ? 'sm:grid-cols-2' : ''} divide-y lg:divide-y-0 lg:divide-x divide-gray-100`}>
        {picks.map((pick, index) => {
          return (
            <div key={index} className="flex flex-col h-full group relative">
              
              {/* --- FIX 1 & 2: Uniform Height & Primary Color --- */}
              {/* min-h-[4rem] ensures alignment even if text breaks to 2 lines */}
              <div className="bg-primary text-white text-base font-bold uppercase tracking-wider px-4 py-2 text-center min-h-16 flex items-center justify-center">
                {pick.tag}
              </div>

              <div className="p-4 flex flex-col flex-1 min-w-0 break-words">
                
                {/* Product Title */}
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-4 min-h-14 shrink-0">
                   {pick.title}
                </h3>

                {showRationale && (pick.bestFor || pick.whySelected || pick.limitation) && (
                  <div className="mb-4 space-y-3 text-sm leading-relaxed text-slate-700">
                    {pick.bestFor && <p><strong className="text-slate-900">Best for:</strong> {pick.bestFor}</p>}
                    {pick.whySelected && <p><strong className="text-slate-900">Why selected:</strong> {pick.whySelected}</p>}
                    {pick.limitation && <p><strong className="text-slate-900">Skip if:</strong> {pick.limitation}</p>}
                  </div>
                )}

                {pick.imageUrl && <div className="relative w-full h-40 mb-4 flex items-center justify-center">
                  <img src={pick.imageUrl} alt={pick.imageAlt || pick.title} className="absolute inset-0 w-full h-full object-contain" loading="lazy" />
                </div>}

                {/* Rating & Price */}
                <div className="mt-auto space-y-4">
                   <div className="flex items-center justify-between">
                      {pick.rating ? <div className="flex text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm font-bold text-gray-700">{pick.rating}/5</span>
                      </div> : <span />}
                      {pick.priceEstimate && (
                        <div className="text-sm font-bold text-gray-900">
                           {pick.priceEstimate}
                        </div>
                      )}
                   </div>

                   {/* Never emit a tracked affiliate CTA with a placeholder URL. */}
                   {pick.affiliateLink && (
                     <a
                       href={pick.affiliateLink}
                       data-affiliate-product={pick.title}
                       data-affiliate-cta="quick_picks"
                       data-affiliate-category={category}
                       data-affiliate-position={pick.rank}
                       target="_blank"
                       rel="nofollow sponsored noopener noreferrer"
                       className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-95"
                     >
                       Check latest price on Amazon.ae <ArrowRight className="w-4 h-4 inline ml-1" />
                     </a>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
