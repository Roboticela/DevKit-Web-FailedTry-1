import * as React from "react";

export type ContainerWidth = "default" | "fluid" | "narrow" | "wide";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  as?: keyof React.JSX.IntrinsicElements;
}

const WIDTH: Record<ContainerWidth, string> = {
  default: "dk-container",
  fluid: "dk-container-fluid",
  narrow: "dk-container dk-container-narrow",
  wide: "dk-container dk-container-wide",
};

/** Responsive content container with safe horizontal padding. */
export function Container({
  width = "default",
  as = "div",
  className = "",
  children,
  ...props
}: ContainerProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={`${WIDTH[width]} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
