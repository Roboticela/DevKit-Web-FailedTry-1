import * as React from "react";

/**
 * Action Bar (ID 096) — Action & Control Compositions.
 * Contextual collection of actions — not a complete application toolbar.
 * Compose Button / Icon Button / Action Group / Overflow — do not invent buttons.
 * Sticky positioning is opt-in for consuming layouts; never assumed by default.
 * Primary stays visible unless explicitly hidden.
 */

export type ActionBarDensity = "compact" | "standard";

/**
 * Narrow behavior for secondary actions.
 * - `wrap` (default) — secondary may wrap under primary
 * - `collapse` — hide secondary region on narrow; keep primary + overflow
 */
export type ActionBarNarrow = "wrap" | "collapse";

export type ActionBarRegionProps = {
  children?: React.ReactNode;
  /**
   * When true, omit from layout — no unexplained empty gap.
   */
  hidden?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

export type ActionBarProps = {
  /** Accessible name for the bar (e.g. “Selection actions”). */
  label: string;
  /**
   * Leading contextual information (e.g. “3 items selected”).
   * Visually secondary — must not compete with actions.
   */
  context?: React.ReactNode;
  /** Optional status mark / badge region. */
  status?: React.ReactNode;
  /** Primary action(s) — remain visible unless `hidePrimary`. */
  primary?: React.ReactNode;
  /** Secondary actions. */
  secondary?: React.ReactNode;
  /** Overflow handoff — compose Overflow Action / menu. */
  overflow?: React.ReactNode;
  /**
   * Freeform regions via `ActionBar.Context` / `.Primary` / `.Secondary` /
   * `.Overflow` / `.Status`.
   */
  children?: React.ReactNode;
  density?: ActionBarDensity;
  narrow?: ActionBarNarrow;
  /**
   * Opt-in sticky positioning for consuming layouts.
   * Default false — the component does not assume it is sticky.
   */
  sticky?: boolean;
  /**
   * Explicitly hide the primary region. Default false —
   * do not hide primary without this configuration.
   */
  hidePrimary?: boolean;
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

function Region({
  slot,
  children,
  hidden = false,
  className = "",
  id,
  style,
}: ActionBarRegionProps & { slot: string }) {
  if (hidden || children == null || children === false) return null;
  return (
    <div
      id={id}
      className={cx(`dk-action-bar__${slot}`, className)}
      style={style}
      data-slot={slot}
    >
      {children}
    </div>
  );
}

export const ActionBarContext = React.forwardRef<
  HTMLDivElement,
  ActionBarRegionProps
>(function ActionBarContext(props, _ref) {
  return <Region slot="context" {...props} />;
});
ActionBarContext.displayName = "ActionBar.Context";

export const ActionBarStatus = React.forwardRef<
  HTMLDivElement,
  ActionBarRegionProps
>(function ActionBarStatus(props, _ref) {
  return <Region slot="status" {...props} />;
});
ActionBarStatus.displayName = "ActionBar.Status";

export const ActionBarPrimary = React.forwardRef<
  HTMLDivElement,
  ActionBarRegionProps
>(function ActionBarPrimary(props, _ref) {
  return <Region slot="primary" {...props} />;
});
ActionBarPrimary.displayName = "ActionBar.Primary";

export const ActionBarSecondary = React.forwardRef<
  HTMLDivElement,
  ActionBarRegionProps
>(function ActionBarSecondary(props, _ref) {
  return <Region slot="secondary" {...props} />;
});
ActionBarSecondary.displayName = "ActionBar.Secondary";

export const ActionBarOverflow = React.forwardRef<
  HTMLDivElement,
  ActionBarRegionProps
>(function ActionBarOverflow(props, _ref) {
  return <Region slot="overflow" {...props} />;
});
ActionBarOverflow.displayName = "ActionBar.Overflow";

const ActionBarRoot = React.forwardRef<HTMLElement, ActionBarProps>(
  function ActionBar(
    {
      label,
      context,
      status,
      primary,
      secondary,
      overflow,
      children,
      density = "standard",
      narrow = "wrap",
      sticky = false,
      hidePrimary = false,
      className = "",
      id,
      style,
      role,
    },
    forwardedRef
  ) {
    const contextNodes: React.ReactNode[] = [];
    const statusNodes: React.ReactNode[] = [];
    const primaryNodes: React.ReactNode[] = [];
    const secondaryNodes: React.ReactNode[] = [];
    const overflowNodes: React.ReactNode[] = [];
    const otherNodes: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        if (child != null && child !== false) otherNodes.push(child);
        return;
      }
      const name = displayNameOf(child);
      if (name === "ActionBar.Context") contextNodes.push(child);
      else if (name === "ActionBar.Status") statusNodes.push(child);
      else if (name === "ActionBar.Primary") primaryNodes.push(child);
      else if (name === "ActionBar.Secondary") secondaryNodes.push(child);
      else if (name === "ActionBar.Overflow") overflowNodes.push(child);
      else otherNodes.push(child);
    });

    const showContext = context != null || contextNodes.length > 0;
    const showStatus = status != null || statusNodes.length > 0;
    const showPrimary =
      !hidePrimary && (primary != null || primaryNodes.length > 0);
    const showSecondary = secondary != null || secondaryNodes.length > 0;
    const showOverflow = overflow != null || overflowNodes.length > 0;

    return (
      <section
        ref={forwardedRef as React.Ref<HTMLElement>}
        id={id}
        role={role ?? "region"}
        aria-label={label}
        className={cx(
          "dk-action-bar",
          `dk-action-bar--${density}`,
          `dk-action-bar--narrow-${narrow}`,
          sticky && "dk-action-bar--sticky",
          className
        )}
        style={style}
        data-density={density}
        data-narrow={narrow}
        data-sticky={sticky || undefined}
      >
        {(showContext || showStatus) && (
          <div className="dk-action-bar__meta">
            {showContext ? (
              <div className="dk-action-bar__context">
                {context}
                {contextNodes}
              </div>
            ) : null}
            {showStatus ? (
              <div className="dk-action-bar__status">
                {status}
                {statusNodes}
              </div>
            ) : null}
          </div>
        )}

        <div className="dk-action-bar__actions">
          {showPrimary ? (
            <div className="dk-action-bar__primary">
              {primary}
              {primaryNodes}
            </div>
          ) : null}

          {showSecondary ? (
            <div className="dk-action-bar__secondary">
              {secondary}
              {secondaryNodes}
            </div>
          ) : null}

          {showOverflow ? (
            <div className="dk-action-bar__overflow">
              {overflow}
              {overflowNodes}
            </div>
          ) : null}

          {otherNodes.length > 0 ? (
            <div className="dk-action-bar__extra">{otherNodes}</div>
          ) : null}
        </div>
      </section>
    );
  }
);

ActionBarRoot.displayName = "ActionBar";

export const ActionBar = Object.assign(ActionBarRoot, {
  Context: ActionBarContext,
  Status: ActionBarStatus,
  Primary: ActionBarPrimary,
  Secondary: ActionBarSecondary,
  Overflow: ActionBarOverflow,
});

export default ActionBar;
