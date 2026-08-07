import * as React from "react";

/**
 * Heading — semantic document hierarchy (h1–h6).
 * Visual size is independent of semantic level — never use level merely for styling.
 * Hierarchy via size, weight, and spacing; color is secondary.
 * Long titles wrap by default — do not clip important headings.
 */

/** Semantic heading level → renders the matching `h1`–`h6`. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Visual size → global typography tokens.
 * Independent of `level`. Prefer restrained sizes — avoid decorative hugeness.
 */
export type HeadingSize = "display" | "title" | "lg" | "md" | "sm" | "xs";

export type HeadingAlign = "start" | "end" | "center" | "left" | "right";

export type HeadingWrap = "wrap" | "balance" | "pretty" | "nowrap";

export type HeadingProps = {
  children?: React.ReactNode;
  /** Semantic level. Default `2`. Choose by document outline, not by look. */
  level?: HeadingLevel;
  /**
   * Visual size. When omitted, a restrained convenience default is derived from
   * `level` — always override when layout needs a different visual rank.
   */
  size?: HeadingSize;
  /** Optional subtitle — muted, smaller; does not replace hierarchy. */
  subtitle?: React.ReactNode;
  /**
   * Alignment. Prefer `start` / `end` for RTL.
   * Default `start` — do not force centered layouts.
   */
  align?: HeadingAlign;
  /**
   * Wrapping. Default `wrap` — long headings wrap naturally.
   * `balance` / `pretty` improve multi-line titles where supported.
   */
  wrap?: HeadingWrap;
  /**
   * Single-line ellipsis. Opt-in only — do not truncate important page titles.
   * Full string exposed via native `title` when truncated.
   */
  truncate?: boolean;
  /**
   * Multi-line clamp (1–3). Opt-in. Prefer wrap for primary headings.
   */
  lineClamp?: 1 | 2 | 3;
  /** Full string for truncated tooltip. Defaults to string children when possible. */
  truncateTitle?: string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

const LEVEL_TAG: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> =
  {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6",
  };

/** Convenience defaults only — override with `size` when visuals must diverge. */
const SIZE_BY_LEVEL: Record<HeadingLevel, HeadingSize> = {
  1: "title",
  2: "lg",
  3: "md",
  4: "sm",
  5: "xs",
  6: "xs",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function resolveTruncateTitle(
  truncate: boolean,
  lineClamp: number | undefined,
  truncateTitle: string | undefined,
  children: React.ReactNode
): string | undefined {
  if (!truncate && lineClamp == null) return undefined;
  if (truncateTitle != null) return truncateTitle;
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  return undefined;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    {
      children,
      level = 2,
      size: sizeProp,
      subtitle,
      align = "start",
      wrap = "wrap",
      truncate = false,
      lineClamp,
      truncateTitle,
      className = "",
      id,
      style,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
    },
    forwardedRef
  ) {
    const size = sizeProp ?? SIZE_BY_LEVEL[level];
    const Tag = LEVEL_TAG[level];
    const titleAttr = resolveTruncateTitle(
      truncate,
      lineClamp,
      truncateTitle,
      children
    );

    const titleClass = cx(
      "dk-heading__title",
      `dk-heading__title--size-${size}`,
      `dk-heading__title--align-${align}`,
      `dk-heading__title--wrap-${wrap}`,
      truncate && "dk-heading__title--truncate",
      lineClamp != null && `dk-heading__title--clamp-${lineClamp}`
    );

    const title = (
      <Tag
        ref={forwardedRef}
        id={id}
        className={subtitle == null ? cx(titleClass, className) : titleClass}
        style={subtitle == null ? style : undefined}
        title={titleAttr}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        {children}
      </Tag>
    );

    if (subtitle == null) {
      return title;
    }

    return (
      <div
        className={cx(
          "dk-heading",
          `dk-heading--align-${align}`,
          className
        )}
        style={style}
      >
        {title}
        <p className="dk-heading__subtitle">{subtitle}</p>
      </div>
    );
  }
);

Heading.displayName = "Heading";

export default Heading;
