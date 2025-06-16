'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start md:justify-center p-4 pt-0 md:pt-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mt-4 md:mt-0">
        <SignUp routing="path" path="/sign-up" />
      </div>
    </main>
  );
} 
