import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createOrUpdateUser, getUserByClerkId } from '@/lib/user-service';

// Create or update user endpoint
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session.userId;
  
  console.log("POST /api/users received. Auth session:", { 
    sessionExists: !!session,
    userId: userId || 'none' 
  });
  
  if (!userId) {
    console.log("POST /api/users - Unauthorized: No userId found in session");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userData = await req.json();
    console.log("POST /api/users - Received user data:", { 
      ...userData,
      clerkId: userData.clerkId 
    });
    
    // Add the clerk ID to the user data
    console.log("POST /api/users - Calling createOrUpdateUser with clerkId:", userId);
    
    // Remove subscription-related fields to prevent overwriting existing data
    const sanitizedUserData = {
      ...userData,
      clerkId: userId
    };
    
    // Don't send these fields unless explicitly upgrading a subscription
    delete sanitizedUserData.subscriptionStatus;
    delete sanitizedUserData.subscriptionPeriod;
    delete sanitizedUserData.searchLimit;
    delete sanitizedUserData.searchCount;
    
    // IMPORTANT: For Stripe customer ID, we'll let the createOrUpdateUser function
    // handle this properly, as it already has logic to never overwrite existing IDs
    // but we should still allow a new Stripe ID to be set if explicitly provided.
    console.log("Stripe customer ID in request:", sanitizedUserData.stripeCustomerId || 'None');
    
    console.log("POST /api/users - Sending sanitized user data:", {
      ...sanitizedUserData,
      clerkId: sanitizedUserData.clerkId
    });
    
    const user = await createOrUpdateUser(sanitizedUserData);

    console.log("POST /api/users - User created/updated successfully:", { 
      clerkId: user.clerkId,
      searchCount: user.searchCount,
      searchLimit: user.searchLimit,
      stripeCustomerId: user.stripeCustomerId || 'None'
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: Error | unknown) {
    // Enhance error logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack || '' : '';
    console.error(`Error creating user: ${errorMessage}`);
    console.error(`Stack trace: ${errorStack}`);
    
    // Check for specific MongoDB connection errors
    if (errorMessage.includes('ECONNREFUSED') || 
        errorMessage.includes('timed out') || 
        errorMessage.includes('getaddrinfo') ||
        errorMessage.includes('MongoServerSelectionError')) {
      console.error('MongoDB connection error detected.');
      return NextResponse.json(
        { error: 'Database connection error', details: errorMessage },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create user', details: errorMessage },
      { status: 500 }
    );
  }
}

// Get user information
export async function GET() {
  const session = await auth();
  const userId = session.userId;
  
  console.log("GET /api/users received. Auth session:", { 
    sessionExists: !!session,
    userId: userId || 'none' 
  });
  
  if (!userId) {
    console.log("GET /api/users - Unauthorized: No userId found in session");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("GET /api/users - Calling getUserByClerkId with:", userId);
    const user = await getUserByClerkId(userId);
    
    if (!user) {
      console.log("GET /api/users - User not found for clerkId:", userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log("GET /api/users - Retrieved user data:", { 
      clerkId: user.clerkId,
      searchCount: user.searchCount,
      searchLimit: user.searchLimit,
      subscriptionStatus: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId || 'None'
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: Error | unknown) {
    // Enhance error logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack || '' : '';
    console.error(`Error getting user information: ${errorMessage}`);
    console.error(`Stack trace: ${errorStack}`);
    
    // Check for specific MongoDB connection errors
    if (errorMessage.includes('ECONNREFUSED') || 
        errorMessage.includes('timed out') || 
        errorMessage.includes('getaddrinfo') ||
        errorMessage.includes('MongoServerSelectionError')) {
      console.error('MongoDB connection error detected.');
      return NextResponse.json(
        { error: 'Database connection error', details: errorMessage },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get user information', details: errorMessage },
      { status: 500 }
    );
  }
} 