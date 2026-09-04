// src/components/templates/ComparisonSummaryTable.tsx


import { ExternalLink, ShieldCheck, Star, Minus } from "@/components/icons";
// 🗑️ DELETED: listImage import (We use direct URL from query)

// --- 1. UPDATED INTERFACES ---
interface Product {
  title: string;
  // ✅ UPDATE: Matches the GROQ query structure
  mainImage?: { url: string; alt?: string }; 
  affiliateLink?: string;
  retailer?: string;
  customerRating?: number;
  priceTier?: string;
  keyFeatures?: string[];
  cons?: string[];
  specifications?: { specLabel?: string; specValue?: string }[];
}

interface ListItem {
  _key: string;
  rank: number;
  badgeLabel?: string;
  skipIf?: string;
  product: Product;
}

interface DecisionDetail { label: string; value: string }

const findDetail = (product: Product, patterns: RegExp[]) => {
  const spec = (product.specifications || []).find(({ specLabel, specValue }) =>
    patterns.some((pattern) => pattern.test(`${specLabel || ''} ${specValue || ''}`))
  );
  if (spec?.specValue) return spec.specValue;

  return (product.keyFeatures || []).find((detail) =>
    patterns.some((pattern) => pattern.test(detail))
  ) || 'Not stated';
};

const householdSize = (capacity: string) => {
  if (/dual/i.test(capacity)) return 'Larger households / two-part meals';
  const litres = Number(capacity.match(/(\d+(?:\.\d+)?)\s*l/i)?.[1]);
  if (!litres) return 'Check usable basket area';
  if (litres <= 5) return 'Usually 1–2 people';
  if (litres <= 7) return 'Usually 3–4 people';
  return 'Usually larger households';
};

const decisionDetails = (product: Product, category?: string): DecisionDetail[] => {
  if (category === 'electric_shaver') {
    return [
      { label: 'Shaver type', value: findDetail(product, [/foil/i, /rotary/i]) },
      { label: 'Wet / dry', value: findDetail(product, [/wet/i, /dry/i, /waterproof/i, /water resistant/i]) },
      { label: 'Head / blades', value: findDetail(product, [/blade/i, /head/i, /element/i]) },
    ];
  }
  if (category === 'beard_trimmer') {
    return [
      { label: 'Length range', value: findDetail(product, [/length/i, /setting/i, /\bmm\b/i]) },
      { label: 'Attachments', value: findDetail(product, [/attachment/i, /comb/i, /piece/i]) },
      { label: 'Waterproofing', value: findDetail(product, [/waterproof/i, /water resistant/i, /washable/i, /shower/i]) },
    ];
  }
  if (category === 'air_fryer') {
    const capacity = findDetail(product, [/capacity/i, /\d+(?:\.\d+)?\s*l\b/i, /dual/i]);
    return [
      { label: 'Capacity', value: capacity },
      { label: 'Basket type', value: findDetail(product, [/basket/i, /drawer/i, /dual/i]) },
      { label: 'Household fit', value: householdSize(capacity) },
      { label: 'Key feature', value: findDetail(product, [/window/i, /heating/i, /programme/i, /program/i, /technology/i]) },
    ];
  }
  if (category === 'laptop') {
    return [
      { label: 'Processor', value: findDetail(product, [/processor/i, /intel core/i, /ryzen/i, /apple m\d/i, /snapdragon/i]) },
      { label: 'RAM', value: findDetail(product, [/\bram\b/i, /memory/i]) },
      { label: 'Storage', value: findDetail(product, [/storage/i, /\bssd\b/i]) },
      { label: 'Display', value: findDetail(product, [/display/i, /screen/i, /oled/i, /resolution/i]) },
    ];
  }
  if (category === 'baby_monitor') {
    return [
      { label: 'Connection', value: findDetail(product, [/non.?wi.?fi/i, /wi.?fi/i, /hybrid/i, /local/i]) },
      { label: 'Viewing', value: findDetail(product, [/screen/i, /display/i, /app/i, /phone/i]) },
      { label: 'Range / privacy', value: findDetail(product, [/range/i, /privacy/i, /encrypted/i, /local/i, /cloud/i]) },
    ];
  }
  if (category === 'coffee_maker') {
    return [
      { label: 'Machine type', value: findDetail(product, [/machine type/i, /bean.to.cup/i, /capsule/i, /drip filter/i, /manual pump/i, /semi.automatic/i]) },
      { label: 'Coffee format', value: findDetail(product, [/coffee format/i, /whole bean/i, /ground coffee/i, /capsule/i, /ese pod/i]) },
      { label: 'Milk system', value: findDetail(product, [/milk system/i, /milk frother/i, /steam wand/i, /lattecrema/i]) },
      { label: 'Water tank', value: findDetail(product, [/water tank/i, /\d+(?:\.\d+)?\s*l\b/i]) },
      { label: 'Footprint', value: findDetail(product, [/footprint/i, /dimensions/i, /\d+(?:\.\d+)?\s*[×x]\s*\d/i]) },
      { label: 'Cleaning', value: findDetail(product, [/cleaning effort/i, /cleaning/i, /rinse/i, /dishwasher/i]) },
    ];
  }
  return [
    { label: 'Key feature', value: product.keyFeatures?.[0] || 'Not stated' },
    { label: 'Also consider', value: product.keyFeatures?.[1] || 'Not stated' },
  ];
};

export default function ComparisonSummaryTable({ items, category }: { items: ListItem[]; category?: string }) {
  if (!items || items.length === 0) return null;
  const quickItems = items;

  return (
    <div className="my-12 font-sans">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
           <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
           <h2 className="text-xl font-bold text-gray-900">Quick picks: compare before you buy</h2>
           <p className="text-sm text-gray-500">The strongest use case and main compromise for each leading option.</p>
        </div>
      </div>

      {/* ========================
          DESKTOP VIEW (Hidden on Mobile)
          ======================== */}
      <div className="hidden md:block overflow-hidden border border-gray-200 shadow-sm rounded-lg">
        <table className="w-full text-left border-collapse">
          {/* ✅ UPDATED: Used bg-primary instead of #4b0082 */}
          <thead className="bg-primary text-white text-sm uppercase tracking-wider">
            <tr>
              <th className="px-3 py-4 font-bold">Product</th>
              <th className="px-3 py-4 font-bold">Best for</th>
              <th className="px-3 py-4 font-bold">Key details</th>
              <th className="px-3 py-4 font-bold">Price tier</th>
              <th className="px-3 py-4 font-bold">Main compromise</th>
              <th className="px-3 py-4 font-bold text-center">Amazon.ae</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {quickItems.map((item) => {
              const product = item.product || {};
              // ✅ FIX: Use direct URL
              const imageUrl = product.mainImage?.url || null;
              const title = product.title || "Product Name Unavailable";
              const details = decisionDetails(product, category);

              return (
                <tr key={item._key || item.rank} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-3 py-4 font-bold text-gray-900 leading-snug">
                    <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white flex items-center justify-center">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt="" 
                          className="absolute inset-0 w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 text-center">No Image</span>
                      )}
                    </div>
                    <span><span className="text-primary">#{item.rank}</span> {title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                     {item.badgeLabel ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary border border-primary-100">
                        {item.badgeLabel}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs italic">-</span>
                    )}
                  </td>
                  
                  <td className="px-3 py-4 text-sm text-gray-700">
                    <dl className="space-y-1.5">
                      {details.map((detail) => (
                        <div key={detail.label}>
                          <dt className="inline font-bold text-gray-900">{detail.label}: </dt>
                          <dd className="inline">{detail.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </td>
                  <td className="px-3 py-4 text-sm font-semibold text-gray-700">{product.priceTier || 'Not stated'}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{item.skipIf || product.cons?.[0] || 'Not stated'}</td>

                  <td className="px-3 py-4 text-center">
                    {product.affiliateLink ? (
                      <a 
                        href={product.affiliateLink} 
                        data-affiliate-product={title}
                        data-affiliate-cta="comparison_table"
                        data-affiliate-category={category}
                        data-affiliate-position={item.rank}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        // Amazon Yellow (#FFD814) replaced with Tailwind standard 'bg-yellow-400'
                        className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm px-4 py-2 rounded-lg shadow-sm transition-transform active:scale-95 whitespace-nowrap"
                      >
                        Check price <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic flex justify-center gap-1"><Minus className="w-3 h-3"/> Unavailable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================
          MOBILE CARD VIEW (Visible only on Mobile)
          ======================== */}
      <div className="md:hidden space-y-4">
        {quickItems.map((item) => {
          const product = item.product || {};
          // ✅ FIX: Use direct URL
          const imageUrl = product.mainImage?.url || null;
          const title = product.title || "Product Name Unavailable";
          const details = decisionDetails(product, category);

          return (
            <div 
              key={item._key || item.rank} 
              // ✅ UPDATED: Border primary
              className="bg-white border border-gray-200 border-l-4 border-l-primary rounded-xl shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-start gap-3">
                 {/* ✅ UPDATED: bg-primary */}
                 <span className="bg-primary text-white font-black text-sm w-8 h-8 flex items-center justify-center rounded-lg shadow-sm shrink-0">
                    #{item.rank}
                 </span>
                 <h4 className="font-bold text-gray-900 leading-tight">
                    {title}
                 </h4>
              </div>

              <div className="p-4 flex items-center gap-4">
                 <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                   {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-contain p-2"
                      />
                   ) : (
                      <span className="text-xs text-gray-400 text-center">No Image</span>
                   )}
                 </div>
                 
                 <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between items-start">
                        {item.badgeLabel && (
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-0.5">Award</span>
                            <span className="text-xs font-bold text-primary bg-primary-50 px-2 py-1 rounded-md w-fit">
                            {item.badgeLabel}
                            </span>
                        </div>
                        )}
                        {/* Mobile Rating */}
                        {product.customerRating && (
                             <div className="flex flex-col items-end">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-0.5">Rating</span>
                                <span className="text-sm font-bold text-gray-900 flex items-center">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1"/> {product.customerRating}
                                </span>
                             </div>
                        )}
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                      {details.map((detail) => (
                        <div key={detail.label}><dt className="font-bold text-gray-900">{detail.label}</dt><dd>{detail.value}</dd></div>
                      ))}
                      <div><dt className="font-bold text-gray-900">Price tier</dt><dd>{product.priceTier || 'Not stated'}</dd></div>
                      <div><dt className="font-bold text-gray-900">Main compromise</dt><dd>{item.skipIf || product.cons?.[0] || 'Not stated'}</dd></div>
                    </dl>
                    
                    {product.affiliateLink && (
                       <a 
                          href={product.affiliateLink}
                          data-affiliate-product={title}
                          data-affiliate-cta="comparison_table"
                          data-affiliate-category={category}
                          data-affiliate-position={item.rank}
                          target="_blank"
                          rel="nofollow sponsored noopener"
                          className="mt-1 w-full flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold text-sm py-2 rounded-lg shadow-sm hover:bg-yellow-500"
                       >
                          Check latest price on Amazon.ae <ExternalLink className="w-3 h-3" />
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
