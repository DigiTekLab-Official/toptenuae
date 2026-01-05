import { jwtVerify } from 'jose';
import { Resend } from 'resend';
import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

// ✅ THESE LINES ARE CRITICAL FOR CLOUDFLARE
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export default async function ConfirmPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  let status: 'success' | 'error' = 'success';
  let message = "You have successfully confirmed your subscription.";

  if (!token) {
    status = 'error';
    message = "Invalid or missing verification link.";
  } else {
    try {
      // 1. Verify the Token
      const { payload } = await jwtVerify(token, SECRET);
      const email = payload.email as string;

      // 2. Add to Resend Audience (Real Subscribe)
      if (AUDIENCE_ID && process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.contacts.create({
          email: email,
          audienceId: AUDIENCE_ID,
          unsubscribed: false,
        });
      }
      
    } catch (error) {
      console.error(error);
      status = 'error';
      message = "This confirmation link has expired or is invalid. Please sign up again.";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-gray-100">
        
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscription Confirmed!</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Welcome to the <strong>Top Ten UAE</strong> community. You are now officially on the list!
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verification Failed</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
          </>
        )}

        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-[#4b0082] text-white font-bold py-3 px-8 rounded-full hover:bg-[#3b0066] transition-all shadow-lg shadow-purple-900/20"
        >
          Return to Homepage <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}