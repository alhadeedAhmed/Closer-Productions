"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useUser, useAuth } from "@clerk/nextjs";

// Define types for the user data
interface UserData {
  searchCount: number;
  searchLimit: number;
  subscriptionStatus: "free" | "pro" | "business";
  canSearch: boolean;
  provider?: string; // Add provider field to track auth provider
  stripeCustomerId?: string; // Add Stripe customer ID field
}

// Define the context type
interface UserDataContextType {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
  incrementSearchCount: () => Promise<boolean>;
}

// Create the context with default values
const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  loading: true,
  error: null,
  refreshUserData: async () => {},
  incrementSearchCount: async () => false,
});

export function useUserData() {
  return useContext(UserDataContext);
}

interface UserDataProviderProps {
  children: ReactNode;
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track if we've tried local mode already
  const [usingLocalMode, setUsingLocalMode] = useState(false);
  // Flag to prevent concurrent API calls
  const [isFetching, setIsFetching] = useState(false);
  // Last fetch timestamp to prevent too frequent refreshes
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchUserData = useCallback(
    async (forceRefresh = false) => {
      // Prevent concurrent API calls
      if (isFetching) {
        console.log("Already fetching user data, skipping duplicate request");
        return;
      }

      // Only fetch if it's a forced refresh or we haven't fetched recently (within 5 minutes)
      const currentTime = Date.now();
      const timeSinceLastFetch = currentTime - lastFetchTime;
      const MIN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

      if (
        !forceRefresh &&
        lastFetchTime > 0 &&
        timeSinceLastFetch < MIN_REFRESH_INTERVAL
      ) {
        console.log(
          `Skipping fetch, last fetch was ${timeSinceLastFetch / 1000}s ago`
        );
        return;
      }

      console.log("fetchUserData called. Auth state:", {
        isLoaded,
        isSignedIn,
        userId: user?.id,
      });

      if (!isLoaded || !isSignedIn || !user?.id) {
        console.log("Auth conditions not met, exiting fetchUserData early");
        setLoading(false);
        return;
      }

      setIsFetching(true);

      try {
        console.log("Attempting to create/update user with Clerk ID:", user.id);

        // Detect authentication provider (Google, etc.)
        const providers = user.externalAccounts || [];
        const googleAccount = providers.find(
          (account) =>
            account.provider.toLowerCase() === "google" ||
            account.provider.toLowerCase() === "oauth_google"
        );

        const authProvider = googleAccount ? "google" : "clerk";
        console.log(`User authenticated via: ${authProvider}`);

        // Create default user data as fallback in case of database errors
        const defaultUserData = {
          searchCount: 0,
          searchLimit: 3,
          subscriptionStatus: "free" as const,
          canSearch: true,
          provider: authProvider,
        };

        // If we're already in local mode and not a forced refresh, don't try to hit the database again
        if (usingLocalMode && !forceRefresh) {
          console.log("Using local mode, skipping database operations");
          return;
        }

        // Preserve existing Stripe customer ID if we have it - this ensures we don't lose it
        // during network errors or database failures
        const existingStripeCustomerId = userData?.stripeCustomerId;
        if (existingStripeCustomerId) {
          console.log(
            `Preserving existing Stripe customer ID: ${existingStripeCustomerId}`
          );
        }

        // Create or update the user in the database
        // First, explicitly create the user if it doesn't exist or update if it does
        const createResponse = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include only basic user identity data, not subscription status
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            provider: authProvider, // Include the authentication provider
            imageUrl: user.imageUrl, // Include profile image if available
            // Include Stripe customer ID if we have it from previous data
            stripeCustomerId: existingStripeCustomerId,
          }),
        });

        console.log(
          "Create/update user response status:",
          createResponse.status
        );

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error("Failed to create/update user -", errorText);

          // Set default user data instead of throwing error, but preserve the Stripe ID if we have it
          console.log("Using default user data due to database error");
          setUserData({
            ...defaultUserData,
            stripeCustomerId: existingStripeCustomerId,
          });
          setError("Database connection error");
          setUsingLocalMode(true);
          setLoading(false);
          return;
        }

        // After ensuring the user exists, get user data
        console.log("Fetching user data from API");
        const response = await fetch("/api/users");

        console.log("GET user data response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch user data -", errorText);

          // Set default user data instead of throwing error, but preserve the Stripe ID if we have it
          console.log("Using default user data due to database error");
          setUserData({
            ...defaultUserData,
            stripeCustomerId: existingStripeCustomerId,
          });
          setError("Database connection error");
          setUsingLocalMode(true);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Received user data:", data);

        if (!data.user) {
          console.error("User data not found in response:", data);

          // Set default user data instead of throwing error, but preserve the Stripe ID if we have it
          console.log("Using default user data due to missing user data");
          setUserData({
            ...defaultUserData,
            stripeCustomerId: existingStripeCustomerId,
          });
          setError("User data not found");
          setUsingLocalMode(true);
          setLoading(false);
          return;
        }

        const newUserData = {
          searchCount: data.user.searchCount || 0,
          searchLimit: data.user.searchLimit || 3,
          subscriptionStatus: data.user.subscriptionStatus || "free",
          canSearch:
            (data.user.searchCount || 0) < (data.user.searchLimit || 3),
          provider: data.user.provider || authProvider,
          stripeCustomerId:
            data.user.stripeCustomerId || existingStripeCustomerId,
        };

        console.log("Setting user data in context:", {
          ...newUserData,
          stripeCustomerId: newUserData.stripeCustomerId || "None",
        });
        setUserData(newUserData);
        setUsingLocalMode(false);
        setError(null);
        setLastFetchTime(Date.now());
      } catch (err) {
        console.error("Error fetching user data:", err);

        // Preserve Stripe customer ID when setting default user data in case of errors
        const existingStripeCustomerId = userData?.stripeCustomerId;

        // Set default user data in case of errors
        setUserData({
          searchCount: 0,
          searchLimit: 3,
          subscriptionStatus: "free",
          canSearch: true,
          stripeCustomerId: existingStripeCustomerId,
        });

        setError("Error loading user data");
        setUsingLocalMode(true);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    },
    [
      isLoaded,
      isSignedIn,
      user?.id,
      userData?.stripeCustomerId,
      usingLocalMode,
      isFetching,
      lastFetchTime,
      user?.externalAccounts,
      user?.firstName,
      user?.imageUrl,
      user?.lastName,
      user?.primaryEmailAddress?.emailAddress,
      user?.username,
    ]
  );

  // Function to increment search count
  const incrementSearchCount = async (): Promise<boolean> => {
    console.log("incrementSearchCount called. Auth state:", {
      isLoaded,
      isSignedIn,
      userId: user?.id,
    });

    if (!isLoaded || !isSignedIn || !user?.id) {
      console.log("Auth conditions not met, cannot increment search count");
      return false;
    }

    // If there's no user data or database error, simulate successful increment
    if (error || !userData || usingLocalMode) {
      console.log("Using local increment due to database error or local mode");
      // Create a local update to the user data
      setUserData((prev) => {
        if (!prev)
          return {
            searchCount: 1,
            searchLimit: 3,
            subscriptionStatus: "free",
            canSearch: true,
          };
        const newCount = prev.searchCount + 1;
        // If user is free and reached limit, log out and reset count
        if (
          prev.subscriptionStatus === "free" &&
          newCount >= prev.searchLimit
        ) {
          setCookie("searches_reset", "true", 1);
          signOut();
          return {
            ...prev,
            searchCount: 0,
            canSearch: true,
          };
        }
        return {
          ...prev,
          searchCount: newCount,
          canSearch: newCount < prev.searchLimit,
        };
      });
      return true;
    }

    try {
      console.log("Sending search count increment request");
      const response = await fetch("/api/searches/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Search count response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error incrementing search count: ${errorText}`);

        // Fall back to local increment
        setUserData((prev) => {
          if (!prev)
            return {
              searchCount: 1,
              searchLimit: 3,
              subscriptionStatus: "free",
              canSearch: true,
            };

          const newCount = prev.searchCount + 1;
          return {
            ...prev,
            searchCount: newCount,
            canSearch: newCount < prev.searchLimit,
          };
        });
        setUsingLocalMode(true);
        return true;
      }

      const result = await response.json();
      console.log("Search count increment result:", result);

      // Update the counter locally instead of fetching all user data again
      setUserData((prev) => {
        if (!prev)
          return {
            searchCount: result.count,
            searchLimit: result.limit,
            subscriptionStatus: "free",
            canSearch: result.canSearch,
          };
        // If user is free and reached limit, log out and reset count
        if (
          prev.subscriptionStatus === "free" &&
          result.count >= prev.searchLimit
        ) {
          setCookie("searches_reset", "true", 1);
          // setTimeout(() => {
          //   signOut();
          // }, 4000);
          return {
            ...prev,
            searchCount: prev.searchLimit,
            canSearch: false,
          };
        }
        return {
          ...prev,
          searchCount: result.count,
          canSearch: result.canSearch,
        };
      });

      return result.success && result.canSearch;
    } catch (err) {
      console.error("Error incrementing search count:", err);

      // Fall back to local increment
      setUserData((prev) => {
        if (!prev)
          return {
            searchCount: 1,
            searchLimit: 3,
            subscriptionStatus: "free",
            canSearch: true,
          };

        const newCount = prev.searchCount + 1;
        return {
          ...prev,
          searchCount: newCount,
          canSearch: newCount < prev.searchLimit,
        };
      });
      setUsingLocalMode(true);
      return true;
    }
  };

  // Initial data fetch - only once when user authenticates
  useEffect(() => {
    console.log("UserDataProvider useEffect triggered. Auth state:", {
      isLoaded,
      isSignedIn,
      userId: user?.id,
    });

    if (isLoaded && isSignedIn && user?.id && !userData) {
      console.log(
        "Auth conditions met, calling fetchUserData for initial load"
      );
      fetchUserData(true); // Force the initial fetch
    } else if (isLoaded) {
      console.log("User not signed in, setting loading to false");
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user?.id, fetchUserData, userData]);

  // Less aggressive retry mechanism - attempt to reconnect to MongoDB every 5 minutes if in local mode
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (usingLocalMode && isLoaded && isSignedIn && user?.id) {
      console.log("Setting up retry interval for database connection");
      intervalId = setInterval(() => {
        console.log("Retrying database connection...");
        fetchUserData(true); // Force refresh on retry attempts
      }, 5 * 60 * 1000); // Retry every 5 minutes instead of 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [usingLocalMode, isLoaded, isSignedIn, user?.id, fetchUserData]);

  // On login, if searches_reset cookie is present and user is free and at the limit, reset searchCount to zero and clear the cookie
  // const hasReset = useRef(false);

  // useEffect(() => {
  //   const resetSearchesIfNeeded = async () => {
  //     if (hasReset.current) return;

  //     const shouldReset =
  //       isLoaded &&
  //       isSignedIn &&
  //       user?.id &&
  //       userData &&
  //       userData.subscriptionStatus === "free" &&
  //       userData.searchCount >= userData.searchLimit &&
  //       getCookie("searches_reset") === "true";

  //     if (shouldReset) {
  //       setResetting(true);
  //       hasReset.current = true;
  //       try {
  //         const response = await fetch("/api/searches/reset", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ clerkId: user.id }),
  //         });

  //         if (response.ok) {
  //           const result = await response.json();
  //           setUserData((prev) =>
  //             prev ? { ...prev, searchCount: 0, canSearch: true } : prev
  //           );
  //           deleteCookie("searches_reset");
  //         } else {
  //           console.error("[Reset] Failed:", await response.text());
  //         }
  //       } catch (error) {
  //         console.error("[Reset] Request error:", error);
  //       } finally {
  //         setResetting(false); 
  //       }
  //     }
  //   };

  //   if (userData !== null) {
  //     resetSearchesIfNeeded();
  //   }
  // }, [isLoaded, isSignedIn, user?.id, userData]);

  // // Effect to handle the initial check right after sign-in
  // useEffect(() => {
  //   // This runs specifically when user signs in and userData is first loaded
  //   if (isLoaded && isSignedIn && user?.id && userData && !loading) {
  //     console.log("=== INITIAL SIGN-IN CHECK ===");
  //     console.log("User just signed in, checking for reset cookie");

  //     const resetCookie = getCookie("searches_reset");
  //     console.log("Reset cookie value:", resetCookie);

  //     if (resetCookie === "true") {
  //       console.log("Reset cookie found! User needs search count reset");
  //       // Trigger the reset immediately
  //       setTimeout(() => {
  //         console.log("Triggering delayed reset check...");
  //         setUserData((prev: any) => ({ ...prev }));
  //       }, 100);
  //     }
  //   }
  // }, [isLoaded, isSignedIn, user?.id, userData, loading]);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        loading,
        error,
        refreshUserData: () => fetchUserData(true),
        incrementSearchCount,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

// Utility functions for cookies
function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=/";
}
// function getCookie(name: string) {
//   return document.cookie.split("; ").reduce((r, v) => {
//     const parts = v.split("=");
//     return parts[0] === name ? decodeURIComponent(parts[1]) : r;
//   }, "");
// }
// function deleteCookie(name: string) {
//   setCookie(name, "", -1);
// }
