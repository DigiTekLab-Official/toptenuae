// src/components/PortableText.tsx
import {
  PortableText as PortableTextComponent,
  type PortableTextComponents,
} from "@portabletext/react";
import { ExternalLink } from "@/components/icons";
import RelatedLinkCard from "@/components/ui/RelatedLinkCard";
import CodeBlock from "@/components/ui/CodeBlock";
import { urlForImage } from "@/sanity/lib/image";
import SanityTable from "@/components/sanity/SanityTable";
import NavigationGrid from "@/components/ui/NavigationGrid";
import PriceWidget from "@/components/tools/PriceWidget";
import {
  getAmazonUaeAsin,
  type AmazonAffiliateProduct,
} from "@/lib/affiliate/amazon-asin";
import { canonicalizeAuditedInternalLink } from "@/lib/seo/legacy-redirects";

// --- 1. InfoCards Component ---
const InfoCards = ({ value }: { value: any }) => {
  if (!value?.cards) return null;

  const getColors = (variant: string) => {
    switch (variant) {
      case "green":
        return "bg-emerald-50 border-emerald-300 text-emerald-900";
      case "amber":
        return "bg-amber-50 border-amber-300 text-amber-900";
      case "purple":
        return "bg-purple-50 border-purple-300 text-purple-900";
      case "blue":
        return "bg-blue-50 border-blue-300 text-blue-900";
      default:
        return "bg-slate-50 border-slate-300 text-slate-800";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
      {value.cards.map((card: any, index: number) => {
        const colors = getColors(card.variant);

        return (
          <div
            key={index}
            className={`p-6 rounded-2xl border ${colors}`}
          >
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

// --- 2. Portable Text Link ---
const PortableTextLink = ({
  children,
  value,
  affiliateProductsByAsin,
}: {
  children: any;
  value: any;
  affiliateProductsByAsin?: ReadonlyMap<string, AmazonAffiliateProduct>;
}) => {
  const originalHref = canonicalizeAuditedInternalLink(
    value?.href || "#"
  );

  const affiliateProduct = affiliateProductsByAsin?.get(
    getAmazonUaeAsin(originalHref) || ""
  );

  const href = affiliateProduct?.url || originalHref;

  const siteUrl =
    import.meta.env.PUBLIC_BASE_URL || "https://toptenuae.com";

  const isSameSite =
    href === siteUrl || href.startsWith(`${siteUrl}/`);

  const isExternal =
    href.startsWith("http") && !isSameSite;

  const isAmazonAffiliate =
    /^https?:\/\/(?:www\.)?(?:amazon\.ae|amzn\.to)(?:\/|$)/i.test(
      href
    );

  const isMatchedSource = Boolean(
    affiliateProductsByAsin && affiliateProduct
  );

  const isAffiliateLink = affiliateProductsByAsin
    ? isMatchedSource
    : isAmazonAffiliate;

  return (
    <a
      href={href}
      data-affiliate-product={
        isAffiliateLink
          ? affiliateProduct?.title ||
            (typeof children === "string"
              ? children
              : "Inline Amazon recommendation")
          : undefined
      }
      data-affiliate-cta={
        isAffiliateLink
          ? isMatchedSource
            ? "source_link"
            : "inline_link"
          : undefined
      }
      data-affiliate-position={
        isAffiliateLink
          ? affiliateProduct?.rank || "editorial"
          : undefined
      }
      target={
        isExternal || value?.blank ? "_blank" : "_self"
      }
      rel={
        isAffiliateLink
          ? "nofollow sponsored noopener noreferrer"
          : isExternal
            ? "noopener noreferrer"
            : undefined
      }
      className="text-primary underline decoration-primary/30 underline-offset-4 font-semibold hover:text-primary-700 hover:decoration-primary transition-all"
    >
      {children}

      {isExternal && (
        <>
          <ExternalLink
            className="w-3 h-3 inline ml-1 align-top opacity-70"
            aria-hidden="true"
          />
          <span className="sr-only">
            (opens in a new tab)
          </span>
        </>
      )}
    </a>
  );
};

// --- 3. Shared Portable Text Image Renderer ---
// Supports both:
//   _type: "image"
//   _type: "bodyImage"
//
// "bodyImage" is used by Buyer Guide → Guide Body.
const PortableTextImage = ({
  value,
}: {
  value: any;
}) => {
  // Guard: image must have a Sanity asset
  if (!value?.asset) return null;

  let imageUrl: string | null = null;
  let width = 1200;
  let height = 800;

  // Prefer asset URL when the GROQ query has expanded the asset
  if (value.asset.url) {
    imageUrl = value.asset.url;

    if (value.asset.metadata?.dimensions) {
      width =
        value.asset.metadata.dimensions.width || 1200;
      height =
        value.asset.metadata.dimensions.height || 800;
    }
  } else if (value.asset._ref) {
    // Fallback: generate URL from the Sanity asset reference
    try {
      const builder = urlForImage(value);

      if (typeof builder === "string") {
        imageUrl = builder;
      } else if (
        builder &&
        typeof builder.url === "function"
      ) {
        imageUrl = builder.url();
      } else {
        imageUrl = builder?.toString() || null;
      }
    } catch (error) {
      console.error(
        "Error generating Sanity image URL:",
        error
      );

      return null;
    }

    // Extract dimensions from standard Sanity image reference:
    // image-{id}-{width}x{height}-{format}
    const ref = value.asset._ref;

    if (ref) {
      const parts = ref.split("-");

      if (parts.length >= 3) {
        const dimensions = parts[2].split("x");

        if (dimensions.length === 2) {
          const parsedWidth = parseInt(
            dimensions[0],
            10
          );

          const parsedHeight = parseInt(
            dimensions[1],
            10
          );

          if (!Number.isNaN(parsedWidth)) {
            width = parsedWidth;
          }

          if (!Number.isNaN(parsedHeight)) {
            height = parsedHeight;
          }
        }
      }
    }
  } else {
    return null;
  }

  if (!imageUrl) return null;

  // Optional display layout used by content schemas that
  // support left/right/full-width images.
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
};

// --- 4. Main Components Map ---
const components: PortableTextComponents = {
  // Silence unknown block warnings.
  // Known custom block types must still be registered below.
  unknownType: () => null,

  types: {
    infoCards: InfoCards,

    navigationGrid: ({ value }: any) => (
      <NavigationGrid
        title={value.title}
        items={value.items}
      />
    ),

    // The data for targetPost is enriched by the GROQ query
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

    code: ({ value }) => (
      <CodeBlock value={value} />
    ),

    table: ({ value }) => (
      <SanityTable value={value} />
    ),

    separator: () => (
  <hr className="w-full my-6 border-t border-gray-200" />
  ),
    // Existing Portable Text images
    image: PortableTextImage,

    // Buyer Guide → Guide Body images
    bodyImage: PortableTextImage,
    contentImageGrid: ({ value }: any) => {
    if (!value?.content || !value?.image) return null;

    return (
      <section className="my-10 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-10 items-center">
        <div>
          <PortableTextComponent
            value={value.content}
            components={components}
          />
        </div>

        <div>
          <PortableTextImage value={value.image} />
        </div>
      </section>
    );
  },
  },

  block: {
    normal: ({ children }) => {
      // Prevent rendering empty paragraphs
      if (
        !children ||
        (Array.isArray(children) &&
          children.length === 1 &&
          children[0] === "")
      ) {
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
    link: ({ children, value }) => (
      <PortableTextLink
        children={children}
        value={value}
      />
    ),

    strong: ({ children }) => (
      <strong className="font-extrabold text-gray-800">
        {children}
      </strong>
    ),
  },
};

// --- 5. Portable Text Wrapper ---
export default function PortableText({
  value,
  affiliateProductsByAsin,
}: {
  value: any;
  affiliateProductsByAsin?: ReadonlyMap<
    string,
    AmazonAffiliateProduct
  >;
}) {
  // Check if value is valid before processing
  if (value === null || value === undefined) {
    return null;
  }

  // Ensure we always work with an array
  let normalizedValue: any[] = [];

  if (Array.isArray(value)) {
    // Already an array
    normalizedValue = value.filter(
      (item) =>
        item !== null && item !== undefined
    );
  } else if (
    typeof value === "object" &&
    value !== null
  ) {
    // Single Portable Text object
    const hasBlockSignature =
      value._type !== undefined ||
      value.children !== undefined ||
      value._key !== undefined ||
      value.style !== undefined;

    if (hasBlockSignature) {
      normalizedValue = [value];
    } else if (
      value.asset ||
      value.url ||
      value._ref
    ) {
      // Raw image/reference object without Portable Text type
      return null;
    } else {
      console.warn(
        "[PortableText] Received unexpected object:",
        Object.keys(value)
      );

      return null;
    }
  } else if (typeof value === "string") {
    // Gracefully convert simple strings to Portable Text
    if (value.trim() === "") {
      return null;
    }

    const timestamp = Date.now();

    normalizedValue = [
      {
        _key: `generated-${timestamp}`,
        _type: "block",
        children: [
          {
            _key: `generated-span-${timestamp}`,
            _type: "span",
            text: value,
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ];
  } else {
    return null;
  }

  // Ensure we have content
  if (normalizedValue.length === 0) {
    return null;
  }

  // Filter malformed Portable Text values
  normalizedValue = normalizedValue.filter(
    (item) => {
      if (
        typeof item === "object" &&
        item !== null &&
        (item._type ||
          item.children ||
          item._key)
      ) {
        return true;
      }

      return false;
    }
  );

  if (normalizedValue.length === 0) {
    return null;
  }

  // When affiliate product information is supplied,
  // enrich inline links with the tracked affiliate URL.
  const sourceComponents = affiliateProductsByAsin
    ? {
        ...components,
        marks: {
          ...components.marks,

          link: ({
            children,
            value,
          }: any) => (
            <PortableTextLink
              children={children}
              value={value}
              affiliateProductsByAsin={
                affiliateProductsByAsin
              }
            />
          ),
        },
      }
    : components;

  return (
    <PortableTextComponent
      value={normalizedValue}
      components={sourceComponents}
    />
  );
}