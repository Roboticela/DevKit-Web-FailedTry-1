import * as React from "react";

/**
 * Paragraph — readable body content.
 * Variants map only to existing global typography tokens (standard / lead / secondary).
 * Comfortable line-height; consecutive paragraphs share modest rhythm (no <br> layout).
 * Long-form uses reading measure tokens — not arbitrarily wide on desktop.
 */

/**
 * Visual rank → global body tokens only.
 * Do not invent sizes beyond the token system.
 */
export type ParagraphVariant = "standard" | "lead" | "secondary";

export type ParagraphAlign = "start" | "end" | "center" | "left" | "right";

/**
 * Reading measure for long-form content.
 * `reading` (default) caps width via content-width / reading tokens.
 * `none` fills the parent (e.g. dense UI chrome).
 */
export type ParagraphMeasure = "reading" | "none";

export type ParagraphProps = {
  children?: React.ReactNode;
  /** Body rank. Default `standard`. */
  variant?: ParagraphVariant;
  /**
   * Alignment. Prefer `start` / `end` for RTL.
   * Default `start` — do not force centered layouts.
   */
  align?: ParagraphAlign;
  /**
   * Max line length for long-form. Default `reading`.
   * Uses `--content-width-reading` / `--reading-width` when present.
   */
  measure?: ParagraphMeasure;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  function Paragraph(
    {
      children,
      variant = "standard",
      align = "start",
      measure = "reading",
      className = "",
      id,
      style,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
    },
    forwardedRef
  ) {
    return (
      <p
        ref={forwardedRef}
        id={id}
        className={cx(
          "dk-paragraph",
          `dk-paragraph--${variant}`,
          `dk-paragraph--align-${align}`,
          `dk-paragraph--measure-${measure}`,
          className
        )}
        style={style}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        {children}
      </p>
    );
  }
);

Paragraph.displayName = "Paragraph";

export default Paragraph;
