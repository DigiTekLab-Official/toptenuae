// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';
import { createSubscriptionToken } from '@/lib/newsletter/token';

const SubscribeSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  fax: z.string().optional(),
  token: z.string().min(1),
});

// In-memory rate limiting
const rateLimit = new Map<string, number>();

export const POST: APIRoute = async ({ request }) => {
  try {
    // Rate limit
    const ip = request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || 'unknown';
    const now = Date.now();
    const lastRequestTime = rateLimit.get(ip);

    if (lastRequestTime && now - lastRequestTime < 5000) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait 5 seconds before trying again.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '5' } }
      );
    }
    rateLimit.set(ip, now);
    if (rateLimit.size > 10_000) rateLimit.clear();

    const body = await request.json();
    const result = SubscribeSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, fax, token } = result.data;

    // Honeypot
    if (fax) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sanitize
    const sanitizedEmail = email.replace(/[<>"']/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Email format invalid after processing' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Turnstile verification
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: JSON.stringify({
        secret: import.meta.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!verifyRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Security check failed. Please refresh and try again.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return new Response(
        JSON.stringify({ error: 'Security check failed. Please refresh and try again.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate secure confirmation link
    const secureToken = await createSubscriptionToken(sanitizedEmail, import.meta.env.JWT_SECRET);
    const confirmUrl = new URL('/newsletter/confirm', import.meta.env.PUBLIC_BASE_URL);
    confirmUrl.searchParams.set('token', secureToken);

    // Send email
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    const { error: sendError } = await resend.emails.send({
      from: 'Top Ten UAE <newsletter@toptenuae.com>',
      to: [sanitizedEmail],
      subject: 'Action Required: Confirm your subscription 🇦🇪',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4b0082;">Please verify your email</h2>
          <p>You're almost there! Click the button below to confirm your subscription to Top Ten UAE.</p>
          <div style="text-align: center; margin: 30px 0;">
             <a href="${confirmUrl.toString()}" style="background: #4b0082; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 16px;">Confirm Subscription</a>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            ⏱️ Link expires in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 11px; color: #999;">
            © ${new Date().getFullYear()} Top Ten UAE. All rights reserved.
          </p>
        </div>
      `,
    });

    if (sendError) {
      console.error('Newsletter confirmation email rejected', {
        code: sendError.name,
        statusCode: sendError.statusCode,
      });
      return new Response(
        JSON.stringify({ error: 'Failed to send confirmation email. Please try again later.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Check your email to confirm your subscription!' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    console.error('Newsletter subscription failed');
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
