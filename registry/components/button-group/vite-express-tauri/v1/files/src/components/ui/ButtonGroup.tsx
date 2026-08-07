import * as React from "react";

export type ButtonGroupOrientation = "horizontal" | "vertical" | "responsive";

/** `none` = visually joined (0px). `sm` = 8px. `md` = 12px. */
export type ButtonGroupGap = "none" | "sm" | "md";

/**
 * Mobile / narrow behavior when `orientation="responsive"` (also applies when wrapping).
 * - `wrap` — keep horizontal flow, wrap lines
 * - `stack` — switch to vertical column
 * - `scroll` — single row with horizontal overflow
 */
export type ButtonGroupOverflow = "wrap" | "stack" | "scroll";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Layout axis. Desktop default: `horizontal`.
   * `responsive` starts horizontal and adapts under compact widths.
   */
  orientation?: ButtonGroupOrientation;
  /**
   * Spacing between actions.
   * Use `none` only for related, joined actions. Default: `none`.
   */
  gap?: ButtonGroupGap;
  /** Stretch children to equal flex basis. */
  equalWidth?: boolean;
  /**
   * When false (default), children are forced to a consistent visual size via CSS.
   * Set true only when mixed sizes are intentional.
   */
  allowMixedSizes?: boolean;
  /** Compact / overflow strategy. Default: `wrap`. */
  overflow?: ButtonGroupOverflow;
  /**
   * Accessible name for the group (`aria-label`).
   * Required so related actions are announced as a coherent control set.
   */
  label: string;
  children: React.ReactNode;
}

const ORIENTATION_CLASS: Record<ButtonGroupOrientation, string> = {
  horizontal: "dk-button-group--horizontal",
  vertical: "dk-button-group--vertical",
  responsive: "dk-button-group--responsive",
};

const GAP_CLASS: Record<ButtonGroupGap, string> = {
  none: "dk-button-group--gap-none",
  sm: "dk-button-group--gap-sm",
  md: "dk-button-group--gap-md",
};

const OVERFLOW_CLASS: Record<ButtonGroupOverflow, string> = {
  wrap: "dk-button-group--overflow-wrap",
  stack: "dk-button-group--overflow-stack",
  scroll: "dk-button-group--overflow-scroll",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Button Group (ID 003) — coherent set of related actions.
 *
 * Compose with Button (001) and Icon Button (002). Do not group unrelated actions.
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    {
      orientation = "horizontal",
      gap = "none",
      equalWidth = false,
      allowMixedSizes = false,
      overflow = "wrap",
      label,
      className,
      children,
      role,
      ...rest
    },
    ref
  ) {
    const attached = gap === "none";

    return (
      <div
        {...rest}
        ref={ref}
        role={role ?? "group"}
        aria-label={label}
        className={cx(
          "dk-button-group",
          ORIENTATION_CLASS[orientation],
          GAP_CLASS[gap],
          OVERFLOW_CLASS[overflow],
          attached && "dk-button-group--attached",
          equalWidth && "dk-button-group--equal",
          allowMixedSizes && "dk-button-group--mixed-sizes",
          className
        )}
        data-orientation={orientation}
        data-gap={gap}
        data-overflow={overflow}
        data-equal={equalWidth || undefined}
        data-attached={attached || undefined}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

export default ButtonGroup;
