import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ETH_BRAND } from "@/lib/brand";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen flex font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
