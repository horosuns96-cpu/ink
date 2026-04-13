import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Web3Provider } from "./providers";
import { Header } from "@/components/Header";
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageTransition } from '@/components/PageTransition';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { StarField } from '@/components/StarField';
import { CursorTrail } from '@/components/CursorTrail';

export const metadata: Metadata = {
  title: "InkLaunch — Token Factory on Ink Sepolia",
  description: "Deploy ERC-20 tokens instantly on the Ink Sepolia network. Fast, simple, and gasless launching for builders.",
  keywords: ["Ink Sepolia", "ERC-20", "Token Factory", "Web3", "DeFi"],
  openGraph: {
    title: "InkLaunch — Token Factory",
    description: "Deploy your ERC-20 token on Ink Sepolia in seconds. No code required.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black text-white antialiased min-h-screen selection:bg-purple-500/30 selection:text-white">
        <BackgroundBlobs />
        <StarField />
        <CursorTrail />
        <ErrorBoundary>
          <Web3Provider>
            <Header />
            <PageTransition>
              {children}
            </PageTransition>
          </Web3Provider>
        </ErrorBoundary>
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  );
}
