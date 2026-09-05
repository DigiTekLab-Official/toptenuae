// src/components/templates/ComparisonSummaryTable.tsx


import { ExternalLink, ShieldCheck, Minus } from "@/components/icons";
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

// Use the category's CMS specifications in their editorial order, capped for scanning.
const decisionDetails = (product: Product): DecisionDetail[] => {
  const specs = (product.specifications || [])
    .filter(spec => spec.specLabel && spec.specValue)
    .slice(0, 4).map(spec => ({ label: spec.specLabel!, value: spec.specValue! }));
  return specs.length ? specs : (product.keyFeatures || []).slice(0, 4)
    .map((value, index) => ({ label: `Feature ${index + 1}`, value }));
};

export default function ComparisonSummaryTable({ items, category }: { items: ListItem[]; category?: string }) {
  if (!items || items.length === 0) return null;
  const quickItems = items.filter(item => item?.product?.title);
  if (!quickItems.length) return null;

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
          One accessible table for desktop and mobile
          ======================== */}
      <div className="max-w-full overflow-x-auto border border-gray-200 shadow-sm rounded-lg focus-visible:outline-2 focus-visible:outline-primary" tabIndex={0} role="region" aria-label="Product comparison — scroll horizontally">
        <table className="w-full min-w-[760px] text-left border-collapse">
          {/* ✅ UPDATED: Used bg-primary instead of #4b0082 */}
          <thead className="bg-primary text-white text-sm uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-3 py-4 font-bold">Product</th>
              <th scope="col" className="px-3 py-4 font-bold">Best for</th>
              <th scope="col" className="px-3 py-4 font-bold">Key details</th>
              <th scope="col" className="px-3 py-4 font-bold">Price tier</th>
              <th scope="col" className="px-3 py-4 font-bold">Main compromise</th>
              <th scope="col" className="px-3 py-4 font-bold text-center">Amazon.ae</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {quickItems.map((item) => {
              const product = item.product || {};
              // ✅ FIX: Use direct URL
              const imageUrl = product.mainImage?.url || null;
              const title = product.title || "Product Name Unavailable";
              const details = decisionDetails(product);

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
                        rel="nofollow sponsored noopener noreferrer"
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

    </div>
  );
}
