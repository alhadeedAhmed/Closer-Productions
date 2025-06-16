'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>> & {
      push: (params: Record<string, unknown>) => void;
      loaded?: boolean;
    };
  }
}

interface AdUnitProps {
  adSlot: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  width?: number;
  height?: number;
}

// Create a unique ID for each AdUnit to prevent duplicate initialization
let uniqueId = 0;

export default function AdUnit({
  adSlot,
  adFormat = 'auto',
  responsive = true,
  style = {},
  className = '',
  width = 728,   // Default to leaderboard size
  height = 90,   // Default to leaderboard height
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adUnitId = useRef<string>(`ad-${uniqueId++}`);
  
  useEffect(() => {
    // We need to wait until the component is mounted and visible in the DOM
    if (typeof window === 'undefined' || !adRef.current) return;
    
    // Get width of container to ensure we have space
    const containerWidth = adRef.current.offsetWidth;
    
    // Only proceed if container has width and adsbygoogle exists
    if (containerWidth > 0 && window.adsbygoogle) {
      try {
        // Push exactly once per component instance
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Silently ignore errors
      }
    }
  }, []);

  // Ensure the ad container has width and makes space for the ad
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: `${width}px`,
    minHeight: `${height}px`,
    margin: '0 auto',
    ...style,
  };
  
  // Style for the actual ins element
  const adStyle: React.CSSProperties = {
    display: 'block',
    width: '100%', 
    height: `${height}px`,
  };

  return (
    <div ref={adRef} className={`ad-container w-full mx-auto my-4 ${className}`} style={containerStyle} id={adUnitId.current}>
      <div className="text-center mb-0.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Advertisement</span>
      </div>
      <div className="flex justify-center">
      <script 
            async 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5033386943958328"
            crossOrigin="anonymous"
          ></script>
        <ins
          className="adsbygoogle"
          style={adStyle}
          data-ad-client="ca-pub-5033386943958328"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
    </div>
  );
} 