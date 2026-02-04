(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,81936,e=>{"use strict";var t=e.i(98134),l=e.i(75201);function a({allContent:e,categories:a,toolPages:o,staticPages:n,productionUrl:r}){let[g,i]=(0,l.useState)(!1),$=e=>e.categorySlug?`${r}/${e.categorySlug}/${e.slug}`:`${r}/${e.slug}`;return(0,t.jsxs)("div",{className:"mb-8 flex gap-4 items-center",children:[(0,t.jsx)("button",{onClick:()=>{i(!0);let t="Type,Title,URL,Category,Last Updated\n";e.forEach(e=>{let l=$(e),a=(e.title||"No Title").replace(/"/g,'""'),o=(e.categoryTitle||"No Category").replace(/"/g,'""'),n=e._type,r=new Date(e._updatedAt).toLocaleDateString();t+=`"${n}","${a}","${l}","${o}","${r}"
`}),a.forEach(e=>{let l=`${r}/${e.slug}`,a=e.title.replace(/"/g,'""'),o=new Date(e._updatedAt).toLocaleDateString();t+=`"category","${a}","${l}","N/A","${o}"
`}),o.forEach(e=>{let l=`${r}/${e.slug}`,a=e.title.replace(/"/g,'""');t+=`"tool","${a}","${l}","N/A","N/A"
`}),n.forEach(e=>{let l=e.slug?`${r}/${e.slug}`:r,a=e.title.replace(/"/g,'""');t+=`"static","${a}","${l}","N/A","N/A"
`});let l=new Blob([t],{type:"text/csv"}),g=document.createElement("a");g.href=URL.createObjectURL(l),g.download=`toptenuae-content-report-${new Date().toISOString().split("T")[0]}.csv`,g.click(),setTimeout(()=>i(!1),500)},disabled:g,className:"px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition shadow-md",children:g?"Generating...":"📥 Download CSV Report"}),(0,t.jsx)("button",{onClick:()=>{i(!0);let t=`TOPTENUAE.COM - CONTENT REPORT
`;t+=`Generated: ${new Date().toLocaleString()}
Production URL: ${r}
`+"=".repeat(80)+"\n\n"+`SUMMARY
`+"-".repeat(80)+"\n"+`Dynamic Posts: ${e.length}
`+`Categories: ${a.length}
`+`Tools: ${o.length}
`+`Static Pages: ${n.length}
`+`TOTAL: ${e.length+a.length+o.length+n.length}

`+`
${"=".repeat(80)}
`+`FUNCTIONAL TOOLS (${o.length})
`+`${"=".repeat(80)}

`,o.forEach((e,l)=>{t+=`${l+1}. ${e.title}
   ${r}/${e.slug}

`}),t+=`
${"=".repeat(80)}
ALL PUBLISHED CONTENT (${e.length})
${"=".repeat(80)}

`,e.forEach((e,l)=>{t+=`${l+1}. ${e.title||"No Title"}
   Type: ${e._type}
   Category: ${e.categoryTitle||"No Category"}
   URL: ${$(e)}
   Updated: ${new Date(e._updatedAt).toLocaleDateString()}

`}),t+=`
${"=".repeat(80)}
CATEGORIES (${a.length})
${"=".repeat(80)}

`,a.forEach((e,l)=>{t+=`${l+1}. ${e.title}
   Slug: ${e.slug}
   URL: ${r}/${e.slug}
   Updated: ${new Date(e._updatedAt).toLocaleDateString()}

`}),t+=`
${"=".repeat(80)}
STATIC PAGES (${n.length})
${"=".repeat(80)}

`,n.forEach((e,l)=>{let a=e.slug?`${r}/${e.slug}`:r;t+=`${l+1}. ${e.title}
   ${a}

`});let l=new Blob([t],{type:"text/plain"}),g=document.createElement("a");g.href=URL.createObjectURL(l),g.download=`toptenuae-content-report-${new Date().toISOString().split("T")[0]}.txt`,g.click(),setTimeout(()=>i(!1),500)},disabled:g,className:"px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition shadow-md",children:g?"Generating...":"📄 Download TXT Report"}),(0,t.jsxs)("div",{className:"text-sm text-gray-500 ml-4",children:["All URLs will use: ",(0,t.jsx)("strong",{className:"text-gray-900",children:r})]})]})}e.s(["DownloadButtons",()=>a])}]);