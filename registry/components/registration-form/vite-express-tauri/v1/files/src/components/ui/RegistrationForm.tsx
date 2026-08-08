import * as React from "react";
import {
  Card,
  type CardVariant,
} from "../../../../../../../card/vite-express-tauri/v1/files/src/components/ui/Card";
import { Form } from "../../../../../../../form/vite-express-tauri/v1/files/src/components/ui/Form";
import {
  TextInput,
  type TextInputSize,
  type TextInputValidation,
} from "../../../../../../../text-input/vite-express-tauri/v1/files/src/components/ui/TextInput";
import {
  PasswordInput,
  type PasswordInputSize,
  type PasswordInputValidation,
} from "../../../../../../../password-input/vite-express-tauri/v1/files/src/components/ui/PasswordInput";
import {
  PasswordStrength,
  type PasswordStrengthLevel,
  type PasswordStrengthVariant,
  defaultPasswordStrengthAlgorithm,
} from "../../../../../../../password-strength/vite-express-tauri/v1/files/src/components/ui/PasswordStrength";
import {
  PasswordRequirements,
  DEFAULT_PASSWORD_REQUIREMENT_RULES,
  type PasswordRequirementRule,
  type PasswordRequirementResult,
  type PasswordRequirementsVariant,
} from "../../../../../../../password-requirements/vite-express-tauri/v1/files/src/components/ui/PasswordRequirements";
import { Checkbox } from "../../../../../../../checkbox/vite-express-tauri/v1/files/src/components/ui/Checkbox";
import { Link } from "../../../../../../../link/vite-express-tauri/v1/files/src/components/ui/Link";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import {
  Alert,
  type AlertAction,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/vite-express-tauri/v1/files/src/components/ui/Alert";
import { Icon, type IconSize } from "../../../../../../../icon/vite-express-tauri/v1/files/src/components/ui/Icon";
import {
  ContinueWithProvider,
  type ContinueWithProviderProps,
} from "../../../../../../../continue-with-provider/vite-express-tauri/v1/files/src/components/ui/ContinueWithProvider";
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
  type AuthenticationSuccessProps,
} from "../../../../../../../authentication-success/vite-express-tauri/v1/files/src/components/ui/AuthenticationSuccess";

/**
 * Registration Form — SaaS account creation.
 * Composes Form, Text Input, Password Input (Password Visibility Toggle),
 * Password Strength, Password Requirements, Checkbox, Link, Card, Alert, Icon,
 * Button, Continue With Provider, Authentication Loading / Error / Success.
 * Never recreate those primitives or duplicate password policy logic.
 */

export type RegistrationFormStatus = "idle" | "loading" | "success" | "error";

export type RegistrationFormVariant = "stacked" | "compact" | "split";

export type RegistrationFormProvider = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onContinue?: ContinueWithProviderProps["onContinue"];
  state?: ContinueWithProviderProps["state"];
  disabled?: boolean;
};

export type RegistrationFormSubmitPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  marketingConsent: boolean;
};

export type RegistrationFormProps = {
  variant?: RegistrationFormVariant;
  cardVariant?: CardVariant;
  status?: RegistrationFormStatus;
  defaultStatus?: RegistrationFormStatus;
  onStatusChange?: (status: RegistrationFormStatus) => void;
  fullName?: string;
  defaultFullName?: string;
  onFullNameChange?: (value: string) => void;
  email?: string;
  defaultEmail?: string;
  onEmailChange?: (value: string) => void;
  password?: string;
  defaultPassword?: string;
  onPasswordChange?: (value: string) => void;
  confirmPassword?: string;
  defaultConfirmPassword?: string;
  onConfirmPasswordChange?: (value: string) => void;
  acceptTerms?: boolean;
  defaultAcceptTerms?: boolean;
  onAcceptTermsChange?: (value: boolean) => void;
  marketingConsent?: boolean;
  defaultMarketingConsent?: boolean;
  onMarketingConsentChange?: (value: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  fullNameLabel?: string;
  fullNamePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  confirmPasswordLabel?: string;
  confirmPasswordPlaceholder?: string;
  termsLabel?: string;
  termsHref?: string;
  termsLinkLabel?: string;
  privacyHref?: string;
  privacyLinkLabel?: string;
  showTerms?: boolean;
  requireTerms?: boolean;
  marketingLabel?: string;
  marketingDescription?: string;
  showMarketingConsent?: boolean;
  submitLabel?: string;
  submitLoadingLabel?: string;
  /**
   * Create account with validated payload.
   * Resolve → success; reject with `{ reason }` → Authentication Error.
   */
  onSubmit?: (payload: RegistrationFormSubmitPayload) => void | Promise<void>;
  onSuccess?: (payload: RegistrationFormSubmitPayload) => void;
  onContinue?: () => void;
  continueLabel?: string;
  redirectTo?: string;
  redirectDelay?: number;
  onRedirect?: () => void;
  signInHref?: string;
  signInLabel?: string;
  showSignInLink?: boolean;
  onSignIn?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  providers?: RegistrationFormProvider[];
  showProviders?: boolean;
  providersDividerLabel?: React.ReactNode | false;
  rules?: PasswordRequirementRule[];
  checklistVariant?: PasswordRequirementsVariant;
  strengthVariant?: PasswordStrengthVariant;
  showStrength?: boolean;
  showChecklist?: boolean;
  requireChecklistComplete?: boolean;
  requireMatch?: boolean;
  /** Minimum Password Strength level before submit. Default: `fair`. Pass `null` to skip. */
  minStrengthLevel?: PasswordStrengthLevel | null;
  syncVisibility?: boolean;
  passwordVisible?: boolean;
  defaultPasswordVisible?: boolean;
  onPasswordVisibleChange?: (visible: boolean) => void;
  fullNameValidation?: TextInputValidation;
  fullNameErrorMessage?: string;
  emailValidation?: TextInputValidation;
  emailErrorMessage?: string;
  passwordValidation?: PasswordInputValidation;
  passwordErrorMessage?: string;
  confirmValidation?: PasswordInputValidation;
  confirmErrorMessage?: string;
  termsValidation?: "none" | "error";
  termsErrorMessage?: string;
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
  onChecklistChange?: (results: PasswordRequirementResult[], allMet: boolean) => void;
  headerSlot?: React.ReactNode;
  guidanceSlot?: React.ReactNode;
  fullNameSlot?: React.ReactNode;
  emailSlot?: React.ReactNode;
  passwordSlot?: React.ReactNode;
  confirmSlot?: React.ReactNode;
  strengthSlot?: React.ReactNode;
  checklistSlot?: React.ReactNode;
  consentSlot?: React.ReactNode;
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

const STRENGTH_RANK: Record<PasswordStrengthLevel, number> = {
  empty: 0,
  weak: 1,
  fair: 2,
  good: 3,
  strong: 4,
};

function UserGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 16.5a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmailGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="4.5" width="14.5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m3.5 6.5 6.5 4.5 6.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserPlusGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="7" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 16a4.5 4.5 0 0 1 9 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.5 7v5M12 9.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DocGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.5 2.5h5.25L12 4.75V13a.75.75 0 0 1-.75.75h-6.75A.75.75 0 0 1 3.75 13V3.25A.75.75 0 0 1 4.5 2.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M9.5 2.5v2.5H12" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function MegaphoneGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M3 7.5v1.5l2 .5 5.5 2.25V4.75L5 7l-2 .5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M5 9.25v2.5l1.75.75" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function LogInGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M7 3.5H4.75A1.25 1.25 0 0 0 3.5 4.75v6.5c0 .69.56 1.25 1.25 1.25H7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M8.5 8h4M10.5 6l2 2-2 2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function mapRegistrationError(error: unknown): AuthenticationErrorReason {
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
    if (msg.includes("exist") || msg.includes("taken") || msg.includes("duplicate")) return "invalid";
    if (msg.includes("lock") || msg.includes("attempt")) return "locked";
    if (msg.includes("expir") || msg.includes("timeout")) return "expired";
    if (msg.includes("network")) return "network";
    if (msg.includes("cancel")) return "canceled";
  }
  return "invalid";
}

function validateFullName(value: string): string | null {
  if (!value.trim()) return "Enter your full name";
  if (value.trim().length < 2) return "Enter at least 2 characters";
  return null;
}

function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your email";
  if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address";
  return null;
}

function validatePassword(value: string): string | null {
  if (!value) return "Enter a password";
  return null;
}

export const RegistrationForm = React.forwardRef<HTMLDivElement, RegistrationFormProps>(
  function RegistrationForm(
    {
      variant = "stacked",
      cardVariant = "outlined",
      status: statusProp,
      defaultStatus = "idle",
      onStatusChange,
      fullName: fullNameProp,
      defaultFullName = "",
      onFullNameChange,
      email: emailProp,
      defaultEmail = "",
      onEmailChange,
      password: passwordProp,
      defaultPassword = "",
      onPasswordChange,
      confirmPassword: confirmProp,
      defaultConfirmPassword = "",
      onConfirmPasswordChange,
      acceptTerms: acceptTermsProp,
      defaultAcceptTerms = false,
      onAcceptTermsChange,
      marketingConsent: marketingProp,
      defaultMarketingConsent = false,
      onMarketingConsentChange,
      title = "Create your account",
      description = "Enter your details to get started. Use a strong password unique to this workspace.",
      fullNameLabel = "Full name",
      fullNamePlaceholder = "Ada Lovelace",
      emailLabel = "Work email",
      emailPlaceholder = "you@company.com",
      passwordLabel = "Password",
      passwordPlaceholder = "Create a password",
      confirmPasswordLabel = "Confirm password",
      confirmPasswordPlaceholder = "Re-enter your password",
      termsLabel = "I agree to the Terms of Service and Privacy Policy",
      termsHref = "/terms",
      termsLinkLabel = "Terms of Service",
      privacyHref = "/privacy",
      privacyLinkLabel = "Privacy Policy",
      showTerms = true,
      requireTerms = true,
      marketingLabel = "Send me product updates and tips",
      marketingDescription = "Optional. You can unsubscribe anytime.",
      showMarketingConsent = true,
      submitLabel = "Create account",
      submitLoadingLabel = "Creating account",
      onSubmit,
      onSuccess,
      onContinue,
      continueLabel = "Continue",
      redirectTo,
      redirectDelay,
      onRedirect,
      signInHref = "/login",
      signInLabel = "Sign in",
      showSignInLink = true,
      onSignIn,
      providers,
      showProviders = true,
      providersDividerLabel = "Or continue with",
      rules,
      checklistVariant,
      strengthVariant = "detailed",
      showStrength = true,
      showChecklist = true,
      requireChecklistComplete = true,
      requireMatch = true,
      minStrengthLevel = "fair",
      syncVisibility = true,
      passwordVisible: visibleProp,
      defaultPasswordVisible = false,
      onPasswordVisibleChange,
      fullNameValidation: fullNameValidationProp,
      fullNameErrorMessage: fullNameErrorMessageProp,
      emailValidation: emailValidationProp,
      emailErrorMessage: emailErrorMessageProp,
      passwordValidation: passwordValidationProp,
      passwordErrorMessage: passwordErrorMessageProp,
      confirmValidation: confirmValidationProp,
      confirmErrorMessage: confirmErrorMessageProp,
      termsValidation: termsValidationProp,
      termsErrorMessage: termsErrorMessageProp,
      errorReason: errorReasonProp,
      defaultErrorReason = "invalid",
      onErrorReasonChange,
      errorTitle,
      errorDescription,
      successTitle = "Account created",
      successDescription = "Your account is ready. Continue to finish setup.",
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
      guidanceTitle = "Enterprise registration",
      guidanceMessage = "Use your work email. Social providers inherit your organization policies.",
      onChecklistChange,
      headerSlot,
      guidanceSlot,
      fullNameSlot,
      emailSlot,
      passwordSlot,
      confirmSlot,
      strengthSlot,
      checklistSlot,
      consentSlot,
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
    const rootId = id ?? `dk-registration-form-${reactId}`;

    const controlledStatus = statusProp !== undefined;
    const [uncontrolledStatus, setUncontrolledStatus] =
      React.useState<RegistrationFormStatus>(defaultStatus);
    const status = controlledStatus ? statusProp! : uncontrolledStatus;

    const setStatus = React.useCallback(
      (next: RegistrationFormStatus) => {
        if (!controlledStatus) setUncontrolledStatus(next);
        onStatusChange?.(next);
      },
      [controlledStatus, onStatusChange]
    );

    const controlledFullName = fullNameProp !== undefined;
    const [uncontrolledFullName, setUncontrolledFullName] = React.useState(defaultFullName);
    const fullName = controlledFullName ? fullNameProp! : uncontrolledFullName;

    const setFullName = React.useCallback(
      (next: string) => {
        if (!controlledFullName) setUncontrolledFullName(next);
        onFullNameChange?.(next);
      },
      [controlledFullName, onFullNameChange]
    );

    const controlledEmail = emailProp !== undefined;
    const [uncontrolledEmail, setUncontrolledEmail] = React.useState(defaultEmail);
    const email = controlledEmail ? emailProp! : uncontrolledEmail;

    const setEmail = React.useCallback(
      (next: string) => {
        if (!controlledEmail) setUncontrolledEmail(next);
        onEmailChange?.(next);
      },
      [controlledEmail, onEmailChange]
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

    const controlledConfirm = confirmProp !== undefined;
    const [uncontrolledConfirm, setUncontrolledConfirm] = React.useState(defaultConfirmPassword);
    const confirmPassword = controlledConfirm ? confirmProp! : uncontrolledConfirm;

    const setConfirmPassword = React.useCallback(
      (next: string) => {
        if (!controlledConfirm) setUncontrolledConfirm(next);
        onConfirmPasswordChange?.(next);
      },
      [controlledConfirm, onConfirmPasswordChange]
    );

    const controlledTerms = acceptTermsProp !== undefined;
    const [uncontrolledTerms, setUncontrolledTerms] = React.useState(defaultAcceptTerms);
    const acceptTerms = controlledTerms ? acceptTermsProp! : uncontrolledTerms;

    const setAcceptTerms = React.useCallback(
      (next: boolean) => {
        if (!controlledTerms) setUncontrolledTerms(next);
        onAcceptTermsChange?.(next);
      },
      [controlledTerms, onAcceptTermsChange]
    );

    const controlledMarketing = marketingProp !== undefined;
    const [uncontrolledMarketing, setUncontrolledMarketing] = React.useState(defaultMarketingConsent);
    const marketingConsent = controlledMarketing ? marketingProp! : uncontrolledMarketing;

    const setMarketingConsent = React.useCallback(
      (next: boolean) => {
        if (!controlledMarketing) setUncontrolledMarketing(next);
        onMarketingConsentChange?.(next);
      },
      [controlledMarketing, onMarketingConsentChange]
    );

    const controlledVisible = visibleProp !== undefined;
    const [uncontrolledVisible, setUncontrolledVisible] = React.useState(defaultPasswordVisible);
    const [confirmVisible, setConfirmVisible] = React.useState(defaultPasswordVisible);
    const passwordVisible = controlledVisible ? visibleProp! : uncontrolledVisible;

    const setPasswordVisible = React.useCallback(
      (next: boolean) => {
        if (!controlledVisible) setUncontrolledVisible(next);
        onPasswordVisibleChange?.(next);
        if (syncVisibility) setConfirmVisible(next);
      },
      [controlledVisible, onPasswordVisibleChange, syncVisibility]
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

    const [touched, setTouched] = React.useState({
      fullName: false,
      email: false,
      password: false,
      confirm: false,
      terms: false,
    });
    const [allMet, setAllMet] = React.useState(false);

    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const passwordsMatch = password.length > 0 && password === confirmPassword;
    const confirmError =
      requireMatch && touched.confirm && confirmPassword.length > 0 && !passwordsMatch
        ? "Passwords do not match"
        : requireMatch && touched.confirm && !confirmPassword
          ? "Confirm your password"
          : null;
    const termsError =
      requireTerms && showTerms && touched.terms && !acceptTerms
        ? "Accept the terms to continue"
        : null;

    const strength = defaultPasswordStrengthAlgorithm(password);
    const strengthOk =
      minStrengthLevel == null ||
      STRENGTH_RANK[strength.level] >= STRENGTH_RANK[minStrengthLevel];

    const showFullNameError = fullNameValidationProp
      ? fullNameValidationProp === "error"
      : touched.fullName && Boolean(fullNameError);
    const showEmailError = emailValidationProp
      ? emailValidationProp === "error"
      : touched.email && Boolean(emailError);
    const showPasswordError = passwordValidationProp
      ? passwordValidationProp === "error"
      : touched.password && Boolean(passwordError);
    const showConfirmError = confirmValidationProp
      ? confirmValidationProp === "error"
      : Boolean(confirmError);
    const showTermsError = termsValidationProp
      ? termsValidationProp === "error"
      : Boolean(termsError);

    const fullNameValidation: TextInputValidation =
      fullNameValidationProp ?? (showFullNameError ? "error" : "none");
    const emailValidation: TextInputValidation =
      emailValidationProp ?? (showEmailError ? "error" : "none");
    const passwordValidation: PasswordInputValidation =
      passwordValidationProp ?? (showPasswordError ? "error" : "none");
    const confirmValidation: PasswordInputValidation =
      confirmValidationProp ?? (showConfirmError ? "error" : "none");

    const checklistComplete = !requireChecklistComplete || allMet;
    const matchOk = !requireMatch || passwordsMatch;
    const termsOk = !requireTerms || !showTerms || acceptTerms;
    const formValid =
      !fullNameError &&
      !emailError &&
      !passwordError &&
      matchOk &&
      checklistComplete &&
      strengthOk &&
      termsOk;

    const loading = status === "loading";
    const formDisabled = disabled || loading;

    const handleChecklistChange = React.useCallback(
      (results: PasswordRequirementResult[], met: boolean) => {
        setAllMet(met);
        onChecklistChange?.(results, met);
      },
      [onChecklistChange]
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setTouched({
        fullName: true,
        email: true,
        password: true,
        confirm: true,
        terms: true,
      });
      if (disableSubmitWhenInvalid && !formValid) return;
      if (!onSubmit || formDisabled) return;

      const payload: RegistrationFormSubmitPayload = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        acceptTerms,
        marketingConsent,
      };

      setStatus("loading");
      try {
        await onSubmit(payload);
        setPassword("");
        setConfirmPassword("");
        setStatus("success");
        onSuccess?.(payload);
      } catch (error) {
        setErrorReason(mapRegistrationError(error));
        setStatus("error");
      }
    };

    if (status === "loading") {
      return (
        <div
          ref={ref}
          id={rootId}
          className={cx(
            "dk-registration-form",
            "dk-registration-form--loading",
            `dk-registration-form--${variant}`,
            className
          )}
          data-status="loading"
        >
          {loadingSlot ?? (
            <AuthenticationLoading
              flow="account-creation"
              variant={variant === "compact" ? "compact" : loadingVariant}
              message="Creating your account"
              description="Setting up your workspace…"
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
            "dk-registration-form",
            "dk-registration-form--error",
            `dk-registration-form--${variant}`,
            className
          )}
          data-status="error"
          data-reason={errorReason}
        >
          {errorSlot ?? (
            <AuthenticationError
              flow="account-creation"
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
          className={cx(
            "dk-registration-form",
            "dk-registration-form--success",
            `dk-registration-form--${variant}`,
            className
          )}
          data-status="success"
        >
          {successSlot ?? (
            <AuthenticationSuccess
              flow="account-creation"
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

    const strengthNode =
      strengthSlot !== undefined
        ? strengthSlot
        : showStrength
          ? <PasswordStrength value={password} variant={strengthVariant} disabled={formDisabled} />
          : null;

    const checklistNode =
      checklistSlot !== undefined
        ? checklistSlot
        : showChecklist
          ? (
              <PasswordRequirements
                value={password}
                rules={rules ?? DEFAULT_PASSWORD_REQUIREMENT_RULES}
                variant={checklistVariant ?? "checklist"}
                onRequirementsChange={handleChecklistChange}
                disabled={formDisabled}
                label="Registration password requirements"
              />
            )
          : null;

    const form = (
      <Form
        className="dk-registration-form__form"
        title={undefined}
        disabled={formDisabled}
        loading={loading}
        onSubmit={(event) => void handleSubmit(event)}
        errorSummary={
          showFullNameError ||
          showEmailError ||
          showPasswordError ||
          showConfirmError ||
          showTermsError
            ? [
                showFullNameError ? fullNameError : null,
                showEmailError ? emailError : null,
                showPasswordError ? passwordError : null,
                showConfirmError ? confirmError : null,
                showTermsError ? termsError : null,
                !strengthOk && touched.password
                  ? `Choose a ${minStrengthLevel}+ strength password`
                  : null,
              ]
                .filter(Boolean)
                .join(" ")
            : undefined
        }
        errorTitle="Check your registration details"
        density={density}
        live={live ?? "assertive"}
      >
        <Form.Fields>
          {fullNameSlot ?? (
            <TextInput
              label={fullNameLabel}
              placeholder={fullNamePlaceholder}
              type="text"
              autoComplete="name"
              name="name"
              value={fullName}
              onValueChange={setFullName}
              onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
              size={inputSize}
              validation={fullNameValidation}
              errorMessage={
                fullNameErrorMessageProp ??
                (showFullNameError ? fullNameError ?? undefined : undefined)
              }
              leadingIcon={<UserGlyph />}
              disabled={formDisabled}
              fullWidth={fullWidth}
              autoFocus={autoFocus}
              required
              spellCheck={false}
              autoCapitalize="words"
            />
          )}

          {emailSlot ?? (
            <TextInput
              label={emailLabel}
              placeholder={emailPlaceholder}
              type="email"
              autoComplete="email"
              name="email"
              value={email}
              onValueChange={setEmail}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              size={inputSize}
              validation={emailValidation}
              errorMessage={
                emailErrorMessageProp ?? (showEmailError ? emailError ?? undefined : undefined)
              }
              leadingIcon={<EmailGlyph />}
              disabled={formDisabled}
              fullWidth={fullWidth}
              required
              inputMode="email"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
            />
          )}

          {passwordSlot ?? (
            <PasswordInput
              label={passwordLabel}
              placeholder={passwordPlaceholder}
              purpose="new"
              name="new-password"
              value={password}
              onValueChange={setPassword}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              size={inputSize}
              validation={passwordValidation}
              errorMessage={
                passwordErrorMessageProp ??
                (showPasswordError ? passwordError ?? undefined : undefined)
              }
              disabled={formDisabled}
              fullWidth={fullWidth}
              required
              visibilityToggle
              visible={passwordVisible}
              onVisibleChange={setPasswordVisible}
            />
          )}

          {strengthNode}

          {checklistNode}

          {confirmSlot ?? (
            <PasswordInput
              label={confirmPasswordLabel}
              placeholder={confirmPasswordPlaceholder}
              purpose="confirm"
              name="confirm-password"
              value={confirmPassword}
              onValueChange={setConfirmPassword}
              onBlur={() => setTouched((prev) => ({ ...prev, confirm: true }))}
              size={inputSize}
              validation={confirmValidation}
              errorMessage={
                confirmErrorMessageProp ??
                (showConfirmError ? confirmError ?? undefined : undefined)
              }
              disabled={formDisabled}
              fullWidth={fullWidth}
              required={requireMatch}
              visibilityToggle
              visible={syncVisibility ? passwordVisible : confirmVisible}
              onVisibleChange={
                syncVisibility
                  ? setPasswordVisible
                  : (next) => setConfirmVisible(next)
              }
            />
          )}

          {consentSlot ?? (
            <div className="dk-registration-form__consent">
              {showTerms ? (
                <div className="dk-registration-form__terms">
                  <Checkbox
                    label={termsLabel}
                    checked={acceptTerms}
                    onCheckedChange={(next) => {
                      setAcceptTerms(next);
                      setTouched((prev) => ({ ...prev, terms: true }));
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, terms: true }))}
                    disabled={formDisabled}
                    size="sm"
                    name="accept-terms"
                    required={requireTerms}
                    validation={showTermsError ? "error" : "none"}
                    errorMessage={
                      termsErrorMessageProp ??
                      (showTermsError ? termsError ?? undefined : undefined)
                    }
                  />
                  <div className="dk-registration-form__legal-links">
                    <Link
                      href={termsHref}
                      variant="standalone"
                      tone="accent"
                      leadingIcon={<DocGlyph />}
                    >
                      {termsLinkLabel}
                    </Link>
                    <Link
                      href={privacyHref}
                      variant="standalone"
                      tone="accent"
                      leadingIcon={<DocGlyph />}
                    >
                      {privacyLinkLabel}
                    </Link>
                  </div>
                </div>
              ) : null}

              {showMarketingConsent ? (
                <Checkbox
                  label={marketingLabel}
                  description={marketingDescription}
                  checked={marketingConsent}
                  onCheckedChange={setMarketingConsent}
                  disabled={formDisabled}
                  size="sm"
                  name="marketing-consent"
                  optional
                />
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
              leadingIcon={<UserPlusGlyph />}
              fullWidth={fullWidth}
              disabled={formDisabled || (disableSubmitWhenInvalid && !formValid)}
              loading={loading}
              loadingLabel={submitLoadingLabel}
            >
              {submitLabel}
            </Button>

            {showSignInLink ? (
              <p className="dk-registration-form__signin">
                Already have an account?{" "}
                <Link
                  href={signInHref}
                  variant="standalone"
                  tone="accent"
                  leadingIcon={<LogInGlyph />}
                  onClick={onSignIn}
                >
                  {signInLabel}
                </Link>
              </p>
            ) : null}
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
                      formDisabled || provider.disabled ? "disabled" : provider.state
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
          "dk-registration-form",
          `dk-registration-form--${variant}`,
          fullWidth && "dk-registration-form--full",
          className
        )}
        data-status="idle"
        data-variant={variant}
      >
        <Card variant={cardVariant} className="dk-registration-form__card">
          {headerSlot ?? (
            <Card.Header className="dk-registration-form__header">
              <div className="dk-registration-form__title-row">
                <Icon size={iconSize} className="dk-registration-form__title-icon">
                  <UserPlusGlyph />
                </Icon>
                <Card.Title>{title}</Card.Title>
              </div>
              {description ? <Card.Description>{description}</Card.Description> : null}
            </Card.Header>
          )}

          <Card.Body className="dk-registration-form__body">
            {guidanceSlot ??
              (showGuidance ? (
                <Alert
                  variant="informational"
                  density={density}
                  live={live ?? "polite"}
                  title={guidanceTitle}
                  icon={<MegaphoneGlyph />}
                  actions={guidanceActions}
                >
                  {guidanceMessage}
                </Alert>
              ) : null)}

            {variant === "split" ? (
              <div className="dk-registration-form__split">{form}</div>
            ) : (
              form
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
);

RegistrationForm.displayName = "RegistrationForm";
export default RegistrationForm;
