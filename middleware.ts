// import { clerkMiddleware } from '@clerk/nextjs/server'

// // This ensures authentication for protected routes
// // Since we're removing sign-up, we'll use the clerk dashboard to disable sign-up
// export default clerkMiddleware()

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/home(.*)",
  "/comparison(.*)"
]);
  
export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.\\..|_next).)", "/", "/(api|trpc)(.*)"],
};