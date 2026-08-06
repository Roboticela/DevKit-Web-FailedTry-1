import * as React from "react";

export type IconSize = "sm" | "md" | "lg" | "xl";

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: IconSize;
  label?: string;
  children: React.ReactNode;
}

const SIZE_MAP: Record<IconSize, string> = {
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "2rem",
};

/** Wrapper for SVG icons — consistent size and accessible labeling. */
export function Icon({
  size = "md",
  label,
  children,
  style,
  ...props
}: IconProps) {
  const dim = SIZE_MAP[size];
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : "presentation"}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      style={{
        display: "inline-block",
        flexShrink: 0,
        verticalAlign: "middle",
        color: "currentColor",
        ...style,
      }}
      {...props}
    >
      {children}
    </svg>
  );
}
