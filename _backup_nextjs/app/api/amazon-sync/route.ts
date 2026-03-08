// src/app/api/amazon-sync/route.ts

import { NextResponse } from 'next/server';

// Try edge runtime first - if amazon-paapi doesn't work, we'll need to refactor
export const runtime = 'edge';

export async function GET() {
  try {
    // Import dynamically to avoid build-time issues
    const { fetchAndStoreDeals } = await import("@/lib/amazon-paapi/fetchDeals");
    const result = await fetchAndStoreDeals();

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Amazon sync error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Amazon sync failed" },
      { status: 500 }
    );
  }
}
