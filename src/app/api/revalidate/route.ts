// src/app/api/revalidate/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody(
      req,
      process.env.SANITY_WEBHOOK_SECRET!
    )

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    // Decide which paths to purge based on content type
    const pathsToPurge: string[] = ['/']

    switch (body._type) {
      case 'howTo':
        pathsToPurge.push('/how-to-guides')
        break
      case 'holiday':
        pathsToPurge.push('/events-holidays')
        break
      case 'deals':
        pathsToPurge.push('/deals')
        break
      case 'topTenList':
        pathsToPurge.push('/top-ten')
        break
      case 'article':
        if (body.slug) pathsToPurge.push(`/articles/${body.slug}`)
        break
      case 'product':
        if (body.slug) pathsToPurge.push(`/products/${body.slug}`)
        break
    }

    // Purge Cloudflare cache
    if (process.env.CLOUDFLARE_ZONE_ID && process.env.CLOUDFLARE_API_TOKEN) {
      await fetch(
        `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files: pathsToPurge.map(p => `https://toptenuae.com${p}`) }),
        }
      )
    }

    // Optionally trigger a rebuild via Cloudflare Pages Build Hook
    if (process.env.CLOUDFLARE_BUILD_HOOK_URL) {
      await fetch(process.env.CLOUDFLARE_BUILD_HOOK_URL, { method: 'POST' })
    }

    return NextResponse.json({ revalidated: true, purged: pathsToPurge, now: Date.now() })
  } catch (err: any) {
    console.error('Revalidation error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
