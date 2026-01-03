// src/components/JsonLd.tsx
import { generateSchema } from '@/lib/schemaGenerator';

export default function JsonLd({ data }: { data: any }) {
  if (!data) return null;

  // ✅ FIX: Bypass the generator if manual JSON-LD is passed
  // If the data already has a "@context" (like your homeSchema), use it directly.
  const schema = data['@context'] 
    ? data 
    : generateSchema(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}