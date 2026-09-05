import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/topTenSections.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext}}).outputText;
const { splitBuyingGuideContent } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const block = (text, style = 'normal') => ({ _type: 'block', style, children: [{_type:'span', text}], markDefs: [] });

test('separates existing answers, short checks and nested methodology without losing links or prose', () => {
  const answer = {...block('Choose the existing recommendation.'), markDefs: [{_key:'a',_type:'link',href:'/reviews/example'}]};
  const evidence = block('No hands-on testing.');
  const nested = block('Manufacturer documentation', 'h3');
  const link = {_type:'relatedLink',targetPost:{slug:'existing-guide'}};
  const result = splitBuyingGuideContent([
    block('Quick answer: our picks','h2'), answer,
    block('Shortlist by use case','h3'), block('Existing shortlist rationale'),
    block('How we selected these products','h2'), evidence, nested, link,
  ], [block('How to choose','h2'),block('Existing advice'),block('UAE buying checklist','h2'),block('Check the plug.'),block('Sources','h2'),block('Documentation')]);
  assert.deepEqual(result.quickAnswer, [answer]);
  assert.ok(result.methodology.includes(evidence));
  assert.ok(result.methodology.includes(nested));
  assert.ok(result.methodology.includes(link));
  assert.equal(result.checks[0].children[0].text,'Check the plug.');
  assert.equal(result.sources[0].children[0].text,'Sources');
  assert.equal(result.editorial.length,2);
});

test('missing and legacy content produce no invented answer or checklist', () => {
  assert.ok(Object.values(splitBuyingGuideContent(null, undefined)).every(section => section.length === 0));
  const prose = block('Older introduction');
  assert.deepEqual(splitBuyingGuideContent([null, prose], []).editorial,[prose]);
});

test('long UAE context stays below products rather than becoming a large early checklist', () => {
  const long = block('Long existing context. '.repeat(100));
  const result = splitBuyingGuideContent([], [block('UAE buying checks','h2'),long]);
  assert.deepEqual(result.checks,[]);
  assert.ok(result.guide.includes(long));
});
