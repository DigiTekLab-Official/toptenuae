// src/app/[category]/page.tsx

export const revalidate = 86400;
export const dynamicParams = true;

// IMPORTANT FIX: Handle dynamic segments correctly
export const dynamic = "force-static";

import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { client } from "@/sanity/lib/client";
import Sidebar from "@/components/Sidebar";
import { generateSeoMetadata } from "@/utils/seo-manager";
import { cleanText } from "@/lib/utils/sanity-text";
import { listImage } from "@/sanity/lib/image";

import {
  Sparkles,
  ArrowRight,
  Calculator,
  Percent,
  Coins,
  Car,
  Plane,
  TrendingUp,
  HeartHandshake,
} from "lucide-react";

// ============================================================================
// CUSTOM PAGES CONFIG
// ============================================================================
const CUSTOM_PAGES = ["reviews", "deals"];

// ============================================================================
// STATIC PARAMS
// ============================================================================
export async function generateStaticParams() {
  try {
    const categories = await client.fetch(`
      *[_type == "category" && defined(slug.current)]{
        "category": slug.current
      }
    `);

    const filteredCategories = categories
      .filter((c: any) => c.category && !CUSTOM_PAGES.includes(c.category))
      .map((c: any) => ({
        category: c.category,
      }));

    return filteredCategories;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// ============================================================================
// QUERY
// ============================================================================
const categoryQuery = `
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    "seo": seo {
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      noIndex,
      ogImage
    },
    "items": *[
      _type in [
        "topTenList",
        "howTo",
        "tool",
        "holiday",
        "charity",
        "deal",
        "event"
      ] &&
      (
        references(^._id) ||
        category._ref == ^._id ||
        categories[]._ref == ^._id
      )
    ] | order(publishedAt desc) {
      _type,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      "rawExcerpt": coalesce(
        intro,
        description,
        itemDescription,
        body[0...1]
      )
    }
  }
`;

interface PageProps {
  params: Promise<{ category: string }>;
}

// ============================================================================
// METADATA
// ============================================================================
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  if (CUSTOM_PAGES.includes(category)) {
    return { title: "" };
  }

  try {
    const data = await client.fetch(
      `
      *[_type == "category" && slug.current == $slug][0]{
        title,
        description,
        _type,
        "slug": slug.current,
        seo
      }
    `,
      { slug: category }
    );

    if (!data) return { title: "Category Not Found" };

    return generateSeoMetadata(data, { category });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: "Category Not Found" };
  }
}

// ============================================================================
// HELPERS
// ============================================================================
const getToolConfig = (slug: string) => {
  if (!slug) {
    return {
      icon: Calculator,
      iconColor: "text-purple-600 group-hover:text-white",
      iconBg: "bg-purple-50 group-hover:bg-purple-600",
      ctaLabel: "Calculate",
    };
  }

  if (slug.includes("vat")) {
    return {
      icon: Percent,
      iconColor: "text-[#4b0082] group-hover:text-white",
      iconBg: "bg-blue-50 group-hover:bg-[#4b0082]",
      ctaLabel: "Calculate VAT",
    };
  }

  if (slug.includes("zakat")) {
    return {
      icon: HeartHandshake,
      iconColor: "text-indigo-500 group-hover:text-white",
      iconBg: "bg-indigo-50 group-hover:bg-indigo-500",
      ctaLabel: "Calculate Zakat",
    };
  }

  if (slug.includes("gratuity")) {
    return {
      icon: Coins,
      iconColor: "text-amber-500 group-hover:text-white",
      iconBg: "bg-amber-50 group-hover:bg-amber-500",
      ctaLabel: "Calculate Benefits",
    };
  }

  if (slug.includes("loan") || slug.includes("car")) {
    return {
      icon: Car,
      iconColor: "text-sky-500 group-hover:text-white",
      iconBg: "bg-sky-50 group-hover:bg-sky-600",
      ctaLabel: "Estimate EMI",
    };
  }

  if (slug.includes("visa") || slug.includes("freelance")) {
    return {
      icon: Plane,
      iconColor: "text-violet-500 group-hover:text-white",
      iconBg: "bg-violet-50 group-hover:bg-violet-500",
      ctaLabel: "Compare Costs",
    };
  }

  if (slug.includes("roi")) {
    return {
      icon: TrendingUp,
      iconColor: "text-emerald-500 group-hover:text-white",
      iconBg: "bg-emerald-50 group-hover:bg-emerald-500",
      ctaLabel: "Check ROI",
    };
  }

  return {
    icon: Calculator,
    iconColor: "text-purple-600 group-hover:text-white",
    iconBg: "bg-purple-50 group-hover:bg-purple-600",
    ctaLabel: "Calculate Now",
  };
};

// ============================================================================
// PAGE
// ============================================================================
export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (CUSTOM_PAGES.includes(category)) {
    redirect(`/${category}`);
  }

  let data;

  try {
    data = await client.fetch(categoryQuery, { slug: category });
  } catch (error) {
    console.error("Error fetching category data:", error);
    return notFound();
  }

  if (!data) return notFound();

  const categorySlug = data.slug || category;
  if (!categorySlug || categorySlug === "null") return notFound();

  const validItems = (data.items || []).filter(
    (item: any) => item && item.slug
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cleanText(data.title),
    description:
      cleanText(data.description) || `Collection of ${data.title}`,
    url: `https://toptenuae.com/${categorySlug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: validItems.map((item: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://toptenuae.com/${categorySlug}/${item.slug}`,
        name: cleanText(item.title),
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://toptenuae.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cleanText(data.title),
        item: `https://toptenuae.com/${categorySlug}`,
      },
    ],
  };

  const isFinance =
    categorySlug === "finance" || categorySlug === "finance-tools";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Collection Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* Hero */}
      <div className="bg-[#4b0082] text-white py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              {isFinance ? (
                <Calculator className="w-3 h-3" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {isFinance ? "Premium Tools" : "Category Archive"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            {data.title}
          </h1>

          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            {cleanText(data.description) ||
              `Explore the best content in ${data.title}.`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        className={`container mx-auto px-4 py-16 ${
          isFinance ? "max-w-6xl" : "max-w-7xl"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {validItems.map((post: any) => {
                const optimizedImageUrl = post.mainImage
                  ? listImage(post.mainImage)
                  : null;

                return (
                  <Link
                    key={post.slug}
                    href={`/${categorySlug}/${post.slug}`}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full"
                  >
                    <div className="h-52 relative bg-gray-100 shrink-0">
                      {optimizedImageUrl ? (
                        <Image
                          src={optimizedImageUrl}
                          alt={post.title || "Article image"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                          TOP TEN UAE
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#4b0082] transition-colors leading-tight">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 text-sm line-clamp-3 mb-5 flex-1 leading-relaxed">
                        {cleanText(post.rawExcerpt) ||
                          "Read more about this article"}
                      </p>

                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "Recent"}
                        </span>

                        <span className="text-sm font-bold text-[#4b0082] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </main>

          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            <Sidebar currentSlug="" categorySlug={categorySlug} />
          </aside>
        </div>
      </div>
    </div>
  );
}
