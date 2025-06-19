'use client';

interface AdCardProps {
  shouldShowAds: boolean;
  position?: 'center' | 'left' | 'right' | 'navbar';
}

export default function AdCard({ shouldShowAds, position = 'center' }: AdCardProps) {
  if (!shouldShowAds) return null;

  if (position === 'navbar') {
    return (
      <div className="bg-white-100 text-gray-800 px-30 py-1 rounded text-sm font-medium border border-green-200 flex items-center h-16">
        <a
          href="https://www.dpbolvw.net/click-101465718-15520679"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', width: '140px', height: '320px' }}
        >
          <img
            src="https://www.lduhtrp.net/image-101465718-15520679"
            alt="Advertisement"
            style={{ width: '140px', height: '320px', objectFit: 'cover' }}
          />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-6 mb-4 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
      <h4 className="text-center mb-0.5 text-gray-500 dark:text-gray-400 text-xs font-medium">
        Advertisement
      </h4>
      <div className="flex justify-center">
        <a
          href="https://www.dpbolvw.net/click-101465718-15520679"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-[320px] h-[100px] bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs font-medium"
        >
          <img
            src="https://www.lduhtrp.net/image-101465718-15520679"
            alt="Advertisement"
            className="w-full h-full object-cover"
          />
        </a>
      </div>
    </div>
  );
}
