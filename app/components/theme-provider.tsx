"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  React.useEffect(() => {
    // Check for saved theme in localStorage
    let savedTheme;
    try {
      const themeFromStorage = localStorage.getItem('diffbetween-theme');
      if (themeFromStorage) {
        // Handle both JSON string format and plain string format
        if (themeFromStorage.startsWith('"') && themeFromStorage.endsWith('"')) {
          savedTheme = JSON.parse(themeFromStorage);
        } else {
          // Direct string value (not JSON formatted)
          savedTheme = themeFromStorage;
        }
      }
    } catch (e) {
      console.error('Error reading theme from localStorage:', e);
    }

    // Apply the correct theme on initial load
    if (savedTheme) {
      // Apply saved theme
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } else {
      // Set dark mode as default when user first visits
      document.documentElement.classList.add('dark');
      localStorage.setItem('diffbetween-theme', 'dark');
    }
  }, []);
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  const { setTheme, ...state } = useNextTheme()
  return React.useMemo(
    () => ({
      ...state,
      setTheme: (theme: string) => {
        if (theme === "system") {
          theme = state.systemTheme || "dark"
        }
        
        // Apply class directly for immediate effect
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        
        // Save theme preference to localStorage without JSON stringifying
        localStorage.setItem('diffbetween-theme', theme);
        
        setTheme(theme)
      },
    }),
    [setTheme, state]
  )
}

export type { ThemeProviderProps } from "next-themes"