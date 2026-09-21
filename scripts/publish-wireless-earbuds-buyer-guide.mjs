import { createReadStream } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createClient } from '@sanity/client';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://toptenuae.com';
const DOCUMENT_ID = 'buyer-guide-how-to-choose-wireless-earbuds-uae';
const CATEGORY_ID = 'f8ccfedf-bda2-4a57-98d3-b86454c687fa';
const RANKING_ID = '4a6f3748-947a-4be2-b5f3-91deed323433';
const AUTHOR_ID = '059ea742-ef28-47ce-a2f7-97f71ece3fa1';
const REVIEWED_AT = '2026-09-21T00:00:00.000Z';
const IMAGE_PATH = 'public/images/wireless-earbuds/how-to-choose-wireless-earbuds-uae.png';
const IMAGE_ALT = 'In-ear, open-ear and stem-style wireless earbuds compared on a table in a UAE home';

const args = new Set(process.argv.slice(2));
const publish = args.has('--publish');

let sequence = 0;
const key = (prefix = 'k') => `${prefix}${String(++sequence).padStart(5, '0')}`;
const span = (text, marks = []) => ({ _key: key('s'), _type: 'span', text, marks });
const block = (text, style = 'normal', extra = {}) => ({
  _key: key('b'), _type: 'block', style, markDefs: [], children: [span(text)], ...extra,
});
const h2 = (text) => block(text, 'h2');
const h3 = (text) => block(text, 'h3');
const bullet = (text) => block(text, 'normal', { listItem: 'bullet', level: 1 });
const number = (text) => block(text, 'normal', { listItem: 'number', level: 1 });
const rich = (parts, style = 'normal', extra = {}) => {
  const markDefs = [];
  const children = parts.map((part) => {
    if (typeof part === 'string') return span(part);
    const marks = [];
    if (part.href) {
      const markKey = key('m');
      markDefs.push({ _key: markKey, _type: 'link', href: part.href });
      marks.push(markKey);
    }
    if (part.strong) marks.push('strong');
    if (part.em) marks.push('em');
    return span(part.text, marks);
  });
  return { _key: key('b'), _type: 'block', style, markDefs, children, ...extra };
};
const table = (rows) => ({
  _key: key('t'), _type: 'table',
  rows: rows.map((cells) => ({ _key: key('r'), _type: 'tableRow', cells })),
});
const faq = (question, answer) => ({
  _key: key('f'), _type: 'faq', question, answer: [block(answer)],
});
const source = (publisher, title, url, note) => ({
  _key: key('src'), _type: 'editorialSource', publisher, title, url,
  accessedAt: '2026-09-21', note,
});

const paths = {
  hub: `${SITE}/wireless-earbuds`,
  ranking: `${SITE}/top-ten/best-wireless-earbuds-uae`,
  headphones: `${SITE}/top-ten/best-noise-cancelling-headphones-uae`,
  p20i: `${SITE}/reviews/soundcore-anker-p20i-earbuds`,
  sony: `${SITE}/reviews/sony-wf-1000xm5-earbuds`,
  airpods: `${SITE}/reviews/apple-airpods-pro-3`,
  p30i: `${SITE}/reviews/soundcore-p30i-noise-cancelling-earbuds`,
  galaxy: `${SITE}/reviews/samsung-galaxy-buds3-pro-earbuds`,
  ugreen: `${SITE}/reviews/ugreen-clipbuds-open-earbuds`,
};

const document = {
  _id: DOCUMENT_ID,
  _type: 'buyerGuide',
  title: 'How to Choose the Right Wireless Earbuds in UAE',
  slug: { _type: 'slug', current: 'how-to-choose-wireless-earbuds-uae' },
  author: { _type: 'reference', _ref: AUTHOR_ID },
  categories: [{ _key: key('cat'), _type: 'reference', _ref: CATEGORY_ID }],
  publishedAt: REVIEWED_AT,
  updatedAt: REVIEWED_AT,
  lastReviewedAt: REVIEWED_AT,
  intro: [
    block('Quick answer: start with fit and phone compatibility, then decide whether you need active noise cancellation, stronger call features, multipoint, water resistance or long single-charge life. Use manufacturer battery and IP figures as limits, not promises. Finally, verify the exact UAE seller, model and warranty before paying.'),
  ],
  body: [
    h2('Start with the way you will actually use them'),
    block('The useful first question is not “which earbuds have the longest feature list?” It is “where do I need them to work?” A commuter may value secure sealing and active noise cancellation. A person taking calls across a laptop and phone may care more about microphone processing and multipoint. A runner may prioritise stability and a documented resistance rating. Someone who dislikes pressure in the ear canal may prefer an open-ear design even though it isolates less.'),
    block('Write down your two most common situations before comparing models. That keeps a headline feature from replacing the practical requirement.'),
    table([
      ['Main use', 'Prioritise', 'Check before buying'],
      ['Metro, flights or a noisy office', 'Stable seal, ANC, useful transparency mode', 'Comfort over a full session and ANC-on battery claim'],
      ['Calls and online meetings', 'Microphone system, sidetone or transparency, multipoint', 'Call samples, laptop compatibility and device switching'],
      ['Walking or running outdoors', 'Secure fit, controls, awareness choice, resistance rating', 'Earbud rating separately from the case'],
      ['One phone ecosystem', 'Fast pairing and ecosystem features', 'Which features disappear on another brand of phone'],
      ['Several devices', 'Multipoint or reliable automatic switching', 'Whether switching works across your exact phone, tablet and computer'],
    ]),

    h2('1. Fit and comfort come before sound features'),
    block('A sealed in-ear earbud needs the right tip size and position. A weak seal can reduce bass and passive isolation and make ANC less effective. A tip that is too large can create pressure; one that is too small may loosen while walking. Left and right ears can require different sizes.'),
    block('Where possible, choose a model with several tip sizes and a return policy that lets you assess comfort responsibly. Manufacturer fit tools can help with seal, but they do not prove long-session comfort. Apple, for example, documents an Acoustic Seal Test for AirPods Pro 3 and supplies five tip sizes; that is a model-specific aid, not a guarantee that the shape suits every ear.'),
    h3('In-ear vs open-ear'),
    table([
      ['Design', 'What it does well', 'Trade-off'],
      ['Sealed in-ear', 'Passive isolation, fuller low-frequency seal, stronger foundation for ANC', 'Can feel intrusive or create pressure for some users'],
      ['Semi-open/stem without a silicone seal', 'Less blocked-in feeling for some ears', 'Fit is less adjustable and isolation is lower'],
      ['Open-ear clip or hook', 'Leaves more surrounding sound audible and avoids sealing the canal', 'Leaks more outside sound into listening and is less suitable for strong isolation'],
    ]),
    rich(['If keeping more surrounding sound audible is the priority, inspect the documented design and limitations in our ', { text: 'UGREEN ClipBuds open-ear review', href: paths.ugreen }, '. It is an example of the form factor, not proof that open-ear is safer in every situation.']),

    h2('2. Understand ANC and passive noise isolation'),
    block('Passive isolation comes from the physical seal. Active noise cancellation uses microphones and processing to reduce some external sound. They work together, but neither removes every sound, and performance varies by fit, frequency and environment. Transparency or ambient mode deliberately feeds in more outside sound when you need awareness.'),
    bullet('Choose ANC for repeated use in steady background noise, not because a product page quotes an unverified percentage or decibel figure.'),
    bullet('Check whether the earbuds retain a useful battery life with ANC switched on; the larger case total is not the same as one continuous session.'),
    bullet('Treat transparency quality as a separate feature. It can be useful at a station or office without replacing attention to your surroundings.'),
    rich(['For a premium cross-platform feature set, the ', { text: 'Sony WF-1000XM5 review', href: paths.sony }, ' documents ANC, Ambient Sound, multipoint and the supported codecs. For a lower-cost ANC route, the ', { text: 'soundcore P30i review', href: paths.p30i }, ' records adaptive ANC, transparency and multipoint without claiming independently tested superiority.']),
    rich(['If you need longer wear, a larger battery or the physical isolation of full-size headphones, compare the trade-offs in our ', { text: 'noise-cancelling headphones guide', href: paths.headphones }, '. Over-ear is a different form factor, not an automatic upgrade.']),

    h2('3. Treat call quality as a real-world requirement'),
    block('A microphone count is not a call-quality score. Wind, traffic, room echo, voice-processing software, stem position and the calling app all affect the result. Manufacturer phrases such as “AI call noise reduction” describe a feature; they do not establish how your voice will sound in a Dubai street or a shared office.'),
    block('For frequent calls, look for recent voice samples recorded in noise, controls that can mute or answer without reaching for the phone, and a transparency or sidetone experience that does not make your own voice feel blocked. Confirm whether the microphone and control functions work on both your phone and your meeting computer.'),
    block('If you switch between a work laptop and phone, verify multipoint explicitly. Automatic switching tied to one brand ecosystem is not the same as standards-based multipoint across arbitrary devices.'),

    h2('4. Match the earbuds to your phone ecosystem'),
    h3('For iPhone users'),
    block('AirPods can operate as Bluetooth headphones with non-Apple devices, but Apple states that functionality may be limited. The reverse buying lesson is equally important: do not pay for ecosystem features unless you will use the compatible Apple devices and software.'),
    rich(['The ', { text: 'AirPods Pro 3 review', href: paths.airpods }, ' is the relevant Apple-focused review. It documents ANC, Transparency, Voice Isolation, five tip sizes, IP57 for the earbuds and case, and Apple-specific integration.']),
    h3('For Android users'),
    block('Android support is not identical across every phone. AOSP supports several Bluetooth codecs, but phone manufacturers decide which are enabled and prioritised. A premium codec matters only when both the phone and earbuds support it, and connection conditions still affect results.'),
    block('Samsung documents SSC and SSC-UHQ, Auto Switch and other features for compatible Galaxy products. Those are reasons to consider Galaxy Buds with a Galaxy phone, not universal Android benefits.'),
    rich(['See the ', { text: 'Samsung Galaxy Buds3 Pro review', href: paths.galaxy }, ' for the exact Galaxy-oriented feature set and its compatibility caveat. Buyers who mix Android, Windows and other devices may prefer a model with clearly documented multipoint and broadly supported codecs.']),

    h2('5. Read battery claims correctly'),
    block('Battery figures are normally measured under specified test conditions. Volume, ANC, calls, codec, spatial features, temperature and battery age can change real use. Compare like with like:'),
    bullet('Earbuds-only time tells you whether one charge covers a commute, work block or flight segment.'),
    bullet('Earbuds-plus-case time includes recharging breaks and is not continuous listening time.'),
    bullet('ANC-on and ANC-off figures should be separated.'),
    bullet('Fast-charge claims should include the charging time and the listening time obtained.'),
    bullet('Check whether the case uses USB-C, wireless charging or both, and whether a cable is included.'),
    block('Use the manufacturer figure as a planning ceiling and leave a margin. If long calls are central, look for talk-time data rather than assuming music playback time applies.'),

    h2('6. Decode the IP rating without overreading it'),
    block('An IP code describes tested resistance under defined conditions. The first digit relates to solid-particle protection and the second to water. An “X” means that digit was not specified, not that the product passed every dust test. The earbuds and charging case may have different ratings.'),
    bullet('IPX4 is a splash-resistance claim, not permission to swim.'),
    bullet('A higher water digit does not make the product indestructible or suitable for salt water, shower products or a washing machine.'),
    bullet('Resistance can diminish with wear, impact and ageing; follow the exact drying and charging instructions.'),
    block('Apple explicitly says its resistant AirPods are not waterproof or sweatproof and should not be used for swimming or showering. Apply the same discipline to every brand: read the exact model manual and check whether the case shares the rating.'),

    h2('7. Controls, apps and switching can matter every day'),
    block('Touch controls look similar on a specification sheet but differ in what can be reassigned. Check volume control, track control, ANC/transparency switching, voice assistant access, call handling and accidental-touch behaviour. If an app is required for firmware or EQ, confirm it supports your phone and remains available in your regional app store.'),
    block('Multipoint is useful when you genuinely alternate between two sources. Gamers and video viewers should also check latency in the apps and devices they use; a Bluetooth version number alone does not guarantee low latency.'),

    h2('8. Choose a budget band by the compromise you accept'),
    h3('Under AED 100'),
    block('Prioritise fit, stable basic controls, a usable app if offered, and a clearly documented resistance rating. ANC, multipoint and call processing can appear at this level, but verify them model by model. The soundcore P20i was live on Amazon.ae at AED 58.99 when checked on 21 September 2026; its review documents IPX5, app EQ and up to 30 hours with the case, but no ANC.'),
    rich(['Review the ', { text: 'soundcore P20i', href: paths.p20i }, ' as a current budget example, then check today’s exact seller and price before purchase.']),
    h3('AED 100–300'),
    block('This band can add stronger app support, multipoint, open-ear alternatives or more complete noise-control features. Spend the extra amount only when it solves a stated need—such as dual-device use or an open-ear fit—not because the list of modes is longer.'),
    h3('Above AED 300'),
    block('Premium models may combine ANC, transparency, ecosystem integration, better charging options and broader codec support. The premium is easier to justify when several of those benefits work with your devices. It is harder to justify if the fit is wrong or the differentiating features are locked to another ecosystem.'),
    block('Prices and seller availability can change quickly. Use budget bands to narrow the decision, then verify the exact model, seller, colour or storage-style variant, delivery terms and warranty before checkout.'),

    h2('9. Check UAE seller and warranty details before paying'),
    block('A familiar product name can appear in different regional versions or through different marketplace sellers. Before checkout, record the exact model number and seller, then check whether the manufacturer or authorised UAE service channel covers that version. Keep the invoice and do not assume “fulfilled by” identifies the seller or the warranty provider.'),
    number('Match the model or SKU on the listing with the manufacturer specifications.'),
    number('Check the seller name, delivery source and stated return terms.'),
    number('Confirm who provides the warranty and where service is handled in the UAE.'),
    number('Check what is included in the box, especially ear tips and charging cable.'),
    number('Recheck price and availability on the day you buy.'),

    h2('A five-minute decision process'),
    number('Choose sealed in-ear, semi-open or open-ear based on fit and isolation.'),
    number('Select the two features your main use genuinely needs: ANC, calls, multipoint, ecosystem integration, resistance or battery.'),
    number('Eliminate models that do not fully support your phone and second device.'),
    number('Compare earbuds-only battery, ANC-on battery and the case rating separately.'),
    number('Verify the exact UAE offer, seller, model number and warranty.'),
    rich(['Then move from criteria to products in our ', { text: 'Best Wireless Earbuds in UAE comparison', href: paths.ranking }, '. For the complete cluster, browse the ', { text: 'wireless earbuds hub', href: paths.hub }, '.']),

    h2('Compare current picks by use case'),
    block('The links below are a short route into the existing reviews, not a second ranking. Specifications and availability can change, so each review states its evidence and limitations.'),
    table([
      ['Need', 'Current review to inspect', 'Reason to inspect it'],
      ['Low-cost basics', 'soundcore P20i', 'App EQ and IPX5; no ANC claim'],
      ['Lower-cost ANC and two-device use', 'soundcore P30i', 'Adaptive ANC, transparency and documented multipoint'],
      ['Apple ecosystem', 'AirPods Pro 3', 'Apple-specific features, five tips and IP57 earbuds/case'],
      ['Compatible Galaxy ecosystem', 'Galaxy Buds3 Pro', 'SSC/SSC-UHQ, Auto Switch and IP57 earbuds'],
      ['Premium cross-platform feature set', 'Sony WF-1000XM5', 'ANC, Ambient Sound, multipoint and broad codec support'],
      ['Open-ear fit', 'UGREEN ClipBuds', 'Open-ear clip design, app and dual-device support'],
    ]),
    rich([{ text: 'Budget: soundcore P20i review', href: paths.p20i }, ' · ', { text: 'Budget ANC: soundcore P30i review', href: paths.p30i }, ' · ', { text: 'Apple: AirPods Pro 3 review', href: paths.airpods }]),
    rich([{ text: 'Galaxy: Buds3 Pro review', href: paths.galaxy }, ' · ', { text: 'Premium cross-platform: Sony WF-1000XM5 review', href: paths.sony }, ' · ', { text: 'Open-ear: UGREEN ClipBuds review', href: paths.ugreen }]),
    block('Once you know which use case fits, use the ranking to compare the full current shortlist and continue to the product review before following any Amazon.ae purchase link.'),
  ],
  faqs: [
    faq('How do I choose wireless earbuds that fit?', 'Start with a design you can tolerate, use the supplied tip sizes, and check for a stable seal without painful pressure. Fit tools can help assess the acoustic seal, but only a real wearing session reveals long-term comfort.'),
    faq('Is ANC the same as noise isolation?', 'No. Passive isolation comes from the physical seal; ANC uses microphones and processing to reduce some external sound. Their effectiveness depends on fit, frequency and environment.'),
    faq('Which earbuds are best for calls in the UAE?', 'Do not choose from microphone count alone. Compare recent call samples in wind and traffic, multipoint support, mute and call controls, and compatibility with the phone and meeting computer you use.'),
    faq('Should iPhone users always buy AirPods?', 'No. AirPods offer deeper Apple integration, but fit, budget and required features still decide value. Cross-platform earbuds can be a better match when you also use Windows or Android devices.'),
    faq('What IP rating should workout earbuds have?', 'Choose a rating that matches the manufacturer-approved use and check the earbuds and case separately. An IP rating is not a blanket waterproof guarantee, and resistance can diminish over time.'),
  ],
  methodology: [
    block('This guide separates decision criteria from product ranking. General advice was checked against current manufacturer support/specification pages and Android platform documentation. Product examples are limited to existing TopTenUAE reviews whose specifications and limitations are recorded; no comparative sound, comfort, call or ANC performance is claimed without independent testing.'),
  ],
  sources: [
    source('Apple Support', 'Choose your AirPods Pro ear tips', 'https://support.apple.com/en-ae/119849', 'Supports the role of tip size and a seal test; left and right ears may need different sizes.'),
    source('Apple UAE', 'AirPods Pro 3 — Technical Specifications', 'https://www.apple.com/ae/airpods-pro/specs/', 'Supports current IP57, battery, charging, tip-size and cross-platform limitation details.'),
    source('Apple Support', 'About the sweat and water resistance of AirPods', 'https://support.apple.com/en-ae/105046', 'Supports the distinction between resistance and waterproof use and notes that resistance can diminish.'),
    source('Samsung Gulf', 'Galaxy Buds3 Pro — Specifications', 'https://www.samsung.com/ae/audio-sound/galaxy-buds/galaxy-buds3-pro-silver-sm-r630nzaamea/', 'Supports current UAE codec, Auto Switch, microphone, IP57 and battery specifications.'),
    source('Android Open Source Project', 'Bluetooth services', 'https://source.android.com/docs/core/connect/bluetooth/services', 'Supports Android codec availability and manufacturer-configured codec priorities.'),
    source('UGREEN', 'ClipBuds Headphones — SKU 75624', 'https://www.ugreen.com/en-ca/products/ca-75624', 'Supports the current open-ear form factor, dual-device support, IPX5 and charging claims used for the example.'),
  ],
  affiliateDisclosure: 'TopTenUAE may earn a commission from qualifying purchases reached through linked product reviews. The decision framework and editorial recommendations are not determined by commission.',
  showAffiliateDisclosure: true,
  seo: {
    _type: 'seo',
    metaTitle: 'How to Choose Wireless Earbuds in UAE (2026 Buying Guide)',
    metaDescription: 'Learn how to choose wireless earbuds in the UAE by fit, ANC, calls, phone compatibility, battery, IP rating, controls, warranty and budget.',
    keywords: [
      'how to choose wireless earbuds',
      'wireless earbuds buying guide UAE',
      'best earbuds for calls UAE',
      'noise cancelling earbuds UAE',
      'ANC vs passive noise isolation',
      'open ear vs in ear earbuds',
      'earbuds for iPhone and Android',
      'earbuds IPX rating',
      'earbuds battery life',
      'earbuds under AED 100',
      'earbuds under AED 300',
      'wireless earbuds UAE warranty',
    ],
    noIndex: false,
    schemaType: 'Guide',
  },
  _imagePath: IMAGE_PATH,
  _imageAlt: IMAGE_ALT,
};

const plainWords = (blocks) => (blocks || [])
  .flatMap((item) => item.children || [])
  .flatMap((child) => String(child.text || '').trim().split(/\s+/).filter(Boolean));
const internalLinks = (blocks) => (blocks || []).flatMap((item) => item.markDefs || [])
  .filter((mark) => mark._type === 'link' && mark.href?.startsWith(SITE))
  .map((mark) => mark.href);

const summary = {
  mode: publish ? 'publish' : 'dry-run',
  id: document._id,
  url: `${SITE}/wireless-earbuds/${document.slug.current}`,
  title: document.seo.metaTitle,
  h1: document.title,
  metaDescription: document.seo.metaDescription,
  approximateWords: plainWords(document.intro).length + plainWords(document.body).length,
  bodyBlocks: document.body.length,
  faqCount: document.faqs.length,
  internalLinks: [...new Set(internalLinks(document.body))],
  directAmazonLinks: internalLinks(document.body).filter((href) => /amazon\.ae|amzn\.to/i.test(href)).length,
  imagePath: document._imagePath,
  imageAlt: document._imageAlt,
};

if (!publish) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

if (args.has('--cli-auth') && process.env.SANITY_CLI_AUTH_DELEGATED !== '1') {
  const studioDir = resolve(ROOT, '../../00-Shared-Core/universal-studio');
  const sanityBin = resolve(studioDir, 'node_modules/.bin/sanity');
  const result = spawnSync(
    sanityBin,
    ['exec', import.meta.filename, '--with-user-token', '--', '--publish', '--cli-auth'],
    {
      cwd: studioDir,
      stdio: 'inherit',
      env: { ...process.env, SANITY_CLI_AUTH_DELEGATED: '1' },
    },
  );
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

const token = process.env.TOPTEN_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
let client;
if (token) {
  client = createClient({ projectId: 'kxdjzy8e', dataset: 'production', apiVersion: '2026-09-21', useCdn: false, token });
} else if (args.has('--cli-auth')) {
  const cliModule = resolve(ROOT, '../../00-Shared-Core/universal-studio/node_modules/sanity/lib/cli.js');
  const { getCliClient } = await import(pathToFileURL(cliModule).href);
  client = getCliClient({ projectId: 'kxdjzy8e', dataset: 'production', apiVersion: '2026-09-21' });
} else {
  throw new Error('TOPTEN_WRITE_TOKEN/SANITY_AUTH_TOKEN or --cli-auth is required');
}

const state = await client.fetch(`{
  "existing": *[_id == $documentId][0]{_id,_rev,publishedAt,featuredImage},
  "conflicts": *[_type == "buyerGuide" && slug.current == $slug && _id != $documentId]{_id,title},
  "category": *[_id == $categoryId][0]{_id,_rev},
  "ranking": *[_id == $rankingId][0]{_id,_rev,relatedBuyerGuide}
}`, {
  documentId: DOCUMENT_ID,
  slug: document.slug.current,
  categoryId: CATEGORY_ID,
  rankingId: RANKING_ID,
});

if (state.conflicts.length) throw new Error(`Duplicate route: ${JSON.stringify(state.conflicts)}`);
if (!state.category) throw new Error(`Wireless-earbuds category ${CATEGORY_ID} not found`);
if (!state.ranking) throw new Error(`Wireless-earbuds ranking ${RANKING_ID} not found`);

document.publishedAt = state.existing?.publishedAt || REVIEWED_AT;
if (state.existing?.featuredImage) {
  document.featuredImage = state.existing.featuredImage;
} else {
  const asset = await client.assets.upload('image', createReadStream(resolve(ROOT, document._imagePath)), {
    filename: document._imagePath.split('/').pop(),
    title: document._imageAlt,
  });
  document.featuredImage = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: document._imageAlt,
  };
}
delete document._imagePath;
delete document._imageAlt;

let transaction = client.transaction().createOrReplace(document);
transaction = transaction.patch(
  client.patch(RANKING_ID)
    .ifRevisionId(state.ranking._rev)
    .set({ relatedBuyerGuide: { _type: 'reference', _ref: DOCUMENT_ID } })
);

const result = await transaction.commit({ visibility: 'sync', returnDocuments: false });
console.log(JSON.stringify({ ...summary, transactionId: result.transactionId }, null, 2));
