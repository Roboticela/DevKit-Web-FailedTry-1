import * as React from "react";

/**
 * Divider — structural separator.
 * Horizontal / vertical / section with optional label.
 */

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "subtle" | "standard" | "strong" | "section";

export type DividerProps = {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  /** Optional center/start label for section dividers. */
  label?: React.ReactNode;
  /** Decorative (default) vs semantic separator. */
  decorative?: boolean;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  {
    orientation = "horizontal",
    variant = "subtle",
    label,
    decorative = true,
    className = "",
    id,
  },
  ref
) {
  return (
    <div
      ref={ref}
      id={id}
      className={cx(
        "dk-divider",
        `dk-divider--${orientation}`,
        `dk-divider--${variant}`,
        label && "dk-divider--labeled",
        className
      )}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
    >
      {label ? <span className="dk-divider__label">{label}</span> : null}
    </div>
  );
});

Divider.displayName = "Divider";
export default Divider;
