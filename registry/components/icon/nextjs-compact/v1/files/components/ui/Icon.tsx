import * as React from "react";

/**
 * Icon — decorative or semantic SVG/mark host.
 * Not a glyph library. Pass SVG as children.
 * No box-shadows. No gradients.
 */

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export type IconProps = {
  children: React.ReactNode;
  size?: IconSize;
  /**
   * When set, the icon is meaningful (`role="img"`).
   * When omitted, treated as decorative (`aria-hidden`).
   */
  label?: string;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { children, size = "md", label, className = "", id },
  ref
) {
  const meaningful = Boolean(label);

  return (
    <span
      ref={ref}
      id={id}
      className={cx("dk-icon", `dk-icon--${size}`, className)}
      data-size={size}
      role={meaningful ? "img" : undefined}
      aria-label={meaningful ? label : undefined}
      aria-hidden={meaningful ? undefined : true}
    >
      {children}
    </span>
  );
});

Icon.displayName = "Icon";
export default Icon;
