import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import { GarageProvider } from "@/components/garage-provider";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { BottomNav, BottomNavView } from "@/components/bottom-nav";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: ["600", "700", "800"], style: ["normal", "italic"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["500"] });

export const metadata: Metadata = {
  title: { default: "PiècesExpress Moto — pièces de rechange moto en Tunisie", template: "%s · PiècesExpress Moto" },
  description: "Pièces de rechange moto et scooter compatibles avec votre moto : freinage, kit chaîne, filtration, allumage. Retrait en 1 h ou livraison 24 h.",
};

export const viewport: Viewport = { themeColor: "#f4f3ef" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${barlow.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <svg width="0" height="0" aria-hidden="true" className="absolute">
          <defs>
            {/* Brushed-steel stroke used by part drawings (PartIcon). */}
            <linearGradient id="pe-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#59616F" />
              <stop offset="0.42" stopColor="#1C2129" />
              <stop offset="0.52" stopColor="#7D8796" />
              <stop offset="0.62" stopColor="#262B33" />
              <stop offset="1" stopColor="#11141A" />
            </linearGradient>
          </defs>
        </svg>
        <GarageProvider>
          <SiteHeader />
          <div className="flex-1 pb-[104px] md:pb-0">{children}</div>
          <SiteFooter />
          <Suspense fallback={<BottomNavView pathname={null} />}>
            <BottomNav />
          </Suspense>
        </GarageProvider>
      </body>
    </html>
  );
}
