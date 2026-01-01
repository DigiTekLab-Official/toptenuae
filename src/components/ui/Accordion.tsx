'use client'

// src/components/ui/Accordion.tsx
import { Plus, Minus } from "lucide-react";
import PortableText from '@/components/PortableText'

interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: FAQItem[];
  title?: string; // Optional title if you want the component to render the header
  icon?: React.ReactNode;
}

export default function Accordion({ items, title, icon }: AccordionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
      
      {/* Optional Header Section */}
      {title && (
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {icon}
            {title}
          </h2>
        </div>
      )}
      
      {/* The List */}
      <div className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <AccordionItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}

function AccordionItem({ question, answer }: FAQItem) {
  return (
    <details className="group p-5 md:p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
      <summary className="flex cursor-pointer items-start justify-between gap-4 text-gray-900 font-bold group-open:text-primary transition-colors select-none">
        
        {/* Question Text */}
        <h3 className="text-base md:text-lg leading-snug">{question}</h3>
        
        {/* The Plus/Minus Icon Button */}
        <div className="relative shrink-0 flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-50 group-open:bg-primary text-primary group-open:text-white transition-all duration-300">
          {/* Plus Icon (Visible when closed) */}
          <Plus className="absolute w-4 h-4 md:w-5 md:h-5 opacity-100 group-open:opacity-0 rotate-0 group-open:rotate-90 transition-all duration-300" />
          
          {/* Minus Icon (Visible when open) */}
          <Minus className="absolute w-4 h-4 md:w-5 md:h-5 opacity-0 group-open:opacity-100 rotate-90 group-open:rotate-0 transition-all duration-300" />
        </div>

      </summary>
      
      {/* Answer Text */}
      <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-all duration-300 ease-in-out">
        <div className="overflow-hidden">
            {typeof answer === 'string' ? <p>{answer}</p> : typeof answer === 'object' ? <PortableText value={answer} /> : null}
        </div>
      </div>
    </details>
  );
}