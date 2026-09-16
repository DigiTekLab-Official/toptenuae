import {createClient} from '@sanity/client'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
try { process.loadEnvFile(resolve(ROOT, '.env.local')) } catch {}

const PROJECT_ID = 'kxdjzy8e'
const DATASET = 'production'
const API_VERSION = '2026-09-16'
const CHECKED_DATE = '2026-09-16'
const REVIEWED_AT = '2026-09-16T00:00:00.000Z'
const PAGE_ID = 'buyer-guide-windows-laptop-vs-macbook-uae'
const BUYING_GUIDE_ID = 'buyer-guide-how-to-choose-laptop-uae'
const GENERAL_ID = 'ec4a75a5-8acf-4103-bf86-3a040477e0d7'
const STUDENT_ID = 'topten-best-laptops-for-students-uae'
const CATEGORY_ID = '4bb228fd-41d6-401c-ae08-469e40084bca'
const AUTHOR_ID = '059ea742-ef28-47ce-a2f7-97f71ece3fa1'
const IMAGE_REF = 'image-ea36ad5094d7057f5328fc0146b50016198be362-2752x1536-webp'

const products = {
  yoga: {id: 'b1692b2a-b273-42d8-af7b-b39eba1cb623', asin: 'B0FM3F1SGH'},
  thinkpad: {id: 'abf7eeb0-f82f-46b2-b3c9-0cc77bf5bcdc', asin: 'B0DNQFK6B9'},
  victus: {id: '811d6310-4994-4085-a2e8-d22b084e5206', asin: 'B0DN5RWNNC'},
  surface: {id: '1b91e5bc-9f50-4100-9688-9891adbd0a7b', asin: 'B0DZBMVVLT'},
  macM2: {id: '2ef66e3f-3820-4770-8971-90bb8bcf0557', asin: 'B0DLHK2MMY'},
  macM4: {id: '83cb095b-5235-4ff2-aa9d-268d63450073', asin: 'B0DZDXCFJQ'},
  macPro: {id: 'topten-ai-laptop-apple-macbook-pro-14-m5-16gb-1tb', asin: 'B0FWD57CZH'},
  macAir: {asin: 'B0GR1N3L6Q'},
}

const partnerTag = process.env.AMAZON_PARTNER_TAG || ''
const amazon = asin => `https://www.amazon.ae/dp/${asin}?tag=${encodeURIComponent(partnerTag)}&th=1`
const ref = (_ref, _key) => ({_type: 'reference', _ref, _key})
const span = (_key, text, marks = []) => ({_key, _type: 'span', text, marks})
const block = (_key, style, parts, extra = {}) => {
  const markDefs = []
  const children = parts.map((part, index) => {
    if (typeof part === 'string') return span(`${_key}s${index}`, part)
    const marks = [...(part.strong ? ['strong'] : [])]
    if (part.href) {
      const markKey = `${_key}link${index}`
      marks.push(markKey)
      markDefs.push({_key: markKey, _type: 'link', href: part.href, blank: false})
    }
    return span(`${_key}s${index}`, part.text, marks)
  })
  return {_key, _type: 'block', style, markDefs, children, ...extra}
}
const p = (_key, ...parts) => block(_key, 'normal', parts)
const h2 = (_key, text) => block(_key, 'h2', [text])
const h3 = (_key, text) => block(_key, 'h3', [text])
const bullet = (_key, ...parts) => block(_key, 'normal', parts, {listItem: 'bullet', level: 1})
const table = (_key, rows) => ({
  _key, _type: 'table', rows: rows.map((cells, index) => ({_key: `${_key}r${index}`, _type: 'tableRow', cells})),
})
const faq = (_key, question, answer) => ({_key, _type: 'faq', question, answer: [p(`${_key}a`, answer)]})
const decisionProduct = (_key, value) => ({_key, _type: 'decisionProduct', ...value})

class MigrationError extends Error {}
const assert = (condition, message) => { if (!condition) throw new MigrationError(message) }

const requiredInternalPaths = [
  '/top-ten/best-laptops-uae',
  '/top-ten/best-laptops-for-students-uae',
  '/top-ten/best-gaming-laptops-uae',
  '/top-ten/best-ai-laptops-uae',
  '/laptops/how-to-choose-a-laptop-in-uae',
]

const body = [
  h2('phase3decisionh', 'The 60-second decision'),
  {
    _key: 'phase3decisioncards',
    _type: 'infoCards',
    cards: [
      {
        _key: 'phase3windowscard',
        _type: 'object',
        title: 'Choose Windows when compatibility is the constraint',
        description: 'Start with Windows when required course or workplace software is Windows-only, PC gaming matters, a particular GPU or peripheral driver is required, or you need a wider choice of ports, screen sizes and serviceable configurations.',
        variant: 'blue',
      },
      {
        _key: 'phase3maccard',
        _type: 'object',
        title: 'Consider MacBook when the workflow is confirmed',
        description: 'Consider a MacBook when every required application supports macOS, mobility and quiet operation matter, Apple-device integration is useful, or your work depends on a Mac-native tool such as Xcode. Configure memory and storage up front.',
        variant: 'purple',
      },
    ],
  },
  p('phase3decisionstop', {text: 'The deciding question is not which logo is better.', strong: true}, ' It is whether your required applications, drivers, peripherals, games and organisation policies support the platform. Confirm those first, then compare the exact laptops.'),
  table('phase3quicktable', [
    ['Your non-negotiable', 'Safer starting path', 'What to verify'],
    ['Windows-only course or enterprise software', 'Windows x64', 'Exact Windows edition, processor architecture and vendor requirements'],
    ['SOLIDWORKS or another Windows-listed engineering suite', 'Windows x64', 'Certified GPU/driver, RAM and faculty requirements'],
    ['iOS/macOS development with current Xcode', 'MacBook', 'Required macOS and Xcode version'],
    ['PC gaming is important', 'Windows gaming laptop', 'Game support, exact GPU, cooling, display and power limits'],
    ['Browser, Microsoft 365, Teams and video calls', 'Either', 'Company device management, plug-ins, VPN and peripherals'],
    ['Frequent campus or client travel', 'Either thin-and-light path', 'Measured weight including charger, ports and compatible applications'],
  ]),

  h2('phase3compareh', 'Windows laptop vs MacBook: practical buying comparison'),
  table('phase3comparetable', [
    ['Decision area', 'Windows laptop', 'MacBook', 'Buying action'],
    ['Operating system', 'Windows 11 across many brands and designs', 'macOS on Apple hardware', 'Choose the OS required by your applications and organisation'],
    ['Application compatibility', 'Broad PC, business and specialist-app coverage; architecture still matters', 'Strong supported macOS catalogue; Windows-only tools need a different plan', 'Check each must-have application by name and version'],
    ['Gaming', 'Wider PC game and discrete-GPU choice', 'Game availability and native support vary', 'Check the exact games and performance target'],
    ['Engineering/CAD', 'Often the safer route for Windows-listed tools and certified GPUs', 'Suitable only when the required suite supports macOS or an approved remote workflow', 'Use the faculty or software-vendor requirements'],
    ['Programming', 'Strong general development; required for some Windows/DirectX toolchains', 'Strong Unix-based workflow; required for current Xcode/iOS development', 'Choose for the target platform, containers, VMs and toolchain'],
    ['Office/business', 'Broad enterprise integration and hardware choice', 'Microsoft 365 and browser workflows can fit; proprietary enterprise tools may not', 'Confirm device management, macros, add-ins, VPN and security agents'],
    ['Creative work', 'Broad GPU and application choice', 'Useful for supported Mac-native and cross-platform workflows', 'Check the exact editor, codecs, plug-ins, GPU needs and displays'],
    ['Battery/mobility', 'Varies widely by model and processor', 'Air models emphasise thin, fanless mobility', 'Compare independent evidence for the exact model; manufacturer claims are controlled tests'],
    ['Ports', 'Ranges from minimal ultrabooks to broad business/gaming connectivity', 'Air has a compact port set; Pro adds more built-in connections', 'List every monitor, storage and accessory connection'],
    ['External displays', 'Depends on the exact GPU, USB-C/Thunderbolt implementation and dock', 'Depends on exact Mac model, chip and lid state', 'Read the model-specific support specification'],
    ['Repair/service', 'Varies by manufacturer, model and seller', 'Apple service route differs from marketplace seller cover', 'Identify the UAE service provider before paying'],
    ['Upgradeability', 'Some models allow SSD or RAM service; many thin models do not', 'Current MacBook memory and storage are configured at purchase', 'Do not assume any laptop is upgradeable without model documentation'],
    ['Ecosystem', 'Useful with Microsoft, Android and varied enterprise environments', 'Tight integration with supported Apple devices and services', 'Treat ecosystem convenience as a workflow benefit, not proof of compatibility'],
    ['Memory/storage', 'Many configurations; seller upgrades require scrutiny', 'Unified memory and SSD capacity must be chosen carefully at purchase', 'Buy for the real workload and local-storage growth'],
    ['UAE warranty', 'May be manufacturer, international or seller cover', 'Marketplace stock may not establish Apple UAE warranty', 'Confirm coverage in writing and keep the invoice'],
    ['Keyboard/layout', 'English or Arabic/English varies by exact SKU', 'English or Arabic variants can have separate ASINs', 'Check the selected variation, not the product family name'],
  ]),

  h2('phase3softwareh', 'Software compatibility decides the platform'),
  h3('phase3studenth', 'University and student software'),
  p('phase3studentp', 'Ask the faculty for the actual application list, supported operating systems, exam software, required VPN and minimum hardware. A general recommendation cannot override a course requirement. The ', {text: 'student laptop shortlist', href: '/top-ten/best-laptops-for-students-uae'}, ' applies the same check to six current student roles.'),
  h3('phase3engineeringh', 'Engineering, CAD and technical courses'),
  p('phase3engineeringp', 'Engineering software is application-specific. For example, the current SOLIDWORKS system-requirements table lists Windows 11 64-bit for its client product and x86-64 processors, while separately listing eDrawings for supported macOS versions. That does not mean every CAD tool is Windows-only; it means buyers must verify the exact product, version, GPU certification and faculty workflow.'),
  h3('phase3programmingh', 'Programming and software development'),
  p('phase3programmingp', 'Web development and many cross-platform languages can work on either platform. The target platform can decide the purchase: Apple’s current Xcode requirements specify macOS, while Windows-native enterprise, DirectX or driver development may require Windows. Also verify containers, local virtual machines, device emulators and any course image before choosing.'),
  h3('phase3businessh', 'Office and business use'),
  p('phase3businessp', 'Microsoft 365, Teams and browser-based workflows can fit either platform, but company-managed VPN, security agents, Excel add-ins, macros, line-of-business applications and device-management policies may not be interchangeable. Ask the employer or IT team before treating ordinary Office compatibility as proof that the complete workflow is supported.'),
  h3('phase3creativeh', 'Creative work'),
  p('phase3creativep', 'Choose for the actual editor, plug-ins, codecs, capture hardware, GPU acceleration, external displays and storage. Mac-native tools can make MacBook the required path; Windows systems offer a wide choice of discrete GPUs. Neither platform is universally the creator choice.'),

  h2('phase3armh', 'Windows on Arm needs a separate compatibility check'),
  p('phase3armp', 'Windows 11 on Arm can run many native Arm applications and can emulate many x86 or x64 user-mode applications. Microsoft warns that apps or peripherals which depend on a driver need an Arm-compatible driver; emulation does not solve that driver requirement.'),
  bullet('phase3arm1', 'Confirm the exact application, version and plug-ins—not just the application family.'),
  bullet('phase3arm2', 'Check VPN, endpoint security, printer, scanner, audio interface and specialist-device drivers.'),
  bullet('phase3arm3', 'Verify university exam, laboratory and remote-access software with the institution.'),
  bullet('phase3arm4', 'Check development tooling, virtualisation and local database requirements.'),
  p('phase3armlink', 'The Snapdragon Surface in the ', {text: 'student guide', href: '/top-ten/best-laptops-for-students-uae'}, ' is a portability option only after these checks. Read the ', {text: 'Surface Laptop review', href: '/reviews/microsoft-surface-laptop'}, ' for its exact configuration.'),

  h2('phase3gamingh', 'If gaming matters, start with the game list'),
  p('phase3gamingp', 'Windows is usually the more direct gaming path because the PC game catalogue, discrete-GPU choice and gaming-laptop hardware range are broader. The decision still depends on native game support, the exact GPU, display, cooling and sustained power—not the operating-system label alone. Use the ', {text: 'UAE gaming laptop shortlist', href: '/top-ten/best-gaming-laptops-uae'}, ' for that deeper comparison.'),

  h2('phase3windowspathh', 'Three currently verified Windows paths'),
  p('phase3windowspathp', 'These are decision examples, not another ranking. Each fills a different platform reason and links only to the exact Amazon.ae offer checked on 16 September 2026.'),
  decisionProduct('phase3yoga', {
    path: 'windows', role: 'General Windows choice', product: ref(products.yoga.id, 'phase3yogaref'), asin: products.yoga.asin,
    configuration: 'Lenovo Yoga 7i 2-in-1 16IML9 — Core Ultra 7 155U, 16GB LPDDR5X, 1TB SSD, 16-inch WUXGA touchscreen, Windows 11 Home.',
    bestFor: 'A buyer who wants mainstream Windows compatibility, a large touchscreen and convertible modes without moving to a gaming chassis.',
    limitation: 'At about 1.99kg it is not the lightest campus option, and it has no discrete GPU for software that genuinely requires one.',
    seller: 'Byte Mart UAE.', fulfilment: 'Delivered by Amazon.ae when checked.', keyboard: 'Backlit keyboard stated; language was not verified.',
    warranty: 'One-year seller warranty stated; the seller said the original seal was opened for an upgrade.', charger: 'UAE Type-G lead was not established; confirm before ordering.',
    offerCheckedAt: CHECKED_DATE, availabilityStatus: 'available', affiliateLink: amazon(products.yoga.asin), ctaLabel: 'Check exact Windows configuration',
  }),
  decisionProduct('phase3thinkpad', {
    path: 'windows', role: 'Business and programming Windows choice', product: ref(products.thinkpad.id, 'phase3thinkref'), asin: products.thinkpad.asin,
    configuration: 'Lenovo ThinkPad E16 Gen 2 — Core Ultra 7 155H, 32GB DDR5, 1TB SSD, 16-inch WUXGA, Windows 11 Pro.',
    bestFor: 'Heavier multitasking, programming and office workflows that benefit from 32GB memory, 1TB storage, Ethernet and a business-oriented keyboard.',
    limitation: 'The exact offer is seller-configured; confirm the installed parts, seal status and support route. It is not a certified CAD workstation.',
    seller: 'ByteHub Traders.', fulfilment: 'Fulfilled by Amazon when checked.', keyboard: 'Backlit keyboard stated; language was not verified.',
    warranty: 'One-year seller warranty stated; the seller said the original seal was opened for an upgrade.', charger: 'UAE Type-G lead was not established; confirm before ordering.',
    offerCheckedAt: CHECKED_DATE, availabilityStatus: 'available', affiliateLink: amazon(products.thinkpad.asin), ctaLabel: 'Check seller and exact configuration',
  }),
  decisionProduct('phase3victus', {
    path: 'windows', role: 'Gaming and discrete-GPU Windows choice', product: ref(products.victus.id, 'phase3victusref'), asin: products.victus.asin,
    configuration: 'HP Victus 15-fa2701wm — Core i5-13420H, 16GB RAM, 512GB SSD, RTX 4050 6GB, 15.6-inch FHD 144Hz, Windows 11.',
    bestFor: 'PC gaming or verified coursework that benefits from an NVIDIA GPU and can accept a heavier gaming-laptop design.',
    limitation: 'Bulk, charger size and unplugged use are trade-offs; an RTX gaming GPU is not automatically a certified professional-workstation GPU.',
    seller: 'THE-LAPTOP SHOP.', fulfilment: 'Fulfilled by Amazon when checked.', keyboard: 'English backlit keyboard stated.',
    warranty: 'A current UAE manufacturer or seller warranty was not established.', charger: 'UAE Type-G lead was not established; confirm before ordering.',
    offerCheckedAt: CHECKED_DATE, availabilityStatus: 'available', affiliateLink: amazon(products.victus.asin), ctaLabel: 'Check current Amazon.ae offer',
  }),

  h2('phase3macpathh', 'Two currently verified Mac paths'),
  p('phase3macpathp', 'The previously reviewed M2 and M4 Air offers are still kept out of the purchase path. The two exact offers below were orderable when rechecked on 16 September 2026.'),
  decisionProduct('phase3macair', {
    path: 'mac', role: 'MacBook mobility choice', asin: products.macAir.asin,
    title: 'Apple MacBook Air 13-inch (M5, 16GB, 512GB, English)',
    configuration: 'Apple M5, 16GB unified memory, 512GB SSD, 13.6-inch Liquid Retina display, English keyboard, macOS.',
    bestFor: 'A buyer whose confirmed macOS workflow values a thin fanless design, Apple ecosystem integration and a current 16GB/512GB starting configuration.',
    limitation: 'Two Thunderbolt 4 ports plus MagSafe and headphone jack may require a dock; memory and storage must be chosen up front.',
    seller: 'Amazon.ae.', fulfilment: 'Shipped by Amazon.ae when checked.', keyboard: 'English keyboard stated in the exact offer title.',
    warranty: 'A specific UAE manufacturer-warranty statement was not established on the offer page.', charger: 'Included UAE Type-G power lead was not established; confirm before ordering.',
    offerCheckedAt: CHECKED_DATE, availabilityStatus: 'available', affiliateLink: amazon(products.macAir.asin), ctaLabel: 'Check exact MacBook Air configuration',
  }),
  decisionProduct('phase3macpro', {
    path: 'mac', role: 'Higher-workload Mac choice', product: ref(products.macPro.id, 'phase3macproref'), asin: products.macPro.asin,
    configuration: 'Apple MacBook Pro 14-inch (M5, 16GB unified memory, 1TB SSD, Space Black) with 14.2-inch Liquid Retina XDR display.',
    bestFor: 'A confirmed macOS professional or creative workflow that benefits from the Pro model’s additional built-in connectivity and higher-workload positioning.',
    limitation: 'It is a premium-priced path, 16GB may not suit every professional workload, and it does not solve Windows-only or NVIDIA CUDA requirements.',
    seller: 'Amazon.ae.', fulfilment: 'Shipped by Amazon.ae when checked.', keyboard: 'Keyboard language was not established clearly enough to verify.',
    warranty: 'A specific UAE manufacturer-warranty statement was not established on the offer page.', charger: 'Included UAE Type-G power lead was not established; confirm before ordering.',
    offerCheckedAt: CHECKED_DATE, availabilityStatus: 'available', affiliateLink: amazon(products.macPro.asin), ctaLabel: 'Check exact MacBook Pro configuration',
  }),

  h2('phase3oldermach', 'What about the existing M2 and M4 Air reviews?'),
  p('phase3oldermacp', 'The ', {text: 'MacBook Air M2 review', href: '/reviews/apple-macbook-air-m2-2022'}, ' and ', {text: 'MacBook Air M4 review', href: '/reviews/apple-macbook-air-m4-13-inch'}, ' remain useful editorial comparisons, but their exact checked Amazon.ae offers were unavailable on 16 September 2026. Neither is used as a purchase destination here. The ', {text: 'MacBook Pro M5 review', href: '/reviews/apple-macbook-pro-14-m5-16gb-1tb'}, ' corresponds to the active Pro path above.'),

  h2('phase3uaeh', 'UAE checkout checks before choosing either platform'),
  bullet('phase3uae1', 'Open the exact ASIN and recheck processor, memory, storage, screen, colour and keyboard variation.'),
  bullet('phase3uae2', 'Identify the current seller and fulfilment party; “fulfilled by Amazon” is not the same statement as manufacturer warranty.'),
  bullet('phase3uae3', 'Confirm whether warranty service is UAE manufacturer, international or seller-provided, and keep the invoice.'),
  bullet('phase3uae4', 'Confirm keyboard language and the included charger or UAE Type-G lead.'),
  bullet('phase3uae5', 'Read return terms and delivery details for the exact UAE address before paying.'),
  bullet('phase3uae6', 'Reconfirm workplace or university software, VPN, security and peripheral compatibility.'),
  p('phase3further', 'For a broader shortlist, compare the ', {text: 'best laptops in the UAE', href: '/top-ten/best-laptops-uae'}, '. For NPU-led Windows options, use the ', {text: 'AI laptop guide', href: '/top-ten/best-ai-laptops-uae'}, '. For specifications beyond platform choice, return to the ', {text: 'complete UAE laptop buying guide', href: '/laptops/how-to-choose-a-laptop-in-uae'}, '.'),
]

const page = {
  _id: PAGE_ID,
  _type: 'buyerGuide',
  title: 'Windows Laptop vs MacBook: Which Should You Buy in the UAE?',
  slug: {_type: 'slug', current: 'windows-laptop-vs-macbook-uae'},
  description: 'A practical UAE decision guide to Windows laptops and MacBooks, covering software compatibility, work, university, gaming and exact Amazon.ae options.',
  intro: 'Choose the platform your required software, drivers, peripherals, games and organisation actually support. Windows is the safer starting point for Windows-only applications, PC gaming and many engineering workflows; consider a MacBook when the full workflow supports macOS and mobility or Apple integration matters. Neither platform is universally better.',
  body,
  categories: [ref(CATEGORY_ID, 'phase3laptopcategory')],
  featuredImage: {_type: 'image', asset: {_type: 'reference', _ref: IMAGE_REF}, alt: 'Windows laptop and MacBook buying decision guide for UAE shoppers'},
  author: {_type: 'reference', _ref: AUTHOR_ID},
  publishedAt: REVIEWED_AT,
  originalPublishedAt: REVIEWED_AT,
  lastReviewedAt: REVIEWED_AT,
  schemaType: 'Guide',
  methodology: [
    p('phase3method1', 'TopTenUAE compared current UAE search-result patterns, official platform and software documentation, existing laptop-cluster content and the exact Amazon.ae offer pages listed in this guide. Offers were checked on 16 September 2026.'),
    p('phase3method2', 'TopTenUAE did not perform laboratory benchmarks, battery rundowns, thermal measurements or first-hand durability tests. Platform advice is conditional on documented compatibility and the buyer’s actual workflow.'),
  ],
  sources: [
    {_key: 'phase3srcmicrosoftarm', _type: 'source', title: 'Using software and peripherals on Surface ARM-based devices', publisher: 'Microsoft Support', url: 'https://support.microsoft.com/en-us/surface/drivers-firmware/using-software-and-peripherals-on-surface-arm-based-devices', accessedAt: CHECKED_DATE},
    {_key: 'phase3srcsolidworks', _type: 'source', title: 'SOLIDWORKS system requirements', publisher: 'SOLIDWORKS', url: 'https://www.solidworks.com/support/system-requirements', accessedAt: CHECKED_DATE},
    {_key: 'phase3srcxcode', _type: 'source', title: 'Xcode SDK and system requirements', publisher: 'Apple Developer', url: 'https://developer.apple.com/xcode/system-requirements', accessedAt: CHECKED_DATE},
    {_key: 'phase3srcappleair', _type: 'source', title: 'MacBook Air M5 technical specifications', publisher: 'Apple Support', url: 'https://support.apple.com/en-au/126321', accessedAt: CHECKED_DATE},
    {_key: 'phase3srcipoint', _type: 'source', title: 'MacBook vs Windows Laptop UAE 2026', publisher: 'iPoint Dubai', url: 'https://ipoint.ae/blogs/news/macbook-vs-windows-laptop-uae-which-should-you-buy-in-2026', accessedAt: CHECKED_DATE},
    {_key: 'phase3srcsas', _type: 'source', title: 'MacBook vs Windows Laptop for UAE Students', publisher: 'SAS Home Tech', url: 'https://www.sas-home.tech/blog/macbook-vs-windows-laptop-uae-students', accessedAt: CHECKED_DATE},
    {_key: 'phase3srcaus', _type: 'source', title: 'Laptop requirements for first-year students', publisher: 'American University of Sharjah IT FAQ', url: 'https://itfaq.aus.edu/faq/584', accessedAt: CHECKED_DATE},
    {_key: 'phase3srcmacairamazon', _type: 'source', title: `MacBook Air M5 exact Amazon.ae offer — ASIN ${products.macAir.asin}`, publisher: 'Amazon.ae', url: amazon(products.macAir.asin), accessedAt: CHECKED_DATE},
    {_key: 'phase3srcmacproamazon', _type: 'source', title: `MacBook Pro M5 exact Amazon.ae offer — ASIN ${products.macPro.asin}`, publisher: 'Amazon.ae', url: amazon(products.macPro.asin), accessedAt: CHECKED_DATE},
  ],
  relatedProducts: [
    ref(products.yoga.id, 'phase3relatedyoga'), ref(products.thinkpad.id, 'phase3relatedthinkpad'), ref(products.victus.id, 'phase3relatedvictus'),
    ref(products.surface.id, 'phase3relatedsurface'), ref(products.macM2.id, 'phase3relatedm2'), ref(products.macM4.id, 'phase3relatedm4'), ref(products.macPro.id, 'phase3relatedmacpro'),
  ],
  affiliateDisclosure: 'TopTenUAE may earn a commission from qualifying Amazon.ae purchases. Platform guidance and product inclusion are editorial and are not determined by commission, temporary discounts or stock urgency.',
  showAffiliateDisclosure: true,
  faqs: [
    faq('phase3faq1', 'Is a Windows laptop or MacBook better for university in the UAE?', 'Neither is universally better. Get the course software list and supported operating systems first. Windows is often the safer starting point for Windows-listed engineering or specialist applications; a MacBook can fit courses whose complete workflow supports macOS.'),
    faq('phase3faq2', 'Should engineering students buy Windows or MacBook?', 'Check every required CAD, simulation, laboratory and exam application. Some major engineering suites list Windows client requirements, while other tools support macOS. GPU certification and faculty requirements can matter as much as the operating system.'),
    faq('phase3faq3', 'Is MacBook good for programming?', 'It can be a strong fit for web, Unix-based and Apple-platform development. Current Xcode requires macOS. Windows may be required for Windows-native enterprise, DirectX, driver or other platform-specific toolchains.'),
    faq('phase3faq4', 'Can a Windows-on-Arm laptop run all Windows software?', 'No universal claim is safe. Windows on Arm runs native Arm software and can emulate many x86/x64 user-mode applications, but driver-dependent apps and peripherals require compatible Arm drivers. Verify the exact application, VPN, security software and device.'),
    faq('phase3faq5', 'Is MacBook suitable for gaming?', 'Game availability and native support vary. A Windows gaming laptop is usually the more direct choice when PC gaming is important because it offers broader game and discrete-GPU options. Check each game and performance target.'),
    faq('phase3faq6', 'What should UAE buyers check on an Amazon.ae laptop offer?', 'Verify the exact ASIN and configuration, current seller and fulfilment, keyboard language, charger or UAE Type-G lead, return terms and whether warranty is UAE manufacturer, international or seller-provided.'),
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Windows Laptop vs MacBook: UAE Buying Guide',
    metaDescription: 'Windows laptop or MacBook? Compare UAE software compatibility, study, work, gaming and five exact Amazon.ae options before choosing.',
    keywords: ['Windows laptop vs MacBook', 'MacBook vs Windows laptop UAE', 'Mac vs PC UAE', 'MacBook Air vs Windows laptop UAE'],
    canonicalUrl: 'https://toptenuae.com/laptops/windows-laptop-vs-macbook-uae',
    noIndex: false,
    schemaType: 'Article',
  },
}

const contextualGuideLink = p('phase3platformdecisionlink', 'Need to decide between platforms? Use the ', {text: 'Windows laptop vs MacBook UAE decision guide', href: '/laptops/windows-laptop-vs-macbook-uae'}, ' for software, gaming, engineering, business and current-offer paths without repeating this specifications guide.')

const appendReference = (items = [], target, key) => items.some(item => item?._ref === target) ? items : [...items, ref(target, key)]
const insertGuideLink = items => {
  const filtered = (items || []).filter(item => item?._key !== contextualGuideLink._key)
  const index = filtered.findIndex(item => item?._key === 'lapmacbody')
  return index < 0 ? [...filtered, contextualGuideLink] : [...filtered.slice(0, index + 1), contextualGuideLink, ...filtered.slice(index + 1)]
}

const macProUpdate = {
  asin: products.macPro.asin,
  affiliateLink: amazon(products.macPro.asin),
  retailer: 'Amazon.ae',
  availability: 'https://schema.org/InStock',
  availabilityStatus: 'available',
  availabilityCheckedAt: CHECKED_DATE,
  lastPriceCheckedAt: REVIEWED_AT,
  lastReviewedAt: REVIEWED_AT,
  uaeCommerce: {
    _type: 'uaeCommerceContext',
    availableInUae: true,
    availabilityNote: `Exact Amazon.ae ASIN ${products.macPro.asin} was orderable on ${CHECKED_DATE}; sold by Amazon.ae.`,
    shippingNote: 'Shipped by Amazon.ae when checked. Confirm the current delivery date, returns and total delivered cost for your UAE address.',
    warrantyNote: 'A specific UAE manufacturer-warranty statement was not established on the offer page. Confirm the service route and retain the invoice.',
    voltageOrCompatibility: 'Keyboard language and the included UAE Type-G power lead were not established clearly enough to verify. Confirm both before ordering.',
  },
}

const validateState = state => {
  assert(state.category?._id === CATEGORY_ID, 'Laptop category is missing')
  assert(state.buyingGuide?._id === BUYING_GUIDE_ID, 'Existing laptop buying guide is missing')
  assert(state.general?._id === GENERAL_ID, 'General laptop page is missing')
  assert(state.student?._id === STUDENT_ID, 'Student laptop page is missing')
  assert(state.products?.length === 7, 'One or more referenced review products are missing')
  assert(!state.drafts?.length, `Draft collision detected: ${state.drafts.map(item => item._id).join(', ')}`)
}

const verifyPublished = async client => {
  const result = await client.fetch(`{
    "page": *[_id == $pageId][0]{
      _id,_type,title,"slug":slug.current,seo,schemaType,"category":categories[0]->_id,
      "faqCount":count(faqs),"decisionProducts":body[_type == "decisionProduct"]{title,asin,affiliateLink,availabilityStatus,offerCheckedAt,"productRef":product._ref},
      "bodyLinks":body[].markDefs[].href,"relatedProducts":relatedProducts[]._ref
    },
    "generalLinks": *[_id == $generalId][0].relatedContent[]._ref,
    "studentLinks": *[_id == $studentId][0].relatedContent[]._ref,
    "buyingGuideLinks": *[_id == $buyingGuideId][0].body[].markDefs[].href,
    "macProducts": *[_id in $macIds]{_id,asin,affiliateLink,availabilityStatus,availabilityCheckedAt}
  }`, {pageId: PAGE_ID, generalId: GENERAL_ID, studentId: STUDENT_ID, buyingGuideId: BUYING_GUIDE_ID, macIds: [products.macM2.id, products.macM4.id, products.macPro.id]})
  const doc = result.page
  assert(doc?._id === PAGE_ID && doc._type === 'buyerGuide', 'Phase 3 page is missing')
  assert(doc.slug === 'windows-laptop-vs-macbook-uae', 'Phase 3 slug mismatch')
  assert(doc.category === CATEGORY_ID, 'Laptop category mismatch')
  assert(doc.seo?.canonicalUrl === 'https://toptenuae.com/laptops/windows-laptop-vs-macbook-uae', 'Canonical mismatch')
  assert(doc.seo?.noIndex === false, 'Phase 3 page must remain indexable')
  assert(doc.schemaType === 'Guide', 'Top-level schema type mismatch')
  assert(doc.faqCount === 6, 'Visible FAQ count mismatch')
  assert(doc.decisionProducts?.length === 5, 'Expected five decision-path products')
  for (const item of doc.decisionProducts) {
    assert(item.availabilityStatus === 'available', `Inactive product included: ${item.title || item.asin}`)
    assert(item.offerCheckedAt === CHECKED_DATE, `Offer date mismatch: ${item.title || item.asin}`)
    const destination = new URL(item.affiliateLink)
    assert(destination.hostname === 'www.amazon.ae', `Non-Amazon destination: ${item.title || item.asin}`)
    assert(destination.pathname === `/dp/${item.asin}`, `ASIN mismatch: ${item.title || item.asin}`)
    assert(destination.searchParams.get('tag') === partnerTag, `Affiliate tag mismatch: ${item.title || item.asin}`)
  }
  const bodyLinks = new Set((doc.bodyLinks || []).filter(Boolean))
  for (const path of requiredInternalPaths) assert(bodyLinks.has(path), `Missing internal link ${path}`)
  assert(!bodyLinks.has('/top-ten/best-business-laptops-uae'), 'Non-existent business page must not be linked')
  assert(doc.relatedProducts?.length === 7, 'Expected seven review relationships')
  assert(result.generalLinks?.includes(PAGE_ID), 'General page backlink missing')
  assert(result.studentLinks?.includes(PAGE_ID), 'Student page backlink missing')
  assert(result.buyingGuideLinks?.includes('/laptops/windows-laptop-vs-macbook-uae'), 'Buying-guide backlink missing')
  const macById = new Map(result.macProducts.map(item => [item._id, item]))
  assert(macById.get(products.macM2.id)?.affiliateLink == null, 'Unavailable M2 offer has an active path')
  assert(macById.get(products.macM4.id)?.affiliateLink == null, 'Unavailable M4 offer has an active path')
  assert(macById.get(products.macPro.id)?.asin === products.macPro.asin, 'MacBook Pro ASIN mismatch')
  assert(macById.get(products.macPro.id)?.availabilityStatus === 'available', 'MacBook Pro should be active')
  return result
}

async function main() {
  const modes = process.argv.filter(arg => ['--plan', '--write', '--validate'].includes(arg))
  assert(modes.length === 1, 'Choose exactly one mode: --plan, --write or --validate')
  const mode = modes[0].slice(2)
  assert(partnerTag === 'apfunbox06-21', 'Phase 3 requires the existing apfunbox06-21 production tag')
  const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
  if (mode === 'write') assert(token, 'A Sanity write token is required for --write')
  const client = createClient({projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, useCdn: false, perspective: mode === 'write' ? 'raw' : 'published', token})
  const state = await client.fetch(`{
    "category": *[_id == $categoryId][0]{_id},
    "buyingGuide": *[_id == $buyingGuideId][0]{_id,_rev,body},
    "general": *[_id == $generalId][0]{_id,_rev,relatedContent},
    "student": *[_id == $studentId][0]{_id,_rev,relatedContent},
    "products": *[_id in $productIds]{_id,_rev},
    "drafts": *[_id in $draftIds]{_id}
  }`, {
    categoryId: CATEGORY_ID, buyingGuideId: BUYING_GUIDE_ID, generalId: GENERAL_ID, studentId: STUDENT_ID,
    productIds: Object.values(products).filter(item => item.id).map(item => item.id),
    draftIds: [PAGE_ID, BUYING_GUIDE_ID, GENERAL_ID, STUDENT_ID, products.macPro.id].map(id => `drafts.${id}`),
  })
  validateState(state)

  if (mode === 'validate') {
    const result = await verifyPublished(client)
    console.log(JSON.stringify({ok: true, mode, page: result.page._id, decisionProducts: 5, reviewRelationships: 7}, null, 2))
    return
  }

  if (mode === 'plan') {
    console.log(JSON.stringify({
      ok: true, mode, page: PAGE_ID, decisionProducts: body.filter(item => item._type === 'decisionProduct').map(item => ({title: item.title || item.configuration, asin: item.asin, status: item.availabilityStatus})),
      backlinks: {general: GENERAL_ID, student: STUDENT_ID, buyingGuide: BUYING_GUIDE_ID, reviews: page.relatedProducts.length},
      macOfferUpdate: macProUpdate,
    }, null, 2))
    return
  }

  let transaction = client.transaction().createOrReplace(page)
  transaction = transaction.patch(GENERAL_ID, patch => patch.ifRevisionId(state.general._rev).set({relatedContent: appendReference(state.general.relatedContent, PAGE_ID, 'phase3relateddecision')}))
  transaction = transaction.patch(STUDENT_ID, patch => patch.ifRevisionId(state.student._rev).set({relatedContent: appendReference(state.student.relatedContent, PAGE_ID, 'phase3studentdecision')}))
  transaction = transaction.patch(BUYING_GUIDE_ID, patch => patch.ifRevisionId(state.buyingGuide._rev).set({body: insertGuideLink(state.buyingGuide.body)}))
  const macPro = state.products.find(item => item._id === products.macPro.id)
  transaction = transaction.patch(products.macPro.id, patch => patch.ifRevisionId(macPro._rev).set(macProUpdate))
  const commit = await transaction.commit({visibility: 'sync', returnDocuments: false})
  const result = await verifyPublished(client.withConfig({perspective: 'published'}))
  console.log(JSON.stringify({ok: true, mode, transactionId: commit.transactionId, page: result.page._id, decisionProducts: 5, reviewRelationships: 7}, null, 2))
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
