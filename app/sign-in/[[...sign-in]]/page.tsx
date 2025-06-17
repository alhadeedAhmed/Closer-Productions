'use client';

import {SignUp} from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const billing = searchParams.get('billing');
  const returnTo = searchParams.get('returnTo');
  const redirectToCheckout = searchParams.get('redirectToCheckout') === 'true';
  
  // Construct the redirect URL based on parameters
  let redirectUrl = '/home'; // Default redirect to home
  
  // If we have pricing plan parameters, redirect to pricing with checkout flag
  if (plan && (plan === 'pro' || plan === 'business')) {
    redirectUrl = `/pricing?plan=${plan}&billing=${billing || 'monthly'}`;
    
    // Add redirectToCheckout flag if it was requested
    if (redirectToCheckout) {
      redirectUrl += '&redirectToCheckout=true';
    }
  }
  
  // If we have an explicit returnTo parameter, use that
  if (returnTo) {
    redirectUrl = returnTo;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start md:justify-center p-4 pt-0 md:pt-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mt-4 md:mt-0">
        <SignUp routing="path" path="/sign-up" afterSignUpUrl={redirectUrl} />
      </div>
    </main>
  );
} 
