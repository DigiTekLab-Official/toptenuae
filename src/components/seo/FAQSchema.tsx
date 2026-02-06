import React from 'react';
import { toPlainText } from 'next-sanity'; // ✅ Helper to convert Rich Text to String

interface FAQItem {
  question: string;
  answer: any; // Accept 'any' because it might be a String OR Rich Text Array
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null;

  // Helper to ensure we get a clean string, regardless of input format
  const getAnswerString = (answer: any) => {
    if (!answer) return "";
    // If it's already a simple string, return it
    if (typeof answer === 'string') return answer;
    // If it's a Portable Text array, convert to string
    if (Array.isArray(answer)) return toPlainText(answer);
    return "";
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": getAnswerString(faq.answer) // ✅ Safely converted here
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}