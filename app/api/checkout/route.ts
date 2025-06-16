import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId, updateUserSubscription } from '@/lib/user-service';
import UserModel from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const PRICE_IDS: Record<string, Record<string, string>> = {
  pro: {
    monthly: 'price_1RLgv2RmrNO3ykSUmpNY1gNN',
    yearly: 'price_1RLk1YRmrNO3ykSUY9RTMctD',
    // monthly: 'price_1RTfQYKcWZlkDKM67IauIBcE',
    // yearly: 'price_1RTfRjKcWZlkDKM6A0Hd62wm' 
  },
  business: {
    monthly: 'price_1RLgv2RmrNO3ykSUmpNY1gNN',
    yearly: 'price_1RLk1YRmrNO3ykSUY9RTMctD', 
    // monthly: 'price_1RTfQYKcWZlkDKM67IauIBcE',
    // yearly: 'price_1RTfRjKcWZlkDKM6A0Hd62wm' 
  }
};

const successUrl = process.env.NODE_ENV === 'production' 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true` 
  : 'http://localhost:3000/pricing?success=true';

const cancelUrl = process.env.NODE_ENV === 'production'
  ? `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`
  : 'http://localhost:3000/pricing?canceled=true';

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Handles subscription checkout or management:
 * - If user has an active subscription, redirect to billing portal
 * - If user has no subscription, create a checkout session
 * - Creates Stripe customer if needed
 */
export async function POST(req: Request) {
  try {
    const authSession = await auth();
    const userId = authSession.userId;
    
    if (!userId) {
      console.error('No authenticated user found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get request data, with better error handling
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid request body: could not parse JSON' },
        { status: 400 }
      );
    }
    
    const { planId, billingPeriod, priceId } = requestData;
    
    // Validate required parameters
    const missingParams = [];
    if (!planId) missingParams.push('planId');
    if (!billingPeriod) missingParams.push('billingPeriod');
    
    if (missingParams.length > 0) {
      console.error(`Missing required parameters: ${missingParams.join(', ')}. Request data:`, requestData);
      return NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Get the price ID from our mapping if not provided
    let finalPriceId = priceId;
    if (!finalPriceId) {
      // Validate plan and billing period
      const planKey = planId as string;
      const billingKey = billingPeriod as string;
      
      if (!PRICE_IDS[planKey] || !PRICE_IDS[planKey][billingKey]) {
        console.error(`Invalid plan or billing period: ${planKey}, ${billingKey}`);
        return NextResponse.json(
          { error: `Invalid plan or billing period: ${planKey}, ${billingKey}` },
          { status: 400 }
        );
      }
      
      finalPriceId = PRICE_IDS[planKey][billingKey];
    }
    
    console.log('Checkout request received:', { 
      userId, 
      planId, 
      billingPeriod, 
      priceId: finalPriceId 
    });
    
    // Get current user data to check if they're already subscribed
    const userData = await getUserByClerkId(userId);
    
    if (!userData) {
      console.error('User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if user already has an active subscription
    const hasActiveSubscription = (userData.subscriptionStatus === 'pro' || 
                                  userData.subscriptionStatus === 'business');
    
    let stripeCustomerId = userData.stripeCustomerId;
    
    console.log('User subscription data:', {
      userId,
      subscriptionStatus: userData.subscriptionStatus,
      hasActiveSubscription,
      stripeCustomerId: stripeCustomerId || 'None',
      requestedPlan: planId,
      email: userData.email
    });
    
    // IMPORTANT: If user already has an active subscription, ALWAYS redirect to billing portal 
    // regardless of the plan they're trying to purchase
    if (hasActiveSubscription && stripeCustomerId) {
      console.log(`User ${userId} already has an active ${userData.subscriptionStatus} subscription. Redirecting to billing portal.`);
      
      try {
        // Create a billing portal session for existing subscribers
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: stripeCustomerId,
          return_url: successUrl,
        });
        
        console.log('Billing portal session created:', portalSession.id);
        return NextResponse.json({ 
          url: portalSession.url,
          isExistingSubscriber: true,
          message: "You already have an active subscription. Redirecting to manage your subscription."
        });
      } catch (error) {
        console.error('Error creating customer portal session:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Stripe error details:', errorMessage);
        
        if (errorMessage.includes('No such customer')) {
          console.log('Customer ID not found in Stripe. Creating a new checkout session instead.');
          // Continue with checkout as a fallback
        } else {
          // Return error to client
          return NextResponse.json(
            { error: 'Error accessing subscription management', details: errorMessage },
            { status: 500 }
          );
        }
      }
    } else if (stripeCustomerId) {
      console.log(`User has Stripe customer ID but no active subscription. Using existing customer ID: ${stripeCustomerId}`);
    } else {
      console.log(`New subscription for user ${userId}. No existing Stripe customer ID.`);
    }
    
    // If user email exists but no Stripe customer ID, try to create one first
    if (!stripeCustomerId && userData.email) {
      try {
        console.log(`Creating Stripe customer for user ${userId} with email ${userData.email}`);
        
        const customer = await stripe.customers.create({
          email: userData.email,
          name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}` 
            : userData.email,
          metadata: {
            clerkId: userId,
            source: 'ThingsDifferenceApp'
          }
        });
        
        console.log(`Created Stripe customer: ${customer.id} for user: ${userId}`);
        
        // Store the customer ID in the database
        await dbConnect();
        const updatedUser = await UserModel.findOneAndUpdate(
          { clerkId: userId },
          { 
            $set: { 
              stripeCustomerId: customer.id,
              updatedAt: new Date()
            }
          },
          { new: true }
        );
        
        if (updatedUser && updatedUser.stripeCustomerId) {
          console.log(`Successfully stored Stripe customer ID ${customer.id} for user ${userId}`);
          stripeCustomerId = customer.id;
        } else {
          console.error(`Failed to store Stripe customer ID in database for user ${userId}`);
        }
      } catch (error) {
        console.error('Error creating Stripe customer:', error);
        // Continue with checkout even if customer creation fails
      }
    }
    
    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${successUrl}&plan=${planId}&billing=${billingPeriod}`,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
        planId: planId,
        billingPeriod: billingPeriod
      }
    };
    
    // Add customer if they have a Stripe ID already
    if (stripeCustomerId) {
      console.log(`Using existing Stripe customer ID: ${stripeCustomerId}`);
      checkoutParams.customer = stripeCustomerId;
    } else {
      // Otherwise use email and create a customer
      const userEmail = userData.email;
      if (userEmail) {
        console.log(`No Stripe customer ID found. Using email: ${userEmail} for checkout`);
        checkoutParams.customer_email = userEmail;
      }
    }
    
    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams);
    
    // If the user didn't have a stripeCustomerId but we got a customer from the session,
    // store it now so we have it for future reference
    if (!stripeCustomerId && checkoutSession.customer) {
      const newCustomerId = typeof checkoutSession.customer === 'string' 
        ? checkoutSession.customer 
        : checkoutSession.customer.toString();
      
      console.log(`New Stripe customer created during checkout: ${newCustomerId}. Updating user record.`);
      
      try {
        // Connect to the database
        await dbConnect();
        
        // Update the user record with the new Stripe customer ID
        await UserModel.findOneAndUpdate(
          { clerkId: userId },
          { 
            $set: { 
              stripeCustomerId: newCustomerId,
              updatedAt: new Date()
            }
          }
        );
        console.log(`User ${userId} updated with new Stripe customer ID: ${newCustomerId}`);
      } catch (error) {
        console.error('Error updating user with new Stripe customer ID:', error);
      }
    }
    
    console.log('Checkout session created:', checkoutSession.id);
    
    const response = NextResponse.json({ 
      url: checkoutSession.url,
      isExistingSubscriber: false
    });
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[STRIPE_ERROR]', error);
    console.error('Error details:', errorMessage);
    
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if a user has an active subscription.
 * This can be used by the frontend to disable subscription buttons for active subscribers.
 */
export async function GET() {
  try {
    const authSession = await auth();
    const userId = authSession.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userData = await getUserByClerkId(userId);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const hasActiveSubscription = (userData.subscriptionStatus === 'pro' || 
                                  userData.subscriptionStatus === 'business');
                                  
    return NextResponse.json({
      hasActiveSubscription,
      currentPlan: userData.subscriptionStatus,
      billingPeriod: userData.subscriptionPeriod || null,
      stripeCustomerId: userData.stripeCustomerId || null
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error checking subscription status:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}

/**
 * PATCH endpoint to handle stripe checkout with Clerk user info
 * - Redirects to billing portal for users with active subscriptions
 * - Creates a checkout session for new subscribers
 * - Updates subscription status immediately in the database
 */
export async function PATCH(req: Request) {
  try {
    const { currentUser } = await import('@clerk/nextjs/server');
    
    const clerkUser = await currentUser();
    const user = clerkUser
      ? {
          id: clerkUser.id,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          email: clerkUser.emailAddresses[0].emailAddress,
          imageUrl: clerkUser.imageUrl,
          hasImage: clerkUser.hasImage,
        }
      : null;
      
    if (!user?.id || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid request body: could not parse JSON' },
        { status: 400 }
      );
    }
    
    const { price } = requestData;
    
    if (!price) {
      return new NextResponse("Bad Request: Missing price", {
        status: 400,
      });
    }
    
    console.log('Checkout request received via PATCH:', { 
      userId: user.id,
      price
    });
    
    // Use the existing user service
    const userData = await getUserByClerkId(user.id);
    
    if (!userData) {
      console.error('User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const hasActiveSubscription = (userData.subscriptionStatus === 'pro' || 
                                  userData.subscriptionStatus === 'business');
    
    if (hasActiveSubscription && userData.stripeCustomerId) {
      console.log(`User ${user.id} has an active subscription. Redirecting to billing portal.`);
      
      try {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: userData.stripeCustomerId,
          return_url: successUrl,
        });
        
        console.log('Billing portal session created:', stripeSession.id);
        
        // Get price details from Stripe to accurately detect billing period change
        try {
          const priceDetails = await stripe.prices.retrieve(price);
          if (priceDetails && priceDetails.recurring) {
            const newBillingPeriod = priceDetails.recurring.interval === 'year' ? 'yearly' : 'monthly';
            console.log(`User is changing billing period to: ${newBillingPeriod}`);
            
            // Immediately update the subscription period in the database
            await dbConnect();
            await UserModel.findOneAndUpdate(
              { clerkId: user.id },
              { 
                $set: { 
                  subscriptionPeriod: newBillingPeriod,
                  updatedAt: new Date()
                }
              }
            );
            
            console.log(`Updated subscription period for user ${user.id} to ${newBillingPeriod}`);
          }
        } catch (priceError) {
          console.error('Error retrieving price details from Stripe:', priceError);
          // Continue even if price retrieval fails
        }
        
        const response = NextResponse.json({ url: stripeSession.url });
        
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
        
        return response;
      } catch (error) {
        console.error('Error creating customer portal session:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Stripe error details:', errorMessage);
        
        return NextResponse.json(
          { error: 'Error accessing subscription management', details: errorMessage },
          { status: 500 }
        );
      }
    } else if (userData.stripeCustomerId) {
      console.log(`User has Stripe customer ID but no active subscription. Using existing customer ID: ${userData.stripeCustomerId}`);
      
      // Determine plan and billing period from price ID
      let planId: 'pro' | 'business' = 'pro';
      let billingPeriod: 'monthly' | 'yearly' = 'monthly';
      
      // Get accurate billing period and plan directly from Stripe
      try {
        const priceDetails = await stripe.prices.retrieve(price);
        console.log('Retrieved price details from Stripe:', {
          id: priceDetails.id,
          nickname: priceDetails.nickname,
          productId: priceDetails.product,
          interval: priceDetails.recurring?.interval
        });
        
        // Determine billing period from Stripe price details
        if (priceDetails.recurring) {
          billingPeriod = priceDetails.recurring.interval === 'year' ? 'yearly' : 'monthly';
        }
        
        // Determine plan type from product data if available
        if (typeof priceDetails.product === 'string') {
          const productDetails = await stripe.products.retrieve(priceDetails.product);
          console.log('Retrieved product details:', {
            id: productDetails.id,
            name: productDetails.name
          });
          
          // Set plan based on product name
          if (productDetails.name.toLowerCase().includes('business')) {
            planId = 'business';
          } else {
            planId = 'pro';
          }
        }
      } catch (priceError) {
        console.error('Error retrieving price details from Stripe:', priceError);
        
        // Fallback to simple detection
        if (price.toLowerCase().includes('business')) {
          planId = 'business';
        }
        
        if (price.toLowerCase().includes('year')) {
          billingPeriod = 'yearly';
        }
      }
      
      console.log(`Determined plan: ${planId}, billing period: ${billingPeriod} for price: ${price}`);
      
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: successUrl,
        cancel_url: cancelUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer: userData.stripeCustomerId,
        line_items: [
          {
            price: price,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          planId: planId,
          billingPeriod: billingPeriod
        },
      });
      
      console.log('Checkout session created:', stripeSession.id);
      
      // Immediately update the user's subscription status in the database
      try {
        await dbConnect();
        
        // Update user with subscription details immediately
        // This will be confirmed/updated by the webhook when payment is complete
        await UserModel.findOneAndUpdate(
          { clerkId: user.id },
          { 
            $set: { 
              subscriptionStatus: planId,
              subscriptionPeriod: billingPeriod,
              searchLimit: 1000, // Pro and business plans get 1000 searches
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`Immediately updated user ${user.id} subscription to ${planId} (${billingPeriod})`);
      } catch (dbError) {
        console.error('Error updating user subscription in database:', dbError);
        // Continue with checkout even if database update fails
        // The webhook will handle the update later
      }
      
      const response = NextResponse.json({ url: stripeSession.url });
      
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return response;
    } else {
      console.log(`New subscription for user ${user.id}. No existing Stripe customer ID.`);
      
      // Determine plan and billing period from price ID
      let planId: 'pro' | 'business' = 'pro';
      let billingPeriod: 'monthly' | 'yearly' = 'monthly';
      
      // Get accurate billing period and plan directly from Stripe
      try {
        const priceDetails = await stripe.prices.retrieve(price);
        console.log('Retrieved price details from Stripe:', {
          id: priceDetails.id,
          nickname: priceDetails.nickname,
          productId: priceDetails.product,
          interval: priceDetails.recurring?.interval
        });
        
        // Determine billing period from Stripe price details
        if (priceDetails.recurring) {
          billingPeriod = priceDetails.recurring.interval === 'year' ? 'yearly' : 'monthly';
        }
        
        // Determine plan type from product data if available
        if (typeof priceDetails.product === 'string') {
          const productDetails = await stripe.products.retrieve(priceDetails.product);
          console.log('Retrieved product details:', {
            id: productDetails.id,
            name: productDetails.name
          });
          
          // Set plan based on product name
          if (productDetails.name.toLowerCase().includes('business')) {
            planId = 'business';
          } else {
            planId = 'pro';
          }
        }
      } catch (priceError) {
        console.error('Error retrieving price details from Stripe:', priceError);
        
        // Fallback to simple detection
        if (price.toLowerCase().includes('business')) {
          planId = 'business';
        }
        
        if (price.toLowerCase().includes('year')) {
          billingPeriod = 'yearly';
        }
      }
      
      console.log(`Determined plan: ${planId}, billing period: ${billingPeriod} for price: ${price}`);
      
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: successUrl,
        cancel_url: cancelUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.email as string,
        line_items: [
          {
            price: price,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          planId: planId,
          billingPeriod: billingPeriod
        },
      });
      
      console.log('Checkout session created:', stripeSession.id);
      console.log('Using customer email:', user.email);
      
      // Immediately update the user's subscription status in the database
      try {
        await dbConnect();
        
        // Update user with subscription details immediately
        // This will be confirmed/updated by the webhook when payment is complete
        await UserModel.findOneAndUpdate(
          { clerkId: user.id },
          { 
            $set: { 
              subscriptionStatus: planId,
              subscriptionPeriod: billingPeriod,
              searchLimit: 1000, // Pro and business plans get 1000 searches
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`Immediately updated user ${user.id} subscription to ${planId} (${billingPeriod})`);
      } catch (dbError) {
        console.error('Error updating user subscription in database:', dbError);
        // Continue with checkout even if database update fails
        // The webhook will handle the update later
      }
      
      const response = NextResponse.json({ url: stripeSession.url });
      
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return response;
    }
  } catch (error) {
    console.error('[STRIPE_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
} 