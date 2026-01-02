import Link from 'next/link';
import Image from 'next/image';
import { TopTenItem } from './HeroSection';
import PortableText from '@/components/PortableText';

export default function LatestPosts({ posts }: { posts: TopTenItem[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 relative inline-block">
            <span className="relative z-10">Latest Guides</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-0"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts.map((post) => {
             // ✅ FIX: Safe URL Construction
             const postUrl = `/${post.categorySlug || 'general'}/${post.slug}`;
             
             return (
              <article key={post._id} className="flex flex-col group">
                
                <div className="relative aspect-[3/2] overflow-hidden bg-gray-100 mb-4 shadow-sm border border-gray-100">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {post.category && (
                    <span className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold uppercase px-3 py-1 shadow-sm">
                      {post.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2 uppercase tracking-wide">
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {/* ✅ FIX: Disable Prefetch */}
                    <Link href={postUrl} prefetch={false}>
                      {post.title}
                    </Link>
                  </h3>

                  <div className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                    {typeof post.intro === 'string' ? (
                      <p>{post.intro}</p>
                    ) : (
                      <PortableText value={post.intro} />
                    )}
                  </div>

                  {/* ✅ FIX: Disable Prefetch */}
                  <Link 
                    href={postUrl} 
                    prefetch={false}
                    className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-tight"
                  >
                    Read Review <span className="ml-1">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}