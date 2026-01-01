// src/components/analytics/GTM.tsx
import { GoogleTagManager } from '@next/third-parties/google';

export default function GTM() {
  // Use the Environment Variable, fall back to hardcoded string if missing
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-N3PB47W';

  return <GoogleTagManager gtmId={gtmId} />;
}