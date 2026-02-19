import type { Metadata } from "next";
import "./globals.css";
import { SideNav } from "@/components/SideNav";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ETH_BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "EPIC — GovTech & DPI Ecosystem",
  description: "Ethereum Public Infrastructure and Commons: map, CRM, and Rolodex.",
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
    <html lang="en">
      <body className="min-h-screen flex">
        <SideNav />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="shrink-0 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-4 py-3 flex items-center justify-end gap-4 shadow-epic">
            <GlobalSearch />
          </header>
          <main className="flex-1 overflow-auto bg-slate-50/80">{children}</main>
        </div>
      </body>
    </html>
  );
}
