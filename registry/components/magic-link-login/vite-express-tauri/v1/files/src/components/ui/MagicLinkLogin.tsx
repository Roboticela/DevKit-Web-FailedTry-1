import * as React from "react";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import {
  TextInput,
  type TextInputSize,
  type TextInputValidation,
} from "../../../../../../../text-input/vite-express-tauri/v1/files/src/components/ui/TextInput";
import {
  VerificationEmailSent,
  type VerificationEmailSentProps,
  type VerificationEmailSentStatus,
  type VerificationEmailSentVariant,
} from "../../../../../../../verification-email-sent/vite-express-tauri/v1/files/src/components/ui/VerificationEmailSent";
import { ContinueWithProvider } from "../../../../../../../continue-with-provider/vite-express-tauri/v1/files/src/components/ui/ContinueWithProvider";

/**
 * Magic Link Login — passwordless email link authentication.
 * Composes Text Input, Button, and Verification Email Sent.
 * Do not reimplement confirmation / resend / expiry — use Verification Email Sent.
 */

/**
 * - `request` — collect email and send magic link
 * - `sent` — confirmation via Verification Email Sent
 */
export type MagicLinkLoginView = "request" | "sent";

/**
 * Request-step status (sent view uses Verification Email Sent status).
 */
export type MagicLinkLoginStatus = "idle" | "loading" | "error";

/**
 * - `stacked` — title + form + optional providers
 * - `compact` — dense request form
 * - `split` — providers beside / below email on wide layouts
 */
export type MagicLinkLoginVariant = "stacked" | "compact" | "split";

/** Optional federated provider entry rendered via Continue With Provider. */
export type MagicLinkLoginProvider = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onContinue?: () => void | Promise<void>;
  state?: "idle" | "loading" | "success" | "error" | "disabled";
  disabled?: boolean;
};

export type MagicLinkLoginProps = {
  variant?: MagicLinkLoginVariant;
  view?: MagicLinkLoginView;
  defaultView?: MagicLinkLoginView;
  onViewChange?: (view: MagicLinkLoginView) => void;
  status?: MagicLinkLoginStatus;
  defaultStatus?: MagicLinkLoginStatus;
  onStatusChange?: (status: MagicLinkLoginStatus) => void;
  email?: string;
  defaultEmail?: string;
  onEmailChange?: (email: string) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  emailLabel?: string;
  emailPlaceholder?: string;
  emailHelpText?: string;
  submitLabel?: string;
  submitLoadingLabel?: string;
  providersLabel?: string;
  errorMessage?: React.ReactNode;
  emailValidation?: TextInputValidation;
  emailErrorMessage?: string;
  /**
   * Request a magic link for `email`.
   * Resolve → switch to `sent`; reject → request error.
   */
  onRequestLink?: (email: string) => void | Promise<void>;
  /** Resend from Verification Email Sent. Defaults to `onRequestLink(email)`. */
  onResend?: () => void | Promise<void>;
  onChangeEmail?: () => void;
  onOpenEmailApp?: () => void;
  onLinkExpire?: () => void;
  /** Federated providers (Continue With Provider). */
  providers?: MagicLinkLoginProvider[];
  showProviders?: boolean;
  providerSlot?: React.ReactNode;
  /** Forwarded to Verification Email Sent on the `sent` view. */
  confirmationVariant?: VerificationEmailSentVariant;
  confirmationStatus?: VerificationEmailSentStatus;
  linkExpiryDuration?: number;
  resendCooldownDuration?: number;
  confirmationProps?: Omit<
    VerificationEmailSentProps,
    | "email"
    | "onResend"
    | "onChangeEmail"
    | "onOpenEmailApp"
    | "onLinkExpire"
    | "linkExpiryDuration"
    | "resendCooldownDuration"
    | "status"
    | "variant"
  >;
  submitButtonSize?: ButtonSize;
  submitButtonVariant?: ButtonVariant;
  inputSize?: TextInputSize;
  fullWidth?: boolean;
  disabled?: boolean;
  disableSubmitWhenInvalid?: boolean;
  emailSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  requestSlot?: React.ReactNode;
  confirmationSlot?: React.ReactNode;
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your email address";
  if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address";
  return null;
}

export const MagicLinkLogin = React.forwardRef<HTMLDivElement, MagicLinkLoginProps>(
  function MagicLinkLogin(
    {
      variant = "stacked",
      view: viewProp,
      defaultView = "request",
      onViewChange,
      status: statusProp,
      defaultStatus = "idle",
      onStatusChange,
      email: emailProp,
      defaultEmail = "",
      onEmailChange,
      title = "Sign in with a magic link",
      description = "We’ll email you a secure link to sign in without a password.",
      emailLabel = "Work email",
      emailPlaceholder = "you@company.com",
      emailHelpText = "Use the email on your account",
      submitLabel = "Email magic link",
      submitLoadingLabel = "Sending magic link",
      providersLabel = "Or continue with",
      errorMessage,
      emailValidation: emailValidationProp,
      emailErrorMessage: emailErrorMessageProp,
      onRequestLink,
      onResend,
      onChangeEmail,
      onOpenEmailApp,
      onLinkExpire,
      providers = [],
      showProviders = true,
      providerSlot,
      confirmationVariant = "stacked",
      confirmationStatus,
      linkExpiryDuration = 120,
      resendCooldownDuration = 60,
      confirmationProps,
      submitButtonSize = "md",
      submitButtonVariant = "primary",
      inputSize = "md",
      fullWidth = true,
      disabled = false,
      disableSubmitWhenInvalid = true,
      emailSlot,
      actionsSlot,
      requestSlot,
      confirmationSlot,
      className = "",
      id,
    },
    ref
  ) {
    const controlledView = viewProp !== undefined;
    const controlledStatus = statusProp !== undefined;
    const controlledEmail = emailProp !== undefined;

    const [uncontrolledView, setUncontrolledView] = React.useState<MagicLinkLoginView>(defaultView);
    const [uncontrolledStatus, setUncontrolledStatus] = React.useState<MagicLinkLoginStatus>(defaultStatus);
    const [uncontrolledEmail, setUncontrolledEmail] = React.useState(defaultEmail);
    const [touched, setTouched] = React.useState(false);
    const [requestError, setRequestError] = React.useState<string | null>(null);

    const view = controlledView ? viewProp! : uncontrolledView;
    const status = controlledStatus ? statusProp! : uncontrolledStatus;
    const email = controlledEmail ? emailProp! : uncontrolledEmail;

    const setView = React.useCallback(
      (next: MagicLinkLoginView) => {
        if (!controlledView) setUncontrolledView(next);
        onViewChange?.(next);
      },
      [controlledView, onViewChange]
    );

    const setStatus = React.useCallback(
      (next: MagicLinkLoginStatus) => {
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

    const builtInError = validateEmail(email);
    const showFieldError = emailValidationProp
      ? emailValidationProp === "error"
      : touched && Boolean(builtInError);
    const fieldValidation: TextInputValidation =
      emailValidationProp ?? (showFieldError ? "error" : status === "error" ? "error" : "none");
    const fieldErrorMessage =
      emailErrorMessageProp ??
      (showFieldError ? builtInError ?? undefined : status === "error" ? String(errorMessage ?? requestError ?? builtInError ?? "") || undefined : undefined);

    const isLoading = status === "loading";
    const formDisabled = disabled || isLoading;

    const handleRequest = async (event?: React.FormEvent) => {
      event?.preventDefault();
      setTouched(true);
      const err =
        emailValidationProp === "error"
          ? emailErrorMessageProp ?? "Enter a valid email address"
          : validateEmail(email);
      if (err) {
        setRequestError(err);
        setStatus("error");
        return;
      }
      setRequestError(null);
      setStatus("loading");
      try {
        await onRequestLink?.(email.trim());
        setStatus("idle");
        setView("sent");
      } catch (cause) {
        const message = cause instanceof Error && cause.message ? cause.message : null;
        setRequestError(message);
        setStatus("error");
      }
    };

    const handleResend = React.useCallback(async () => {
      if (onResend) {
        await onResend();
        return;
      }
      await onRequestLink?.(email.trim());
    }, [email, onRequestLink, onResend]);

    const handleChangeEmail = React.useCallback(() => {
      if (onChangeEmail) {
        onChangeEmail();
        return;
      }
      setStatus("idle");
      setRequestError(null);
      setView("request");
    }, [onChangeEmail, setStatus, setView]);

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
            setRequestError(null);
          }}
          onBlur={() => setTouched(true)}
          leadingIcon={<MailIcon />}
          size={inputSize}
          validation={fieldValidation}
          errorMessage={fieldErrorMessage}
          required
          fullWidth={fullWidth}
          disabled={formDisabled}
          autoComplete="email"
          inputMode="email"
          name="email"
        />
      );

    const submitDisabled =
      formDisabled || (disableSubmitWhenInvalid && Boolean(validateEmail(email)));

    const actionsNode =
      actionsSlot !== undefined ? (
        actionsSlot
      ) : (
        <Button
          type="submit"
          size={submitButtonSize}
          variant={submitButtonVariant}
          leadingIcon={<LinkIcon />}
          loading={isLoading}
          loadingLabel={submitLoadingLabel}
          disabled={submitDisabled && !isLoading}
          fullWidth={fullWidth}
        >
          {submitLabel}
        </Button>
      );

    const providerNodes =
      providerSlot !== undefined
        ? providerSlot
        : showProviders && providers.length > 0
          ? (
              <ContinueWithProvider.Group dividerLabel={providersLabel}>
                {providers.map((provider) => (
                  <ContinueWithProvider
                    key={provider.id}
                    provider={provider.id}
                    label={provider.label}
                    icon={provider.icon}
                    state={provider.disabled ? "disabled" : provider.state}
                    fullWidth={fullWidth}
                    onContinue={() => {
                      void provider.onContinue?.();
                    }}
                  />
                ))}
              </ContinueWithProvider.Group>
            )
          : null;

    const requestForm =
      requestSlot !== undefined ? (
        requestSlot
      ) : (
        <form
          className="dk-magic-link-login__form"
          noValidate
          onSubmit={(event) => {
            void handleRequest(event);
          }}
          aria-busy={isLoading || undefined}
        >
          <div className="dk-magic-link-login__intro">
            <h2 className="dk-magic-link-login__title">{title}</h2>
            {description ? <p className="dk-magic-link-login__description">{description}</p> : null}
          </div>
          <div className="dk-magic-link-login__email">{emailNode}</div>
          <div className="dk-magic-link-login__submit">{actionsNode}</div>
          {providerNodes ? <div className="dk-magic-link-login__providers">{providerNodes}</div> : null}
        </form>
      );

    const confirmationNode =
      confirmationSlot !== undefined ? (
        confirmationSlot
      ) : (
        <VerificationEmailSent
          email={email.trim()}
          variant={confirmationVariant}
          status={confirmationStatus ?? "sent"}
          title="Magic link sent"
          description={
            <>
              We sent a sign-in link to{" "}
              <strong className="dk-magic-link-login__email-strong">{email.trim()}</strong>. It expires
              soon — open your inbox to continue.
            </>
          }
          linkExpiryDuration={linkExpiryDuration}
          linkExpiryLabel="Magic link expires in"
          linkExpiredLabel="Magic link expired"
          resendCooldownDuration={resendCooldownDuration}
          onResend={handleResend}
          onChangeEmail={handleChangeEmail}
          onOpenEmailApp={onOpenEmailApp}
          onLinkExpire={onLinkExpire}
          changeEmailLabel="Use a different email"
          openEmailAppLabel="Open email app"
          resendProps={{
            label: "Resend magic link",
            loadingLabel: "Sending magic link",
            successMessage: "Magic link sent",
            errorMessage: "Could not resend magic link",
          }}
          {...confirmationProps}
        />
      );

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-magic-link-login",
          `dk-magic-link-login--${variant}`,
          `dk-magic-link-login--${view}`,
          `dk-magic-link-login--${status}`,
          disabled && "dk-magic-link-login--disabled",
          className
        )}
        data-variant={variant}
        data-view={view}
        data-status={status}
        role="region"
        aria-label={typeof title === "string" ? title : "Magic link login"}
      >
        {view === "sent" ? (
          <div className="dk-magic-link-login__confirmation">{confirmationNode}</div>
        ) : (
          <div className="dk-magic-link-login__request">{requestForm}</div>
        )}
      </div>
    );
  }
);

MagicLinkLogin.displayName = "MagicLinkLogin";
export default MagicLinkLogin;
