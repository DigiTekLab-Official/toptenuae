import { EncryptJWT, jwtDecrypt } from 'jose';
import { z } from 'zod';

const ISSUER = 'toptenuae.com';
const AUDIENCE = 'newsletter-confirmation';

const SubscriptionPayload = z.object({
  email: z.string().email().trim().toLowerCase(),
});

async function encryptionKey(secret: string): Promise<Uint8Array> {
  if (!secret) throw new Error('Newsletter token secret is not configured');

  return new Uint8Array(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
  );
}

export async function createSubscriptionToken(email: string, secret: string): Promise<string> {
  const payload = SubscriptionPayload.parse({ email });

  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('1h')
    .encrypt(await encryptionKey(secret));
}

export async function readSubscriptionToken(token: string, secret: string): Promise<string> {
  const { payload } = await jwtDecrypt(token, await encryptionKey(secret), {
    issuer: ISSUER,
    audience: AUDIENCE,
  });

  return SubscriptionPayload.parse(payload).email;
}
