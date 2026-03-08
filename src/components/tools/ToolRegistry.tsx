// src/components/tools/ToolRegistry.tsx
import { lazy, Suspense } from 'react';
import { Loader2 } from "@/components/icons";

import VatCalculator from './VatCalculator';

const GratuityCalculator = lazy(() => import('./GratuityCalculator'));
const ZakatCalculator = lazy(() => import('./ZakatCalculator'));

const TOOLS_MAP: Record<string, React.ComponentType<any>> = {
  'gratuity-uae': GratuityCalculator,
  'zakat-uae': ZakatCalculator,
  'vat-uae': VatCalculator,
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
        Error: Calculator ID <strong>&quot;{id}&quot;</strong> not found.
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  );
}