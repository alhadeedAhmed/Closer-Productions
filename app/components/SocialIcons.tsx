import React from 'react';

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376.3 82.7 476.6 194.5 504.4V334.2H141.3V256h53.2v-59.7c0-87.1 39.4-127.5 125.2-127.5c16.2 0 44.2 3.2 55.7 6.4v72.4c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2h-69.2v172.5C423.6 488.9 512 383.8 512 256z" fill="currentColor"/>
  </svg>
);

export const TwitterIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" fill="currentColor"/>
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="currentColor"/>
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" fill="currentColor"/>
  </svg>
);

export const BlueSkyIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1D9BF0">
    <circle cx="12" cy="12" r="11" stroke="#1D9BF0" fill="#1D9BF0" />
    <path d="M5 12H19M12 5V19" stroke="white" strokeWidth="3" fill="none"/>
  </svg>
);

const SocialIcons: React.FC<{ className?: string }> = ({ className = "flex justify-center space-x-4" }) => {
  return (
    <div className={className}>
      <a href="https://www.facebook.com/profile.php?id=61575067958255" target="_blank" rel="noopener noreferrer" className="text-blue-600 transition-colors duration-200" aria-label="Facebook">
        <FacebookIcon />
      </a>
      <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" className="text-blue-400 transition-colors duration-200" aria-label="X (Twitter)">
        <TwitterIcon />
      </a>
      <a href="https://www.instagram.com/accounts/onetap/?next=%2Fthdffbtwn%2F" target="_blank" rel="noopener noreferrer" className="text-pink-500 transition-colors duration-200" aria-label="Instagram">
        <InstagramIcon />
      </a>
      <a href="https://www.tiktok.com/@thediffbetween?lang=en" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white transition-colors duration-200" aria-label="TikTok">
        <TikTokIcon />
      </a>
      <a href="https://bsky.app/" target="_blank" rel="noopener noreferrer" className="text-blue-500 transition-colors duration-200" aria-label="BlueSky">
        <BlueSkyIcon />
      </a>
    </div>
  );
};

export default SocialIcons; 