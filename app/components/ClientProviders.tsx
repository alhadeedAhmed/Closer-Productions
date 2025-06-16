"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";
import { UserDataProvider } from "@/lib/UserDataProvider";
import Navbar from "./Navbar";
import Script from "next/script";
import ClientOnly from "./ClientOnly"; 
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ClientOnly>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="diffbetween-theme"
            disableTransitionOnChange
          >
          <UserDataProvider>
              <Navbar />
              <main className="min-h-screen transition-colors duration-300">
                {children}
              </main>
            </UserDataProvider>
            </ThemeProvider>
          <Script id="route-transition-helper" strategy="afterInteractive">
            {`
              (function() {
                // Function to handle page transitions
                function handlePageTransition() {
                  // Remove any existing background image styles
                  const style = document.createElement('style');
                  style.id = 'temp-transition-style';
                  style.textContent = 'body::before, body::after { display: none !important; }';
                  document.head.appendChild(style);
                  
                  // Remove the style after transition completes
                  setTimeout(() => {
                    const tempStyle = document.getElementById('temp-transition-style');
                    if (tempStyle) {
                      tempStyle.remove();
                    }
                  }, 50);
                }
                
                // Listen for navigation events
                if (typeof window !== 'undefined') {
                  window.addEventListener('beforeunload', handlePageTransition);
                  window.addEventListener('popstate', handlePageTransition);
                }
              })();
            `}
          </Script>
      </ClientOnly>
    </ClerkProvider>
  );
}
