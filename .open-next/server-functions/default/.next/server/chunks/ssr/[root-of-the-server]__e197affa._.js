module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},48269,a=>{a.n(a.i(96762))},74162,a=>{a.n(a.i(39375))},50645,a=>{a.n(a.i(28920))},23576,a=>{a.n(a.i(4858))},25210,a=>{a.n(a.i(2747))},17537,a=>{a.n(a.i(3363))},79070,a=>{a.n(a.i(96918))},77303,a=>{a.n(a.i(77645))},80757,a=>{a.n(a.i(51548))},2771,a=>{"use strict";let b=(0,a.i(44279).default)("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);a.s(["Zap",()=>b],2771)},37313,a=>{"use strict";let b=(0,a.i(44279).default)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);a.s(["Star",()=>b],37313)},18621,a=>{"use strict";let b=(0,a.i(44279).default)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);a.s(["Info",()=>b],18621)},1217,a=>{"use strict";function b(a,...c){let d=a.length-1;return a.slice(0,d).reduce((a,b,d)=>a+b+c[d],"")+a[d]}b`
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
`,a.s(["ALL_DEALS_QUERY",0,e,"GENERIC_POST_QUERY",0,f,"PRODUCT_BY_SLUG_QUERY",0,c,"TOP_TEN_LIST_QUERY",0,d],1217)},15003,a=>{"use strict";let b=(0,a.i(44279).default)("shopping-cart",[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]]);a.s(["ShoppingCart",()=>b],15003)},13055,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(48844).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/src/components/sanity/PortableText.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/sanity/PortableText.tsx <module evaluation>","default")},17443,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(48844).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/src/components/sanity/PortableText.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/sanity/PortableText.tsx","default")},95193,a=>{"use strict";a.i(13055);var b=a.i(17443);a.n(b)},33497,a=>{"use strict";let b=(0,a.i(44279).default)("external-link",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);a.s(["ExternalLink",()=>b],33497)},29034,a=>{"use strict";let b=(0,a.i(44279).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["Settings",()=>b],29034)},1288,a=>{"use strict";var b=a.i(33256),c=a.i(59146);a.i(22736);var d=a.i(7027),e=a.i(72491),f=a.i(84704),g=a.i(76170),h=a.i(99755),i=a.i(44279);let j=(0,i.default)("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]),k=(0,i.default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);var l=a.i(15003),m=a.i(33497),n=a.i(37313),o=a.i(92977),p=a.i(2771),q=a.i(61457),r=a.i(18621),s=a.i(29034),t=a.i(95193);function u({data:a}){let{title:c,mainImage:d,affiliateLink:e,retailer:f,price:g,currency:i="AED",priceTier:u,customerRating:v,ratingCount:w,realComplaint:x,verdict:y,customVerdict:z,keyFeatures:A,specifications:B,pros:C,cons:D,itemDescription:E,brand:F}=a,G=i||"AED",H=g?g.toLocaleString():null,I=z||y;return(0,b.jsxs)("article",{className:"font-sans bg-slate-50 min-h-screen pb-24 lg:pb-20",children:[(0,b.jsxs)("div",{className:"bg-[#4b0082] relative overflow-hidden text-white pt-12 pb-32 px-4",children:[(0,b.jsx)("div",{className:"absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"}),(0,b.jsx)("div",{className:"absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"}),(0,b.jsxs)("div",{className:"container mx-auto max-w-7xl relative z-10",children:[F&&(0,b.jsxs)("div",{className:"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6",children:[(0,b.jsx)(o.ShieldCheck,{className:"w-4 h-4 text-amber-300"}),(0,b.jsx)("span",{className:"text-sm font-bold uppercase tracking-widest",children:F})]}),(0,b.jsx)("h1",{className:"text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 max-w-4xl tracking-tight",children:c}),(0,b.jsxs)("div",{className:"flex flex-wrap items-center gap-4 text-purple-100 font-medium",children:[v&&(0,b.jsxs)("div",{className:"flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10",children:[(0,b.jsx)(n.Star,{className:"w-4 h-4 text-amber-400 fill-amber-400"}),(0,b.jsx)("span",{className:"text-white font-bold",children:v}),(0,b.jsx)("span",{className:"text-sm opacity-70",children:"/ 5"}),w&&(0,b.jsxs)("span",{className:"text-sm opacity-70 border-l border-white/20 pl-2 ml-1",children:[w," Reviews"]})]}),u&&(0,b.jsxs)("div",{className:"flex items-center gap-1 px-3 py-1.5",children:[(0,b.jsx)(q.Tag,{className:"w-4 h-4 text-amber-300"}),(0,b.jsxs)("span",{children:[u," Tier"]})]})]})]})]}),(0,b.jsx)("div",{className:"container mx-auto max-w-7xl px-4 -mt-20 relative z-20",children:(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8",children:[(0,b.jsxs)("div",{className:"lg:col-span-8 space-y-8",children:[(0,b.jsxs)("div",{className:"bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex items-center justify-center relative overflow-hidden group",children:[(0,b.jsx)("div",{className:"w-full h-75 md:h-125 p-8 flex items-center justify-center relative",children:d?.url?(0,b.jsx)(h.default,{src:d.url,alt:c||"Product image",fill:!0,className:"object-contain group-hover:scale-[1.02] transition-transform duration-500",priority:!0}):(0,b.jsx)("div",{className:"flex items-center justify-center h-full text-slate-300",children:(0,b.jsx)(l.ShoppingCart,{size:64})})}),(0,b.jsx)("div",{className:"absolute top-0 right-0 bg-linear-to-bl from-amber-400 to-orange-500 text-white px-6 py-2 rounded-bl-3xl font-bold shadow-lg z-10",children:"Editor's Review"})]}),(C?.length>0||D?.length>0)&&(0,b.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[C?.length>0&&(0,b.jsxs)("div",{className:"bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100",children:[(0,b.jsxs)("h3",{className:"font-bold text-emerald-900 mb-4 flex items-center gap-2",children:[(0,b.jsx)(j,{className:"w-5 h-5 text-emerald-600"})," The Good"]}),(0,b.jsx)("ul",{className:"space-y-3",children:C.map((a,c)=>(0,b.jsxs)("li",{className:"flex items-start gap-2 text-base text-emerald-900/80",children:[(0,b.jsx)("span",{className:"mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"}),a]},c))})]}),D?.length>0&&(0,b.jsxs)("div",{className:"bg-rose-50/50 rounded-2xl p-6 border border-rose-100",children:[(0,b.jsxs)("h3",{className:"font-bold text-rose-900 mb-4 flex items-center gap-2",children:[(0,b.jsx)(k,{className:"w-5 h-5 text-rose-500"})," Watch Out"]}),(0,b.jsx)("ul",{className:"space-y-3",children:D.map((a,c)=>(0,b.jsxs)("li",{className:"flex items-start gap-2 text-base text-rose-900/80",children:[(0,b.jsx)("span",{className:"mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"}),a]},c))})]})]}),B&&B.length>0&&(0,b.jsxs)("div",{className:"bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100",children:[(0,b.jsxs)("h3",{className:"text-xl font-bold text-slate-900 mb-6 flex items-center gap-2",children:[(0,b.jsx)(s.Settings,{className:"w-6 h-6 text-purple-600"})," Technical Specifications"]}),(0,b.jsx)("div",{className:"overflow-hidden rounded-xl border border-slate-200",children:(0,b.jsx)("table",{className:"w-full text-sm text-left",children:(0,b.jsx)("tbody",{className:"divide-y divide-slate-100",children:B.map((a,c)=>(0,b.jsxs)("tr",{className:c%2==0?"bg-slate-50/50":"bg-white",children:[(0,b.jsx)("td",{className:"px-4 py-3 font-semibold text-slate-700 w-1/3 md:w-1/4 align-top",children:a.specLabel}),(0,b.jsx)("td",{className:"px-4 py-3 text-slate-600 font-medium",children:a.specValue})]},c))})})})]}),E&&(0,b.jsxs)("div",{className:"bg-white rounded-3xl p-8 shadow-sm border border-slate-100",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100",children:"In-Depth Review"}),(0,b.jsx)("div",{className:"prose prose-slate prose-lg max-w-none",children:(0,b.jsx)(t.default,{value:E})})]}),I&&(0,b.jsxs)("div",{className:"mb-4 p-4 bg-slate-100 rounded-xl border border-slate-300 border-l-4 border-l-slate-600 mt-8",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,b.jsx)(r.Info,{className:"w-3 h-3 text-[#4b0082]"}),(0,b.jsx)("h3",{className:"text-sm font-bold text-[#4b0082] uppercase tracking-widest",children:"Why we picked this"})]}),(0,b.jsxs)("p",{className:"text-sm text-slate-900 font-semibold leading-relaxed italic",children:['"',I,'"']})]})]}),(0,b.jsxs)("div",{className:"lg:col-span-4 space-y-6",children:[(0,b.jsxs)("div",{className:"hidden lg:block bg-white rounded-3xl p-6 shadow-xl border border-slate-200 sticky top-24 z-30",children:[(0,b.jsxs)("div",{className:"text-center mb-6",children:[(0,b.jsx)("span",{className:"text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2",children:"Best Price Found"}),g?(0,b.jsxs)("div",{className:"flex items-center justify-center gap-1",children:[(0,b.jsx)("span",{className:"text-lg font-medium text-slate-500 mb-1",children:G}),(0,b.jsx)("span",{className:"text-5xl font-black text-slate-900 tracking-tight",children:H})]}):(0,b.jsx)("span",{className:"text-xl font-bold text-slate-400",children:"Check price"}),g&&(0,b.jsx)("div",{className:"inline-block bg-green-100 text-green-800 text-[11px] font-bold px-3 py-1 rounded-full mt-3",children:"IN STOCK"})]}),e&&(0,b.jsxs)("a",{href:e,target:"_blank",rel:"nofollow sponsored noopener",className:"group flex items-center justify-center gap-2 w-full bg-[#0071e3] hover:bg-[#0076df] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 hover:shadow-xl text-lg mb-4",children:["View on ",f||"Amazon",(0,b.jsx)(m.ExternalLink,{className:"w-5 h-5 opacity-80"})]}),(0,b.jsxs)("div",{className:"bg-slate-50 rounded-xl p-3 text-sm text-slate-500 leading-relaxed text-center border border-slate-100",children:[(0,b.jsx)(o.ShieldCheck,{className:"w-3 h-3 mx-auto mb-1 text-slate-400"}),"Secure transaction via ",f||"Amazon",". We may earn a commission."]})]}),A?.length>0&&(0,b.jsxs)("div",{className:"bg-white rounded-3xl p-6 shadow-sm border border-slate-200",children:[(0,b.jsxs)("h3",{className:"font-bold text-slate-900 mb-4 flex items-center gap-2",children:[(0,b.jsx)(p.Zap,{className:"w-5 h-5 text-purple-600"})," Key Features"]}),(0,b.jsx)("ul",{className:"space-y-3",children:A.map((a,c)=>(0,b.jsxs)("li",{className:"text-base text-slate-600 font-medium flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0",children:[(0,b.jsx)("div",{className:"w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"}),a]},c))})]}),x&&(0,b.jsxs)("div",{className:"bg-red-50 rounded-3xl p-6 border border-red-100",children:[(0,b.jsxs)("h3",{className:"font-bold text-red-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide",children:[(0,b.jsx)(r.Info,{className:"w-4 h-4"})," Real User Feedback"]}),(0,b.jsxs)("p",{className:"text-red-800/90 text-sm italic leading-relaxed",children:['"',x,'"']})]})]})]})}),e&&(0,b.jsxs)("div",{className:"lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between gap-4 safe-area-pb",children:[(0,b.jsxs)("div",{className:"flex flex-col",children:[(0,b.jsx)("span",{className:"text-sm text-gray-500 uppercase font-bold",children:"Best Price"}),(0,b.jsxs)("div",{className:"flex items-baseline gap-1",children:[(0,b.jsx)("span",{className:"text-sm font-bold text-gray-900",children:G}),(0,b.jsx)("span",{className:"text-xl font-black text-gray-900",children:H||"---"})]})]}),(0,b.jsxs)("a",{href:e,target:"_blank",rel:"nofollow sponsored noopener",className:"bg-[#0071e3] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-[#0076df] active:scale-95 transition-transform flex items-center gap-2",children:["View on ",f||"Amazon",(0,b.jsx)(m.ExternalLink,{className:"w-4 h-4"})]})]})]})}function v({data:a}){let c="deal"===a._type?a.dealPrice:a.price,d="deal"===a._type?a.affiliateLink||a.linkedProduct?.affiliateLink:a.affiliateLink,e=a.title||a.linkedProduct?.title,f={...a,title:e,price:c,affiliateLink:d};return(0,b.jsx)(u,{data:f})}var w=a.i(1217);async function x(){try{return(await c.client.fetch('*[_type == "product" && defined(slug.current)]{ "slug": slug.current }')).map(a=>({slug:a.slug}))}catch(a){return console.error("Error generating static params for reviews:",a),[]}}async function y({params:a}){let{slug:b}=await a;if(!b)return{title:"Not Found",robots:{index:!1}};try{let a=await c.client.fetch(w.PRODUCT_BY_SLUG_QUERY,{slug:b},{cache:"force-cache"});if(!a)return{title:"Not Found",robots:{index:!1}};let d=`https://toptenuae.com/reviews/${b}`,f={...a,url:d,slug:{current:b},_type:a._type||"product"};return(0,e.generateSeoMetadata)(f,{category:"reviews",slug:b})}catch(a){return console.error("Error generating metadata:",a),{title:"Error",robots:{index:!1}}}}async function z({params:a}){let{slug:e}=await a;e||(0,d.notFound)();let h=null;try{h=await c.client.fetch(w.PRODUCT_BY_SLUG_QUERY,{slug:e},{cache:"force-cache"})}catch(a){console.error(`Error fetching product review [${e}]:`,a),(0,d.notFound)()}if(h||(0,d.notFound)(),"topTenList"===h._type&&(0,d.permanentRedirect)(`/top-ten/${e}`),("holiday"===h._type||"event"===h._type||"article"===h._type)&&(0,d.permanentRedirect)(`/events-holidays/${e}`),"howTo"===h._type||"tool"===h._type){let a=h.category?.slug?.current||h.categories?.[0]?.slug?.current||("howTo"===h._type?"how-to-guides":"finance-tools");(0,d.permanentRedirect)(`/${a}/${e}`)}let i={...h,title:h.title.toLowerCase().endsWith("review")?h.title:`${h.title} Review`},j=(0,f.generateSchema)({...h,slug:{current:e},_type:h._type||"product"},"reviews",e);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(g.default,{data:j}),(0,b.jsx)(v,{data:i})]})}a.s(["default",()=>z,"dynamicParams",0,!0,"generateMetadata",()=>y,"generateStaticParams",()=>x],1288)},78834,a=>{a.v(b=>Promise.all(["server/chunks/ssr/e46c0_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_5c50a3ab.js"].map(b=>a.l(b))).then(()=>b(76500)))},23864,a=>{a.v(b=>Promise.all(["server/chunks/ssr/[root-of-the-server]__5334965b._.js"].map(b=>a.l(b))).then(()=>b(55751)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__e197affa._.js.map