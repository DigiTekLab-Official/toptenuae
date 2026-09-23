import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

// The existing test stack runs Node tests with TypeScript transpilation. Load
// the real serializer through that path, stubbing only unrelated site imports.
const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../src/components/sanity/PortableText.tsx', import.meta.url), 'utf8')
  .replace('import.meta.env.PUBLIC_BASE_URL', 'undefined');
const compiled = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX},
}).outputText;
const exports = {};
const Noop = () => null;
const moduleRequire = (name) => {
  if (name === '@/sanity/lib/image') return {urlForImage: () => ({url: () => 'https://cdn.sanity.io/test.jpg'})};
  if (name === '@/components/ui/BuyButton') return {default: ({url, customLabel, retailer}) => React.createElement('a', {href: url, 'data-retailer': retailer}, customLabel)};
  if (name === '@/components/icons') return {ExternalLink: Noop};
  if (name === '@/lib/affiliate/amazon-asin') return {getAmazonUaeAsin: () => null};
  if (name === '@/lib/seo/legacy-redirects') return {canonicalizeAuditedInternalLink: (url) => url};
  if (name.startsWith('@/')) return {default: Noop};
  return require(name);
};
vm.runInNewContext(compiled, {exports, require: moduleRequire, console}, {filename: 'PortableText.tsx'});
const PortableText = exports.default;

const image = {asset: {_ref: 'image-example-600x400-jpg'}, alt: 'Sample product'};
const paragraph = (text) => ({
  _type: 'block', _key: text, style: 'normal', markDefs: [],
  children: [{_type: 'span', _key: `${text}-span`, text, marks: []}],
});
const render = (block) => renderToStaticMarkup(React.createElement(PortableText, {value: [{_key: 'test', ...block}]}));

test('product highlights render the raw image, write-up, and linked-product CTA', () => {
  const html = render({
    _type: 'productHighlight', heading: 'Top pick', image,
    body: [paragraph('Fits this guide')], relatedProduct: {affiliateLink: 'https://noon.com/offer', retailer: 'Noon'},
  });
  assert.match(html, /Top pick/);
  assert.match(html, /Fits this guide/);
  assert.match(html, /cdn\.sanity\.io\/test\.jpg/);
  assert.match(html, /href="https:\/\/noon\.com\/offer"/);
  assert.match(html, /data-retailer="noon"/);
});

test('an explicit CTA overrides the product link, and a missing destination hides the CTA', () => {
  const override = render({
    _type: 'productHighlight', heading: 'Override', image,
    ctaUrl: 'https://www.amazon.ae/offer', ctaLabel: 'See offer',
    relatedProduct: {affiliateLink: 'https://noon.com/old', retailer: 'Noon'},
  });
  assert.match(override, /href="https:\/\/www\.amazon\.ae\/offer"/);
  assert.match(override, /data-retailer="amazon"/);
  assert.match(override, /See offer/);
  assert.doesNotMatch(override, /noon\.com\/old/);

  const noDestination = render({_type: 'productHighlight', heading: 'No offer', image});
  assert.doesNotMatch(noDestination, /<a\b/);
});

test('legacy grid remains text first, image right, with no tint or border', () => {
  const html = render({_type: 'contentImageGrid', content: [paragraph('Legacy text')], image});
  assert.ok(html.indexOf('Legacy text') < html.indexOf('<figure'));
  assert.match(html, /lg:grid-cols-\[3fr_2fr\]/);
  assert.doesNotMatch(html, /lg:order-[12]|bg-(?:blue|amber|slate)-50|border-(?:blue|amber|slate)-200/);
});

test('left grid reverses desktop order while keeping text first on mobile', () => {
  const html = render({_type: 'contentImageGrid', content: [paragraph('Left text')], image, imagePosition: 'left'});
  assert.ok(html.indexOf('Left text') < html.indexOf('<figure'));
  assert.match(html, /lg:grid-cols-\[2fr_3fr\]/);
  assert.match(html, /lg:order-2/);
  assert.match(html, /lg:order-1/);
});

test('grid and highlight tints use existing Tailwind color utilities', () => {
  for (const [tint, classes] of [
    ['blue', ['bg-blue-50', 'border-blue-200']],
    ['amber', ['bg-amber-50', 'border-amber-200']],
    ['neutral', ['bg-slate-50', 'border-slate-200']],
  ]) {
    for (const block of [
      {_type: 'contentImageGrid', content: [paragraph('Tinted grid')], image, backgroundTint: tint},
      {_type: 'productHighlight', heading: 'Tinted highlight', image, backgroundTint: tint},
    ]) {
      const html = render(block);
      for (const className of classes) assert.ok(html.includes(className), `${tint} missing ${className}`);
    }
  }
});
