import * as React from "react";

/**
 * Icon Button Group (ID 092) — Action & Control Compositions.
 * Clusters related icon-only actions. Compose DevKit Icon Button (002).
 * Do not invent custom icon-button dimensions — use IconButton size tokens.
 * Every IconButton must supply an accessible `label`.
 * Prefer Overflow Action when the set exceeds a practical count.
 */

export type IconButtonGroupOrientation = "horizontal" | "vertical";

export type IconButtonGroupDensity = "compact" | "standard";

/**
 * Narrow behavior. Default `wrap`.
 * Prefer wrap/stack over crowding or forced horizontal scroll on mobile.
 */
export type IconButtonGroupOverflow = "wrap" | "stack";

/**
 * Visual clustering.
 * - `joined` — shared edge (toolbar cluster)
 * - `separated` — clear gap while still grouped
 */
export type IconButtonGroupSeparation = "joined" | "separated";

export type IconButtonGroupProps = {
  /**
   * Accessible name for the group. Required — announces related icon actions
   * as a set without merging them into one control.
   */
  label: string;
  /**
   * Compose DevKit `IconButton` children. Each must have an accessible `label`.
   * Use `selected` / `disabled` / variants on individual buttons — not the group.
   */
  children: React.ReactNode;
  orientation?: IconButtonGroupOrientation;
  density?: IconButtonGroupDensity;
  overflow?: IconButtonGroupOverflow;
  separation?: IconButtonGroupSeparation;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  role?: React.AriaRole;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const IconButtonGroup = React.forwardRef<
  HTMLDivElement,
  IconButtonGroupProps
>(function IconButtonGroup(
  {
    label,
    children,
    orientation = "horizontal",
    density = "standard",
    overflow = "wrap",
    separation = "joined",
    className = "",
    id,
    style,
    role,
  },
  forwardedRef
) {
  return (
    <div
      ref={forwardedRef}
      id={id}
      role={role ?? "group"}
      aria-label={label}
      className={cx(
        "dk-icon-button-group",
        `dk-icon-button-group--${orientation}`,
        `dk-icon-button-group--${density}`,
        `dk-icon-button-group--overflow-${overflow}`,
        `dk-icon-button-group--${separation}`,
        className
      )}
      style={style}
      data-orientation={orientation}
      data-density={density}
      data-overflow={overflow}
      data-separation={separation}
    >
      {children}
    </div>
  );
});

IconButtonGroup.displayName = "IconButtonGroup";

export default IconButtonGroup;
