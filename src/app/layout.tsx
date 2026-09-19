import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
  themeColor: "#0B0F17",
};

import { CohortGate } from "@/components/auth/CohortGate";
import { SyncProvider } from "@/components/sync/SyncProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable}`}>
      <body className={`${sans.className} bg-[#0B0F17] text-slate-100 min-h-[100dvh] flex flex-col items-center justify-start antialiased selection:bg-volt-500/30 selection:text-volt-300 font-sans`}>
        {/* Subtle Athletic Grid / Ambient Lighting */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[24rem] bg-volt-500/[0.04] blur-[100px] rounded-full" />
          <div className="absolute top-[45%] -left-32 w-[24rem] h-[24rem] bg-cobalt-500/[0.03] blur-[120px] rounded-full" />
          <div className="absolute bottom-10 -right-32 w-[28rem] h-[28rem] bg-emerald-500/[0.03] blur-[120px] rounded-full" />
        </div>

        {/* Mobile Viewport Shell */}
        <div className="relative z-10 w-full max-w-md min-h-[100dvh] flex flex-col bg-[#0B0F17] sm:border-x sm:border-white/[0.08] sm:shadow-2xl sm:shadow-black">
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
