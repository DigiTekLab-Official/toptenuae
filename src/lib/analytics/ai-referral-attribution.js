export const AI_REFERRAL_COOKIE_NAME = 'tt_ai_ref';
export const AI_REFERRAL_COOKIE_MAX_AGE_SECONDS = 120;

const VALID_SOURCES = new Set(['chatgpt', 'perplexity', 'gemini', 'copilot']);
const VALID_METHODS = new Set(['utm_source', 'referrer']);

const UTM_SOURCE_MAP = new Map([
  ['chatgpt.com', 'chatgpt'],
]);

const REFERRER_HOST_MAP = new Map([
  ['chatgpt.com', 'chatgpt'],
  ['chat.openai.com', 'chatgpt'],
  ['perplexity.ai', 'perplexity'],
  ['gemini.google.com', 'gemini'],
  ['copilot.microsoft.com', 'copilot'],
]);

const normalize = (value) => String(value || '').trim().toLowerCase();

const sourceForReferrerHost = (hostname) => {
  const normalizedHost = normalize(hostname).replace(/^www\./, '');
  for (const [allowedHost, source] of REFERRER_HOST_MAP) {
    if (normalizedHost === allowedHost || normalizedHost.endsWith(`.${allowedHost}`)) {
      return source;
    }
  }
  return null;
};

export const getAiReferralAttribution = ({ utmSource, referrer } = {}) => {
  const utmSourceMatch = UTM_SOURCE_MAP.get(normalize(utmSource));
  if (utmSourceMatch) {
    return { source: utmSourceMatch, method: 'utm_source' };
  }

  if (!referrer) return null;

  try {
    const source = sourceForReferrerHost(new URL(referrer).hostname);
    return source ? { source, method: 'referrer' } : null;
  } catch {
    return null;
  }
};

export const serializeAiReferralAttribution = (attribution) =>
  JSON.stringify({ source: attribution.source, method: attribution.method });

export const parseAiReferralAttribution = (value) => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    if (!VALID_SOURCES.has(parsed?.source) || !VALID_METHODS.has(parsed?.method)) {
      return null;
    }
    return { source: parsed.source, method: parsed.method };
  } catch {
    return null;
  }
};
