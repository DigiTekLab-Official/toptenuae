// src/components/templates/ArticleTemplate.tsx
import Image from "next/image";
import PortableText from "@/components/PortableText";
import FAQAccordion from "@/components/FAQAccordion";
import { discoverImage } from "@/sanity/lib/image";

// --- 1. DEFINE INTERFACE (Fixes 'implicitly has any' error) ---
interface ArticleData {
  title: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: { name: string };
  mainImage?: any;
  body?: any; 
  intro?: any; // Fallback content
  faqs?: { 
    _key: string; 
    question: string; 
    answer: string 
  }[];
}

// --- 2. GENERATE JSON-LD (Google SEO) ---
const generateArticleSchema = (data: ArticleData, imageUrl: string | null): any[] => {
  const schema: any[] = [];

  // A. Article Schema
  schema.push({
    "@context": "https://schema.org",
    "@type": "Article", // Or "NewsArticle" for government updates
    "headline": data.title,
    "image": imageUrl ? [imageUrl] : [],
    "datePublished": data.publishedAt,
    "dateModified": data.modifiedAt || data.publishedAt,
    "author": {
      "@type": "Organization", // Or "Person" if you have specific authors
      "name": data.author?.name || "GovtJobsNet Team",
      "url": "https://govtjobsnet.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GovtJobsNet",
      "logo": {
        "@type": "ImageObject",
        "url": "https://govtjobsnet.com/logo.png" // Replace with your actual logo URL
      }
    }
  });

  // B. FAQ Schema (Only if FAQs exist)
  if (data.faqs && data.faqs.length > 0) {
    schema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  }

  return schema;
};

export default function ArticleTemplate({ data }: { data: ArticleData }) {
  const heroImageUrl = (data.mainImage ? discoverImage(data.mainImage) : null) ?? null;
  
  // Generate SEO Schema
  const jsonLdData = generateArticleSchema(data, heroImageUrl);

  return (
    <article className="w-full bg-white">
      {/* 🟢 INJECT JSON-LD */}
      {jsonLdData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* NOTE: Title, Date, and Breadcrumbs removed to prevent duplication. */}

      <div className="max-w-none pb-12">
        
        {/* Main Image */}
        {heroImageUrl && (
          <div className="relative w-full aspect-video overflow-hidden mb-10 shadow-sm border border-gray-100 rounded-xl">
            <Image
              src={heroImageUrl}
              alt={data.mainImage?.alt || data.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 850px"
            />
          </div>
        )}

        {/* Body Content */}
        {/* Handles both 'body' (for articles) and 'intro' (fallback) */}
        <div className="prose prose-lg prose-headings:text-primary prose-a:text-primary max-w-none text-gray-700 leading-relaxed">
          <PortableText value={data.body || data.intro} />
        </div>

        {/* --- 2. FAQ SECTION --- */}
        {data.faqs && data.faqs.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
             {/* Header for accessibility/SEO */}
            
            <FAQAccordion faqs={data.faqs} />
          </div>
        )}
      </div>
    </article>
  );
}