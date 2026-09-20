// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import {
  AI_REFERRAL_COOKIE_MAX_AGE_SECONDS,
  AI_REFERRAL_COOKIE_NAME,
  getAiReferralAttribution,
  serializeAiReferralAttribution,
} from '@/lib/analytics/ai-referral-attribution.js';
import { getLegacyRedirect, isKnownGonePath } from '@/lib/seo/legacy-redirects';

const TRACKING_PARAMETERS = [
  'fbclid',
  'gclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'ref',
] as const;

export const onRequest = defineMiddleware(async ({ request, url, redirect, cookies }, next) => {
  const hostname = request.headers.get('host') || '';

  // Skip static assets and API routes
  // NOTE: keep the `.` check LAST and be aware it also skips any path containing
  // a dot. That's fine for assets, but means dotted content slugs (none today)
  // would bypass normalization. Revisit if slugs ever contain dots.
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_astro') ||
    url.pathname.startsWith('/static') ||
    url.pathname === '/sitemap.xml' ||
    url.pathname === '/robots.txt' ||
    url.pathname.includes('.')
  ) {
    return next();
  }

  // Security blocklist
  if (
    hostname.startsWith('webmail.') ||
    hostname.startsWith('cpanel.') ||
    url.pathname.includes('.php') ||
    url.pathname.startsWith('/cgi-bin/')
  ) {
    return new Response('Not Found', { status: 404 });
  }

  // Build one normalized candidate URL before deciding whether to redirect.
  // The exact legacy lookup below uses this normalized pathname, so host, case,
  // slash and tracking cleanup are folded into the same single response.
  let needsRedirect = false;
  const newUrl = new URL(url);
  const incomingAiAttribution = getAiReferralAttribution({
    utmSource: url.searchParams.get('utm_source'),
    referrer: request.headers.get('referer'),
  });

  // 1. Force non-www
  if (newUrl.hostname.startsWith('www.')) {
    newUrl.hostname = newUrl.hostname.replace(/^www\./, '');
    needsRedirect = true;
  }

  // 2. Force lowercase path
  if (newUrl.pathname !== newUrl.pathname.toLowerCase()) {
    newUrl.pathname = newUrl.pathname.toLowerCase();
    needsRedirect = true;
  }

  // 3. Strip trailing slash HERE (was previously delegated to Astro core, which
  //    runs AFTER middleware and caused a second hop). Root path is exempt.
  if (newUrl.pathname !== '/' && newUrl.pathname.endsWith('/')) {
    newUrl.pathname = newUrl.pathname.replace(/\/+$/, '');
    needsRedirect = true;
  }

  // 4. Strip only the audited tracking parameters. Every other query parameter
  // remains on the canonical destination.
  for (const param of TRACKING_PARAMETERS) {
    if (newUrl.searchParams.has(param)) {
      newUrl.searchParams.delete(param);
      needsRedirect = true;
    }
  }

  // Known deleted URLs are terminal. Check the normalized path before emitting
  // a normalization redirect so slash/case/tracking variants return 410 now.
  if (isKnownGonePath(newUrl.pathname)) {
    return new Response('Gone', { status: 410 });
  }

  // 5. Exact audited migration lookup. Changing only pathname preserves every
  // non-tracking query parameter already present on newUrl.
  const legacyDestination = getLegacyRedirect(newUrl.pathname);
  if (legacyDestination) {
    newUrl.pathname = legacyDestination;
    needsRedirect = true;
  }

  if (needsRedirect) {
    if (incomingAiAttribution) {
      cookies.set(
        AI_REFERRAL_COOKIE_NAME,
        serializeAiReferralAttribution(incomingAiAttribution),
        {
          path: '/',
          maxAge: AI_REFERRAL_COOKIE_MAX_AGE_SECONDS,
          httpOnly: true,
          sameSite: 'lax',
          secure: url.protocol === 'https:',
        }
      );
    }
    return redirect(newUrl.toString(), 301);
  }

  // Continue and add security headers (unchanged)
  const hadAiReferralCookie = cookies.has(AI_REFERRAL_COOKIE_NAME);
  const response = await next();
  const isSuccessfulHtml =
    response.status >= 200 &&
    response.status < 300 &&
    response.headers.get('content-type')?.includes('text/html');

  if (hadAiReferralCookie && isSuccessfulHtml) {
    cookies.delete(AI_REFERRAL_COOKIE_NAME, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: url.protocol === 'https:',
    });
  }

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://challenges.cloudflare.com",
    "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https://cdn.sanity.io https://placehold.co https://toptenuae.com https://lh3.googleusercontent.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.clarity.ms https://c.bing.com https://m.media-amazon.com https://images-na.ssl-images-amazon.com https://images-eu.ssl-images-amazon.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.clarity.ms https://challenges.cloudflare.com",
    "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set(
    'Referrer-Policy',
    url.pathname === '/newsletter/confirm' ? 'no-referrer' : 'strict-origin-when-cross-origin'
  );
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  return response;
});
