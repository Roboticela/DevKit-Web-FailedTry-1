import * as React from "react";

export interface SpacerProps extends React.HTMLAttributes<HTMLSpanElement> {
  axis?: "auto" | "x" | "y";
  size?: string;
}

/** Flex spacer or fixed gap using grid gutter tokens. */
export function Spacer({ axis = "auto", size, className = "", style, ...props }: SpacerProps) {
  const cls =
    axis === "x" ? "dk-spacer-x" : axis === "y" ? "dk-spacer-y" : "dk-spacer";
  return (
    <span
      aria-hidden
      className={`${cls} ${className}`.trim()}
      style={{ ...(size ? { ["--spacer-size" as string]: size } : null), ...style }}
      {...props}
    />
  );
}
