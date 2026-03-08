// src/pages/api/revalidate.ts
// Sanity webhook handler — purges Cloudflare cache on content changes
import type { APIRoute } from 'astro';
import * as crypto from 'node:crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const webhookSecret = import.meta.env.SANITY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response('Webhook secret not configured', { status: 500 });
    }

    // Verify Sanity webhook signature
    const signature = request.headers.get('sanity-webhook-signature');
    const body = await request.text();

    if (signature) {
      const hmac = crypto.createHmac('sha256', webhookSecret);
      hmac.update(body);
      const expectedSignature = hmac.digest('hex');

      if (signature !== expectedSignature) {
        return new Response('Invalid signature', { status: 401 });
      }
    }

    const payload = JSON.parse(body);

    if (!payload?._type) {
      return new Response('Bad Request', { status: 400 });
    }

    // On Cloudflare Pages, there's no ISR revalidation.
    // Instead, we can purge the Cloudflare cache via API if a zone is configured,
    // or simply rely on short TTLs + stale-while-revalidate headers.
    const cfApiToken = import.meta.env.CF_API_TOKEN;
    const cfZoneId = import.meta.env.CF_ZONE_ID;

    if (cfApiToken && cfZoneId) {
      // Purge everything (simplest approach for content updates)
      await fetch(`https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(cfZoneId)}/purge_cache`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purge_everything: true }),
      });
    }

    return new Response(
      JSON.stringify({
        revalidated: true,
        type: payload._type,
        slug: payload.slug,
        now: Date.now(),
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Revalidation error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(message, { status: 500 });
  }
};
