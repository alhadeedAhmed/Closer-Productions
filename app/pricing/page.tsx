"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import SocialIcons from '../components/SocialIcons';
import { ProPlanIcon } from '../components/PlanIcons';

type PlanType = 'pro' | 'business';

type CheckoutStatus = {
  success?: boolean;
  canceled?: boolean;
  plan?: string;
  billing?: string;
};

// Component that uses searchParams and needs to be wrapped in Suspense
function PricingWithSearchParams({
  setBillingPeriod,
  setCheckoutStatus,
  handlePurchase,
  isLoaded,
  isSignedIn
}: {
  setBillingPeriod: (period: 'monthly' | 'yearly') => void,
  setCheckoutStatus: (status: CheckoutStatus) => void,
  handlePurchase: (plan: PlanType) => void,
  isLoaded: boolean,
  isSignedIn: boolean
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success') === 'true';
    const canceled = searchParams.get('canceled') === 'true';
    const plan = searchParams.get('plan') || undefined;
    const billing = searchParams.get('billing') || undefined;

    if (success || canceled) {
      setCheckoutStatus({ 
        success: success || undefined,
        canceled: canceled || undefined,
        plan, 
        billing 
      });
      
      if (window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  }, [searchParams, setCheckoutStatus]);
  
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const plan = searchParams.get('plan') as PlanType | null;
      const billing = searchParams.get('billing') as 'monthly' | 'yearly' | null;
      const redirectToCheckout = searchParams.get('redirectToCheckout') === 'true';
      
      if (plan && (plan === 'pro' || plan === 'business')) {
        if (billing && (billing === 'monthly' || billing === 'yearly')) {
          setBillingPeriod(billing);
        }
        
        if (window.history && window.history.replaceState) {
          const url = new URL(window.location.href);
          url.search = '';
          window.history.replaceState({}, document.title, url.toString());
        }
        
        if (redirectToCheckout) {
          handlePurchase(plan);
        }
      }
    }
  }, [isLoaded, isSignedIn, searchParams, handlePurchase, setBillingPeriod]);

  return null;
}

function PricingContent() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isMobile, setIsMobile] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isLoaded, isSignedIn = false } = useUser();
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>({});
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    hasActiveSubscription: boolean;
    currentPlan: string | null;
    billingPeriod: string | null;
    message: string | null;
  }>({
    hasActiveSubscription: false,
    currentPlan: null,
    billingPeriod: null,
    message: null
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePurchase = useCallback(async (plan: PlanType) => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      router.push(`/sign-up?plan=${plan}&billing=${plan === 'business' ? 'yearly' : billingPeriod}&returnTo=/pricing&redirectToCheckout=true`);
      return;
    }

    if (subscriptionStatus.hasActiveSubscription) {
      // If they're trying to subscribe to a different plan than their current one, prevent it
      if (subscriptionStatus.currentPlan?.toLowerCase() !== plan.toLowerCase()) {
        setError("You can only manage your current subscription. Please cancel your existing subscription first if you want to switch plans.");
        return;
      }
      
      setProcessingPlan(plan);
      setError(null);
      
      try {
        console.log(`User is managing their existing ${plan} subscription`);
        
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: subscriptionStatus.currentPlan?.toLowerCase() || 'pro',
            billingPeriod: subscriptionStatus.billingPeriod || 'monthly',
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || data.details || 'Something went wrong');
        }
        
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL returned');
        }
      } catch (err) {
        console.error('Error redirecting to billing portal:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setProcessingPlan(null);
      }
      return;
    }

    setProcessingPlan(plan);
    setError(null);
    
    try {
      console.log('Initiating purchase for plan:', plan, 'with billing period:', billingPeriod);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan,
          billingPeriod: plan === 'business' ? 'yearly' : billingPeriod,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Something went wrong');
      }
      
      if (data.isExistingSubscriber) {
        console.log('User is being redirected to manage existing subscription');
        setSubscriptionStatus(prev => ({
          ...prev,
          hasActiveSubscription: true,
          currentPlan: data.currentPlan || prev.currentPlan,
          message: data.message || 'You already have an active subscription.'
        }));
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setProcessingPlan(null);
    }
  }, [isLoaded, isSignedIn, billingPeriod, subscriptionStatus, router, setProcessingPlan, setError, setSubscriptionStatus]);

  const checkSubscriptionStatus = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus({
          hasActiveSubscription: data.hasActiveSubscription,
          currentPlan: data.currentPlan,
          billingPeriod: data.billingPeriod,
          message: data.hasActiveSubscription 
            ? `You currently have an active ${data.currentPlan} subscription.` 
            : null
        });
        
        console.log('User subscription status:', data);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  }, [isLoaded, isSignedIn, setSubscriptionStatus]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      checkSubscriptionStatus();
    }
  }, [isLoaded, isSignedIn, checkSubscriptionStatus]);

  const isProButtonDisabled = processingPlan !== null || (subscriptionStatus.hasActiveSubscription && subscriptionStatus.currentPlan?.toLowerCase() !== 'pro');
  // const isBusinessButtonDisabled = processingPlan !== null || (subscriptionStatus.hasActiveSubscription && subscriptionStatus.currentPlan?.toLowerCase() !== 'business');

  const proButtonText = processingPlan === 'pro' 
    ? 'Processing...' 
    : subscriptionStatus.hasActiveSubscription && subscriptionStatus.currentPlan?.toLowerCase() === 'pro'
      ? 'Manage Subscription' 
      : 'Get Started';

  // const businessButtonText = processingPlan === 'business' 
  //   ? 'Processing...' 
  //   : subscriptionStatus.hasActiveSubscription && subscriptionStatus.currentPlan?.toLowerCase() === 'business'
  //     ? 'Manage Subscription' 
  //     : 'Get Started';

  return (
    <div className="bg-[#FEFAF7] dark:bg-gray-900 max-w-8xl mx-auto px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Wrap the component using searchParams in Suspense boundary */}
      <Suspense fallback={null}>
        <PricingWithSearchParams
          setBillingPeriod={setBillingPeriod}
          setCheckoutStatus={setCheckoutStatus}
          handlePurchase={handlePurchase}
          isLoaded={isLoaded}
          isSignedIn={isSignedIn}
        />
      </Suspense>
      
      {/* Success message */}
      {checkoutStatus?.success ? (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-green-100 text-green-700 p-4 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>Payment successful! Thank you for your purchase.</p>
          </div>
        </div>
      ) : null}

      {checkoutStatus?.canceled ? (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Payment process was canceled. You have not been charged.</p>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      ) : null}

      {subscriptionStatus.hasActiveSubscription && subscriptionStatus.message ? (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-blue-100 text-blue-700 p-4 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{subscriptionStatus.message}</p>
          </div>
        </div>
      ) : null}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Find Your Perfect Plan</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Premium options allowing you unlimited searches on any device
        </p>
      </div>
{/* 
      {isMobile && (
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md p-1 bg-gray-200 dark:bg-gray-800">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                billingPeriod === 'yearly'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      )} */}

      <div className={`flex ${isMobile ? (billingPeriod === 'yearly' ? 'flex-col-reverse' : 'flex-col') : 'md:flex-row'} gap-4 justify-center items-center max-w-4xl mx-auto`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden w-full md:w-96 transition-colors duration-300">
          <div className="p-6 pb-0">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                <ProPlanIcon />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pro</h2>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Unleash the Power of search with Pro Plan.
            </p>
            <div className="mt-5 mb-8">
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">$5</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2 text-base">per month</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            
            <ul className="space-y-4 mb-6">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 dark:text-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 dark:text-gray-300 text-base">Unlimited searches</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 dark:text-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 dark:text-gray-300 text-base">Enhanced Analytics</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 dark:text-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 dark:text-gray-300 text-base">fast search</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 dark:text-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 dark:text-gray-300 text-base">Priority Support</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 dark:text-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 dark:text-gray-300 text-base">Advanced Security</span>
              </li>
            </ul>
          </div>
          <div className="px-6 pb-6">
            <button 
              onClick={() => handlePurchase('pro')}
              disabled={isProButtonDisabled}
              className={`w-full py-3 px-4 rounded-md shadow-sm text-center font-medium ${
                processingPlan === 'pro' 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : subscriptionStatus.hasActiveSubscription && subscriptionStatus.currentPlan?.toLowerCase() === 'pro'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-50'
                    : subscriptionStatus.hasActiveSubscription
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              } transition-colors duration-200`}
            >
              {proButtonText}
            </button>
          </div>
        </div>

        {/* <div className="bg-blue-100/80 dark:bg-[#1E2A47] rounded-xl shadow-md overflow-hidden w-full md:w-96 transition-colors duration-300">
          <div className="p-6 pb-0">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-white dark:bg-[#22303C] rounded-xl flex items-center justify-center shadow-sm">
                <BusinessPlanIcon />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business</h2>
                <div className="mt-1">
                  <span className="bg-white dark:bg-[#0F62FE] text-blue-600 dark:text-white text-xs font-medium px-3 py-1 rounded-full">
                    Best offer
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Unleash the Power of search with Business Plan.
            </p>
            <div className="mt-5 mb-8">
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">$56</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2 text-base">per year</span>
              </div>
            </div>

            <div className="border-t border-blue-200/40 dark:border-gray-600/40 my-4"></div>
            
            <ul className="space-y-4 mb-6">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 dark:text-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 dark:text-gray-300 text-base">Unlimited searches</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 dark:text-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 dark:text-gray-300 text-base">fast results</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 dark:text-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 dark:text-gray-300 text-base">Multi-user Access</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 dark:text-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 dark:text-gray-300 text-base">Third-party Integrations</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 dark:text-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 dark:text-gray-300 text-base">24/7 Priority Support</span>
              </li>
            </ul>
          </div>
          <div className="px-6 pb-6">
            <button
              onClick={() => handlePurchase('business')}
              disabled={isBusinessButtonDisabled}
              className={`w-full py-3 px-4 rounded-md shadow-sm text-center font-medium ${
                processingPlan === 'business' 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : subscriptionStatus.hasActiveSubscription && subscriptionStatus.currentPlan?.toLowerCase() === 'business'
                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                    : subscriptionStatus.hasActiveSubscription
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'text-white bg-gray-900 hover:bg-gray-800 dark:bg-[#1A2435] dark:hover:bg-[#0F1824]'
              } transition-colors duration-200`}
            >
              {businessButtonText}
            </button>
          </div>
        </div> */}
      </div> 

      <div className="mt-16">
        <SocialIcons className="fixed bottom-6 left-0 right-0 flex justify-center space-x-4 z-50" />
      </div>
    </div>
  );
}

export default function PricingPage() {
  return <PricingContent />;
} 