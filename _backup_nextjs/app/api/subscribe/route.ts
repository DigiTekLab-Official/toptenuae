// src/app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SignJWT } from 'jose';
import { getEnv } from '@/lib/validateEnv';
import { SubscribeSchema } from '@/lib/validation/schemas';
import { captureException, addBreadcrumb } from '@/lib/monitoring';
import { z } from 'zod';

// Configuration for Node.js runtime (required for Resend email sending)
export const dynamic = 'force-dynamic';

// ✅ FIXED: Use getEnv to fail fast if JWT_SECRET is missing
const SECRET = new TextEncoder().encode(getEnv('JWT_SECRET'));

// Rate limiting (in-memory)
const rateLimit = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

export async function POST(request: Request) {
  try {
    // 1. 🚦 RATE LIMIT CHECK (with better implementation)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const lastRequestTime = rateLimit.get(ip);

    // Check if too many requests in short time
    if (lastRequestTime && now - lastRequestTime < 5000) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
      addBreadcrumb('Rate limit exceeded', { ip });
      return NextResponse.json(
        { error: "Too many requests. Please wait 5 seconds before trying again." },
        { status: 429, headers: { 'Retry-After': '5' } }
      );
    }
    rateLimit.set(ip, now);
    addBreadcrumb('Subscribe request', { ip });

    const body = await request.json();

    // 2. ✅ VALIDATE REQUEST WITH ZOD
    const result = SubscribeSchema.safeParse(body);
    
    if (!result.success) {
      addBreadcrumb('Validation failed', { issues: result.error.issues.length });
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const { email, fax, token } = result.data;

    // 3. 🛡️ HONEYPOT CHECK (Spam prevention)
    if (fax) {
      // Return success but don't actually subscribe (fool bots)
      return NextResponse.json({ success: true });
    }

    // 4. ✅ SANITIZE EMAIL INPUT (already normalized by Zod)
    const sanitizedEmail = email.replace(/[<>\"']/g, '');
    
    // Verify sanitization didn't break email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Email format invalid after processing' },
        { status: 400 }
      );
    }

    // 5. Turnstile verification (bot protection)
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: JSON.stringify({
        secret: getEnv('TURNSTILE_SECRET_KEY'),
        response: token,
        remoteip: ip,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!verifyRes.ok) {
      console.error('❌ Turnstile verification failed');
      addBreadcrumb('Turnstile verification failed', { status: verifyRes.status });
      return NextResponse.json(
        { error: 'Security check failed. Please refresh and try again.' },
        { status: 400 }
      );
    }

    const verifyData = await verifyRes.json();
    
    if (!verifyData.success) {
      console.warn(`⚠️ Turnstile verification rejected from IP: ${ip}`);
      addBreadcrumb('Turnstile verification rejected', { ip, errorCodes: verifyData['error-codes'] });
      return NextResponse.json(
        { error: 'Security check failed. Please refresh and try again.' },
        { status: 400 }
      );
    }

    // 6. 📧 GENERATE SECURE LINK (with signing)
    const secureToken = await new SignJWT({ 
      email: sanitizedEmail,
      iat: Date.now(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(SECRET);

    const confirmUrl = `${getEnv('NEXT_PUBLIC_BASE_URL')}/newsletter/confirm?token=${secureToken}`;

    // 7. 📧 SEND EMAIL (with error handling)
    const resend = new Resend(getEnv('RESEND_API_KEY'));
    
    try {
      addBreadcrumb('Sending confirmation email', { email: sanitizedEmail });
      await resend.emails.send({
        from: 'Top Ten UAE <newsletter@toptenuae.com>',
        to: [sanitizedEmail],
        subject: 'Action Required: Confirm your subscription 🇦🇪',
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4b0082;">Please verify your email</h2>
            <p>You're almost there! Click the button below to confirm your subscription to Top Ten UAE.</p>
            <div style="text-align: center; margin: 30px 0;">
               <a href="${confirmUrl}" style="background: #4b0082; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 16px;">Confirm Subscription</a>
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
      addBreadcrumb('Email sent successfully', { email: sanitizedEmail });
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      captureException(emailError, { 
        context: 'email_sending',
        email: sanitizedEmail,
      });
      return NextResponse.json(
        { error: 'Failed to send confirmation email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Check your email to confirm your subscription!'
    });

  } catch (error) {
    console.error('🔥 Newsletter subscription error:', error);
    
    // Capture in Sentry
    captureException(error, {
      context: 'newsletter_subscription',
    });
    
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}