// src/components/FAQAccordion.tsx
import Accordion from "@/components/ui/Accordion";
import { HelpCircle } from "lucide-react";

interface FAQAccordionProps {
  faqs: { _key: string; question: string; answer: string }[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  return (
    <Accordion 
      items={faqs}
      title="Frequently Asked Questions"
      icon={<HelpCircle className="w-6 h-6 text-primary" />}
    />
  );
}