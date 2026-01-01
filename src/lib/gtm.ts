// src/lib/gtm.ts
type GTMEvent = {
  event: string;
  [key: string]: any; // Allow any other properties like product_name, price, etc.
};

export const sendGTMEvent = (data: GTMEvent) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push(data);
  } else {
    console.log('GTM Event (Dev Mode):', data);
  }
};