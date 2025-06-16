import Image from 'next/image';
import Link from 'next/link';

export default function SocialButtons() {
  return (
    <div className="flex items-center justify-center gap-4 mt-4 mb-6">
      <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <div className="bg-white p-1 rounded shadow-sm hover:shadow-md transition-shadow">
          <Image
            src="/FBSocial.jpg"
            alt="Facebook"
            width={40}
            height={40}
            className="rounded"
          />
        </div>
      </Link>
      <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <div className="bg-white p-1 rounded shadow-sm hover:shadow-md transition-shadow">
          <Image
            src="/InstaSocial.jpg"
            alt="Instagram"
            width={40}
            height={40}
            className="rounded"
          />
        </div>
      </Link>
      <Link href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
        <div className="bg-white p-1 rounded shadow-sm hover:shadow-md transition-shadow">
          <Image
            src="/TickTokSocial.jpg"
            alt="TikTok"
            width={40}
            height={40}
            className="rounded"
          />
        </div>
      </Link>
      <div className="flex items-center ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">Secure SSL</span>
      </div>
    </div>
  );
} 