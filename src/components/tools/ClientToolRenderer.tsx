// src/components/tools/ClientToolRenderer.tsx
"use client";
import dynamic from "next/dynamic";
import React from "react";

// ✅ FIX: Allow SSR so Google sees the tool immediately
const ToolRegistry = dynamic(() => import("@/components/tools/ToolRegistry"), {
  // ssr: false, <--- DELETE THIS LINE
  loading: () => <div className="h-96 w-full bg-slate-50 rounded-xl animate-pulse" />
});

export default function ClientToolRenderer({ id }: { id: string }) {
  return <ToolRegistry id={id} />;
}