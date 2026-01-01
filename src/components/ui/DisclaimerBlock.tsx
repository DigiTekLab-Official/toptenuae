// src/components/ui/DisclaimerBlock.tsx
import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface DisclaimerProps {
  type?: 'medical' | 'general'; 
}

export default function DisclaimerBlock({ type = 'general' }: DisclaimerProps) {
  return (
    <div className="mt-12">
      
      {/* SAFETY / MEDICAL WARNING (Grey Box) */}
      <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 leading-relaxed shadow-sm">
        <div className="flex items-center gap-2 mb-3 font-bold uppercase tracking-wide text-xs text-red-700">
          <AlertTriangle className="w-4 h-4" />
          <span>{type === 'medical' ? "Important Medical Disclaimer" : "Product Safety Disclaimer"}</span>
        </div>

        {type === 'medical' ? (
          <p>
            The information provided in this article is for <strong>educational purposes only</strong> and 
            does not constitute medical advice. Always consult with a <strong>pediatrician or dermatologist</strong> 
            before using new skincare or health products, especially on babies or sensitive skin. 
            Individual results may vary.
          </p>
        ) : (
          <p>
            While we select products with high safety ratings, always read the user manual and 
            manufacturer's safety warnings before use. Specifications (such as voltage or materials) 
            may change without notice. <strong>TopTenUAE</strong> is not responsible for misuse of any recommended products.
          </p>
        )}
        
        {/* Optional: Add a subtle 'Verified' badge if you want to reassure users */}
        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Independent Research • Reader Supported</span>
        </div>
      </div>

    </div>
  );
}