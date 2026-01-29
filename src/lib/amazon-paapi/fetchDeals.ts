// src/lib/amazon-paapi/fetchDeals.ts

import { client } from "@/sanity/lib/client";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type AmazonProduct = {
  asin: string;
  title: string;
  price?: number;
  listPrice?: number;
  detailPageURL: string;
  imageUrl?: string;
};

/* ------------------------------------------------------------------ */
/* Fetch + Store Deals (Safe, Compilable)                              */
/* ------------------------------------------------------------------ */
export async function fetchAndStoreDeals(): Promise<{
  added: number;
  total: number;
}> {
  try {
    const products = await searchAmazonProducts({
      keywords: "electronics deals",
      marketplace: "www.amazon.ae",
    });

    const deals = products.filter(
      (p) => p.listPrice && p.price && p.price < p.listPrice
    );

    let addedCount = 0;

    for (const p of deals) {
      await client.createOrReplace({
        _type: "deal",
        _id: `deal-${p.asin}`,
        slug: { _type: "slug", current: p.asin },
        title: p.title,
        dealPrice: p.price,
        originalPrice: p.listPrice,
        discountPercentage: Math.round(
          ((p.listPrice! - p.price!) / p.listPrice!) * 100
        ),
        affiliateLink: p.detailPageURL,
        imageUrl: p.imageUrl,
        topTenCategory: "Electronics",
        isActive: true,
      });
      addedCount++;
    }

    return {
      added: addedCount,
      total: products.length,
    };
  } catch (error) {
    console.error("Error in fetchAndStoreDeals:", error);
    throw error;
  }
}

/* ------------------------------------------------------------------ */
/* Amazon PA-API Search (Placeholder, BUT VALID)                       */
/* ------------------------------------------------------------------ */
async function searchAmazonProducts(params: {
  keywords: string;
  marketplace: string;
}): Promise<AmazonProduct[]> {
  console.warn(
    "searchAmazonProducts(): Amazon PA-API not wired yet. Returning empty array."
  );

  // ✅ MUST return an array to satisfy TypeScript
  return [];
}
