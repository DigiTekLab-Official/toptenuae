import { 
  CheckCircle2, 
  XCircle, 
  ShoppingCart, 
  ExternalLink, 
  Star, 
  ShieldCheck,
  Zap,
  Tag,
  Info,
  Settings // ✅ Imported for Specs
} from "@/components/icons";
import PortableText from '@/components/sanity/PortableText';

interface ProductTemplateProps {
  data: any;
}

export default function ProductTemplate({ data }: ProductTemplateProps) {
  const {
    title,
    mainImage,
    affiliateLink,
    retailer,
    price,
    currency = 'AED',
    priceTier,
    availabilityStatus,
    availabilityCheckedAt,
    customerRating,
    ratingCount,
    realComplaint,
    verdict,
    customVerdict,
    keyFeatures,
    specifications, // ✅ Destructured
    pros,
    cons,
    itemDescription,
    brand
  } = data;

  const pickingReason = customVerdict || verdict;
  const isUnavailable = availabilityStatus === 'unavailable';
  const availabilityMessage = `Currently unavailable on Amazon.ae — checked ${availabilityCheckedAt || 'date not recorded'}`;

  return (
    <article className="font-sans bg-slate-50 min-h-screen pb-24 lg:pb-20"> 
      
      {/* --- 1. HERO HEADER --- */}
      <div className="bg-[#4b0082] relative overflow-hidden text-white pt-12 pb-32 px-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          {brand && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-bold uppercase tracking-widest">{brand}</span>
            </div>
          )}
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 max-w-4xl tracking-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-purple-100 font-medium">
             {customerRating && (
               <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                 <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                 <span className="text-white font-bold">{customerRating}</span>
                 <span className="text-sm opacity-70">/ 5</span>
                 {ratingCount && <span className="text-sm opacity-70 border-l border-white/20 pl-2 ml-1">{ratingCount} Reviews</span>}
               </div>
             )}
             {priceTier && (
               <div className="flex items-center gap-1 px-3 py-1.5">
                  <Tag className="w-4 h-4 text-amber-300" />
                  <span>{priceTier} Tier</span>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* --- 2. MAIN CONTENT GRID --- */}
      <div className="container mx-auto max-w-7xl px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Image & Review (Span 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Product Image */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex items-center justify-center relative overflow-hidden group">
                <div className="w-full h-75 md:h-125 p-8 flex items-center justify-center relative">
                  {mainImage?.url ? (
                    <img
                      src={mainImage.url}
                      alt={title || "Product image"}
                      className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                      loading="eager"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                      <ShoppingCart size={64} />
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 bg-linear-to-bl from-amber-400 to-orange-500 text-white px-6 py-2 rounded-bl-3xl font-bold shadow-lg z-10">
                   Editor's Review
                </div>
            </div>

            {/* Pros & Cons */}
            {(pros?.length > 0 || cons?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pros?.length > 0 && (
                  <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" /> The Good
                    </h3>
                    <ul className="space-y-3">
                      {pros.map((pro: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-base text-emerald-900/80">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cons?.length > 0 && (
                  <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100">
                    <h3 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-500" /> Watch Out
                    </h3>
                    <ul className="space-y-3">
                      {cons.map((con: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-base text-rose-900/80">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* ✅ NEW: Technical Specifications Table */}
            {specifications && specifications.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-600" /> Technical Specifications
                </h3>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-slate-100">
                      {specifications.map((spec: any, i: number) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                          <td className="px-4 py-3 font-semibold text-slate-700 w-1/3 md:w-1/4 align-top">
                            {spec.specLabel}
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-medium">
                            {spec.specValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Description (In-Depth Review) */}
            {itemDescription && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                 <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">In-Depth Review</h2>
                 <div className="prose prose-slate prose-lg max-w-none">
                   <PortableText value={itemDescription} />
                 </div>
              </div>
            )}

            {/* Why We Picked This */}
            {pickingReason && (
              <div className="mb-4 p-4 bg-slate-100 rounded-xl border border-slate-300 border-l-4 border-l-slate-600 mt-8">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="w-3 h-3 text-[#4b0082]" />
                  <h3 className="text-sm font-bold text-[#4b0082] uppercase tracking-widest">Why we picked this</h3>
                </div>
                <p className="text-sm text-slate-900 font-semibold leading-relaxed italic">"{pickingReason}"</p>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* DESKTOP ONLY BUY BOX */}
            <div className="hidden lg:block bg-white rounded-3xl p-6 shadow-xl border border-slate-200 sticky top-24 z-30">
              <div className="text-center mb-6">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Price
                </span>

                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {priceTier ? `${priceTier} Tier` : 'Live price'}
                </span>
                <span className="block text-sm font-medium text-slate-500 mt-1">
                  Check live price on {retailer || 'Amazon.ae'}
                </span>
              </div>

              {isUnavailable ? (
                <p className="text-center text-sm font-semibold text-slate-700 mb-4">{availabilityMessage}</p>
              ) : affiliateLink && (
                <a
                  href={affiliateLink}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="group flex items-center justify-center gap-2 w-full bg-[#0071e3] hover:bg-[#0076df] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 hover:shadow-xl text-lg mb-4"
                >
                  View on {retailer || 'Amazon'}
                  <ExternalLink className="w-5 h-5 opacity-80" />
                </a>
              )}
              
              <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-500 leading-relaxed text-center border border-slate-100">
                <ShieldCheck className="w-3 h-3 mx-auto mb-1 text-slate-400" />
                Secure transaction via {retailer || 'Amazon'}. We may earn a commission.
              </div>
            </div>

            {/* Key Specs Widget */}
            {keyFeatures?.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Zap className="w-5 h-5 text-purple-600" /> Key Features
                </h3>
                <ul className="space-y-3">
                  {keyFeatures.map((feature: string, i: number) => (
                    <li key={i} className="text-base text-slate-600 font-medium flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Real Complaint Widget */}
            {realComplaint && (
              <div className="bg-red-50 rounded-3xl p-6 border border-red-100">
                 <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                   <Info className="w-4 h-4" /> Real User Feedback
                 </h3>
                 <p className="text-red-800/90 text-sm italic leading-relaxed">
                   "{realComplaint}"
                 </p>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* MOBILE ONLY STICKY BOTTOM BAR */}
      {isUnavailable ? (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 safe-area-pb text-center">
          <p className="text-sm font-semibold text-slate-700">{availabilityMessage}</p>
        </div>
      ) : affiliateLink && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between gap-4 safe-area-pb">
           <div className="flex flex-col">
              <span className="text-sm text-gray-500 uppercase font-bold">Price</span>
              <span className="text-base font-black text-gray-900">
                 {priceTier ? `${priceTier} Tier` : 'Check on Amazon'}
              </span>
           </div>
           <a
             href={affiliateLink}
             target="_blank"
             rel="nofollow sponsored noopener"
             className="bg-[#0071e3] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-[#0076df] active:scale-95 transition-transform flex items-center gap-2"
           >
             View on {retailer || 'Amazon'}
             <ExternalLink className="w-4 h-4" />
           </a>
        </div>
      )}

    </article>
  );
}