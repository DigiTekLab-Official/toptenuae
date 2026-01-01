// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName = '', lastName = '' } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 1. Create or update the contact in Resend
    const contactResponse = await resend.contacts.create({
      email,
      firstName: firstName || 'Subscriber',
      lastName: lastName || '',
      unsubscribed: false,
    });
    console.log('Contact Response:', contactResponse);

    if (contactResponse.error) {
      console.error('Resend Contact Error:', contactResponse.error);
      return NextResponse.json(
        { error: 'Failed to create contact' },
        { status: 500 }
      );
    }

    // 2. Send the email (Confirmation)
    // IMPORTANT: 'from' must be a domain you verified in Resend (e.g., newsletter@toptenuae.com)
    // If you haven't verified a domain yet, use 'onboarding@resend.dev' for testing.
    const emailResponse = await resend.emails.send({
      from: 'Top Ten UAE <info@toptenuae.com>', 
      to: [email],
      subject: 'Welcome to Top Ten UAE! 🇦🇪',
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h1>You're in! 🎉</h1>
          <p>Thanks for subscribing to Top Ten UAE.</p>
          <p>You'll now get the best deals and tech news straight to your inbox.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      contact: contactResponse.data,
      email: emailResponse.data,
    });
  } catch (error) {
    console.error('Newsletter Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}