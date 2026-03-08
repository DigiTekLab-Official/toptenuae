// src/pages/api/amazon-sync.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const { fetchAndStoreDeals } = await import('@/lib/amazon-paapi/fetchDeals');
    const result = await fetchAndStoreDeals();

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Amazon sync error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Amazon sync failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
