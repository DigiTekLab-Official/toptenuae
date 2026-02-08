"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function GTM() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // ✅ PERFORMANCE FIX: Load GTM only after hydration completes
    // Wait for idle callback or 3 seconds max
    const timeoutId = setTimeout(() => setShouldLoad(true), 3000);
    
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = requestIdleCallback(() => {
        clearTimeout(timeoutId);
        setShouldLoad(true);
      }, { timeout: 3000 });
      
      return () => {
        clearTimeout(timeoutId);
        cancelIdleCallback(idleId);
      };
    }
    
    return () => clearTimeout(timeoutId);
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N3PB47W');
          `,
        }}
      />
    </>
  );
}
