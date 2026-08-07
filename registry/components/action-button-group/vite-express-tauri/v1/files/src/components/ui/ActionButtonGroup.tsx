import * as React from "react";

/**
 * Button Group (ID 091) — Action & Control Compositions.
 * Clusters related text/icon actions. Compose DevKit Button (001) — do not restyle buttons.
 * Each child keeps independent semantics, focus, and disabled state.
 * Prefer Action Group / Overflow Action when the set grows large (4+).
 * Not a single merged control — visual grouping only.
 */

export type ActionButtonGroupOrientation = "horizontal" | "vertical";

export type ActionButtonGroupDensity = "compact" | "standard";

/**
 * Narrow / overflow behavior. Default `wrap`.
 * Prefer `wrap` or `stack` for ordinary actions — do not force horizontal scrolling.
 */
export type ActionButtonGroupOverflow = "wrap" | "stack";

/**
 * Visual clustering.
 * - `joined` — shared edge (related cluster)
 * - `separated` — clear gap while still grouped
 */
export type ActionButtonGroupSeparation = "joined" | "separated";

export type ActionButtonGroupProps = {
  /**
   * Accessible name for the group. Required — announces related actions as a set
   * without merging them into one control.
   */
  label: string;
  children: React.ReactNode;
  orientation?: ActionButtonGroupOrientation;
  density?: ActionButtonGroupDensity;
  overflow?: ActionButtonGroupOverflow;
  separation?: ActionButtonGroupSeparation;
  /** Stretch children to equal flex basis. */
  equalWidth?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  role?: React.AriaRole;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const ActionButtonGroup = React.forwardRef<
  HTMLDivElement,
  ActionButtonGroupProps
>(function ActionButtonGroup(
  {
    label,
    children,
    orientation = "horizontal",
    density = "standard",
    overflow = "wrap",
    separation = "joined",
    equalWidth = false,
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
        "dk-ac-button-group",
        `dk-ac-button-group--${orientation}`,
        `dk-ac-button-group--${density}`,
        `dk-ac-button-group--overflow-${overflow}`,
        `dk-ac-button-group--${separation}`,
        equalWidth && "dk-ac-button-group--equal",
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

ActionButtonGroup.displayName = "ActionButtonGroup";

/** Catalog / docs alias — same component as ActionButtonGroup. */
export const ButtonGroup = ActionButtonGroup;

export default ActionButtonGroup;
