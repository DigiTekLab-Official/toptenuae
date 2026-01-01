// src/components/tools/ClientToolRenderer.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";

// ✅ This logic is allowed here because of the "use client" directive above
const ToolRegistry = dynamic(() => import("@/components/tools/ToolRegistry"), {
  ssr: false, // Prevents hydration mismatches for calculators/tools
  loading: () => <div className="h-96 w-full animate-pulse bg-white/10 rounded-xl" />
});

interface ClientToolRendererProps {
  id: string;
}

export default function ClientToolRenderer({ id }: ClientToolRendererProps) {
  return <ToolRegistry id={id} />;
}