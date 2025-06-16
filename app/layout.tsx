import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./components/ClientProviders";

export const metadata: Metadata = {
  title: "The niche search engine for comparisons.",
  description: "Discover unique, side-by-side comparisons for anything you can imagine.",
  icons: {
    icon: "/06309ab03ce991fefd8f30dc46f429e158d9a251.png", 
  },
};

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="transition-colors duration-300">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>{children}</ClientProviders> 
      </body>
    </html>
  );
}
