import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ClientToolRenderer from "@/components/tools/ClientToolRenderer";
import PortableText from "@/components/PortableText";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedTools from "@/components/tools/RelatedTools";
import { getToolConfig } from "@/utils/tool-helpers"; // ✅ Import shared util

export default function ToolView({ data, category, slug }: any) {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
       {/* ... Copy the Hero Section from your page.tsx ... */}
       <section className="bg-[#4b0082] relative overflow-hidden">
          {/* ... content ... */}
       </section>

       {/* ... Copy the Content Section from your page.tsx ... */}
       <section className="max-w-6xl mx-auto px-4 py-16 relative z-20">
          {/* ... content ... */}
       </section>
    </main>
  );
}