import * as React from "react";

/**
 * List Item — atomic content row for List (062).
 * Regions: leading · primary · secondary · trailing.
 * Primary stays visually dominant. Independent trailing actions keep clicks unambiguous.
 */

export type ListItemDensity = "compact" | "comfortable" | "spacious";

export type ListItemLines = "one" | "two" | "multi";

export type ListItemProps = {
  density?: ListItemDensity;
  lines?: ListItemLines;
  /**
   * Whole-row interactivity. Use with `href` or `onActivate`.
   * When trailing has independent actions, set `hasTrailingActions`
   * and put navigation on `ListItem.Title` instead of the row host.
   */
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  itemKey?: string;
  /** Whole-row link (`<a>`). Do not nest buttons inside. */
  href?: string;
  target?: string;
  rel?: string;
  onActivate?: (event: React.SyntheticEvent) => void;
  /**
   * Trailing region has independent controls.
   * Row host will not be a single button/link.
   */
  hasTrailingActions?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

export type ListItemRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export type ListItemTitleProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  as?: "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type HostProps = ListItemProps &
  Omit<
    React.HTMLAttributes<HTMLElement>,
    "children" | "className" | "id" | "onClick"
  > & {
    children: React.ReactNode;
  };

const ListItemHost = React.forwardRef<HTMLElement, HostProps>(
  function ListItemHost(
    {
      density = "comfortable",
      lines = "one",
      interactive = false,
      selected = false,
      disabled = false,
      itemKey,
      href,
      target,
      rel,
      onActivate,
      hasTrailingActions = false,
      children,
      className = "",
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      onKeyDown,
      leading: _leading,
      trailing: _trailing,
      ...rest
    },
    forwardedRef
  ) {
    void _leading;
    void _trailing;

    const wholeRowInteractive =
      interactive &&
      !disabled &&
      !hasTrailingActions &&
      (href != null || onActivate != null);
    const isLink = Boolean(href) && !disabled && !hasTrailingActions;

    const classNames = cx(
      "dk-list-item",
      `dk-list-item--${density}`,
      `dk-list-item--${lines}`,
      interactive && !disabled && "dk-list-item--interactive",
      wholeRowInteractive && "dk-list-item--pressable",
      hasTrailingActions && "dk-list-item--split",
      selected && "dk-list-item--selected",
      disabled && "dk-list-item--disabled",
      className
    );

    const activate = (event: React.SyntheticEvent) => {
      if (disabled) return;
      onActivate?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled || !wholeRowInteractive || isLink) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate(event);
      }
    };

    const a11y = {
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-disabled": disabled || undefined,
      "data-key": itemKey,
      "data-selected": selected ? "true" : undefined,
    };

    if (isLink) {
      const linkRel =
        rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);
      return (
        <a
          ref={forwardedRef as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={linkRel}
          className={classNames}
          {...a11y}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          onClick={disabled ? (e) => e.preventDefault() : (e) => activate(e)}
        >
          {children}
        </a>
      );
    }

    return (
      <div
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        role={wholeRowInteractive ? "button" : undefined}
        tabIndex={wholeRowInteractive ? 0 : undefined}
        className={classNames}
        {...a11y}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
        onClick={wholeRowInteractive ? (e) => activate(e) : undefined}
        onKeyDown={wholeRowInteractive ? handleKeyDown : onKeyDown}
      >
        {children}
      </div>
    );
  }
);
ListItemHost.displayName = "ListItemHost";

function ListItemLeading({ className = "", children, ...rest }: ListItemRegionProps) {
  return (
    <div className={cx("dk-list-item__leading", className)} {...rest}>
      {children}
    </div>
  );
}
ListItemLeading.displayName = "ListItem.Leading";

function ListItemPrimary({ className = "", children, ...rest }: ListItemRegionProps) {
  return (
    <div className={cx("dk-list-item__primary", className)} {...rest}>
      {children}
    </div>
  );
}
ListItemPrimary.displayName = "ListItem.Primary";

function ListItemSecondary({ className = "", children, ...rest }: ListItemRegionProps) {
  return (
    <div className={cx("dk-list-item__secondary", className)} {...rest}>
      {children}
    </div>
  );
}
ListItemSecondary.displayName = "ListItem.Secondary";

function ListItemTrailing({ className = "", children, ...rest }: ListItemRegionProps) {
  return (
    <div
      className={cx("dk-list-item__trailing", className)}
      data-dk-list-item-trailing=""
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      {...rest}
    >
      {children}
    </div>
  );
}
ListItemTrailing.displayName = "ListItem.Trailing";

function ListItemTitle({
  className = "",
  children,
  as: Tag = "div",
  href,
  onClick,
  ...rest
}: ListItemTitleProps) {
  const inner =
    href != null ? (
      <a className="dk-list-item__title-link" href={href} onClick={onClick}>
        {children}
      </a>
    ) : onClick != null ? (
      <button type="button" className="dk-list-item__title-link" onClick={onClick}>
        {children}
      </button>
    ) : (
      children
    );

  return (
    <Tag className={cx("dk-list-item__title", className)} {...rest}>
      {inner}
    </Tag>
  );
}
ListItemTitle.displayName = "ListItem.Title";

function ListItemLabel({ className = "", children, ...rest }: ListItemRegionProps) {
  return (
    <div className={cx("dk-list-item__label", className)} {...rest}>
      {children}
    </div>
  );
}
ListItemLabel.displayName = "ListItem.Label";

function ListItemDescription({
  className = "",
  children,
  ...rest
}: ListItemRegionProps) {
  return (
    <div className={cx("dk-list-item__description", className)} {...rest}>
      {children}
    </div>
  );
}
ListItemDescription.displayName = "ListItem.Description";

function ListItemMetadata({ className = "", children, ...rest }: ListItemRegionProps) {
  return (
    <div className={cx("dk-list-item__metadata", className)} {...rest}>
      {children}
    </div>
  );
}
ListItemMetadata.displayName = "ListItem.Metadata";

function ListItemTimestamp({
  className = "",
  children,
  ...rest
}: React.TimeHTMLAttributes<HTMLTimeElement> & { children?: React.ReactNode }) {
  return (
    <time className={cx("dk-list-item__timestamp", className)} {...rest}>
      {children}
    </time>
  );
}
ListItemTimestamp.displayName = "ListItem.Timestamp";

function ListItemValue({ className = "", children, ...rest }: ListItemRegionProps) {
  return (
    <div className={cx("dk-list-item__value", className)} {...rest}>
      {children}
    </div>
  );
}
ListItemValue.displayName = "ListItem.Value";

function ListItemAction({ className = "", children, ...rest }: ListItemRegionProps) {
  return (
    <div className={cx("dk-list-item__action", className)} {...rest}>
      {children}
    </div>
  );
}
ListItemAction.displayName = "ListItem.Action";

function ListItemDisclosure({
  className = "",
  label = "More",
  ...rest
}: Omit<ListItemRegionProps, "children"> & { label?: string }) {
  return (
    <span
      className={cx("dk-list-item__disclosure", className)}
      aria-hidden="true"
      title={label}
      {...rest}
    >
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
        <path
          d="M7.5 4.5l5 5.5-5 5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
ListItemDisclosure.displayName = "ListItem.Disclosure";

function displayNameOf(child: React.ReactElement): string | undefined {
  return (child.type as { displayName?: string })?.displayName;
}

function ListItemRoot(
  props: ListItemProps &
    Omit<
      React.HTMLAttributes<HTMLElement>,
      "children" | "className" | "id" | "onClick"
    >,
  forwardedRef: React.ForwardedRef<HTMLElement>
) {
  const { leading, trailing, children, hasTrailingActions, interactive, ...rest } =
    props;

  const leadingNodes: React.ReactNode[] = [];
  const trailingNodes: React.ReactNode[] = [];
  const mainNodes: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      mainNodes.push(child);
      return;
    }
    const name = displayNameOf(child);
    if (name === "ListItem.Leading") leadingNodes.push(child);
    else if (name === "ListItem.Trailing") trailingNodes.push(child);
    else mainNodes.push(child);
  });

  const hasCompoundTrailing = trailingNodes.length > 0;
  const hasPropTrailing = trailing != null;
  const split =
    hasTrailingActions ??
    ((hasCompoundTrailing || hasPropTrailing) && interactive === true);

  return (
    <ListItemHost
      ref={forwardedRef}
      interactive={interactive}
      hasTrailingActions={Boolean(split)}
      {...rest}
    >
      {leadingNodes.length > 0
        ? leadingNodes
        : leading != null
          ? <div className="dk-list-item__leading">{leading}</div>
          : null}
      <div className="dk-list-item__main">{mainNodes}</div>
      {hasCompoundTrailing
        ? trailingNodes
        : trailing != null
          ? (
            <div
              className="dk-list-item__trailing"
              data-dk-list-item-trailing=""
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {trailing}
            </div>
          )
          : null}
    </ListItemHost>
  );
}

const ListItemForward = React.forwardRef(ListItemRoot);
ListItemForward.displayName = "ListItem";

export const ListItem = Object.assign(ListItemForward, {
  Leading: ListItemLeading,
  Primary: ListItemPrimary,
  Secondary: ListItemSecondary,
  Trailing: ListItemTrailing,
  Title: ListItemTitle,
  Label: ListItemLabel,
  Description: ListItemDescription,
  Metadata: ListItemMetadata,
  Timestamp: ListItemTimestamp,
  Value: ListItemValue,
  Action: ListItemAction,
  Disclosure: ListItemDisclosure,
});

export default ListItem;
