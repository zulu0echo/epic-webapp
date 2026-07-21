"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Home, Mail, LogOut, PanelLeftClose, PanelLeft, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";
import { ETH_BRAND } from "@/lib/brand";
import { GlobalSearch } from "@/components/GlobalSearch";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";

const STORAGE_KEY = "epic-sidebar-collapsed";

const homeSections = [
  { id: "overview", num: "00", label: "Overview" },
  { id: "context", num: "01", label: "Context" },
  { id: "evidence", num: "02", label: "Evidence" },
  { id: "foundations", num: "03", label: "Design principles" },
  { id: "deployments", num: "04", label: "Deployments" },
  { id: "capabilities", num: "05", label: "Capabilities" },
  { id: "pathways", num: "06", label: "Pathways" },
  { id: "engage", num: "07", label: "Engagement" },
  { id: "resources", num: "08", label: "Resources" },
];

const routeNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/map", label: "Map Explorer", icon: Map },
  { href: "/contact", label: "Contact", icon: Mail },
];

function GroupLabel({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) return <div className="mx-auto my-2 h-px w-6 bg-epic-navy-muted/50" aria-hidden />;
  return (
    <span className="block px-3 pb-1 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-epic-slate-muted">
      {children}
    </span>
  );
}

function useScrollSpy(enabled: boolean) {
  const [active, setActive] = useState<string>("overview");

  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    for (const s of homeSections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [enabled]);

  return [active, setActive] as const;
}

function TocLinks({
  active,
  onNavigate,
  collapsed,
}: {
  active: string;
  onNavigate: (id: string) => void;
  collapsed?: boolean;
}) {
  return (
    <>
      {homeSections.map(({ id, num, label }) => (
        <a
          key={id}
          href={`#${id}`}
          title={collapsed ? label : undefined}
          onClick={() => onNavigate(id)}
          className={cn(
            "flex items-baseline gap-2.5 rounded-r-lg border-l-2 py-1.5 pl-3 pr-2 text-sm transition-colors",
            collapsed && "justify-center gap-0 border-l-0 pl-2 pr-2",
            active === id
              ? "border-epic-yellow bg-white/5 text-epic-yellow"
              : "border-transparent text-slate-400 hover:bg-white/5 hover:text-epic-yellow"
          )}
        >
          <span className="font-mono text-[11px] tracking-wide opacity-80">{num}</span>
          {!collapsed && <span className="truncate">{label}</span>}
        </a>
      ))}
    </>
  );
}

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
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useScrollSpy(isHome);

  const exploreNav = isHome ? routeNav.filter((r) => r.href !== "/") : routeNav;

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

  const brand = (
    <>
      <img
        src={ETH_BRAND.diamondGlyph}
        alt=""
        className="h-7 w-7 shrink-0 brightness-0 invert"
        width={28}
        height={28}
      />
    </>
  );

  const routeLinkClass = (href: string, extra?: string) =>
    cn(
      "flex items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors",
      extra,
      pathname === href || (href !== "/" && pathname.startsWith(href))
        ? "bg-white/10 text-epic-yellow"
        : "text-slate-400 hover:bg-white/5 hover:text-epic-yellow"
    );

  if (isOverlay) {
    if (!mobileOpen) return null;
    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
        {/* keep the bg-* trio out of cn()/twMerge, which would drop all but the last */}
        <nav
          className="bg-epic-navy bg-epic-grid-dark bg-grid fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-epic-navy-muted/40 p-3 shadow-xl md:hidden"
          aria-label="Main navigation"
        >
          <div className="mb-1 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 px-3 py-2.5" onClick={onMobileClose}>
              {brand}
              <span className="font-mono text-xs font-semibold leading-snug tracking-wide text-epic-yellow">
                Ethereum Foundation
                <br />
                for Institutions
              </span>
            </Link>
            <button
              type="button"
              onClick={onMobileClose}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-1 py-2">
            <GlobalSearch compact />
          </div>
          <div className="flex flex-1 flex-col gap-0.5 py-1">
            {isHome && (
              <>
                <GroupLabel>contents</GroupLabel>
                <TocLinks
                  active={activeSection}
                  onNavigate={(id) => {
                    setActiveSection(id);
                    onMobileClose?.();
                  }}
                />
                <GroupLabel>explore</GroupLabel>
              </>
            )}
            {exploreNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={routeLinkClass(href, "min-h-[44px] py-3")}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-auto space-y-0.5 border-t border-epic-navy-muted/40 pt-2">
            {admin && (
              <button
                onClick={handleLogout}
                className="flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-epic-yellow"
              >
                <LogOut className="h-4 w-4 shrink-0" />
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
      className={
        "bg-epic-navy bg-epic-grid-dark bg-grid " +
        cn(
          "sticky top-0 z-30 flex h-screen shrink-0 self-start flex-col gap-0.5 border-r border-epic-navy-muted/40 p-3 transition-[width] duration-200 ease-out",
          collapsed ? "w-[4.25rem]" : "w-60"
        )
      }
    >
      <Link
        href="/"
        className={cn(
          "mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5",
          collapsed && "justify-center px-0"
        )}
      >
        {brand}
        <span
          className={cn(
            "font-mono text-xs font-semibold leading-snug tracking-wide text-epic-yellow",
            collapsed && "hidden"
          )}
        >
          Ethereum Foundation
          <br />
          for Institutions
        </span>
        {collapsed && <span className="sr-only">Ethereum Foundation for Institutions</span>}
      </Link>
      {collapsed ? (
        <button
          onClick={toggleCollapsed}
          title="Search"
          className="flex items-center justify-center rounded-lg px-0 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-epic-yellow"
        >
          <Search className="h-4 w-4 shrink-0" />
        </button>
      ) : (
        <div className="px-1 py-2">
          <GlobalSearch compact />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-1">
        {isHome && (
          <>
            <GroupLabel collapsed={collapsed}>contents</GroupLabel>
            <TocLinks active={activeSection} onNavigate={setActiveSection} collapsed={collapsed} />
            <GroupLabel collapsed={collapsed}>explore</GroupLabel>
          </>
        )}
        {exploreNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={routeLinkClass(href, cn("py-2.5", collapsed && "justify-center px-0"))}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </div>
      <div className="mt-auto space-y-0.5 border-t border-epic-navy-muted/40 pt-2">
        {admin && (
          <button
            onClick={handleLogout}
            title={collapsed ? "Log out" : undefined}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-epic-yellow",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Log out"}
          </button>
        )}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-white/5 hover:text-epic-yellow",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4 shrink-0" />
          ) : (
            <PanelLeftClose className="h-4 w-4 shrink-0" />
          )}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </nav>
  );
}
