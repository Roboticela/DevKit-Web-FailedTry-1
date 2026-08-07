import * as React from "react";

/**
 * Data Row — structured horizontal representation of related fields.
 * For detail views, records, metadata — not a complete table row.
 * Desktop: aligned label/value columns. Narrow: stacked label/value pairs.
 */

export type DataRowDensity = "compact" | "comfortable" | "spacious";

/**
 * `responsive` — horizontal from tablet up; stacked label/value on narrow screens.
 * `horizontal` — always columns (may scroll inline if needed).
 * `stacked` — always vertical pairs.
 */
export type DataRowLayout = "responsive" | "horizontal" | "stacked";

export type DataRowValueAlign = "start" | "end" | "center";

/** Hints overflow + numeric alignment without forcing truncation. */
export type DataRowValueType =
  | "text"
  | "number"
  | "date"
  | "email"
  | "url"
  | "id";

export type DataRowProps = {
  density?: DataRowDensity;
  layout?: DataRowLayout;
  /** Hairlines between fields. Default: false. */
  dividers?: boolean;
  /**
   * Opt-in row interactivity. Hover styles apply only when interactive.
   */
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  onActivate?: (event: React.SyntheticEvent) => void;
  /**
   * When trailing actions are independent controls, keep the row host
   * from becoming a single button/link.
   */
  hasTrailingActions?: boolean;
  leading?: React.ReactNode;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export type DataRowFieldProps = {
  label: React.ReactNode;
  value?: React.ReactNode;
  children?: React.ReactNode;
  valueType?: DataRowValueType;
  valueAlign?: DataRowValueAlign;
  /**
   * Overflow strategy for long values.
   * `wrap` (default) — wrap; never force-hide important content.
   * `clip` — single-line ellipsis only when explicitly requested.
   */
  overflow?: "wrap" | "clip";
  className?: string;
  id?: string;
};

export type DataRowRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function defaultAlign(type: DataRowValueType | undefined): DataRowValueAlign {
  if (type === "number") return "end";
  return "start";
}

const DataRowHost = React.forwardRef<
  HTMLElement,
  DataRowProps &
    Omit<
      React.HTMLAttributes<HTMLElement>,
      "children" | "className" | "id" | "onClick"
    > & { children: React.ReactNode }
>(function DataRowHost(
  {
    density = "comfortable",
    layout = "responsive",
    dividers = false,
    interactive = false,
    selected = false,
    disabled = false,
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
    onKeyDown,
    leading: _l,
    status: _s,
    actions: _a,
    ...rest
  },
  forwardedRef
) {
  void _l;
  void _s;
  void _a;

  const wholeRowInteractive =
    interactive &&
    !disabled &&
    !hasTrailingActions &&
    (href != null || onActivate != null);
  const isLink = Boolean(href) && !disabled && !hasTrailingActions;

  const classNames = cx(
    "dk-data-row",
    `dk-data-row--${density}`,
    `dk-data-row--${layout}`,
    dividers && "dk-data-row--dividers",
    interactive && !disabled && "dk-data-row--interactive",
    wholeRowInteractive && "dk-data-row--pressable",
    hasTrailingActions && "dk-data-row--split",
    selected && "dk-data-row--selected",
    disabled && "dk-data-row--disabled",
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
    "aria-disabled": disabled || undefined,
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
});
DataRowHost.displayName = "DataRowHost";

function DataRowField({
  label,
  value,
  children,
  valueType = "text",
  valueAlign,
  overflow = "wrap",
  className = "",
  id,
}: DataRowFieldProps) {
  const reactId = React.useId();
  const labelId = id ? `${id}-label` : `${reactId}-label`;
  const align = valueAlign ?? defaultAlign(valueType);
  const content = children ?? value;

  return (
    <div
      className={cx(
        "dk-data-row__field",
        `dk-data-row__field--${valueType}`,
        `dk-data-row__field--align-${align}`,
        `dk-data-row__field--overflow-${overflow}`,
        className
      )}
      id={id}
    >
      <div className="dk-data-row__label" id={labelId}>
        {label}
      </div>
      <div
        className="dk-data-row__value"
        aria-labelledby={labelId}
        data-value-type={valueType}
      >
        {content}
      </div>
    </div>
  );
}
DataRowField.displayName = "DataRow.Field";

function DataRowLeading({ className = "", children, ...rest }: DataRowRegionProps) {
  return (
    <div className={cx("dk-data-row__leading", className)} {...rest}>
      {children}
    </div>
  );
}
DataRowLeading.displayName = "DataRow.Leading";

function DataRowStatus({ className = "", children, ...rest }: DataRowRegionProps) {
  return (
    <div className={cx("dk-data-row__status", className)} {...rest}>
      {children}
    </div>
  );
}
DataRowStatus.displayName = "DataRow.Status";

function DataRowActions({ className = "", children, ...rest }: DataRowRegionProps) {
  return (
    <div
      className={cx("dk-data-row__actions", className)}
      data-dk-data-row-actions=""
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      {...rest}
    >
      {children}
    </div>
  );
}
DataRowActions.displayName = "DataRow.Actions";

function DataRowFields({ className = "", children, ...rest }: DataRowRegionProps) {
  return (
    <div className={cx("dk-data-row__fields", className)} {...rest}>
      {children}
    </div>
  );
}
DataRowFields.displayName = "DataRow.Fields";

function displayNameOf(child: React.ReactElement): string | undefined {
  return (child.type as { displayName?: string })?.displayName;
}

function DataRowRoot(
  props: DataRowProps &
    Omit<
      React.HTMLAttributes<HTMLElement>,
      "children" | "className" | "id" | "onClick"
    >,
  forwardedRef: React.ForwardedRef<HTMLElement>
) {
  const {
    leading,
    status,
    actions,
    children,
    hasTrailingActions,
    interactive,
    ...rest
  } = props;

  const leadingNodes: React.ReactNode[] = [];
  const statusNodes: React.ReactNode[] = [];
  const actionNodes: React.ReactNode[] = [];
  const fieldNodes: React.ReactNode[] = [];
  const otherNodes: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      otherNodes.push(child);
      return;
    }
    const name = displayNameOf(child);
    if (name === "DataRow.Leading") leadingNodes.push(child);
    else if (name === "DataRow.Status") statusNodes.push(child);
    else if (name === "DataRow.Actions") actionNodes.push(child);
    else if (name === "DataRow.Fields") fieldNodes.push(child);
    else if (name === "DataRow.Field") fieldNodes.push(child);
    else otherNodes.push(child);
  });

  const hasActions = actionNodes.length > 0 || actions != null;
  const split =
    hasTrailingActions ?? (hasActions && interactive === true);

  const fieldsContent =
    fieldNodes.length > 0 ? (
      fieldNodes.some(
        (n) =>
          React.isValidElement(n) && displayNameOf(n) === "DataRow.Fields"
      ) ? (
        fieldNodes
      ) : (
        <div className="dk-data-row__fields">{fieldNodes}</div>
      )
    ) : otherNodes.length > 0 ? (
      <div className="dk-data-row__fields">{otherNodes}</div>
    ) : null;

  return (
    <DataRowHost
      ref={forwardedRef}
      interactive={interactive}
      hasTrailingActions={Boolean(split)}
      {...rest}
    >
      {leadingNodes.length > 0
        ? leadingNodes
        : leading != null
          ? <div className="dk-data-row__leading">{leading}</div>
          : null}

      {fieldsContent}

      {statusNodes.length > 0
        ? statusNodes
        : status != null
          ? <div className="dk-data-row__status">{status}</div>
          : null}

      {actionNodes.length > 0
        ? actionNodes
        : actions != null
          ? (
            <div
              className="dk-data-row__actions"
              data-dk-data-row-actions=""
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {actions}
            </div>
          )
          : null}
    </DataRowHost>
  );
}

const DataRowForward = React.forwardRef(DataRowRoot);
DataRowForward.displayName = "DataRow";

export const DataRow = Object.assign(DataRowForward, {
  Field: DataRowField,
  Fields: DataRowFields,
  Leading: DataRowLeading,
  Status: DataRowStatus,
  Actions: DataRowActions,
});

export default DataRow;
