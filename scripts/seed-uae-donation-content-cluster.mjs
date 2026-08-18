import { createClient } from '@sanity/client';

const AUTHOR_ID = '059ea742-ef28-47ce-a2f7-97f71ece3fa1';
const GUIDES_CATEGORY_ID = '971e2a07-e6bd-4826-b009-2bb87992dc16';
const PUBLISHED_AT = '2026-08-18T00:00:00.000Z';

let sequence = 0;
const key = (prefix = 'k') => `${prefix}${String(++sequence).padStart(4, '0')}`;
const span = (text, marks = []) => ({ _key: key('s'), _type: 'span', marks, text });
const block = (text, style = 'normal') => ({
  _key: key('b'), _type: 'block', style, markDefs: [], children: [span(text)],
});
const bullet = (text) => ({ ...block(text), listItem: 'bullet', level: 1 });
const linkedBlock = (before, label, href, after = '') => {
  const markKey = key('m');
  return {
    _key: key('b'), _type: 'block', style: 'normal',
    markDefs: [{ _key: markKey, _type: 'link', href }],
    children: [span(before), span(label, [markKey, 'strong']), span(after)],
  };
};
const faq = (question, answer) => ({
  _key: key('f'), _type: 'faq', question, answer: [block(answer)],
});

const common = (id, title, slug, intro, metaTitle, metaDescription, keywords, body, faqs) => ({
  _id: id,
  _type: 'howTo',
  title,
  slug: { _type: 'slug', current: slug },
  Author: { _type: 'reference', _ref: AUTHOR_ID },
  categories: [{ _key: key('c'), _type: 'reference', _ref: GUIDES_CATEGORY_ID }],
  publishedAt: PUBLISHED_AT,
  intro,
  schemaType: 'NewsArticle',
  body,
  faqs,
  seo: {
    _type: 'seo',
    metaTitle,
    metaDescription,
    keywords,
    schemaType: 'NewsArticle',
  },
});

const clothesFurniture = common(
  'uae-donation-cluster-clothes-furniture-2026',
  'Where to Donate Clothes and Furniture in Dubai & UAE (2026)',
  'where-to-donate-clothes-furniture-dubai-uae',
  'A practical UAE guide to donating clean clothing, usable furniture and household items through established collection services, with checks to make before booking a pickup or using a donation bin.',
  'Donate Clothes & Furniture in Dubai and UAE',
  'Find current options to donate clothes, furniture and household items in Dubai and the UAE, including pickup guidance, accepted items and preparation tips.',
  ['donate clothes Dubai', 'furniture donation Dubai', 'charity pickup UAE', 'donation boxes UAE'],
  [
    block('Quick answer: where can you donate?', 'h2'),
    block('Dubai Charity Association provides an in-kind donation channel that lists clothing, furniture, toys, books, electronics, kitchenware and other reusable household categories. Its form asks for pickup details, so it is a useful first option for larger loads. Sahem National also says its collection service receives clothes, books, furniture, appliances, toys and several recyclable materials through pickup orders.'),
    block('Always confirm that your item and area are currently covered before arranging transport. Collection capacity, campaign dates and accepted conditions can change.'),
    block('Best options to check first', 'h2'),
    linkedBlock('', 'Dubai Charity Association in-kind donations', 'https://dubaicharity.org/en/inkind-donations', ' — lists both reusable and recyclable item categories and provides a pickup request form.'),
    linkedBlock('', 'Sahem National', 'https://www.sahemnational.ae/sahem-faq/', ' — states that pickup orders can cover clothing, furniture, books, appliances, toys and other household items.'),
    block('What condition should donated items be in?', 'h2'),
    bullet('Clothes: freshly washed, completely dry, folded and packed in a closed bag. Donate wearable pieces rather than torn, stained or damp textiles.'),
    bullet('Furniture: structurally safe, clean and complete. Photograph large items before requesting pickup so the collector can confirm suitability and vehicle size.'),
    bullet('Appliances: working, cleaned and supplied with essential cables or accessories. Disclose any fault instead of presenting the item as usable.'),
    bullet('Bedding and soft furnishings: clean and dry. Ask before including mattresses, pillows or heavily used textiles because hygiene rules differ.'),
    block('How to arrange a pickup', 'h2'),
    block('Make a simple inventory, take clear photos and measure bulky furniture. Open the organisation’s official website or app, check its accepted-item list, then submit the requested address and collection details. Keep items indoors until the collection is confirmed; leaving furniture beside a public donation bin can create an obstruction and expose it to dust or rain.'),
    block('Donation bins versus scheduled collection', 'h2'),
    block('Use a labelled donation bin only for the categories shown on that bin. Bags of clean clothes and small reusable items may be suitable, while furniture and appliances normally need a scheduled collection. If a bin is full, do not leave bags beside it—contact the operator or choose another official location.'),
    block('UAE donation rules to remember', 'h2'),
    linkedBlock('Giving your own reusable possessions through an established channel is different from collecting money from the public. The ', 'UAE Government fundraising guidance', 'https://u.ae/en/Help/FAQs/charity-and-humanitarian-work', ' says fundraising activities require a permit through registered charity organisations. Do not organise a public cash collection or publish personal payment details as part of an informal appeal.'),
    block('More ways to give', 'h2'),
    linkedBlock('For children’s items, use our ', 'UAE toy-donation guide', 'https://toptenuae.com/how-to-guides/where-to-donate-used-toys-uae', '. For monetary giving, compare established channels in our licensed UAE charity guide.'),
  ],
  [
    faq('Who collects donated furniture in Dubai?', 'Dubai Charity Association and Sahem National both publish in-kind collection options that include furniture. Confirm the current service area, item condition and pickup availability directly before booking.'),
    faq('Can I put furniture next to a clothes donation bin?', 'No. Donation bins are intended only for the categories printed on them. Large furniture should be kept safely indoors until an authorised collection is arranged.'),
    faq('Can I donate damaged clothing?', 'Wearable clothing should be clean and in usable condition. For torn or worn-out textiles, choose a service that explicitly accepts recyclable clothing rather than placing it with reusable donations.'),
  ],
);

const books = common(
  'uae-donation-cluster-books-2026',
  'Where to Donate Books in Dubai & UAE (2026)',
  'where-to-donate-books-dubai-uae',
  'A current guide to donating children’s books, novels, textbooks and magazines in the UAE, with official options and a checklist that helps your books reach a useful second home.',
  'Where to Donate Books in Dubai & UAE (2026)',
  'Find places to donate books in Dubai and the UAE, including children’s-book programmes, in-kind collection services and practical preparation advice.',
  ['donate books Dubai', 'book donation UAE', 'used books donation Dubai', 'textbook donation UAE'],
  [
    block('Book donation options to check', 'h2'),
    linkedBlock('', 'UAE Board on Books for Young People (UAEBBY)', 'https://uaebby.org.ae/support-us/donate-books/', ' provides a dedicated book-donation request route and is particularly relevant for children’s and young readers’ books.'),
    linkedBlock('', 'Dubai Charity Association', 'https://dubaicharity.org/en/inkind-donations', ' lists books and magazines among its in-kind donation categories, alongside a pickup request form.'),
    linkedBlock('', 'Sahem National', 'https://www.sahemnational.ae/sahem-faq/', ' says its pickup service receives books and paper as well as other household donations.'),
    block('Which books are most useful?', 'h2'),
    bullet('Children’s books with complete pages, safe bindings and age-appropriate content.'),
    bullet('Recent textbooks and reference books that still match a current curriculum or practical subject.'),
    bullet('Novels, biographies and general-interest non-fiction in clean, readable condition.'),
    bullet('Arabic and English titles that suit the programme or community receiving them.'),
    block('Books that may be refused', 'h2'),
    block('Water-damaged, mouldy, heavily annotated or incomplete books are difficult to redistribute and can damage other stock. Very old technical manuals, obsolete school editions and loose photocopies may be better suited to paper recycling. Ask the organisation before transporting encyclopaedias, large academic collections or magazines.'),
    block('How to prepare a book donation', 'h2'),
    block('Sort books by audience and language, wipe dusty covers and remove personal notes, receipts or school labels that contain private information. Pack books flat in small, strong boxes—large cartons quickly become too heavy for volunteers. Label each box with the language and type, such as “Arabic children’s books” or “English novels”.'),
    block('Before you travel', 'h2'),
    block('Send the organisation a short description of the quantity, language, age range and condition. Ask whether it prefers drop-off or collection and whether a campaign end date applies. A quick confirmation prevents an unnecessary journey and helps the receiving team plan storage.'),
    block('For school books and notebooks', 'h2'),
    block('Separate reusable textbooks from written-in notebooks and loose paper. Schools and children’s programmes may want current textbooks, while used notebooks usually belong in paper recycling. Never donate documents containing names, phone numbers, grades or other personal information.'),
    block('Build a complete donation box', 'h2'),
    linkedBlock('If you are clearing a family home, you may also have toys or clothing to pass on. See our ', 'toy donation guide', 'https://toptenuae.com/how-to-guides/where-to-donate-used-toys-uae', ' and our clothes-and-furniture guide for separate preparation and collection advice.'),
  ],
  [
    faq('Where can I donate children’s books in the UAE?', 'UAEBBY provides a dedicated book-donation request route. Confirm the suitable age range, language, condition and handover method before sending books.'),
    faq('Can I donate old school textbooks?', 'Potentially, if the edition is still useful and the receiving organisation accepts it. Share the curriculum, subject and publication year first; obsolete books may need paper recycling.'),
    faq('Do charities collect books from home in Dubai?', 'Some in-kind services publish pickup forms that include books, such as Dubai Charity Association and Sahem National. Availability depends on location, quantity and current capacity.'),
  ],
);

const inKind = common(
  'uae-donation-cluster-in-kind-2026',
  'In-Kind Donations in the UAE: What Charities Accept & How Pickup Works',
  'in-kind-donations-uae-charity-pickup',
  'Use this checklist to choose a legitimate in-kind donation channel in the UAE, prepare reusable goods, book a pickup and avoid common mistakes with donation bins and informal fundraising.',
  'In-Kind Donations UAE: Items, Pickup & Rules',
  'Learn how in-kind donations work in the UAE, what established services accept, how to prepare items and when fundraising rules apply.',
  ['in-kind donations UAE', 'charity pickup UAE', 'donate used items Dubai', 'UAE donation rules'],
  [
    block('What is an in-kind donation?', 'h2'),
    block('An in-kind donation is a useful item rather than money—for example clothing, books, furniture, toys, kitchenware or a working appliance. The receiving organisation decides whether an item can be redistributed, recycled or used to support its programmes.'),
    block('A five-step donation checklist', 'h2'),
    block('1. Choose the item’s next use', 'h3'),
    block('Decide whether the item is genuinely reusable, needs specialist recycling or should be disposed of safely. A donation is not a substitute for waste collection: recipients need clean, complete and safe goods.'),
    block('2. Verify an official channel', 'h3'),
    block('Use the organisation’s official website, app or published phone number. Check the exact accepted categories, location and campaign dates instead of relying on an old social-media post or an unlabelled collection box.'),
    block('3. Describe the donation accurately', 'h3'),
    block('List quantities, sizes and faults, and attach current photos for furniture or appliances. Accurate details help the collection team decide whether it can accept the items and send a suitable vehicle.'),
    block('4. Clean, sort and pack', 'h3'),
    block('Group items by type, remove personal data, use manageable boxes and label fragile goods. Keep paired parts together and include essential cables or instructions where possible.'),
    block('5. Confirm the handover', 'h3'),
    block('For collection, confirm the date, contact method and any building-access requirements. For drop-off, confirm opening hours and the exact entrance. Do not abandon items outside a closed office or full bin.'),
    block('What established services say they accept', 'h2'),
    linkedBlock('', 'Dubai Charity Association’s in-kind channel', 'https://dubaicharity.org/en/inkind-donations', ' lists clothing, furniture, toys, books, electronics, medical-support items, kitchenware and other household categories.'),
    linkedBlock('', 'Sahem National’s FAQ', 'https://www.sahemnational.ae/sahem-faq/', ' lists clothing, plastic, books, paper, furniture, appliances, toys, strollers, kitchenware and electronic items, with pickup orders submitted through its app.'),
    linkedBlock('', 'Toys With Wings', 'https://www.toyswithwings.org/donate-a-toy', ' focuses on toy donations and asks donors to use its current selected-location guidance or contact the initiative.'),
    block('The legal boundary: donating goods versus fundraising', 'h2'),
    linkedBlock('Passing your own items to an established service is not the same as soliciting money from the public. Under the ', 'UAE’s official charity guidance', 'https://u.ae/en/Help/FAQs/charity-and-humanitarian-work', ', fundraising requires a permit through registered charity organisations. Avoid collecting cash, advertising a personal bank account or running a public appeal without the required authorisation.'),
    block('Choose the right specialist guide', 'h2'),
    linkedBlock('For detailed options and preparation steps, open our ', 'toy donation guide', 'https://toptenuae.com/how-to-guides/where-to-donate-used-toys-uae', ', book donation guide, or clothes-and-furniture guide. For financial donations, use our overview of established UAE charity organisations.'),
  ],
  [
    faq('What items can I donate to charity in the UAE?', 'Published in-kind channels may accept clothing, furniture, books, toys, appliances, kitchenware and other household items. Each service sets its own condition, location and capacity rules, so confirm first.'),
    faq('Is charity pickup free in the UAE?', 'Some organisations offer collection, but availability and any conditions depend on the area, item type and quantity. Use the organisation’s official booking channel to confirm.'),
    faq('Can an individual collect money for a family in need?', 'UAE official guidance says public fundraising requires a permit through registered charity organisations. Work with an authorised organisation rather than collecting money into a personal account.'),
  ],
);

const documents = [clothesFurniture, books, inKind];
const args = new Set(process.argv.slice(2));
const shouldWrite = args.has('--write') || args.has('--publish');
const publish = args.has('--publish');

const summary = documents.map((doc) => ({
  id: doc._id,
  slug: doc.slug.current,
  title: doc.title,
  bodyBlocks: doc.body.length,
  approximateWords: doc.body
    .flatMap((item) => item.children || [])
    .reduce((count, child) => count + String(child.text || '').trim().split(/\s+/).filter(Boolean).length, 0),
  mode: publish ? 'published' : shouldWrite ? 'draft' : 'dry-run',
}));

if (!shouldWrite) {
  console.log(JSON.stringify({ mode: 'dry-run', documents: summary }, null, 2));
  console.log('Use --write to create drafts, or --publish to publish. Both require TOPTEN_WRITE_TOKEN.');
  process.exit(0);
}

if (!process.env.TOPTEN_WRITE_TOKEN) {
  throw new Error('TOPTEN_WRITE_TOKEN is required for --write or --publish');
}

const client = createClient({
  projectId: 'kxdjzy8e',
  dataset: 'production',
  apiVersion: '2025-12-01',
  useCdn: false,
  token: process.env.TOPTEN_WRITE_TOKEN,
});

let transaction = client.transaction();
for (const doc of documents) {
  const targetId = publish ? doc._id : `drafts.${doc._id}`;
  transaction = transaction.createOrReplace({ ...doc, _id: targetId });
}
const result = await transaction.commit({ visibility: 'sync', returnDocuments: false });
console.log(JSON.stringify({ mode: publish ? 'published' : 'draft', transactionId: result.transactionId, documents: summary }, null, 2));
