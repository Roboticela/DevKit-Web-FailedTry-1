import * as React from "react";
import {
  Card,
  type CardVariant,
} from "../../../../../../../card/nextjs-compact/v1/files/components/ui/Card";
import {
  Form,
} from "../../../../../../../form/nextjs-compact/v1/files/components/ui/Form";
import {
  TextInput,
  type TextInputSize,
  type TextInputType,
  type TextInputValidation,
} from "../../../../../../../text-input/nextjs-compact/v1/files/components/ui/TextInput";
import {
  PasswordInput,
  type PasswordInputSize,
  type PasswordInputValidation,
} from "../../../../../../../password-input/nextjs-compact/v1/files/components/ui/PasswordInput";
import { Checkbox } from "../../../../../../../checkbox/nextjs-compact/v1/files/components/ui/Checkbox";
import { Link } from "../../../../../../../link/nextjs-compact/v1/files/components/ui/Link";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import {
  Alert,
  type AlertAction,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/nextjs-compact/v1/files/components/ui/Alert";
import { Icon, type IconSize } from "../../../../../../../icon/nextjs-compact/v1/files/components/ui/Icon";
import {
  ContinueWithProvider,
  type ContinueWithProviderProps,
} from "../../../../../../../continue-with-provider/nextjs-compact/v1/files/components/ui/ContinueWithProvider";
import {
  AuthenticationLoading,
  type AuthenticationLoadingVariant,
} from "../../../../../../../authentication-loading/nextjs-compact/v1/files/components/ui/AuthenticationLoading";
import {
  AuthenticationError,
  type AuthenticationErrorReason,
  type AuthenticationErrorVariant,
} from "../../../../../../../authentication-error/nextjs-compact/v1/files/components/ui/AuthenticationError";
import {
  AuthenticationSuccess,
  type AuthenticationSuccessProps,
} from "../../../../../../../authentication-success/nextjs-compact/v1/files/components/ui/AuthenticationSuccess";

/**
 * Login Form — modern SaaS sign-in.
 * Composes Form, Text Input, Password Input (with Password Visibility Toggle),
 * Checkbox, Link, Card, Alert, Icon, Button, Continue With Provider,
 * Authentication Loading / Error / Success.
 * Never recreate those primitives.
 */

export type LoginFormStatus = "idle" | "loading" | "success" | "error";

export type LoginFormVariant = "stacked" | "compact" | "split";

export type LoginIdentifierMode = "email" | "username" | "email-or-username";

export type LoginFormProvider = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onContinue?: ContinueWithProviderProps["onContinue"];
  state?: ContinueWithProviderProps["state"];
  disabled?: boolean;
};

export type LoginFormSubmitPayload = {
  identifier: string;
  password: string;
  rememberMe: boolean;
};

export type LoginFormProps = {
  variant?: LoginFormVariant;
  cardVariant?: CardVariant;
  status?: LoginFormStatus;
  defaultStatus?: LoginFormStatus;
  onStatusChange?: (status: LoginFormStatus) => void;
  identifierMode?: LoginIdentifierMode;
  identifier?: string;
  defaultIdentifier?: string;
  onIdentifierChange?: (value: string) => void;
  password?: string;
  defaultPassword?: string;
  onPasswordChange?: (value: string) => void;
  rememberMe?: boolean;
  defaultRememberMe?: boolean;
  onRememberMeChange?: (value: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  identifierLabel?: string;
  identifierPlaceholder?: string;
  identifierHelpText?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  rememberMeLabel?: string;
  showRememberMe?: boolean;
  forgotPasswordHref?: string;
  forgotPasswordLabel?: string;
  showForgotPassword?: boolean;
  onForgotPassword?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  submitLabel?: string;
  submitLoadingLabel?: string;
  /**
   * Sign in with identifier + password.
   * Resolve → success; reject with `{ reason }` → Authentication Error.
   */
  onSubmit?: (payload: LoginFormSubmitPayload) => void | Promise<void>;
  onSuccess?: (payload: LoginFormSubmitPayload) => void;
  onContinue?: () => void;
  continueLabel?: string;
  redirectTo?: string;
  redirectDelay?: number;
  onRedirect?: () => void;
  providers?: LoginFormProvider[];
  showProviders?: boolean;
  providersDividerLabel?: React.ReactNode | false;
  identifierValidation?: TextInputValidation;
  identifierErrorMessage?: string;
  passwordValidation?: PasswordInputValidation;
  passwordErrorMessage?: string;
  errorReason?: AuthenticationErrorReason;
  defaultErrorReason?: AuthenticationErrorReason;
  onErrorReasonChange?: (reason: AuthenticationErrorReason) => void;
  errorTitle?: React.ReactNode;
  errorDescription?: React.ReactNode;
  successTitle?: React.ReactNode;
  successDescription?: React.ReactNode;
  disableSubmitWhenInvalid?: boolean;
  submitButtonSize?: ButtonSize;
  submitButtonVariant?: ButtonVariant;
  inputSize?: TextInputSize | PasswordInputSize;
  iconSize?: IconSize;
  density?: AlertDensity;
  live?: AlertLive;
  loadingVariant?: AuthenticationLoadingVariant;
  errorVariant?: AuthenticationErrorVariant;
  fullWidth?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  guidanceActions?: AlertAction[];
  showGuidance?: boolean;
  guidanceTitle?: React.ReactNode;
  guidanceMessage?: React.ReactNode;
  headerSlot?: React.ReactNode;
  guidanceSlot?: React.ReactNode;
  identifierSlot?: React.ReactNode;
  passwordSlot?: React.ReactNode;
  optionsSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  providerSlot?: React.ReactNode;
  loadingSlot?: React.ReactNode;
  errorSlot?: React.ReactNode;
  successSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  successProps?: Partial<AuthenticationSuccessProps>;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmailGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="4.5" width="14.5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6.5 6.5 4.5 6.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 16.5a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="4.5" y="8.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 8.5V6.5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SignInGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M8.5 4.5H5.75A1.25 1.25 0 0 0 4.5 5.75v8.5c0 .69.56 1.25 1.25 1.25H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.5 10h5M13 7.5 15.5 10 13 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KeyGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M9 8h4.5M11.75 6.5v3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function mapLoginError(error: unknown): AuthenticationErrorReason {
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
    if (msg.includes("network")) return "network";
    if (msg.includes("cancel")) return "canceled";
    if (msg.includes("invalid") || msg.includes("incorrect") || msg.includes("credential") || msg.includes("password")) {
      return "invalid";
    }
  }
  return "invalid";
}

function validateIdentifier(value: string, mode: LoginIdentifierMode): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    if (mode === "username") return "Enter your username";
    if (mode === "email") return "Enter your email";
    return "Enter your email or username";
  }
  if (mode === "email" && !EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address";
  }
  return null;
}

function validatePassword(value: string): string | null {
  if (!value) return "Enter your password";
  return null;
}

function identifierDefaults(mode: LoginIdentifierMode): {
  label: string;
  placeholder: string;
  type: TextInputType;
  autoComplete: string;
  icon: React.ReactNode;
} {
  switch (mode) {
    case "username":
      return {
        label: "Username",
        placeholder: "your-username",
        type: "username",
        autoComplete: "username",
        icon: <UserGlyph />,
      };
    case "email":
      return {
        label: "Email",
        placeholder: "you@company.com",
        type: "email",
        autoComplete: "email",
        icon: <EmailGlyph />,
      };
    case "email-or-username":
    default:
      return {
        label: "Email or username",
        placeholder: "you@company.com",
        type: "username",
        autoComplete: "username",
        icon: <UserGlyph />,
      };
  }
}

export const LoginForm = React.forwardRef<HTMLDivElement, LoginFormProps>(function LoginForm(
  {
    variant = "stacked",
    cardVariant = "outlined",
    status: statusProp,
    defaultStatus = "idle",
    onStatusChange,
    identifierMode = "email",
    identifier: identifierProp,
    defaultIdentifier = "",
    onIdentifierChange,
    password: passwordProp,
    defaultPassword = "",
    onPasswordChange,
    rememberMe: rememberMeProp,
    defaultRememberMe = false,
    onRememberMeChange,
    title = "Sign in",
    description = "Welcome back. Enter your credentials to continue.",
    identifierLabel,
    identifierPlaceholder,
    identifierHelpText,
    passwordLabel = "Password",
    passwordPlaceholder = "Enter your password",
    rememberMeLabel = "Remember me",
    showRememberMe = true,
    forgotPasswordHref = "/forgot-password",
    forgotPasswordLabel = "Forgot password?",
    showForgotPassword = true,
    onForgotPassword,
    submitLabel = "Sign in",
    submitLoadingLabel = "Signing in",
    onSubmit,
    onSuccess,
    onContinue,
    continueLabel = "Continue",
    redirectTo,
    redirectDelay,
    onRedirect,
    providers,
    showProviders = true,
    providersDividerLabel = "Or continue with",
    identifierValidation: identifierValidationProp,
    identifierErrorMessage: identifierErrorMessageProp,
    passwordValidation: passwordValidationProp,
    passwordErrorMessage: passwordErrorMessageProp,
    errorReason: errorReasonProp,
    defaultErrorReason = "invalid",
    onErrorReasonChange,
    errorTitle,
    errorDescription,
    successTitle = "Signed in",
    successDescription = "You’re signed in. Continuing to your workspace.",
    disableSubmitWhenInvalid = true,
    submitButtonSize = "md",
    submitButtonVariant = "primary",
    inputSize = "md",
    iconSize = "md",
    density = "standard",
    live,
    loadingVariant = "stacked",
    errorVariant = "stacked",
    fullWidth = true,
    disabled = false,
    autoFocus = true,
    guidanceActions,
    showGuidance = false,
    guidanceTitle = "Enterprise sign-in",
    guidanceMessage = "Use your work email and password, or continue with your organization provider.",
    headerSlot,
    guidanceSlot,
    identifierSlot,
    passwordSlot,
    optionsSlot,
    actionSlot,
    providerSlot,
    loadingSlot,
    errorSlot,
    successSlot,
    footerSlot,
    successProps,
    className = "",
    id,
  },
  ref
) {
  const reactId = React.useId();
  const rootId = id ?? `dk-login-form-${reactId}`;
  const defaults = identifierDefaults(identifierMode);

  const controlledStatus = statusProp !== undefined;
  const [uncontrolledStatus, setUncontrolledStatus] = React.useState<LoginFormStatus>(defaultStatus);
  const status = controlledStatus ? statusProp! : uncontrolledStatus;

  const setStatus = React.useCallback(
    (next: LoginFormStatus) => {
      if (!controlledStatus) setUncontrolledStatus(next);
      onStatusChange?.(next);
    },
    [controlledStatus, onStatusChange]
  );

  const controlledIdentifier = identifierProp !== undefined;
  const [uncontrolledIdentifier, setUncontrolledIdentifier] = React.useState(defaultIdentifier);
  const identifier = controlledIdentifier ? identifierProp! : uncontrolledIdentifier;

  const setIdentifier = React.useCallback(
    (next: string) => {
      if (!controlledIdentifier) setUncontrolledIdentifier(next);
      onIdentifierChange?.(next);
    },
    [controlledIdentifier, onIdentifierChange]
  );

  const controlledPassword = passwordProp !== undefined;
  const [uncontrolledPassword, setUncontrolledPassword] = React.useState(defaultPassword);
  const password = controlledPassword ? passwordProp! : uncontrolledPassword;

  const setPassword = React.useCallback(
    (next: string) => {
      if (!controlledPassword) setUncontrolledPassword(next);
      onPasswordChange?.(next);
    },
    [controlledPassword, onPasswordChange]
  );

  const controlledRemember = rememberMeProp !== undefined;
  const [uncontrolledRemember, setUncontrolledRemember] = React.useState(defaultRememberMe);
  const rememberMe = controlledRemember ? rememberMeProp! : uncontrolledRemember;

  const setRememberMe = React.useCallback(
    (next: boolean) => {
      if (!controlledRemember) setUncontrolledRemember(next);
      onRememberMeChange?.(next);
    },
    [controlledRemember, onRememberMeChange]
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

  const [touched, setTouched] = React.useState({ identifier: false, password: false });

  const identifierError = validateIdentifier(identifier, identifierMode);
  const passwordError = validatePassword(password);
  const showIdentifierError = identifierValidationProp
    ? identifierValidationProp === "error"
    : touched.identifier && Boolean(identifierError);
  const showPasswordError = passwordValidationProp
    ? passwordValidationProp === "error"
    : touched.password && Boolean(passwordError);

  const identifierValidation: TextInputValidation =
    identifierValidationProp ?? (showIdentifierError ? "error" : "none");
  const passwordValidation: PasswordInputValidation =
    passwordValidationProp ?? (showPasswordError ? "error" : "none");

  const formValid = !identifierError && !passwordError;
  const loading = status === "loading";
  const formDisabled = disabled || loading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ identifier: true, password: true });
    if (disableSubmitWhenInvalid && !formValid) return;
    if (!onSubmit || formDisabled) return;

    const payload: LoginFormSubmitPayload = {
      identifier: identifier.trim(),
      password,
      rememberMe,
    };

    setStatus("loading");
    try {
      await onSubmit(payload);
      setPassword("");
      setStatus("success");
      onSuccess?.(payload);
    } catch (error) {
      setErrorReason(mapLoginError(error));
      setStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <div
        ref={ref}
        id={rootId}
        className={cx("dk-login-form", "dk-login-form--loading", `dk-login-form--${variant}`, className)}
        data-status="loading"
      >
        {loadingSlot ?? (
          <AuthenticationLoading
            flow="sign-in"
            variant={variant === "compact" ? "compact" : loadingVariant}
            message="Signing you in"
            description="Checking your credentials…"
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
        className={cx("dk-login-form", "dk-login-form--error", `dk-login-form--${variant}`, className)}
        data-status="error"
        data-reason={errorReason}
      >
        {errorSlot ?? (
          <AuthenticationError
            flow="sign-in"
            reason={errorReason}
            variant={errorVariant}
            title={errorTitle}
            description={errorDescription}
            density={density}
            live={live ?? "assertive"}
            onRetry={() => setStatus("idle")}
            showRetry
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
        className={cx("dk-login-form", "dk-login-form--success", `dk-login-form--${variant}`, className)}
        data-status="success"
      >
        {successSlot ?? (
          <AuthenticationSuccess
            flow="sign-in"
            variant={variant === "compact" ? "compact" : "stacked"}
            title={successTitle}
            description={successDescription}
            density={density}
            live={live ?? "polite"}
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

  const form = (
    <Form
      className="dk-login-form__form"
      title={undefined}
      disabled={formDisabled}
      loading={loading}
      onSubmit={(event) => void handleSubmit(event)}
      errorSummary={
        showIdentifierError || showPasswordError
          ? [showIdentifierError ? identifierError : null, showPasswordError ? passwordError : null]
              .filter(Boolean)
              .join(" ")
          : undefined
      }
      errorTitle="Check your sign-in details"
      density={density}
      live={live ?? "assertive"}
    >
      <Form.Fields>
        {identifierSlot ?? (
          <TextInput
            label={identifierLabel ?? defaults.label}
            placeholder={identifierPlaceholder ?? defaults.placeholder}
            helpText={identifierHelpText}
            type={defaults.type}
            autoComplete={defaults.autoComplete}
            name={identifierMode === "email" ? "email" : "username"}
            value={identifier}
            onValueChange={setIdentifier}
            onBlur={() => setTouched((prev) => ({ ...prev, identifier: true }))}
            size={inputSize}
            validation={identifierValidation}
            errorMessage={identifierErrorMessageProp ?? (showIdentifierError ? identifierError ?? undefined : undefined)}
            leadingIcon={defaults.icon}
            disabled={formDisabled}
            fullWidth={fullWidth}
            autoFocus={autoFocus}
            required
            inputMode={identifierMode === "email" ? "email" : "text"}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
        )}

        {passwordSlot ?? (
          <PasswordInput
            label={passwordLabel}
            placeholder={passwordPlaceholder}
            purpose="current"
            name="password"
            value={password}
            onValueChange={setPassword}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            size={inputSize}
            validation={passwordValidation}
            errorMessage={passwordErrorMessageProp ?? (showPasswordError ? passwordError ?? undefined : undefined)}
            disabled={formDisabled}
            fullWidth={fullWidth}
            required
            visibilityToggle
          />
        )}

        {optionsSlot ?? (
          <div className="dk-login-form__options">
            {showRememberMe ? (
              <Checkbox
                label={rememberMeLabel}
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                disabled={formDisabled}
                size="sm"
                name="remember-me"
              />
            ) : (
              <span />
            )}
            {showForgotPassword ? (
              <Link
                href={forgotPasswordHref}
                variant="standalone"
                tone="accent"
                leadingIcon={<KeyGlyph />}
                className="dk-login-form__forgot"
                onClick={onForgotPassword}
              >
                {forgotPasswordLabel}
              </Link>
            ) : null}
          </div>
        )}
      </Form.Fields>

      {actionSlot ?? (
        <Form.Actions>
          <Button
            type="submit"
            size={submitButtonSize}
            variant={submitButtonVariant}
            leadingIcon={<SignInGlyph />}
            fullWidth={fullWidth}
            disabled={formDisabled || (disableSubmitWhenInvalid && !formValid)}
            loading={loading}
            loadingLabel={submitLoadingLabel}
          >
            {submitLabel}
          </Button>
        </Form.Actions>
      )}

      {providerSlot ??
        (showProviders && providers && providers.length > 0 ? (
          <Form.Footer>
            <ContinueWithProvider.Group
              orientation="stacked"
              dividerLabel={providersDividerLabel}
              showDivider={providersDividerLabel !== false}
            >
              {providers.map((provider) => (
                <ContinueWithProvider
                  key={provider.id}
                  provider={provider.id}
                  label={provider.label}
                  icon={provider.icon}
                  state={
                    formDisabled || provider.disabled
                      ? "disabled"
                      : provider.state
                  }
                  fullWidth={fullWidth}
                  onContinue={provider.onContinue}
                />
              ))}
            </ContinueWithProvider.Group>
          </Form.Footer>
        ) : null)}

      {footerSlot}
    </Form>
  );

  return (
    <div
      ref={ref}
      id={rootId}
      className={cx(
        "dk-login-form",
        `dk-login-form--${variant}`,
        fullWidth && "dk-login-form--full",
        className
      )}
      data-status="idle"
      data-variant={variant}
    >
      <Card variant={cardVariant} className="dk-login-form__card">
        {headerSlot ?? (
          <Card.Header className="dk-login-form__header">
            <div className="dk-login-form__title-row">
              <Icon size={iconSize} className="dk-login-form__title-icon">
                <LockGlyph />
              </Icon>
              <Card.Title>{title}</Card.Title>
            </div>
            {description ? <Card.Description>{description}</Card.Description> : null}
          </Card.Header>
        )}

        <Card.Body className="dk-login-form__body">
          {guidanceSlot ??
            (showGuidance ? (
              <Alert
                variant="informational"
                density={density}
                live={live ?? "polite"}
                title={guidanceTitle}
                icon={<LockGlyph />}
                actions={guidanceActions}
              >
                {guidanceMessage}
              </Alert>
            ) : null)}

          {variant === "split" ? (
            <div className="dk-login-form__split">{form}</div>
          ) : (
            form
          )}
        </Card.Body>
      </Card>
    </div>
  );
});

LoginForm.displayName = "LoginForm";
export default LoginForm;
