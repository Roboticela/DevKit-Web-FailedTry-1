import * as React from "react";

/**
 * Icon Container — controlled visual region for an icon.
 * Optically centered glyph; container stays quiet so the icon leads.
 * Shapes and tones are opt-in — default is transparent + neutral.
 */

export type IconContainerSize = "sm" | "md" | "lg";

export type IconContainerShape =
  | "square"
  | "circle"
  | "rounded"
  | "transparent";

/**
 * Semantic tone — maps to DevKit status/semantic color tokens.
 * Do not pass arbitrary icon colors.
 */
export type IconContainerTone =
  | "neutral"
  | "positive"
  | "warning"
  | "negative"
  | "informational";

export type IconContainerProps = {
  /** Icon node. Prefer a single SVG using `currentColor`. */
  icon?: React.ReactNode;
  /** Alternate icon slot (same as `icon`). */
  children?: React.ReactNode;
  size?: IconContainerSize;
  /**
   * Visual frame. Default `transparent` — do not force colored circles.
   * `rounded` = rounded square.
   */
  shape?: IconContainerShape;
  /** Semantic state / tone. Icons inherit the matching token color. */
  tone?: IconContainerTone;
  /**
   * When true (default), decorative — `aria-hidden`, no SR output.
   * When false, provide `label` / `aria-label` for meaning.
   */
  decorative?: boolean;
  /** Accessible name when not decorative. */
  label?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const IconContainer = React.forwardRef<
  HTMLSpanElement,
  IconContainerProps
>(function IconContainer(
  {
    icon,
    children,
    size = "md",
    shape = "transparent",
    tone = "neutral",
    decorative = true,
    label,
    className = "",
    id,
    "aria-label": ariaLabel,
    ...rest
  },
  forwardedRef
) {
  const glyph = icon ?? children;
  const accessibleName = ariaLabel ?? label;
  const isDecorative = decorative || !accessibleName;

  return (
    <span
      ref={forwardedRef}
      id={id}
      className={cx(
        "dk-icon-container",
        `dk-icon-container--${size}`,
        `dk-icon-container--${shape}`,
        `dk-icon-container--${tone}`,
        className
      )}
      role={isDecorative ? "presentation" : "img"}
      aria-hidden={isDecorative ? true : undefined}
      aria-label={isDecorative ? undefined : accessibleName}
      {...rest}
    >
      <span className="dk-icon-container__glyph" aria-hidden="true">
        {glyph}
      </span>
    </span>
  );
});

IconContainer.displayName = "IconContainer";

export default IconContainer;
