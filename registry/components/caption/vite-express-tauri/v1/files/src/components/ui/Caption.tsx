import * as React from "react";

/**
 * Caption — secondary explanatory information.
 * Visually secondary to primary content; still readable (not micro-type).
 * Not Label (identifies). Not for primary instructions or sole warning channel.
 * Associate via `id` + host `aria-describedby`, or `as="figcaption"` with media.
 */

export type CaptionMode = "short" | "multiline";

export type CaptionSize = "sm" | "md";

export type CaptionAlign = "start" | "end" | "center";

/**
 * Semantic element for association context.
 * - `figcaption` — image / media figure
 * - `span` / `p` — content, form hint, data block (pair `id` with aria-describedby)
 */
export type CaptionAs = "span" | "p" | "figcaption" | "div";

export type CaptionProps = {
  children?: React.ReactNode;
  /**
   * Layout mode. Default `multiline` — wraps naturally.
   * `short` — compact metadata/timestamps; still wraps if needed unless `truncate`.
   */
  mode?: CaptionMode;
  /**
   * Size → caption / body-sm tokens. Default `md` for readability.
   * Do not drop below the global caption floor.
   */
  size?: CaptionSize;
  align?: CaptionAlign;
  /**
   * Element. Use `figcaption` under a `<figure>`.
   * Default `p` for multiline, `span` for short.
   */
  as?: CaptionAs;
  /**
   * Id for semantic association — host sets `aria-describedby={id}`
   * on image, field, or data block.
   */
  id?: string;
  /**
   * Single-line ellipsis. Opt-in for dense metadata only.
   * Full text via native `title` when truncated.
   */
  truncate?: boolean;
  truncateTitle?: string;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function resolveTitle(
  truncate: boolean,
  truncateTitle: string | undefined,
  children: React.ReactNode
): string | undefined {
  if (!truncate) return undefined;
  if (truncateTitle != null) return truncateTitle;
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  return undefined;
}

export const Caption = React.forwardRef<HTMLElement, CaptionProps>(
  function Caption(
    {
      children,
      mode = "multiline",
      size = "md",
      align = "start",
      as,
      id,
      truncate = false,
      truncateTitle,
      className = "",
      style,
      "aria-label": ariaLabel,
      "aria-hidden": ariaHidden,
    },
    forwardedRef
  ) {
    const Tag: CaptionAs =
      as ?? (mode === "short" ? "span" : "p");

    const titleAttr = resolveTitle(truncate, truncateTitle, children);

    return (
      <Tag
        ref={forwardedRef as React.Ref<HTMLParagraphElement>}
        id={id}
        className={cx(
          "dk-caption",
          `dk-caption--${mode}`,
          `dk-caption--${size}`,
          `dk-caption--align-${align}`,
          truncate && "dk-caption--truncate",
          className
        )}
        style={style}
        title={titleAttr}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      >
        {children}
      </Tag>
    );
  }
);

Caption.displayName = "Caption";

export default Caption;
