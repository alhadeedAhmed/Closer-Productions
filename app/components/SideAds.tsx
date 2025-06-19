'use client';

import { useUserData } from '@/lib/UserDataProvider';

export default function SideAds() {
  const { userData } = useUserData();

  const shouldShowAds = !userData || userData.subscriptionStatus === 'free';

  if (!shouldShowAds) return null;

  return (
    <>
      {/* Left side ad */}
      <div
        className="hidden lg:block fixed left-4 top-[120px] z-10"
        style={{ width: '160px' }}
      >
        <a
          href="https://www.dpbolvw.net/click-101465718-15520679"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', width: '160px', height: '600px' }}
        >
          <img
            src="https://www.lduhtrp.net/image-101465718-15520679"
            alt="Advertisement"
            style={{ width: '160px', height: '600px', objectFit: 'cover' }}
          />
        </a>
      </div>

      {/* Right side ad */}
      <div
        className="hidden lg:block fixed right-4 top-[120px] z-10"
        style={{ width: '160px' }}
      >
        <a
          href="https://www.dpbolvw.net/click-101465718-15520679"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', width: '160px', height: '600px' }}
        >
          <img
            src="https://www.lduhtrp.net/image-101465718-15520679"
            alt="Advertisement"
            style={{ width: '160px', height: '600px', objectFit: 'cover' }}
          />
        </a>
      </div>
    </>
  );
}
