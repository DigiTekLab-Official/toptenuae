// src/app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SignJWT } from 'jose';

// Configuration for Edge
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { email, fax, token } = await request.json();

    // 1. 🛡️ HONEYPOT CHECK
    // If hidden 'fax' field is filled, it's a bot. Return fake success.
    if (fax) return NextResponse.json({ success: true });

    // 2. 🤖 TURNSTILE VERIFICATION
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const verifyData = await verifyRes.json();
    
    if (!verifyData.success) {
      return NextResponse.json({ error: 'Security check failed. Please refresh.' }, { status: 400 });
    }

    // 3. 📧 GENERATE SECURE LINK (Stateless Double Opt-In)
    // We sign the email into a token valid for 1 hour.
    const secureToken = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(SECRET);

    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/confirm?token=${secureToken}`;

    // 4. SEND "ACTION REQUIRED" EMAIL
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'Top Ten UAE <info@toptenuae.com>',
      to: [email],
      subject: 'Action Required: Confirm your subscription 🇦🇪',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4b0082;">Please verify your email</h2>
          <p>You're almost there! Click the button below to confirm your subscription to Top Ten UAE.</p>
          <div style="text-align: center; margin: 30px 0;">
             <a href="${confirmUrl}" style="background: #4b0082; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 16px;">Confirm Subscription</a>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Newsletter Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}