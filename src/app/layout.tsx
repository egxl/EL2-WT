import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elemen 2 — Cohort Weight & Health Tracker",
  description: "Dedicated mobile weight & biometric tracker for Elemen 2 close group.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Elemen 2",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#07090E",
};

import { CohortGate } from "@/components/auth/CohortGate";
import { SyncProvider } from "@/components/sync/SyncProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-[#07090E] text-slate-100 min-h-[100dvh] flex flex-col items-center justify-start antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {/* Ambient background light effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] bg-amber-500/10 blur-[130px] rounded-full" />
          <div className="absolute top-[40%] -left-32 w-[28rem] h-[28rem] bg-emerald-500/8 blur-[140px] rounded-full" />
          <div className="absolute bottom-10 -right-32 w-[30rem] h-[30rem] bg-cyan-500/8 blur-[140px] rounded-full" />
        </div>

        {/* Mobile Viewport Shell */}
        <div className="relative z-10 w-full max-w-md min-h-[100dvh] flex flex-col bg-[#07090E] sm:border-x sm:border-white/10 sm:shadow-2xl sm:shadow-black">
          <CohortGate>
            <SyncProvider>
              {children}
            </SyncProvider>
          </CohortGate>
        </div>
      </body>
    </html>
  );
}
