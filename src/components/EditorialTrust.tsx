import { Children } from 'react';
import PortableText from '@/components/sanity/PortableText';

const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat('en-AE', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dubai'}).format(new Date(value))
  : '';

export default function EditorialTrust({data, section = "all"}: {data: any; section?: "all" | "metadata" | "audience" | "context" | "methodology" | "sources"}) {
  const reviewedAt = data.lastReviewedAt;
  const updatedAt = reviewedAt ? undefined : data._updatedAt;
  const methodology = data.testingMethodology || data.methodology;
  const sources = Array.isArray(data.sources) ? data.sources.filter((source: any) => source?.title && source?.url) : [];
  const uaeCommerce = data.uaeCommerce;

  const show = (name: typeof section) => section === "all" || section === name;

  const content = <>
    {show("metadata") && (data.author?.name || data.reviewedBy?.name || reviewedAt || updatedAt) && (
      <section aria-label="Editorial information" className={section === "metadata" ? "py-2 text-xs text-slate-700" : "rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700"}>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {data.author?.name && <span>Written by <strong>{data.author.name}</strong>{data.author.role ? `, ${data.author.role}` : ''}</span>}
          {data.reviewedBy?.name && <span>Reviewed by <strong>{data.reviewedBy.name}</strong>{data.reviewedBy.role ? `, ${data.reviewedBy.role}` : ''}</span>}
          {reviewedAt && <span>Reviewed <time dateTime={reviewedAt}>{formatDate(reviewedAt)}</time></span>}
          {updatedAt && <span>Updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time></span>}
        </div>
        {section === "all" && data.author?.bio && <p className="mt-3 leading-relaxed">{data.author.bio}</p>}
      </section>
    )}

    {show("audience") && data.keyTakeaways?.length > 0 && <section className="rounded-2xl border border-purple-200 bg-purple-50 p-6"><h2 className="text-xl font-bold text-slate-900">Key takeaways</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">{data.keyTakeaways.map((item: string) => <li key={item}>{item}</li>)}</ul></section>}

    {show("audience") && (data.whoItsFor || data.whoShouldAvoid) && <section className="grid gap-4 md:grid-cols-2">
      {data.whoItsFor && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h2 className="font-bold text-emerald-950">Who this is for</h2><p className="mt-2 text-emerald-900">{data.whoItsFor}</p></div>}
      {data.whoShouldAvoid && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-bold text-amber-950">Who should avoid it</h2><p className="mt-2 text-amber-900">{data.whoShouldAvoid}</p></div>}
    </section>}

    {section === "methodology" && data.author?.bio && <p className="text-sm text-slate-700">{data.author.bio}</p>}
    {show("methodology") && methodology?.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold text-slate-900">How we assessed this</h2><div className="prose prose-slate mt-3 max-w-none"><PortableText value={methodology} /></div></section>}
    {show("context") && data.uaeContext?.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold text-slate-900">UAE buying context</h2><div className="prose prose-slate mt-3 max-w-none"><PortableText value={data.uaeContext} /></div></section>}

    {show("context") && uaeCommerce && Object.values(uaeCommerce).some(Boolean) && <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold text-slate-900">UAE availability and ownership</h2><dl className="mt-4 grid gap-3 sm:grid-cols-2">
      {uaeCommerce.availabilityNote && <div><dt className="font-semibold">Availability</dt><dd>{uaeCommerce.availabilityNote}</dd></div>}
      {uaeCommerce.shippingNote && <div><dt className="font-semibold">Shipping</dt><dd>{uaeCommerce.shippingNote}</dd></div>}
      {uaeCommerce.warrantyNote && <div><dt className="font-semibold">Warranty</dt><dd>{uaeCommerce.warrantyNote}</dd></div>}
      {uaeCommerce.voltageOrCompatibility && <div><dt className="font-semibold">Compatibility</dt><dd>{uaeCommerce.voltageOrCompatibility}</dd></div>}
    </dl></section>}

    {show("sources") && sources.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold text-slate-900">Sources</h2><ol className="mt-3 list-decimal space-y-2 pl-5">{sources.map((source: any) => <li key={source.url}><a className="font-medium text-purple-700 underline" href={source.url} rel="nofollow noopener">{source.title}</a>{source.publisher ? ` — ${source.publisher}` : ''}{source.accessedAt ? ` (checked ${formatDate(source.accessedAt)})` : ''}</li>)}</ol></section>}
    {section === "all" && data.affiliateDisclosure && <aside className="rounded-xl bg-slate-100 p-4 text-sm text-slate-700" aria-label="Affiliate disclosure"><strong>Affiliate disclosure:</strong> {data.affiliateDisclosure}</aside>}
  </>;
  if (section === 'all') return content;
  if (!Children.toArray(content.props.children).length) return null;
  return <div className={section === 'metadata' ? 'mb-4' : 'my-6 space-y-6'}>{content}</div>;
}
