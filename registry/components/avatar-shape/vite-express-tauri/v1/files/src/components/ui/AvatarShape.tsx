import * as React from "react";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarCorner = "circle" | "square" | "soft";

export interface AvatarShapeProps extends React.HTMLAttributes<HTMLElement> {
  size?: AvatarSize;
  corner?: AvatarCorner;
  src?: string;
  alt?: string;
  initials?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/** Avatar silhouette — circle (default), soft, or square corners. */
export function AvatarShape({
  size = "md",
  corner = "circle",
  src,
  alt = "",
  initials,
  as = "span",
  className = "",
  children,
  ...props
}: AvatarShapeProps) {
  const Tag = as as React.ElementType;
  const cornerClass =
    corner === "square" ? "dk-avatar-square" : corner === "soft" ? "dk-avatar-soft" : "";

  return (
    <Tag
      className={`dk-avatar dk-avatar-${size} ${cornerClass} ${className}`.trim()}
      {...props}
    >
      {src ? <img src={src} alt={alt} /> : children ?? initials ?? null}
    </Tag>
  );
}
