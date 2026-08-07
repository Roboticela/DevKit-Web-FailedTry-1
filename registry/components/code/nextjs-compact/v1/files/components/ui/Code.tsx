import * as React from "react";

/**
 * Code — short inline technical content (commands, identifiers, shortcuts).
 * Uses global `--font-mono`. No syntax highlighting (that belongs to Code Block).
 * Compact — not a large container. Prefer wrap or scroll over arbitrary breaks.
 */

/**
 * - `inline` — general short code / commands
 * - `identifier` — names/ids where breaks must not alter meaning carelessly
 * - `keyboard` — shortcuts; renders `<kbd>`
 */
export type CodeVariant = "inline" | "identifier" | "keyboard";

/**
 * Long-string behavior.
 * - `wrap` — soft wrap at safe opportunities (default for inline)
 * - `nowrap` — keep on one line (host may clip)
 * - `scroll` — single line with controlled horizontal scroll (when wrap would change meaning)
 */
export type CodeOverflow = "wrap" | "nowrap" | "scroll";

export type CodeAs = "code" | "kbd" | "samp" | "var" | "span";

export type CodeProps = {
  children?: React.ReactNode;
  variant?: CodeVariant;
  overflow?: CodeOverflow;
  /**
   * Element. Default: `kbd` for keyboard variant, otherwise `code`.
   */
  as?: CodeAs;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  title?: string;
  "aria-label"?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function defaultAs(variant: CodeVariant, as: CodeAs | undefined): CodeAs {
  if (as) return as;
  if (variant === "keyboard") return "kbd";
  return "code";
}

function defaultOverflow(
  variant: CodeVariant,
  overflow: CodeOverflow | undefined
): CodeOverflow {
  if (overflow) return overflow;
  if (variant === "identifier") return "scroll";
  return "wrap";
}

export const Code = React.forwardRef<HTMLElement, CodeProps>(function Code(
  {
    children,
    variant = "inline",
    overflow: overflowProp,
    as,
    className = "",
    id,
    style,
    title,
    "aria-label": ariaLabel,
  },
  forwardedRef
) {
  const Tag = defaultAs(variant, as);
  const overflow = defaultOverflow(variant, overflowProp);

  return (
    <Tag
      ref={forwardedRef as React.Ref<HTMLElement>}
      id={id}
      className={cx(
        "dk-code",
        `dk-code--${variant}`,
        `dk-code--overflow-${overflow}`,
        className
      )}
      style={style}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </Tag>
  );
});

Code.displayName = "Code";

export default Code;
