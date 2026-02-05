// src/components/views/ArticleView.tsx
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Sidebar from "@/components/Sidebar";
// ✅ CODE-SPLIT: Dynamic imports for heavy templates
const TopTenTemplate = dynamic(() => import("@/components/templates/TopTenTemplate"), {
  loading: () => (
    <div className="flex items-center justify-center h-[400px]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
    </div>
  ),
  ssr: true,
});

const ArticleTemplate = dynamic(() => import("@/components/templates/ArticleTemplate"), {
  ssr: true,
});

const EventTemplate = dynamic(() => import("@/components/templates/EventTemplate"), {
  ssr: true,
});

// ✅ IMPORT TOOL VIEW
import ToolView from "@/components/views/ToolView";

interface ArticleViewProps {
  data: any;
  category: string;
  slug: string;
}

export default function ArticleView({ data, category, slug }: ArticleViewProps) {
  
  // ✅ 1. IMMEDIATE REDIRECT FOR TOOLS
  // If this is a Tool, use the dedicated Full-Page Layout (No Sidebar)
  if (data?._type === "tool") {
    return <ToolView data={data} category={category} slug={slug} />;
  }

  // --- STANDARD LAYOUT FOR ARTICLES/REVIEWS ---
  const displayDate = data?._updatedAt || data?.publishedAt || new Date().toISOString();
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Intl.DateTimeFormat("en-AE", {
        day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai",
      }).format(new Date(dateString));
    } catch (e) { return ""; }
  };

  const customLayoutTypes = ["topTenList", "event", "holiday"];
  const showHeaderImage = data?.mainImage?.url && !customLayoutTypes.includes(data?._type);

  const activeCategorySlug = data?.category?.slug?.current || data?.category?.slug || category;
  const activeCategoryName = data?.category?.menuLabel || data?.category?.title || category;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb 
        categoryName={activeCategoryName} 
        categorySlug={activeCategorySlug} 
        postTitle={data?.title} 
        postSlug={slug} 
      />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-5">
        <main className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <header className="border-b border-gray-100 pb-6 mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
              {data?.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 gap-4">
               {/* Date & Author Logic ... */}
               <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Last Updated:</span>
                <time dateTime={displayDate}>{formatDate(displayDate)}</time>
              </div>
            </div>

            {showHeaderImage && (
               <div className="mt-6 relative w-full h-auto aspect-video rounded-xl overflow-hidden bg-gray-100">
                 <Image 
                   src={data.mainImage.url} 
                   alt={data.mainImage.alt || data.title}
                   fill
                   className="object-cover"
                   priority={true}
                 />
               </div>
            )}
          </header>

          {/* RENDER TEMPLATES */}
          {(() => {
            switch (data?._type) {
              case "topTenList": return <TopTenTemplate data={data} />;
              case "event": 
              case "holiday": return <EventTemplate data={data} />;
              // 'tool' is handled at the top, so we default to Article here
              default: return <ArticleTemplate data={data} />;
            }
          })()}
        </main>
        
        <Sidebar currentSlug={slug} categorySlug={activeCategorySlug} />
      </div>
    </div>
  );
}