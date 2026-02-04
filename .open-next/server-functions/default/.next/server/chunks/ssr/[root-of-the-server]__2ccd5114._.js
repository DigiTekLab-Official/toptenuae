module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},48269,a=>{a.n(a.i(96762))},74162,a=>{a.n(a.i(39375))},50645,a=>{a.n(a.i(28920))},23576,a=>{a.n(a.i(4858))},25210,a=>{a.n(a.i(2747))},17537,a=>{a.n(a.i(3363))},79070,a=>{a.n(a.i(96918))},77303,a=>{a.n(a.i(77645))},80757,a=>{a.n(a.i(51548))},1217,a=>{"use strict";function b(a,...c){let d=a.length-1;return a.slice(0,d).reduce((a,b,d)=>a+b+c[d],"")+a[d]}b`
  *[_type == "siteSettings"][0] {
    _type,
    title,
    description,
    "logoMain": logoMain.asset->url,
    "logoIcon": logoIcon.asset->url,
    "logoBimi": logoBimi.asset->url,
    "ogImage": ogImage.asset->url,
    socialLinks[] { platform, url },
    contactEmail
  }
`;let c=b`
  *[slug.current == $slug][0] {
    _type,
    _id,
    title,
    brand,
    "slug": slug.current,
    price,
    currency,
    availability,
    priceTier,
    retailer,
    affiliateLink,
    pros,
    cons,
    keyFeatures,
    // ✅ NEW: Fetch Tech Specs
    specifications[] { specLabel, specValue },
    customerRating,
    reviewCount,
    verdict,
    mainImage { "url": asset->url, alt },
    itemDescription, 
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, description)
  }
`,d=b`
  *[_type == "topTenList" && slug.current == $slug][0] {
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    "updatedAt": _updatedAt, 
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": "",
    mainImage { "url": asset->url, alt },
    intro,
    "body": body[],
    closingContent,
    showAffiliateDisclosure,
    faqs[] { _key, question, answer },
    listItems[] | order(rank asc) {
      _key, rank, badgeLabel, whySelected, customVerdict,
      product->{
        _type, title, brand, "slug": slug.current,
        priceTier, retailer, price, currency, availability, 
        affiliateLink, customerRating, reviewCount, verdict,
        location, address, curriculum, feeRange, realityCheck, website,
        "rating": coalesce(rating, customerRating),
        entityType, code, country,
        mainImage { "url": asset->url, alt },
        heroFeature, keyFeatures[], pros[], cons[],
        // ✅ NEW: Fetch Tech Specs
        specifications[] { specLabel, specValue }
      }
    }
  }
`,e=b`
  *[_type == "deal" && isActive == true] | order(featured desc, _createdAt desc) {
    _type, _id, _createdAt,
    "title": coalesce(title, product->title),
    description,
    "image": coalesce(image.asset->url, product->mainImage.asset->url),
    "affiliateLink": coalesce(affiliateLink, product->affiliateLink),
    originalPrice, dealPrice, discountPercentage, category,
    dealEndDate, isPrimeExclusive, featured, couponCode, couponNote,
    "rating": coalesce(rating, product->customerRating),
    "reviewCount": coalesce(reviewCount, product->reviewCount)
  }
`;b`{
  "featured": *[_type == "product" && isFeaturedReview == true] | order(_updatedAt desc) [0...8] {
    _id, title, "rating": customerRating, "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url)
  },
  "reviews": *[_type == "product"] | order(_createdAt desc) {
    _id, title, "rating": customerRating, "slug": slug.current,
    "section": reviewSection,
    "subCategoryTitle": subCategory->menuLabel,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url)
  }
}`;let f=b`
  *[slug.current == $slug][0]{
    _type,
    "slug": slug.current, _id, title, description,
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": "",
    "mainImage": coalesce(mainImage, image, coverImage, product->mainImage) { "url": asset->url, alt },
    "category": coalesce(categories[0], category)->{ "title": title, "slug": slug.current, "menuLabel": menuLabel },
    "publishedAt": _createdAt, "_updatedAt": _updatedAt,
    "intro": intro,
    "body": body,
    "content": content,
    "procedure": procedure,
    "closingContent": closingContent,
    faqs[] { _key, question, answer },
    startDate, endDate, locationName, address, ticketPrice
  }
`;b`
  *[_type == "category" && slug.current == $slug][0]{
    title, 
    description, 
    "slug": slug.current,
    "seo": seo { metaTitle, metaDescription },
    "mainImage": coalesce(
      mainImage, 
      image,
      *[references(^._id)][0].mainImage
    ) { "url": asset->url, alt },
    "items": *[
      _type in ["topTenList", "howTo", "tool", "holiday", "deal", "article"] &&
      (references(^._id) || category._ref == ^._id || categories[]._ref == ^._id)
    ] | order(publishedAt desc) {
      _type, title, "slug": slug.current, publishedAt,
      "mainImage": coalesce(mainImage, image, product->mainImage) { "url": asset->url, alt },
      "rawExcerpt": coalesce(description, "", "")
    }
  }
`,a.s(["ALL_DEALS_QUERY",0,e,"GENERIC_POST_QUERY",0,f,"PRODUCT_BY_SLUG_QUERY",0,c,"TOP_TEN_LIST_QUERY",0,d],1217)},58609,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(48844).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/src/components/deals/DealsFeed.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/deals/DealsFeed.tsx <module evaluation>","default")},25643,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(48844).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/src/components/deals/DealsFeed.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/deals/DealsFeed.tsx","default")},24515,a=>{"use strict";a.i(58609);var b=a.i(25643);a.n(b)},98200,a=>{"use strict";var b=a.i(33256),c=a.i(59146),d=a.i(24515),e=a.i(57629),f=a.i(1217),g=a.i(2420),h=a.i(76170);function i(){return(0,b.jsxs)("div",{className:"min-h-screen bg-slate-50 pb-20",children:[(0,b.jsx)("div",{className:"bg-[#4b0082] h-80 animate-pulse"}),(0,b.jsxs)("div",{className:"container mx-auto px-4 max-w-7xl py-10",children:[(0,b.jsx)("div",{className:"h-24 bg-white rounded-xl mb-10 w-full animate-pulse"}),(0,b.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",children:[...Array(8)].map((a,c)=>(0,b.jsx)("div",{className:"bg-white rounded-2xl h-96 p-8 border border-slate-200 animate-pulse"},c))})]})]})}async function j(){try{return await c.client.fetch(f.ALL_DEALS_QUERY)}catch(a){return console.error("Failed to fetch deals:",a),[]}}async function k(){let a=await j(),c={"@context":"https://schema.org","@type":"ItemList",name:"Top Deals in UAE",description:"Daily updated discounts for Amazon.ae and Noon.",numberOfItems:a.length,itemListElement:a.map((a,b)=>({"@type":"ListItem",position:b+1,item:{"@type":"Offer",name:a.title,price:a.dealPrice,priceCurrency:"AED",url:a.affiliateLink}}))};return(0,b.jsxs)(e.Suspense,{fallback:(0,b.jsx)(i,{}),children:[(0,b.jsx)(h.default,{data:c}),(0,b.jsxs)("div",{className:"min-h-screen bg-slate-50 font-sans pb-20",children:[(0,b.jsxs)("div",{className:"bg-[#4b0082] text-white py-12 px-4 text-center relative overflow-hidden shadow-lg",children:[(0,b.jsx)("div",{className:"absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none",children:(0,b.jsx)("svg",{className:"w-full h-full",viewBox:"0 0 100 100",preserveAspectRatio:"none",children:(0,b.jsx)("path",{d:"M0 100 C 20 0 50 0 100 100 Z",fill:"white"})})}),(0,b.jsxs)("div",{className:"relative z-10 max-w-5xl mx-auto",children:[(0,b.jsx)("div",{className:"flex justify-center mb-6",children:(0,b.jsxs)("span",{className:"inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-400 text-[#4b0082] text-xs font-black uppercase tracking-wider shadow-lg animate-pulse",children:[(0,b.jsx)(g.Percent,{className:"w-4 h-4"}),"Ramadan Sale is Live Now (27 Jan 14 Fen)"]})}),(0,b.jsxs)("h1",{className:"text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight",children:["Save Big with ",(0,b.jsx)("br",{className:"md:hidden"}),(0,b.jsx)("span",{className:"text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400",children:"Ramadan Sale 2026"})]}),(0,b.jsx)("p",{className:"text-indigo-100 text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8",children:"We track the biggest price drops across Amazon.ae. Use the codes below for extra discounts at checkout."}),(0,b.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left",children:[(0,b.jsxs)("div",{className:"bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors",children:[(0,b.jsx)("span",{className:"text-[10px] text-indigo-200 font-bold uppercase mb-1 tracking-widest",children:"ADCB Cards"}),(0,b.jsx)("div",{className:"text-2xl font-black text-white mb-2",children:"30% OFF"}),(0,b.jsx)("div",{className:"bg-white text-[#4b0082] px-3 py-1 rounded border border-dashed border-[#4b0082] text-sm font-mono font-bold select-all cursor-pointer",children:"Code: ADCB150"})]}),(0,b.jsxs)("div",{className:"bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors",children:[(0,b.jsx)("span",{className:"text-[10px] text-amber-200 font-bold uppercase mb-1 tracking-widest",children:"Prime Members"}),(0,b.jsx)("div",{className:"text-2xl font-black text-white mb-2",children:"Extra 15%"}),(0,b.jsx)("div",{className:"bg-amber-400 text-[#4b0082] px-3 py-1 rounded border border-dashed border-[#4b0082] text-sm font-mono font-bold select-all cursor-pointer",children:"Code: SAVE15"})]}),(0,b.jsxs)("div",{className:"bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors",children:[(0,b.jsx)("span",{className:"text-[10px] text-green-200 font-bold uppercase mb-1 tracking-widest",children:"First Order"}),(0,b.jsx)("div",{className:"text-2xl font-black text-white mb-2",children:"Flat 10%"}),(0,b.jsx)("div",{className:"bg-green-400 text-[#064e3b] px-3 py-1 rounded border border-dashed border-[#064e3b] text-sm font-mono font-bold select-all cursor-pointer",children:"Code: NEW10"})]})]})]})]}),(0,b.jsx)("div",{className:"container mx-auto px-4 max-w-7xl py-10 relative z-20",children:(0,b.jsx)(d.default,{initialDeals:a})}),(0,b.jsx)("div",{className:"container mx-auto px-4 max-w-4xl mt-12 text-center",children:(0,b.jsxs)("p",{className:"text-slate-400 text-xs leading-relaxed",children:[(0,b.jsx)("strong",{children:"Transparency:"})," TopTenUAE is a participant in the Amazon Services LLC Associates Program. Prices and availability are subject to change."]})})]})]})}a.s(["default",()=>k,"metadata",0,{title:"Top Deals in UAE | Amazon & Noon Discounts",description:"Curated list of the best price drops in UAE. Electronics, Fashion, and Home essentials at up to 70% off."}])},78834,a=>{a.v(b=>Promise.all(["server/chunks/ssr/e46c0_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_5c50a3ab.js"].map(b=>a.l(b))).then(()=>b(76500)))},23864,a=>{a.v(b=>Promise.all(["server/chunks/ssr/[root-of-the-server]__5334965b._.js"].map(b=>a.l(b))).then(()=>b(55751)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__2ccd5114._.js.map