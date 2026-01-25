// src/components/templates/ArticleTemplate.tsx
import PortableText from "@/components/sanity/PortableText";
import FAQAccordion from "@/components/FAQAccordion";

// --- 1. DEFINE INTERFACE ---
interface ArticleData {
  _type: string;
  title: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: { name: string };
  // Image is now handled by ArticleView.tsx, but we keep the type def just in case
  mainImage?: {
    url: string; 
    alt?: string;
  };
  body?: any; 
  intro?: any; 
  faqs?: { 
    _key: string; 
    question: string; 
    answer: string 
  }[];
}

export default function ArticleTemplate({ data }: { data: ArticleData }) {
  // ✅ CLEANUP: Image rendering is now handled centrally in ArticleView.tsx
  // This template now focuses purely on the content body and FAQs.

  return (
    <article className="w-full bg-white min-w-0">
      <div className="max-w-none pb-12">
        
        {/* Body Content */}
        {/* 'wrap-break-word' prevents long URLs from breaking mobile layout */}
        <div className="prose prose-lg prose-headings:text-primary prose-a:text-primary max-w-none text-gray-700 leading-relaxed wrap-break-word pt-6">
          <PortableText value={data.body || data.intro} />
        </div>

        {/* --- 2. FAQ SECTION --- */}
        {data.faqs && data.faqs.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <FAQAccordion faqs={data.faqs} />
          </div>
        )}
      </div>
    </article>
  );
}