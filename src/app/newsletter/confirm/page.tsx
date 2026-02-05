import { jwtVerify } from 'jose';
import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

// ✅ Keep these Edge settings
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const API_KEY = process.env.RESEND_API_KEY;

// ✅ Define the Props type correctly for Next.js 15/16
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ConfirmPage(props: Props) {
  // ⏳ FIX: Await searchParams with 5-second timeout to prevent hanging requests
  let searchParams: { [key: string]: string | string[] | undefined };
  
  try {
    searchParams = await Promise.race([
      props.searchParams,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout: 5 seconds')), 5000)
      ),
    ]);
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Timeout</h1>
          <p className="text-gray-600 mb-6">
            The verification process took too long. Please request a new confirmation link.
          </p>
          <Link 
            href="/newsletter"
            className="inline-flex items-center gap-2 text-[#4b0082] font-semibold hover:underline"
          >
            Subscribe Again <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const token = searchParams.token as string | undefined;

  let status: 'success' | 'error' = 'success';
  let message = "You have successfully confirmed your subscription.";

  if (!token) {
    status = 'error';
    message = "Invalid or missing verification link.";
  } else {
    try {
      // 1. Verify Token
      const { payload } = await jwtVerify(token, SECRET);
      const email = payload.email as string;

      // 2. Add to Audience (Using Fetch)
      if (AUDIENCE_ID && API_KEY) {
        await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            email: email,
            unsubscribed: false,
          })
        });
      }
      
    } catch (error) {
      console.error(error);
      status = 'error';
      message = "This confirmation link has expired.";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmed!</h1>
            <p className="text-gray-600 mb-8">You are now officially on the list.</p>
          </>
        ) : (
          <>
             <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-8">{message}</p>
          </>
        )}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-[#4b0082] text-white font-bold py-3 px-8 rounded-full hover:bg-[#3b0066] transition-all"
        >
           Return to Homepage <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}