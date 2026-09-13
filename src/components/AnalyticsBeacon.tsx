"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, trackTimeOnPage } from "@/lib/trackEvent";

// Mounted once in the root layout. Fires a PAGE_VIEW on every route change,
// and a TIME_ON_PAGE for the previous page right before leaving it —
// sendBeacon (via trackTimeOnPage's keepalive path) so it actually
// delivers even as the browser navigates away, which a normal fetch can't
// reliably guarantee.
export default function AnalyticsBeacon() {
  const pathname = usePathname();
  const enteredAt = useRef<number>(Date.now());
  const lastPath = useRef<string>(pathname);

  useEffect(() => {
    trackPageView(pathname);
    enteredAt.current = Date.now();
    lastPath.current = pathname;
  }, [pathname]);

  useEffect(() => {
    function sendDuration() {
      trackTimeOnPage(lastPath.current, Date.now() - enteredAt.current);
    }
    window.addEventListener("pagehide", sendDuration);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") sendDuration();
    });
    return () => {
      window.removeEventListener("pagehide", sendDuration);
    };
  }, []);

  return null;
}
