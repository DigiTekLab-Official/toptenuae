import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAiReferralAttribution,
  parseAiReferralAttribution,
  serializeAiReferralAttribution,
} from '../src/lib/analytics/ai-referral-attribution.js';

test('recognizes the documented ChatGPT utm_source value', () => {
  assert.deepEqual(getAiReferralAttribution({ utmSource: 'chatgpt.com' }), {
    source: 'chatgpt',
    method: 'utm_source',
  });
});

test('recognizes only allowlisted AI referral hosts', () => {
  assert.deepEqual(
    getAiReferralAttribution({ referrer: 'https://www.perplexity.ai/search/example' }),
    { source: 'perplexity', method: 'referrer' }
  );
  assert.deepEqual(
    getAiReferralAttribution({ referrer: 'https://gemini.google.com/app/example' }),
    { source: 'gemini', method: 'referrer' }
  );
  assert.deepEqual(
    getAiReferralAttribution({ referrer: 'https://copilot.microsoft.com/chats/example' }),
    { source: 'copilot', method: 'referrer' }
  );
});

test('does not classify generic Google, Bing, arbitrary UTM values or lookalike hosts as AI', () => {
  assert.equal(getAiReferralAttribution({ utmSource: 'newsletter' }), null);
  assert.equal(getAiReferralAttribution({ referrer: 'https://www.google.com/search?q=coffee' }), null);
  assert.equal(getAiReferralAttribution({ referrer: 'https://www.bing.com/search?q=coffee' }), null);
  assert.equal(getAiReferralAttribution({ referrer: 'https://chatgpt.com.example.com/' }), null);
});

test('cookie payload accepts only the purpose-limited source and method enums', () => {
  const serialized = serializeAiReferralAttribution({
    source: 'chatgpt',
    method: 'utm_source',
  });
  assert.deepEqual(parseAiReferralAttribution(serialized), {
    source: 'chatgpt',
    method: 'utm_source',
  });
  assert.equal(parseAiReferralAttribution('{"source":"arbitrary","method":"utm_source"}'), null);
  assert.equal(parseAiReferralAttribution('not-json'), null);
});
