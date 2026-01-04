// src/components/money/DataDisclaimer.tsx
'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DataDisclaimerProps {
  disclaimer: string;
  sources: string[];
  lastUpdated: string;
}

export default function DataDisclaimer({ disclaimer, sources, lastUpdated }: DataDisclaimerProps) {
  return (
    <section className="mt-12 py-6 border-t border-gray-200">
      {/* Disclaimer Box */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <span className="font-semibold block mb-1">Disclaimer:</span>
            {disclaimer || "Rates are for informational purposes only. Actual prices may vary by retailer."}
          </div>
        </div>
      </div>

      {/* Sources & Time */}
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span>Data Sources:</span>
          <div className="flex space-x-2">
            {sources?.map((source, index) => (
              <span key={index} className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                {source}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          Last API Update: <span className="font-mono text-gray-600">{lastUpdated}</span>
        </div>
      </div>
    </section>
  );
}