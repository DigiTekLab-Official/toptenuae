// src/components/Breadcrumb.tsx
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  categoryName: string;
  categorySlug: string;
  postTitle: string;
  postSlug: string;
  /** * Optional: Set to true if placing breadcrumb on a dark background (like Hero sections) 
   */
  isDarkBackground?: boolean;
}

// Use Environment variable for domain, fallback to hardcoded if missing
const BASE_URL = process.env.baseUrl || 'https://toptenuae.com';

export default function Breadcrumb({
  categoryName,
  categorySlug,
  postTitle,
  postSlug,
  isDarkBackground = false,
}: BreadcrumbProps) {

  // 1. Construct Paths
  const categoryUrl = `${BASE_URL}/${categorySlug}`;
  const postUrl = `${BASE_URL}/${categorySlug}/${postSlug}`;

  // 2. JSON-LD Schema (Critical for SEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: categoryUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: postTitle,
        item: postUrl,
      },
    ],
  };

  // 3. Dynamic Styles based on Background
  const linkColor = isDarkBackground 
    ? 'text-purple-200 hover:text-white' 
    : 'text-gray-500 hover:text-[#4b0082]';

  const activeColor = isDarkBackground 
    ? 'text-white' 
    : 'text-gray-900';

  const separatorColor = isDarkBackground 
    ? 'text-purple-300/50' 
    : 'text-gray-400';

  return (
    <nav aria-label="Breadcrumb" className="w-full mb-4">
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ol className="flex items-center text-sm space-x-2 overflow-hidden flex-wrap">
        
        {/* Home Icon */}
        <li className="flex items-center shrink-0">
          <Link 
            href="/" 
            className={`${linkColor} transition-colors flex items-center p-1`}
            title="Back to Homepage"
          >
            <Home size={16} />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        <Separator colorClass={separatorColor} />

        {/* Category Link */}
        <li className="flex items-center shrink-0">
          <Link 
            href={`/${categorySlug}`}
            className={`${linkColor} hover:underline transition-colors font-medium whitespace-nowrap`}
          >
            {categoryName}
          </Link>
        </li>

        <Separator colorClass={separatorColor} />

        {/* Current Post Title (Truncated) */}
        <li className="flex items-center min-w-0" aria-current="page">
          <span className={`truncate max-w-[150px] md:max-w-md ${activeColor} font-medium block`} title={postTitle}>
            {postTitle}
          </span>
        </li>

      </ol>
    </nav>
  );
}

// Helper Component for the separator arrow
function Separator({ colorClass }: { colorClass: string }) {
  return (
    <li aria-hidden="true" className={`${colorClass} shrink-0`}>
      <ChevronRight size={14} />
    </li>
  );
}