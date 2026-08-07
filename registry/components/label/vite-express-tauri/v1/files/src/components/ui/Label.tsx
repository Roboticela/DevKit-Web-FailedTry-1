import * as React from "react";

/**
 * Label — concise identification for controls or content.
 * Identifies (not Caption). Associates with controls via `htmlFor` / wrapping.
 * Required/optional never rely on color alone. Long labels wrap by default.
 */

export type LabelSize = "sm" | "md";

export type LabelAlign = "start" | "end" | "center";

export type LabelProps = {
  children?: React.ReactNode;
  /**
   * Programmatic association with a control id.
   * Prefer this (or wrapping the control) over a visual-only label.
   */
  htmlFor?: string;
  /**
   * Element. Default `label` when `htmlFor` is set; otherwise `span`
   * for content/section identification (not a caption).
   */
  as?: "label" | "span" | "div";
  /**
   * Size → global label / body-sm tokens. Default `md`.
   * Avoids sub-readable caption sizes.
   */
  size?: LabelSize;
  align?: LabelAlign;
  /** Marks the field as required — indicator is not color-only. */
  required?: boolean;
  /** Custom required mark. Default `*`. Hidden from AT; see `requiredText`. */
  requiredIndicator?: React.ReactNode;
  /**
   * Accessible required phrase (screen-reader). Default `"required"`.
   * Also shown visually when `showRequiredLabel` is true.
   */
  requiredText?: string;
  /** Show the required word visibly (in addition to the mark). */
  showRequiredLabel?: boolean;
  /** Show an optional indicator when not required. */
  optional?: boolean;
  /** Visible optional copy. Default `"Optional"`. Localize in the host. */
  optionalLabel?: string;
  disabled?: boolean;
  /** Error context — pairs with invalid controls; not a full error message. */
  error?: boolean;
  /**
   * Visually hide the label while keeping it available to AT.
   * Use when a visible label would be redundant but association is still required.
   */
  visuallyHidden?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Label = React.forwardRef<HTMLElement, LabelProps>(function Label(
  {
    children,
    htmlFor,
    as,
    size = "md",
    align = "start",
    required = false,
    requiredIndicator = "*",
    requiredText = "required",
    showRequiredLabel = false,
    optional = false,
    optionalLabel = "Optional",
    disabled = false,
    error = false,
    visuallyHidden = false,
    className = "",
    id,
    style,
  },
  forwardedRef
) {
  const Tag: "label" | "span" | "div" =
    as ?? (htmlFor != null ? "label" : "span");

  const showOptional = optional && !required;

  const classNames = cx(
    "dk-label",
    `dk-label--${size}`,
    `dk-label--align-${align}`,
    required && "dk-label--required",
    showOptional && "dk-label--optional",
    disabled && "dk-label--disabled",
    error && "dk-label--error",
    visuallyHidden && "dk-label--sr",
    className
  );

  const content = (
    <>
      <span className="dk-label__text">{children}</span>
      {required ? (
        <>
          <span className="dk-label__required-mark" aria-hidden="true">
            {requiredIndicator}
          </span>
          {showRequiredLabel ? (
            <span className="dk-label__required-text">{requiredText}</span>
          ) : (
            <span className="dk-label__sr-only"> ({requiredText})</span>
          )}
        </>
      ) : null}
      {showOptional ? (
        <span className="dk-label__optional">{optionalLabel}</span>
      ) : null}
    </>
  );

  if (Tag === "label") {
    return (
      <label
        ref={forwardedRef as React.Ref<HTMLLabelElement>}
        id={id}
        htmlFor={htmlFor}
        className={classNames}
        style={style}
      >
        {content}
      </label>
    );
  }

  if (Tag === "div") {
    return (
      <div
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        id={id}
        className={classNames}
        style={style}
      >
        {content}
      </div>
    );
  }

  return (
    <span
      ref={forwardedRef as React.Ref<HTMLSpanElement>}
      id={id}
      className={classNames}
      style={style}
    >
      {content}
    </span>
  );
});

Label.displayName = "Label";

export default Label;
