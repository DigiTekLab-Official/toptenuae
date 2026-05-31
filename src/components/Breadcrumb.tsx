// src/components/Breadcrumb.tsx
import { ChevronRight, Home } from '@/components/icons';

interface BreadcrumbProps {
  categoryName: string;
  categorySlug: string;
  postTitle: string;
  postSlug: string;
  /**
   * Optional: Set to true if placing breadcrumb on a dark background (like Hero sections)
   */
  isDarkBackground?: boolean;
}

// =============================================================================
// CONFIGURATION
// =============================================================================
const BASE_URL = import.meta.env.PUBLIC_BASE_URL || 'https://toptenuae.com';

export default function Breadcrumb({
  categoryName,
  categorySlug,
  postTitle,
  postSlug,
  isDarkBackground = false,
}: BreadcrumbProps) {

  // BreadcrumbList JSON-LD is emitted centrally by generateSchema() (in the page
  // @graph). This component is visual-only — emitting it here too produced a
  // DUPLICATE BreadcrumbList, so the inline schema was removed.

  // DYNAMIC STYLES
  const linkColor = isDarkBackground 
    ? 'text-purple-200 hover:text-white' 
    : 'text-gray-500 hover:text-[#4b0082]';

  const activeColor = isDarkBackground 
    ? 'text-white font-semibold' 
    : 'text-gray-900 font-semibold';

  const separatorColor = isDarkBackground 
    ? 'text-purple-300/50' 
    : 'text-gray-400';

  return (
    <nav aria-label="Breadcrumb" className="w-full mb-4">
      <ol className="flex items-center text-sm space-x-2 overflow-hidden flex-wrap">
        
        {/* --- HOME LINK --- */}
        <li className="flex items-center shrink-0">
          <a 
            href="/" 
            className={`${linkColor} transition-colors flex items-center p-1 rounded hover:bg-black/5`}
            title="Back to Homepage"
            aria-label="Go to homepage"
          >
            <Home size={16} aria-hidden="true" />
            <span className="sr-only">Home</span>
          </a>
        </li>

        <Separator colorClass={separatorColor} />

        {/* --- CATEGORY LINK --- */}
        <li className="flex items-center shrink-0">
          <a 
            href={`/${categorySlug}`}
            className={`${linkColor} hover:underline transition-colors font-medium whitespace-nowrap`}
            title={`View all ${categoryName}`}
          >
            {categoryName}
          </a>
        </li>

        <Separator colorClass={separatorColor} />

        {/* --- CURRENT POST (Truncated) --- */}
        <li className="flex items-center min-w-0" aria-current="page">
          <span 
            className={`truncate max-w-[150px] sm:max-w-[200px] md:max-w-md ${activeColor} block`}
            title={postTitle}
          >
            {postTitle}
          </span>
        </li>

      </ol>
    </nav>
  );
}

// Helper: Visual Separator
function Separator({ colorClass }: { colorClass: string }) {
  return (
    <li aria-hidden="true" className={`${colorClass} shrink-0`}>
      <ChevronRight size={14} />
    </li>
  );
}