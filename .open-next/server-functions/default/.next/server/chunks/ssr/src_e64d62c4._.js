module.exports=[76170,84704,a=>{"use strict";var b=a.i(33256),c=a.i(34530);let d="https://toptenuae.com",e=`${d}/icon.png`,f=`${d}/images/brand/og-default.png`,g=(a,b)=>{if(a)return b?a.split("T")[0]:a},h=()=>{let a=new Date;return a.setFullYear(a.getFullYear()+1),a.toISOString().split("T")[0]},i=(a,b)=>a&&b?`${d}/${a}/${b}#webpage`:`${d}/#webpage`,j=()=>({"@context":"https://schema.org","@type":"Organization","@id":`${d}/#organization`,name:"TopTenUAE",alternateName:"Top Ten UAE",url:d,logo:{"@type":"ImageObject","@id":`${d}/#logo`,url:e,width:512,height:512,caption:"TopTenUAE Logo"},image:{"@type":"ImageObject",url:f,width:1200,height:630},description:"Expert reviews, rankings, and smart tools for UAE residents. Your trusted guide to the best products, services, and experiences in the Emirates.",foundingDate:"2020",areaServed:{"@type":"Country",name:"United Arab Emirates","@id":"https://www.wikidata.org/wiki/Q878"},contactPoint:{"@type":"ContactPoint",contactType:"Customer Service",areaServed:"AE",availableLanguage:["en","ar"]},sameAs:[]});function k(a,b,e){var k,l;if(!a)return[j()];let m=[];if(m.push(j()),!b&&!e&&(m.push({"@context":"https://schema.org","@type":"WebSite","@id":`${d}/#website`,name:"TopTenUAE",alternateName:["Top Ten UAE","TopTen UAE"],url:`${d}/`,description:"Discover trending products, expert reviews, and free UAE tools. Rankings, comparisons, and calculators for smarter decisions.",inLanguage:"en-AE",publisher:{"@id":`${d}/#organization`},potentialAction:{"@type":"SearchAction",target:{"@type":"EntryPoint",urlTemplate:`${d}/search?q={search_term_string}`},"query-input":"required name=search_term_string"}}),m.push({"@context":"https://schema.org","@type":"CollectionPage","@id":`${d}/#homepage`,url:`${d}/`,name:"TopTenUAE - The Best of the UAE, Ranked",description:"Discover trending products, expert reviews, and free UAE tools including VAT and gratuity calculators.",isPartOf:{"@id":`${d}/#website`},about:{"@type":"Thing",name:"UAE Product Reviews and Comparisons"},publisher:{"@id":`${d}/#organization`},inLanguage:"en-AE",primaryImageOfPage:{"@type":"ImageObject",url:f,width:1200,height:630}}),a.featuredPosts&&a.featuredPosts.length>0)){let b=(k=a.featuredPosts)&&0!==k.length?{"@context":"https://schema.org","@type":"ItemList",name:"Featured UAE Reviews and Guides",description:"Top-rated content from TopTenUAE",numberOfItems:k.length,itemListElement:k.map((a,b)=>({"@type":"ListItem",position:b+1,url:`${d}/${a.categorySlug}/${a.slug}`,name:a.title}))}:null;b&&m.push(b)}if(b&&e){let f,g=a.category?.title||b.charAt(0).toUpperCase()+b.slice(1).replace(/-/g," ");m.push((f=a.title,{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:d},{"@type":"ListItem",position:2,name:g,item:`${d}/${b}`},{"@type":"ListItem",position:3,name:(0,c.cleanText)(f),item:`${d}/${b}/${e}`}]}))}let n=a.schemaType||a._type;switch(n?n.toLowerCase():"article"){case"product":let o,p,q,r,s;m.push((p="string"==typeof(o=a.price||a.dealPrice||a.livePrice||a.priceEstimate||0)?o.replace(/[^0-9.]/g,""):o,q=b&&e?`${d}/${b}/${e}`:d,r=a.mainImage?.url?[a.mainImage.url]:a.images?.map(a=>a.url).filter(Boolean)||[f],s={"@context":"https://schema.org","@type":"Product","@id":`${q}#product`,name:(0,c.cleanText)(a.title||a.itemName),image:r,description:(0,c.cleanText)(a.verdict||a.itemDescription||a.intro||a.description||""),brand:a.brand?{"@type":"Brand",name:(0,c.cleanText)(a.brand)}:void 0,sku:a.sku||void 0,mpn:a.mpn||void 0,offers:{"@type":"Offer",price:p,priceCurrency:a.currency||"AED",availability:a.availability||"https://schema.org/InStock",url:a.affiliateLink||q,priceValidUntil:a.priceValidUntil||h(),seller:{"@type":"Organization",name:a.retailer||"Various UAE Retailers"}},mainEntityOfPage:{"@type":"WebPage","@id":i(b,e)}},a.customerRating&&a.reviewCount&&(s.aggregateRating={"@type":"AggregateRating",ratingValue:a.customerRating,reviewCount:a.reviewCount,bestRating:5,worstRating:1}),a.verdict&&a.customerRating&&(s.review={"@type":"Review",author:{"@type":"Organization",name:"TopTenUAE Editorial Team","@id":`${d}/#organization`},reviewRating:{"@type":"Rating",ratingValue:a.customerRating,bestRating:5},reviewBody:(0,c.cleanText)(a.verdict),datePublished:a.publishedAt||a._createdAt}),s));break;case"toptenlist":let t=((a,b,e)=>{if(!a.listItems||0===a.listItems.length)return null;let g=b&&e?`${d}/${b}/${e}`:d;return{"@context":"https://schema.org","@type":"ItemList","@id":`${g}#itemlist`,name:(0,c.cleanText)(a.seo?.metaTitle||a.title),description:(0,c.cleanText)(a.seo?.metaDescription||a.intro||a.description||""),url:g,itemListOrder:"https://schema.org/ItemListOrderDescending",numberOfItems:a.listItems.length,mainEntityOfPage:{"@type":"WebPage","@id":i(b,e)},itemListElement:a.listItems.map((a,e)=>{let g=a.product||{},i=g.price||g.dealPrice||g.livePrice||0,j="string"==typeof i?i.replace(/[^0-9.]/g,""):i,k=g.slug?`${d}/${b||"reviews"}/${g.slug}`:void 0,l={"@type":"ListItem",position:a.rank||e+1,item:{"@type":"Product",name:(0,c.cleanText)(g.title||a.itemName||`Product ${e+1}`),url:k,description:(0,c.cleanText)(a.customVerdict||g.verdict||g.itemDescription||""),image:g.mainImage?.url?[g.mainImage.url]:[f],brand:g.brand?{"@type":"Brand",name:(0,c.cleanText)(g.brand)}:void 0,offers:{"@type":"Offer",price:j,priceCurrency:g.currency||"AED",availability:g.availability||"https://schema.org/InStock",url:g.affiliateLink,priceValidUntil:g.priceValidUntil||h(),seller:{"@type":"Organization",name:g.retailer||"Various UAE Retailers"}}}};return g.customerRating&&g.reviewCount&&(l.item.aggregateRating={"@type":"AggregateRating",ratingValue:g.customerRating,reviewCount:g.reviewCount,bestRating:5,worstRating:1}),l})}})(a,b,e);t&&m.push(t);break;case"tool":let u,v,w,x,y;m.push((u=e||a.slug?.current||a.slug||"",v=b||a.category?.slug||"finance-tools",w=`${d}/${v}/${u}`,x=["Free Online Tool","Instant Calculation","Mobile Friendly","No Registration Required"],y="FinanceApplication",u.includes("vat")?(x=["Add VAT to price (5% UAE rate)","Remove VAT (Reverse calculation)","VAT inclusive & exclusive formulas","Instant VAT calculation"],y="FinanceApplication"):u.includes("gratuity")?(x=["UAE Labor Law compliant","Limited & Unlimited contract calculation","Resignation & Termination scenarios","End of Service Benefits"],y="FinanceApplication"):u.includes("zakat")?(x=["Gold & Silver Nisab calculation","Cash & assets 2.5% Zakat rate","Islamic Shariah compliant","Live gold prices (Dubai)"],y="FinanceApplication"):(u.includes("loan")||u.includes("emi"))&&(x=["Monthly EMI calculation","Amortization schedule","Interest breakdown","UAE bank rates comparison"],y="FinanceApplication"),{"@context":"https://schema.org","@type":"SoftwareApplication","@id":`${w}#tool`,name:(0,c.cleanText)(a.title),description:(0,c.cleanText)(a.seo?.metaDescription||a.description||""),url:w,applicationCategory:y,operatingSystem:"Web Browser, Android, iOS",isAccessibleForFree:!0,author:{"@type":"Organization","@id":`${d}/#organization`},publisher:{"@type":"Organization","@id":`${d}/#organization`},featureList:x,offers:{"@type":"Offer",price:"0",priceCurrency:"AED",availability:"https://schema.org/InStock"},image:a.mainImage?.url?[a.mainImage.url]:[f],mainEntityOfPage:{"@type":"WebPage","@id":i(b,e)}}));break;case"event":case"holiday":let z,A,B;m.push((z=b&&e?`${d}/${b}/${e}`:d,A=a.mainImage?.url?[a.mainImage.url]:[f],B={"@context":"https://schema.org","@type":"Event","@id":`${z}#event`,name:(0,c.cleanText)(a.title),description:(0,c.cleanText)(a.intro||a.description||""),image:A,startDate:g(a.startDate||a.date,a.isAllDay),endDate:g(a.endDate,a.isAllDay),eventStatus:({scheduled:"https://schema.org/EventScheduled",cancelled:"https://schema.org/EventCancelled",postponed:"https://schema.org/EventPostponed",rescheduled:"https://schema.org/EventRescheduled"})[a.status]||"https://schema.org/EventScheduled",eventAttendanceMode:a.attendanceMode||"https://schema.org/MixedEventAttendanceMode",location:{"@type":"Place",name:a.locationName||"United Arab Emirates",address:{"@type":"PostalAddress",streetAddress:a.address?.street,addressLocality:a.address?.city||"Dubai",addressRegion:a.address?.state,addressCountry:"AE"}},organizer:{"@id":`${d}/#organization`},mainEntityOfPage:{"@type":"WebPage","@id":i(b,e)}},(void 0!==a.ticketPrice||a.ticketUrl)&&(B.offers={"@type":"Offer",url:a.ticketUrl||z,price:a.ticketPrice||0,priceCurrency:a.currency||"AED",availability:!1===a.isTicketAvailable?"https://schema.org/SoldOut":"https://schema.org/InStock",validFrom:a.ticketSaleDate||a.publishedAt||new Date().toISOString()}),B));break;case"howto":let C,D,E;m.push((C=b&&e?`${d}/${b}/${e}`:d,D=a.mainImage?.url?[a.mainImage.url]:[f],E=a.steps&&Array.isArray(a.steps)?a.steps.map((a,b)=>({"@type":"HowToStep",position:b+1,name:(0,c.cleanText)(a.title||`Step ${b+1}`),text:(0,c.cleanText)(a.description||a.text||"Follow instructions"),url:`${C}#step-${b+1}`,image:a.image?.url||void 0})):[{"@type":"HowToStep",position:1,name:"Read Full Guide",text:(0,c.cleanText)(a.intro||a.description||"Follow the detailed steps in the guide."),url:C}],{"@context":"https://schema.org","@type":"HowTo","@id":`${C}#howto`,name:(0,c.cleanText)(a.title),description:(0,c.cleanText)(a.intro||a.description||""),image:D,totalTime:a.totalTime||"PT15M",estimatedCost:a.estimatedCost||{"@type":"MonetaryAmount",currency:"AED",value:"0"},step:E,publisher:{"@id":`${d}/#organization`},mainEntityOfPage:{"@type":"WebPage","@id":i(b,e)}}));break;case"deal":let F;m.push((F=b&&e?`${d}/${b}/${e}`:a.affiliateLink||d,{"@context":"https://schema.org","@type":"Offer","@id":`${F}#offer`,name:(0,c.cleanText)(a.title),description:(0,c.cleanText)(a.description||""),price:a.dealPrice||a.price,priceCurrency:a.currency||"AED",priceValidUntil:a.dealEndDate||h(),url:a.affiliateLink||F,availability:"https://schema.org/InStock",image:a.mainImage?.url?[a.mainImage.url]:[f],seller:{"@type":"Organization",name:a.retailer||"Various UAE Retailers"}}));break;default:let G,H,I;(b||e)&&m.push((G=b&&e?`${d}/${b}/${e}`:d,H=(0,c.cleanText)(a.title)||"TopTenUAE Article",I=a.mainImage?.url?[a.mainImage.url]:[f],{"@context":"https://schema.org","@type":"news"===a._type?"NewsArticle":"Article","@id":`${G}#article`,headline:H,description:(0,c.cleanText)(a.seoDescription||a.intro||a.description||""),image:I,datePublished:a.publishedAt||a._createdAt,dateModified:a._updatedAt||a.publishedAt||a._createdAt,author:{"@type":"Organization","@id":`${d}/#organization`,name:a.author?.name||"TopTenUAE Editorial Team"},publisher:{"@type":"Organization","@id":`${d}/#organization`,name:"TopTenUAE",logo:{"@type":"ImageObject","@id":`${d}/#logo`}},mainEntityOfPage:{"@type":"WebPage","@id":i(b,e)},inLanguage:"en-AE"}))}if(a.faqs&&a.faqs.length>0){let b=(l=a.faqs)&&0!==l.length?{"@context":"https://schema.org","@type":"FAQPage",mainEntity:l.map(a=>({"@type":"Question",name:(0,c.cleanText)(a.question),acceptedAnswer:{"@type":"Answer",text:(0,c.cleanText)(a.answer)}}))}:null;b&&m.push(b)}return m}function l({data:a}){if(!a)return null;let c=Array.isArray(a)&&a.length>0&&a[0]?.["@context"]||a?.["@context"]?a:k(a);return Array.isArray(c)&&(c={"@context":"https://schema.org","@graph":c}),(0,b.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(c)}})}a.s(["generateSchema",()=>k],84704),a.s(["default",()=>l],76170)},1217,a=>{"use strict";function b(a,...c){let d=a.length-1;return a.slice(0,d).reduce((a,b,d)=>a+b+c[d],"")+a[d]}b`
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
`,a.s(["ALL_DEALS_QUERY",0,e,"GENERIC_POST_QUERY",0,f,"PRODUCT_BY_SLUG_QUERY",0,c,"TOP_TEN_LIST_QUERY",0,d],1217)}];

//# sourceMappingURL=src_e64d62c4._.js.map