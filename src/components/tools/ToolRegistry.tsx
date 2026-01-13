// src/components/tools/ToolRegistry.tsx
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// ✅ FIX: Import VAT Calculator directly so it renders on the Server
import VatCalculator from './VatCalculator';

// Keep other heavy tools lazy if you prefer
const GratuityCalculator = dynamic(() => import('./GratuityCalculator'), { loading: () => <LoadingSpinner /> });
const ZakatCalculator = dynamic(() => import('./ZakatCalculator'), { loading: () => <LoadingSpinner /> });

const TOOLS_MAP: Record<string, React.ComponentType<any>> = {
  'gratuity-uae': GratuityCalculator,
  'zakat-uae': ZakatCalculator,
  'vat-uae': VatCalculator, // ✅ Now SSR Compatible
};

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
      <p className="text-sm text-slate-400 font-medium">Loading Tool...</p>
    </div>
  );
}

export default function ToolRenderer({ id }: { id: string }) {
  const Component = TOOLS_MAP[id];

  if (!Component) {
    return (
      <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-center">
        Error: Calculator ID <strong>"{id}"</strong> not found.
      </div>
    );
  }

  return <Component />;
}