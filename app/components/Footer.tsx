'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim()) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <footer className="w-full bg-[#4A4A4A] text-white py-8 sm:py-12 md:py-16 mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-18">
          <div className="flex flex-col mb-10 sm:mb-0">
            <div className="flex items-center mb-6 h-[28px]">
              <Image
                src="/06309ab03ce991fefd8f30dc46f429e158d9a251.png"
                alt="The Diff Between Logo"
                width={65}
                height={28}
                className="filter brightness-0 invert mt-5"
              />
            </div>
            <p className="text-sm mb-1 font-light">+1 (7635) 547-12-97</p>
            <p className="text-sm font-light">support@lift.agency</p>
          </div>
          
          <div className="flex flex-col mb-8 sm:mb-0">
            <h3 className="font-medium mb-4 h-[28px] flex items-center">Quick Links</h3>
            <Link href="/product" className="text-sm mb-3 font-light">
              Product
            </Link>
            <Link href="/information" className="text-sm font-light">
              Information
            </Link>
          </div>
          
          <div className="flex flex-col mb-8 sm:mb-0">
            <h3 className="font-medium mb-4 h-[28px] flex items-center">About</h3>
            <Link href="/company" className="text-sm mb-3 font-light">
              Company
            </Link>
            <Link href="/lift-media" className="text-sm font-light">
              Lift Media
            </Link>
          </div>
          
          <div className="flex flex-col">
            <h3 className="font-medium mb-4 h-[28px] flex items-center">Subscribe</h3>
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Get product updates"
                  className="bg-white text-black px-4 py-2 text-sm rounded-l w-full"
                  required
                />
                <button type="submit" className="bg-black px-3 py-2 rounded-r">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {isSubmitted && (
                <div className="text-green-300 text-sm mt-1 mb-2 animate-pulse">
                  Your message was sent!
                </div>
              )}
            </form>
            
            <div className="flex gap-2 mt-2">
              <div className="bg-white p-1 rounded">
                <Image
                  src="/FBSocial.jpg"
                  alt="Facebook"
                  width={40}
                  height={40}
                  className="rounded"
                />
              </div>
              <div className="bg-white p-1 rounded">
                <Image
                  src="/InstaSocial.jpg"
                  alt="Instagram"
                  width={40}
                  height={40}
                  className="rounded"
                />
              </div>
              <div className="bg-white p-1 rounded">
                <Image
                  src="/TickTokSocial.jpg"
                  alt="TikTok"
                  width={40}
                  height={40}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 