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
import {
  AuthenticationLoading,
  type AuthenticationLoadingVariant,
} from "../../../../../../../authentication-loading/vite-express-tauri/v1/files/src/components/ui/AuthenticationLoading";
import {
  AuthenticationError,
  type AuthenticationErrorReason,
  type AuthenticationErrorVariant,
} from "../../../../../../../authentication-error/vite-express-tauri/v1/files/src/components/ui/AuthenticationError";
import {
  AuthenticationSuccess,
  type AuthenticationSuccessVariant,
} from "../../../../../../../authentication-success/vite-express-tauri/v1/files/src/components/ui/AuthenticationSuccess";

/**
 * Passkey Login — WebAuthn passwordless sign-in.
 * Composes Button, Card, Alert, Authentication Loading / Error / Success.
 * Do not recreate auth status chrome.
 */

/**
 * Platform / roaming authenticator hints shown in the idle compatibility list.
 */
export type PasskeyAuthenticatorKind =
  | "face-id"
  | "touch-id"
  | "windows-hello"
  | "android-credential-manager"
  | "security-key"
  | "browser-passkey";

/**
 * - `idle` — ready to start ceremony
 * - `loading` — waiting on authenticator (Authentication Loading)
 * - `success` — Authentication Success
 * - `error` — Authentication Error
 * - `unsupported` — browser / platform lacks WebAuthn passkeys
 */
export type PasskeyLoginStatus = "idle" | "loading" | "success" | "error" | "unsupported";

/**
 * - `stacked` — card with intro + primary action (default)
 * - `compact` — dense card
 * - `split` — intro Alert in header; body hosts status / action
 */
export type PasskeyLoginVariant = "stacked" | "compact" | "split";

export type PasskeySupportInfo = {
  supported: boolean;
  platformAuthenticator: boolean | null;
  conditionalMediation: boolean | null;
};

export type PasskeyLoginProps = {
  variant?: PasskeyLoginVariant;
  cardVariant?: CardVariant;
  status?: PasskeyLoginStatus;
  defaultStatus?: PasskeyLoginStatus;
  onStatusChange?: (status: PasskeyLoginStatus) => void;
  /** Error reason when `status="error"`. */
  errorReason?: AuthenticationErrorReason;
  defaultErrorReason?: AuthenticationErrorReason;
  onErrorReasonChange?: (reason: AuthenticationErrorReason) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Authenticator kinds listed under compatibility. */
  authenticators?: PasskeyAuthenticatorKind[];
  showAuthenticatorList?: boolean;
  showCompatibilityAlert?: boolean;
  /** Auto-detect WebAuthn support on mount. Default: `true`. */
  detectSupport?: boolean;
  /**
   * Host-run WebAuthn ceremony (`navigator.credentials.get` / create).
   * Resolve → success; reject → error (AbortError → canceled; Timeout → expired).
   */
  onAuthenticate?: () => void | Promise<void>;
  /** Optional client-side timeout around `onAuthenticate`. */
  timeoutMs?: number;
  onCancel?: () => void;
  showCancel?: boolean;
  /** Fallback when passkeys fail or are unsupported. */
  onFallback?: () => void;
  fallbackLabel?: string;
  showFallback?: boolean;
  onRetry?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  redirectTo?: string;
  redirectDelay?: number;
  onRedirect?: () => void;
  authenticateLabel?: string;
  authenticateLoadingLabel?: string;
  cancelLabel?: string;
  unsupportedTitle?: React.ReactNode;
  unsupportedDescription?: React.ReactNode;
  errorMessage?: React.ReactNode;
  authenticateButtonSize?: ButtonSize;
  authenticateButtonVariant?: ButtonVariant;
  cancelButtonSize?: ButtonSize;
  cancelButtonVariant?: ButtonVariant;
  fallbackButtonSize?: ButtonSize;
  fallbackButtonVariant?: ButtonVariant;
  loadingVariant?: AuthenticationLoadingVariant;
  errorVariant?: AuthenticationErrorVariant;
  successVariant?: AuthenticationSuccessVariant;
  density?: AlertDensity;
  live?: AlertLive;
  fullWidth?: boolean;
  disabled?: boolean;
  actions?: AlertAction[];
  actionSlot?: React.ReactNode;
  alertSlot?: React.ReactNode;
  cardSlot?: React.ReactNode;
  loadingSlot?: React.ReactNode;
  errorSlot?: React.ReactNode;
  successSlot?: React.ReactNode;
  authenticatorSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  icon?: React.ReactNode;
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
      <path d="M7 8.25v.5M13 8.25v.5M7.5 12.25c.75.9 1.75 1.35 2.5 1.35s1.75-.45 2.5-1.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
      <path d="M3.5 3.5h5.75v5.75H3.5zM10.75 3.5H16.5v5.75h-5.75zM3.5 10.75h5.75V16.5H3.5zM10.75 10.75H16.5V16.5h-5.75z" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M6.5 8.5h7v6.25a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5V8.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.25 5.75 8.5 7.5M12.75 5.75 11.5 7.5M5 10.5v3M15 10.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

const AUTHENTICATOR_META: Record<
  PasskeyAuthenticatorKind,
  { label: string; icon: React.ReactNode }
> = {
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

/** Detect WebAuthn / platform authenticator availability in the current browser. */
export async function detectPasskeySupport(): Promise<PasskeySupportInfo> {
  if (typeof window === "undefined" || typeof window.PublicKeyCredential === "undefined") {
    return { supported: false, platformAuthenticator: null, conditionalMediation: null };
  }

  let platformAuthenticator: boolean | null = null;
  let conditionalMediation: boolean | null = null;

  try {
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function") {
      platformAuthenticator = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
  } catch {
    platformAuthenticator = null;
  }

  try {
    const pk = PublicKeyCredential as unknown as {
      isConditionalMediationAvailable?: () => Promise<boolean>;
    };
    if (typeof pk.isConditionalMediationAvailable === "function") {
      conditionalMediation = await pk.isConditionalMediationAvailable();
    }
  } catch {
    conditionalMediation = null;
  }

  return { supported: true, platformAuthenticator, conditionalMediation };
}

function mapAuthenticateError(error: unknown): AuthenticationErrorReason {
  if (!error) return "unknown";
  if (typeof error === "object" && error !== null && "name" in error) {
    const name = String((error as { name: string }).name);
    if (name === "AbortError" || name === "NotAllowedError") return "canceled";
    if (name === "TimeoutError") return "expired";
    if (name === "NetworkError") return "network";
    if (name === "SecurityError" || name === "InvalidStateError") return "invalid";
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("timeout") || msg.includes("timed out")) return "expired";
    if (msg.includes("abort") || msg.includes("cancel")) return "canceled";
    if (msg.includes("network")) return "network";
  }
  return "unknown";
}

export const PasskeyLogin = React.forwardRef<HTMLDivElement, PasskeyLoginProps>(
  function PasskeyLogin(
    {
      variant = "stacked",
      cardVariant = "outlined",
      status: statusProp,
      defaultStatus = "idle",
      onStatusChange,
      errorReason: errorReasonProp,
      defaultErrorReason = "unknown",
      onErrorReasonChange,
      title = "Sign in with a passkey",
      description = "Use Face ID, Touch ID, Windows Hello, Android Credential Manager, a security key, or a browser passkey — no password required.",
      authenticators = DEFAULT_AUTHENTICATORS,
      showAuthenticatorList = true,
      showCompatibilityAlert = true,
      detectSupport = true,
      onAuthenticate,
      timeoutMs,
      onCancel,
      showCancel = true,
      onFallback,
      fallbackLabel = "Sign in another way",
      showFallback = true,
      onRetry,
      onContinue,
      continueLabel,
      redirectTo,
      redirectDelay,
      onRedirect,
      authenticateLabel = "Continue with passkey",
      authenticateLoadingLabel = "Waiting for authenticator",
      cancelLabel = "Cancel",
      unsupportedTitle = "Passkeys aren’t available here",
      unsupportedDescription = "This browser or device doesn’t support WebAuthn passkeys. Choose another sign-in method.",
      errorMessage,
      authenticateButtonSize = "md",
      authenticateButtonVariant = "primary",
      cancelButtonSize = "sm",
      cancelButtonVariant = "tertiary",
      fallbackButtonSize = "sm",
      fallbackButtonVariant = "secondary",
      loadingVariant = "compact",
      errorVariant = "stacked",
      successVariant = "stacked",
      density,
      live,
      fullWidth = true,
      disabled = false,
      actions,
      actionSlot,
      alertSlot,
      cardSlot,
      loadingSlot,
      errorSlot,
      successSlot,
      authenticatorSlot,
      actionsSlot,
      icon,
      className = "",
      id,
    },
    ref
  ) {
    const controlledStatus = statusProp !== undefined;
    const controlledReason = errorReasonProp !== undefined;

    const [uncontrolledStatus, setUncontrolledStatus] = React.useState<PasskeyLoginStatus>(defaultStatus);
    const [uncontrolledReason, setUncontrolledReason] =
      React.useState<AuthenticationErrorReason>(defaultErrorReason);
    const [support, setSupport] = React.useState<PasskeySupportInfo | null>(null);
    const abortRef = React.useRef<AbortController | null>(null);

    const status = controlledStatus ? statusProp! : uncontrolledStatus;
    const errorReason = controlledReason ? errorReasonProp! : uncontrolledReason;

    const setStatus = React.useCallback(
      (next: PasskeyLoginStatus) => {
        if (!controlledStatus) setUncontrolledStatus(next);
        onStatusChange?.(next);
      },
      [controlledStatus, onStatusChange]
    );

    const setErrorReason = React.useCallback(
      (next: AuthenticationErrorReason) => {
        if (!controlledReason) setUncontrolledReason(next);
        onErrorReasonChange?.(next);
      },
      [controlledReason, onErrorReasonChange]
    );

    React.useEffect(() => {
      if (!detectSupport) return;
      let active = true;
      void detectPasskeySupport().then((info) => {
        if (!active) return;
        setSupport(info);
        if (!info.supported && statusProp === undefined && defaultStatus === "idle") {
          setUncontrolledStatus("unsupported");
          onStatusChange?.("unsupported");
        }
      });
      return () => {
        active = false;
      };
      // Intentionally once on mount for detection.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detectSupport]);

    const runAuthenticate = React.useCallback(async () => {
      if (disabled || status === "loading") return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus("loading");

      try {
        const work = Promise.resolve(onAuthenticate?.());
        if (timeoutMs && timeoutMs > 0) {
          await Promise.race([
            work,
            new Promise<never>((_, reject) => {
              const timer = window.setTimeout(() => {
                const err = new Error("Passkey authentication timed out");
                err.name = "TimeoutError";
                reject(err);
              }, timeoutMs);
              controller.signal.addEventListener("abort", () => {
                window.clearTimeout(timer);
                const err = new Error("Passkey authentication canceled");
                err.name = "AbortError";
                reject(err);
              });
            }),
          ]);
        } else {
          await work;
        }
        if (controller.signal.aborted) {
          setErrorReason("canceled");
          setStatus("error");
          return;
        }
        setStatus("success");
      } catch (cause) {
        if (controller.signal.aborted) {
          setErrorReason("canceled");
          setStatus("error");
          return;
        }
        setErrorReason(mapAuthenticateError(cause));
        setStatus("error");
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    }, [disabled, onAuthenticate, setErrorReason, setStatus, status, timeoutMs]);

    const handleCancel = React.useCallback(() => {
      abortRef.current?.abort();
      onCancel?.();
      setErrorReason("canceled");
      setStatus("error");
    }, [onCancel, setErrorReason, setStatus]);

    const handleRetry = React.useCallback(() => {
      if (onRetry) {
        onRetry();
        return;
      }
      void runAuthenticate();
    }, [onRetry, runAuthenticate]);

    const compatibilityNode =
      alertSlot !== undefined
        ? alertSlot
        : showCompatibilityAlert && status === "idle"
          ? (
              <Alert
                variant="informational"
                density={variant === "compact" ? "compact" : density}
                title={title}
                icon={icon ?? <PasskeyIcon />}
                live={live ?? "polite"}
                actions={actions}
                actionSlot={actionSlot}
              >
                {description}
                {support?.supported === false
                  ? " WebAuthn was not detected in this environment."
                  : support?.platformAuthenticator === false
                    ? " A platform authenticator was not detected; a security key or browser passkey may still work."
                    : null}
              </Alert>
            )
          : status === "unsupported"
            ? (
                <Alert
                  variant="warning"
                  density={variant === "compact" ? "compact" : density}
                  title={unsupportedTitle}
                  icon={icon ?? <PasskeyIcon />}
                  live={live ?? "assertive"}
                  actions={actions}
                  actionSlot={actionSlot}
                >
                  {unsupportedDescription}
                </Alert>
              )
            : null;

    const authenticatorList =
      authenticatorSlot !== undefined
        ? authenticatorSlot
        : showAuthenticatorList && (status === "idle" || status === "unsupported")
          ? (
              <ul className="dk-passkey-login__authenticators" aria-label="Supported authenticators">
                {authenticators.map((kind) => {
                  const meta = AUTHENTICATOR_META[kind];
                  return (
                    <li key={kind} className="dk-passkey-login__authenticator">
                      <span className="dk-passkey-login__authenticator-icon" aria-hidden="true">
                        {meta.icon}
                      </span>
                      <span>{meta.label}</span>
                    </li>
                  );
                })}
              </ul>
            )
          : null;

    const statusNode =
      status === "loading"
        ? loadingSlot !== undefined
          ? loadingSlot
          : (
              <AuthenticationLoading
                flow="passkey"
                variant={loadingVariant}
                message={authenticateLoadingLabel}
              />
            )
        : status === "error"
          ? errorSlot !== undefined
            ? errorSlot
            : (
                <AuthenticationError
                  flow="passkey"
                  reason={errorReason}
                  variant={errorVariant}
                  errorMessage={errorMessage}
                  onRetry={handleRetry}
                  onTryAlternative={onFallback}
                  alternativeLabel={fallbackLabel}
                  showAlternative={showFallback && Boolean(onFallback)}
                  showRetry
                />
              )
          : status === "success"
            ? successSlot !== undefined
              ? successSlot
              : (
                  <AuthenticationSuccess
                    flow="passkey"
                    variant={successVariant}
                    onContinue={onContinue}
                    continueLabel={continueLabel}
                    redirectTo={redirectTo}
                    redirectDelay={redirectDelay}
                    onRedirect={onRedirect}
                    showContinue={Boolean(onContinue) || Boolean(redirectTo)}
                  />
                )
            : null;

    const primaryActions =
      actionsSlot !== undefined
        ? actionsSlot
        : status === "idle"
          ? (
              <Card.Actions className="dk-passkey-login__actions">
                <Button
                  type="button"
                  size={authenticateButtonSize}
                  variant={authenticateButtonVariant}
                  leadingIcon={icon ?? <PasskeyIcon />}
                  loading={false}
                  disabled={disabled}
                  fullWidth={fullWidth}
                  onClick={() => {
                    void runAuthenticate();
                  }}
                >
                  {authenticateLabel}
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
              </Card.Actions>
            )
          : status === "loading"
            ? (
                <Card.Actions className="dk-passkey-login__actions">
                  {showCancel ? (
                    <Button
                      type="button"
                      size={cancelButtonSize}
                      variant={cancelButtonVariant}
                      fullWidth={fullWidth}
                      onClick={handleCancel}
                    >
                      {cancelLabel}
                    </Button>
                  ) : null}
                </Card.Actions>
              )
            : status === "unsupported" && showFallback && onFallback
              ? (
                  <Card.Actions className="dk-passkey-login__actions">
                    <Button
                      type="button"
                      size={fallbackButtonSize}
                      variant={authenticateButtonVariant}
                      leadingIcon={<PasskeyIcon />}
                      fullWidth={fullWidth}
                      onClick={onFallback}
                    >
                      {fallbackLabel}
                    </Button>
                  </Card.Actions>
                )
              : null;

    const body = (
      <>
        {variant !== "split" && status === "idle" && !showCompatibilityAlert ? (
          <div className="dk-passkey-login__intro">
            <Card.Title as="h2">{title}</Card.Title>
            {description ? <Card.Description>{description}</Card.Description> : null}
          </div>
        ) : null}
        {variant !== "split" && compatibilityNode ? (
          <div className="dk-passkey-login__alert">{compatibilityNode}</div>
        ) : null}
        {authenticatorList}
        {statusNode ? <div className="dk-passkey-login__status">{statusNode}</div> : null}
      </>
    );

    const cardInner = (
      <>
        {variant === "split" && compatibilityNode ? (
          <Card.Header className="dk-passkey-login__header">{compatibilityNode}</Card.Header>
        ) : null}
        <Card.Body className="dk-passkey-login__body">{body}</Card.Body>
        {primaryActions ? (
          <Card.Footer className="dk-passkey-login__footer">{primaryActions}</Card.Footer>
        ) : null}
      </>
    );

    const cardNode =
      cardSlot !== undefined ? (
        cardSlot
      ) : (
        <Card
          variant={cardVariant}
          className="dk-passkey-login__card"
          aria-label={typeof title === "string" ? title : "Passkey login"}
        >
          {cardInner}
        </Card>
      );

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-passkey-login",
          `dk-passkey-login--${variant}`,
          `dk-passkey-login--${status}`,
          disabled && "dk-passkey-login--disabled",
          className
        )}
        data-variant={variant}
        data-status={status}
        data-error-reason={status === "error" ? errorReason : undefined}
        data-platform-authenticator={
          support?.platformAuthenticator == null ? undefined : String(support.platformAuthenticator)
        }
        role="region"
        aria-label={typeof title === "string" ? title : "Passkey login"}
        aria-busy={status === "loading" || undefined}
      >
        {cardNode}
      </div>
    );
  }
);

PasskeyLogin.displayName = "PasskeyLogin";
export default PasskeyLogin;
