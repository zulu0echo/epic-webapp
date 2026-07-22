"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport is at or below the breakpoint — width-based, so
 * the mobile UI applies to real phones AND any narrow viewport (narrow desktop
 * windows, responsive devtools, small tablets). This is the standard responsive
 * behavior; it intentionally no longer gates on user agent.
 * @param maxWidthPx - Use 768 for nav (md), 1024 for map (lg).
 */
export function useIsMobileDevice(maxWidthPx: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const m = window.matchMedia(`(max-width: ${maxWidthPx - 1}px)`);
    const update = () => setIsMobile(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, [maxWidthPx]);

  return isMobile;
}
