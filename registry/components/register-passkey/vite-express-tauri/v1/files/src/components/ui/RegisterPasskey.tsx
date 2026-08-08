import * as React from "react";
import {
  Alert,
  type AlertAction,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/vite-express-tauri/v1/files/src/components/ui/Alert";
import { Card, type CardVariant } from "../../../../../../../card/vite-express-tauri/v1/files/src/components/ui/Card";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import { AuthenticationLoading } from "../../../../../../../authentication-loading/vite-express-tauri/v1/files/src/components/ui/AuthenticationLoading";
import { AuthenticationError } from "../../../../../../../authentication-error/vite-express-tauri/v1/files/src/components/ui/AuthenticationError";
import { AuthenticationSuccess } from "../../../../../../../authentication-success/vite-express-tauri/v1/files/src/components/ui/AuthenticationSuccess";
import {
  PasskeyLogin,
  detectPasskeySupport,
  type PasskeyAuthenticatorKind,
  type PasskeyLoginProps,
  type PasskeyLoginStatus,
  type PasskeyLoginVariant,
  type PasskeySupportInfo,
} from "../../../../../../../passkey-login/vite-express-tauri/v1/files/src/components/ui/PasskeyLogin";

/**
 * Register Passkey — WebAuthn credential registration.
 * Composes Passkey Login for the ceremony (no duplicated WebAuthn UI) plus
 * Button, Card, Alert, and Authentication Loading / Error / Success for
 * confirmation and support checks.
 */

export type {
  PasskeyAuthenticatorKind,
  PasskeyLoginStatus,
  PasskeyLoginVariant,
  PasskeySupportInfo,
};

export { detectPasskeySupport };

/**
 * - `confirm` — review devices / compatibility before creating
 * - `register` — Passkey Login ceremony (`navigator.credentials.create`)
 */
export type RegisterPasskeyStep = "confirm" | "register";

export type RegisterPasskeyProps = {
  variant?: PasskeyLoginVariant;
  cardVariant?: CardVariant;
  /** Controlled step. */
  step?: RegisterPasskeyStep;
  defaultStep?: RegisterPasskeyStep;
  onStepChange?: (step: RegisterPasskeyStep) => void;
  /** Skip the confirmation card and go straight to Passkey Login. Default: `false`. */
  skipConfirmation?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmTitle?: React.ReactNode;
  confirmDescription?: React.ReactNode;
  /** Optional account / device label shown in confirmation copy. */
  accountLabel?: string;
  authenticators?: PasskeyAuthenticatorKind[];
  showAuthenticatorList?: boolean;
  detectSupport?: boolean;
  /**
   * Host-run WebAuthn **registration** (`navigator.credentials.create`).
   * Forwarded to Passkey Login as `onAuthenticate` — do not reimplement ceremony UI.
   */
  onRegister?: () => void | Promise<void>;
  timeoutMs?: number;
  onCancel?: () => void;
  showCancel?: boolean;
  onFallback?: () => void;
  fallbackLabel?: string;
  showFallback?: boolean;
  onContinue?: () => void;
  continueLabel?: string;
  redirectTo?: string;
  redirectDelay?: number;
  onRedirect?: () => void;
  /** Passkey Login status passthrough (register step). */
  status?: PasskeyLoginStatus;
  onStatusChange?: (status: PasskeyLoginStatus) => void;
  confirmLabel?: string;
  registerLabel?: string;
  cancelLabel?: string;
  confirmButtonSize?: ButtonSize;
  confirmButtonVariant?: ButtonVariant;
  fallbackButtonSize?: ButtonSize;
  fallbackButtonVariant?: ButtonVariant;
  density?: AlertDensity;
  live?: AlertLive;
  fullWidth?: boolean;
  disabled?: boolean;
  actions?: AlertAction[];
  actionSlot?: React.ReactNode;
  /** Slot: replace confirmation Card. */
  confirmationSlot?: React.ReactNode;
  /** Slot: replace Passkey Login ceremony. */
  passkeyLoginSlot?: React.ReactNode;
  /** Extra props forwarded to Passkey Login (register step). */
  passkeyLoginProps?: Omit<
    PasskeyLoginProps,
    | "onAuthenticate"
    | "title"
    | "description"
    | "authenticateLabel"
    | "status"
    | "onStatusChange"
    | "detectSupport"
    | "authenticators"
    | "showAuthenticatorList"
    | "timeoutMs"
    | "onCancel"
    | "showCancel"
    | "onFallback"
    | "fallbackLabel"
    | "showFallback"
    | "onContinue"
    | "continueLabel"
    | "redirectTo"
    | "redirectDelay"
    | "onRedirect"
    | "variant"
    | "cardVariant"
    | "disabled"
    | "fullWidth"
  >;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function PasskeyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.75 10.5 16 15.75M13.5 12.25l2.25 2.25M14.75 11l2.25 2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FaceIdIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.75" y="3.75" width="12.5" height="12.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 8.25v.5M13 8.25v.5M7.5 12.25c.75.9 1.75 1.35 2.5 1.35s1.75-.45 2.5-1.35"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TouchIdIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 3.75a4.75 4.75 0 0 1 4.75 4.75v3.1a4.75 4.75 0 0 1-9.5 0v-3.1A4.75 4.75 0 0 1 10 3.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M10 6.5v5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WindowsHelloIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M3.5 3.5h5.75v5.75H3.5zM10.75 3.5H16.5v5.75h-5.75zM3.5 10.75h5.75V16.5H3.5zM10.75 10.75H16.5V16.5h-5.75z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M6.5 8.5h7v6.25a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5V8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7.25 5.75 8.5 7.5M12.75 5.75 11.5 7.5M5 10.5v3M15 10.5v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SecurityKeyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="7" width="10" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.75 10h4.5M15.5 10v2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6.25" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function BrowserPasskeyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="4.25" width="14.5" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.75 7.25h14.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="12" r="1.75" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

const AUTHENTICATOR_META: Record<PasskeyAuthenticatorKind, { label: string; icon: React.ReactNode }> = {
  "face-id": { label: "Face ID", icon: <FaceIdIcon /> },
  "touch-id": { label: "Touch ID", icon: <TouchIdIcon /> },
  "windows-hello": { label: "Windows Hello", icon: <WindowsHelloIcon /> },
  "android-credential-manager": { label: "Android Credential Manager", icon: <AndroidIcon /> },
  "security-key": { label: "Security key", icon: <SecurityKeyIcon /> },
  "browser-passkey": { label: "Browser passkey", icon: <BrowserPasskeyIcon /> },
};

const DEFAULT_AUTHENTICATORS: PasskeyAuthenticatorKind[] = [
  "face-id",
  "touch-id",
  "windows-hello",
  "android-credential-manager",
  "security-key",
  "browser-passkey",
];

export const RegisterPasskey = React.forwardRef<HTMLDivElement, RegisterPasskeyProps>(
  function RegisterPasskey(
    {
      variant = "stacked",
      cardVariant = "outlined",
      step: stepProp,
      defaultStep,
      onStepChange,
      skipConfirmation = false,
      title = "Register a passkey",
      description = "Create a passkey for passwordless sign-in on this device or security key.",
      confirmTitle,
      confirmDescription,
      accountLabel,
      authenticators = DEFAULT_AUTHENTICATORS,
      showAuthenticatorList = true,
      detectSupport = true,
      onRegister,
      timeoutMs,
      onCancel,
      showCancel = true,
      onFallback,
      fallbackLabel = "Skip for now",
      showFallback = true,
      onContinue,
      continueLabel = "Continue",
      redirectTo,
      redirectDelay,
      onRedirect,
      status,
      onStatusChange,
      confirmLabel = "Create passkey",
      registerLabel = "Create passkey",
      cancelLabel = "Cancel",
      confirmButtonSize = "md",
      confirmButtonVariant = "primary",
      fallbackButtonSize = "sm",
      fallbackButtonVariant = "secondary",
      density,
      live,
      fullWidth = true,
      disabled = false,
      actions,
      actionSlot,
      confirmationSlot,
      passkeyLoginSlot,
      passkeyLoginProps,
      className = "",
      id,
    },
    ref
  ) {
    const initialStep: RegisterPasskeyStep =
      defaultStep ?? (skipConfirmation ? "register" : "confirm");

    const controlledStep = stepProp !== undefined;
    const [uncontrolledStep, setUncontrolledStep] = React.useState<RegisterPasskeyStep>(initialStep);
    const [support, setSupport] = React.useState<PasskeySupportInfo | null>(null);
    const [detecting, setDetecting] = React.useState(detectSupport);
    const [ceremonyStatus, setCeremonyStatus] = React.useState<PasskeyLoginStatus>("idle");

    const step = controlledStep ? stepProp! : uncontrolledStep;
    const resolvedStatus = status ?? ceremonyStatus;

    const setStep = React.useCallback(
      (next: RegisterPasskeyStep) => {
        if (!controlledStep) setUncontrolledStep(next);
        onStepChange?.(next);
      },
      [controlledStep, onStepChange]
    );

    const handleStatusChange = React.useCallback(
      (next: PasskeyLoginStatus) => {
        setCeremonyStatus(next);
        onStatusChange?.(next);
      },
      [onStatusChange]
    );

    React.useEffect(() => {
      if (!detectSupport) {
        setDetecting(false);
        return;
      }
      let active = true;
      setDetecting(true);
      void detectPasskeySupport().then((info) => {
        if (!active) return;
        setSupport(info);
        setDetecting(false);
      });
      return () => {
        active = false;
      };
    }, [detectSupport]);

    const resolvedConfirmTitle = confirmTitle ?? title;
    const resolvedConfirmDescription =
      confirmDescription ??
      (accountLabel
        ? `You’ll register a passkey for ${accountLabel}. Supported authenticators include Face ID, Touch ID, Windows Hello, Android Credential Manager, security keys, and browser passkeys.`
        : description);

    // Support probe — Authentication Loading (do not invent a custom spinner).
    if (detecting) {
      return (
        <div
          ref={ref}
          id={id}
          className={cx("dk-register-passkey", "dk-register-passkey--detecting", className)}
          data-step="detecting"
          role="region"
          aria-label={typeof title === "string" ? title : "Register passkey"}
          aria-busy="true"
        >
          <Card variant={cardVariant} className="dk-register-passkey__card">
            <Card.Body>
              <AuthenticationLoading
                flow="passkey"
                variant="compact"
                message="Checking passkey support"
                description="Verifying WebAuthn and platform authenticator availability…"
              />
            </Card.Body>
          </Card>
        </div>
      );
    }

    // Unsupported — Authentication Error (reuse feedback; do not rebuild).
    if (support && !support.supported) {
      return (
        <div
          ref={ref}
          id={id}
          className={cx("dk-register-passkey", "dk-register-passkey--unsupported", className)}
          data-step="unsupported"
          role="region"
          aria-label={typeof title === "string" ? title : "Register passkey"}
        >
          <Card variant={cardVariant} className="dk-register-passkey__card">
            <Card.Body>
              <AuthenticationError
                flow="passkey"
                reason="unknown"
                title="Passkeys aren’t available here"
                description="This browser or device doesn’t support WebAuthn passkey registration. Choose another security method."
                showRetry={false}
                onTryAlternative={onFallback}
                alternativeLabel={fallbackLabel}
                showAlternative={showFallback && Boolean(onFallback)}
              />
            </Card.Body>
            {showFallback && onFallback ? (
              <Card.Footer>
                <Card.Actions className="dk-register-passkey__actions">
                  <Button
                    type="button"
                    size={fallbackButtonSize}
                    variant={confirmButtonVariant}
                    leadingIcon={<PasskeyIcon />}
                    fullWidth={fullWidth}
                    onClick={onFallback}
                  >
                    {fallbackLabel}
                  </Button>
                </Card.Actions>
              </Card.Footer>
            ) : null}
          </Card>
        </div>
      );
    }

    // Post-success at register-passkey shell when host wants an explicit confirmation layer
    // is handled by Passkey Login's Authentication Success — avoid duplicating here.

    const confirmationNode =
      confirmationSlot !== undefined ? (
        confirmationSlot
      ) : (
        <Card
          variant={cardVariant}
          className="dk-register-passkey__card"
          aria-label={
            typeof resolvedConfirmTitle === "string" ? resolvedConfirmTitle : "Register passkey"
          }
        >
          {variant === "split" ? (
            <Card.Header>
              <Alert
                variant="informational"
                density={variant === "compact" ? "compact" : density}
                title={resolvedConfirmTitle}
                icon={<PasskeyIcon />}
                live={live ?? "polite"}
                actions={actions}
                actionSlot={actionSlot}
              >
                {resolvedConfirmDescription}
                {support?.platformAuthenticator === false
                  ? " A platform authenticator was not detected; a security key or browser passkey may still work."
                  : null}
              </Alert>
            </Card.Header>
          ) : null}
          <Card.Body className="dk-register-passkey__body">
            {variant !== "split" ? (
              <Alert
                variant="informational"
                density={variant === "compact" ? "compact" : density}
                title={resolvedConfirmTitle}
                icon={<PasskeyIcon />}
                live={live ?? "polite"}
                actions={actions}
                actionSlot={actionSlot}
              >
                {resolvedConfirmDescription}
                {support?.platformAuthenticator === false
                  ? " A platform authenticator was not detected; a security key or browser passkey may still work."
                  : null}
              </Alert>
            ) : null}
            {showAuthenticatorList ? (
              <ul className="dk-register-passkey__authenticators" aria-label="Supported authenticators">
                {authenticators.map((kind) => {
                  const meta = AUTHENTICATOR_META[kind];
                  return (
                    <li key={kind} className="dk-register-passkey__authenticator">
                      <span className="dk-register-passkey__authenticator-icon" aria-hidden="true">
                        {meta.icon}
                      </span>
                      <span>{meta.label}</span>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </Card.Body>
          <Card.Footer>
            <Card.Actions className="dk-register-passkey__actions">
              <Button
                type="button"
                size={confirmButtonSize}
                variant={confirmButtonVariant}
                leadingIcon={<PasskeyIcon />}
                disabled={disabled}
                fullWidth={fullWidth}
                onClick={() => setStep("register")}
              >
                {confirmLabel}
              </Button>
              {showFallback && onFallback ? (
                <Button
                  type="button"
                  size={fallbackButtonSize}
                  variant={fallbackButtonVariant}
                  disabled={disabled}
                  fullWidth={fullWidth}
                  onClick={onFallback}
                >
                  {fallbackLabel}
                </Button>
              ) : null}
              {showCancel && onCancel ? (
                <Button
                  type="button"
                  size={fallbackButtonSize}
                  variant="tertiary"
                  disabled={disabled}
                  fullWidth={fullWidth}
                  onClick={onCancel}
                >
                  {cancelLabel}
                </Button>
              ) : null}
            </Card.Actions>
          </Card.Footer>
        </Card>
      );

    const ceremonyNode =
      passkeyLoginSlot !== undefined ? (
        passkeyLoginSlot
      ) : (
        <PasskeyLogin
          variant={variant}
          cardVariant={cardVariant}
          status={status}
          onStatusChange={handleStatusChange}
          title={title}
          description={description}
          authenticators={authenticators}
          showAuthenticatorList={showAuthenticatorList}
          showCompatibilityAlert
          detectSupport={false}
          onAuthenticate={onRegister}
          timeoutMs={timeoutMs}
          onCancel={onCancel}
          showCancel={showCancel}
          onFallback={onFallback}
          fallbackLabel={fallbackLabel}
          showFallback={showFallback}
          onContinue={onContinue}
          continueLabel={continueLabel}
          redirectTo={redirectTo}
          redirectDelay={redirectDelay}
          onRedirect={onRedirect}
          authenticateLabel={registerLabel}
          authenticateLoadingLabel="Waiting to register passkey"
          disabled={disabled}
          fullWidth={fullWidth}
          successSlot={
            <AuthenticationSuccess
              flow="passkey"
              title="Passkey registered"
              description={
                accountLabel
                  ? `A passkey for ${accountLabel} is ready. Use it for passwordless sign-in on supported devices.`
                  : "Your passkey was created. Use it for passwordless sign-in on supported devices."
              }
              onContinue={onContinue}
              continueLabel={continueLabel}
              redirectTo={redirectTo}
              redirectDelay={redirectDelay}
              onRedirect={onRedirect}
              showContinue={Boolean(onContinue) || Boolean(redirectTo)}
            />
          }
          {...passkeyLoginProps}
        />
      );

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-register-passkey",
          `dk-register-passkey--${variant}`,
          `dk-register-passkey--${step}`,
          `dk-register-passkey--${resolvedStatus}`,
          disabled && "dk-register-passkey--disabled",
          className
        )}
        data-variant={variant}
        data-step={step}
        data-status={resolvedStatus}
        data-platform-authenticator={
          support?.platformAuthenticator == null ? undefined : String(support.platformAuthenticator)
        }
        role="region"
        aria-label={typeof title === "string" ? title : "Register passkey"}
      >
        {step === "confirm" && !skipConfirmation ? confirmationNode : ceremonyNode}
      </div>
    );
  }
);

RegisterPasskey.displayName = "RegisterPasskey";
export default RegisterPasskey;
