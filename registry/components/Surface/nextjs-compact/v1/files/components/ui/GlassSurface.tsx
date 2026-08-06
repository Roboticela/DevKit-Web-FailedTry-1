import * as React from "react";
import { Surface, type SurfaceProps } from "./Surface";

export type GlassSurfaceProps = Omit<SurfaceProps, "material">;

/** Translucent glass surface — blur + thin material token. */
export function GlassSurface({
  variant = "card",
  elevation = 2,
  ...props
}: GlassSurfaceProps) {
  return <Surface variant={variant} material="glass" elevation={elevation} {...props} />;
}
