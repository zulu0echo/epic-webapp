"use client";

import { useEffect, useState } from "react";

/** Roughly matches phones and small tablets; excludes desktop browsers. */
function getIsMobileUserAgent(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(ua);
}

/**
 * Returns true only when the viewport is within the breakpoint AND the device
 * appears to be mobile (user agent). So desktop users with a narrow window
 * keep the full layout; real mobile devices get the mobile UI.
 * @param maxWidthPx - Use 768 for nav (md), 1024 for map (lg).
 */
export function useIsMobileDevice(maxWidthPx: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isUA = getIsMobileUserAgent();
    const m = window.matchMedia(`(max-width: ${maxWidthPx - 1}px)`);
    const update = () => setIsMobile(isUA && m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, [maxWidthPx]);

  return isMobile;
}
