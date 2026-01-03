
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Sidebar from "@/components/Sidebar";
import TopTenTemplate from "@/components/templates/TopTenTemplate";
import ArticleTemplate from "@/components/templates/ArticleTemplate";
import EventTemplate from "@/components/templates/EventTemplate";

interface ArticleViewProps {
  data: any;
  category: string;
  slug: string;
}

export default function ArticleView({ data, category, slug }: ArticleViewProps) {
  const displayDate = data._updatedAt || data.publishedAt;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-AE", {
      day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai",
    }).format(new Date(dateString));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb 
        categoryName={data.category?.menuLabel || data.category?.title || category} 
        categorySlug={data.category?.slug || category} 
        postTitle={data.title} 
        postSlug={slug} 
      />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-5">
        <main className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <header className="border-b border-gray-100 pb-6">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              {data.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              {data.author && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">By {data.author.name}</span>
                  <span className="text-gray-300">•</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Last Updated:</span>
                <time dateTime={displayDate}>{formatDate(displayDate)}</time>
              </div>
            </div>

            {/* HEADER IMAGE (Only for standard Articles/News) */}
            {data.mainImage?.url && (data._type === "article" || data._type === "news") && (
               <div className="mt-6 relative w-full h-[auto] aspect-video rounded-xl overflow-hidden bg-gray-100">
                 <Image 
                   src={data.mainImage.url} 
                   alt={data.mainImage.alt || data.title}
                   fill
                   className="object-cover"
                   priority={true}
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 850px"
                   quality={85}
                 />
               </div>
            )}
          </header>

          {/* RENDER TEMPLATE BASED ON TYPE */}
          {data._type === "topTenList" ? <TopTenTemplate data={data} /> :
           (data._type === "event" || data._type === "holiday") ? <EventTemplate data={data} /> :
           <ArticleTemplate data={data} />}
        </main>
        
        <Sidebar currentSlug={slug} categorySlug={data.category?.slug} />
      </div>
    </div>
  );
}