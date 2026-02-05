# Core Web Vitals - Quick Implementation Checklist

## Priority 1: High-Impact Fixes (Do First - 80% of improvement)

### [ ] Image Optimization (LCP -7 seconds)
- [ ] Lazy load hero image → `loading="lazy"` in TopTenTemplate
- [ ] Reduce image quality → `quality={75}` on product cards
- [ ] Create `src/utils/sanityImageUrl.ts` utility

### [ ] Font Loading (CLS -0.35)
- [ ] Update font-display strategy in layout.tsx
- [ ] Add system font fallback
- [ ] Verify `display: "swap"` on IBM Plex Sans

### [ ] Third-Party Scripts (TBT -600ms)
- [ ] Verify GTM uses @next/third-parties (already done)
- [ ] Defer Clarity loading with requestIdleCallback
- [ ] Add `async` to Trusted Types script

### [ ] Code Splitting (JS reduction -40%)
- [ ] Dynamic import TopTenTemplate with fallback
- [ ] Dynamic import FAQAccordion
- [ ] Dynamic import heavy UI components

---

## Priority 2: Medium-Impact Fixes (Do Second)

### [ ] Enable Compression
- [ ] Add `compress: true` to next.config.ts

### [ ] Optimize Sanity Queries
- [ ] Limit query field depth
- [ ] Remove unnecessary relationships

---

## Priority 3: Polish Fixes (Do Last)

### [ ] Service Worker
- [ ] Add `public/sw.js` for offline support

### [ ] Build Optimizations  
- [ ] Enable `swcMinify: true`
- [ ] Set `staticPageGenerationTimeout: 120`

---

## Testing Timeline

1. **Before:** Run Lighthouse → Save baseline
2. **After Fix 1-4:** Lighthouse → Check LCP, CLS, TBT
3. **After Fix 5:** Lighthouse → Check bundle size
4. **After Deploy:** Run on live → Verify scores

---

## Rollback Plan

If score drops:
```bash
git log --oneline | head -10
git revert [commit-hash]
```

Each fix is independent and can be reverted individually.
