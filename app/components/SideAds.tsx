'use client';

import { useUserData } from '@/lib/UserDataProvider';
import AdUnit from './AdUnit';

export default function SideAds() {
  const { userData } = useUserData();
  
  // Only show ads for users with free subscription status
  const shouldShowAds = !userData || userData.subscriptionStatus === 'free';
  
  if (!shouldShowAds) return null;
  
  return (
    <>
      {/* Left side ad */}
      <div className="hidden lg:block fixed left-4 top-[120px] z-10" style={{ width: '160px' }}>
        <AdUnit 
          adSlot="2154566608" 
          style={{ 
            display: 'inline-block', 
            width: '160px', 
            height: '600px' 
          }} 
          className="p-0 m-0" 
        />
      </div>
      
      {/* Right side ad */}
      <div className="hidden lg:block fixed right-4 top-[120px] z-10" style={{ width: '160px' }}>
        <AdUnit 
          adSlot="2154566608" 
          style={{ 
            display: 'inline-block', 
            width: '160px', 
            height: '600px' 
          }} 
          className="p-0 m-0" 
        />
      </div>
    </>
  );
} 