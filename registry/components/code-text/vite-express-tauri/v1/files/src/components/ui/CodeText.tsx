import * as React from "react";

export interface CodeTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "code" | "pre" | "span";
}

/** Inline or block code text. */
export function CodeText({ as = "code", className = "", children, ...props }: CodeTextProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={`dk-type-code ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
