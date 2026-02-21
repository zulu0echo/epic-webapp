import type { Metadata } from "next";
import { Source_Serif_4, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SideNav } from "@/components/SideNav";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Footer } from "@/components/Footer";
import { ETH_BRAND } from "@/lib/brand";
import { Analytics } from "@vercel/analytics/next";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EPIC — Ethereum Public Infrastructure and Commons",
  description: "Supporting governments and public institutions in the responsible exploration and adoption of Ethereum-based solutions for public systems.",
  icons: {
    icon: ETH_BRAND.diamondGlyph,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen flex font-sans">
        <SideNav />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="shrink-0 border-b border-epic-border bg-white px-6 py-4 flex items-center justify-end gap-4">
            <GlobalSearch />
          </header>
          <main className="flex-1 overflow-auto bg-epic-surface min-h-0 flex flex-col">
            {children}
            <Footer />
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
