"use client";

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy for TheDiffBetween</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Effective Date: May 18, 2025</p>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-4">
                TheDiffBetween (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy of our users. This 
                Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
                our services. We are based in Pennsylvania, United States, and strive to 
                comply with all applicable federal and state privacy laws.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Information We Collect</h2>
              <p className="mb-4">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Personal information you provide directly, such as your name, email address, or other 
                    details when you sign up for our services or contact us.</li>
                <li>Usage data, including information about how you interact with our website (e.g., pages 
                    visited, time spent, and browser/device information).</li>
                <li>Cookies and other tracking technologies to enhance your experience and analyze usage.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">How We Use Your Information</h2>
              <p className="mb-4">We use collected information to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide, operate, and maintain our services.</li>
                <li>Improve, personalize, and expand our services.</li>
                <li>Improve our website, products, and services.</li>
                <li>Comply with legal obligations and protect our rights.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">How We Share Your Information</h2>
              <p className="mb-4">We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Service providers who assist us in operating our website and delivering our services, under 
                    confidential agreements.</li>
                <li>Legal authorities if required by law or to protect our rights and safety.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Your Choices</h2>
              <p className="mb-4">Depending on your location and applicable law, you may have the right to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access a copy of your personal information.</li>
                <li>Request correction or deletion of your information.</li>
                <li>Opt out of certain data uses, such as targeted advertising or profiling.</li>
                <li>Withdraw consent for data processing, where consent is required.</li>
              </ul>
              <p className="mb-4">
                To exercise these rights, please contact us at the email address provided below. We will respond 
                to your request within a reasonable timeframe, generally within 45 days.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Data Security</h2>
              <p className="mb-4">
                We implement reasonable security measures to protect your personal information from 
                unauthorized access, use, or disclosure.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Children&apos;s Privacy</h2>
              <p className="mb-4">
                Our services are not directed to children under 13. We do not knowingly collect personal 
                information from children under 13. If we become aware that we have collected such information, 
                we will take steps to delete it promptly.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes 
                by posting the new policy on our website with an updated date.
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Contact Us</h2>
              <p className="mb-4">
                If you have any questions or concerns about this Privacy Policy or your personal information, 
                please contact us at: <span className="font-medium">support@thediffbetween.com</span>
              </p>

              <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                This policy was created by a privacy law expert and is designed to provide transparency, 
                reflecting best practices in data minimization, user rights, and comprehensive state privacy legislation is still in development.
              </p>

              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <ol className="list-decimal pl-6 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <li>
                    <Link href="https://syrenis.com/resources/blog/pennsylvania-consumer-data-privacy-act-hb-1201/" className="text-blue-600 dark:text-blue-400 hover:underline">
                      https://syrenis.com/resources/blog/pennsylvania-consumer-data-privacy-act-hb-1201/
                    </Link>
                  </li>
                  <li>
                    <Link href="https://termly.io/resources/articles/privacy-policy-best-practices/" className="text-blue-600 dark:text-blue-400 hover:underline">
                      https://termly.io/resources/articles/privacy-policy-best-practices/
                    </Link>
                  </li>
                  <li>
                    <Link href="https://termly.io/resources/articles/pennsylvania-consumer-data-privacy-act/" className="text-blue-600 dark:text-blue-400 hover:underline">
                      https://termly.io/resources/articles/pennsylvania-consumer-data-privacy-act/
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20250128-state-comprehensive-privacy-law-update" className="text-blue-600 dark:text-blue-400 hover:underline">
                      https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20250128-state-comprehensive-privacy-law-update
                    </Link>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 