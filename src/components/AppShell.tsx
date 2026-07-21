"use client";

import { useState } from "react";
import { SideNav } from "@/components/SideNav";
import { Footer } from "@/components/Footer";
import { Menu } from "lucide-react";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const showMobileNav = useIsMobileDevice(768);

  return (
    <div className="flex min-h-screen w-full">
      <SideNav
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col min-w-[min(100%,360px)]">
        {showMobileNav && (
          <header className="flex shrink-0 items-center gap-4 border-b border-epic-border bg-white px-4 py-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </header>
        )}
        <main className="flex min-h-0 flex-1 flex-col overflow-auto bg-epic-surface">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
