import * as React from "react";
import {
  Alert,
  type AlertAction,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/vite-express-tauri/v1/files/src/components/ui/Alert";
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
  AuthenticationLoading,
  type AuthenticationLoadingVariant,
} from "../../../../../../../authentication-loading/vite-express-tauri/v1/files/src/components/ui/AuthenticationLoading";
import {
  AuthenticationError,
  type AuthenticationErrorReason,
  type AuthenticationErrorVariant,
} from "../../../../../../../authentication-error/vite-express-tauri/v1/files/src/components/ui/AuthenticationError";

/**
 * Recovery Code Login — emergency 2FA authentication with a one-time backup code.
 * Composes Text Input, Button, Alert, Authentication Loading, and Authentication Error.
 * Do not reinvent auth status chrome.
 */

export type RecoveryCodeLoginStatus = "idle" | "loading" | "error";

export type RecoveryCodeLoginVariant = "stacked" | "compact";

export type RecoveryCodeLoginProps = {
  variant?: RecoveryCodeLoginVariant;
  status?: RecoveryCodeLoginStatus;
  defaultStatus?: RecoveryCodeLoginStatus;
  onStatusChange?: (status: RecoveryCodeLoginStatus) => void;
  /** Controlled recovery code value (display may include separators). */
  code?: string;
  defaultCode?: string;
  onCodeChange?: (code: string) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  guidanceTitle?: React.ReactNode;
  guidanceMessage?: React.ReactNode;
  showGuidance?: boolean;
  codeLabel?: string;
  codePlaceholder?: string;
  codeHelpText?: string;
  codeValidation?: TextInputValidation;
  codeErrorMessage?: string;
  /**
   * Authenticate with a normalized recovery code (no spaces/dashes).
   * Resolve → `onSuccess`; reject → error status + reason.
   */
  onAuthenticate?: (code: string) => void | Promise<void>;
  onSuccess?: (code: string) => void;
  submitLabel?: string;
  submitLoadingLabel?: string;
  showSubmit?: boolean;
  /**
   * Format typed input into readable groups (e.g. `XXXX-XXXX`).
   * Default: true. Submitted value is always normalized.
   */
  formatInput?: boolean;
  /** Expected code length without separators. Default: 8. */
  expectedLength?: number;
  disableSubmitWhenInvalid?: boolean;
  errorReason?: AuthenticationErrorReason;
  defaultErrorReason?: AuthenticationErrorReason;
  onErrorReasonChange?: (reason: AuthenticationErrorReason) => void;
  errorTitle?: React.ReactNode;
  errorDescription?: React.ReactNode;
  onRetry?: () => void;
  onTryAlternative?: () => void;
  alternativeLabel?: string;
  showAlternative?: boolean;
  cancelLabel?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  submitButtonSize?: ButtonSize;
  submitButtonVariant?: ButtonVariant;
  cancelButtonSize?: ButtonSize;
  cancelButtonVariant?: ButtonVariant;
  inputSize?: TextInputSize;
  density?: AlertDensity;
  live?: AlertLive;
  loadingVariant?: AuthenticationLoadingVariant;
  errorVariant?: AuthenticationErrorVariant;
  guidanceActions?: AlertAction[];
  fullWidth?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  headerSlot?: React.ReactNode;
  guidanceSlot?: React.ReactNode;
  inputSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  loadingSlot?: React.ReactNode;
  errorSlot?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Strip whitespace and common separators for secure comparison / API submit. */
export function normalizeRecoveryCode(value: string): string {
  return value.replace(/[\s\-_.]/g, "").toUpperCase();
}

/** Insert a separator every 4 characters for readable entry. */
export function formatRecoveryCodeDisplay(value: string): string {
  const normalized = normalizeRecoveryCode(value);
  if (!normalized) return "";
  return normalized.replace(/(.{4})(?=.)/g, "$1-");
}

function KeyGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 10h5.5M14.5 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 2.75 16 5v4.5c0 3.75-2.5 6.5-6 7.75-3.5-1.25-6-4-6-7.75V5l6-2.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m7.5 10 1.75 1.75L12.75 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SubmitGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.5 10h11M11.5 6.5 15 10l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CancelGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AlternativeGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.5 10h11M11.5 6.5 15 10l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(180 10 10)"
      />
    </svg>
  );
}

function mapAuthenticateError(error: unknown): AuthenticationErrorReason {
  if (!error) return "unknown";
  if (typeof error === "object" && error !== null && "reason" in error) {
    const reason = String((error as { reason: string }).reason);
    if (
      reason === "invalid" ||
      reason === "expired" ||
      reason === "locked" ||
      reason === "network" ||
      reason === "canceled" ||
      reason === "unknown"
    ) {
      return reason;
    }
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("lock") || msg.includes("attempt")) return "locked";
    if (msg.includes("expir") || msg.includes("timeout")) return "expired";
    if (msg.includes("network") || msg.includes("fetch")) return "network";
    if (msg.includes("cancel") || msg.includes("abort")) return "canceled";
    if (msg.includes("invalid") || msg.includes("incorrect") || msg.includes("wrong") || msg.includes("used")) {
      return "invalid";
    }
  }
  return "invalid";
}

export const RecoveryCodeLogin = React.forwardRef<HTMLDivElement, RecoveryCodeLoginProps>(
  function RecoveryCodeLogin(
    {
      variant = "stacked",
      status: statusProp,
      defaultStatus = "idle",
      onStatusChange,
      code: codeProp,
      defaultCode = "",
      onCodeChange,
      title = "Sign in with a recovery code",
      description = "Enter one of your unused backup codes to regain access.",
      guidanceTitle = "One-time emergency access",
      guidanceMessage = "Each recovery code can be used only once. After you sign in, generate a new set of backup codes from account security settings.",
      showGuidance = true,
      codeLabel = "Recovery code",
      codePlaceholder = "XXXX-XXXX",
      codeHelpText = "Enter the code exactly as saved. Spaces and dashes are optional.",
      codeValidation = "none",
      codeErrorMessage,
      onAuthenticate,
      onSuccess,
      submitLabel = "Sign in",
      submitLoadingLabel = "Signing in",
      showSubmit = true,
      formatInput = true,
      expectedLength = 8,
      disableSubmitWhenInvalid = true,
      errorReason: errorReasonProp,
      defaultErrorReason = "invalid",
      onErrorReasonChange,
      errorTitle,
      errorDescription,
      onRetry,
      onTryAlternative,
      alternativeLabel = "Try another method",
      showAlternative = true,
      cancelLabel = "Cancel",
      showCancel = false,
      onCancel,
      submitButtonSize = "md",
      submitButtonVariant = "primary",
      cancelButtonSize = "md",
      cancelButtonVariant = "secondary",
      inputSize = "md",
      density = "standard",
      live,
      loadingVariant = "stacked",
      errorVariant = "stacked",
      guidanceActions,
      fullWidth = true,
      disabled = false,
      autoFocus = true,
      headerSlot,
      guidanceSlot,
      inputSlot,
      actionSlot,
      loadingSlot,
      errorSlot,
      className = "",
      id,
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = id ?? `dk-recovery-code-login-${reactId}`;
    const formId = `${rootId}-form`;

    const controlledStatus = statusProp !== undefined;
    const [uncontrolledStatus, setUncontrolledStatus] =
      React.useState<RecoveryCodeLoginStatus>(defaultStatus);
    const status = controlledStatus ? statusProp! : uncontrolledStatus;

    const setStatus = React.useCallback(
      (next: RecoveryCodeLoginStatus) => {
        if (!controlledStatus) setUncontrolledStatus(next);
        onStatusChange?.(next);
      },
      [controlledStatus, onStatusChange]
    );

    const controlledCode = codeProp !== undefined;
    const [uncontrolledCode, setUncontrolledCode] = React.useState(defaultCode);
    const code = controlledCode ? codeProp! : uncontrolledCode;

    const setCode = React.useCallback(
      (next: string) => {
        const display = formatInput ? formatRecoveryCodeDisplay(next) : next;
        if (!controlledCode) setUncontrolledCode(display);
        onCodeChange?.(display);
      },
      [controlledCode, formatInput, onCodeChange]
    );

    const controlledError = errorReasonProp !== undefined;
    const [uncontrolledError, setUncontrolledError] =
      React.useState<AuthenticationErrorReason>(defaultErrorReason);
    const errorReason = controlledError ? errorReasonProp! : uncontrolledError;

    const setErrorReason = React.useCallback(
      (next: AuthenticationErrorReason) => {
        if (!controlledError) setUncontrolledError(next);
        onErrorReasonChange?.(next);
      },
      [controlledError, onErrorReasonChange]
    );

    const normalized = normalizeRecoveryCode(code);
    const isValidLength = expectedLength <= 0 || normalized.length >= expectedLength;
    const loading = status === "loading";

    const runAuthenticate = React.useCallback(async () => {
      if (!onAuthenticate || disabled || loading) return;
      const value = normalizeRecoveryCode(code);
      if (!value) return;
      if (disableSubmitWhenInvalid && expectedLength > 0 && value.length < expectedLength) return;

      setStatus("loading");
      try {
        await onAuthenticate(value);
        onSuccess?.(value);
        // Clear code from the field after successful use (secure workflow).
        setCode("");
        if (!controlledStatus) setUncontrolledStatus("idle");
      } catch (error) {
        const reason = mapAuthenticateError(error);
        setErrorReason(reason);
        setStatus("error");
      }
    }, [
      code,
      controlledStatus,
      disableSubmitWhenInvalid,
      disabled,
      expectedLength,
      loading,
      onAuthenticate,
      onSuccess,
      setCode,
      setErrorReason,
      setStatus,
    ]);

    const handleRetry = () => {
      setStatus("idle");
      onRetry?.();
    };

    if (status === "loading") {
      return (
        <div
          ref={ref}
          id={rootId}
          className={cx(
            "dk-recovery-code-login",
            "dk-recovery-code-login--loading",
            `dk-recovery-code-login--${variant}`,
            className
          )}
          data-status="loading"
          data-variant={variant}
        >
          {loadingSlot ?? (
            <AuthenticationLoading
              flow="sign-in"
              variant={loadingVariant === "compact" || variant === "compact" ? "compact" : "stacked"}
              message="Verifying recovery code"
              description="Checking your emergency backup code…"
            />
          )}
        </div>
      );
    }

    if (status === "error") {
      return (
        <div
          ref={ref}
          id={rootId}
          className={cx(
            "dk-recovery-code-login",
            "dk-recovery-code-login--error",
            `dk-recovery-code-login--${variant}`,
            className
          )}
          data-status="error"
          data-variant={variant}
          data-reason={errorReason}
        >
          {errorSlot ?? (
            <AuthenticationError
              flow="two-factor"
              reason={errorReason}
              variant={errorVariant}
              title={errorTitle}
              description={errorDescription}
              density={density}
              live={live ?? "assertive"}
              onRetry={handleRetry}
              showRetry
              onTryAlternative={onTryAlternative}
              alternativeLabel={alternativeLabel}
              showAlternative={showAlternative && Boolean(onTryAlternative)}
            />
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        id={rootId}
        className={cx(
          "dk-recovery-code-login",
          "dk-recovery-code-login--idle",
          `dk-recovery-code-login--${variant}`,
          fullWidth && "dk-recovery-code-login--full",
          className
        )}
        data-status="idle"
        data-variant={variant}
      >
        {headerSlot ?? (
          <div className="dk-recovery-code-login__header">
            <h2 className="dk-recovery-code-login__title">{title}</h2>
            {description ? (
              <p className="dk-recovery-code-login__description">{description}</p>
            ) : null}
          </div>
        )}

        {guidanceSlot ??
          (showGuidance ? (
            <Alert
              variant="warning"
              density={density}
              live={live ?? "polite"}
              title={guidanceTitle}
              icon={<ShieldGlyph />}
              actions={guidanceActions}
              className="dk-recovery-code-login__guidance"
            >
              {guidanceMessage}
            </Alert>
          ) : null)}

        <form
          id={formId}
          className="dk-recovery-code-login__form"
          onSubmit={(event) => {
            event.preventDefault();
            void runAuthenticate();
          }}
          noValidate
        >
          {inputSlot ?? (
            <TextInput
              label={codeLabel}
              placeholder={codePlaceholder}
              helpText={codeHelpText}
              value={code}
              onValueChange={setCode}
              size={inputSize}
              validation={codeValidation}
              errorMessage={codeErrorMessage}
              disabled={disabled || loading}
              fullWidth={fullWidth}
              autoFocus={autoFocus}
              autoComplete="one-time-code"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              name="recovery-code"
              leadingIcon={<KeyGlyph />}
              required
              className="dk-recovery-code-login__input"
            />
          )}

          {actionSlot ?? (
            <div className="dk-recovery-code-login__actions">
              {showSubmit ? (
                <Button
                  type="submit"
                  size={submitButtonSize}
                  variant={submitButtonVariant}
                  leadingIcon={<SubmitGlyph />}
                  fullWidth={fullWidth}
                  disabled={
                    disabled ||
                    (disableSubmitWhenInvalid && !isValidLength) ||
                    !normalized
                  }
                  loading={loading}
                  loadingLabel={submitLoadingLabel}
                >
                  {submitLabel}
                </Button>
              ) : null}
              {showCancel && onCancel ? (
                <Button
                  type="button"
                  size={cancelButtonSize}
                  variant={cancelButtonVariant}
                  leadingIcon={<CancelGlyph />}
                  fullWidth={fullWidth}
                  disabled={disabled || loading}
                  onClick={onCancel}
                >
                  {cancelLabel}
                </Button>
              ) : null}
              {showAlternative && onTryAlternative ? (
                <Button
                  type="button"
                  size={cancelButtonSize}
                  variant="quiet"
                  leadingIcon={<AlternativeGlyph />}
                  fullWidth={fullWidth}
                  disabled={disabled || loading}
                  onClick={onTryAlternative}
                >
                  {alternativeLabel}
                </Button>
              ) : null}
            </div>
          )}
        </form>
      </div>
    );
  }
);

RecoveryCodeLogin.displayName = "RecoveryCodeLogin";
export default RecoveryCodeLogin;
