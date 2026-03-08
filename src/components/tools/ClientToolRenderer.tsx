// src/components/tools/ClientToolRenderer.tsx
import { lazy, Suspense } from "react";

const ToolRegistry = lazy(() => import("@/components/tools/ToolRegistry"));

export default function ClientToolRenderer({ id }: { id: string }) {
  return (
    <Suspense fallback={<div className="h-96 w-full bg-slate-50 rounded-xl animate-pulse" />}>
      <ToolRegistry id={id} />
    </Suspense>
  );
}