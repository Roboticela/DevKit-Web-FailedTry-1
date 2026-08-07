import * as React from "react";

/**
 * Nav Item — primary navigation primitive.
 * Icon + label + optional description/badge slots. Compose Badge via `badge`.
 */

export type NavItemSize = "sm" | "md" | "lg";
export type NavItemDensity = "compact" | "standard" | "comfortable";

export type NavItemProps = {
  /** Visible label (required for text items). */
  label: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** Compose registry Badge. */
  badge?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  current?: boolean;
  selected?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  external?: boolean;
  size?: NavItemSize;
  density?: NavItemDensity;
  /** Icon-only — `label` remains accessible name. */
  iconOnly?: boolean;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const NavItem = React.forwardRef<HTMLElement, NavItemProps>(function NavItem(
  {
    label,
    description,
    icon,
    badge,
    href,
    target,
    rel,
    onClick,
    current = false,
    selected = false,
    disabled = false,
    expanded,
    external = false,
    size = "md",
    density = "standard",
    iconOnly = false,
    className = "",
    id,
  },
  ref
) {
  const classNames = cx(
    "dk-nav-item",
    `dk-nav-item--${size}`,
    `dk-nav-item--density-${density}`,
    current && "dk-nav-item--current",
    selected && "dk-nav-item--selected",
    disabled && "dk-nav-item--disabled",
    iconOnly && "dk-nav-item--icon-only",
    className
  );

  const body = (
    <>
      {icon ? <span className="dk-nav-item__icon" aria-hidden="true">{icon}</span> : null}
      {!iconOnly ? (
        <span className="dk-nav-item__text">
          <span className="dk-nav-item__label">{label}</span>
          {description ? <span className="dk-nav-item__description">{description}</span> : null}
        </span>
      ) : null}
      {badge ? <span className="dk-nav-item__badge">{badge}</span> : null}
      {external ? (
        <span className="dk-nav-item__external" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none">
            <path
              d="M6.5 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V9.5M9.5 2.5h4v4M13.5 2.5 7 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </>
  );

  const a11y = {
    id,
    "aria-current": current ? ("page" as const) : undefined,
    "aria-selected": selected || undefined,
    "aria-expanded": expanded,
    "aria-disabled": disabled || undefined,
    "aria-label": iconOnly ? label : undefined,
  };

  if (href && !disabled) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel ?? (external || target === "_blank" ? "noopener noreferrer" : undefined)}
        className={classNames}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
        {...a11y}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={classNames}
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement> | undefined}
      {...a11y}
    >
      {body}
    </button>
  );
});

NavItem.displayName = "NavItem";
export default NavItem;
