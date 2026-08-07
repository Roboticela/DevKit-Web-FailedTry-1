import * as React from "react";

/**
 * Divider — subtle structural separation between content groups.
 * Not decorative. Prefer spacing when it communicates grouping adequately.
 * Vertical dividers stretch with neighboring content — no fixed height.
 */

export type DividerOrientation = "horizontal" | "vertical";

/**
 * `full` — edge to edge of the container.
 * `inset` — indented from both inline edges.
 * `section` — full width with section spacing (larger block margin).
 * `content` — aligns with typical content padding (content-aligned).
 */
export type DividerVariant = "full" | "inset" | "section" | "content";

export type DividerProps = {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  /**
   * When true, exposes `role="separator"` for a meaningful section boundary.
   * When false (default), treated as decorative (`aria-hidden`).
   */
  semantic?: boolean;
  /** Accessible name when `semantic` — localize in the host app. */
  "aria-label"?: string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  function Divider(
    {
      orientation = "horizontal",
      variant = "full",
      semantic = false,
      "aria-label": ariaLabel,
      className = "",
      id,
      style,
    },
    forwardedRef
  ) {
    const isVertical = orientation === "vertical";

    return (
      <hr
        ref={forwardedRef}
        id={id}
        className={cx(
          "dk-divider",
          `dk-divider--${orientation}`,
          `dk-divider--${variant}`,
          className
        )}
        data-orientation={orientation}
        data-variant={variant}
        // Native <hr> is horizontal in HTML semantics; override for vertical.
        aria-orientation={isVertical ? "vertical" : "horizontal"}
        aria-hidden={semantic ? undefined : true}
        role={semantic ? "separator" : "presentation"}
        aria-label={semantic ? ariaLabel : undefined}
        style={style}
      />
    );
  }
);

Divider.displayName = "Divider";

export default Divider;
