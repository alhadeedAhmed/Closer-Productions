'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ComparisonUI from "../components/ComparisonUI";
import Cookies from 'js-cookie';

export default function HomePage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [freeSearchCount, setFreeSearchCount] = useState(0);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    document.body.className = '';
    requestAnimationFrame(() => {
      document.body.classList.add('home-page');
    });

    // Load search count from cookies (for guests)
    const cookieCount = Cookies.get('freeSearchCount');
    if (cookieCount) {
      setFreeSearchCount(parseInt(cookieCount, 10));
    }

    return () => {
      document.body.classList.remove('home-page');
    };
  }, [mounted]);

  // On sign in/up → remove guest freeSearchCount cookie (clean start)
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      Cookies.remove('freeSearchCount');
      setFreeSearchCount(0);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <main className="min-h-screen flex flex-col transition-colors duration-300">
      <div className="md:items-center justify-center p-10 md:pt-0">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 mt-4 md:mt-0 transition-colors duration-300">
          <h1 className="text-2xl md:text-3xl text-center mb-4 md:mb-6 text-black dark:text-white">
            <span className="font-normal">WHAT&apos;S</span> <span className="font-bold">THE DIFF</span><span className="font-normal">ERENCE</span> <span className="font-bold">BETWEEN</span>
          </h1>
          <p className="text-center text-gray-700 dark:text-gray-300">Enter any items and get a detailed side-by-side comparison with key characteristics</p>

          <ComparisonUI freeSearchCount={freeSearchCount} setFreeSearchCount={setFreeSearchCount} />
        </div>
      </div>
    </main>
  );
}
