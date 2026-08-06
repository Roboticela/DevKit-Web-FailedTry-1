import * as React from "react";

export type BorderTone = "default" | "subtle" | "strong" | "none";

export interface BorderProps extends React.HTMLAttributes<HTMLElement> {
  tone?: BorderTone;
  /** Only top / bottom / x / y edges */
  edge?: "all" | "t" | "b" | "x" | "y";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "card" | "full";
  as?: keyof React.JSX.IntrinsicElements;
}

/** Border chrome aligned with Shape System tokens. */
export function Border({
  tone = "subtle",
  edge = "all",
  radius,
  as = "div",
  className = "",
  children,
  ...props
}: BorderProps) {
  const Tag = as as React.ElementType;
  const toneClass =
    tone === "none"
      ? "dk-border-0"
      : tone === "strong"
        ? "dk-border-strong"
        : tone === "default"
          ? "dk-border"
          : "dk-border-subtle";

  const edgeClass =
    edge === "all"
      ? ""
      : edge === "t"
        ? "dk-border-t"
        : edge === "b"
          ? "dk-border-b"
          : edge === "x"
            ? "dk-border-x"
            : "dk-border-y";

  const radiusClass = radius
    ? radius === "card"
      ? "dk-radius-card"
      : `dk-radius-${radius}`
    : "";

  return (
    <Tag className={`${toneClass} ${edgeClass} ${radiusClass} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
