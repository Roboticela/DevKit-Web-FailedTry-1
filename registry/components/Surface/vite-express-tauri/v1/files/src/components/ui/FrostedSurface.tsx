import * as React from "react";
import { Surface, type SurfaceProps } from "./Surface";

export type FrostedSurfaceProps = Omit<SurfaceProps, "material">;

/** Frosted glass surface — thicker material + stronger blur. */
export function FrostedSurface({
  variant = "card",
  elevation = 3,
  ...props
}: FrostedSurfaceProps) {
  return <Surface variant={variant} material="frosted" elevation={elevation} {...props} />;
}
