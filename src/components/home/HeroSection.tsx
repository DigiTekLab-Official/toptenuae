// src/components/home/HeroSection.tsx
import Link from 'next/link';
import Image from 'next/image';
import { toPlainText } from '@/lib/utils'; 

export interface TopTenItem {
  _id: string;
  title: string;
  slug: string;
  intro: any; 
  imageUrl?: string;
  category?: string;      
  categorySlug?: string;  
  publishedAt?: string;
}

interface HeroProps {
  featuredPost: TopTenItem;
  sidePosts: TopTenItem[];
}

// 1. The Main "Featured" Card
const FeaturedCard = ({ post }: { post: TopTenItem }) => {
  // ✅ DATA IS NOW SAFE: We rely on the query's coalesce, but keep a fallback just in case.
  const catSlug = post.categorySlug || 'general';
  const postUrl = `/${catSlug}/${post.slug}`;
  
  const introText = typeof post.intro === 'string' ? post.intro : (post.intro ? toPlainText(post.intro) : '');

  return (
    <div className="group relative h-full flex flex-col border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
        )}
        
        {post.category && (
          <span className="absolute left-0 top-0 z-10 bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
            {post.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <h2 className="mb-4 text-2xl font-black leading-tight text-gray-900 group-hover:text-blue-600 md:text-3xl lg:text-4xl">
            {/* ✅ PREFETCH FALSE: Keeps console clean */}
            <Link href={postUrl} prefetch={false}>
              {post.title}
            </Link>
          </h2>
          <p className="line-clamp-3 text-base text-gray-600 leading-relaxed md:text-lg">
            {introText}
          </p>
        </div>
        
        <div className="mt-6 flex items-center text-sm text-gray-400 font-medium">
          <time>
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently Updated'}
          </time>
          <span className="mx-2 text-gray-300">•</span>
          <Link href={postUrl} prefetch={false} className="text-blue-600 hover:underline">
            Read Guide →
          </Link>
        </div>
      </div>
    </div>
  );
};

// 2. The Side List Items
const SideListItem = ({ post }: { post: TopTenItem }) => {
  const catSlug = post.categorySlug || 'general';
  const postUrl = `/${catSlug}/${post.slug}`;

  return (
    <article className="group flex gap-4 items-start p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      <div className="relative h-20 w-24 shrink-0 overflow-hidden bg-gray-100 border border-gray-100">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="100px"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          {post.category && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
              {post.category}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold leading-snug text-gray-900 group-hover:text-blue-600 line-clamp-2">
          <Link href={postUrl} prefetch={false}>
            {post.title}
          </Link>
        </h3>
        {post.publishedAt && (
          <time className="mt-1.5 text-xs text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        )}
      </div>
    </article>
  );
};

export default function HeroSection({ featuredPost, sidePosts }: HeroProps) {
  if (!featuredPost) return null;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600"></span>
          Trending Now
        </h2>
        <Link href="/latest" prefetch={false} className="text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <FeaturedCard post={featuredPost} />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 p-4"> 
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              Latest Guides
            </h3>
            <div className="flex flex-col">
              {sidePosts.map((post) => (
                <SideListItem key={post._id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}