// app/api/searches/reset/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { resetSearchCount } from '@/lib/user-service';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {  
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected successfully");
    
    const body = await req.json();
    console.log("Request body:", body);
    
    const { clerkId } = body;

    if (!clerkId) {
      console.error("Missing clerkId in request");
      return NextResponse.json({ error: 'Missing clerkId' }, { status: 400 });
    }

    console.log(`Attempting to reset search count for clerkId: ${clerkId}`);
    const updatedUser = await resetSearchCount(clerkId);

    if (!updatedUser) {
      console.error(`User not found for clerkId: ${clerkId}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log("Search count reset successful:", {
      clerkId: updatedUser.clerkId,
      searchCount: updatedUser.searchCount,
      searchLimit: updatedUser.searchLimit
    });

    return NextResponse.json({
      message: 'Search count reset successfully',
      user: {
        clerkId: updatedUser.clerkId,
        searchCount: updatedUser.searchCount,
        searchLimit: updatedUser.searchLimit,
        canSearch: updatedUser.searchCount < updatedUser.searchLimit
      },
    });
  } catch (error) {
    console.error('Error in resetSearchCount handler:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}