import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, ArrowRight, FileQuestion, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

// Force dynamic so each search is fresh
export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: `Search Results for "${q || ""}" | Top Ten UAE`,
    description: `Search results for ${q} on TopTenUAE.`,
    robots: "noindex, follow",
  };
}

/**
 * SMART GROQ SEARCH with relevance scoring
 */
const SEARCH_QUERY = `
  *[
    _type in ["topTenList","howTo","news","post","article","holiday","tool"] &&
    !(_id in path("drafts.**")) &&
    (
      title match ["* " + $term + " *", $term + " *", "* " + $term, $term] ||
      pt::text(intro) match ["* " + $term + " *", $term + " *", "* " + $term, $term] ||
      pt::text(body) match ["* " + $term + " *", $term + " *", "* " + $term, $term] ||
      
      // ✅ Check inside the 'categories' array with word boundaries
      categories[]->title match ["* " + $term + " *", $term + " *", "* " + $term, $term]
    )
  ] {
    title,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    publishedAt,
    
    // ✅ FIX 2: Fetch array of titles
    "categories": categories[]->title,
    
    intro,
    _type,
    "score": (
      select(title match ["* " + $term + " *", $term + " *", "* " + $term, $term] => 4, 0) +
      select(pt::text(intro) match ["* " + $term + " *", $term + " *", "* " + $term, $term] => 3, 0) +
      select(pt::text(body) match ["* " + $term + " *", $term + " *", "* " + $term, $term] => 2, 0) +
      
      // ✅ Score boost if category matches with word boundaries
      select(categories[]->title match ["* " + $term + " *", $term + " *", "* " + $term, $term] => 1, 0)
    )
  } | order(score desc, publishedAt desc)
`;

// Helper for dates
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-AE", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q || "").trim();

  // Wildcards handled in GROQ, so we pass raw query
  // We use $term in query, Sanity's 'match' operator is case-insensitive by default
  const posts = query.length > 1 ? await client.fetch(SEARCH_QUERY, { term: query }) : [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* HERO */}
      <div className="bg-primary text-white py-12 px-4 text-center relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 border border-white/20">
            <Search className="w-6 h-6 text-yellow-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
            {query ? `Results for "${query}"` : "Search TopTenUAE"}
          </h1>
          <p className="text-indigo-200 font-medium">
            Found {posts.length} {posts.length === 1 ? "match" : "matches"} in our archives
          </p>
        </div>
      </div>

      {/* RESULTS */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>

        {/* No results */}
        {posts.length === 0 && (
          <div className="max-w-xl mx-auto text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm px-6">
            <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileQuestion className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No matches found</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We couldn't find anything matching{" "}
              <strong className="text-gray-900">{query}</strong>. <br />
              Try searching for a category like "Tech" or "Travel".
            </p>

            <form action="/search" method="GET" className="relative max-w-sm mx-auto mb-6">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Try a different keyword..."
                className="w-full pl-5 pr-12 py-3 rounded-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link
              key={post.slug || post._id}
              href={`/${post.slug || ""}`}
              className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title || "Article image"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Search className="w-10 h-10 opacity-20" />
                  </div>
                )}

                {/* Categories Badge (Updated to handle array) */}
                {post.categories && post.categories.length > 0 && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-xs font-bold text-gray-800 px-3 py-1 rounded-full shadow-sm">
                    {post.categories[0]} 
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">
                  <Clock className="w-3 h-3" />
                  {post.publishedAt ? formatDate(post.publishedAt) : "Recently Updated"}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {/* Handle portable text or string intro */}
                  {Array.isArray(post.intro) 
                    ? post.intro[0]?.children?.[0]?.text 
                    : post.intro || "Read full details in the article..."}
                </p>

                <div className="flex items-center justify-between gap-4 mt-auto">
                  <span className="inline-flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}