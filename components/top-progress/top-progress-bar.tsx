// בעה"י
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTopProgress } from "@/components/top-progress/top-progress-context";

/**
 * A GitHub/Google-style indeterminate loading bar fixed to the top of the
 * viewport. Driven by the TopProgress context, so any code can show it via
 * `useTopProgress().start()` / `.done()`.
 */
export function TopProgressBar({ className }: { className?: string }) {
  const { active } = useTopProgress();
  // Keep the element mounted briefly after `active` flips to false so the
  // fade-out transition can play.
  const [render, setRender] = React.useState(false);

  React.useEffect(() => {
    if (active) {
      setRender(true);
      return;
    }
    const timeout = setTimeout(() => setRender(false), 300);
    return () => clearTimeout(timeout);
  }, [active]);

  if (!render) return null;

  return (
    <div
      role="progressbar"
      aria-busy={active}
      aria-label="Loading"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden transition-opacity duration-300",
        active ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <div className="animate-top-progress h-full w-2/5 rounded-r-full bg-linear-to-r from-transparent via-primary to-primary shadow-[0_0_8px] shadow-primary/50" />
    </div>
  );
}
