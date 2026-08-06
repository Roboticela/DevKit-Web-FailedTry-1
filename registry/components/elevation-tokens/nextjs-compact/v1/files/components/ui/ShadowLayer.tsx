import * as React from "react";
import { Elevation, type ElevationLevel, type ElevationProps } from "./Elevation";

export interface ShadowLayerProps extends Omit<ElevationProps, "level" | "semantic"> {
  /** Depth band 0–5 */
  level?: ElevationLevel;
  interactive?: boolean;
}

/**
 * Shadow Layer — named elevation band with subtle layered shadows.
 * Alias of Elevation with level semantics for the shape-system companion slot.
 */
export function ShadowLayer({
  level = 2,
  interactive = false,
  className = "",
  ...props
}: ShadowLayerProps) {
  return (
    <Elevation
      level={level}
      interactive={interactive}
      className={`dk-shadow-layer ${className}`.trim()}
      data-level={level}
      {...props}
    />
  );
}
