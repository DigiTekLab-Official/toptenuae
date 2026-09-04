// src/components/PortableText.tsx
import { PortableText as PortableTextComponent, type PortableTextComponents } from "@portabletext/react";
import { ExternalLink } from "@/components/icons";
import RelatedLinkCard from "@/components/ui/RelatedLinkCard";
import CodeBlock from "@/components/ui/CodeBlock";
import { urlForImage } from "@/sanity/lib/image"; 
import SanityTable from "@/components/sanity/SanityTable"; 
import NavigationGrid from "@/components/ui/NavigationGrid";
import PriceWidget from '@/components/tools/PriceWidget';

// --- 1. InfoCards Component ---
const InfoCards = ({ value }: { value: any }) => {
  if (!value?.cards) return null;

  const getColors = (variant: string) => {
    switch (variant) {
      case 'green': return 'bg-emerald-50 border-emerald-300 text-emerald-900';
      case 'amber': return 'bg-amber-50 border-amber-300 text-amber-900';
      case 'purple': return 'bg-purple-50 border-purple-300 text-purple-900';
      case 'blue': return 'bg-blue-50 border-blue-300 text-blue-900';
      default: return 'bg-slate-50 border-slate-300 text-slate-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
      {value.cards.map((card: any, index: number) => {
        const colors = getColors(card.variant);
        return (
          <div key={index} className={`p-6 rounded-2xl border ${colors}`}>
            <h3 className="text-lg font-bold mb-3">{card.title}</h3>
            <p className="whitespace-pre-line leading-relaxed opacity-90 text-sm md:text-base">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

// --- 2. Main Components Map ---
const components: PortableTextComponents = {
  // ✅ FIX: Silence "Unknown block type" build warnings
  unknownType: () => null,

  types: {
    infoCards: InfoCards,

    navigationGrid: ({ value }: any) => <NavigationGrid title={value.title} items={value.items} />,
  
    // The Data for 'targetPost' is enriched by the GROQ Query
    relatedLink: ({ value }) => (
      <RelatedLinkCard
        label={value.label}
        preText={value.preText}
        post={value.targetPost}
      />
    ),

    priceWidget: ({ value }: any) => (
      <PriceWidget 
        title={value.title}
        price={value.price}
        merchant={value.merchant}
        link={value.affiliateLink}
        badge={value.badge}
      />
    ),

    code: ({ value }) => <CodeBlock value={value} />,
    table: ({ value }) => <SanityTable value={value} />,
    
    separator: ({ value }) => {
      if (value.style === "gap") {
        return <div className="w-full h-8 md:h-12" aria-hidden="true" />;
      }
      return <hr className="w-full my-6 border-t border-gray-200" />;
    },

    image: ({ value }: any) => {
      // 1. Guard Clause - Check if we have an asset
      if (!value?.asset) return null;

      // 2. Get Image URL (prefer pre-built URL from query, fallback to urlForImage())
      let imageUrl = null;
      let width = 1200;
      let height = 800;

      if (value.asset.url) {
        // Use pre-built URL from query
        imageUrl = value.asset.url;
        // Extract dimensions from metadata if available
        if (value.asset.metadata?.dimensions) {
          width = value.asset.metadata.dimensions.width || 1200;
          height = value.asset.metadata.dimensions.height || 800;
        }
      } else if (value.asset._ref) {
        // Fallback: Build URL from reference
        try {
          const builder = urlForImage(value);
          // Handle specific builder return types safely
          if (typeof builder === 'string') {
              imageUrl = builder;
          } else if (builder && typeof builder.url === 'function') {
              imageUrl = builder.url();
          } else {
               imageUrl = builder?.toString() || null;
          }
        } catch (e) {
          console.error("Error generating image URL:", e);
          return null;
        }

        // Extract dimensions from _ref string (e.g., image-key-100x200-png)
        const ref = value.asset._ref;
        if (ref) {
          const parts = ref.split('-');
          if (parts.length >= 3) {
             const dimensions = parts[2].split('x');
             if (dimensions.length === 2) {
               width = parseInt(dimensions[0], 10);
               height = parseInt(dimensions[1], 10);
             }
          }
        }
      } else {
        return null;
      }

      if (!imageUrl) return null;

      // 3. Layout Logic
      const containerClass =
        value.display === "left"
          ? "my-6 md:float-left md:mr-8 md:w-1/2 w-full clear-both md:clear-none"
          : value.display === "right"
          ? "my-6 md:float-right md:ml-8 md:w-1/2 w-full clear-both md:clear-none"
          : "my-10 w-full";

      return (
        <figure className={containerClass}>
          <div className="relative overflow-hidden rounded-lg shadow-sm">
            <img
              src={imageUrl}
              alt={value.alt || ""}
              width={width}
              height={height}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs text-gray-500 mt-2 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },

  block: {
    normal: ({ children }) => {
      // Prevent rendering empty paragraphs
      if (!children || (Array.isArray(children) && children.length === 1 && children[0] === "")) {
        return null;
      }
      return (
        <p className="mb-6 leading-relaxed text-gray-900 text-base">
          {children}
        </p>
      );
    },
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-gray-900 border-b border-gray-100 pb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-gray-800">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-semibold mt-6 mb-3 text-gray-800">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-base md:text-lg font-medium mt-5 mb-2 text-gray-700 uppercase tracking-wide">
        {children}
      </h5>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#8B5CF6] pl-6 py-4 text-gray-700 pr-6 my-10 bg-[#ECE4FD]/50 italic text-lg rounded-r-lg">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 space-y-3 mb-8 text-gray-700 marker:text-primary text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 space-y-3 mb-8 text-gray-700 marker:text-primary font-medium text-lg">
        {children}
      </ol>
    ),
  },

  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const siteUrl = import.meta.env.PUBLIC_BASE_URL || "https://toptenuae.com";
      const isSameSite = href === siteUrl || href.startsWith(`${siteUrl}/`);
      const isExternal = href.startsWith("http") && !isSameSite;
      const isAmazonAffiliate = /^https?:\/\/(?:www\.)?(?:amazon\.ae|amzn\.to)(?:\/|$)/i.test(href);
      return (
        <a
          href={href}
          data-affiliate-product={isAmazonAffiliate ? (typeof children === 'string' ? children : 'Inline Amazon recommendation') : undefined}
          data-affiliate-cta={isAmazonAffiliate ? "inline_link" : undefined}
          data-affiliate-position={isAmazonAffiliate ? "editorial" : undefined}
          target={isExternal || value?.blank ? "_blank" : "_self"}
          rel={isAmazonAffiliate ? "nofollow sponsored noopener noreferrer" : isExternal ? "noopener noreferrer" : undefined}
          className="text-primary underline decoration-primary/30 underline-offset-4 font-semibold hover:text-primary-700 hover:decoration-primary transition-all"
        >
          {children}
          {isExternal && (
            <>
              <ExternalLink className="w-3 h-3 inline ml-1 align-top opacity-70" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </>
          )}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-extrabold text-gray-800">{children}</strong>
    ),
  },
};

export default function PortableText({ value }: { value: any }) {
  // Check if value is valid before processing
  if (value === null || value === undefined) {
    return null;
  }

  // Ensure we always work with an array
  let normalizedValue: any[] = [];

  if (Array.isArray(value)) {
    // Already an array - use it directly
    normalizedValue = value.filter(item => item !== null && item !== undefined);
  } else if (typeof value === 'object' && value !== null) {
    // Single object - check if it looks like a Portable Text block
    const hasBlockSignature = value._type !== undefined || value.children !== undefined || value._key !== undefined || value.style !== undefined;
    
    if (hasBlockSignature) {
      // This is a Portable Text block object - MUST wrap in array
      normalizedValue = [value];
    } else if (value.asset || value.url || value._ref) {
      // Image or reference object - don't render
      return null;
    } else {
      // Some other unknown object
      console.warn('[PortableText] Received unexpected object:', Object.keys(value));
      return null;
    }
  } else if (typeof value === 'string') {
    // ✅ FIX: Gracefully handle simple strings by converting them to a block
    // This fixes the "Received string value, expected array or block" warning
    if (value.trim() === '') return null;
    
    normalizedValue = [{
      _key: `generated-${Date.now()}`,
      _type: 'block',
      children: [{
        _key: `generated-span-${Date.now()}`,
        _type: 'span',
        text: value,
        marks: []
      }],
      markDefs: [],
      style: 'normal'
    }];
  } else {
    // Unexpected type
    return null;
  }

  // Final validation - ensure we have a non-empty array of objects
  if (normalizedValue.length === 0) {
    return null;
  }

  // Safety: Filter out any non-block items that slipped through
  normalizedValue = normalizedValue.filter(item => {
    if (typeof item === 'object' && item !== null && (item._type || item.children || item._key)) {
      return true;
    }
    return false;
  });

  if (normalizedValue.length === 0) {
    return null;
  }

  return <PortableTextComponent value={normalizedValue} components={components} />;
}
