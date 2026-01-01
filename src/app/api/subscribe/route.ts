import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'edge'; // ✅ CRITICAL: Required for Cloudflare Pages

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName = '', lastName = '' } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 1. Create/Update Contact
    const contactResponse = await resend.contacts.create({
      email: email.trim().toLowerCase(), // ✅ Best practice: sanitize input
      firstName: firstName || 'Subscriber',
      lastName: lastName || '',
      audienceId: process.env.RESEND_AUDIENCE_ID as string, // ✅ Use Audience ID for better management
      unsubscribed: false,
    });

    if (contactResponse.error) {
      // If contact already exists, Resend returns an error. 
      // We should check if it's a "conflict" and proceed to send the email anyway.
      console.warn('Resend Contact Note:', contactResponse.error);
    }

    // 2. Send Welcome Email
    const emailResponse = await resend.emails.send({
      from: 'Top Ten UAE <info@toptenuae.com>', 
      to: [email],
      subject: 'Welcome to Top Ten UAE! 🇦🇪',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto;">
          <h1 style="color: #4b0082;">You're in! 🎉</h1>
          <p>Thanks for subscribing to <strong>Top Ten UAE</strong>.</p>
          <p>You'll now get the best UAE deals and tech news straight to your inbox.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">TopTenUAE.com - Dubai, United Arab Emirates</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}