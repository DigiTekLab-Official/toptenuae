import { ExternalLink, ShieldCheck } from '@/components/icons';
import { getAmazonUaeAsin } from '@/lib/affiliate/amazon-asin';

interface DecisionProductValue {
  _key?: string;
  path?: 'windows' | 'mac';
  role?: string;
  title?: string;
  configuration?: string;
  bestFor?: string;
  limitation?: string;
  seller?: string;
  fulfilment?: string;
  keyboard?: string;
  warranty?: string;
  charger?: string;
  asin?: string;
  affiliateLink?: string;
  availabilityStatus?: string;
  offerCheckedAt?: string;
  ctaLabel?: string;
  product?: {
    title?: string;
    asin?: string;
    affiliateLink?: string;
    availabilityStatus?: string;
    availabilityCheckedAt?: string;
  };
}

const formatDate = (value?: string) => {
  if (!value) return 'Date not recorded';
  try {
    return new Intl.DateTimeFormat('en-AE', {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Dubai',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export default function DecisionProductCard({ value }: { value: DecisionProductValue }) {
  const title = value.title || value.product?.title || 'Laptop configuration';
  const asin = value.asin || value.product?.asin;
  const affiliateLink = value.affiliateLink || value.product?.affiliateLink;
  const status = value.availabilityStatus || value.product?.availabilityStatus;
  const checkedAt = value.offerCheckedAt || value.product?.availabilityCheckedAt;
  const linkedAsin = getAmazonUaeAsin(affiliateLink || '');
  const isOrderable = status === 'available' && Boolean(asin && linkedAsin === asin);
  const pathLabel = value.path === 'mac' ? 'Mac path' : 'Windows path';
  const pathClasses = value.path === 'mac'
    ? 'border-slate-300 bg-slate-50 text-slate-800'
    : 'border-blue-200 bg-blue-50 text-blue-900';

  return (
    <section className="not-prose my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-affiliate-product={title}>
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${pathClasses}`}>{pathLabel}</span>
          {value.role && <span className="text-sm font-bold text-slate-600">{value.role}</span>}
        </div>

        <h3 className="mt-3 text-xl font-black leading-tight text-slate-950 md:text-2xl">{title}</h3>
        {value.configuration && <p className="mt-2 font-semibold leading-relaxed text-slate-700">{value.configuration}</p>}

        <dl className="mt-5 grid gap-4 md:grid-cols-2">
          {value.bestFor && <div><dt className="text-xs font-black uppercase tracking-wider text-emerald-700">Best for</dt><dd className="mt-1 text-sm leading-relaxed text-slate-700">{value.bestFor}</dd></div>}
          {value.limitation && <div><dt className="text-xs font-black uppercase tracking-wider text-rose-700">Key limitation</dt><dd className="mt-1 text-sm leading-relaxed text-slate-700">{value.limitation}</dd></div>}
        </dl>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-amber-950"><ShieldCheck className="h-4 w-4" /> UAE offer checks</div>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-700">
            {value.seller && <li><strong>Seller:</strong> {value.seller}</li>}
            {value.fulfilment && <li><strong>Fulfilment:</strong> {value.fulfilment}</li>}
            {value.keyboard && <li><strong>Keyboard:</strong> {value.keyboard}</li>}
            {value.warranty && <li><strong>Warranty:</strong> {value.warranty}</li>}
            {value.charger && <li><strong>Charger/plug:</strong> {value.charger}</li>}
          </ul>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-slate-600">Offer checked {formatDate(checkedAt)}</p>
          {isOrderable ? (
            <a
              href={affiliateLink}
              data-affiliate-product={title}
              data-affiliate-cta="decision_product"
              data-affiliate-position={value.role || value.path || 'editorial'}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-center font-black text-white transition hover:bg-primary-700"
            >
              {value.ctaLabel || `Check exact ${value.path === 'mac' ? 'MacBook' : 'Windows'} configuration`}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">No active purchase path for this exact offer.</p>
          )}
        </div>
      </div>
    </section>
  );
}
