import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Sidebar from "@/components/Sidebar";
import TopTenTemplate from "@/components/templates/TopTenTemplate";
import ArticleTemplate from "@/components/templates/ArticleTemplate";
import EventTemplate from "@/components/templates/EventTemplate";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-AE", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai" }).format(new Date(dateString));
};

export default function ArticleView({ data, category, slug }: any) {
  const templateData = { ...data, category: data.category || undefined, listItems: data.listItems };
  const displayDate = data._updatedAt || data.publishedAt;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb categoryName={data.category?.menuLabel || category} categorySlug={data.category?.slug || category} postTitle={data.title} postSlug={slug} />
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-5">
        <main className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
           {/* ... Header & Image Logic ... */}
           {/* ... Template Switching Logic ... */}
           {data._type === "topTenList" ? <TopTenTemplate data={templateData} /> : <ArticleTemplate data={templateData} />}
        </main>
        <Sidebar currentSlug={slug} categorySlug={data.category?.slug} />
      </div>
    </div>
  );
}