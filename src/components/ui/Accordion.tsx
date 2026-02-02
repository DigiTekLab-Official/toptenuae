"use client";

import { Plus, Minus } from "lucide-react";
import PortableText from "@/components/sanity/PortableText";

interface FAQItem {
  question: string;
  answer: string | any;
}

interface AccordionProps {
  items: FAQItem[];
  title?: string; 
  icon?: React.ReactNode;
}

export default function Accordion({ items, title, icon }: AccordionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
      
      {/* Optional Header Section */}
      {title && (
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
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
    <details className="group [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
      <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 md:p-6 text-gray-900 font-bold group-open:bg-blue-50/30 group-open:text-blue-700 transition-colors select-none">
        
        {/* Question Text */}
        <h3 className="text-base md:text-lg leading-snug">{question}</h3>
        
        {/* The Plus/Minus Icon Button */}
        <div className="relative shrink-0 flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-50 group-open:bg-blue-600 text-blue-600 group-open:text-white transition-all duration-300 mt-0.5">
          {/* Plus Icon (Visible when closed) */}
          <Plus className="absolute w-4 h-4 md:w-5 md:h-5 opacity-100 rotate-0 group-open:opacity-90 group-open:rotate-90 transition-all duration-300" />
          
          {/* Minus Icon (Visible when open) */}
          <Minus className="absolute w-4 h-4 md:w-5 md:h-5 opacity-0 -rotate-90 group-open:opacity-100 group-open:rotate-0 transition-all duration-300" />
        </div>

      </summary>
      
      {/* Answer Text - Support both string and PortableText blocks */}
      <div className="px-5 md:px-6 pb-6 pt-2 text-gray-700 leading-relaxed text-base">
        {typeof answer === 'string' ? (
          <p>{answer}</p>
        ) : (
          (() => {
            // Normalize answer to always be an array for PortableText
            const normalizedAnswer = Array.isArray(answer) ? answer : (answer ? [answer] : []);
            return <PortableText value={normalizedAnswer} />;
          })()
        )}
      </div>
    </details>
  );
}