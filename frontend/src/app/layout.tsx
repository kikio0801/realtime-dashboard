import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Realtime Dashboard (Honey Spoon)",
  description: "Made with Next.js and FastAPI",
};

import { Providers } from "@/components/providers";

/**
 * Root layout component for the application.
 * Configures global fonts, metadata, and common providers (Toaster).
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child elements to render.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster 
          position="top-right" 
          duration={2000}
          toastOptions={{
            classNames: {
              info: '!bg-[#FFF8E1] !border-[#FFECB3] !text-[#5D4037] !font-bold !shadow-md',
            },
          }}
        />
      </body>
    </html>
  );
}
