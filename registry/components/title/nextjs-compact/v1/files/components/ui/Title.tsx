import * as React from "react";

export type TitleVariant = "page" | "section";

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: TitleVariant;
  as?: "h1" | "h2" | "h3" | "p";
  truncate?: boolean;
}

const CLASS: Record<TitleVariant, string> = {
  page: "dk-type-page-title",
  section: "dk-type-section-title",
};

const DEFAULT_TAG: Record<TitleVariant, "h1" | "h2"> = {
  page: "h1",
  section: "h2",
};

/** Page title or section title. */
export function Title({
  variant = "page",
  as,
  truncate = false,
  className = "",
  children,
  ...props
}: TitleProps) {
  const Tag = (as ?? DEFAULT_TAG[variant]) as React.ElementType;
  return (
    <Tag
      className={`${CLASS[variant]} ${truncate ? "dk-truncate" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}
