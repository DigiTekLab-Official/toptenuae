// src/components/PortableText.tsx
import { PortableText as PortableTextComponent, PortableTextComponents } from "@portabletext/react";
import { ExternalLink } from "lucide-react";
import RelatedLinkCard from "./ui/RelatedLinkCard";
import CodeBlock from "./ui/CodeBlock";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image"; 
import SanityTable from "./ui/SanityTable"; 
import NavigationGrid from "./ui/NavigationGrid";
import PriceWidget from '@/components/tools/PriceWidget';

// --- 1. NEW: InfoCards Component for the Grid Layout ---
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
            {/* whitespace-pre-line ensures line breaks from the text area are respected */}
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
  types: {
    // ✅ Register the new InfoCards type here
    infoCards: InfoCards,

    navigationGrid: ({ value }: any) => <NavigationGrid title={value.title} items={value.items} />,
  
    // Note: The WAVE 'Redundant title' error fix must be applied inside the RelatedLinkCard component itself.
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
      // 1. Guard Clause: Check if asset exists
      if (!value?.asset?._ref) return null;

      // 2. Generate direct URL properly
      let imageUrl = null;
      try {
        const builder = urlForImage(value);
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

      if (!imageUrl) return null;

      // 3. ✅ EXTRACT DIMENSIONS from Sanity Asset Reference
      // Sanity ID format: image-id-dimensions-format (e.g., image-abc...-1920x1080-jpg)
      let width = 1200; // default fallback
      let height = 800; // default fallback
      const ref = value.asset._ref;
      if (ref) {
        const parts = ref.split('-');
        if (parts.length >= 3) {
           const dimensions = parts[2].split('x'); // ['1920', '1080']
           if (dimensions.length === 2) {
             width = parseInt(dimensions[0], 10);
             height = parseInt(dimensions[1], 10);
           }
        }
      }

      // Layout Logic
      const isFloat = value.display === "left" || value.display === "right";
      const containerClass =
        value.display === "left"
          ? "my-6 md:float-left md:mr-8 md:w-1/2 w-full clear-both md:clear-none"
          : value.display === "right"
          ? "my-6 md:float-right md:ml-8 md:w-1/2 w-full clear-both md:clear-none"
          : "my-10 w-full";

      return (
        <figure className={containerClass}>
          {/* ✅ FIX: Removed fixed 'aspect-[...]' classes. 
             Now the container height simply wraps the image content. */}
          <div className="relative overflow-hidden rounded-lg shadow-sm">
            <Image
              src={imageUrl}
              alt={value.alt || ""}
              // ✅ FIX: Use extracted width/height instead of 'fill'
              width={width}
              height={height}
              // ✅ FIX: w-full h-auto ensures it fits the column but keeps natural height (no cropping)
              className="w-full h-auto object-contain" 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
              quality={85}
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
      // Prevent "Ghost Blocks"
      if (!children || (Array.isArray(children) && children[0] === "")) {
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
      <blockquote className="border-l-5 border-[#8B5CF6] pl-6 py-4 text-gray-700 pr-6 my-10 bg-[#ECE4FD] italic text-lg rounded-r-lg">
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
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal || value?.blank ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
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
  return <PortableTextComponent value={value} components={components} />;
}