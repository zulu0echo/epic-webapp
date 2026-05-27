"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Settings, Home, Mail, LogOut, PanelLeftClose, PanelLeft, BookOpen, FileText, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";
import { ETH_BRAND } from "@/lib/brand";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";

const STORAGE_KEY = "epic-sidebar-collapsed";

const publicNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/map", label: "Map Explorer", icon: Map },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/use-case-template", label: "Proof of Concept Template", icon: FileText },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/admin", label: "Admin", icon: Settings },
];

export function SideNav({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
} = {}) {
  const pathname = usePathname();
  const [admin, setAdmin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobileDevice(768);
  const isOverlay = isMobile && onMobileClose != null;

  useEffect(() => {
    if (isOverlay && mobileOpen && pathname) onMobileClose?.();
  }, [pathname, isOverlay, mobileOpen, onMobileClose]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored !== null) {
      setCollapsed(stored === "true");
    } else if (pathname.startsWith("/proof-of-concepts")) {
      setCollapsed(true);
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "true");
    }
  }, [pathname]);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setAdmin(!!d?.admin))
      .catch(() => setAdmin(false));
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAdmin(false);
    window.location.href = "/";
  };

  if (isOverlay) {
    if (!mobileOpen) return null;
    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
        <nav
          className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-epic-border bg-white p-3 shadow-xl overflow-y-auto md:hidden"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <img src={ETH_BRAND.diamondPurple} alt="" className="h-7 w-7 shrink-0" width={28} height={28} />
              <span className="font-serif text-lg font-semibold text-epic-navy">EPIC</span>
            </div>
            <button
              type="button"
              onClick={onMobileClose}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-0.5 py-1">
            {publicNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-medium min-h-[44px] items-center",
                  pathname === href || (href !== "/" && pathname.startsWith(href))
                    ? "bg-slate-100 text-epic-navy"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-auto border-t border-epic-border space-y-0.5 pt-2">
            {admin && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 w-full min-h-[44px] items-center"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Log out
              </button>
            )}
          </div>
        </nav>
      </>
    );
  }

  return (
    <nav
      className={cn(
        "border-r border-epic-border bg-white flex flex-col p-3 gap-0.5 shrink-0 transition-[width] duration-200 ease-out shadow-epic",
        collapsed ? "w-[4.25rem]" : "w-56"
      )}
    >
      <div className={cn("flex items-center gap-2 px-3 py-2.5 mb-1 rounded-lg", collapsed && "justify-center px-0")}>
        <img
          src={ETH_BRAND.diamondPurple}
          alt=""
          className="h-7 w-7 shrink-0"
          width={28}
          height={28}
        />
        <span className={cn("font-serif text-lg font-semibold text-epic-navy truncate", collapsed && "hidden")}>EPIC</span>
        {collapsed && <span className="sr-only">EPIC</span>}
      </div>
      <div className="flex-1 flex flex-col gap-0.5 py-1">
        {publicNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              collapsed && "justify-center px-0",
              pathname === href || (href !== "/" && pathname.startsWith(href))
                ? "bg-slate-100 text-epic-navy font-medium"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </div>
      <div className="mt-auto pt-2 border-t border-epic-border space-y-0.5">
        {admin && (
          <button
            onClick={handleLogout}
            title={collapsed ? "Log out" : undefined}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 w-full transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && "Log out"}
          </button>
        )}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 w-full transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? <PanelLeft className="w-4 h-4 shrink-0" /> : <PanelLeftClose className="w-4 h-4 shrink-0" />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </nav>
  );
}
