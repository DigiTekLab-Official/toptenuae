// components/JsonLd.tsx
import { generateSchema } from '@/lib/schemaGenerator';

export default function JsonLd({ data }: { data: any }) {
  const schema = generateSchema(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}