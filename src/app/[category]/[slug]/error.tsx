"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Article Error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <div className="mb-6 flex justify-center">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 mb-4">
        Content Unavailable
      </h1>
      
      <p className="text-lg text-slate-600 mb-8">
        The article or product you are looking for cannot be displayed at this moment. 
        It may have been moved or we are experiencing a temporary system error.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={reset}
          className="px-8 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors"
        >
          Refresh Page
        </button>
        
        <Link
          href="/"
          className="px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}