// src/components/ui/RelatedLinkCard.tsx

import { ArrowRight } from "@/components/icons"; 

interface RelatedLinkProps {
  label: string;
  preText: string;
  post: {
    title: string;
    slug: string;
    category?: string; // ✅ Added optional category field
  };
}

export default function RelatedLinkCard({ label, preText, post }: RelatedLinkProps) {
  // Guard clause: ensure slug exists
  if (!post?.slug) return null;

  // ✅ LOGIC FIX: Construct the correct URL based on category presence
  const href = post.category 
    ? `/${post.category}/${post.slug}` 
    : `/${post.slug}`;

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
            
            <a 
              href={href} // ✅ Used dynamic href here
              className="inline-flex items-center gap-1 font-bold text-primary hover:text-primary-800 hover:underline decoration-2 underline-offset-2 transition-colors align-bottom"
            >
              <span className="truncate max-w-[280px] sm:max-w-md md:max-w-lg block">
                {post.title}
              </span>
              
              {/* Switched to ArrowRight since this is usually an internal link */}
              <ArrowRight className="w-5 h-5 shrink-0 mb-0.5" aria-hidden="true" />
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}