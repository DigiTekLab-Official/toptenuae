// src/pages/api/amazon-sync.ts
import type { APIRoute } from 'astro';
import { handleAmazonSyncRequest } from '@/lib/amazon-sync-auth.mjs';

export const prerender = false;

const handle: APIRoute = async ({ request }) => handleAmazonSyncRequest(request, {
  secret: import.meta.env.AMAZON_SYNC_SECRET,
  enabled: import.meta.env.FEATURE_AMAZON_SYNC === 'true',
  sync: async () => {
    // Load the mutation-capable implementation only after authorization.
    const { fetchAndStoreDeals } = await import('@/lib/amazon-paapi/fetchDeals');
    return fetchAndStoreDeals();
  },
});

export const GET = handle;
export const POST = handle;
