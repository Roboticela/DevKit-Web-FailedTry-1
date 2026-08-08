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
  QrCodeCard,
  type QrCodeCardProps,
  type QrCodeCardStatus,
  type QrCodeCardVariant,
} from "../../../../../../../qr-code-card/vite-express-tauri/v1/files/src/components/ui/QrCodeCard";
import {
  VerificationCodeInput,
  type VerificationCodeInputProps,
  type VerificationCodeLength,
  type VerificationCodeValidation,
} from "../../../../../../../verification-code-input/vite-express-tauri/v1/files/src/components/ui/VerificationCodeInput";
import { AuthenticationLoading } from "../../../../../../../authentication-loading/vite-express-tauri/v1/files/src/components/ui/AuthenticationLoading";
import {
  VerificationSuccess,
  type VerificationSuccessProps,
  type VerificationSuccessVariant,
} from "../../../../../../../verification-success/vite-express-tauri/v1/files/src/components/ui/VerificationSuccess";
import {
  VerificationFailed,
  type VerificationFailedProps,
  type VerificationFailedReason,
  type VerificationFailedVariant,
} from "../../../../../../../verification-failed/vite-express-tauri/v1/files/src/components/ui/VerificationFailed";

/**
 * Authenticator App Setup — TOTP enrollment.
 * Composes QR Code Card, Verification Code Input, Button, Alert,
 * Authentication Loading, Verification Success, and Verification Failed.
 * Do not reinvent QR or OTP cells.
 */

export type AuthenticatorAppSetupStatus =
  | "setup"
  | "verifying"
  | "success"
  | "failed";

export type AuthenticatorAppSetupVariant = "stacked" | "compact" | "split";

export type AuthenticatorAppSetupProps = {
  variant?: AuthenticatorAppSetupVariant;
  status?: AuthenticatorAppSetupStatus;
  defaultStatus?: AuthenticatorAppSetupStatus;
  onStatusChange?: (status: AuthenticatorAppSetupStatus) => void;
  /** Instruction Alert title. */
  instructionsTitle?: React.ReactNode;
  /** Instruction Alert body. */
  instructions?: React.ReactNode;
  showInstructions?: boolean;
  issuer?: string;
  accountName?: string;
  qrSrc?: string;
  qrAlt?: string;
  secretKey?: string;
  qrStatus?: QrCodeCardStatus;
  qrVariant?: QrCodeCardVariant;
  expiresInSeconds?: number;
  remainingSeconds?: number;
  onQrExpire?: () => void;
  onQrRefresh?: () => void | Promise<void>;
  onCopySecret?: (secretKey: string) => void | Promise<void>;
  /** Controlled TOTP code. */
  code?: string;
  defaultCode?: string;
  onCodeChange?: (code: string) => void;
  codeLength?: VerificationCodeLength | number;
  codeValidation?: VerificationCodeValidation;
  codeErrorMessage?: string;
  /**
   * Verify the TOTP code against the enrolled secret.
   * Resolve → success; reject with `{ reason }` or Error → failed.
   */
  onVerify?: (code: string) => void | Promise<void>;
  /** Auto-submit when the code is complete. Default: false. */
  verifyOnComplete?: boolean;
  verifyLabel?: string;
  verifyLoadingLabel?: string;
  showVerifyButton?: boolean;
  cancelLabel?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  failureReason?: VerificationFailedReason;
  defaultFailureReason?: VerificationFailedReason;
  onFailureReasonChange?: (reason: VerificationFailedReason) => void;
  successTitle?: React.ReactNode;
  successDescription?: React.ReactNode;
  failedTitle?: React.ReactNode;
  failedDescription?: React.ReactNode;
  onContinue?: () => void;
  continueLabel?: string;
  redirectTo?: string;
  redirectDelay?: number;
  onRedirect?: () => void;
  onRetry?: () => void;
  verifyButtonSize?: ButtonSize;
  verifyButtonVariant?: ButtonVariant;
  cancelButtonSize?: ButtonSize;
  cancelButtonVariant?: ButtonVariant;
  density?: AlertDensity;
  live?: AlertLive;
  successVariant?: VerificationSuccessVariant;
  failedVariant?: VerificationFailedVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Forwarded QR Code Card props (overrides conflicting keys last). */
  qrProps?: Partial<QrCodeCardProps>;
  /** Forwarded Verification Code Input props. */
  codeProps?: Partial<VerificationCodeInputProps>;
  successProps?: Partial<VerificationSuccessProps>;
  failedProps?: Partial<VerificationFailedProps>;
  instructionsActions?: AlertAction[];
  headerSlot?: React.ReactNode;
  instructionsSlot?: React.ReactNode;
  qrSlot?: React.ReactNode;
  codeSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  loadingSlot?: React.ReactNode;
  successSlot?: React.ReactNode;
  failedSlot?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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
      <path d="m7.5 10 1.75 1.75L12.75 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VerifyGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="m4.5 10.5 3.5 3.5 7.5-8"
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

function mapVerifyError(error: unknown): VerificationFailedReason {
  if (!error) return "unknown";
  if (typeof error === "object" && error !== null && "reason" in error) {
    const reason = String((error as { reason: string }).reason);
    if (
      reason === "invalid" ||
      reason === "expired" ||
      reason === "locked" ||
      reason === "network" ||
      reason === "unknown"
    ) {
      return reason;
    }
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("expir") || msg.includes("timeout")) return "expired";
    if (msg.includes("lock") || msg.includes("attempt")) return "locked";
    if (msg.includes("network") || msg.includes("fetch")) return "network";
    if (msg.includes("invalid") || msg.includes("incorrect") || msg.includes("wrong")) {
      return "invalid";
    }
  }
  return "invalid";
}

const DEFAULT_INSTRUCTIONS =
  "Install an authenticator app, scan the QR code (or enter the setup key), then enter the 6-digit code it shows to confirm enrollment.";

export const AuthenticatorAppSetup = React.forwardRef<
  HTMLDivElement,
  AuthenticatorAppSetupProps
>(function AuthenticatorAppSetup(
  {
    variant = "stacked",
    status: statusProp,
    defaultStatus = "setup",
    onStatusChange,
    instructionsTitle = "Set up authenticator app",
    instructions = DEFAULT_INSTRUCTIONS,
    showInstructions = true,
    issuer,
    accountName,
    qrSrc,
    qrAlt,
    secretKey,
    qrStatus,
    qrVariant,
    expiresInSeconds,
    remainingSeconds,
    onQrExpire,
    onQrRefresh,
    onCopySecret,
    code: codeProp,
    defaultCode = "",
    onCodeChange,
    codeLength = 6,
    codeValidation = "none",
    codeErrorMessage,
    onVerify,
    verifyOnComplete = false,
    verifyLabel = "Verify and enable",
    verifyLoadingLabel = "Verifying",
    showVerifyButton = true,
    cancelLabel = "Cancel",
    showCancel = false,
    onCancel,
    failureReason: failureReasonProp,
    defaultFailureReason = "invalid",
    onFailureReasonChange,
    successTitle = "Authenticator enabled",
    successDescription = "Time-based one-time passwords from your authenticator app can now be used to sign in.",
    failedTitle,
    failedDescription,
    onContinue,
    continueLabel = "Continue",
    redirectTo,
    redirectDelay,
    onRedirect,
    onRetry,
    verifyButtonSize = "md",
    verifyButtonVariant = "primary",
    cancelButtonSize = "md",
    cancelButtonVariant = "secondary",
    density = "standard",
    live,
    successVariant = "stacked",
    failedVariant = "stacked",
    disabled = false,
    fullWidth = true,
    qrProps,
    codeProps,
    successProps,
    failedProps,
    instructionsActions,
    headerSlot,
    instructionsSlot,
    qrSlot,
    codeSlot,
    actionSlot,
    loadingSlot,
    successSlot,
    failedSlot,
    className = "",
    id,
  },
  ref
) {
  const reactId = React.useId();
  const rootId = id ?? `dk-authenticator-setup-${reactId}`;

  const controlledStatus = statusProp !== undefined;
  const [uncontrolledStatus, setUncontrolledStatus] =
    React.useState<AuthenticatorAppSetupStatus>(defaultStatus);
  const status = controlledStatus ? statusProp! : uncontrolledStatus;

  const setStatus = React.useCallback(
    (next: AuthenticatorAppSetupStatus) => {
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
      if (!controlledCode) setUncontrolledCode(next);
      onCodeChange?.(next);
    },
    [controlledCode, onCodeChange]
  );

  const controlledFailure = failureReasonProp !== undefined;
  const [uncontrolledFailure, setUncontrolledFailure] =
    React.useState<VerificationFailedReason>(defaultFailureReason);
  const failureReason = controlledFailure ? failureReasonProp! : uncontrolledFailure;

  const setFailureReason = React.useCallback(
    (next: VerificationFailedReason) => {
      if (!controlledFailure) setUncontrolledFailure(next);
      onFailureReasonChange?.(next);
    },
    [controlledFailure, onFailureReasonChange]
  );

  const verifying = status === "verifying";
  const resolvedQrVariant: QrCodeCardVariant =
    qrVariant ?? (variant === "split" ? "split" : variant === "compact" ? "compact" : "stacked");

  const runVerify = React.useCallback(
    async (value: string) => {
      if (!onVerify || disabled || verifying) return;
      const trimmed = value.trim();
      if (!trimmed) return;
      setStatus("verifying");
      try {
        await onVerify(trimmed);
        setStatus("success");
      } catch (error) {
        const reason = mapVerifyError(error);
        setFailureReason(reason);
        setStatus("failed");
      }
    },
    [disabled, onVerify, setFailureReason, setStatus, verifying]
  );

  const handleRetry = () => {
    setCode("");
    setStatus("setup");
    onRetry?.();
  };

  const codeComplete = code.replace(/\s/g, "").length >= Number(codeLength);

  if (status === "verifying") {
    return (
      <div
        ref={ref}
        id={rootId}
        className={cx(
          "dk-authenticator-setup",
          "dk-authenticator-setup--verifying",
          `dk-authenticator-setup--${variant}`,
          className
        )}
        data-status="verifying"
        data-variant={variant}
      >
        {loadingSlot ?? (
          <AuthenticationLoading
            flow="sign-in"
            variant={variant === "compact" ? "compact" : "stacked"}
            message="Verifying authenticator code"
            description="Confirming the code from your authenticator app…"
          />
        )}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        ref={ref}
        id={rootId}
        className={cx(
          "dk-authenticator-setup",
          "dk-authenticator-setup--success",
          `dk-authenticator-setup--${variant}`,
          className
        )}
        data-status="success"
        data-variant={variant}
      >
        {successSlot ?? (
          <VerificationSuccess
            flow="two-factor"
            variant={successVariant}
            title={successTitle}
            description={successDescription}
            density={density}
            live={live}
            redirectTo={redirectTo}
            redirectDelay={redirectDelay}
            onRedirect={onRedirect}
            actions={
              onContinue
                ? [{ label: continueLabel, onClick: () => onContinue(), emphasis: "primary" }]
                : undefined
            }
            {...successProps}
          />
        )}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        ref={ref}
        id={rootId}
        className={cx(
          "dk-authenticator-setup",
          "dk-authenticator-setup--failed",
          `dk-authenticator-setup--${variant}`,
          className
        )}
        data-status="failed"
        data-variant={variant}
        data-reason={failureReason}
      >
        {failedSlot ?? (
          <VerificationFailed
            flow="two-factor"
            reason={failureReason}
            variant={failedVariant}
            title={failedTitle}
            description={failedDescription}
            density={density}
            live={live ?? "assertive"}
            onRetry={handleRetry}
            showRetry
            {...failedProps}
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
        "dk-authenticator-setup",
        "dk-authenticator-setup--setup",
        `dk-authenticator-setup--${variant}`,
        fullWidth && "dk-authenticator-setup--full",
        className
      )}
      data-status="setup"
      data-variant={variant}
    >
      {headerSlot}

      {instructionsSlot ??
        (showInstructions ? (
          <Alert
            variant="informational"
            density={density}
            live={live ?? "polite"}
            title={instructionsTitle}
            icon={<ShieldGlyph />}
            actions={instructionsActions}
            className="dk-authenticator-setup__instructions"
          >
            {instructions}
          </Alert>
        ) : null)}

      <div className="dk-authenticator-setup__layout">
        {qrSlot ?? (
          <QrCodeCard
            variant={resolvedQrVariant}
            issuer={issuer}
            accountName={accountName}
            qrSrc={qrSrc}
            qrAlt={qrAlt}
            secretKey={secretKey}
            status={qrStatus}
            expiresInSeconds={expiresInSeconds}
            remainingSeconds={remainingSeconds}
            onExpire={onQrExpire}
            onRefresh={onQrRefresh}
            onCopy={onCopySecret}
            disabled={disabled}
            title="Scan QR code"
            description="Open your authenticator app and scan this code, or enter the setup key manually."
            className="dk-authenticator-setup__qr"
            {...qrProps}
          />
        )}

        <div className="dk-authenticator-setup__verify">
          {codeSlot ?? (
            <VerificationCodeInput
              flow="authenticator"
              label="Verification code"
              description="Enter the 6-digit code shown in your authenticator app."
              length={codeLength}
              value={code}
              onValueChange={setCode}
              onComplete={(value) => {
                if (verifyOnComplete) void runVerify(value);
              }}
              validation={codeValidation}
              errorMessage={codeErrorMessage}
              disabled={disabled}
              autoFocus
              fullWidth={fullWidth}
              {...codeProps}
            />
          )}

          {actionSlot ?? (
            <div className="dk-authenticator-setup__actions">
              {showVerifyButton ? (
                <Button
                  size={verifyButtonSize}
                  variant={verifyButtonVariant}
                  leadingIcon={<VerifyGlyph />}
                  fullWidth={fullWidth}
                  disabled={disabled || !codeComplete}
                  loading={verifying}
                  loadingLabel={verifyLoadingLabel}
                  onClick={() => void runVerify(code)}
                >
                  {verifyLabel}
                </Button>
              ) : null}
              {showCancel && onCancel ? (
                <Button
                  size={cancelButtonSize}
                  variant={cancelButtonVariant}
                  leadingIcon={<CancelGlyph />}
                  fullWidth={fullWidth}
                  disabled={disabled}
                  onClick={onCancel}
                >
                  {cancelLabel}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AuthenticatorAppSetup.displayName = "AuthenticatorAppSetup";
export default AuthenticatorAppSetup;
