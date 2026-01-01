// src/app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// ✅ Configuration for Cloudflare Pages & Next.js 16
export const dynamic = 'force-dynamic'; // Prevents pre-rendering at build time
export const runtime = 'edge';         // Enables high-performance Edge execution

export async function POST(request: Request) {
  try {
    // 1. Validate Environment Variable at Runtime
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Critical: RESEND_API_KEY is not defined in Cloudflare dashboard.");
      return NextResponse.json({ error: 'Mail service configuration missing' }, { status: 500 });
    }

    const { email, firstName = '', lastName = '' } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 2. Initialize Resend safely inside the request handler
    const resend = new Resend(apiKey);

    // 3. Create or Update Contact in Resend
    // Note: Using audienceId is best practice for GovtJobsNet.com style optimization
    const contactPayload: any = {
      email: email.trim().toLowerCase(),
      firstName: firstName || 'Subscriber',
      lastName: lastName || '',
      unsubscribed: false,
    };

    if (process.env.RESEND_AUDIENCE_ID) {
      contactPayload.audienceId = process.env.RESEND_AUDIENCE_ID;
    }

    const contactResponse = await resend.contacts.create(contactPayload);

    // If contact exists, Resend might return an error, but we still want to send the email
    if (contactResponse.error) {
      console.warn('Resend Contact Note:', contactResponse.error.message);
    }

    // 4. Send Welcome Email
    const emailResponse = await resend.emails.send({
      from: 'Top Ten UAE <info@toptenuae.com>', 
      to: [email],
      subject: 'Welcome to Top Ten UAE! 🇦🇪',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #4b0082;">You're in! 🎉</h1>
          <p>Thanks for subscribing to <strong>Top Ten UAE</strong>.</p>
          <p>You'll now get the best UAE deals, government tool updates, and tech news straight to your inbox.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">TopTenUAE.com - Your Digital Guide to the UAE</p>
          <p style="font-size: 10px; color: #999;">Dubai, United Arab Emirates</p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend Email Error:', emailResponse.error);
      return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}