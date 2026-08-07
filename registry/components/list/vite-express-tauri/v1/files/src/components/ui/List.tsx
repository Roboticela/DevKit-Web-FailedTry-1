import * as React from "react";

/**
 * List — container for ordered or unordered collections of related items.
 * Manages spacing, grouping, optional dividers, density, and selection.
 * Empty states: compose DevKit EmptyState — do not invent a parallel empty UI.
 * Structural Item companion for selection/keyboard; prefer List Item (063) for rich chrome.
 */

export type ListDensity = "compact" | "comfortable" | "spacious";

export type ListSelectionMode = "none" | "single" | "multiple";

/** Visual density of an item’s text block. */
export type ListItemLines = "one" | "two" | "multi";

export type ListDividers = "none" | "between";

type ListContextValue = {
  density: ListDensity;
  selectionMode: ListSelectionMode;
  interactive: boolean;
  dividers: ListDividers;
  selectedKeys: Set<string>;
  toggleKey: (key: string) => void;
  registerItem: (key: string, el: HTMLElement | null) => void;
  getOrderedKeys: () => string[];
  focusKey: (key: string) => void;
  listId: string;
};

const ListContext = React.createContext<ListContextValue | null>(null);

function useListContext(component: string): ListContextValue {
  const ctx = React.useContext(ListContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <List>`);
  }
  return ctx;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toKeySet(
  keys: Iterable<string> | undefined,
  mode: ListSelectionMode
): Set<string> {
  const set = new Set(keys ?? []);
  if (mode === "single" && set.size > 1) {
    const first = set.values().next().value;
    return first != null ? new Set([first]) : new Set();
  }
  if (mode === "none") return new Set();
  return set;
}

export type ListProps = {
  density?: ListDensity;
  /**
   * `none` — informational (default). No selection semantics.
   * `single` / `multiple` — selectable list.
   */
  selectionMode?: ListSelectionMode;
  /** Opt-in interactive styling / keyboard activation without requiring selection. */
  interactive?: boolean;
  /** Ordered list (`ol`) vs unordered (`ul`). Default: unordered. */
  ordered?: boolean;
  /** Dividers between adjacent items. Default: none — never forced. */
  dividers?: ListDividers;
  selectedKeys?: Iterable<string>;
  defaultSelectedKeys?: Iterable<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  /**
   * When the list has no items, render this (compose EmptyState).
   * Not shown when children are present.
   */
  empty?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function ListRoot(
  {
    density = "comfortable",
    selectionMode = "none",
    interactive: interactiveProp,
    ordered = false,
    dividers = "none",
    selectedKeys: selectedKeysProp,
    defaultSelectedKeys,
    onSelectionChange,
    empty,
    children,
    className = "",
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  }: ListProps,
  forwardedRef: React.ForwardedRef<HTMLElement>
) {
  const reactId = React.useId();
  const listId = id ?? `dk-list-${reactId}`;
  const interactive =
    interactiveProp !== undefined
      ? interactiveProp
      : selectionMode !== "none";

  const isControlled = selectedKeysProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    toKeySet(defaultSelectedKeys, selectionMode)
  );
  const selectedKeys = isControlled
    ? toKeySet(selectedKeysProp, selectionMode)
    : uncontrolled;

  const setSelectedKeys = React.useCallback(
    (next: Set<string>) => {
      const normalized = toKeySet(next, selectionMode);
      if (!isControlled) setUncontrolled(normalized);
      onSelectionChange?.(normalized);
    },
    [isControlled, onSelectionChange, selectionMode]
  );

  const toggleKey = React.useCallback(
    (key: string) => {
      if (selectionMode === "none") return;
      const next = new Set(selectedKeys);
      if (selectionMode === "single") {
        if (next.has(key)) next.clear();
        else {
          next.clear();
          next.add(key);
        }
      } else if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      setSelectedKeys(next);
    },
    [selectionMode, selectedKeys, setSelectedKeys]
  );

  const itemsRef = React.useRef<Map<string, HTMLElement>>(new Map());
  const orderRef = React.useRef<string[]>([]);

  const registerItem = React.useCallback(
    (key: string, el: HTMLElement | null) => {
      if (el) {
        itemsRef.current.set(key, el);
        if (!orderRef.current.includes(key)) {
          orderRef.current = [...orderRef.current, key];
        }
      } else {
        itemsRef.current.delete(key);
        orderRef.current = orderRef.current.filter((k) => k !== key);
      }
    },
    []
  );

  const getOrderedKeys = React.useCallback(
    () => orderRef.current.filter((k) => itemsRef.current.has(k)),
    []
  );

  const focusKey = React.useCallback((key: string) => {
    itemsRef.current.get(key)?.focus();
  }, []);

  const ctx = React.useMemo<ListContextValue>(
    () => ({
      density,
      selectionMode,
      interactive,
      dividers,
      selectedKeys,
      toggleKey,
      registerItem,
      getOrderedKeys,
      focusKey,
      listId,
    }),
    [
      density,
      selectionMode,
      interactive,
      dividers,
      selectedKeys,
      toggleKey,
      registerItem,
      getOrderedKeys,
      focusKey,
      listId,
    ]
  );

  const childArray = React.Children.toArray(children).filter(Boolean);
  const isEmpty = childArray.length === 0;
  const ListTag = ordered ? "ol" : "ul";

  const role =
    selectionMode !== "none"
      ? "listbox"
      : interactive
        ? "list"
        : undefined;

  return (
    <ListContext.Provider value={ctx}>
      <div
        className={cx("dk-list-root", `dk-list-root--${density}`, className)}
        data-density={density}
        data-selection={selectionMode}
      >
        {isEmpty ? (
          <div className="dk-list__empty">{empty ?? null}</div>
        ) : (
          <ListTag
            ref={forwardedRef as React.Ref<HTMLOListElement & HTMLUListElement>}
            id={listId}
            className={cx(
              "dk-list",
              `dk-list--${density}`,
              dividers === "between" && "dk-list--dividers",
              interactive && "dk-list--interactive",
              selectionMode !== "none" && "dk-list--selectable"
            )}
            role={role}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-multiselectable={
              selectionMode === "multiple" ? true : undefined
            }
          >
            {children}
          </ListTag>
        )}
      </div>
    </ListContext.Provider>
  );
}

const ListForward = React.forwardRef(ListRoot);
ListForward.displayName = "List";

/* ——— Group ——— */

export type ListGroupProps = {
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
};

function ListGroup({ label, children, className = "", id }: ListGroupProps) {
  const ctx = useListContext("List.Group");
  const reactId = React.useId();
  const labelId = id ?? `${ctx.listId}-group-${reactId}`;

  return (
    <li className={cx("dk-list__group", className)} role="presentation">
      {label != null ? (
        <div className="dk-list__group-label" id={labelId}>
          {label}
        </div>
      ) : null}
      <ul
        className="dk-list__group-items"
        role="group"
        aria-labelledby={label != null ? labelId : undefined}
      >
        {children}
      </ul>
    </li>
  );
}
ListGroup.displayName = "List.Group";

/* ——— Divider ——— */

export type ListDividerProps = {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

function ListDivider({
  className = "",
  "aria-hidden": ariaHidden = true,
}: ListDividerProps) {
  return (
    <li
      className={cx("dk-list__divider", className)}
      role="separator"
      aria-hidden={ariaHidden}
    />
  );
}
ListDivider.displayName = "List.Divider";

/* ——— Item ——— */

export type ListItemProps = {
  /** Stable selection / focus key. Required for selectable or interactive lists. */
  itemKey?: string;
  lines?: ListItemLines;
  selected?: boolean;
  disabled?: boolean;
  /** Leading content (icon, avatar, control). Compose existing primitives. */
  leading?: React.ReactNode;
  /** Trailing content (meta, chevron, actions). */
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  id?: string;
};

function ListItem({
  itemKey,
  lines = "one",
  selected: selectedProp,
  disabled = false,
  leading,
  trailing,
  children,
  className = "",
  onClick,
  href,
  id,
}: ListItemProps) {
  const ctx = useListContext("List.Item");
  const reactId = React.useId();
  const key = itemKey ?? id ?? reactId;
  const selected =
    selectedProp !== undefined ? selectedProp : ctx.selectedKeys.has(key);

  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    ctx.registerItem(key, disabled ? null : ref.current);
    return () => ctx.registerItem(key, null);
  }, [ctx, key, disabled]);

  const isSelectable = ctx.selectionMode !== "none";
  const isInteractive = ctx.interactive && !disabled;

  const activate = (event: React.SyntheticEvent) => {
    if (disabled) return;
    if (isSelectable) {
      event.preventDefault();
      ctx.toggleKey(key);
    }
    onClick?.(event as React.MouseEvent<HTMLElement>);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (disabled || !ctx.interactive) return;
    const keys = ctx.getOrderedKeys();
    const index = keys.indexOf(key);
    if (index < 0) return;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const next = keys[Math.min(keys.length - 1, index + 1)];
        if (next) ctx.focusKey(next);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prev = keys[Math.max(0, index - 1)];
        if (prev) ctx.focusKey(prev);
        break;
      }
      case "Home": {
        event.preventDefault();
        if (keys[0]) ctx.focusKey(keys[0]);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = keys[keys.length - 1];
        if (last) ctx.focusKey(last);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        activate(event);
        break;
      }
      default:
        break;
    }
  };

  const classNames = cx(
    "dk-list__item",
    `dk-list__item--${lines}`,
    `dk-list__item--${ctx.density}`,
    selected && "dk-list__item--selected",
    disabled && "dk-list__item--disabled",
    isInteractive && "dk-list__item--interactive",
    className
  );

  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  const body = (
    <>
      {leading != null ? (
        <div className="dk-list__item-leading">{leading}</div>
      ) : null}
      <div className="dk-list__item-main">{children}</div>
      {trailing != null ? (
        <div className="dk-list__item-trailing">{trailing}</div>
      ) : null}
    </>
  );

  const itemRole =
    ctx.selectionMode !== "none"
      ? "option"
      : isInteractive
        ? "listitem"
        : undefined;

  if (href && !disabled) {
    return (
      <li className="dk-list__item-wrap" role="none">
        <a
          ref={setRef as React.Ref<HTMLAnchorElement>}
          id={id}
          href={href}
          className={classNames}
          role={itemRole === "option" ? "option" : undefined}
          aria-selected={isSelectable ? selected : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={isInteractive ? 0 : undefined}
          data-key={key}
          onClick={activate}
          onKeyDown={onKeyDown}
        >
          {body}
        </a>
      </li>
    );
  }

  return (
    <li
      ref={setRef as React.Ref<HTMLLIElement>}
      id={id}
      className={classNames}
      role={itemRole}
      aria-selected={isSelectable ? selected : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={isInteractive ? 0 : undefined}
      data-key={key}
      onClick={isInteractive || isSelectable ? activate : onClick}
      onKeyDown={onKeyDown}
    >
      {body}
    </li>
  );
}
ListItem.displayName = "List.Item";

/* ——— Item text slots ——— */

export type ListItemTextProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

function ListItemLabel({
  className = "",
  children,
  ...rest
}: ListItemTextProps) {
  return (
    <div className={cx("dk-list__item-label", className)} {...rest}>
      {children}
    </div>
  );
}
ListItemLabel.displayName = "List.ItemLabel";

function ListItemDescription({
  className = "",
  children,
  ...rest
}: ListItemTextProps) {
  return (
    <div className={cx("dk-list__item-description", className)} {...rest}>
      {children}
    </div>
  );
}
ListItemDescription.displayName = "List.ItemDescription";

export const List = Object.assign(ListForward, {
  Group: ListGroup,
  Divider: ListDivider,
  Item: ListItem,
  ItemLabel: ListItemLabel,
  ItemDescription: ListItemDescription,
});

export default List;
