import * as React from "react";

export type TypographyVariant =
  | "display"
  | "heading"
  | "title"
  | "subtitle"
  | "body"
  | "caption"
  | "label"
  | "helper"
  | "code"
  | "numeric";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: keyof React.JSX.IntrinsicElements;
  muted?: boolean;
}

const VARIANT_STYLE: Record<TypographyVariant, React.CSSProperties> = {
  display: {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-display)",
    lineHeight: "var(--leading-tight)",
    fontWeight: "var(--weight-bold)" as unknown as number,
  },
  heading: {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-heading)",
    lineHeight: "var(--leading-tight)",
    fontWeight: "var(--weight-semibold)" as unknown as number,
  },
  title: {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-title)",
    lineHeight: "var(--leading-snug)",
    fontWeight: "var(--weight-semibold)" as unknown as number,
  },
  subtitle: {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-subtitle)",
    lineHeight: "var(--leading-snug)",
    fontWeight: "var(--weight-medium)" as unknown as number,
  },
  body: {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-body)",
    lineHeight: "var(--leading-normal)",
    fontWeight: "var(--weight-regular)" as unknown as number,
  },
  caption: {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-caption)",
    lineHeight: "var(--leading-normal)",
    fontWeight: "var(--weight-regular)" as unknown as number,
  },
  label: {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-label)",
    lineHeight: "var(--leading-snug)",
    fontWeight: "var(--weight-medium)" as unknown as number,
  },
  helper: {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-helper)",
    lineHeight: "var(--leading-normal)",
    fontWeight: "var(--weight-regular)" as unknown as number,
  },
  code: {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-code)",
    lineHeight: "var(--leading-normal)",
    fontWeight: "var(--weight-regular)" as unknown as number,
  },
  numeric: {
    fontFamily: "var(--font-numeric)",
    fontSize: "var(--text-body)",
    lineHeight: "var(--leading-normal)",
    fontWeight: "var(--weight-medium)" as unknown as number,
    fontVariantNumeric: "tabular-nums",
  },
};

const DEFAULT_TAG: Record<TypographyVariant, keyof React.JSX.IntrinsicElements> = {
  display: "h1",
  heading: "h2",
  title: "h3",
  subtitle: "h4",
  body: "p",
  caption: "span",
  label: "span",
  helper: "span",
  code: "code",
  numeric: "span",
};

export function Typography({
  variant = "body",
  as,
  muted = false,
  style,
  children,
  ...props
}: TypographyProps) {
  const Tag = (as ?? DEFAULT_TAG[variant]) as React.ElementType;
  return (
    <Tag
      style={{
        margin: 0,
        color: muted ? "var(--color-text-secondary)" : "var(--color-text)",
        ...VARIANT_STYLE[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
