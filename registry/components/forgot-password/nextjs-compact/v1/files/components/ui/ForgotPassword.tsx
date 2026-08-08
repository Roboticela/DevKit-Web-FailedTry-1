import * as React from "react";
import {
  Alert,
  type AlertAction,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/nextjs-compact/v1/files/components/ui/Alert";
import { Card, type CardVariant } from "../../../../../../../card/nextjs-compact/v1/files/components/ui/Card";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import {
  TextInput,
  type TextInputSize,
  type TextInputValidation,
} from "../../../../../../../text-input/nextjs-compact/v1/files/components/ui/TextInput";
import {
  ActionSegmentedControl,
  type ActionSegmentedControlSize,
} from "../../../../../../../action-segmented-control/nextjs-compact/v1/files/components/ui/ActionSegmentedControl";

/**
 * Forgot Password — enterprise recovery request form.
 * Composes Text Input (email), Button, Card, and Alert.
 * Method choice uses Action Segmented Control (registry) — do not invent radios.
 */

/** Delivery channel for the recovery challenge. */
export type ForgotPasswordMethod = "reset-link" | "verification-code";

/**
 * - `idle` — ready for input
 * - `loading` — submit in flight
 * - `success` — request accepted
 * - `error` — request failed
 */
export type ForgotPasswordStatus = "idle" | "loading" | "success" | "error";

/**
 * - `stacked` — full card form (default)
 * - `compact` — dense card
 * - `split` — alert in header; form in body
 */
export type ForgotPasswordVariant = "stacked" | "compact" | "split";

export type ForgotPasswordSubmitPayload = {
  email: string;
  method: ForgotPasswordMethod;
};

export type ForgotPasswordProps = {
  variant?: ForgotPasswordVariant;
  cardVariant?: CardVariant;
  status?: ForgotPasswordStatus;
  defaultStatus?: ForgotPasswordStatus;
  onStatusChange?: (status: ForgotPasswordStatus) => void;
  /** Controlled email. */
  email?: string;
  defaultEmail?: string;
  onEmailChange?: (email: string) => void;
  /** Controlled delivery method. */
  method?: ForgotPasswordMethod;
  defaultMethod?: ForgotPasswordMethod;
  onMethodChange?: (method: ForgotPasswordMethod) => void;
  /** Show link vs code chooser. Default: `true`. */
  showMethodChoice?: boolean;
  /** Allowed methods when chooser is shown. */
  methods?: ForgotPasswordMethod[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  emailLabel?: string;
  emailPlaceholder?: string;
  emailHelpText?: string;
  methodLabel?: string;
  submitLabel?: string;
  submitLoadingLabel?: string;
  backLabel?: string;
  successTitle?: React.ReactNode;
  successDescription?: React.ReactNode;
  errorTitle?: React.ReactNode;
  errorMessage?: React.ReactNode;
  /** Host validation override. When set, skips built-in email checks. */
  emailValidation?: TextInputValidation;
  emailErrorMessage?: string;
  /**
   * Called on valid submit.
   * Promise resolve → success; reject → error (message from Error if present).
   */
  onSubmit?: (payload: ForgotPasswordSubmitPayload) => void | Promise<void>;
  onBack?: () => void;
  showBack?: boolean;
  showSuccessAlert?: boolean;
  showErrorAlert?: boolean;
  disableSubmitWhenInvalid?: boolean;
  submitButtonSize?: ButtonSize;
  submitButtonVariant?: ButtonVariant;
  backButtonSize?: ButtonSize;
  backButtonVariant?: ButtonVariant;
  inputSize?: TextInputSize;
  methodControlSize?: ActionSegmentedControlSize;
  density?: AlertDensity;
  live?: AlertLive;
  fullWidth?: boolean;
  disabled?: boolean;
  actions?: AlertAction[];
  actionSlot?: React.ReactNode;
  alertSlot?: React.ReactNode;
  cardSlot?: React.ReactNode;
  emailSlot?: React.ReactNode;
  methodSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="4.75" width="14.5" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6.25 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M8.25 11.25a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5l-1 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11.75 8.75a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.25" y="5.25" width="13.5" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 10h.01M10 10h.01M13.5 10h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="7.25" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.5 10h6.25v2.25M14.25 10v2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M3.5 10.25 16.5 4.5l-4.25 11.25-2.5-4.5-6.25-.999Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9.75 11.25 16.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M11.75 5.5 7.25 10l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 10h8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your email address";
  if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address";
  return null;
}

const METHOD_LABELS: Record<ForgotPasswordMethod, string> = {
  "reset-link": "Reset link",
  "verification-code": "Verification code",
};

export const ForgotPassword = React.forwardRef<HTMLFormElement, ForgotPasswordProps>(
  function ForgotPassword(
    {
      variant = "stacked",
      cardVariant = "outlined",
      status: statusProp,
      defaultStatus = "idle",
      onStatusChange,
      email: emailProp,
      defaultEmail = "",
      onEmailChange,
      method: methodProp,
      defaultMethod = "reset-link",
      onMethodChange,
      showMethodChoice = true,
      methods = ["reset-link", "verification-code"],
      title = "Forgot password",
      description = "Enter the email associated with your account. We’ll send a reset option you can use securely.",
      emailLabel = "Work email",
      emailPlaceholder = "you@company.com",
      emailHelpText = "Use your enterprise email address",
      methodLabel = "How should we reach you?",
      submitLabel = "Send reset instructions",
      submitLoadingLabel = "Sending reset instructions",
      backLabel = "Back to sign in",
      successTitle = "Check your email",
      successDescription,
      errorTitle = "Could not start password reset",
      errorMessage,
      emailValidation: emailValidationProp,
      emailErrorMessage: emailErrorMessageProp,
      onSubmit,
      onBack,
      showBack = true,
      showSuccessAlert = true,
      showErrorAlert = true,
      disableSubmitWhenInvalid = true,
      submitButtonSize = "md",
      submitButtonVariant = "primary",
      backButtonSize = "sm",
      backButtonVariant = "tertiary",
      inputSize = "md",
      methodControlSize = "sm",
      density,
      live,
      fullWidth = true,
      disabled = false,
      actions,
      actionSlot,
      alertSlot,
      cardSlot,
      emailSlot,
      methodSlot,
      actionsSlot,
      icon,
      className = "",
      id,
    },
    ref
  ) {
    const controlledStatus = statusProp !== undefined;
    const controlledEmail = emailProp !== undefined;
    const controlledMethod = methodProp !== undefined;

    const [uncontrolledStatus, setUncontrolledStatus] = React.useState<ForgotPasswordStatus>(defaultStatus);
    const [uncontrolledEmail, setUncontrolledEmail] = React.useState(defaultEmail);
    const [uncontrolledMethod, setUncontrolledMethod] = React.useState<ForgotPasswordMethod>(defaultMethod);
    const [touched, setTouched] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const status = controlledStatus ? statusProp! : uncontrolledStatus;
    const email = controlledEmail ? emailProp! : uncontrolledEmail;
    const method = controlledMethod ? methodProp! : uncontrolledMethod;

    const setStatus = React.useCallback(
      (next: ForgotPasswordStatus) => {
        if (!controlledStatus) setUncontrolledStatus(next);
        onStatusChange?.(next);
      },
      [controlledStatus, onStatusChange]
    );

    const setEmail = React.useCallback(
      (next: string) => {
        if (!controlledEmail) setUncontrolledEmail(next);
        onEmailChange?.(next);
      },
      [controlledEmail, onEmailChange]
    );

    const setMethod = React.useCallback(
      (next: ForgotPasswordMethod) => {
        if (!controlledMethod) setUncontrolledMethod(next);
        onMethodChange?.(next);
      },
      [controlledMethod, onMethodChange]
    );

    const allowedMethods = methods.length > 0 ? methods : (["reset-link"] as ForgotPasswordMethod[]);
    const activeMethod = allowedMethods.includes(method) ? method : allowedMethods[0];

    const builtInError = validateEmail(email);
    const showFieldError = emailValidationProp
      ? emailValidationProp === "error"
      : touched && Boolean(builtInError);
    const fieldValidation: TextInputValidation =
      emailValidationProp ??
      (status === "success" ? "success" : showFieldError ? "error" : "none");
    const fieldErrorMessage =
      emailErrorMessageProp ?? (showFieldError ? builtInError ?? undefined : undefined);

    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";
    const formDisabled = disabled || isLoading || isSuccess;

    const resolvedSuccessDescription =
      successDescription ??
      (activeMethod === "verification-code"
        ? `If an account exists for ${email.trim() || "that address"}, we sent a verification code.`
        : `If an account exists for ${email.trim() || "that address"}, we sent a password reset link.`);

    const alertNode =
      alertSlot !== undefined
        ? alertSlot
        : isSuccess && showSuccessAlert
          ? (
              <Alert
                variant="success"
                density={variant === "compact" ? "compact" : density}
                title={successTitle}
                icon={icon ?? <MailIcon />}
                live={live ?? "polite"}
                actions={actions}
                actionSlot={actionSlot}
              >
                {resolvedSuccessDescription}
              </Alert>
            )
          : isError && showErrorAlert
            ? (
                <Alert
                  variant="error"
                  density={variant === "compact" ? "compact" : density}
                  title={errorTitle}
                  icon={icon ?? <KeyIcon />}
                  live={live ?? "assertive"}
                  actions={actions}
                  actionSlot={actionSlot}
                >
                  {errorMessage ?? submitError ?? "Something went wrong. Try again in a moment."}
                </Alert>
              )
            : variant === "split"
              ? (
                  <Alert
                    variant="informational"
                    density={variant === "compact" ? "compact" : density}
                    title={title}
                    icon={icon ?? <KeyIcon />}
                    live={live ?? "off"}
                    actions={actions}
                    actionSlot={actionSlot}
                  >
                    {description}
                  </Alert>
                )
              : null;

    const methodOptions = allowedMethods.map((id) => ({
      id,
      label: METHOD_LABELS[id],
      icon: id === "reset-link" ? <LinkIcon /> : <CodeIcon />,
    }));

    const methodNode =
      methodSlot !== undefined
        ? methodSlot
        : showMethodChoice && allowedMethods.length > 1
          ? (
              <ActionSegmentedControl
                label={methodLabel}
                options={methodOptions}
                size={methodControlSize}
                value={activeMethod}
                onValueChange={(value) => setMethod(value as ForgotPasswordMethod)}
                equalWidth
                overflow="wrap"
                disabled={formDisabled}
              />
            )
          : null;

    const emailNode =
      emailSlot !== undefined ? (
        emailSlot
      ) : (
        <TextInput
          type="email"
          label={emailLabel}
          placeholder={emailPlaceholder}
          helpText={emailHelpText}
          value={email}
          onValueChange={(value) => {
            setEmail(value);
            if (status === "error") setStatus("idle");
            setSubmitError(null);
          }}
          onBlur={() => setTouched(true)}
          leadingIcon={<MailIcon />}
          size={inputSize}
          validation={fieldValidation}
          errorMessage={fieldErrorMessage}
          successMessage={isSuccess ? "Email accepted" : undefined}
          required
          fullWidth={fullWidth}
          disabled={formDisabled}
          autoComplete="email"
          inputMode="email"
          name="email"
        />
      );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setTouched(true);
      const err = emailValidationProp === "error"
        ? emailErrorMessageProp ?? "Enter a valid email address"
        : validateEmail(email);
      if (err) {
        setStatus("error");
        setSubmitError(err);
        return;
      }
      setSubmitError(null);
      setStatus("loading");
      try {
        await onSubmit?.({ email: email.trim(), method: activeMethod });
        setStatus("success");
      } catch (cause) {
        const message = cause instanceof Error && cause.message ? cause.message : null;
        setSubmitError(message);
        setStatus("error");
      }
    };

    const submitDisabled =
      formDisabled ||
      (disableSubmitWhenInvalid && Boolean(validateEmail(email))) ||
      isSuccess;

    const footerActions =
      actionsSlot !== undefined ? (
        actionsSlot
      ) : (
        <Card.Actions className="dk-forgot-password__actions">
          <Button
            type="submit"
            size={submitButtonSize}
            variant={isSuccess ? "success" : submitButtonVariant}
            leadingIcon={<SendIcon />}
            loading={isLoading}
            loadingLabel={submitLoadingLabel}
            disabled={submitDisabled && !isLoading}
            fullWidth={fullWidth}
          >
            {isSuccess ? "Instructions sent" : submitLabel}
          </Button>
          {showBack && onBack ? (
            <Button
              type="button"
              size={backButtonSize}
              variant={backButtonVariant}
              leadingIcon={<BackIcon />}
              disabled={isLoading}
              fullWidth={fullWidth}
              onClick={onBack}
            >
              {backLabel}
            </Button>
          ) : null}
        </Card.Actions>
      );

    const formBody = (
      <>
        {variant !== "split" && (title || description) ? (
          <div className="dk-forgot-password__intro">
            <Card.Title as="h2" className="dk-forgot-password__title">
              {title}
            </Card.Title>
            {description ? (
              <Card.Description className="dk-forgot-password__description">{description}</Card.Description>
            ) : null}
          </div>
        ) : null}
        {alertNode && variant !== "split" ? (
          <div className="dk-forgot-password__alert">{alertNode}</div>
        ) : null}
        {!isSuccess ? (
          <div className="dk-forgot-password__fields">
            {methodNode ? <div className="dk-forgot-password__method">{methodNode}</div> : null}
            <div className="dk-forgot-password__email">{emailNode}</div>
          </div>
        ) : null}
      </>
    );

    const cardInner = (
      <>
        {variant === "split" && alertNode ? (
          <Card.Header className="dk-forgot-password__header">{alertNode}</Card.Header>
        ) : null}
        <Card.Body className="dk-forgot-password__body">{formBody}</Card.Body>
        <Card.Footer className="dk-forgot-password__footer">{footerActions}</Card.Footer>
      </>
    );

    const cardNode =
      cardSlot !== undefined ? (
        cardSlot
      ) : (
        <Card
          variant={cardVariant}
          className="dk-forgot-password__card"
          aria-label={typeof title === "string" ? title : "Forgot password"}
        >
          {cardInner}
        </Card>
      );

    return (
      <form
        ref={ref}
        id={id}
        className={cx(
          "dk-forgot-password",
          `dk-forgot-password--${variant}`,
          `dk-forgot-password--${status}`,
          `dk-forgot-password--${activeMethod}`,
          disabled && "dk-forgot-password--disabled",
          className
        )}
        data-variant={variant}
        data-status={status}
        data-method={activeMethod}
        noValidate
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        aria-busy={isLoading || undefined}
      >
        {cardNode}
      </form>
    );
  }
);

ForgotPassword.displayName = "ForgotPassword";
export default ForgotPassword;
