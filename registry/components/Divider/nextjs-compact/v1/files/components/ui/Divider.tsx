import * as React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  subtle?: boolean;
  spacing?: 2 | 3 | 4 | 6 | 8;
}

export function Divider({
  orientation = "horizontal",
  subtle = true,
  spacing = 4,
  style,
  ...props
}: DividerProps) {
  const color = subtle ? "var(--color-border-subtle)" : "var(--color-border)";
  const isVertical = orientation === "vertical";

  return (
    <hr
      aria-orientation={orientation}
      style={{
        border: "none",
        background: color,
        width: isVertical ? "var(--border-width)" : "100%",
        height: isVertical ? "100%" : "var(--border-width)",
        margin: isVertical
          ? `0 var(--space-${spacing})`
          : `var(--space-${spacing}) 0`,
        alignSelf: isVertical ? "stretch" : undefined,
        flexShrink: 0,
        ...style,
      }}
      {...props}
    />
  );
}
