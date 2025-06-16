import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { incrementSearchCount } from '@/lib/user-service';

// Increment search count for a user
export async function POST() {
  const session = await auth();
  const userId = session.userId;
  
  console.log("POST /api/searches/count received. Auth session:", { 
    sessionExists: !!session,
    userId: userId || 'none' 
  });
  
  if (!userId) {
    console.log("POST /api/searches/count - Unauthorized: No userId found in session");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("POST /api/searches/count - Calling incrementSearchCount with:", userId);
    const result = await incrementSearchCount(userId);
    
    console.log("POST /api/searches/count - Result:", result);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error incrementing search count:', error);
    return NextResponse.json(
      { error: 'Failed to update search count', success: false },
      { status: 500 }
    );
  }
} 