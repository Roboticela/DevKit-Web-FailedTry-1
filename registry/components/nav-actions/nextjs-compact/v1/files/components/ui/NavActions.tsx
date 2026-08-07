import * as React from "react";

/**
 * Nav Actions — spacing cluster for navbar utility items.
 * Compose ThemeToggle, NavItem, Link, IconButton — do not invent controls.
 * No gradients. No box-shadows.
 */

export type NavActionsDensity = "compact" | "standard" | "spacious";
export type NavActionsAlign = "start" | "center" | "end";

export type NavActionsItemProps = {
  children?: React.ReactNode;
  hidden?: boolean;
  className?: string;
  id?: string;
};

export type NavActionsProps = {
  /** Accessible name for the utility group. */
  label: string;
  children?: React.ReactNode;
  density?: NavActionsDensity;
  align?: NavActionsAlign;
  /** On narrow viewports, hide text labels inside NavItem / Link children. */
  collapseLabelsOnMobile?: boolean;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const NavActionsItem = React.forwardRef<HTMLDivElement, NavActionsItemProps>(
  function NavActionsItem({ children, hidden = false, className = "", id }, ref) {
    if (hidden || children == null || children === false) return null;
    return (
      <div ref={ref} id={id} className={cx("dk-nav-actions__item", className)}>
        {children}
      </div>
    );
  }
);

NavActionsItem.displayName = "NavActions.Item";

const NavActionsRoot = React.forwardRef<HTMLDivElement, NavActionsProps>(function NavActions(
  {
    label,
    children,
    density = "standard",
    align = "end",
    collapseLabelsOnMobile = true,
    className = "",
    id,
  },
  ref
) {
  return (
    <div
      ref={ref}
      id={id}
      role="group"
      aria-label={label}
      className={cx(
        "dk-nav-actions",
        `dk-nav-actions--${density}`,
        `dk-nav-actions--align-${align}`,
        collapseLabelsOnMobile && "dk-nav-actions--collapse-mobile",
        className
      )}
    >
      {children}
    </div>
  );
});

NavActionsRoot.displayName = "NavActions";

export const NavActions = Object.assign(NavActionsRoot, {
  Item: NavActionsItem,
});

export default NavActions;
