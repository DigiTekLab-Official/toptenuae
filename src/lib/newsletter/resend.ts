import { Resend, type ErrorResponse } from 'resend';

type NewsletterDestination = {
  apiKey: string;
  segmentId: string;
  topicId?: string;
};

export class NewsletterProviderError extends Error {
  statusCode: number | null;
  code: string;

  constructor(operation: string, error: ErrorResponse) {
    super(`Newsletter provider rejected ${operation}`);
    this.name = 'NewsletterProviderError';
    this.statusCode = error.statusCode;
    this.code = error.name;
  }
}

function requireConfig(config: NewsletterDestination): void {
  const missing = Object.entries({
    apiKey: config.apiKey,
    segmentId: config.segmentId,
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Newsletter provider configuration is incomplete: ${missing.join(', ')}`);
  }
}

function isAlreadyPresent(error: ErrorResponse | null): boolean {
  return error?.statusCode === 409;
}

export async function confirmResendSubscriber(
  email: string,
  config: NewsletterDestination
): Promise<void> {
  requireConfig(config);
  const resend = new Resend(config.apiKey);

  const existing = await resend.contacts.get(email);

  if (existing.error && existing.error.statusCode !== 404) {
    throw new NewsletterProviderError('contact lookup', existing.error);
  }

  if (!existing.data) {
    const created = await resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: config.segmentId }],
      ...(config.topicId
        ? { topics: [{ id: config.topicId, subscription: 'opt_in' as const }] }
        : {}),
    });

    if (!created.error) return;
    if (!isAlreadyPresent(created.error)) {
      throw new NewsletterProviderError('contact creation', created.error);
    }
  }

  const updated = await resend.contacts.update({ email, unsubscribed: false });
  if (updated.error) {
    throw new NewsletterProviderError('contact subscription update', updated.error);
  }

  const segmented = await resend.contacts.segments.add({
    email,
    segmentId: config.segmentId,
  });
  if (segmented.error && !isAlreadyPresent(segmented.error)) {
    throw new NewsletterProviderError('segment assignment', segmented.error);
  }

  if (config.topicId) {
    const topicUpdated = await resend.contacts.topics.update({
      email,
      topics: [{ id: config.topicId, subscription: 'opt_in' }],
    });
    if (topicUpdated.error) {
      throw new NewsletterProviderError('topic subscription update', topicUpdated.error);
    }
  }
}
