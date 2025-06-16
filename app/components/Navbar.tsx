"use client";

import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import ThemeAwareLogo from "./ThemeAwareLogo";
import SearchCountDisplay from "./SearchCountDisplay";
import { useUserData } from "@/lib/UserDataProvider";
import ProfitablerateAdNavbar from "./ProfitablerateAdNavbar";
// import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const userButtonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [currentTheme, setCurrentTheme] = useState("dark");
  const { userData } = useUserData();
  // const router = useRouter();
  // const pathname = usePathname();

  // Only show ads for users with free subscription status
  const shouldShowAds = !userData || userData.subscriptionStatus === "free";

  useEffect(() => {
    setMounted(true);

    // Read theme preference from localStorage
    let savedTheme;
    try {
      const themeFromStorage = localStorage.getItem("diffbetween-theme");
      if (themeFromStorage) {
        // Handle both JSON string format and plain string format
        if (
          themeFromStorage.startsWith('"') &&
          themeFromStorage.endsWith('"')
        ) {
          try {
            savedTheme = JSON.parse(themeFromStorage);
          } catch {
            savedTheme = themeFromStorage;
          }
        } else {
          savedTheme = themeFromStorage;
        }
      }
    } catch {
      console.error("Error reading theme from localStorage:");
    }

    if (savedTheme) {
      // If user has previously set a theme preference, use that
      setTheme(savedTheme);
      setCurrentTheme(savedTheme);

      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    } else if (!theme) {
      // If no saved preference and no current theme, use dark as default
      setTheme("dark");
      setCurrentTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      // Use current theme from context if available
      setCurrentTheme(theme);

      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    }
  }, [theme, setTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }

    setCurrentTheme(newTheme);
    setTheme(newTheme);
    localStorage.setItem("diffbetween-theme", newTheme);
  }, [currentTheme, setTheme]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      userButtonRef.current &&
      !userButtonRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {showBanner && (
        <div className="w-full bg-black text-white text-center py-2 sm:py-3 z-40">
          <div className="px-3 sm:px-4 max-w-[2560px] mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-1 sm:mb-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white mr-2 flex-shrink-0"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="12"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 20L17 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 16L12 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xs sm:text-sm">
                  You&apos;re in Beta! Help us improve the app for you.
                </span>
              </div>
              <div className="flex items-center">
                <Link
                  href="/contact"
                  className="text-xs sm:text-sm underline font-medium whitespace-nowrap hover:text-gray-200 transition-colors mr-4"
                >
                  Share your thoughts
                </Link>
                <button
                  onClick={() => setShowBanner(false)}
                  className="text-white hover:text-gray-300 transition-colors"
                  aria-label="Close banner"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <nav className="bg-[#ffffff] py-2 mb-0 border-b border-gray-100 dark:bg-black dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 py-1 px-1 sm:px-0">
              <Link
                href="/"
                className="flex items-center outline-none focus:ring-0"
              >
                <ThemeAwareLogo />
              </Link>
            </div>

            <div className="md:hidden flex items-center space-x-1">
              <div className="h-8 w-auto max-w-[130px] overflow-hidden whitespace-nowrap flex items-center justify-center mr-2 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                <SearchCountDisplay /> {/*ALWAYS render this */}
              </div>

              <SignedIn>
                <div
                  className="h-8 w-8 flex items-center justify-center mr-1"
                  ref={userButtonRef}
                >
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userPreviewMainIdentifier: {
                          color:
                            currentTheme === "dark" ? "#000000" : undefined, 
                        },
                        userPreviewSecondaryIdentifier: {
                          color:
                            currentTheme === "dark" ? "#000000" : undefined, 
                        },
                      },
                    }}
                  />
                </div>
              </SignedIn>

              <button
                onClick={toggleTheme}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {currentTheme === "dark" ? (
                  <SunIcon className="h-4 w-4 text-yellow-500 dark:text-yellow-300" />
                ) : (
                  <MoonIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                )}
              </button>

              <button
                type="button"
                className="h-8 w-8 inline-flex items-center justify-center rounded-md text-gray-700 hover:text-black hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="hidden md:flex space-x-3 items-center">
              {shouldShowAds && (
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 320,
                    height: 50,
                    minWidth: 320,
                    minHeight: 50,
                    maxWidth: 320,
                    maxHeight: 50,
                    padding: 0,
                    marginRight: 8,
                  }}
                >
                  <span
                    className="text-center text-gray-500 dark:text-gray-400 text-xs font-medium w-full absolute"
                    style={{
                      zIndex: 1,
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    Advertisement
                  </span>
                  <ProfitablerateAdNavbar />
                </div>
              )}

              <Link
                href="/"
                className="h-8 flex items-center justify-center px-2 text-sm font-medium text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </Link>
              <Link
                href="/about"
                className="h-8 flex items-center justify-center px-2 text-sm font-medium text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About
              </Link>
              <Link
                href="/contact"
                className="h-8 flex items-center justify-center px-2 text-sm font-medium text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact
              </Link>
              <Link
                href="/privacy"
                className="h-8 flex items-center justify-center px-2 text-sm font-medium text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Privacy
              </Link>
              <Link
                href="/pricing"
                className="h-8 flex items-center justify-center px-2 text-sm font-medium text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pricing
              </Link>

              <button
                onClick={toggleTheme}
                className="h-8 flex items-center justify-center w-8 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {currentTheme === "dark" ? (
                  <SunIcon className="h-4 w-4 text-yellow-500 dark:text-yellow-300" />
                ) : (
                  <MoonIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                )}
              </button>

              <div className="h-8 flex items-center justify-center px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 mr-2">
                <SearchCountDisplay />
              </div>

              <SignedIn>
                <div
                  className="h-8 flex items-center justify-center"
                  ref={userButtonRef}
                >
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userPreviewMainIdentifier: {
                          color:
                            currentTheme === "dark" ? "#000000" : undefined, 
                        },
                        userPreviewSecondaryIdentifier: {
                          color:
                            currentTheme === "dark" ? "#000000" : undefined, 
                        },
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>

          <div
            className={`${
              isMenuOpen ? "fixed" : "hidden"
            } md:hidden inset-0 z-50 bg-gray-800/50 backdrop-blur-sm`}
            onClick={closeMenu}
          >
            <div
              className={`fixed inset-y-0 right-0 max-w-xs w-[85vw] bg-[#FEFAF7] dark:bg-black shadow-xl transform ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
              } transition-transform duration-300 ease-in-out overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
              ref={menuRef}
            >
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center py-1">
                  <ThemeAwareLogo />
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <nav className="py-4 px-2 space-y-1">
                {shouldShowAds && (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 320,
                      height: 50,
                      minWidth: 320,
                      minHeight: 50,
                      maxWidth: 320,
                      maxHeight: 50,
                      padding: 0,
                      margin: "0 auto",
                    }}
                  >
                    <span
                      className="text-center text-gray-500 dark:text-gray-400 text-xs font-medium w-full absolute"
                      style={{
                        zIndex: 1,
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                      }}
                    ></span>
                    <ProfitablerateAdNavbar />
                  </div>
                )}

                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition duration-150 ease-in-out flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Home
                </Link>
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition duration-150 ease-in-out flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition duration-150 ease-in-out flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact
                </Link>
                <Link
                  href="/privacy"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition duration-150 ease-in-out flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Privacy
                </Link>
                <Link
                  href="/pricing"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition duration-150 ease-in-out flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Pricing
                </Link>
                <SignedOut>
                  <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-1">
                      {/* <Link
                        href="/sign-in"
                        onClick={closeMenu}
                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-[#7651DB] hover:bg-purple-700 transition duration-150 ease-in-out text-center flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign inn
                      </Link> */}
                      <Link
                        href="/sign-up"
                        onClick={closeMenu}
                        className="block px-3 py-2 rounded-md text-base font-medium text-[#7651DB] border border-[#7651DB] hover:bg-purple-50 dark:hover:bg-gray-800 transition duration-150 ease-in-out text-center mt-2 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        Sign up
                      </Link>
                    </div>
                  </div>
                </SignedOut>
              </nav>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
