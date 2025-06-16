'use client';

import { useState } from 'react';
import { 
  SignIn, 
  SignUp, 
  UserButton, 
  UserProfile, 
  useUser, 
  SignedIn, 
  SignedOut
} from '@clerk/nextjs';

export default function AuthUI() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'profile'>('signin');
  const { isSignedIn, user } = useUser();

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-xl shadow-2xl p-8 border border-blue-100 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200 to-indigo-200 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              {isSignedIn ? 'Your Account' : 'Welcome'}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto mt-2 mb-4"></div>
            <p className="text-gray-600 text-sm">
              {isSignedIn 
                ? `Welcome back, ${user?.firstName || 'User'}!` 
                : 'Sign in to your account or create a new one'}
            </p>
          </div>

          <SignedIn>
            <div className="flex justify-center mb-8">
              <UserButton />
            </div>
            
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'profile'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <a 
                href="/comparison"
                className="px-4 py-2 rounded-lg transition bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md"
              >
                Go to Comparison
              </a>
            </div>

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg p-4 shadow-md">
                <UserProfile />
              </div>
            )}
          </SignedIn>

          <SignedOut>
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('signin')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'signin'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'signup'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Sign Up
              </button>
            </div>

            {activeTab === 'signin' && (
              <div className="bg-white rounded-lg p-4 shadow-md">
                <SignIn redirectUrl="/comparison" />
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="bg-white rounded-lg p-4 shadow-md">
                <SignUp redirectUrl="/comparison" />
              </div>
            )}
          </SignedOut>
        </div>
      </div>
    </div>
  );
} 