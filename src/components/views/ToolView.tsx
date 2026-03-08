// src/components/views/ToolView.tsx

import { Calculator, Percent, Coins, HeartHandshake, ArrowRight } from "@/components/icons";
import ClientToolRenderer from "@/components/tools/ClientToolRenderer";
import Breadcrumb from "@/components/Breadcrumb";
import PortableText from "@/components/sanity/PortableText";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedTools from "@/components/tools/RelatedTools"; 

// --- CONFIG HELPER ---
const getToolConfig = (slug: string) => {
  if (!slug) return { icon: Calculator, iconColor: '', iconBg: '', ctaLabel: 'View' };
  
  if (slug.includes('vat')) return { 
    icon: Percent, 
    iconColor: 'text-primary group-hover:text-white', 
    iconBg: 'bg-blue-50 group-hover:bg-[#4b0082]', 
    ctaLabel: 'Calculate VAT' 
  };
  if (slug.includes('zakat')) return { 
    icon: HeartHandshake, 
    iconColor: 'text-indigo-500 group-hover:text-white', 
    iconBg: 'bg-indigo-50 group-hover:bg-indigo-500', 
    ctaLabel: 'Calculate Zakat' 
  };
  if (slug.includes('gratuity')) return { 
    icon: Coins, 
    iconColor: 'text-amber-500 group-hover:text-white', 
    iconBg: 'bg-amber-50 group-hover:bg-amber-500', 
    ctaLabel: 'Calculate Benefits' 
  };
  // ... other configs (loan, visa, roi) keep as is ...
  
  return { 
    icon: Calculator, 
    iconColor: 'text-primary group-hover:text-white', 
    iconBg: 'bg-primary-50 group-hover:bg-primary', 
    ctaLabel: 'Calculate Now' 
  };
};

interface ToolViewProps {
  data: any;
  category: string;
  slug: string;
}

export default function ToolView({ data, slug }: ToolViewProps) {
  
  // ✅ FIX: Map your EXACT Sanity slugs to the Registry IDs
  const TOOL_IDS: Record<string, string> = {
    // VAT (Slug: uae-vat-calculator)
    "uae-vat-calculator": "vat-uae",
    "vat-calculator": "vat-uae",

    // Gratuity (Slug: gratuity-calculator-uae)
    "gratuity-calculator-uae": "gratuity-uae", // 👈 Fixed mapping
    "gratuity-calculator": "gratuity-uae",
    "uae-gratuity-calculator": "gratuity-uae",

    // Zakat (Slug: zakat-calculator)
    "zakat-calculator": "zakat-uae",            // 👈 Fixed mapping
    "uae-zakat-calculator": "zakat-uae",
    "zakat-calculator-uae": "zakat-uae"
  };

  const finalComponentId = data.componentId || TOOL_IDS[slug] || slug;
  const bodyContent = data.body || data.content;

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      
      {/* HERO SECTION */}
      <section className="bg-[#4b0082] relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 right-0 w-1/2 h-full bg-white/10 blur-3xl rounded-full translate-x-1/3"></div>
        <div aria-hidden="true" className="absolute bottom-0 left-0 w-1/3 h-full bg-amber-500/20 blur-3xl rounded-full -translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 pt-12 pb-24 lg:pt-16 lg:pb-20 relative z-10">
          <div className="mb-6">
            <Breadcrumb 
              categoryName={data.category?.menuLabel || "Tools"} 
              categorySlug={data.category?.slug || "finance-tools"} 
              postTitle={data.title} 
              postSlug={slug} 
              isDarkBackground={true} 
            />
          </div>

          <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left text-white">
              {data.heroBadge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-sm font-semibold uppercase tracking-wide">{data.heroBadge}</span>
                </div>
              )}
              
              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
                {data.title} <br />
                {data.heroTitleSuffix && (
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-amber-500">
                    {data.heroTitleSuffix}
                  </span>
                )}
              </h1>
              
              <div className="text-lg text-indigo-100 mb-8 leading-relaxed opacity-90 max-w-2xl mx-auto lg:mx-0">
                {typeof data.intro === 'string' ? (
                   <p>{data.intro}</p>
                ) : data.intro ? (
                   <div className="prose prose-invert prose-p:text-indigo-100">
                      <PortableText value={data.intro} />
                   </div>
                ) : (
                   <p>{data.description}</p>
                )}
              </div>
            </div>

            <div className="w-full max-w-xl shrink-0 mx-auto lg:mx-0">
               <ClientToolRenderer id={finalComponentId} />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-6xl mx-auto px-4 py-16 relative z-20">
        <div id="tool-portal-root" className="mb-12 font-sans"></div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 lg:p-12">
          {bodyContent && (
            <div className="prose prose-slate prose-lg max-w-none font-sans mb-12 prose-headings:text-[#4b0082] prose-a:text-blue-600">
              <PortableText value={bodyContent} />
            </div>
          )}

          {data.faqs && data.faqs.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <FAQAccordion faqs={data.faqs} />
            </div>
          )}

          {data.relatedTools && data.relatedTools.length > 0 ? (
            <div className="mt-16 pt-10 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Explore Other Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.relatedTools.map((tool: any) => {
                  const toolSlug = tool.slug?.current || tool.slug;
                  if (!toolSlug) return null;
                  const config = getToolConfig(toolSlug);
                  const ToolIcon = config.icon;
                  
                  return (
                    <a 
                      key={toolSlug} 
                      href={`/finance-tools/${toolSlug}`} 
                      className="group relative block h-full focus:outline-none focus:ring-2 focus:ring-[#4b0082] rounded-2xl"
                    >
                      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#4b0082]/30 transition-all h-full flex flex-col overflow-hidden">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${config.iconBg}`}>
                          <ToolIcon className={`w-7 h-7 transition-colors duration-300 ${config.iconColor}`} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-auto group-hover:text-[#4b0082] transition-colors">
                          {tool.title || "Calculator Tool"}
                        </h4>
                        <div className="mt-4 flex items-center text-sm font-bold text-slate-400 group-hover:text-[#4b0082]">
                          Open Tool <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            // Fallback to Hardcoded Component
            <RelatedTools currentTool={slug} />
          )}

        </div>
      </section>
    </main>
  );
}