// src/lib/amazon-paapi/fetchDeals.ts

import { createClient } from "next-sanity";
// @ts-ignore – amazon-paapi has no official TS types
import amazonPaapi from "amazon-paapi";

/* ------------------------------------------------------------------ */
/* 1. Sanity WRITE client (server-side only)                           */
/* ------------------------------------------------------------------ */
const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!, // REQUIRED
  apiVersion: "2024-01-01",
  useCdn: false, // must be false for writes
});

/* ------------------------------------------------------------------ */
/* 2. Amazon PA API parameters (UAE)                                   */
/* ------------------------------------------------------------------ */
const commonParameters = {
  AccessKey: process.env.AMAZON_ACCESS_KEY!,
  SecretKey: process.env.AMAZON_SECRET_KEY!,
  PartnerTag: process.env.AMAZON_PARTNER_TAG!,
  PartnerType: "Associates",
  Marketplace: "www.amazon.ae",
};

const requestParameters = {
  Keywords: "deals",
  SearchIndex: "All",
  ItemCount: 20,
  Resources: [
    "Images.Primary.Medium",
    "ItemInfo.Title",
    "Offers.Listings.Price",
    "CustomerReviews.StarRating",
    "CustomerReviews.Count",
  ],
};

/* ------------------------------------------------------------------ */
/* 3. Internal type (Sanity deal shape we write)                       */
/* ------------------------------------------------------------------ */
interface DealData {
  _type: "deal";
  asin: string;
  title: string;
  image?: string;
  affiliateLink: string;
  dealPrice?: number | null;
  originalPrice?: number | null;
  discountPercentage?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  isActive: boolean;
}

/* ------------------------------------------------------------------ */
/* 4. Main function                                                    */
/* ------------------------------------------------------------------ */
export async function fetchAndStoreDeals() {
  try {
    console.log("🔄 Fetching deals from Amazon PA API (UAE)...");

    const response = await amazonPaapi.SearchItems(
      commonParameters,
      requestParameters
    );

    const items = response?.Items ?? [];

    if (items.length === 0) {
      console.warn("⚠️ Amazon PA API returned 0 items");
      return { added: 0 };
    }

    /* -------------------------------------------------------------- */
    /* 5. Map Amazon → Sanity (API IS SOURCE OF TRUTH)                */
    /* -------------------------------------------------------------- */
    const deals: DealData[] = items.map((item: any) => {
      const listing = item.Offers?.Listings?.[0];
      const price = listing?.Price?.Amount ?? null;
      const mrp = listing?.Price?.SavingBasis?.Amount ?? null;
      const discount =
        listing?.Price?.Savings?.Percentage ??
        (price && mrp ? Math.round(((mrp - price) / mrp) * 100) : null);

      // 🔎 VERY IMPORTANT: log LIVE Amazon API prices (proof)
      console.log(
        "[AMAZON API]",
        item.ASIN,
        "PRICE:",
        price,
        "MRP:",
        mrp,
        "DISCOUNT:",
        discount
      );

      return {
        _type: "deal",
        asin: item.ASIN,
        title: item.ItemInfo?.Title?.DisplayValue ?? "Unknown product",
        image: item.Images?.Primary?.Medium?.URL,
        affiliateLink: item.DetailPageURL,
        dealPrice: price,
        originalPrice: mrp,
        discountPercentage: discount,
        rating: item.CustomerReviews?.StarRating ?? null,
        reviewCount: item.CustomerReviews?.Count ?? null,
        isActive: true,
      };
    });

    /* -------------------------------------------------------------- */
    /* 6. Write to Sanity (deterministic IDs)                          */
    /* -------------------------------------------------------------- */
    const transaction = sanityWriteClient.transaction();

    deals.forEach((deal) => {
      const docId = `deal-${deal.asin}`; // API-owned document

      transaction.createOrReplace({
        _id: docId,
        ...deal,
      });
    });

    await transaction.commit();

    console.log(`✅ Successfully synced ${deals.length} deals to Sanity`);
    return { added: deals.length };
  } catch (error) {
    console.error("❌ Amazon PA API sync failed:", error);
    throw error;
  }
}
