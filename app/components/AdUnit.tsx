'use client';

interface AdUnitProps {
  href: string;       
  imgSrc: string;    
  width?: number;
  height?: number;
}

export default function AdUnit({
  href,
  imgSrc,
  width = 728,
  height = 90,
}: AdUnitProps) {
  return (
    <div
      className="ad-container w-full mx-auto my-4"
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        minHeight: `${height}px`,
        margin: '0 auto',
      }}
    >
      <div className="text-center mb-0.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Advertisement</span>
      </div>
      <div className="flex justify-center">
        <a href={href} target="_blank" rel="noopener noreferrer">
          <img
            src={imgSrc}
            alt="Ad Banner"
            style={{
              width: '100%',
              height: `${height}px`,
              objectFit: 'cover',
            }}
          />
        </a>
      </div>
    </div>
  );
}
