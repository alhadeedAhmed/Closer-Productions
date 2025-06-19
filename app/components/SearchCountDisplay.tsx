"use client";

import { useUserData } from "@/lib/UserDataProvider";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function SearchCountDisplay() {
  const { isLoaded, isSignedIn } = useAuth();
  const { userData, loading, error } = useUserData();

  const [guestCount, setGuestCount] = useState(() =>
    parseInt(Cookies.get("freeSearchCount") || "0", 10)
  );
  const guestLimit = 3;
  const guestLimitReached = guestCount >= guestLimit;

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCount = Number(Cookies.get("freeSearchCount") || "0");
      setGuestCount(updatedCount);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center px-3 py-1 dark:bg-gray-800 rounded-md text-sm">
        <span className="mr-1 font-medium">Loading...</span>
      </div>
    );
  }

  // use guestCount with Sign Up link if limit reached
  if (!isSignedIn) {
    return (
      <div className="flex items-center px-3 py-1 dark:bg-gray-800 rounded-md text-sm whitespace-nowrap">
        <span
          className={`mr-1 font-semibold ${
            guestLimitReached ? "text-red-500 dark:text-red-400" : ""
          }`}
        >
          {`${guestCount} / ${guestLimit} free`}
        </span>
        {guestLimitReached && (
          <Link
            href="/sign-up"
            className="ml-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign Up
          </Link>
        )}
      </div>
    );
  }

  // Signed in → use userData
  if (error) {
    return (
      <div className="flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900 rounded-md text-sm whitespace-nowrap">
        <span className="mr-1 font-medium text-orange-600 dark:text-orange-300">
          Offline Mode
        </span>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-md text-sm">
        <span className="mr-1 font-medium text-yellow-600 dark:text-yellow-300">
          No user data
        </span>
      </div>
    );
  }

  const { searchCount, searchLimit, subscriptionStatus, provider } = userData;
  const isPaid = subscriptionStatus !== "free";
  const limitReached = searchCount >= searchLimit;
  const isGoogleAuth = provider === "google";

  return (
    <div className="flex items-center px-3 py-1 dark:bg-gray-800 rounded-md text-sm whitespace-nowrap">
      {isGoogleAuth && (
        <span className="hidden md:inline mr-1 text-blue-600 dark:text-blue-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 inline mr-0.5"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
        </span>
      )}
      <span
        className={`mr-1 font-semibold ${
          limitReached && !isPaid ? "text-red-500 dark:text-red-400" : ""
        }`}
      >
        {isPaid
          ? `${searchCount} / ${searchLimit}`
          : `${searchCount} / ${searchLimit} free`}
      </span>

      {!isPaid && limitReached && (
        <Link
          href="/pricing"
          className="ml-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Upgrade
        </Link>
      )}
    </div>
  );
}
