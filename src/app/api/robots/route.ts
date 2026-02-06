// src/app/api/robots/route.ts
import { NextRequest, NextResponse } from 'next/server';

// ✅ CORRECT CONFIG: Force dynamic, but let OpenNext manage the runtime.
// DO NOT add "export const runtime = 'edge';" here.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://toptenuae.com';

  const robotsTxt = `# TopTenUAE.com Robots.txt
User-agent: *
Allow: /
Disallow: /studio/
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /webmail/
Disallow: /cpanel/
Disallow: /cgi-bin/
Disallow: /wp-admin/
Disallow: /wp-includes/
Disallow: /wp-content/
Disallow: /*?s=
Disallow: /*?ref=
Disallow: /*?utm_
Disallow: /*?fbclid
Disallow: /*?gclid
Disallow: /*?noamp
Disallow: /search/
Disallow: /thank-you
Disallow: /phpinfo.php
Disallow: /*.php
Disallow: /feed/
Disallow: /index.php/
Disallow: /sample-page/

User-agent: Bingbot
Disallow: /studio/
Disallow: /api/
Disallow: /search/

User-agent: Slurp
Disallow: /studio/
Disallow: /api/

# AI Bots - Allowed (but restricted from private/admin areas)
User-agent: GPTBot
Disallow: /studio/
Disallow: /api/

User-agent: ChatGPT-User
Disallow: /studio/
Disallow: /api/

User-agent: OAI-SearchBot
Disallow: /studio/
Disallow: /api/

User-agent: Google-Extended
Disallow: /studio/
Disallow: /api/

User-agent: Applebot
Disallow: /studio/
Disallow: /api/

User-agent: PerplexityBot
Disallow: /studio/
Disallow: /api/

User-agent: ClaudeBot
Disallow: /studio/
Disallow: /api/

# Throttled Bots (Aggressive crawlers)
User-agent: AhrefsBot
Crawl-delay: 10
Disallow: /studio/
Disallow: /api/

User-agent: SemrushBot
Crawl-delay: 10
Disallow: /studio/
Disallow: /api/

User-agent: DotBot
Crawl-delay: 10
Disallow: /studio/
Disallow: /api/

User-agent: MJ12bot
Crawl-delay: 10
Disallow: /studio/
Disallow: /api/

User-agent: BLEXBot
Crawl-delay: 10
Disallow: /studio/
Disallow: /api/

User-agent: Bytespider
Crawl-delay: 10
Disallow: /studio/
Disallow: /api/

# Blocked Bots (Junk/Spam)
User-agent: ia_archiver
Disallow: /

User-agent: MegaIndex
Disallow: /

User-agent: SeznamBot
Disallow: /

User-agent: Uptimebot
Disallow: /

User-agent: Mauibot
Disallow: /

User-agent: LieBaoFast
Disallow: /

User-agent: PC6spider
Disallow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
}