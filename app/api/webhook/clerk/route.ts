import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createOrUpdateUser } from '@/lib/user-service';

// Define a type that can be either a Promise or direct Headers
type HeadersOrPromise = 
  | { get(name: string): string | null } 
  | Promise<{ get(name: string): string | null }>;

// Helper function for compatibility with different Next.js versions
async function getHeader(name: string): Promise<string | null> {
  try {
    // In Next.js 14+, headers() returns a Promise
    const headersList = headers() as HeadersOrPromise;
    if (headersList instanceof Promise) {
      const resolvedHeaders = await headersList;
      return resolvedHeaders.get(name);
    } else {
      // In older Next.js versions, headers() returns Headers directly
      return headersList.get(name);
    }
  } catch (e) {
    console.error(`Error getting header ${name}:`, e);
    return null;
  }
}

export async function POST(req: Request) {
  // Get the headers
  const svix_id = await getHeader('svix-id');
  const svix_timestamp = await getHeader('svix-timestamp');
  const svix_signature = await getHeader('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers');
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('Missing CLERK_WEBHOOK_SECRET environment variable');
    return new Response('Error occurred -- missing webhook secret', {
      status: 500,
    });
  }
  
  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret);
  
  let evt: WebhookEvent;
  
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  
  try {
    console.log(`Received webhook event: ${eventType}`);
    
    if (
      eventType === 'user.created' ||
      eventType === 'user.updated'
    ) {
      const { id, email_addresses, username, first_name, last_name } = evt.data;
      
      // Create or update user in our database
      await createOrUpdateUser({
        clerkId: id as string,
        email: email_addresses?.[0]?.email_address as string,
        username: username as string,
        firstName: first_name as string,
        lastName: last_name as string,
      });
      
      console.log('User created/updated in MongoDB:', {
        clerkId: id,
        email: email_addresses?.[0]?.email_address
      });
      
      return NextResponse.json({ 
        success: true,
        message: `User ${eventType === 'user.created' ? 'created' : 'updated'} successfully`,
        userId: id 
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Webhook received for ${eventType}, but no action needed`
    });
    
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response('Error occurred', {
      status: 500,
    });
  }
} 