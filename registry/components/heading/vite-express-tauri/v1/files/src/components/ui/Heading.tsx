import * as React from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  truncate?: boolean;
  clamp?: 2 | 3;
}

const TAG: Record<HeadingLevel, keyof React.JSX.IntrinsicElements> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

/** Semantic heading levels 1–6 with responsive type tokens. */
export function Heading({
  level = 2,
  truncate = false,
  clamp,
  className = "",
  children,
  ...props
}: HeadingProps) {
  const Tag = TAG[level] as React.ElementType;
  const extras = [
    truncate ? "dk-truncate" : "",
    clamp === 2 ? "dk-line-clamp-2" : "",
    clamp === 3 ? "dk-line-clamp-3" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={`dk-type-h${level} ${extras}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
