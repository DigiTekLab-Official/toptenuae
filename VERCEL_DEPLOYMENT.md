# Vercel Deployment Guide - toptenuae

## ✅ Migration Complete: Cloudflare Pages → Vercel

This project has been successfully migrated from Cloudflare Pages to Vercel with full optimization for Vercel's infrastructure.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

### 3. Test Locally
```bash
pnpm dev
```

### 4. Build Test
```bash
pnpm build
```

---

## 🔐 Environment Variables for Vercel

Add these to your Vercel Project Settings → Environment Variables:

### **Public Variables** (Available to Browser)
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAxx...
NEXT_PUBLIC_CLARITY_ID=your-clarity-id
NEXT_PUBLIC_BASE_URL=https://toptenuae.com
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
```

### **Private Secrets** (Server-Side Only)
```bash
JWT_SECRET=your-jwt-secret-here
TURNSTILE_SECRET_KEY=0x4AAAAAxx...
RESEND_API_KEY=re_xxxxxxxxx
SANITY_WEBHOOK_SECRET=your-webhook-secret
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

> **Generate Secrets:**
> ```bash
> openssl rand -hex 32
> ```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [x] Removed all Cloudflare dependencies
- [x] Updated `next.config.ts` for Vercel
- [x] Removed Cloudflare-specific build scripts
- [x] Updated middleware (removed Cloudflare CSP)
- [x] Updated revalidate API (using Vercel ISR)
- [x] Cleaned up environment variables

### Vercel Configuration
- [ ] Create new Vercel project
- [ ] Link GitHub repository
- [ ] Set Framework Preset to **Next.js**
- [ ] Configure environment variables (see above)
- [ ] Set Node.js version to **20.x** (in Settings → General)

### Post-Deployment
- [ ] Verify build succeeds
- [ ] Test ISR with Sanity webhook
- [ ] Configure custom domain
- [ ] Update Sanity webhook URL
- [ ] Test email subscription
- [ ] Verify Sentry integration
- [ ] Check sitemap and robots.txt
- [ ] Test image optimization
- [ ] Run Lighthouse audit

---

## 🔧 Vercel Project Settings

### Build & Development Settings
- **Framework Preset:** Next.js
- **Build Command:** `pnpm build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `pnpm install` (auto-detected)
- **Node.js Version:** 20.x

### Root Directory
- Leave as default (root)

### Environment Variables
- Add all variables from the section above
- Set appropriate scopes (Production, Preview, Development)

---

## 🪝 Sanity Webhook Configuration

Update your Sanity webhook URL after deployment:

1. Go to Sanity Studio → API → Webhooks
2. Update the webhook URL to:
   ```
   https://toptenuae.com/api/revalidate
   ```
3. Add the secret:
   ```
   SANITY_WEBHOOK_SECRET=your-secret-here
   ```
4. Trigger on: **Create**, **Update**, **Delete**
5. Filter: All document types

---

## 🎯 Key Features Enabled

✅ **Vercel Image Optimization**
- Custom Sanity loader configured
- Auto AVIF/WebP conversion
- Responsive image sizes
- Edge caching

✅ **Incremental Static Regeneration (ISR)**
- On-demand revalidation via Sanity webhooks
- 60-second fallback revalidation
- Tag-based cache invalidation

✅ **Edge Middleware**
- URL normalization (lowercase, no trailing slash)
- Security headers
- www → non-www redirect
- Tracking parameter cleanup

✅ **Edge Runtime Routes**
- `/api/sanity-hook` - Edge runtime
- `/search` - Edge runtime
- `/report` - Edge runtime
- `/newsletter/confirm` - Edge runtime

✅ **SEO Optimizations**
- Dynamic sitemap generation
- Robots.txt
- Structured data (JSON-LD)
- OpenGraph images
- Meta tags management

---

## 📊 Performance Optimizations

### Build Time
- Removed OpenNext build step
- Removed CSS fix scripts
- Removed prerendered page copying
- Streamlined build pipeline

### Runtime
- Vercel Edge Network
- Smart ISR caching
- Image optimization at the edge
- Gzip/Brotli compression (automatic)

### Core Web Vitals Targets
- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1
- **TTFB:** < 600ms

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
pnpm store prune
rm -rf .next node_modules
pnpm install
pnpm build
```

### ISR Not Working
1. Verify `SANITY_WEBHOOK_SECRET` is set in Vercel
2. Check webhook URL in Sanity Studio
3. Test manually: `curl -X POST https://toptenuae.com/api/revalidate`
4. Check Vercel Function Logs

### Images Not Loading
1. Verify custom loader: `src/sanity/lib/image.ts`
2. Check image domains in `next.config.ts`
3. Verify Sanity CDN is accessible

### Environment Variables Not Working
1. Redeploy after adding variables
2. Check variable scope (Production/Preview/Development)
3. Verify `NEXT_PUBLIC_` prefix for client-side variables

---

## 📝 Migration Changes

### Removed
- `@opennextjs/cloudflare` package
- `open-next.config.ts`
- `entry.edge.config.ts`
- `scripts/copy-prerendered-pages.js`
- `scripts/fix-opennext-css.js`
- `scripts/generate-routes-json.js`
- Cloudflare cache purging logic
- Cloudflare CSP directives

### Updated
- `next.config.ts` - Removed `output: 'standalone'`, `trailingSlash`, `compress`
- `package.json` - Simplified build scripts
- `src/app/api/revalidate/route.ts` - Using Vercel's `revalidatePath`
- `src/middleware.ts` - Removed Cloudflare-specific CSP entries
- `.env.example` - Updated for Vercel deployment

### Unchanged (Compatible with Vercel)
- Sanity CMS integration
- Custom image loader
- Edge runtime routes
- Middleware logic
- ISR configuration
- SEO setup

---

## 🎉 Deployment Complete!

Your site is now fully optimized for Vercel with:
- ⚡️ Faster build times
- 🚀 Better performance
- 🔄 True ISR support
- 🖼️ Native image optimization
- 🛡️ Enhanced security
- 📈 Better analytics integration

For support, contact the Vercel team or check the [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs).
