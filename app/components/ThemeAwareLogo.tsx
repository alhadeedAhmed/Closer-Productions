"use client";

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeAwareLogo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a more graceful mounting process to prevent layout shift
  if (!mounted) {
    return (
      <div className="flex items-center h-[40px] sm:h-[50px] md:h-[60px] lg:h-[70px]">
        <div className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] h-full bg-transparent"></div>
      </div>
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <div className="flex items-center">
      {isDark ? (
        <Image 
          src="/BgDarkMode2.jpg" 
          alt="Diff Logo Dark" 
          width={200} 
          height={70} 
          className="w-[120px] h-[40px] sm:w-[150px] sm:h-[50px] md:w-[180px] md:h-[60px] lg:w-[200px] lg:h-[70px] object-contain" 
          priority
        />
      ) : (
        <Image 
          src="/LightModeHeader.png" 
          alt="Diff Logo Light" 
          width={200} 
          height={70} 
          className="w-[120px] h-[40px] sm:w-[150px] sm:h-[50px] md:w-[180px] md:h-[60px] lg:w-[200px] lg:h-[70px] object-contain" 
          priority
        />
      )}
    </div>
  );
} 

