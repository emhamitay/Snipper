// בעה"י
"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTopProgress } from "@/components/top-progress/top-progress-context";

/**
 * Automatically drives the top progress bar on client-side navigation.
 *
 * Starts the bar when an internal link is clicked (or on browser back/forward)
 * and finishes it once the route actually changes. Mounted once near the root.
 *
 * Note: this uses `useSearchParams`, so it must be rendered inside a
 * <Suspense> boundary to avoid opting the whole app into dynamic rendering.
 */
export function NavigationProgress() {
  const { start, done } = useTopProgress();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Finish the bar whenever the resolved URL changes (navigation completed).
  const url = `${pathname}?${searchParams}`;
  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  React.useEffect(() => {
    function isModifiedEvent(event: MouseEvent) {
      return (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      );
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedEvent(event)) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      // Let the browser handle non-navigational schemes.
      if (/^(mailto:|tel:|sms:|blob:|#)/.test(href)) return;

      let destination: URL;
      try {
        destination = new URL(href, window.location.href);
      } catch {
        return;
      }

      // External link — full page load, nothing to track.
      if (destination.origin !== window.location.origin) return;
      // Same page (only a hash change or identical URL) — no navigation.
      const current = window.location;
      if (
        destination.pathname === current.pathname &&
        destination.search === current.search
      ) {
        return;
      }

      start();
    }

    function onPopState() {
      start();
    }

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
    };
  }, [start]);

  return null;
}
