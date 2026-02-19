"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Users, Building2, BookUser, Settings, Home, Mail, Package, LogOut, PanelLeftClose, PanelLeft, BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";
import { ETH_BRAND } from "@/lib/brand";

const STORAGE_KEY = "epic-sidebar-collapsed";

const publicNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/map", label: "Map Explorer", icon: Map },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/vendor", label: "Vendor / Ecosystem", icon: Package },
];

const adminOnlyNav = [
  { href: "/rolodex", label: "Rolodex", icon: BookUser },
  { href: "/crm", label: "CRM", icon: Building2 },
  { href: "/crm/opportunities", label: "Opportunities", icon: Users },
];

const adminNav = [
  { href: "/admin", label: "Admin", icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();
  const [admin, setAdmin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

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

  const allLinks = [
    ...publicNav,
    ...(admin ? adminOnlyNav : []),
    ...adminNav,
  ];

  return (
    <nav
      className={cn(
        "border-r border-slate-200/80 bg-white flex flex-col p-3 gap-0.5 shrink-0 transition-[width] duration-200 ease-out shadow-epic",
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
        <span className={cn("font-serif text-lg font-bold text-indigo-600 truncate", collapsed && "hidden")}>EPIC</span>
        {collapsed && <span className="sr-only">EPIC</span>}
      </div>
      <div className="flex-1 flex flex-col gap-0.5 py-1">
        {allLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              collapsed && "justify-center px-0",
              pathname === href || (href !== "/" && pathname.startsWith(href))
                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </div>
      <div className="mt-auto pt-2 border-t border-slate-200/80 space-y-0.5">
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
