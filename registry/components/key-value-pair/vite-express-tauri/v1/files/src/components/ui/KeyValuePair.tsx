import * as React from "react";

/**
 * Key-Value Pair — structured metadata as label + value.
 * Label is visually secondary; value receives stronger hierarchy.
 * Compose actions with DevKit Interaction Controls (e.g. copy IconButton) — no embedded copy button.
 */

export type KeyValuePairOrientation = "horizontal" | "vertical" | "responsive";

export type KeyValuePairDensity = "compact" | "comfortable" | "spacious";

export type KeyValuePairValueType =
  | "text"
  | "multiline"
  | "email"
  | "url"
  | "id"
  | "address"
  | "number"
  | "date";

export type KeyValuePairOverflow = "wrap" | "clip";

export type KeyValuePairProps = {
  label: React.ReactNode;
  value?: React.ReactNode;
  /** Optional supporting text under the value. */
  description?: React.ReactNode;
  /** Optional leading icon (decorative unless named by the host). */
  icon?: React.ReactNode;
  /** Optional status mark — compose Badge / StatusIndicator. */
  status?: React.ReactNode;
  /**
   * Optional action — compose DevKit Button / IconButton (e.g. copy).
   * Do not invent a custom copy control here.
   */
  action?: React.ReactNode;
  /**
   * `responsive` — vertical on narrow; horizontal where space allows (default).
   * `horizontal` — label beside value.
   * `vertical` — label above value.
   */
  orientation?: KeyValuePairOrientation;
  density?: KeyValuePairDensity;
  valueType?: KeyValuePairValueType;
  /**
   * Overflow for long values. Default `wrap` — do not force a single line.
   * Use `clip` only when ellipsis is intentional.
   */
  overflow?: KeyValuePairOverflow;
  children?: React.ReactNode;
  className?: string;
  id?: string;
};

export type KeyValuePairRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const KeyValuePairRoot = React.forwardRef<HTMLDivElement, KeyValuePairProps>(
  function KeyValuePair(
    {
      label,
      value,
      description,
      icon,
      status,
      action,
      orientation = "responsive",
      density = "comfortable",
      valueType = "text",
      overflow = "wrap",
      children,
      className = "",
      id,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const rootId = id ?? `dk-kvp-${reactId}`;
    const labelId = `${rootId}-label`;
    const descId = `${rootId}-desc`;
    const content = children ?? value;

    return (
      <div
        ref={forwardedRef}
        id={rootId}
        className={cx(
          "dk-kvp",
          `dk-kvp--${orientation}`,
          `dk-kvp--${density}`,
          `dk-kvp--${valueType}`,
          `dk-kvp--overflow-${overflow}`,
          className
        )}
        data-orientation={orientation}
        data-value-type={valueType}
      >
        {icon != null ? (
          <div className="dk-kvp__icon" aria-hidden="true">
            {icon}
          </div>
        ) : null}

        <div className="dk-kvp__body">
          <div className="dk-kvp__label" id={labelId}>
            {label}
          </div>

          <div className="dk-kvp__content">
            <div
              className="dk-kvp__value"
              aria-labelledby={labelId}
              aria-describedby={description != null ? descId : undefined}
            >
              {content}
            </div>

            {description != null ? (
              <div className="dk-kvp__description" id={descId}>
                {description}
              </div>
            ) : null}
          </div>
        </div>

        {status != null ? (
          <div className="dk-kvp__status">{status}</div>
        ) : null}

        {action != null ? (
          <div className="dk-kvp__action">{action}</div>
        ) : null}
      </div>
    );
  }
);

KeyValuePairRoot.displayName = "KeyValuePair";

function KeyValuePairLabel({ className = "", children, ...rest }: KeyValuePairRegionProps) {
  return (
    <div className={cx("dk-kvp__label", className)} {...rest}>
      {children}
    </div>
  );
}
KeyValuePairLabel.displayName = "KeyValuePair.Label";

function KeyValuePairValue({ className = "", children, ...rest }: KeyValuePairRegionProps) {
  return (
    <div className={cx("dk-kvp__value", className)} {...rest}>
      {children}
    </div>
  );
}
KeyValuePairValue.displayName = "KeyValuePair.Value";

function KeyValuePairDescription({
  className = "",
  children,
  ...rest
}: KeyValuePairRegionProps) {
  return (
    <div className={cx("dk-kvp__description", className)} {...rest}>
      {children}
    </div>
  );
}
KeyValuePairDescription.displayName = "KeyValuePair.Description";

function KeyValuePairIcon({ className = "", children, ...rest }: KeyValuePairRegionProps) {
  return (
    <div className={cx("dk-kvp__icon", className)} aria-hidden="true" {...rest}>
      {children}
    </div>
  );
}
KeyValuePairIcon.displayName = "KeyValuePair.Icon";

function KeyValuePairStatus({ className = "", children, ...rest }: KeyValuePairRegionProps) {
  return (
    <div className={cx("dk-kvp__status", className)} {...rest}>
      {children}
    </div>
  );
}
KeyValuePairStatus.displayName = "KeyValuePair.Status";

function KeyValuePairAction({ className = "", children, ...rest }: KeyValuePairRegionProps) {
  return (
    <div className={cx("dk-kvp__action", className)} {...rest}>
      {children}
    </div>
  );
}
KeyValuePairAction.displayName = "KeyValuePair.Action";

export const KeyValuePair = Object.assign(KeyValuePairRoot, {
  Label: KeyValuePairLabel,
  Value: KeyValuePairValue,
  Description: KeyValuePairDescription,
  Icon: KeyValuePairIcon,
  Status: KeyValuePairStatus,
  Action: KeyValuePairAction,
});

export default KeyValuePair;
