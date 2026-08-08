import * as React from "react";
import {
  Alert,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/nextjs-compact/v1/files/components/ui/Alert";

/**
 * Form — semantic form shell for field composition.
 * Provides labelled regions and optional error summary via Alert.
 * Do not invent ad-hoc form wrappers in feature packages.
 */

export type FormProps = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "title"
> & {
  /** Accessible name for the form. Prefer visible title via Form.Header. */
  "aria-label"?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Form-level error summary (composes Alert). */
  errorSummary?: React.ReactNode;
  errorTitle?: React.ReactNode;
  showErrorSummary?: boolean;
  density?: AlertDensity;
  live?: AlertLive;
  disabled?: boolean;
  loading?: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
};

export type FormRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function FormRoot(
  {
    title,
    description,
    errorSummary,
    errorTitle = "Fix the following",
    showErrorSummary = true,
    density = "standard",
    live = "assertive",
    disabled = false,
    loading = false,
    onSubmit,
    headerSlot,
    footerSlot,
    children,
    className = "",
    id,
    "aria-label": ariaLabel,
    ...rest
  }: FormProps,
  ref: React.ForwardedRef<HTMLFormElement>
) {
  const reactId = React.useId();
  const formId = id ?? `dk-form-${reactId}`;
  const titleId = `${formId}-title`;
  const descId = `${formId}-desc`;
  const errorId = `${formId}-errors`;

  return (
    <form
      {...rest}
      ref={ref}
      id={formId}
      className={cx(
        "dk-form",
        disabled && "dk-form--disabled",
        loading && "dk-form--loading",
        className
      )}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
      aria-labelledby={!ariaLabel && title ? titleId : undefined}
      aria-describedby={[description ? descId : null, errorSummary ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined}
      aria-busy={loading || undefined}
      noValidate={rest.noValidate ?? true}
      onSubmit={(event) => {
        if (disabled || loading) {
          event.preventDefault();
          return;
        }
        onSubmit?.(event);
      }}
    >
      {headerSlot ??
        (title || description ? (
          <div className="dk-form__header">
            {title ? (
              <h2 id={titleId} className="dk-form__title">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descId} className="dk-form__description">
                {description}
              </p>
            ) : null}
          </div>
        ) : null)}

      {showErrorSummary && errorSummary ? (
        <Alert
          id={errorId}
          variant="error"
          density={density}
          live={live}
          title={errorTitle}
          className="dk-form__error-summary"
        >
          {errorSummary}
        </Alert>
      ) : null}

      <div className="dk-form__body">{children}</div>
      {footerSlot}
    </form>
  );
}

const FormForward = React.forwardRef(FormRoot);
FormForward.displayName = "Form";

function FormHeader({ className = "", children, ...rest }: FormRegionProps) {
  return (
    <div className={cx("dk-form__header", className)} {...rest}>
      {children}
    </div>
  );
}
FormHeader.displayName = "Form.Header";

function FormBody({ className = "", children, ...rest }: FormRegionProps) {
  return (
    <div className={cx("dk-form__body", className)} {...rest}>
      {children}
    </div>
  );
}
FormBody.displayName = "Form.Body";

function FormFields({ className = "", children, ...rest }: FormRegionProps) {
  return (
    <div className={cx("dk-form__fields", className)} {...rest}>
      {children}
    </div>
  );
}
FormFields.displayName = "Form.Fields";

function FormActions({ className = "", children, ...rest }: FormRegionProps) {
  return (
    <div className={cx("dk-form__actions", className)} {...rest}>
      {children}
    </div>
  );
}
FormActions.displayName = "Form.Actions";

function FormFooter({ className = "", children, ...rest }: FormRegionProps) {
  return (
    <div className={cx("dk-form__footer", className)} {...rest}>
      {children}
    </div>
  );
}
FormFooter.displayName = "Form.Footer";

export const Form = Object.assign(FormForward, {
  Header: FormHeader,
  Body: FormBody,
  Fields: FormFields,
  Actions: FormActions,
  Footer: FormFooter,
});

export default Form;
