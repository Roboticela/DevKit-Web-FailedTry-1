import * as React from "react";

export type RadiusScale =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "full"
  | "smooth";

export type RadiusRole =
  | "button"
  | "button-sm"
  | "button-lg"
  | "input"
  | "card"
  | "panel"
  | "container"
  | "modal"
  | "popover"
  | "chip"
  | "badge"
  | "avatar"
  | "avatar-square"
  | "avatar-soft"
  | "image"
  | "tooltip";

export interface RoundedCornerProps extends React.HTMLAttributes<HTMLElement> {
  /** Primitive scale step */
  radius?: RadiusScale;
  /** Semantic role (preferred when matching a component type) */
  semantic?: RadiusRole;
  /** Enables nested-radius context for children using ShapeNested */
  nest?: boolean;
  nestRadius?: "lg" | "xl" | "2xl" | "3xl" | "card" | "container";
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Applies Shape System radius tokens. Prefer `semantic` for buttons/cards/inputs.
 */
export function RoundedCorner({
  radius,
  semantic,
  nest = false,
  nestRadius = "card",
  as = "div",
  className = "",
  children,
  ...props
}: RoundedCornerProps) {
  const Tag = as as React.ElementType;
  const classes = [
    radius ? `dk-radius-${radius}` : "",
    semantic ? `dk-radius-${semantic}` : "",
    nest ? "dk-shape-nest" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={classes}
      data-radius={nest ? nestRadius : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Child of a nested shape — inset radius = parent − padding. */
export function ShapeNested({
  as = "div",
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: keyof React.JSX.IntrinsicElements }) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={`dk-shape-nested ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}

export { RoundedCorner as Shape };
