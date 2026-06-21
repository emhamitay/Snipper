// בעה"י
"use client";

import * as React from "react";
import { TopProgressProvider } from "@/components/top-progress/top-progress-context";
import { TopProgressBar } from "@/components/top-progress/top-progress-bar";
import { NavigationProgress } from "@/components/top-progress/navigation-progress";

export { useTopProgress } from "@/components/top-progress/top-progress-context";
export { TopProgressBar } from "@/components/top-progress/top-progress-bar";

/**
 * Top-level wrapper: provides the progress context, renders the global bar, and
 * wires up automatic navigation tracking. Mount once in the root layout.
 */
export function TopProgress({ children }: { children: React.ReactNode }) {
  return (
    <TopProgressProvider>
      <TopProgressBar />
      <React.Suspense fallback={null}>
        <NavigationProgress />
      </React.Suspense>
      {children}
    </TopProgressProvider>
  );
}
