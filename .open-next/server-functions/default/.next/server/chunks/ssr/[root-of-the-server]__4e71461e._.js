module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},52447,a=>{a.n(a.i(42992))},74162,a=>{a.n(a.i(39375))},50645,a=>{a.n(a.i(28920))},17537,a=>{a.n(a.i(3363))},20295,a=>{a.n(a.i(37656))},4978,a=>{a.n(a.i(72464))},44027,a=>{a.n(a.i(7174))},54799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},67714,a=>{"use strict";function b(a){return"object"==typeof a&&null!==a&&!Array.isArray(a)}var c={0:8203,1:8204,2:8205,3:8290,4:8291,5:8288,6:65279,7:8289,8:119155,9:119156,a:119157,b:119158,c:119159,d:119160,e:119161,f:119162},d={0:8203,1:8204,2:8205,3:65279};[,,,,].fill(String.fromCodePoint(d[0])).join(""),Object.fromEntries(Object.entries(d).map(a=>a.reverse())),Object.fromEntries(Object.entries(c).map(a=>a.reverse()));var e=`${Object.values(c).map(a=>`\\u{${a.toString(16)}}`).join("")}`,f=RegExp(`[${e}]{4,}`,"gu");function g(a){var b,c;return a&&JSON.parse({cleaned:(b=JSON.stringify(a)).replace(f,""),encoded:(null==(c=b.match(f))?void 0:c[0])||""}.cleaned)}a.s(["isRecord",()=>b,"stegaClean",()=>g])},59146,a=>{"use strict";let b=(0,a.i(84149).createClient)({projectId:"kxdjzy8e",dataset:"production",apiVersion:"2024-01-01",useCdn:!1,perspective:"published"});a.s(["client",0,b])},2420,a=>{"use strict";let b=(0,a.i(44279).default)("percent",[["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}],["circle",{cx:"6.5",cy:"6.5",r:"2.5",key:"4mh3h7"}],["circle",{cx:"17.5",cy:"17.5",r:"2.5",key:"1mdrzq"}]]);a.s(["Percent",()=>b],2420)},94536,a=>{"use strict";var b=a.i(28013);let c=process.env.NEXT_PUBLIC_baseUrl||"https://toptenuae.com",d=`${c}/images/brand/logoIcon.svg`,e=(a,b)=>{if(a)return b?a.split("T")[0]:a},f=()=>({"@context":"https://schema.org","@type":"Organization",name:"TopTenUAE",url:c,logo:{"@type":"ImageObject",url:d,width:"512",height:"512"},sameAs:["https://facebook.com/toptenuae","https://twitter.com/toptenuae"]});function g({data:a}){let d=function(a){if(!a)return f();switch(a.schemaType||a._type){case"product":let b,d;return b=a.price||a.livePrice||a.priceEstimate||0,d={"@context":"https://schema.org","@type":"Product",name:a.title||a.itemName,image:a.mainImage?.url?[a.mainImage.url]:void 0,description:a.verdict||a.intro||a.description,brand:{"@type":"Brand",name:a.brand||"Generic"},offers:{"@type":"Offer",price:"string"==typeof b?b.replace(/[^0-9.]/g,""):b,priceCurrency:a.currency||"AED",availability:a.availability||"https://schema.org/InStock",url:a.affiliateLink}},a.customerRating&&(d.aggregateRating={"@type":"AggregateRating",ratingValue:a.customerRating,reviewCount:a.ratingCount||1}),a.verdict&&(d.review={"@type":"Review",author:{"@type":"Organization",name:"TopTenUAE"},reviewRating:{"@type":"Rating",ratingValue:4.5,bestRating:5},reviewBody:a.verdict}),d;case"tool":return{"@context":"https://schema.org","@type":"SoftwareApplication",name:a.title,description:a.seo?.metaDescription||a.description,url:`${c}/${a.slug}`,applicationCategory:"FinanceApplication",operatingSystem:"Web",offers:{"@type":"Offer",price:"0",priceCurrency:"AED"}};case"deal":return{"@context":"https://schema.org","@type":"Offer",name:a.title,description:a.description,price:a.dealPrice,priceCurrency:"AED",priceValidUntil:a.dealEndDate,url:a.affiliateLink,availability:"https://schema.org/InStock"};case"event":case"holiday":return((a,b=null)=>{let c={"@context":"https://schema.org","@type":"Event",name:a.title,description:a.intro||a.description,image:b?[b]:a.mainImage?.url?[a.mainImage.url]:[],startDate:e(a.startDate||a.date,a.isAllDay),endDate:e(a.endDate,a.isAllDay),eventStatus:{scheduled:"https://schema.org/EventScheduled",cancelled:"https://schema.org/EventCancelled",postponed:"https://schema.org/EventPostponed",rescheduled:"https://schema.org/EventRescheduled"}[a.status]||"https://schema.org/EventScheduled",eventAttendanceMode:"https://schema.org/OfflineEventAttendanceMode",location:{"@type":"Place",name:a.locationName||"UAE Venue",address:{"@type":"PostalAddress",streetAddress:a.address?.street,addressLocality:a.address?.city||"Dubai",addressRegion:a.address?.state,addressCountry:"AE"}}};return(void 0!==a.ticketPrice||a.ticketUrl)&&(c.offers={"@type":"Offer",url:a.ticketUrl,price:a.ticketPrice||0,priceCurrency:a.currency||"AED",availability:!1===a.isTicketAvailable?"https://schema.org/SoldOut":"https://schema.org/InStock",validFrom:a.ticketSaleDate}),c})(a,a.mainImage?.url);case"topTenList":return{"@context":"https://schema.org","@type":"ItemList",itemListOrder:"https://schema.org/ItemListOrderDescending",numberOfItems:a.listItems?.length||0,itemListElement:a.listItems?.map((a,b)=>({"@type":"ListItem",position:b+1,item:{"@type":"Product",name:a.product?.title||a.itemName||"Product",url:a.product?.slug?`${c}/${a.product.slug}`:void 0,description:a.customVerdict||a.product?.verdict}}))};default:let g;return(g=[{"@context":"https://schema.org","@type":"NewsArticle",headline:a.title,image:a.mainImage?.url?[a.mainImage.url]:[],datePublished:a.publishedAt,dateModified:a._updatedAt||a.publishedAt,author:{"@type":"Organization",name:a.author?.name||"TopTenUAE Editor",url:c},publisher:f()}],a.faqs&&a.faqs.length>0&&g.push({"@context":"https://schema.org","@type":"FAQPage",mainEntity:a.faqs.map(a=>({"@type":"Question",name:a.question,acceptedAnswer:{"@type":"Answer",text:a.answer}}))}),g)[0]}}(a);return(0,b.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(d)}})}a.s(["default",()=>g],94536)},58609,a=>{"use strict";let b=(0,a.i(48949).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/src/components/deals/DealsFeed.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/deals/DealsFeed.tsx <module evaluation>","default");a.s(["default",0,b])},25643,a=>{"use strict";let b=(0,a.i(48949).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/src/components/deals/DealsFeed.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/src/components/deals/DealsFeed.tsx","default");a.s(["default",0,b])},24515,a=>{"use strict";a.i(58609);var b=a.i(25643);a.n(b)},98200,a=>{"use strict";var b=a.i(28013),c=a.i(59146),d=a.i(24515),e=a.i(40839);function f(a,...b){let c=a.length-1;return a.slice(0,c).reduce((a,c,d)=>a+c+b[d],"")+a[c]}f`
  *[_type == "product" && slug.current == $slug][0] {
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
    customerRating,
    // ✅ FIX: Matched field name to your schema (was ratingCount)
    reviewCount,
    verdict,
    mainImage { asset, alt },
    itemDescription, 
    "seoTitle": coalesce(seo.metaTitle, title),
    "seoDescription": coalesce(seo.metaDescription, title)
  }
`,f`
  *[_type == "topTenList" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    publishedAt,
    intro,
    body,
    closingContent,       
    showAffiliateDisclosure,
    mainImage { asset, alt },
    faqs[] { _key, question, answer },
    listItems[] {
      _key,
      rank,
      badgeLabel,
      whySelected,
      customVerdict,
      product->{
        title,
        brand,
        "slug": slug.current,
        priceTier,
        retailer,
        
        price,        
        currency,
        availability, 
        
        affiliateLink,            
        customerRating,
        reviewCount,
        verdict,
        keyFeatures,
        pros,
        cons,
        itemDescription,
        mainImage { asset, alt }
      }
    }
  }
`;let g=f`
  *[_type == "deal" && isActive == true] | order(featured desc, _createdAt desc) {
    _id,
    _createdAt,
    
    // Logic: Use Deal Title if filled, otherwise fetch Linked Product Title
    "title": coalesce(title, product->title),
    
    description,
    
    // Logic: Use Deal Image if filled, otherwise Linked Product Image
    // We fetch the asset URL directly to keep it a simple string for your frontend
    "image": coalesce(image.asset->url, product->mainImage.asset->url),
    
    // Logic: Use Deal Link if filled, otherwise Linked Product Link
    "affiliateLink": coalesce(affiliateLink, product->affiliateLink),
    
    originalPrice,
    dealPrice,
    discountPercentage,
    category,
    dealEndDate,
    isPrimeExclusive,
    
    // Logic: Fetch ratings from Product if missing on Deal
    "rating": coalesce(rating, product->customerRating),
    "reviewCount": coalesce(reviewCount, product->reviewCount),
    
    featured,
    couponCode, 
    couponNote 
  }
`;var h=a.i(2420),i=a.i(94536);function j(){return(0,b.jsxs)("div",{className:"min-h-screen bg-slate-50 pb-20",children:[(0,b.jsx)("div",{className:"bg-[#4b0082] h-80 animate-pulse"}),(0,b.jsxs)("div",{className:"container mx-auto px-4 max-w-7xl py-10",children:[(0,b.jsx)("div",{className:"h-24 bg-white rounded-xl mb-10 w-full animate-pulse"}),(0,b.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",children:[...Array(8)].map((a,c)=>(0,b.jsx)("div",{className:"bg-white rounded-2xl h-96 p-8 border border-slate-200 animate-pulse"},c))})]})]})}async function k(){try{return await c.client.fetch(g)}catch(a){return console.error("Failed to fetch deals:",a),[]}}async function l(){let a=await k(),c={"@context":"https://schema.org","@type":"ItemList",name:"Top Deals in UAE",description:"Daily updated discounts for Amazon.ae and Noon.",numberOfItems:a.length,itemListElement:a.map((a,b)=>({"@type":"ListItem",position:b+1,item:{"@type":"Offer",name:a.title,price:a.dealPrice,priceCurrency:"AED",url:a.affiliateLink}}))};return(0,b.jsxs)(e.Suspense,{fallback:(0,b.jsx)(j,{}),children:[(0,b.jsx)(i.default,{data:c}),(0,b.jsxs)("div",{className:"min-h-screen bg-slate-50 font-sans pb-20",children:[(0,b.jsxs)("div",{className:"bg-[#4b0082] text-white py-12 px-4 text-center relative overflow-hidden shadow-lg",children:[(0,b.jsx)("div",{className:"absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none",children:(0,b.jsx)("svg",{className:"w-full h-full",viewBox:"0 0 100 100",preserveAspectRatio:"none",children:(0,b.jsx)("path",{d:"M0 100 C 20 0 50 0 100 100 Z",fill:"white"})})}),(0,b.jsxs)("div",{className:"relative z-10 max-w-5xl mx-auto",children:[(0,b.jsx)("div",{className:"flex justify-center mb-6",children:(0,b.jsxs)("span",{className:"inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-400 text-[#4b0082] text-xs font-black uppercase tracking-wider shadow-lg animate-pulse",children:[(0,b.jsx)(h.Percent,{className:"w-4 h-4"}),"🔴 LIVE: Amazon Super Saver Week (Jan 1–7)"]})}),(0,b.jsxs)("h1",{className:"text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight",children:["Save Big with ",(0,b.jsx)("br",{className:"md:hidden"}),(0,b.jsx)("span",{className:"text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400",children:"Super Saver Week & ADCB"})]}),(0,b.jsx)("p",{className:"text-indigo-100 text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8",children:"We track the biggest price drops across Amazon.ae. Use the codes below for extra discounts at checkout."}),(0,b.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left",children:[(0,b.jsxs)("div",{className:"bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors",children:[(0,b.jsx)("span",{className:"text-[10px] text-indigo-200 font-bold uppercase mb-1 tracking-widest",children:"ADCB Cards"}),(0,b.jsx)("div",{className:"text-2xl font-black text-white mb-2",children:"30% OFF"}),(0,b.jsx)("div",{className:"bg-white text-[#4b0082] px-3 py-1 rounded border border-dashed border-[#4b0082] text-sm font-mono font-bold select-all cursor-pointer",children:"Code: ADCB150"})]}),(0,b.jsxs)("div",{className:"bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors",children:[(0,b.jsx)("span",{className:"text-[10px] text-amber-200 font-bold uppercase mb-1 tracking-widest",children:"Prime Members"}),(0,b.jsx)("div",{className:"text-2xl font-black text-white mb-2",children:"Extra 15%"}),(0,b.jsx)("div",{className:"bg-amber-400 text-[#4b0082] px-3 py-1 rounded border border-dashed border-[#4b0082] text-sm font-mono font-bold select-all cursor-pointer",children:"Code: SAVE15"})]}),(0,b.jsxs)("div",{className:"bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/20 transition-colors",children:[(0,b.jsx)("span",{className:"text-[10px] text-green-200 font-bold uppercase mb-1 tracking-widest",children:"First Order"}),(0,b.jsx)("div",{className:"text-2xl font-black text-white mb-2",children:"Flat 10%"}),(0,b.jsx)("div",{className:"bg-green-400 text-[#064e3b] px-3 py-1 rounded border border-dashed border-[#064e3b] text-sm font-mono font-bold select-all cursor-pointer",children:"Code: NEW10"})]})]})]})]}),(0,b.jsx)("div",{className:"container mx-auto px-4 max-w-7xl py-10 relative z-20",children:(0,b.jsx)(d.default,{initialDeals:a})}),(0,b.jsx)("div",{className:"container mx-auto px-4 max-w-4xl mt-12 text-center",children:(0,b.jsxs)("p",{className:"text-slate-400 text-xs leading-relaxed",children:[(0,b.jsx)("strong",{children:"Transparency:"})," TopTenUAE is a participant in the Amazon Services LLC Associates Program. Prices and availability are subject to change."]})})]})]})}a.s(["default",()=>l,"metadata",0,{title:"Top Deals in UAE | Amazon & Noon Discounts",description:"Curated list of the best price drops in UAE. Electronics, Fashion, and Home essentials at up to 70% off."},"revalidate",0,3600],98200)},66803,a=>{a.v(b=>Promise.all(["server/chunks/ssr/cea30_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_11a5aba7.js"].map(b=>a.l(b))).then(()=>b(78907)))},23864,a=>{a.v(b=>Promise.all(["server/chunks/ssr/[root-of-the-server]__5334965b._.js"].map(b=>a.l(b))).then(()=>b(55751)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__4e71461e._.js.map