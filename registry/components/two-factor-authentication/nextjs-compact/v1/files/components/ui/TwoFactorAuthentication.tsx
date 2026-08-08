import * as React from "react";
import {
  SelectAuthenticationMethod,
  type AuthenticationMethodId,
  type AuthenticationMethodOption,
  type AuthenticationProviderOption,
  type SelectAuthenticationMethodProps,
} from "../../../../../../../select-authentication-method/nextjs-compact/v1/files/components/ui/SelectAuthenticationMethod";
import {
  VerificationCodeInput,
  type VerificationCodeFlow,
  type VerificationCodeInputProps,
  type VerificationCodeLength,
} from "../../../../../../../verification-code-input/nextjs-compact/v1/files/components/ui/VerificationCodeInput";
import {
  AuthenticatorAppSetup,
  type AuthenticatorAppSetupProps,
} from "../../../../../../../authenticator-app-setup/nextjs-compact/v1/files/components/ui/AuthenticatorAppSetup";
import {
  BackupCodes,
  type BackupCodeItem,
  type BackupCodesProps,
} from "../../../../../../../backup-codes/nextjs-compact/v1/files/components/ui/BackupCodes";
import {
  RecoveryCodeLogin,
  type RecoveryCodeLoginProps,
} from "../../../../../../../recovery-code-login/nextjs-compact/v1/files/components/ui/RecoveryCodeLogin";
import {
  AuthenticationLoading,
  type AuthenticationLoadingVariant,
} from "../../../../../../../authentication-loading/nextjs-compact/v1/files/components/ui/AuthenticationLoading";
import {
  AuthenticationSuccess,
  type AuthenticationSuccessProps,
} from "../../../../../../../authentication-success/nextjs-compact/v1/files/components/ui/AuthenticationSuccess";
import {
  AuthenticationError,
  type AuthenticationErrorReason,
  type AuthenticationErrorVariant,
} from "../../../../../../../authentication-error/nextjs-compact/v1/files/components/ui/AuthenticationError";
import {
  Button,
  type ButtonSize,
} from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import { CountdownTimer } from "../../../../../../../countdown-timer/nextjs-compact/v1/files/components/ui/CountdownTimer";

/**
 * Two-Factor Authentication — orchestrates the complete 2FA workflow.
 * Composes Select Authentication Method, Verification Code Input,
 * Authenticator App Setup, Backup Codes, Recovery Code Login,
 * Authentication Loading / Success / Error.
 * Never recreate OTP cells, QR setup, recovery codes, or auth status chrome.
 */

export type TwoFactorMode = "challenge" | "enroll";

/**
 * Challenge / enroll steps. Hosts may control via `step` or let the orchestrator drive.
 */
export type TwoFactorStep =
  | "select-method"
  | "verify-code"
  | "recovery-code"
  | "passkey"
  | "setup-authenticator"
  | "backup-codes"
  | "loading"
  | "success"
  | "error";

/** Built-in challenge methods (extensible via custom method ids + slots). */
export type TwoFactorMethodId =
  | "authenticator-app"
  | "email-code"
  | "sms-code"
  | "passkey"
  | "recovery-code"
  | (string & {});

export type TwoFactorVariant = "stacked" | "compact";

export type TwoFactorVerifyPayload = {
  method: TwoFactorMethodId;
  code: string;
};

export type TwoFactorAuthenticationProps = {
  mode?: TwoFactorMode;
  variant?: TwoFactorVariant;
  step?: TwoFactorStep;
  defaultStep?: TwoFactorStep;
  onStepChange?: (step: TwoFactorStep) => void;
  /**
   * Available challenge methods. Defaults to authenticator, email, SMS, passkey, recovery.
   * Enroll mode ignores this for the primary path (setup → backup codes).
   */
  methods?: Array<TwoFactorMethodId | AuthenticationMethodOption>;
  recommendedMethod?: TwoFactorMethodId;
  selectedMethod?: TwoFactorMethodId;
  defaultSelectedMethod?: TwoFactorMethodId;
  onSelectedMethodChange?: (method: TwoFactorMethodId) => void;
  /** Skip method picker when only one method is available. Default: true. */
  autoAdvanceSingleMethod?: boolean;
  /**
   * Send / start a challenge for `method` (email OTP, SMS OTP, passkey ceremony, …).
   * Called when leaving select-method (and on OTP resend).
   */
  onStartChallenge?: (method: TwoFactorMethodId) => void | Promise<void>;
  /**
   * Verify OTP for authenticator / email / SMS.
   * Resolve → success (or backup-codes in enroll); reject → error.
   */
  onVerifyCode?: (payload: TwoFactorVerifyPayload) => void | Promise<void>;
  /** Passkey assertion during challenge. */
  onAuthenticatePasskey?: () => void | Promise<void>;
  /** Recovery code authentication (forwards to Recovery Code Login). */
  onAuthenticateRecoveryCode?: (code: string) => void | Promise<void>;
  /** Enroll: verify TOTP during Authenticator App Setup. */
  onEnrollVerify?: (code: string) => void | Promise<void>;
  /** Enroll: regenerate / confirm backup codes saved. */
  onBackupCodesRegenerate?: () => void | Promise<void>;
  onBackupCodesAcknowledged?: (acknowledged: boolean) => void;
  /** After successful challenge or enroll. */
  onComplete?: (context: { mode: TwoFactorMode; method?: TwoFactorMethodId }) => void;
  onContinue?: () => void;
  continueLabel?: string;
  redirectTo?: string;
  redirectDelay?: number;
  onRedirect?: () => void;
  /** Return to method picker / cancel current challenge. */
  onChangeMethod?: () => void;
  changeMethodLabel?: string;
  showChangeMethod?: boolean;
  /** OTP code field. */
  code?: string;
  defaultCode?: string;
  onCodeChange?: (code: string) => void;
  codeLength?: VerificationCodeLength | number;
  /** Seconds until OTP expires. Composes Countdown Timer in the verify footer. */
  codeExpiresInSeconds?: number;
  onCodeExpire?: () => void;
  onResendCode?: () => void | Promise<void>;
  resendLabel?: string;
  showResend?: boolean;
  /** Authenticator enroll props passthrough. */
  issuer?: string;
  accountName?: string;
  qrSrc?: string;
  secretKey?: string;
  qrExpiresInSeconds?: number;
  onQrRefresh?: () => void | Promise<void>;
  backupCodes?: Array<string | BackupCodeItem>;
  errorReason?: AuthenticationErrorReason;
  defaultErrorReason?: AuthenticationErrorReason;
  onErrorReasonChange?: (reason: AuthenticationErrorReason) => void;
  loadingMessage?: string;
  loadingDescription?: string;
  successTitle?: React.ReactNode;
  successDescription?: React.ReactNode;
  errorTitle?: React.ReactNode;
  errorDescription?: React.ReactNode;
  loadingVariant?: AuthenticationLoadingVariant;
  errorVariant?: AuthenticationErrorVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  changeMethodButtonSize?: ButtonSize;
  /** Federated / future providers on the method picker. */
  providers?: AuthenticationProviderOption[];
  selectMethodProps?: Partial<SelectAuthenticationMethodProps>;
  verificationCodeProps?: Partial<VerificationCodeInputProps>;
  authenticatorSetupProps?: Partial<AuthenticatorAppSetupProps>;
  backupCodesProps?: Partial<BackupCodesProps>;
  recoveryCodeLoginProps?: Partial<RecoveryCodeLoginProps>;
  successProps?: Partial<AuthenticationSuccessProps>;
  /**
   * Extensibility: render custom challenge UI for unknown / future method ids.
   * Return null to fall back to Verification Code Input.
   */
  renderMethodChallenge?: (method: TwoFactorMethodId) => React.ReactNode;
  selectMethodSlot?: React.ReactNode;
  verifyCodeSlot?: React.ReactNode;
  recoverySlot?: React.ReactNode;
  passkeySlot?: React.ReactNode;
  setupSlot?: React.ReactNode;
  backupCodesSlot?: React.ReactNode;
  loadingSlot?: React.ReactNode;
  successSlot?: React.ReactNode;
  errorSlot?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const DEFAULT_CHALLENGE_METHODS: TwoFactorMethodId[] = [
  "authenticator-app",
  "email-code",
  "sms-code",
  "passkey",
  "recovery-code",
];

const OTP_METHODS = new Set<string>(["authenticator-app", "email-code", "sms-code"]);

function BackGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M15.5 10h-11M8.5 6.5 5 10l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResendGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M16 10a6 6 0 1 1-1.6-4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 4.5v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function mapAuthError(error: unknown): AuthenticationErrorReason {
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
    if (msg.includes("expir") || msg.includes("timeout")) return "expired";
    if (msg.includes("lock") || msg.includes("attempt")) return "locked";
    if (msg.includes("network")) return "network";
    if (msg.includes("cancel") || msg.includes("abort")) return "canceled";
    if (msg.includes("invalid") || msg.includes("incorrect") || msg.includes("wrong")) return "invalid";
  }
  return "invalid";
}

function verificationFlowFor(method: TwoFactorMethodId): VerificationCodeFlow {
  if (method === "email-code") return "email-verification";
  if (method === "sms-code") return "two-factor";
  return "authenticator";
}

function verificationCopy(method: TwoFactorMethodId): { label: string; description: string } {
  switch (method) {
    case "email-code":
      return {
        label: "Email verification code",
        description: "Enter the one-time code we sent to your email.",
      };
    case "sms-code":
      return {
        label: "SMS verification code",
        description: "Enter the one-time code we sent by text message.",
      };
    case "authenticator-app":
    default:
      return {
        label: "Authenticator code",
        description: "Enter the 6-digit code from your authenticator app.",
      };
  }
}

function resolveMethodIds(
  methods: Array<TwoFactorMethodId | AuthenticationMethodOption> | undefined
): TwoFactorMethodId[] {
  const source = methods?.length ? methods : DEFAULT_CHALLENGE_METHODS;
  return source
    .map((entry) => (typeof entry === "string" ? entry : entry.id))
    .filter((id) => {
      if (typeof id !== "string") return false;
      const opt = source.find((e) => typeof e !== "string" && e.id === id) as
        | AuthenticationMethodOption
        | undefined;
      return opt?.available !== false;
    }) as TwoFactorMethodId[];
}

export const TwoFactorAuthentication = React.forwardRef<
  HTMLDivElement,
  TwoFactorAuthenticationProps
>(function TwoFactorAuthentication(
  {
    mode = "challenge",
    variant = "stacked",
    step: stepProp,
    defaultStep,
    onStepChange,
    methods,
    recommendedMethod = "authenticator-app",
    selectedMethod: selectedMethodProp,
    defaultSelectedMethod,
    onSelectedMethodChange,
    autoAdvanceSingleMethod = true,
    onStartChallenge,
    onVerifyCode,
    onAuthenticatePasskey,
    onAuthenticateRecoveryCode,
    onEnrollVerify,
    onBackupCodesRegenerate,
    onBackupCodesAcknowledged,
    onComplete,
    onContinue,
    continueLabel = "Continue",
    redirectTo,
    redirectDelay,
    onRedirect,
    onChangeMethod,
    changeMethodLabel = "Use a different method",
    showChangeMethod = true,
    code: codeProp,
    defaultCode = "",
    onCodeChange,
    codeLength = 6,
    codeExpiresInSeconds,
    onCodeExpire,
    onResendCode,
    resendLabel = "Resend code",
    showResend = true,
    issuer,
    accountName,
    qrSrc,
    secretKey,
    qrExpiresInSeconds,
    onQrRefresh,
    backupCodes = [],
    errorReason: errorReasonProp,
    defaultErrorReason = "invalid",
    onErrorReasonChange,
    loadingMessage,
    loadingDescription,
    successTitle,
    successDescription,
    errorTitle,
    errorDescription,
    loadingVariant = "stacked",
    errorVariant = "stacked",
    disabled = false,
    fullWidth = true,
    changeMethodButtonSize = "sm",
    providers,
    selectMethodProps,
    verificationCodeProps,
    authenticatorSetupProps,
    backupCodesProps,
    recoveryCodeLoginProps,
    successProps,
    renderMethodChallenge,
    selectMethodSlot,
    verifyCodeSlot,
    recoverySlot,
    passkeySlot,
    setupSlot,
    backupCodesSlot,
    loadingSlot,
    successSlot,
    errorSlot,
    className = "",
    id,
  },
  ref
) {
  const reactId = React.useId();
  const rootId = id ?? `dk-two-factor-${reactId}`;

  const methodIds = React.useMemo(() => resolveMethodIds(methods), [methods]);
  const initialMethod =
    defaultSelectedMethod ??
    recommendedMethod ??
    methodIds[0] ??
    "authenticator-app";

  const resolvedDefaultStep: TwoFactorStep =
    defaultStep ??
    (mode === "enroll"
      ? "setup-authenticator"
      : autoAdvanceSingleMethod && methodIds.length === 1
        ? methodIds[0] === "recovery-code"
          ? "recovery-code"
          : methodIds[0] === "passkey"
            ? "passkey"
            : "verify-code"
        : "select-method");

  const controlledStep = stepProp !== undefined;
  const [uncontrolledStep, setUncontrolledStep] = React.useState<TwoFactorStep>(resolvedDefaultStep);
  const step = controlledStep ? stepProp! : uncontrolledStep;

  const setStep = React.useCallback(
    (next: TwoFactorStep) => {
      if (!controlledStep) setUncontrolledStep(next);
      onStepChange?.(next);
    },
    [controlledStep, onStepChange]
  );

  const controlledMethod = selectedMethodProp !== undefined;
  const [uncontrolledMethod, setUncontrolledMethod] = React.useState<TwoFactorMethodId>(initialMethod);
  const selectedMethod = controlledMethod ? selectedMethodProp! : uncontrolledMethod;

  const setSelectedMethod = React.useCallback(
    (next: TwoFactorMethodId) => {
      if (!controlledMethod) setUncontrolledMethod(next);
      onSelectedMethodChange?.(next);
    },
    [controlledMethod, onSelectedMethodChange]
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

  const [backupAcknowledged, setBackupAcknowledged] = React.useState(false);

  const goToMethodStep = React.useCallback(
    async (method: TwoFactorMethodId) => {
      setSelectedMethod(method);
      setCode("");
      try {
        if (method === "recovery-code") {
          setStep("recovery-code");
          return;
        }
        if (method === "passkey") {
          if (passkeySlot) {
            setStep("passkey");
            return;
          }
          setStep("loading");
          await onAuthenticatePasskey?.();
          setStep("success");
          onComplete?.({ mode, method });
          return;
        }
        setStep("loading");
        await onStartChallenge?.(method);
        setStep("verify-code");
        return;
      } catch (error) {
        setErrorReason(mapAuthError(error));
        setStep("error");
      }
    },
    [
      mode,
      onAuthenticatePasskey,
      onComplete,
      onStartChallenge,
      passkeySlot,
      setCode,
      setErrorReason,
      setSelectedMethod,
      setStep,
    ]
  );

  React.useEffect(() => {
    if (controlledStep) return;
    if (mode !== "challenge") return;
    if (step !== "select-method") return;
    if (!autoAdvanceSingleMethod || methodIds.length !== 1) return;
    void goToMethodStep(methodIds[0]!);
  }, [autoAdvanceSingleMethod, controlledStep, goToMethodStep, methodIds, mode, step]);

  const handleVerifyCode = async (value: string) => {
    if (!onVerifyCode || disabled) return;
    setStep("loading");
    try {
      await onVerifyCode({ method: selectedMethod, code: value });
      setStep("success");
      onComplete?.({ mode, method: selectedMethod });
    } catch (error) {
      setErrorReason(mapAuthError(error));
      setStep("error");
    }
  };

  const handleChangeMethod = () => {
    setCode("");
    setStep("select-method");
    onChangeMethod?.();
  };

  const handleCodeExpire = () => {
    setErrorReason("expired");
    setStep("error");
    onCodeExpire?.();
  };

  const handleResend = async () => {
    if (!onResendCode && !onStartChallenge) return;
    setStep("loading");
    try {
      if (onResendCode) await onResendCode();
      else await onStartChallenge?.(selectedMethod);
      setCode("");
      setStep("verify-code");
    } catch (error) {
      setErrorReason(mapAuthError(error));
      setStep("error");
    }
  };

  const changeMethodControl =
    showChangeMethod && mode === "challenge" && step !== "select-method" ? (
      <Button
        type="button"
        size={changeMethodButtonSize}
        variant="quiet"
        leadingIcon={<BackGlyph />}
        disabled={disabled}
        onClick={handleChangeMethod}
        className="dk-two-factor__change-method"
      >
        {changeMethodLabel}
      </Button>
    ) : null;

  const selectMethods = (methods?.length ? methods : DEFAULT_CHALLENGE_METHODS).filter((entry) => {
    const id = typeof entry === "string" ? entry : entry.id;
    return id !== "password" && id !== "magic-link";
  }) as Array<AuthenticationMethodId | AuthenticationMethodOption>;

  if (step === "loading") {
    return (
      <div
        ref={ref}
        id={rootId}
        className={cx("dk-two-factor", "dk-two-factor--loading", `dk-two-factor--${variant}`, className)}
        data-mode={mode}
        data-step="loading"
      >
        {loadingSlot ?? (
          <AuthenticationLoading
            flow={selectedMethod === "passkey" ? "passkey" : "sign-in"}
            variant={variant === "compact" ? "compact" : loadingVariant}
            message={
              loadingMessage ??
              (selectedMethod === "passkey"
                ? "Waiting for passkey"
                : "Verifying second factor")
            }
            description={
              loadingDescription ??
              (selectedMethod === "passkey"
                ? "Complete the passkey prompt on your device…"
                : "Confirming your authentication method…")
            }
          />
        )}
      </div>
    );
  }

  if (step === "success") {
    return (
      <div
        ref={ref}
        id={rootId}
        className={cx("dk-two-factor", "dk-two-factor--success", `dk-two-factor--${variant}`, className)}
        data-mode={mode}
        data-step="success"
      >
        {successSlot ?? (
          <AuthenticationSuccess
            flow="two-factor"
            variant={variant === "compact" ? "compact" : "stacked"}
            title={successTitle ?? (mode === "enroll" ? "Two-factor authentication enabled" : "Verified")}
            description={
              successDescription ??
              (mode === "enroll"
                ? "Your account now requires a second factor when you sign in."
                : "Second-factor verification succeeded. You can continue.")
            }
            onContinue={onContinue}
            continueLabel={continueLabel}
            showContinue={Boolean(onContinue)}
            redirectTo={redirectTo}
            redirectDelay={redirectDelay}
            onRedirect={onRedirect}
            {...successProps}
          />
        )}
      </div>
    );
  }

  if (step === "error") {
    return (
      <div
        ref={ref}
        id={rootId}
        className={cx("dk-two-factor", "dk-two-factor--error", `dk-two-factor--${variant}`, className)}
        data-mode={mode}
        data-step="error"
        data-reason={errorReason}
      >
        {errorSlot ?? (
          <AuthenticationError
            flow="two-factor"
            reason={errorReason}
            variant={errorVariant}
            title={errorTitle}
            description={errorDescription}
            onRetry={() => {
              setCode("");
              if (mode === "enroll") setStep("setup-authenticator");
              else if (selectedMethod === "recovery-code") setStep("recovery-code");
              else if (selectedMethod === "passkey") setStep("passkey");
              else if (OTP_METHODS.has(selectedMethod)) setStep("verify-code");
              else setStep("select-method");
            }}
            showRetry
            onTryAlternative={mode === "challenge" ? handleChangeMethod : undefined}
            alternativeLabel={changeMethodLabel}
            showAlternative={mode === "challenge" && showChangeMethod}
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
        "dk-two-factor",
        `dk-two-factor--${variant}`,
        `dk-two-factor--${mode}`,
        fullWidth && "dk-two-factor--full",
        className
      )}
      data-mode={mode}
      data-step={step}
      data-method={selectedMethod}
    >
      {changeMethodControl}

      {step === "select-method" &&
        (selectMethodSlot ?? (
          <SelectAuthenticationMethod
            variant={variant === "compact" ? "compact" : "stacked"}
            title="Choose a verification method"
            description="Select how you want to complete two-factor authentication."
            methods={selectMethods}
            recommendedMethod={recommendedMethod}
            value={selectedMethod}
            onValueChange={(id) => setSelectedMethod(id)}
            onContinue={async (id) => {
              await goToMethodStep(id);
            }}
            continueLabel="Continue"
            disabled={disabled}
            providers={providers}
            {...selectMethodProps}
          />
        ))}

      {step === "verify-code" &&
        (verifyCodeSlot ??
          renderMethodChallenge?.(selectedMethod) ?? (
            <div className="dk-two-factor__verify">
              <VerificationCodeInput
                flow={verificationFlowFor(selectedMethod)}
                label={verificationCopy(selectedMethod).label}
                description={verificationCopy(selectedMethod).description}
                length={codeLength}
                value={code}
                onValueChange={setCode}
                onComplete={(value) => void handleVerifyCode(value)}
                disabled={disabled}
                autoFocus
                fullWidth={fullWidth}
                footerSlot={
                  <div className="dk-two-factor__verify-footer">
                    {codeExpiresInSeconds != null ? (
                      <CountdownTimer
                        flow="verification"
                        variant="compact"
                        duration={codeExpiresInSeconds}
                        autoStart
                        showControls={false}
                        label="Code expires in"
                        onExpire={handleCodeExpire}
                      />
                    ) : null}
                    {showResend && (onResendCode || onStartChallenge) ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        leadingIcon={<ResendGlyph />}
                        disabled={disabled}
                        onClick={() => void handleResend()}
                      >
                        {resendLabel}
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      size="md"
                      variant="primary"
                      fullWidth={fullWidth}
                      disabled={disabled || code.replace(/\s/g, "").length < Number(codeLength)}
                      onClick={() => void handleVerifyCode(code)}
                      leadingIcon={
                        <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
                          <path
                            d="m4.5 10.5 3.5 3.5 7.5-8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                    >
                      Verify
                    </Button>
                  </div>
                }
                {...verificationCodeProps}
              />
            </div>
          ))}

      {step === "recovery-code" &&
        (recoverySlot ?? (
          <RecoveryCodeLogin
            variant={variant === "compact" ? "compact" : "stacked"}
            disabled={disabled}
            onAuthenticate={onAuthenticateRecoveryCode}
            onSuccess={() => {
              setStep("success");
              onComplete?.({ mode, method: "recovery-code" });
            }}
            onTryAlternative={handleChangeMethod}
            showAlternative={showChangeMethod}
            {...recoveryCodeLoginProps}
          />
        ))}

      {step === "passkey" && passkeySlot}

      {step === "setup-authenticator" &&
        (setupSlot ?? (
          <AuthenticatorAppSetup
            variant={variant === "compact" ? "compact" : "stacked"}
            issuer={issuer}
            accountName={accountName}
            qrSrc={qrSrc}
            secretKey={secretKey}
            expiresInSeconds={qrExpiresInSeconds}
            onQrRefresh={onQrRefresh}
            disabled={disabled}
            {...authenticatorSetupProps}
            onVerify={async (value) => {
              await onEnrollVerify?.(value);
            }}
            onStatusChange={(status) => {
              authenticatorSetupProps?.onStatusChange?.(status);
              if (status === "success") setStep("backup-codes");
              if (status === "failed") {
                setErrorReason("invalid");
                setStep("error");
              }
            }}
          />
        ))}

      {step === "backup-codes" &&
        (backupCodesSlot ?? (
          <div className="dk-two-factor__backup">
            <BackupCodes
              codes={backupCodes}
              concealUntilReveal
              requireAcknowledgement
              onAcknowledgedChange={(ok) => {
                setBackupAcknowledged(ok);
                onBackupCodesAcknowledged?.(ok);
              }}
              onRegenerate={onBackupCodesRegenerate}
              disabled={disabled}
              {...backupCodesProps}
            />
            <Button
              type="button"
              size="md"
              variant="primary"
              fullWidth={fullWidth}
              disabled={disabled || !backupAcknowledged}
              onClick={() => {
                setStep("success");
                onComplete?.({ mode, method: "authenticator-app" });
              }}
              leadingIcon={
                <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
                  <path
                    d="m4.5 10.5 3.5 3.5 7.5-8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              Finish setup
            </Button>
          </div>
        ))}
    </div>
  );
});

TwoFactorAuthentication.displayName = "TwoFactorAuthentication";
export default TwoFactorAuthentication;
