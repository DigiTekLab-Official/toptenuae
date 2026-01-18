"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function Clarity() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // ✅ PERFORMANCE FIX: Force a 4.5-second delay.
    // We delay this slightly longer than GTM to prevent network congestion.
    const timer = setTimeout(() => setShouldLoad(true), 4500);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
      <Script
        id="microsoft-clarity-init"
        strategy="afterInteractive" // We handle the delay manually above
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ufh2gge4oq");
          `,
        }}
      />
    </>
  );
}