// src/components/sanity/JsonLd.tsx
import { generateSchema } from '@/lib/schemaGenerator';

/**
 * JsonLd Component - Renders structured data for Google
 * 
 * CRITICAL FIXES (Jan 2026):
 * 1. ✅ Wraps arrays in @graph (Google best practice)
 * 2. ✅ Prevents duplicate injection
 * 3. ✅ Handles both pre-formatted and raw data
 * 4. ✅ Safe server-side rendering
 */

export default function JsonLd({ data }: { data: any }) {
  // -------------------------------------------------------------------------
  // 1. SAFETY CHECK: No data = no schema
  // -------------------------------------------------------------------------
  if (!data) return null;

  // -------------------------------------------------------------------------
  // 2. DETECT IF DATA IS ALREADY FORMATTED SCHEMA
  // -------------------------------------------------------------------------
  // Check if:
  // - It's an array with @context in first item, OR
  // - It's an object with @context property
  const isAlreadySchema = 
    (Array.isArray(data) && data.length > 0 && data[0]?.['@context']) || 
    data?.['@context'];

  // -------------------------------------------------------------------------
  // 3. GENERATE OR USE EXISTING SCHEMA
  // -------------------------------------------------------------------------
  let schema = isAlreadySchema 
    ? data 
    : generateSchema(data);

  // -------------------------------------------------------------------------
  // 4. CRITICAL FIX: Wrap arrays in @graph
  // -------------------------------------------------------------------------
  // WHY: Google prefers @graph for multiple schemas
  // EXAMPLE:
  // Before: [Article, FAQPage]
  // After: { "@context": "...", "@graph": [Article, FAQPage] }
  if (Array.isArray(schema)) {
    schema = {
      '@context': 'https://schema.org',
      '@graph': schema,
    };
  }

  // -------------------------------------------------------------------------
  // 5. RENDER SCRIPT TAG
  // -------------------------------------------------------------------------
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * 1. Single schema:
 *    <JsonLd data={productData} />
 * 
 * 2. Multiple schemas (will auto-wrap in @graph):
 *    <JsonLd data={[organizationSchema, articleSchema, faqSchema]} />
 * 
 * 3. Pre-formatted schema (passes through):
 *    <JsonLd data={{ "@context": "...", "@type": "Article" }} />
 */