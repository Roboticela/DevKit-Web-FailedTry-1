import * as React from "react";

export type DensityMode = "compact" | "comfortable" | "spacious";

export interface DensityProviderProps {
  density?: DensityMode;
  children?: React.ReactNode;
}

/**
 * Sets document density for the Spacing System (`data-density` on <html>).
 * Prefer wrapping the app root once.
 */
export function DensityProvider({ density = "comfortable", children }: DensityProviderProps) {
  React.useEffect(() => {
    const root = document.documentElement;
    if (density === "comfortable") {
      delete root.dataset.density;
    } else {
      root.dataset.density = density;
    }
    return () => {
      delete root.dataset.density;
    };
  }, [density]);

  return <>{children}</>;
}
