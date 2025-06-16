export interface User {
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  provider?: string; // Authentication provider (google, clerk, etc.)
  imageUrl?: string; // User's profile image from auth provider
  stripeCustomerId?: string; // Stripe customer ID for subscription management
  searchCount: number;
  searchLimit: number;
  subscriptionStatus: 'free' | 'pro' | 'business';
  subscriptionPeriod?: 'monthly' | 'yearly'; // Track billing period
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchStats {
  totalSearches: number;
  searchesByDay: Record<string, number>;
  searchItems: string[];
} 