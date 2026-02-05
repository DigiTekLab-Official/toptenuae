# ⚡ QUICK DEPLOY GUIDE
## toptenuae → Cloudflare Pages | READY NOW

---

## 🎯 STATUS: ✅ READY TO DEPLOY

**Build Fix:** ✅ COMPLETE (Sanity CLI added)  
**Local Tests:** ✅ PASS (both `pnpm build` and `pnpm run build:worker`)  
**Next Step:** Add 5 environment variables → Deploy

---

## 📋 DEPLOYMENT STEPS (10 minutes)

### STEP 1: Add Environment Secrets to Cloudflare (3-4 min)

1. Go to: **https://dash.cloudflare.com/**
2. Navigate to: **Workers & Pages** → **toptenuae** → **Settings** → **Environment Variables**
3. Add these **7 variables** (click "Encrypt" for sensitive ones):

| Variable | Value | Type |
|----------|-------|------|
| `RESEND_API_KEY` | `re_UJrHrT8k_Je4MsuDpDW8Uhpq4Y1s4fje1` | 🔐 Encrypted |
| `AMAZON_ACCESS_KEY` | `AKPADMZ91J1768560889` | 🔐 Encrypted |
| `AMAZON_SECRET_KEY` | `wzzWoTLe06a2vRHu1TDYagKNXZ3PrWVlPPkykqto` | 🔐 Encrypted |
| `JWT_SECRET` | `POMJEySsvzlFErt+oVUrgOVRNcovr3PIKtZPoQHeGac=` | 🔐 Encrypted |
| `TURNSTILE_SECRET_KEY` | `0x4AAAAAACKjWQ_Ebr6Dmszgt4_6ndIkfE4` | 🔐 Encrypted |
| `REVALIDATE_SECRET` | `openssl rand -hex 32` (run command, copy output) | 🔐 Encrypted |
| `NEXT_PUBLIC_SENTRY_DSN` | (Your Sentry DSN or leave empty) | Plain |

**Note:** Public variables are already in `wrangler.toml` (SANITY, GA, GTM, etc.)

---

### STEP 2: Deploy to Cloudflare Pages (5 min)

**Option A: Using NPM script (Recommended)**
```bash
cd /Users/ameer/Web-Projects/toptenuae
pnpm run deploy
```

**Option B: Manual deployment**
```bash
# First build for Cloudflare
pnpm run build:worker

# Then deploy
wrangler pages deploy .open-next/assets --project-name=toptenuae
```

**Expected Output:**
```
✨ Uploading...
✅ Deployment successful
🎉 Your site is live at: https://toptenuae.pages.dev
🔗 Custom domain: https://toptenuae.com
```

---

### STEP 3: Verify Deployment (2 min)

Check these URLs load correctly:

- ✅ https://toptenuae.com (homepage)
- ✅ https://toptenuae.com/reviews (reviews page)
- ✅ https://toptenuae.com/top-ten (top 10 lists)
- ✅ https://toptenuae.com/subscribe (newsletter)

---

## 🆘 TROUBLESHOOTING

### "Missing environment variables" Error
**Solution:** Make sure all 7 variables are added to Cloudflare Dashboard

### Site shows 500 Error
**Solution:**
1. Check Cloudflare > Functions for error logs
2. Check Sentry dashboard (if DSN configured)
3. Verify secrets are marked as "Encrypted"

### Email subscription fails
**Solution:** Verify `RESEND_API_KEY` is correct in Cloudflare Dashboard

---

## 📊 WHAT'S FIXED

```
BEFORE: ❌ Cloudflare build failed
  Error: "sanity: not found"
  Cause: @sanity/cli missing from devDependencies

AFTER: ✅ Both builds pass
  Local build: pnpm build → SUCCESS (19.1s)
  Cloudflare build: pnpm run build:worker → SUCCESS
  Worker: .open-next/worker.js created ✅
```

---

## 🚀 DEPLOY NOW!

**Time needed:** 10 minutes  
**Risk level:** 🟢 LOW  
**Confidence:** 95%

Ready to go live? Run:
```bash
pnpm run deploy
```

🎉 **Your site will be live at https://toptenuae.com in 5 minutes!**

