'use client';

interface AdCardProps {
  shouldShowAds: boolean;
  position?: 'center' | 'left' | 'right' | 'navbar';
}

export default function AdCard({ shouldShowAds, position = 'center' }: AdCardProps) {
  // Don't render anything if ads shouldn't be shown
  if (!shouldShowAds) return null;

  // More visible text-based "ad" for navbar position
  if (position === 'navbar') {
    return (
      <div className="bg-white-100 text-gray-800 px-30 py-1 rounded text-sm font-medium border border-green-200 flex items-center h-16">
        <ins 
            className="adsbygoogle" 
            style={{ display: 'block', width: '140px', height: '320px' }}
            data-ad-client="ca-pub-5033386943958328"
            data-ad-slot="2154566608"
            data-ad-format="auto"
        />
      </div>
    );
  }



  // Center ad (default)
  return (
    <div className="w-full max-w-xl mx-auto mt-6 mb-4 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
      <h4 className="text-center mb-0.5 text-gray-500 dark:text-gray-400 text-xs font-medium">Advertisement</h4>
      <div className="flex justify-center">
        <div className="w-full max-w-[320px] h-[100px] bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs font-medium">
        </div>
      </div>
    </div>
  );
} 