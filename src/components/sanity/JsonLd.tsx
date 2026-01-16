// src/components/JsonLd.tsx
import { generateSchema } from '@/lib/schemaGenerator';

export default function JsonLd({ data }: { data: any }) {
  if (!data) return null;

  // ✅ ROBUST FIX: Handle both Single Objects AND Arrays
  // 1. If it's an Array, check if the first item has @context
  // 2. If it's an Object, check if it has @context
  const isAlreadySchema = 
    (Array.isArray(data) && data.length > 0 && data[0]?.['@context']) || 
    data['@context'];

  // If it's already formatted schema, use it. Otherwise, generate it.
  const schema = isAlreadySchema 
    ? data 
    : generateSchema(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}