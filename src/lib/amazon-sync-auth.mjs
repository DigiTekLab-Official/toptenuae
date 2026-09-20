const encoder = new TextEncoder();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_BODY_BYTES = 256;
const REQUIRED_BODY = '{"operation":"sync"}';
const replayCache = new Map();

const bytesToHex = (bytes) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

async function sha256(value) {
  return bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))));
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  return bytesToHex(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

function equalHex(left, right) {
  if (!/^[a-f0-9]{64}$/.test(left) || !/^[a-f0-9]{64}$/.test(right)) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function reject(status, category) {
  return { ok: false, status, category };
}

export async function authorizeAmazonSyncRequest(
  request,
  {
    secret,
    enabled,
    now = Date.now(),
    nonces = replayCache,
  },
) {
  const url = new URL(request.url);
  if (request.method !== 'POST') return reject(405, 'METHOD_NOT_ALLOWED');
  if (url.pathname !== '/api/amazon-sync') return reject(403, 'AUTHORIZATION_REJECTED');
  if (!enabled || typeof secret !== 'string' || secret.length < 32) return reject(403, 'AUTHORIZATION_REJECTED');

  const timestamp = request.headers.get('x-toptenuae-sync-timestamp');
  const nonce = request.headers.get('x-toptenuae-sync-nonce');
  const supplied = request.headers.get('x-toptenuae-sync-signature');
  if (!timestamp || !/^\d{10}$/.test(timestamp) || !nonce || !/^[A-Za-z0-9_-]{32,128}$/.test(nonce) || !supplied?.startsWith('v1=')) {
    return reject(401, 'AUTHORIZATION_REJECTED');
  }
  const timestampMs = Number(timestamp) * 1000;
  if (!Number.isSafeInteger(timestampMs) || Math.abs(now - timestampMs) > WINDOW_MS) return reject(401, 'AUTHORIZATION_REJECTED');

  const body = await request.text();
  if (encoder.encode(body).byteLength > MAX_BODY_BYTES || body !== REQUIRED_BODY) return reject(401, 'AUTHORIZATION_REJECTED');
  const canonical = `${timestamp}\n${nonce}\nPOST\n/api/amazon-sync\n${await sha256(body)}`;
  const expected = await hmac(secret, canonical);
  if (!equalHex(supplied.slice(3), expected)) return reject(401, 'AUTHORIZATION_REJECTED');

  for (const [value, expiresAt] of nonces) if (expiresAt < now) nonces.delete(value);
  if (nonces.has(nonce)) return reject(401, 'AUTHORIZATION_REJECTED');
  nonces.set(nonce, timestampMs + WINDOW_MS);
  return { ok: true, body };
}

export function resetAmazonSyncReplayCacheForTests() {
  replayCache.clear();
}

const json = (status, value, headers = {}) => new Response(JSON.stringify(value), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
});

export async function handleAmazonSyncRequest(request, {
  secret,
  enabled,
  sync,
  now = undefined,
  nonces = undefined,
}) {
  const authorization = await authorizeAmazonSyncRequest(request, { secret, enabled, now, nonces });
  if (!authorization.ok) {
    return json(authorization.status, { success: false, error: authorization.category },
      authorization.status === 405 ? { Allow: 'POST' } : {});
  }
  if (typeof sync !== 'function') return json(500, { success: false, error: 'AMAZON_SYNC_FAILED' });
  try {
    const result = await sync();
    return json(200, { success: true, result });
  } catch {
    return json(500, { success: false, error: 'AMAZON_SYNC_FAILED' });
  }
}
