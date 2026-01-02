// src/components/analytics/GTM.tsx
'use client';

import Script from 'next/script';

export default function GTM() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-N3PB47W';

  return (
    <>
      <Script
        id="gtm-init"
        // ✅ CRITICAL: "lazyOnload" moves GTM execution to idle time.
        // This fixes the "Long Main Thread Tasks" error in Lighthouse.
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
    </>
  );
}