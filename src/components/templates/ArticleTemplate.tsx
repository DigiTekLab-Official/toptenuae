// src/components/templates/ArticleTemplate.tsx
import Image from "next/image";
import PortableText from "@/components/sanity/PortableText";
import FAQAccordion from "@/components/FAQAccordion";
// 🗑️ DELETED: discoverImage import (Not needed, we have the URL directly)

// --- 1. DEFINE INTERFACE ---
interface ArticleData {
  _type: string; // ✅ REQUIRED: To prevent double-image rendering
  title: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: { name: string };
  mainImage?: {
    url: string; // ✅ MATCHES QUERY: Your GROQ returns a direct URL
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
  // ✅ LOGIC FIX: Use the direct URL from your query
  const heroImageUrl = data.mainImage?.url || null;

  // ✅ SMART GUARD: Prevent Double Images
  // ArticleView.tsx already renders the image for "article" and "news".
  // We only show it here for other types (like 'howTo', 'charity') that fall through to this template.
  const shouldRenderImage = heroImageUrl && data._type !== 'article' && data._type !== 'news';

  return (
    <article className="w-full bg-white min-w-0">
      
      <div className="max-w-none pb-12">
        
        {/* Main Image (Only if not already shown in Header) */}
        {shouldRenderImage && (
          <div className="relative w-full aspect-video overflow-hidden mb-10 shadow-sm border border-gray-100 rounded-xl">
            <Image
              src={heroImageUrl!}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 850px"
            />
          </div>
        )}

        {/* Body Content */}
        {/* 'wrap-break-word' prevents long URLs from breaking mobile layout */}
        <div className="prose prose-lg prose-headings:text-primary prose-a:text-primary max-w-none text-gray-700 leading-relaxed wrap-break-word">
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