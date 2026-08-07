import * as React from "react";

/**
 * Action Group (ID 095) — Action & Control Compositions.
 * Flexible semantic grouping of related actions with mixed visual treatment.
 * Unlike Button Group (091), actions need not share identical chrome.
 * Compose Button, Icon Button, Split / Menu triggers — do not invent buttons.
 * Hand off excess secondary actions to Overflow Action via the overflow slot.
 */

export type ActionGroupOrientation = "horizontal" | "vertical" | "responsive";

/**
 * - `wrap` (default) — wrap on narrow / crowded layouts
 * - `nowrap` — single line (host must ensure fit or use overflow slot)
 */
export type ActionGroupFlow = "wrap" | "nowrap";

export type ActionGroupAlign = "start" | "end" | "center" | "between" | "stretch";

export type ActionGroupDensity = "compact" | "standard" | "spacious";

/**
 * Semantic rank for layout hooks only — does not restyle the child control.
 * Primary is emphasized through position and spacing; use Button variants for look.
 */
export type ActionGroupRank =
  | "primary"
  | "secondary"
  | "icon"
  | "menu"
  | "destructive"
  | "neutral";

export type ActionGroupItemProps = {
  children?: React.ReactNode;
  /**
   * When true, the item is omitted from the layout — no empty gap.
   */
  hidden?: boolean;
  rank?: ActionGroupRank;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

export type ActionGroupProps = {
  /**
   * Accessible name for the action set.
   */
  label: string;
  /**
   * Freeform composed actions. Prefer `ActionGroup.Item` / `.Primary` / `.Overflow`.
   */
  children?: React.ReactNode;
  /** Explicit primary slot (rendered first / emphasized). */
  primary?: React.ReactNode;
  /** Secondary actions cluster. */
  actions?: React.ReactNode;
  /**
   * Overflow handoff — compose Overflow Action / Dropdown Menu / Action Menu Trigger.
   * Placed after secondary actions.
   */
  overflow?: React.ReactNode;
  orientation?: ActionGroupOrientation;
  flow?: ActionGroupFlow;
  align?: ActionGroupAlign;
  density?: ActionGroupDensity;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  role?: React.AriaRole;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function displayNameOf(child: React.ReactElement): string | undefined {
  return (child.type as { displayName?: string })?.displayName;
}

export const ActionGroupItem = React.forwardRef<
  HTMLDivElement,
  ActionGroupItemProps
>(function ActionGroupItem(
  {
    children,
    hidden = false,
    rank = "neutral",
    className = "",
    id,
    style,
  },
  forwardedRef
) {
  if (hidden || children == null || children === false) {
    return null;
  }

  return (
    <div
      ref={forwardedRef}
      id={id}
      className={cx(
        "dk-action-group__item",
        `dk-action-group__item--${rank}`,
        className
      )}
      style={style}
      data-rank={rank}
    >
      {children}
    </div>
  );
});

ActionGroupItem.displayName = "ActionGroup.Item";

export const ActionGroupPrimary = React.forwardRef<
  HTMLDivElement,
  Omit<ActionGroupItemProps, "rank">
>(function ActionGroupPrimary(props, ref) {
  return <ActionGroupItem ref={ref} rank="primary" {...props} />;
});

ActionGroupPrimary.displayName = "ActionGroup.Primary";

export const ActionGroupOverflow = React.forwardRef<
  HTMLDivElement,
  Omit<ActionGroupItemProps, "rank">
>(function ActionGroupOverflow(props, ref) {
  return <ActionGroupItem ref={ref} rank="menu" {...props} />;
});

ActionGroupOverflow.displayName = "ActionGroup.Overflow";

const ActionGroupRoot = React.forwardRef<HTMLDivElement, ActionGroupProps>(
  function ActionGroup(
    {
      label,
      children,
      primary,
      actions,
      overflow,
      orientation = "responsive",
      flow = "wrap",
      align = "start",
      density = "standard",
      className = "",
      id,
      style,
      role,
    },
    forwardedRef
  ) {
    const primaryNodes: React.ReactNode[] = [];
    const overflowNodes: React.ReactNode[] = [];
    const otherNodes: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        if (child != null && child !== false) otherNodes.push(child);
        return;
      }
      const name = displayNameOf(child);
      if (name === "ActionGroup.Primary") primaryNodes.push(child);
      else if (name === "ActionGroup.Overflow") overflowNodes.push(child);
      else otherNodes.push(child);
    });

    const hasPrimarySlot = primary != null || primaryNodes.length > 0;
    const hasActionsSlot = actions != null;
    const hasOverflowSlot = overflow != null || overflowNodes.length > 0;
    const hasChildActions = otherNodes.length > 0;

    return (
      <div
        ref={forwardedRef}
        id={id}
        role={role ?? "group"}
        aria-label={label}
        className={cx(
          "dk-action-group",
          `dk-action-group--${orientation}`,
          `dk-action-group--flow-${flow}`,
          `dk-action-group--align-${align}`,
          `dk-action-group--${density}`,
          className
        )}
        style={style}
        data-orientation={orientation}
        data-flow={flow}
        data-align={align}
        data-density={density}
      >
        {hasPrimarySlot ? (
          <div className="dk-action-group__primary">
            {primary != null ? (
              <ActionGroupItem rank="primary">{primary}</ActionGroupItem>
            ) : null}
            {primaryNodes}
          </div>
        ) : null}

        {hasActionsSlot || hasChildActions ? (
          <div className="dk-action-group__actions">
            {actions}
            {otherNodes}
          </div>
        ) : null}

        {hasOverflowSlot ? (
          <div className="dk-action-group__overflow">
            {overflow != null ? (
              <ActionGroupItem rank="menu">{overflow}</ActionGroupItem>
            ) : null}
            {overflowNodes}
          </div>
        ) : null}
      </div>
    );
  }
);

ActionGroupRoot.displayName = "ActionGroup";

export const ActionGroup = Object.assign(ActionGroupRoot, {
  Item: ActionGroupItem,
  Primary: ActionGroupPrimary,
  Overflow: ActionGroupOverflow,
});

export default ActionGroup;
