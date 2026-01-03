
import Link from "next/link";
import { Calculator, Percent, Coins, HeartHandshake, Car, Plane, TrendingUp } from "lucide-react";
import ClientToolRenderer from "@/components/tools/ClientToolRenderer";
import Breadcrumb from "@/components/Breadcrumb";
import PortableText from "@/components/PortableText";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedTools from "@/components/tools/RelatedTools";

// --- CONFIG HELPER (Moved from page.tsx) ---
const getToolConfig = (slug: string) => {
  if (!slug) return { icon: Calculator, iconColor: '', iconBg: '', ctaLabel: 'View' };
  if (slug.includes('vat')) return { icon: Percent, iconColor: 'text-[#4b0082] group-hover:text-white', iconBg: 'bg-blue-50 group-hover:bg-[#4b0082]', ctaLabel: 'Calculate VAT' };
  if (slug.includes('zakat')) return { icon: HeartHandshake, iconColor: 'text-indigo-500 group-hover:text-white', iconBg: 'bg-indigo-50 group-hover:bg-indigo-500', ctaLabel: 'Calculate Zakat' };
  if (slug.includes('gratuity')) return { icon: Coins, iconColor: 'text-amber-500 group-hover:text-white', iconBg: 'bg-amber-50 group-hover:bg-amber-500', ctaLabel: 'Calculate Benefits' };
  if (slug.includes('loan') || slug.includes('car')) return { icon: Car, iconColor: 'text-sky-500 group-hover:text-white', iconBg: 'bg-sky-50 group-hover:bg-sky-600', ctaLabel: 'Estimate EMI' };
  if (slug.includes('visa') || slug.includes('freelance')) return { icon: Plane, iconColor: 'text-violet-500 group-hover:text-white', iconBg: 'bg-violet-50 group-hover:bg-violet-500', ctaLabel: 'Compare Costs' };
  if (slug.includes('roi')) return { icon: TrendingUp, iconColor: 'text-emerald-500 group-hover:text-white', iconBg: 'bg-emerald-50 group-hover:bg-emerald-500', ctaLabel: 'Check ROI' };
  return { icon: Calculator, iconColor: 'text-purple-600 group-hover:text-white', iconBg: 'bg-purple-50 group-hover:bg-purple-600', ctaLabel: 'Calculate Now' };
};

interface ToolViewProps {
  data: any;
  category: string;
  slug: string;
}

export default function ToolView({ data, category, slug }: ToolViewProps) {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* HERO */}
      <section className="bg-[#4b0082] relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 right-0 w-1/2 h-full bg-white/10 blur-3xl rounded-full translate-x-1/3"></div>
        <div aria-hidden="true" className="absolute bottom-0 left-0 w-1/3 h-full bg-amber-500/20 blur-3xl rounded-full -translate-x-1/3"></div>
        <div className="container mx-auto px-4 pt-12 pb-24 lg:pt-10 lg:pb-14 relative z-10">
          <div className="mb-4">
            <Breadcrumb categoryName={data.category?.menuLabel || "Tools"} categorySlug={data.category?.slug || "tools"} postTitle={data.title} postSlug={slug} isDarkBackground={true} />
          </div>
          <div className="flex flex-col-reverse md:flex-col lg:flex-row items-start gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left mt-4 text-white">
              {data.heroBadge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-sm font-semibold uppercase tracking-wide">{data.heroBadge}</span>
                </div>
              )}
              <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
                {data.title} <br />
                {data.heroTitleSuffix && <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">{data.heroTitleSuffix}</span>}
              </h1>
              <div className="text-lg text-purple-100 mb-8 leading-relaxed opacity-90 max-w-2xl mx-auto lg:mx-0">{data.intro || data.description}</div>
            </div>
            <div className="w-full max-w-lg shrink-0 mx-auto lg:mx-0"><ClientToolRenderer id={data.componentId} /></div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-4 py-16 relative z-20">
        <div id="tool-portal-root" className="mb-12 font-sans"></div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 lg:p-12">
          {data.content && <div className="prose prose-slate prose-lg max-w-none font-sans mb-12"><PortableText value={data.content} /></div>}
          {data.faqs && <div className="mt-12 pt-8 border-t border-gray-100"><FAQAccordion faqs={data.faqs} /></div>}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Explore Other Tools</h3>
            {data.relatedTools?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.relatedTools.map((tool: any) => {
                  if (!tool.slug) return null;
                  const config = getToolConfig(tool.slug);
                  const ToolIcon = config.icon;
                  return (
                    <Link key={tool.slug} href={`/${category}/${tool.slug}`} className="group relative block h-full focus:outline-none focus:ring-2 focus:ring-[#4b0082] rounded-2xl">
                      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-300 hover:border-[#4b0082]/30 transition-all h-full flex flex-col overflow-hidden">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${config.iconBg}`}>
                          <ToolIcon className={`w-7 h-7 transition-colors duration-300 ${config.iconColor}`} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-auto group-hover:text-[#4b0082] transition-colors">{tool.title}</h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : <RelatedTools currentTool={slug.includes('zakat') ? 'zakat' : slug.includes('vat') ? 'vat' : 'gratuity'} />}
          </div>
        </div>
      </section>
    </main>
  );
}