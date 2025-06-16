'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    document.body.className = '';
    requestAnimationFrame(() => {
      document.body.classList.add('home-page');
    });

    router.push('/');

    return () => {
      document.body.classList.remove('home-page');
    };
  }, [mounted, router]);

  return null;
}
