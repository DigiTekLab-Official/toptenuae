import { revalidateTag, revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

// ✅ CRITICAL FIX: Forces this route to be dynamic.
// Without this, Next.js/Cloudflare may treat it as a static page, 
// causing the "405 Method Not Allowed" error on POST requests.
export const dynamic = 'force-dynamic';

/**
 * SANITY WEBHOOK HANDLER (Production Ready 2026)
 * * Triggered by: Sanity Webhook (Manage -> API -> Webhooks)
 * * Security: Verifies the 'sanity-webhook-signature' header
 * * Required Env Var: SANITY_WEBHOOK_SECRET
 */

export async function POST(req: NextRequest) {
  try {
    // 1. Secure Signature Verification
    // This parses the body AND checks the cryptographic signature from Sanity
    const { isValidSignature, body } = await parseBody(
      req, 
      process.env.SANITY_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      console.error('❌ Invalid Sanity Signature');
      return new NextResponse('Unauthorized: Invalid Signature', { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse('Bad Request: Missing _type', { status: 400 });
    }

    console.log(`🔄 Revalidating: ${body._type} | Slug: ${body.slug}`);

    // 2. Revalidate Data Tags (The "Sanity Way")
    // Purges all fetches tagged with this type.
    // @ts-expect-error: Next.js 16 signature mismatch (requires 2 args)
    revalidateTag(body._type);
    
    // Purge the specific document slug
    if (body.slug) {
      // @ts-expect-error: Next.js 16 signature mismatch
      revalidateTag(body.slug);
    }

    // Purge Global Lists & Related Content
    // ✅ CRITICAL: When a Product changes, we must purge Articles/Reviews too.
    if (['howTo', 'topTenList', 'article', 'product', 'deal'].includes(body._type)) {
      // @ts-expect-error: Next.js 16 signature mismatch
      revalidateTag('home-feed');
      // @ts-expect-error: Next.js 16 signature mismatch
      revalidateTag('category-lists');
      
      // Force refresh of Lists and Review Pages
      // @ts-expect-error: Next.js 16 signature mismatch
      revalidateTag('topTenList');
      // @ts-expect-error: Next.js 16 signature mismatch
      revalidateTag('article'); 
      // @ts-expect-error: Next.js 16 signature mismatch
      revalidateTag('howTo');   
      
      // Nuclear option: clear homepage cache to be absolutely sure
      revalidatePath('/', 'layout'); 
    }

    // 3. "Shotgun" Path Revalidation (Aggressive Cache Clearing)
    // We attempt to purge ALL possible URL structures for this slug to guarantee
    // the page updates, even if the category mapping is tricky.
    if (body.slug) {
      const slug = body.slug;
      // ✅ FIX: Force String() to prevent "Type {} cannot be used as index" error
      const category = String(body.category || 'reviews');

      // List of all possible URL prefixes your site uses
      const possiblePaths = [
        `/${category}/${slug}`,       // The detected category
        `/reviews/${slug}`,           // Common fallback
        `/tech/${slug}`,              // Common fallback
        `/top-ten/${slug}`,           // Common fallback
        `/how-to-guides/${slug}`,     // Common fallback
        `/smartwatches/${slug}`       // Specific niche fallback
      ];

      // Purge every single one
      possiblePaths.forEach((path) => {
        // console.log(`🔫 Shotgun Purge: ${path}`);
        revalidatePath(path);
      });
    }

    return NextResponse.json({
      status: 'success',
      revalidated: true,
      now: Date.now(),
      body
    });

  } catch (err: any) {
    console.error('⚡ Revalidation Error:', err.message);
    return new NextResponse(err.message, { status: 500 });
  }
}

// Optional: Keep GET for manual testing if needed (Insecure mode)
export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  const path = request.nextUrl.searchParams.get('path');

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Invalid Secret' }, { status: 401 });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: path, now: Date.now() });
  }

  return NextResponse.json({ message: 'Missing path param' }, { status: 400 });
}