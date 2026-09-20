import { parseAmazonAffiliateDestination } from '@/lib/affiliate/click-tracking.js';

interface PurchaseItem {
  _key: string;
  rank: number;
  badgeLabel?: string;
  product: {
    _type?: string;
    title: string;
    heroFeature?: string;
    affiliateLink?: string;
  };
}

// Uses the same ordered CMS references and destinations as the full cards.
export default function BudgetLaptopPurchaseOptions({ items, category }: {
  items: PurchaseItem[];
  category?: string;
}) {
  const options = items.filter(({ product }) => product._type === 'product'
    && product.affiliateLink && parseAmazonAffiliateDestination(product.affiliateLink));
  if (!options.length) return null;

  return (
    <section className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4" aria-labelledby="budget-purchase-heading">
      <h2 id="budget-purchase-heading" className="text-lg font-black text-primary">Choose by your workload</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-700">Check the current price, configuration and seller terms before buying.</p>
      <ul className="mt-3 divide-y divide-indigo-200">
        {options.map(({ _key, rank, badgeLabel, product }) => (
          <li key={_key} className="py-3 first:pt-0 last:pb-0">
            <h3 className="font-bold leading-snug text-slate-900">{product.title}</h3>
            {(badgeLabel || product.heroFeature) && <p className="mt-1 text-sm text-slate-700">{badgeLabel || product.heroFeature}</p>}
            <a href={product.affiliateLink} data-affiliate-product={product.title}
              data-affiliate-cta="quick_picks" data-affiliate-category={category} data-affiliate-position={rank}
              target="_blank" rel="nofollow sponsored noopener noreferrer"
              className="mt-2 block rounded-lg bg-blue-600 px-4 py-3 text-center font-bold text-white hover:bg-blue-700">
              Check exact model on Amazon.ae
            </a>
            <a href={`#item-${rank}`} className="mt-2 inline-block text-sm font-semibold text-primary underline">Read fit and limitations</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
