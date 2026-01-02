import Link from 'next/link';
import Image from 'next/image';
import { TopTenItem } from './HeroSection';
import PortableText from '@/components/PortableText';

interface CategorySectionProps {
  title: string;
  slug: string; // This is the category slug
  posts: TopTenItem[];
  color?: string; 
}

export default function CategorySection({ title, slug, posts, color = "bg-blue-600" }: CategorySectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-10 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex flex-col">
            <span className="z-10">{title}</span>
            <span className={`h-1 w-12 mt-1 ${color}`}></span>
          </h2>
          <Link 
            href={`/${slug}`} // ✅ FIX: Link to category root (e.g. /tech)
            prefetch={false}  // ✅ FIX: Disable prefetch to stop 404s
            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            View All <span className="hidden sm:inline">{title}</span> &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <article key={post._id} className="group flex flex-col h-full">
              
              <div className="relative aspect-[3/2] overflow-hidden bg-gray-100 mb-3 border border-gray-100">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-gray-300 text-xs">No Image</div>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <h3 className="text-base font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                  {/* ✅ FIX: Use Category Slug in URL + Disable Prefetch */}
                  <Link href={`/${slug}/${post.slug}`} prefetch={false}>
                    {post.title}
                  </Link>
                </h3>
                
                <div className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {typeof post.intro === 'string' ? (
                      <p>{post.intro}</p>
                    ) : (
                      <PortableText value={post.intro} />
                    )}
                </div>
                
                <div className="mt-auto pt-2">
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Recently Updated"}
                    </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}