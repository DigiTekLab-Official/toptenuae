// src/app/api/amazon-sync/route.ts

import { fetchAndStoreDeals } from "@/lib/amazon-paapi/fetchDeals";

export const runtime = "nodejs"; // REQUIRED for amazon-paapi

export async function GET() {
  try {
    const result = await fetchAndStoreDeals();

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Amazon sync error:", error);
    return Response.json(
      { success: false, error: "Amazon sync failed" },
      { status: 500 }
    );
  }
}
