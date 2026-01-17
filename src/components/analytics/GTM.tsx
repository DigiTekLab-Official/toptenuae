// src/components/analytics/GTM.tsx
'use client';

import Script from 'next/script';

// Export the ID so we don't hardcode it twice
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-N3PB47W';

export default function GTM() {
  return (
    <>
      {/* ✅ PERFORMANCE FIX: Keep lazyOnload strategy to prevent blocking main thread */}
      <Script
        id="gtm-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
}