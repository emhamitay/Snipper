// בעה"י
"use client";

import * as React from "react";

type TopProgressContextValue = {
  /** Whether the bar should currently be visible/animating. */
  active: boolean;
  /** Begin a loading task. Safe to call concurrently (ref-counted). */
  start: () => void;
  /** Finish a loading task. The bar hides once all tasks are done. */
  done: () => void;
};

const TopProgressContext = React.createContext<TopProgressContextValue | null>(
  null,
);

export function TopProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = React.useState(false);
  // Number of in-flight tasks. The bar stays active until this hits 0.
  const countRef = React.useRef(0);

  const start = React.useCallback(() => {
    countRef.current += 1;
    if (countRef.current > 0) setActive(true);
  }, []);

  const done = React.useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    if (countRef.current === 0) setActive(false);
  }, []);

  const value = React.useMemo(
    () => ({ active, start, done }),
    [active, start, done],
  );

  return (
    <TopProgressContext.Provider value={value}>
      {children}
    </TopProgressContext.Provider>
  );
}

export function useTopProgress(): TopProgressContextValue {
  const ctx = React.useContext(TopProgressContext);
  if (!ctx) {
    throw new Error("useTopProgress must be used within a TopProgressProvider");
  }
  return ctx;
}
