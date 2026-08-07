import * as React from "react";

/**
 * Text — fundamental typography primitive.
 * Visual style (size/weight/color) is independent of HTML semantics (`as`).
 * Consumes global typography tokens only — no arbitrary font values.
 * Wraps by default; truncation and transforms are opt-in.
 */

/** Size scale → global font-size tokens. */
export type TextSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

/** Weight → global weight tokens. */
export type TextWeight = "regular" | "medium" | "semibold" | "bold";

/** Color → global text color tokens. */
export type TextColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "inverse"
  | "inherit";

export type TextAlign = "start" | "end" | "center" | "left" | "right";

export type TextDecoration = "none" | "underline" | "line-through";

export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

export type TextWrap = "wrap" | "nowrap" | "balance" | "pretty";

/**
 * Semantic element — choose by meaning, not by visual size.
 * Example: body-looking text may still be `span` inside a heading region.
 */
export type TextAs =
  | "p"
  | "div"
  | "span"
  | "label"
  | "li"
  | "dt"
  | "dd"
  | "figcaption"
  | "blockquote"
  | "strong"
  | "em"
  | "small"
  | "b"
  | "i"
  | "u"
  | "s"
  | "time"
  | "address";

export type TextProps = {
  children?: React.ReactNode;
  /** Visual size token. Default `md` (body). */
  size?: TextSize;
  /** Weight token. Default `regular`. */
  weight?: TextWeight;
  /** Color token. Default `primary`. */
  color?: TextColor;
  /**
   * Text alignment. Prefer `start` / `end` for RTL.
   * `left` / `right` are physical and rarely needed.
   */
  align?: TextAlign;
  /**
   * Wrapping. Default `wrap` — natural wrap.
   * Truncation is separate and opt-in.
   */
  wrap?: TextWrap;
  /**
   * Single-line ellipsis truncation. Opt-in.
   * Full text is exposed via native `title` (and optionally `truncateTitle`).
   */
  truncate?: boolean;
  /**
   * Multi-line clamp (1–6). Opt-in. Takes precedence visually with truncate styles.
   * Full text via `title` when truncated.
   */
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Tooltip / accessible full string when truncated.
   * Defaults to string children when possible.
   */
  truncateTitle?: string;
  decoration?: TextDecoration;
  /** Opt-in only — default `none`. */
  transform?: TextTransform;
  /** HTML element. Independent of visual style. Default `span`. */
  as?: TextAs;
  /** Soft hyphenation for long words/URLs — mild overflow-wrap, not aggressive break-all. */
  breakWords?: boolean;
  className?: string;
  id?: string;
  title?: string;
  style?: React.CSSProperties;
  htmlFor?: string;
  dateTime?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function resolveTitle(
  truncate: boolean,
  lineClamp: number | undefined,
  truncateTitle: string | undefined,
  title: string | undefined,
  children: React.ReactNode
): string | undefined {
  if (title != null) return title;
  const needsFull =
    truncate || (lineClamp != null && lineClamp > 0);
  if (!needsFull) return undefined;
  if (truncateTitle != null) return truncateTitle;
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  return undefined;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  {
    children,
    size = "md",
    weight = "regular",
    color = "primary",
    align,
    wrap = "wrap",
    truncate = false,
    lineClamp,
    truncateTitle,
    decoration = "none",
    transform = "none",
    as: Tag = "span",
    breakWords = false,
    className = "",
    id,
    title,
    style,
    htmlFor,
    dateTime,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-hidden": ariaHidden,
  },
  forwardedRef
) {
  const resolvedTitle = resolveTitle(
    truncate,
    lineClamp,
    truncateTitle,
    title,
    children
  );

  const classNames = cx(
    "dk-text",
    `dk-text--size-${size}`,
    `dk-text--weight-${weight}`,
    `dk-text--color-${color}`,
    align != null && `dk-text--align-${align}`,
    `dk-text--wrap-${wrap}`,
    truncate && "dk-text--truncate",
    lineClamp != null && `dk-text--clamp-${lineClamp}`,
    decoration !== "none" && `dk-text--decoration-${decoration}`,
    transform !== "none" && `dk-text--transform-${transform}`,
    breakWords && "dk-text--break",
    className
  );

  const shared = {
    ref: forwardedRef as React.Ref<HTMLElement>,
    id,
    className: classNames,
    style,
    title: resolvedTitle,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-hidden": ariaHidden,
  };

  if (Tag === "label") {
    return (
      <label {...shared} htmlFor={htmlFor}>
        {children}
      </label>
    );
  }

  if (Tag === "time") {
    return (
      <time {...shared} dateTime={dateTime}>
        {children}
      </time>
    );
  }

  return <Tag {...shared}>{children}</Tag>;
});

Text.displayName = "Text";

export default Text;
