// src/components/ui/RelatedLinkCard.tsx
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react"; // Switched to ArrowRight for internal links, or keep ExternalLink if preferred

interface RelatedLinkProps {
  label: string;
  preText: string;
  post: {
    title: string;
    slug: string;
  };
}

export default function RelatedLinkCard({ label, preText, post }: RelatedLinkProps) {
  if (!post?.slug) return null;

  return (
    <div className="my-8 not-prose">
      <div className="bg-primary-100 border-l-[6px] border-primary rounded-r-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:items-center">
        
        {/* 1. Label Section */}
        <div className="shrink-0 flex items-center">
          <span className="font-black text-primary uppercase tracking-wider text-sm whitespace-nowrap">
            {label || "LEARN MORE"}
          </span>
          {/* Vertical Divider */}
          <div className="hidden sm:block w-px h-4 bg-primary-300 mx-4"></div>
        </div>

        {/* 2. Content Section */}
        <div className="flex-1 min-w-0">
          <p className="text-slate-800 text-base leading-relaxed m-0">
            <span className="opacity-90">{preText}</span>{" "}
            
            <Link 
              href={`/${post.slug}`} 
              className="inline-flex items-center gap-1 font-bold text-primary hover:text-primary-800 hover:underline decoration-2 underline-offset-2 transition-colors align-bottom"
              // ❌ REMOVED: title={post.title} (Fixes WAVE "Redundant title text" error)
            >
              <span className="truncate max-w-[280px] sm:max-w-md md:max-w-lg block">
                {post.title}
              </span>
              
              {/* ✅ ADDED: aria-hidden="true" to prevent screen reader noise */}
              <ExternalLink className="w-5 h-5 shrink-0 mb-0.5" aria-hidden="true" />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}