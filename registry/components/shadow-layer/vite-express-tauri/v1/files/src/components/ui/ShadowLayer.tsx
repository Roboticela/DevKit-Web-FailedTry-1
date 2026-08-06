import * as React from "react";
import { Surface, type SurfaceElevation, type SurfaceProps } from "./Surface";

export interface ShadowLayerProps extends Omit<SurfaceProps, "elevation"> {
  /** Depth band 0–4 — uses elevation tokens, not box-shadow. */
  level?: SurfaceElevation;
}

/**
 * Shadow Layer — named depth band via surface elevation (shadow CSS vars stay none).
 */
export function ShadowLayer({ level = 2, className = "", ...props }: ShadowLayerProps) {
  return (
    <Surface
      elevation={level}
      className={`dk-shadow-layer ${className}`.trim()}
      {...props}
    />
  );
}
