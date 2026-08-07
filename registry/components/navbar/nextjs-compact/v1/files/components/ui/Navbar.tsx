import * as React from "react";

/**
 * Navbar — navigation composition shell.
 * Slot-based: host composes Brand, NavItem, SearchField, IconButton, Avatar, Drawer.
 * No shadows. No gradients. No blur glass.
 */

export type NavbarLayout = "standard" | "minimal" | "split" | "centered" | "compact";
export type NavbarDensity = "compact" | "standard" | "comfortable";
export type NavbarPosition = "static" | "sticky";

export type NavbarProps = {
  /** Brand / identity region (start). */
  brand?: React.ReactNode;
  /** Primary navigation links (center/start depending on layout). */
  primary?: React.ReactNode;
  /** Secondary / utility nav. */
  secondary?: React.ReactNode;
  /** Search control. */
  search?: React.ReactNode;
  /** Action cluster (theme, notifications, CTA). */
  actions?: React.ReactNode;
  /** Account / avatar menu. */
  account?: React.ReactNode;
  /** Mobile menu trigger (shown below md). */
  mobileTrigger?: React.ReactNode;
  /** Optional breadcrumb / context row under the main bar. */
  context?: React.ReactNode;
  layout?: NavbarLayout;
  density?: NavbarDensity;
  position?: NavbarPosition;
  /** Compact chrome after scroll. */
  scrolled?: boolean;
  /** Constrain inner content width. Default true. */
  constrained?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(function Navbar(
  {
    brand,
    primary,
    secondary,
    search,
    actions,
    account,
    mobileTrigger,
    context,
    layout = "standard",
    density = "standard",
    position = "sticky",
    scrolled = false,
    constrained = true,
    className = "",
    id,
    "aria-label": ariaLabel = "Primary",
  },
  ref
) {
  return (
    <header
      ref={ref}
      id={id}
      className={cx(
        "dk-navbar",
        `dk-navbar--${layout}`,
        `dk-navbar--density-${density}`,
        `dk-navbar--${position}`,
        scrolled && "dk-navbar--scrolled",
        constrained && "dk-navbar--constrained",
        className
      )}
    >
      <div className="dk-navbar__bar" role="navigation" aria-label={ariaLabel}>
        <div className="dk-navbar__inner">
          {mobileTrigger ? <div className="dk-navbar__mobile-trigger">{mobileTrigger}</div> : null}
          {brand ? <div className="dk-navbar__brand">{brand}</div> : null}
          {primary ? <div className="dk-navbar__primary">{primary}</div> : null}
          {search ? <div className="dk-navbar__search">{search}</div> : null}
          {secondary ? <div className="dk-navbar__secondary">{secondary}</div> : null}
          {(actions || account) && (
            <div className="dk-navbar__end">
              {actions ? <div className="dk-navbar__actions">{actions}</div> : null}
              {account ? <div className="dk-navbar__account">{account}</div> : null}
            </div>
          )}
        </div>
      </div>
      {context ? <div className="dk-navbar__context">{context}</div> : null}
    </header>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
