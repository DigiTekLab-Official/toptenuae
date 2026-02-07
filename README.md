# TopTenUAE - Next.js + Sanity CMS

> **🎉 Recently Migrated:** This project has been migrated from Cloudflare Pages to Vercel. See [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) for details.

A modern Next.js 14+ website for product reviews, buying guides, and expert recommendations focused on the UAE market, powered by Sanity CMS.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x
- pnpm 8+
- Vercel account (for deployment)

### Installation
```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# Run development server
pnpm dev
```

Visit http://localhost:3000

---

## 📦 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **CMS:** Sanity v3
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel
- **Language:** TypeScript
- **Image Optimization:** Vercel Image Optimization + Sanity CDN
- **Analytics:** Google Analytics, Google Tag Manager, Microsoft Clarity
- **Error Tracking:** Sentry
- **Email:** Resend
- **Bot Protection:** Cloudflare Turnstile

---

## 🗂️ Project Structure

```
toptenuae/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (site)/            # Main site routes
│   │   ├── api/               # API routes (revalidate, subscribe, etc.)
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── views/             # Page-level view components
│   │   ├── sanity/            # Sanity-specific components
│   │   └── ui/                # Reusable UI components
│   ├── sanity/                # Sanity configuration
│   │   ├── lib/               # Sanity client, queries, image helpers
│   │   └── schemaTypes/       # Content schemas
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── scripts/                   # Build scripts
│   ├── generate-sitemap.mjs   # Dynamic sitemap generation
│   └── ping-engines.mjs       # Search engine notification
├── sanity.config.ts           # Sanity Studio config
├── sanity.types.ts            # Auto-generated Sanity types
└── next.config.ts             # Next.js configuration
```

---

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint

# Sanity
pnpm sanity:typegen   # Generate TypeScript types from Sanity schema
```

---

## 🌍 Environment Variables

See [.env.example](./.env.example) for all required environment variables.

**Key Variables:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `SANITY_WEBHOOK_SECRET` - For ISR revalidation
- `JWT_SECRET` - For email confirmation tokens
- `RESEND_API_KEY` - For transactional emails
- `TURNSTILE_SECRET_KEY` - Bot protection

---

## 🚀 Deployment to Vercel

### Quick Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Via Dashboard
1. Import repository: https://vercel.com/new
2. Framework Preset: **Next.js** (auto-detected)
3. Add environment variables (see `.env.example`)
4. Deploy!

**Full Guide:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)  
**Quick Reference:** [DEPLOY_NOW.md](./DEPLOY_NOW.md)

---

## 🔄 Content Management

### Sanity Studio
Access your Sanity Studio at `/studio` (when running locally or deployed).

### Content Revalidation
The site uses ISR (Incremental Static Regeneration). When content is updated in Sanity:
1. Sanity webhook triggers `/api/revalidate`
2. Vercel revalidates affected pages
3. New content appears within seconds

**Configure Webhook:**
- URL: `https://yourdomain.com/api/revalidate`
- Secret: Use value from `SANITY_WEBHOOK_SECRET`
- Trigger: Create, Update, Delete

---

## 🖼️ Image Optimization

Images are optimized through:
1. **Sanity CDN** - Source transformation
2. **Custom Loader** - `src/sanity/lib/image.ts`
3. **Vercel Image Optimization** - Auto AVIF/WebP conversion

**Key Functions:**
- `mainImage()` - Hero/LCP images (1200px, quality 75)
- `listImage()` - Card images (800px, quality 80)
- `blurImage()` - Blur placeholders (20px, quality 10)
- `ogImage()` - Social media (1200x630, quality 85)

---

## 📊 Performance Targets

- **Lighthouse Score:** 90+
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTFB (Time to First Byte):** < 600ms

---

## 🛡️ Security Features

- CSP (Content Security Policy) via middleware
- HTTPS enforcement
- XSS protection headers
- Bot protection (Cloudflare Turnstile)
- Rate limiting on API routes
- JWT-based email verification

---

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### ISR Not Working
1. Check `SANITY_WEBHOOK_SECRET` in Vercel
2. Verify webhook URL in Sanity Studio
3. Test: `curl -X POST https://yourdomain.com/api/revalidate`

### Images Not Loading
1. Verify custom loader: `src/sanity/lib/image.ts`
2. Check remote patterns in `next.config.ts`
3. Ensure Sanity CDN is accessible

---

## 📚 Documentation

- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Cloudflare → Vercel migration details
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Complete deployment guide
- [DEPLOY_NOW.md](./DEPLOY_NOW.md) - Quick reference for deployment
- [.env.example](./.env.example) - Environment variables reference

---

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---

## 📄 License

Proprietary - All rights reserved

---

## 🎉 Migration Status

**Status:** ✅ Migrated from Cloudflare Pages to Vercel  
**Date:** February 7, 2026  
**Build Status:** ✅ SUCCESS  
**Deployment:** Ready for Vercel

---

## 📞 Support

For deployment or technical issues:
- Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- Refer to [Vercel Documentation](https://vercel.com/docs)
- Contact: development team

---

**Made with ❤️ for the UAE market**
