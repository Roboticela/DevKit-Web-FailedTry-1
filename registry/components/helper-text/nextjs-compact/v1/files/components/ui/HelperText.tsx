import * as React from "react";

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span";
  error?: boolean;
}

/** Field helper / hint text. */
export function HelperText({
  as = "p",
  error = false,
  className = "",
  children,
  ...props
}: HelperTextProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={`dk-type-helper ${className}`.trim()}
      style={error ? { color: "var(--color-danger)" } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
