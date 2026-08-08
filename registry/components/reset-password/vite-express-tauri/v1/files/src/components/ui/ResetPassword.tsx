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
  PasswordInput,
  type PasswordInputSize,
} from "../../../../../../../password-input/vite-express-tauri/v1/files/src/components/ui/PasswordInput";
import { PasswordVisibilityToggle } from "../../../../../../../password-visibility-toggle/vite-express-tauri/v1/files/src/components/ui/PasswordVisibilityToggle";
import {
  PasswordStrength,
  type PasswordStrengthVariant,
} from "../../../../../../../password-strength/vite-express-tauri/v1/files/src/components/ui/PasswordStrength";
import {
  PasswordRequirements,
  DEFAULT_PASSWORD_REQUIREMENT_RULES,
  type PasswordRequirementRule,
  type PasswordRequirementResult,
  type PasswordRequirementsVariant,
} from "../../../../../../../password-requirements/vite-express-tauri/v1/files/src/components/ui/PasswordRequirements";

/**
 * Reset Password — create/confirm password for recovery, change, and onboarding.
 * Composes Password Input (+ Visibility Toggle), Password Strength, Password Requirements,
 * Button, Card, and Alert. Do not duplicate policy scoring or rule evaluation.
 */

/**
 * - `recovery` — forgot-password / reset token flows
 * - `change` — signed-in password change (+ optional current)
 * - `onboarding` — first-time set password
 */
export type ResetPasswordFlow = "recovery" | "change" | "onboarding";

export type ResetPasswordStatus = "idle" | "loading" | "success" | "error";

/**
 * - `stacked` — full card form (default)
 * - `compact` — dense card
 * - `split` — alert in header; fields in body
 */
export type ResetPasswordVariant = "stacked" | "compact" | "split";

export type ResetPasswordSubmitPayload = {
  password: string;
  confirmPassword: string;
  currentPassword?: string;
  flow: ResetPasswordFlow;
};

export type ResetPasswordProps = {
  flow?: ResetPasswordFlow;
  variant?: ResetPasswordVariant;
  cardVariant?: CardVariant;
  status?: ResetPasswordStatus;
  defaultStatus?: ResetPasswordStatus;
  onStatusChange?: (status: ResetPasswordStatus) => void;
  password?: string;
  defaultPassword?: string;
  onPasswordChange?: (password: string) => void;
  confirmPassword?: string;
  defaultConfirmPassword?: string;
  onConfirmPasswordChange?: (confirmPassword: string) => void;
  currentPassword?: string;
  defaultCurrentPassword?: string;
  onCurrentPasswordChange?: (currentPassword: string) => void;
  /** Show current-password field. Default: `true` when `flow="change"`. */
  showCurrentPassword?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  passwordLabel?: string;
  confirmLabel?: string;
  currentLabel?: string;
  submitLabel?: string;
  submitLoadingLabel?: string;
  cancelLabel?: string;
  successTitle?: React.ReactNode;
  successDescription?: React.ReactNode;
  errorTitle?: React.ReactNode;
  errorMessage?: React.ReactNode;
  /** Configurable policy rules — forwarded to Password Requirements. */
  rules?: PasswordRequirementRule[];
  checklistVariant?: PasswordRequirementsVariant;
  strengthVariant?: PasswordStrengthVariant;
  showStrength?: boolean;
  showChecklist?: boolean;
  /** Shared show/hide for new + confirm fields. */
  syncVisibility?: boolean;
  passwordVisible?: boolean;
  defaultPasswordVisible?: boolean;
  onPasswordVisibleChange?: (visible: boolean) => void;
  /**
   * Submit when valid.
   * Promise resolve → success; reject → error (`Error.message` when present).
   */
  onSubmit?: (payload: ResetPasswordSubmitPayload) => void | Promise<void>;
  onCancel?: () => void;
  showCancel?: boolean;
  requireChecklistComplete?: boolean;
  requireMatch?: boolean;
  disableSubmitWhenInvalid?: boolean;
  onChecklistChange?: (results: PasswordRequirementResult[], allMet: boolean) => void;
  submitButtonSize?: ButtonSize;
  submitButtonVariant?: ButtonVariant;
  cancelButtonSize?: ButtonSize;
  cancelButtonVariant?: ButtonVariant;
  inputSize?: PasswordInputSize;
  density?: AlertDensity;
  live?: AlertLive;
  fullWidth?: boolean;
  disabled?: boolean;
  actions?: AlertAction[];
  actionSlot?: React.ReactNode;
  alertSlot?: React.ReactNode;
  cardSlot?: React.ReactNode;
  currentPasswordSlot?: React.ReactNode;
  passwordSlot?: React.ReactNode;
  confirmSlot?: React.ReactNode;
  strengthSlot?: React.ReactNode;
  checklistSlot?: React.ReactNode;
  visibilityToggleSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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

function SaveIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.75 4.75h8.5L15.25 7v8.25a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1v-9.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7 4.75v3.5h5.5v-3.5M7 15.25v-4h6v4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
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

const FLOW_COPY: Record<
  ResetPasswordFlow,
  {
    title: string;
    description: string;
    submit: string;
    successTitle: string;
    successDescription: string;
    requirementsVariant: PasswordRequirementsVariant;
    requirementsLabel: string;
  }
> = {
  recovery: {
    title: "Reset password",
    description: "Choose a new password for your account. Use a strong, unique passphrase.",
    submit: "Reset password",
    successTitle: "Password updated",
    successDescription: "Your password was reset. You can sign in with your new credentials.",
    requirementsVariant: "checklist",
    requirementsLabel: "Password reset requirements",
  },
  change: {
    title: "Change password",
    description: "Enter your current password, then choose a new one that meets your organization’s policy.",
    submit: "Update password",
    successTitle: "Password changed",
    successDescription: "Your password was updated successfully.",
    requirementsVariant: "compact",
    requirementsLabel: "Change password requirements",
  },
  onboarding: {
    title: "Set your password",
    description: "Create a password to finish setting up your account.",
    submit: "Save password",
    successTitle: "Password saved",
    successDescription: "Your account password is ready. Continue to get started.",
    requirementsVariant: "detailed",
    requirementsLabel: "Onboarding password requirements",
  },
};

export const ResetPassword = React.forwardRef<HTMLFormElement, ResetPasswordProps>(
  function ResetPassword(
    {
      flow = "recovery",
      variant = "stacked",
      cardVariant = "outlined",
      status: statusProp,
      defaultStatus = "idle",
      onStatusChange,
      password: passwordProp,
      defaultPassword = "",
      onPasswordChange,
      confirmPassword: confirmProp,
      defaultConfirmPassword = "",
      onConfirmPasswordChange,
      currentPassword: currentProp,
      defaultCurrentPassword = "",
      onCurrentPasswordChange,
      showCurrentPassword,
      title,
      description,
      passwordLabel = "New password",
      confirmLabel = "Confirm new password",
      currentLabel = "Current password",
      submitLabel,
      submitLoadingLabel = "Saving password",
      cancelLabel = "Cancel",
      successTitle,
      successDescription,
      errorTitle = "Could not update password",
      errorMessage,
      rules,
      checklistVariant,
      strengthVariant = "detailed",
      showStrength = true,
      showChecklist = true,
      syncVisibility = true,
      passwordVisible: visibleProp,
      defaultPasswordVisible = false,
      onPasswordVisibleChange,
      onSubmit,
      onCancel,
      showCancel = false,
      requireChecklistComplete = true,
      requireMatch = true,
      disableSubmitWhenInvalid = true,
      onChecklistChange,
      submitButtonSize = "md",
      submitButtonVariant = "primary",
      cancelButtonSize = "sm",
      cancelButtonVariant = "tertiary",
      inputSize = "md",
      density,
      live,
      fullWidth = true,
      disabled = false,
      actions,
      actionSlot,
      alertSlot,
      cardSlot,
      currentPasswordSlot,
      passwordSlot,
      confirmSlot,
      strengthSlot,
      checklistSlot,
      visibilityToggleSlot,
      actionsSlot,
      icon,
      className = "",
      id,
    },
    ref
  ) {
    const copy = FLOW_COPY[flow];
    const includeCurrent = showCurrentPassword ?? flow === "change";

    const controlledStatus = statusProp !== undefined;
    const controlledPassword = passwordProp !== undefined;
    const controlledConfirm = confirmProp !== undefined;
    const controlledCurrent = currentProp !== undefined;
    const controlledVisible = visibleProp !== undefined;

    const [uncontrolledStatus, setUncontrolledStatus] = React.useState<ResetPasswordStatus>(defaultStatus);
    const [uncontrolledPassword, setUncontrolledPassword] = React.useState(defaultPassword);
    const [uncontrolledConfirm, setUncontrolledConfirm] = React.useState(defaultConfirmPassword);
    const [uncontrolledCurrent, setUncontrolledCurrent] = React.useState(defaultCurrentPassword);
    const [uncontrolledVisible, setUncontrolledVisible] = React.useState(defaultPasswordVisible);
    const [confirmVisible, setConfirmVisible] = React.useState(defaultPasswordVisible);
    const [touchedConfirm, setTouchedConfirm] = React.useState(false);
    const [touchedCurrent, setTouchedCurrent] = React.useState(false);
    const [allMet, setAllMet] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const status = controlledStatus ? statusProp! : uncontrolledStatus;
    const password = controlledPassword ? passwordProp! : uncontrolledPassword;
    const confirmPassword = controlledConfirm ? confirmProp! : uncontrolledConfirm;
    const currentPassword = controlledCurrent ? currentProp! : uncontrolledCurrent;
    const passwordVisible = controlledVisible ? visibleProp! : uncontrolledVisible;

    const setStatus = React.useCallback(
      (next: ResetPasswordStatus) => {
        if (!controlledStatus) setUncontrolledStatus(next);
        onStatusChange?.(next);
      },
      [controlledStatus, onStatusChange]
    );

    const setPassword = React.useCallback(
      (next: string) => {
        if (!controlledPassword) setUncontrolledPassword(next);
        onPasswordChange?.(next);
      },
      [controlledPassword, onPasswordChange]
    );

    const setConfirm = React.useCallback(
      (next: string) => {
        if (!controlledConfirm) setUncontrolledConfirm(next);
        onConfirmPasswordChange?.(next);
      },
      [controlledConfirm, onConfirmPasswordChange]
    );

    const setCurrent = React.useCallback(
      (next: string) => {
        if (!controlledCurrent) setUncontrolledCurrent(next);
        onCurrentPasswordChange?.(next);
      },
      [controlledCurrent, onCurrentPasswordChange]
    );

    const setPasswordVisible = React.useCallback(
      (next: boolean) => {
        if (!controlledVisible) setUncontrolledVisible(next);
        onPasswordVisibleChange?.(next);
        if (syncVisibility) setConfirmVisible(next);
      },
      [controlledVisible, onPasswordVisibleChange, syncVisibility]
    );

    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";
    const formDisabled = disabled || isLoading || isSuccess;

    const passwordsMatch = password.length > 0 && password === confirmPassword;
    const confirmError =
      requireMatch && touchedConfirm && confirmPassword.length > 0 && !passwordsMatch
        ? "Passwords do not match"
        : undefined;
    const currentError =
      includeCurrent && touchedCurrent && currentPassword.trim().length === 0
        ? "Enter your current password"
        : undefined;

    const checklistComplete = !requireChecklistComplete || allMet;
    const matchOk = !requireMatch || passwordsMatch;
    const currentOk = !includeCurrent || currentPassword.trim().length > 0;
    const canSubmit = checklistComplete && matchOk && currentOk && password.length > 0;

    const resolvedTitle = title ?? copy.title;
    const resolvedDescription = description ?? copy.description;
    const resolvedSubmit = submitLabel ?? copy.submit;
    const resolvedSuccessTitle = successTitle ?? copy.successTitle;
    const resolvedSuccessDescription = successDescription ?? copy.successDescription;

    const handleChecklistChange = React.useCallback(
      (results: PasswordRequirementResult[], met: boolean) => {
        setAllMet(met);
        onChecklistChange?.(results, met);
      },
      [onChecklistChange]
    );

    const strengthNode =
      strengthSlot !== undefined
        ? strengthSlot
        : showStrength
          ? <PasswordStrength value={password} variant={strengthVariant} />
          : null;

    const checklistNode =
      checklistSlot !== undefined
        ? checklistSlot
        : showChecklist
          ? (
              <PasswordRequirements
                value={password}
                rules={rules ?? DEFAULT_PASSWORD_REQUIREMENT_RULES}
                variant={checklistVariant ?? copy.requirementsVariant}
                onRequirementsChange={handleChecklistChange}
                disabled={formDisabled}
                label={copy.requirementsLabel}
              />
            )
          : null;

    const sharedVisibilityToggle =
      visibilityToggleSlot !== undefined
        ? visibilityToggleSlot
        : syncVisibility
          ? (
              <div className="dk-reset-password__visibility">
                <PasswordVisibilityToggle
                  visible={passwordVisible}
                  onVisibleChange={setPasswordVisible}
                  size="sm"
                  disabled={formDisabled}
                  showLabel="Show passwords"
                  hideLabel="Hide passwords"
                />
                <span className="dk-reset-password__visibility-hint">
                  {passwordVisible ? "Hide passwords" : "Show passwords"}
                </span>
              </div>
            )
          : null;

    const currentNode =
      currentPasswordSlot !== undefined
        ? currentPasswordSlot
        : includeCurrent
          ? (
              <PasswordInput
                purpose="current"
                label={currentLabel}
                value={currentPassword}
                onValueChange={(value) => {
                  setCurrent(value);
                  if (status === "error") setStatus("idle");
                  setSubmitError(null);
                }}
                onBlur={() => setTouchedCurrent(true)}
                size={inputSize}
                validation={currentError ? "error" : "none"}
                errorMessage={currentError}
                required
                fullWidth={fullWidth}
                disabled={formDisabled}
                visibilityToggle={!syncVisibility}
              />
            )
          : null;

    const passwordNode =
      passwordSlot !== undefined ? (
        passwordSlot
      ) : (
        <PasswordInput
          purpose="new"
          label={passwordLabel}
          value={password}
          onValueChange={(value) => {
            setPassword(value);
            if (status === "error") setStatus("idle");
            setSubmitError(null);
          }}
          size={inputSize}
          required
          fullWidth={fullWidth}
          disabled={formDisabled}
          visible={syncVisibility ? passwordVisible : undefined}
          onVisibleChange={syncVisibility ? setPasswordVisible : undefined}
          visibilityToggle={!syncVisibility}
          strengthSlot={strengthNode}
          requirements={checklistNode}
        />
      );

    const confirmNode =
      confirmSlot !== undefined ? (
        confirmSlot
      ) : (
        <PasswordInput
          purpose="confirm"
          label={confirmLabel}
          value={confirmPassword}
          onValueChange={(value) => {
            setConfirm(value);
            if (status === "error") setStatus("idle");
            setSubmitError(null);
          }}
          onBlur={() => setTouchedConfirm(true)}
          size={inputSize}
          validation={confirmError ? "error" : passwordsMatch && confirmPassword ? "success" : "none"}
          errorMessage={confirmError}
          successMessage={passwordsMatch && confirmPassword ? "Passwords match" : undefined}
          required
          fullWidth={fullWidth}
          disabled={formDisabled}
          visible={syncVisibility ? passwordVisible : confirmVisible}
          onVisibleChange={syncVisibility ? setPasswordVisible : setConfirmVisible}
          visibilityToggle={!syncVisibility}
        />
      );

    const alertNode =
      alertSlot !== undefined
        ? alertSlot
        : isSuccess
          ? (
              <Alert
                variant="success"
                density={variant === "compact" ? "compact" : density}
                title={resolvedSuccessTitle}
                icon={icon ?? <KeyIcon />}
                live={live ?? "polite"}
                actions={actions}
                actionSlot={actionSlot}
              >
                {resolvedSuccessDescription}
              </Alert>
            )
          : isError
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
                  {errorMessage ?? submitError ?? "Something went wrong. Try again."}
                </Alert>
              )
            : variant === "split"
              ? (
                  <Alert
                    variant="informational"
                    density={variant === "compact" ? "compact" : density}
                    title={resolvedTitle}
                    icon={icon ?? <KeyIcon />}
                    live={live ?? "off"}
                    actions={actions}
                    actionSlot={actionSlot}
                  >
                    {resolvedDescription}
                  </Alert>
                )
              : null;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setTouchedConfirm(true);
      setTouchedCurrent(true);
      if (!canSubmit) {
        setStatus("error");
        setSubmitError(
          !currentOk
            ? "Enter your current password"
            : !checklistComplete
              ? "Meet all password requirements"
              : !matchOk
                ? "Passwords do not match"
                : "Enter a new password"
        );
        return;
      }
      setSubmitError(null);
      setStatus("loading");
      try {
        await onSubmit?.({
          password,
          confirmPassword,
          currentPassword: includeCurrent ? currentPassword : undefined,
          flow,
        });
        setStatus("success");
      } catch (cause) {
        const message = cause instanceof Error && cause.message ? cause.message : null;
        setSubmitError(message);
        setStatus("error");
      }
    };

    const submitDisabled = formDisabled || (disableSubmitWhenInvalid && !canSubmit) || isSuccess;

    const footerActions =
      actionsSlot !== undefined ? (
        actionsSlot
      ) : (
        <Card.Actions className="dk-reset-password__actions">
          <Button
            type="submit"
            size={submitButtonSize}
            variant={isSuccess ? "success" : submitButtonVariant}
            leadingIcon={<SaveIcon />}
            loading={isLoading}
            loadingLabel={submitLoadingLabel}
            disabled={submitDisabled && !isLoading}
            fullWidth={fullWidth}
          >
            {isSuccess ? "Password saved" : resolvedSubmit}
          </Button>
          {showCancel && onCancel ? (
            <Button
              type="button"
              size={cancelButtonSize}
              variant={cancelButtonVariant}
              leadingIcon={<BackIcon />}
              disabled={isLoading}
              fullWidth={fullWidth}
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
          ) : null}
        </Card.Actions>
      );

    const formBody = (
      <>
        {variant !== "split" && (resolvedTitle || resolvedDescription) ? (
          <div className="dk-reset-password__intro">
            <Card.Title as="h2" className="dk-reset-password__title">
              {resolvedTitle}
            </Card.Title>
            {resolvedDescription ? (
              <Card.Description className="dk-reset-password__description">
                {resolvedDescription}
              </Card.Description>
            ) : null}
          </div>
        ) : null}
        {alertNode && variant !== "split" ? (
          <div className="dk-reset-password__alert">{alertNode}</div>
        ) : null}
        {!isSuccess ? (
          <div className="dk-reset-password__fields">
            {sharedVisibilityToggle}
            {currentNode ? <div className="dk-reset-password__current">{currentNode}</div> : null}
            <div className="dk-reset-password__password">{passwordNode}</div>
            <div className="dk-reset-password__confirm">{confirmNode}</div>
          </div>
        ) : null}
      </>
    );

    const cardInner = (
      <>
        {variant === "split" && alertNode ? (
          <Card.Header className="dk-reset-password__header">{alertNode}</Card.Header>
        ) : null}
        <Card.Body className="dk-reset-password__body">{formBody}</Card.Body>
        <Card.Footer className="dk-reset-password__footer">{footerActions}</Card.Footer>
      </>
    );

    const cardNode =
      cardSlot !== undefined ? (
        cardSlot
      ) : (
        <Card
          variant={cardVariant}
          className="dk-reset-password__card"
          aria-label={typeof resolvedTitle === "string" ? resolvedTitle : "Reset password"}
        >
          {cardInner}
        </Card>
      );

    return (
      <form
        ref={ref}
        id={id}
        className={cx(
          "dk-reset-password",
          `dk-reset-password--${variant}`,
          `dk-reset-password--${flow}`,
          `dk-reset-password--${status}`,
          disabled && "dk-reset-password--disabled",
          className
        )}
        data-variant={variant}
        data-flow={flow}
        data-status={status}
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

ResetPassword.displayName = "ResetPassword";
export default ResetPassword;
