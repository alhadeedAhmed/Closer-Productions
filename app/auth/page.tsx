'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/sign-in');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start md:justify-center p-4 pt-0 md:pt-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-center mt-16 md:mt-0">
        <div className="w-16 h-16 border-t-4 border-[#7651DB] border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300">Redirecting to sign in...</p>
      </div>
    </main>
  );
} 