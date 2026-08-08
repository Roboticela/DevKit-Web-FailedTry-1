import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

import { Button } from "@registry/components/button/vite-express-tauri/v1/files/src/components/ui/Button";
import "@registry/components/button/vite-express-tauri/v1/files/src/styles/button.css";

import { IconButton } from "@registry/components/icon-button/vite-express-tauri/v1/files/src/components/ui/IconButton";
import "@registry/components/icon-button/vite-express-tauri/v1/files/src/styles/icon-button.css";

import { ButtonGroup } from "@registry/components/button-group/vite-express-tauri/v1/files/src/components/ui/ButtonGroup";
import "@registry/components/button-group/vite-express-tauri/v1/files/src/styles/button-group.css";

import { SplitButton } from "@registry/components/split-button/vite-express-tauri/v1/files/src/components/ui/SplitButton";
import "@registry/components/split-button/vite-express-tauri/v1/files/src/styles/split-button.css";

import { LinkButton } from "@registry/components/link-button/vite-express-tauri/v1/files/src/components/ui/LinkButton";
import "@registry/components/link-button/vite-express-tauri/v1/files/src/styles/link-button.css";

import { ToggleButton } from "@registry/components/toggle-button/vite-express-tauri/v1/files/src/components/ui/ToggleButton";
import "@registry/components/toggle-button/vite-express-tauri/v1/files/src/styles/toggle-button.css";

import { CommandButton } from "@registry/components/command-button/vite-express-tauri/v1/files/src/components/ui/CommandButton";
import "@registry/components/command-button/vite-express-tauri/v1/files/src/styles/command-button.css";

import { ActionMenuTrigger } from "@registry/components/action-menu-trigger/vite-express-tauri/v1/files/src/components/ui/ActionMenuTrigger";
import "@registry/components/action-menu-trigger/vite-express-tauri/v1/files/src/styles/action-menu-trigger.css";

import { TextInput } from "@registry/components/text-input/vite-express-tauri/v1/files/src/components/ui/TextInput";
import "@registry/components/text-input/vite-express-tauri/v1/files/src/styles/text-input.css";

import { NumberInput } from "@registry/components/number-input/vite-express-tauri/v1/files/src/components/ui/NumberInput";
import "@registry/components/number-input/vite-express-tauri/v1/files/src/styles/number-input.css";

import { PasswordInput } from "@registry/components/password-input/vite-express-tauri/v1/files/src/components/ui/PasswordInput";
import "@registry/components/password-input/vite-express-tauri/v1/files/src/styles/password-input.css";
import "@registry/components/password-visibility-toggle/vite-express-tauri/v1/files/src/styles/password-visibility-toggle.css";
import "@registry/components/icon-button/vite-express-tauri/v1/files/src/styles/icon-button.css";

import { PasswordVisibilityToggle } from "@registry/components/password-visibility-toggle/vite-express-tauri/v1/files/src/components/ui/PasswordVisibilityToggle";

import { PasswordStrength } from "@registry/components/password-strength/vite-express-tauri/v1/files/src/components/ui/PasswordStrength";
import "@registry/components/password-strength/vite-express-tauri/v1/files/src/styles/password-strength.css";
import "@registry/components/progress-bar/vite-express-tauri/v1/files/src/styles/progress-bar.css";
import "@registry/components/badge/vite-express-tauri/v1/files/src/styles/badge.css";

import { PasswordRequirements } from "@registry/components/password-requirements/vite-express-tauri/v1/files/src/components/ui/PasswordRequirements";
import "@registry/components/password-requirements/vite-express-tauri/v1/files/src/styles/password-requirements.css";


import { CountdownTimer } from "@registry/components/countdown-timer/vite-express-tauri/v1/files/src/components/ui/CountdownTimer";
import "@registry/components/countdown-timer/vite-express-tauri/v1/files/src/styles/countdown-timer.css";
import "@registry/components/progress-bar/vite-express-tauri/v1/files/src/styles/progress-bar.css";
import "@registry/components/badge/vite-express-tauri/v1/files/src/styles/badge.css";
import "@registry/components/text/vite-express-tauri/v1/files/src/styles/text.css";
import "@registry/components/icon-button/vite-express-tauri/v1/files/src/styles/icon-button.css";

import { ResendVerification } from "@registry/components/resend-verification/vite-express-tauri/v1/files/src/components/ui/ResendVerification";
import "@registry/components/resend-verification/vite-express-tauri/v1/files/src/styles/resend-verification.css";
import "@registry/components/icon/vite-express-tauri/v1/files/src/styles/icon.css";

import { VerificationEmailSent } from "@registry/components/verification-email-sent/vite-express-tauri/v1/files/src/components/ui/VerificationEmailSent";
import "@registry/components/verification-email-sent/vite-express-tauri/v1/files/src/styles/verification-email-sent.css";
import "@registry/components/card/vite-express-tauri/v1/files/src/styles/card.css";
import "@registry/components/alert/vite-express-tauri/v1/files/src/styles/alert.css";

import { ForgotPassword } from "@registry/components/forgot-password/vite-express-tauri/v1/files/src/components/ui/ForgotPassword";
import "@registry/components/forgot-password/vite-express-tauri/v1/files/src/styles/forgot-password.css";
import "@registry/components/action-segmented-control/vite-express-tauri/v1/files/src/styles/action-segmented-control.css";
import "@registry/components/text-input/vite-express-tauri/v1/files/src/styles/text-input.css";

import { MagicLinkLogin } from "@registry/components/magic-link-login/vite-express-tauri/v1/files/src/components/ui/MagicLinkLogin";
import "@registry/components/magic-link-login/vite-express-tauri/v1/files/src/styles/magic-link-login.css";

import { ResetPassword } from "@registry/components/reset-password/vite-express-tauri/v1/files/src/components/ui/ResetPassword";
import "@registry/components/reset-password/vite-express-tauri/v1/files/src/styles/reset-password.css";
import "@registry/components/card/vite-express-tauri/v1/files/src/styles/card.css";
import "@registry/components/alert/vite-express-tauri/v1/files/src/styles/alert.css";

import { PasskeyLogin } from "@registry/components/passkey-login/vite-express-tauri/v1/files/src/components/ui/PasskeyLogin";
import "@registry/components/passkey-login/vite-express-tauri/v1/files/src/styles/passkey-login.css";
import "@registry/components/authentication-loading/vite-express-tauri/v1/files/src/styles/authentication-loading.css";
import "@registry/components/authentication-error/vite-express-tauri/v1/files/src/styles/authentication-error.css";
import "@registry/components/authentication-success/vite-express-tauri/v1/files/src/styles/authentication-success.css";
import "@registry/components/spinner/vite-express-tauri/v1/files/src/styles/spinner.css";
import "@registry/components/skeleton/vite-express-tauri/v1/files/src/styles/skeleton.css";

import { RegisterPasskey } from "@registry/components/register-passkey/vite-express-tauri/v1/files/src/components/ui/RegisterPasskey";
import "@registry/components/register-passkey/vite-express-tauri/v1/files/src/styles/register-passkey.css";

import {
  PasskeyManagement,
  type PasskeyCredential,
} from "@registry/components/passkey-management/vite-express-tauri/v1/files/src/components/ui/PasskeyManagement";
import "@registry/components/passkey-management/vite-express-tauri/v1/files/src/styles/passkey-management.css";
import "@registry/components/data-table/vite-express-tauri/v1/files/src/styles/data-table.css";
import "@registry/components/empty-state/vite-express-tauri/v1/files/src/styles/empty-state.css";
import "@registry/components/dialog/vite-express-tauri/v1/files/src/styles/dialog.css";
import "@registry/components/search-field/vite-express-tauri/v1/files/src/styles/search-field.css";
import "@registry/components/tag/vite-express-tauri/v1/files/src/styles/tag.css";
import "@registry/components/card/vite-express-tauri/v1/files/src/styles/card.css";
import "@registry/components/badge/vite-express-tauri/v1/files/src/styles/badge.css";

import {
  ActiveSessions,
  type ActiveSession,
} from "@registry/components/active-sessions/vite-express-tauri/v1/files/src/components/ui/ActiveSessions";
import "@registry/components/active-sessions/vite-express-tauri/v1/files/src/styles/active-sessions.css";
import "@registry/components/avatar/vite-express-tauri/v1/files/src/styles/avatar.css";
import "@registry/components/dropdown-menu/vite-express-tauri/v1/files/src/styles/dropdown-menu.css";
import "@registry/components/tooltip/vite-express-tauri/v1/files/src/styles/tooltip.css";
import "@registry/components/skeleton/vite-express-tauri/v1/files/src/styles/skeleton.css";
import "@registry/components/icon/vite-express-tauri/v1/files/src/styles/icon.css";
import "@registry/components/icon-button/vite-express-tauri/v1/files/src/styles/icon-button.css";

import {
  TrustedDevices,
  type TrustedDevice,
} from "@registry/components/trusted-devices/vite-express-tauri/v1/files/src/components/ui/TrustedDevices";
import "@registry/components/trusted-devices/vite-express-tauri/v1/files/src/styles/trusted-devices.css";
import "@registry/components/empty-state/vite-express-tauri/v1/files/src/styles/empty-state.css";
import "@registry/components/dialog/vite-express-tauri/v1/files/src/styles/dialog.css";
import "@registry/components/text-input/vite-express-tauri/v1/files/src/styles/text-input.css";

import {
  LoginHistory,
  type LoginHistoryEvent,
} from "@registry/components/login-history/vite-express-tauri/v1/files/src/components/ui/LoginHistory";
import "@registry/components/login-history/vite-express-tauri/v1/files/src/styles/login-history.css";
import "@registry/components/action-segmented-control/vite-express-tauri/v1/files/src/styles/action-segmented-control.css";
import "@registry/components/search-field/vite-express-tauri/v1/files/src/styles/search-field.css";

import { Timeline } from "@registry/components/timeline/vite-express-tauri/v1/files/src/components/ui/Timeline";
import "@registry/components/timeline/vite-express-tauri/v1/files/src/styles/timeline.css";

import {
  SecurityEvents,
  type SecurityEvent,
} from "@registry/components/security-events/vite-express-tauri/v1/files/src/components/ui/SecurityEvents";
import "@registry/components/security-events/vite-express-tauri/v1/files/src/styles/security-events.css";
import "@registry/components/dialog/vite-express-tauri/v1/files/src/styles/dialog.css";

import "@registry/components/heading/vite-express-tauri/v1/files/src/styles/heading.css";
import "@registry/components/paragraph/vite-express-tauri/v1/files/src/styles/paragraph.css";
import "@registry/components/caption/vite-express-tauri/v1/files/src/styles/caption.css";
import "@registry/components/list-item/vite-express-tauri/v1/files/src/styles/list-item.css";
import "@registry/components/progress-bar/vite-express-tauri/v1/files/src/styles/progress-bar.css";
import "@registry/components/brand/vite-express-tauri/v1/files/src/styles/brand.css";
import "@registry/components/alert/vite-express-tauri/v1/files/src/styles/alert.css";
import "@registry/components/badge/vite-express-tauri/v1/files/src/styles/badge.css";
import "@registry/components/card/vite-express-tauri/v1/files/src/styles/card.css";
import "@registry/components/button/vite-express-tauri/v1/files/src/styles/button.css";
import "@registry/components/divider/vite-express-tauri/v1/files/src/styles/divider.css";
import "@registry/components/spinner/vite-express-tauri/v1/files/src/styles/spinner.css";
import "@registry/components/continue-with-provider/vite-express-tauri/v1/files/src/styles/continue-with-provider.css";
import "@registry/components/authentication-loading/vite-express-tauri/v1/files/src/styles/authentication-loading.css";
import "@registry/components/icon/vite-express-tauri/v1/files/src/styles/icon.css";

import { EmptyState } from "@registry/components/empty-state/vite-express-tauri/v1/files/src/components/ui/EmptyState";
import { Dialog } from "@registry/components/dialog/vite-express-tauri/v1/files/src/components/ui/Dialog";
import { DataTable } from "@registry/components/data-table/vite-express-tauri/v1/files/src/components/ui/DataTable";

import { RadioGroup } from "@registry/components/radio-group/vite-express-tauri/v1/files/src/components/ui/RadioGroup";
import "@registry/components/radio-group/vite-express-tauri/v1/files/src/styles/radio.css";
import "@registry/components/radio-group/vite-express-tauri/v1/files/src/styles/radio-group.css";

import { SelectAuthenticationMethod } from "@registry/components/select-authentication-method/vite-express-tauri/v1/files/src/components/ui/SelectAuthenticationMethod";
import "@registry/components/select-authentication-method/vite-express-tauri/v1/files/src/styles/select-authentication-method.css";
import "@registry/components/divider/vite-express-tauri/v1/files/src/styles/divider.css";
import "@registry/components/icon/vite-express-tauri/v1/files/src/styles/icon.css";
import "@registry/components/continue-with-provider/vite-express-tauri/v1/files/src/styles/continue-with-provider.css";

import { QrCodeCard } from "@registry/components/qr-code-card/vite-express-tauri/v1/files/src/components/ui/QrCodeCard";
import "@registry/components/qr-code-card/vite-express-tauri/v1/files/src/styles/qr-code-card.css";
import "@registry/components/tooltip/vite-express-tauri/v1/files/src/styles/tooltip.css";
import "@registry/components/countdown-timer/vite-express-tauri/v1/files/src/styles/countdown-timer.css";
import "@registry/components/progress-bar/vite-express-tauri/v1/files/src/styles/progress-bar.css";
import "@registry/components/skeleton/vite-express-tauri/v1/files/src/styles/skeleton.css";

import { AuthenticatorAppSetup } from "@registry/components/authenticator-app-setup/vite-express-tauri/v1/files/src/components/ui/AuthenticatorAppSetup";
import "@registry/components/authenticator-app-setup/vite-express-tauri/v1/files/src/styles/authenticator-app-setup.css";

import { BackupCodes } from "@registry/components/backup-codes/vite-express-tauri/v1/files/src/components/ui/BackupCodes";
import "@registry/components/backup-codes/vite-express-tauri/v1/files/src/styles/backup-codes.css";
import "@registry/components/dialog/vite-express-tauri/v1/files/src/styles/dialog.css";
import "@registry/components/checkbox/vite-express-tauri/v1/files/src/styles/checkbox.css";

import {
  RecoveryCodeLogin,
  normalizeRecoveryCode,
} from "@registry/components/recovery-code-login/vite-express-tauri/v1/files/src/components/ui/RecoveryCodeLogin";
import "@registry/components/recovery-code-login/vite-express-tauri/v1/files/src/styles/recovery-code-login.css";

import { TwoFactorAuthentication } from "@registry/components/two-factor-authentication/vite-express-tauri/v1/files/src/components/ui/TwoFactorAuthentication";
import "@registry/components/two-factor-authentication/vite-express-tauri/v1/files/src/styles/two-factor-authentication.css";
import "@registry/components/authentication-success/vite-express-tauri/v1/files/src/styles/authentication-success.css";
import "@registry/components/countdown-timer/vite-express-tauri/v1/files/src/styles/countdown-timer.css";
import "@registry/components/select-authentication-method/vite-express-tauri/v1/files/src/styles/select-authentication-method.css";
import "@registry/components/authenticator-app-setup/vite-express-tauri/v1/files/src/styles/authenticator-app-setup.css";
import "@registry/components/qr-code-card/vite-express-tauri/v1/files/src/styles/qr-code-card.css";
import "@registry/components/backup-codes/vite-express-tauri/v1/files/src/styles/backup-codes.css";
import "@registry/components/radio-group/vite-express-tauri/v1/files/src/styles/radio.css";
import "@registry/components/radio-group/vite-express-tauri/v1/files/src/styles/radio-group.css";

import { Form } from "@registry/components/form/vite-express-tauri/v1/files/src/components/ui/Form";
import "@registry/components/form/vite-express-tauri/v1/files/src/styles/form.css";

import { LoginForm } from "@registry/components/login-form/vite-express-tauri/v1/files/src/components/ui/LoginForm";
import "@registry/components/login-form/vite-express-tauri/v1/files/src/styles/login-form.css";
import "@registry/components/password-input/vite-express-tauri/v1/files/src/styles/password-input.css";
import "@registry/components/password-visibility-toggle/vite-express-tauri/v1/files/src/styles/password-visibility-toggle.css";
import "@registry/components/checkbox/vite-express-tauri/v1/files/src/styles/checkbox.css";
import "@registry/components/link/vite-express-tauri/v1/files/src/styles/link.css";
import "@registry/components/continue-with-provider/vite-express-tauri/v1/files/src/styles/continue-with-provider.css";
import "@registry/components/divider/vite-express-tauri/v1/files/src/styles/divider.css";
import "@registry/components/icon/vite-express-tauri/v1/files/src/styles/icon.css";

import { RegistrationForm } from "@registry/components/registration-form/vite-express-tauri/v1/files/src/components/ui/RegistrationForm";
import "@registry/components/registration-form/vite-express-tauri/v1/files/src/styles/registration-form.css";
import "@registry/components/password-strength/vite-express-tauri/v1/files/src/styles/password-strength.css";
import "@registry/components/password-requirements/vite-express-tauri/v1/files/src/styles/password-requirements.css";
import "@registry/components/progress-bar/vite-express-tauri/v1/files/src/styles/progress-bar.css";
import "@registry/components/badge/vite-express-tauri/v1/files/src/styles/badge.css";
import "@registry/components/list/vite-express-tauri/v1/files/src/styles/list.css";
import "@registry/components/list-item/vite-express-tauri/v1/files/src/styles/list-item.css";

import { VerificationCodeInput } from "@registry/components/verification-code-input/vite-express-tauri/v1/files/src/components/ui/VerificationCodeInput";
import "@registry/components/verification-code-input/vite-express-tauri/v1/files/src/styles/verification-code-input.css";
import "@registry/components/label/vite-express-tauri/v1/files/src/styles/label.css";
import "@registry/components/alert/vite-express-tauri/v1/files/src/styles/alert.css";
import "@registry/components/spinner/vite-express-tauri/v1/files/src/styles/spinner.css";

import { VerificationSuccess } from "@registry/components/verification-success/vite-express-tauri/v1/files/src/components/ui/VerificationSuccess";
import "@registry/components/verification-success/vite-express-tauri/v1/files/src/styles/verification-success.css";
import "@registry/components/badge/vite-express-tauri/v1/files/src/styles/badge.css";

import { VerificationFailed } from "@registry/components/verification-failed/vite-express-tauri/v1/files/src/components/ui/VerificationFailed";
import "@registry/components/verification-failed/vite-express-tauri/v1/files/src/styles/verification-failed.css";

import { AuthenticationLoading } from "@registry/components/authentication-loading/vite-express-tauri/v1/files/src/components/ui/AuthenticationLoading";
import "@registry/components/authentication-loading/vite-express-tauri/v1/files/src/styles/authentication-loading.css";

import { AuthenticationSuccess } from "@registry/components/authentication-success/vite-express-tauri/v1/files/src/components/ui/AuthenticationSuccess";
import "@registry/components/authentication-success/vite-express-tauri/v1/files/src/styles/authentication-success.css";

import { AuthenticationError } from "@registry/components/authentication-error/vite-express-tauri/v1/files/src/components/ui/AuthenticationError";
import "@registry/components/authentication-error/vite-express-tauri/v1/files/src/styles/authentication-error.css";

import { SessionExpired } from "@registry/components/session-expired/vite-express-tauri/v1/files/src/components/ui/SessionExpired";
import "@registry/components/session-expired/vite-express-tauri/v1/files/src/styles/session-expired.css";

import { AccountLocked } from "@registry/components/account-locked/vite-express-tauri/v1/files/src/components/ui/AccountLocked";
import "@registry/components/account-locked/vite-express-tauri/v1/files/src/styles/account-locked.css";

import { Icon } from "@registry/components/icon/vite-express-tauri/v1/files/src/components/ui/Icon";
import "@registry/components/icon/vite-express-tauri/v1/files/src/styles/icon.css";

import { ContinueWithProvider } from "@registry/components/continue-with-provider/vite-express-tauri/v1/files/src/components/ui/ContinueWithProvider";
import "@registry/components/continue-with-provider/vite-express-tauri/v1/files/src/styles/continue-with-provider.css";

import { ContinueWithGoogle, GoogleIcon } from "@registry/components/continue-with-google/vite-express-tauri/v1/files/src/components/ui/ContinueWithGoogle";
import "@registry/components/continue-with-google/vite-express-tauri/v1/files/src/styles/continue-with-google.css";
import "@registry/components/divider/vite-express-tauri/v1/files/src/styles/divider.css";
import "@registry/components/tooltip/vite-express-tauri/v1/files/src/styles/tooltip.css";

import { ContinueWithMicrosoft } from "@registry/components/continue-with-microsoft/vite-express-tauri/v1/files/src/components/ui/ContinueWithMicrosoft";
import "@registry/components/continue-with-microsoft/vite-express-tauri/v1/files/src/styles/continue-with-microsoft.css";

import { ContinueWithApple, AppleIcon } from "@registry/components/continue-with-apple/vite-express-tauri/v1/files/src/components/ui/ContinueWithApple";
import "@registry/components/continue-with-apple/vite-express-tauri/v1/files/src/styles/continue-with-apple.css";

import { ContinueWithDiscord } from "@registry/components/continue-with-discord/vite-express-tauri/v1/files/src/components/ui/ContinueWithDiscord";
import "@registry/components/continue-with-discord/vite-express-tauri/v1/files/src/styles/continue-with-discord.css";

import { ContinueWithSlack } from "@registry/components/continue-with-slack/vite-express-tauri/v1/files/src/components/ui/ContinueWithSlack";
import "@registry/components/continue-with-slack/vite-express-tauri/v1/files/src/styles/continue-with-slack.css";

import { ContinueWithLinkedIn } from "@registry/components/continue-with-linkedin/vite-express-tauri/v1/files/src/components/ui/ContinueWithLinkedIn";
import "@registry/components/continue-with-linkedin/vite-express-tauri/v1/files/src/styles/continue-with-linkedin.css";

import { ContinueWithX } from "@registry/components/continue-with-x/vite-express-tauri/v1/files/src/components/ui/ContinueWithX";
import "@registry/components/continue-with-x/vite-express-tauri/v1/files/src/styles/continue-with-x.css";

import { ContinueWithFacebook } from "@registry/components/continue-with-facebook/vite-express-tauri/v1/files/src/components/ui/ContinueWithFacebook";
import "@registry/components/continue-with-facebook/vite-express-tauri/v1/files/src/styles/continue-with-facebook.css";

import { DateInput } from "@registry/components/date-input/vite-express-tauri/v1/files/src/components/ui/DateInput";
import "@registry/components/date-input/vite-express-tauri/v1/files/src/styles/date-input.css";

import { TimeInput } from "@registry/components/time-input/vite-express-tauri/v1/files/src/components/ui/TimeInput";
import "@registry/components/time-input/vite-express-tauri/v1/files/src/styles/time-input.css";

import { DateTimeInput } from "@registry/components/date-time-input/vite-express-tauri/v1/files/src/components/ui/DateTimeInput";
import "@registry/components/date-time-input/vite-express-tauri/v1/files/src/styles/date-time-input.css";

import { InputGroup } from "@registry/components/input-group/vite-express-tauri/v1/files/src/components/ui/InputGroup";
import "@registry/components/input-group/vite-express-tauri/v1/files/src/styles/input-group.css";

import { Checkbox } from "@registry/components/checkbox/vite-express-tauri/v1/files/src/components/ui/Checkbox";
import "@registry/components/checkbox/vite-express-tauri/v1/files/src/styles/checkbox.css";

import { CheckboxGroup } from "@registry/components/checkbox-group/vite-express-tauri/v1/files/src/components/ui/CheckboxGroup";
import "@registry/components/checkbox-group/vite-express-tauri/v1/files/src/styles/checkbox-group.css";

import { Toast } from "@registry/components/toast/vite-express-tauri/v1/files/src/components/ui/Toast";
import "@registry/components/toast/vite-express-tauri/v1/files/src/styles/toast.css";

import { Spinner } from "@registry/components/spinner/vite-express-tauri/v1/files/src/components/ui/Spinner";
import "@registry/components/spinner/vite-express-tauri/v1/files/src/styles/spinner.css";

import { Tooltip } from "@registry/components/tooltip/vite-express-tauri/v1/files/src/components/ui/Tooltip";
import "@registry/components/tooltip/vite-express-tauri/v1/files/src/styles/tooltip.css";

import { DropdownMenu } from "@registry/components/dropdown-menu/vite-express-tauri/v1/files/src/components/ui/DropdownMenu";
import "@registry/components/dropdown-menu/vite-express-tauri/v1/files/src/styles/dropdown-menu.css";

import { Text } from "@registry/components/text/vite-express-tauri/v1/files/src/components/ui/Text";
import "@registry/components/text/vite-express-tauri/v1/files/src/styles/text.css";

import { Heading } from "@registry/components/heading/vite-express-tauri/v1/files/src/components/ui/Heading";
import "@registry/components/heading/vite-express-tauri/v1/files/src/styles/heading.css";

import { Paragraph } from "@registry/components/paragraph/vite-express-tauri/v1/files/src/components/ui/Paragraph";
import "@registry/components/paragraph/vite-express-tauri/v1/files/src/styles/paragraph.css";

import { Label } from "@registry/components/label/vite-express-tauri/v1/files/src/components/ui/Label";
import "@registry/components/label/vite-express-tauri/v1/files/src/styles/label.css";

import { Caption } from "@registry/components/caption/vite-express-tauri/v1/files/src/components/ui/Caption";
import "@registry/components/caption/vite-express-tauri/v1/files/src/styles/caption.css";

import { Link } from "@registry/components/link/vite-express-tauri/v1/files/src/components/ui/Link";
import "@registry/components/link/vite-express-tauri/v1/files/src/styles/link.css";

import { ActionButtonGroup } from "@registry/components/action-button-group/vite-express-tauri/v1/files/src/components/ui/ActionButtonGroup";
import "@registry/components/action-button-group/vite-express-tauri/v1/files/src/styles/action-button-group.css";

import { IconButtonGroup } from "@registry/components/icon-button-group/vite-express-tauri/v1/files/src/components/ui/IconButtonGroup";
import "@registry/components/icon-button-group/vite-express-tauri/v1/files/src/styles/icon-button-group.css";

import {
  ActionSplitButton,
  ActionSplitMenuTrigger,
} from "@registry/components/action-split-button/vite-express-tauri/v1/files/src/components/ui/ActionSplitButton";
import "@registry/components/action-split-button/vite-express-tauri/v1/files/src/styles/action-split-button.css";

import { ActionSegmentedControl } from "@registry/components/action-segmented-control/vite-express-tauri/v1/files/src/components/ui/ActionSegmentedControl";
import "@registry/components/action-segmented-control/vite-express-tauri/v1/files/src/styles/action-segmented-control.css";

import { ActionGroup } from "@registry/components/action-group/vite-express-tauri/v1/files/src/components/ui/ActionGroup";
import "@registry/components/action-group/vite-express-tauri/v1/files/src/styles/action-group.css";

import { Tabs } from "@registry/components/tabs/vite-express-tauri/v1/files/src/components/ui/Tabs";
import "@registry/components/tabs/vite-express-tauri/v1/files/src/styles/tabs.css";

import { TabBar } from "@registry/components/tab-bar/vite-express-tauri/v1/files/src/components/ui/TabBar";
import "@registry/components/tab-bar/vite-express-tauri/v1/files/src/styles/tab-bar.css";

import { Card } from "@registry/components/card/vite-express-tauri/v1/files/src/components/ui/Card";
import "@registry/components/card/vite-express-tauri/v1/files/src/styles/card.css";

import { Alert } from "@registry/components/alert/vite-express-tauri/v1/files/src/components/ui/Alert";
import "@registry/components/alert/vite-express-tauri/v1/files/src/styles/alert.css";

import { AlertDialog } from "@registry/components/alert-dialog/vite-express-tauri/v1/files/src/components/ui/AlertDialog";
import "@registry/components/alert-dialog/vite-express-tauri/v1/files/src/styles/alert-dialog.css";

import { Badge } from "@registry/components/badge/vite-express-tauri/v1/files/src/components/ui/Badge";
import "@registry/components/badge/vite-express-tauri/v1/files/src/styles/badge.css";

import { List } from "@registry/components/list/vite-express-tauri/v1/files/src/components/ui/List";
import "@registry/components/list/vite-express-tauri/v1/files/src/styles/list.css";

import { ListItem } from "@registry/components/list-item/vite-express-tauri/v1/files/src/components/ui/ListItem";
import "@registry/components/list-item/vite-express-tauri/v1/files/src/styles/list-item.css";

import { ProgressBar } from "@registry/components/progress-bar/vite-express-tauri/v1/files/src/components/ui/ProgressBar";
import "@registry/components/progress-bar/vite-express-tauri/v1/files/src/styles/progress-bar.css";

import { SearchField } from "@registry/components/search-field/vite-express-tauri/v1/files/src/components/ui/SearchField";
import "@registry/components/search-field/vite-express-tauri/v1/files/src/styles/search-field.css";

import { Skeleton, SkeletonGroup } from "@registry/components/skeleton/vite-express-tauri/v1/files/src/components/ui/Skeleton";
import "@registry/components/skeleton/vite-express-tauri/v1/files/src/styles/skeleton.css";

import { Brand } from "@registry/components/brand/vite-express-tauri/v1/files/src/components/ui/Brand";
import "@registry/components/brand/vite-express-tauri/v1/files/src/styles/brand.css";

import { Avatar } from "@registry/components/avatar/vite-express-tauri/v1/files/src/components/ui/Avatar";
import "@registry/components/avatar/vite-express-tauri/v1/files/src/styles/avatar.css";

import { AvatarGroup } from "@registry/components/avatar-group/vite-express-tauri/v1/files/src/components/ui/AvatarGroup";
import "@registry/components/avatar-group/vite-express-tauri/v1/files/src/styles/avatar-group.css";

import { Tag } from "@registry/components/tag/vite-express-tauri/v1/files/src/components/ui/Tag";
import "@registry/components/tag/vite-express-tauri/v1/files/src/styles/tag.css";

import { Divider } from "@registry/components/divider/vite-express-tauri/v1/files/src/components/ui/Divider";
import "@registry/components/divider/vite-express-tauri/v1/files/src/styles/divider.css";

import { Surface } from "@registry/components/surface/vite-express-tauri/v1/files/src/components/ui/Surface";
import "@registry/components/surface/vite-express-tauri/v1/files/src/styles/surface.css";

import { NavItem } from "@registry/components/nav-item/vite-express-tauri/v1/files/src/components/ui/NavItem";
import "@registry/components/nav-item/vite-express-tauri/v1/files/src/styles/nav-item.css";

import { Breadcrumb } from "@registry/components/breadcrumb/vite-express-tauri/v1/files/src/components/ui/Breadcrumb";
import "@registry/components/breadcrumb/vite-express-tauri/v1/files/src/styles/breadcrumb.css";

import { NavigationDrawer } from "@registry/components/navigation-drawer/vite-express-tauri/v1/files/src/components/ui/NavigationDrawer";
import "@registry/components/navigation-drawer/vite-express-tauri/v1/files/src/styles/navigation-drawer.css";

import { Navbar } from "@registry/components/navbar/vite-express-tauri/v1/files/src/components/ui/Navbar";
import "@registry/components/navbar/vite-express-tauri/v1/files/src/styles/navbar.css";

import { NavActions } from "@registry/components/nav-actions/vite-express-tauri/v1/files/src/components/ui/NavActions";
import "@registry/components/nav-actions/vite-express-tauri/v1/files/src/styles/nav-actions.css";

import { ThemeToggle, DEFAULT_THEMES } from "@registry/components/theme-toggle/vite-express-tauri/v1/files/src/components/ui/ThemeToggle";
import "@registry/components/theme-toggle/vite-express-tauri/v1/files/src/styles/theme-toggle.css";

import { ColorPalette } from "@registry/components/color-palette/vite-express-tauri/v1/files/src/components/ui/ColorPalette";
import "@registry/components/color-palette/vite-express-tauri/v1/files/src/styles/color-palette.css";


export type PreviewEntry = {
  Preview: ComponentType;
  Mini?: ComponentType;
  Variants?: ComponentType;
  Playground?: ComponentType;
  sourceImport?: string;
};

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5l2.1 4.26 4.7.68-3.4 3.31.8 4.68L10 13.27 5.8 15.43l.8-4.68-3.4-3.31 4.7-.68L10 2.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="10" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="16" cy="10" r="1.5" />
    </svg>
  );
}

const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "tertiary",
  "destructive",
  "success",
  "quiet",
  "inverse",
] as const;

function ButtonPreview() {
  return <Button>Button</Button>;
}

function ButtonVariants() {
  return (
    <div className="pg-variant-grid">
      {BUTTON_VARIANTS.map((v) => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  );
}

function ButtonPlayground() {
  const [variant, setVariant] = useState<(typeof BUTTON_VARIANTS)[number]>("primary");
  const [label, setLabel] = useState("Save changes");
  const [loading, setLoading] = useState(false);
  return (
    <div className="pg-playground">
      <div className="pg-playground__controls">
        <TextInput label="Label" value={label} onValueChange={setLabel} />
        <ActionSegmentedControl
          label="Variant"
          size="sm"
          value={variant}
          onValueChange={(v: string) => setVariant(v as (typeof BUTTON_VARIANTS)[number])}
          options={BUTTON_VARIANTS.map((v) => ({ id: v, label: v }))}
          overflow="scroll"
          equalWidth={false}
        />
        <Checkbox
          label="Loading"
          checked={loading}
          onCheckedChange={(c: boolean) => setLoading(Boolean(c))}
        />
      </div>
      <div className="pg-playground__stage">
        <Button variant={variant} loading={loading}>
          {label}
        </Button>
      </div>
    </div>
  );
}

function IconButtonPreview() {
  return <IconButton label="Favorite" icon={<StarIcon />} />;
}

function CardPreview() {
  return (
    <Card variant="outlined">
      <Card.Header>
        <Card.Title as="h3">Card title</Card.Title>
        <Card.Description>Composable surface for related content.</Card.Description>
      </Card.Header>
    </Card>
  );
}

function CardVariants() {
  const variants = ["standard", "compact", "elevated", "outlined"] as const;
  return (
    <div className="pg-variant-grid">
      {variants.map((v) => (
        <Card key={v} variant={v}>
          <Card.Header>
            <Card.Title as="h3">{v}</Card.Title>
            <Card.Description>Card variant preview</Card.Description>
          </Card.Header>
        </Card>
      ))}
    </div>
  );
}

export const PREVIEWS: Record<string, PreviewEntry> = {
  button: {
    Preview: ButtonPreview,
    Mini: ButtonPreview,
    Variants: ButtonVariants,
    Playground: ButtonPlayground,
  },
  "icon-button": {
    Preview: IconButtonPreview,
    Mini: IconButtonPreview,
    Variants: () => (
      <div className="pg-variant-grid">
        {(["neutral", "subtle", "filled", "outlined", "destructive"] as const).map((v) => (
          <IconButton key={v} label={v} variant={v} icon={<StarIcon />} />
        ))}
      </div>
    ),
  },
  "button-group": {
    Preview: () => (
      <ButtonGroup label="Actions">
        <Button variant="secondary">One</Button>
        <Button variant="secondary">Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    ),
  },
  "split-button": {
    Preview: () => (
      <SplitButton
        menuLabel="More save options"
        items={[
          { id: "draft", label: "Save draft" },
          { id: "copy", label: "Save a copy" },
        ]}
      >
        Save
      </SplitButton>
    ),
  },
  "link-button": {
    Preview: () => <LinkButton>Learn more</LinkButton>,
  },
  "toggle-button": {
    Preview: () => <ToggleButton label="Bold" appearance="text" defaultPressed />,
  },
  "command-button": {
    Preview: () => (
      <CommandButton label="Open file" description="Browse your library" shortcut="⌘O" fullWidth />
    ),
  },
  "action-menu-trigger": {
    Preview: () => (
      <ActionMenuTrigger
        label="More actions"
        appearance="icon"
        icon={<MoreIcon />}
        items={[
          { id: "edit", label: "Edit" },
          { id: "duplicate", label: "Duplicate" },
          { id: "delete", label: "Delete", destructive: true },
        ]}
      />
    ),
    Mini: () => (
      <ActionMenuTrigger
        label="More"
        appearance="labeled"
        items={[{ id: "a", label: "Action" }]}
      >
        Menu
      </ActionMenuTrigger>
    ),
  },
  "text-input": {
    Preview: () => <TextInput label="Email" type="email" placeholder="you@example.com" />,
    Mini: () => <TextInput label="Name" hideLabel placeholder="Name" />,
  },
  "number-input": {
    Preview: () => <NumberInput label="Quantity" defaultValue={1} />,
  },
  "password-input": {
    Preview: () => {
      const [password, setPassword] = useState("");
      return (
        <PasswordInput
          label="Password"
          purpose="new"
          value={password}
          onValueChange={setPassword}
          requirements={<PasswordRequirements value={password} variant="checklist" />}
          strengthSlot={<PasswordStrength value={password} variant="detailed" />}
        />
      );
    },
  },
  "password-visibility-toggle": {
    Preview: () => {
      const [visible, setVisible] = useState(false);
      return (
        <PasswordVisibilityToggle
          visible={visible}
          onVisibleChange={setVisible}
          size="md"
          variant="subtle"
        />
      );
    },
    Mini: () => <PasswordVisibilityToggle defaultVisible={false} size="sm" />,
    Variants: () => (
      <div className="pg-variant-grid">
        <PasswordVisibilityToggle defaultVisible={false} variant="neutral" size="sm" />
        <PasswordVisibilityToggle defaultVisible size="sm" variant="subtle" />
        <PasswordVisibilityToggle defaultVisible={false} size="md" variant="outlined" />
        <PasswordVisibilityToggle defaultVisible={false} size="sm" disabled />
        <PasswordVisibilityToggle defaultVisible={false} size="sm" readOnly />
      </div>
    ),
  },
  "password-strength": {
    Preview: () => {
      const [password, setPassword] = useState("DevKit!");
      return (
        <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 360 }}>
          <PasswordInput
            label="New password"
            purpose="new"
            value={password}
            onValueChange={setPassword}
            hideLabel
            placeholder="Type to test strength"
          />
          <PasswordStrength value={password} variant="detailed" />
        </div>
      );
    },
    Mini: () => <PasswordStrength value="Abcdef12!" variant="compact" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <PasswordStrength value="a" variant="compact" />
        <PasswordStrength value="Abcdef12" variant="inline" />
        <PasswordStrength value="Abcdef12!xyz" variant="stacked" />
        <PasswordStrength value="Str0ng!Pass#2026" variant="detailed" />
        <PasswordStrength value="checking" loading />
      </div>
    ),
  },
  "password-requirements": {
    Preview: () => {
      const [password, setPassword] = useState("Dev");
      return (
        <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 400 }}>
          <PasswordInput
            label="Create password"
            purpose="new"
            value={password}
            onValueChange={setPassword}
            requirements={<PasswordRequirements value={password} variant="checklist" />}
          />
        </div>
      );
    },
    Mini: () => <PasswordRequirements value="Abcdef12!" variant="compact" hideLabel />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <PasswordRequirements value="" variant="checklist" />
        <PasswordRequirements value="short" variant="compact" />
        <PasswordRequirements value="Abcdef12!xyz" variant="detailed" />
        <PasswordRequirements
          value="ok"
          rules={[
            { id: "len", label: "8+ characters", test: (p) => p.length >= 8 },
            { id: "num", label: "Includes a number", test: (p) => /\d/.test(p) },
          ]}
        />
      </div>
    ),
  },
  "verification-code-input": {
    Preview: () => {
      const [code, setCode] = useState("");
      return (
        <VerificationCodeInput
          flow="email-verification"
          value={code}
          onValueChange={setCode}
          footerSlot={
            <ResendVerification
              flow="email-verification"
              cooldownDuration={30}
              onResend={async () => undefined}
            />
          }
        />
      );
    },
    Mini: () => <VerificationCodeInput flow="two-factor" hideLabel defaultValue="12" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <VerificationCodeInput flow="email-verification" />
        <VerificationCodeInput flow="password-reset" length={8} />
        <VerificationCodeInput flow="authenticator" />
        <VerificationCodeInput flow="two-factor" validation="error" errorMessage="Invalid code" />
        <VerificationCodeInput flow="two-factor" loading />
        <VerificationCodeInput flow="email-verification" mode="alphanumeric" length={4} />
      </div>
    ),
  },
  "verification-success": {
    Preview: () => (
      <VerificationSuccess
        flow="email-verification"
        redirectTo="/dashboard"
        redirectDelay={8}
        actions={[{ label: "Continue", href: "#", emphasis: "primary" }]}
      />
    ),
    Mini: () => <VerificationSuccess flow="two-factor" variant="compact" showRedirectBadge={false} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <VerificationSuccess flow="email-verification" />
        <VerificationSuccess flow="phone-verification" variant="compact" />
        <VerificationSuccess flow="passkeys" variant="inline" redirectTo="/home" />
        <VerificationSuccess
          flow="two-factor"
          variant="banner"
          actions={[{ label: "Go to app", href: "#", emphasis: "primary" }]}
        />
      </div>
    ),
  },
  "verification-failed": {
    Preview: () => (
      <VerificationFailed
        flow="email-verification"
        reason="invalid"
        onRetry={() => undefined}
        onResend={() => undefined}
      />
    ),
    Mini: () => <VerificationFailed flow="two-factor" reason="expired" variant="compact" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <VerificationFailed flow="email-verification" reason="invalid" onRetry={() => undefined} onResend={() => undefined} />
        <VerificationFailed flow="phone-verification" reason="expired" onResend={() => undefined} />
        <VerificationFailed flow="passkeys" reason="network" onRetry={() => undefined} />
        <VerificationFailed flow="two-factor" reason="locked" variant="compact" />
        <VerificationFailed flow="password-reset" reason="unknown" variant="banner" onRetry={() => undefined} onResend={() => undefined} />
      </div>
    ),
  },
  "authentication-loading": {
    Preview: () => <AuthenticationLoading flow="sign-in" />,
    Mini: () => <AuthenticationLoading flow="passkey" variant="inline" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <AuthenticationLoading flow="sign-in" />
        <AuthenticationLoading flow="account-creation" variant="form" />
        <AuthenticationLoading flow="password-reset" variant="compact" />
        <AuthenticationLoading flow="passkey" />
        <AuthenticationLoading flow="email-verification" />
        <AuthenticationLoading flow="session-restoration" />
        <AuthenticationLoading flow="sign-in" variant="inline" />
      </div>
    ),
  },
  "authentication-success": {
    Preview: () => (
      <AuthenticationSuccess
        flow="sign-in"
        redirectTo="/dashboard"
        redirectDelay={8}
        onContinue={() => undefined}
      />
    ),
    Mini: () => <AuthenticationSuccess flow="passkey" variant="compact" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <AuthenticationSuccess flow="sign-in" onContinue={() => undefined} />
        <AuthenticationSuccess flow="account-creation" variant="compact" onContinue={() => undefined} />
        <AuthenticationSuccess flow="password-reset" redirectTo="/login" onContinue={() => undefined} />
        <AuthenticationSuccess flow="passkey" />
        <AuthenticationSuccess flow="email-verification" />
        <AuthenticationSuccess flow="two-factor" variant="banner" onContinue={() => undefined} />
        <AuthenticationSuccess flow="session-restoration" onContinue={() => undefined} />
      </div>
    ),
  },
  "authentication-error": {
    Preview: () => (
      <AuthenticationError
        flow="sign-in"
        reason="invalid"
        onRetry={() => undefined}
        onTryAlternative={() => undefined}
      />
    ),
    Mini: () => <AuthenticationError flow="passkey" reason="canceled" variant="compact" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <AuthenticationError flow="sign-in" reason="invalid" onRetry={() => undefined} onTryAlternative={() => undefined} />
        <AuthenticationError flow="account-creation" reason="network" onRetry={() => undefined} />
        <AuthenticationError flow="password-reset" reason="expired" onRetry={() => undefined} />
        <AuthenticationError flow="passkey" reason="canceled" onRetry={() => undefined} onTryAlternative={() => undefined} />
        <AuthenticationError flow="email-verification" reason="locked" variant="compact" />
        <AuthenticationError flow="two-factor" reason="invalid" onRetry={() => undefined} onTryAlternative={() => undefined} />
        <AuthenticationError flow="session-restoration" reason="unknown" variant="banner" onRetry={() => undefined} onTryAlternative={() => undefined} />
      </div>
    ),
  },
  "session-expired": {
    Preview: () => (
      <SessionExpired
        reason="idle"
        variant="page"
        returnUrl="/settings/security"
        onSignIn={() => undefined}
        onSecondary={() => undefined}
      />
    ),
    Mini: () => <SessionExpired reason="absolute" variant="compact" onSignIn={() => undefined} showSecondary={false} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <SessionExpired reason="idle" onSignIn={() => undefined} onSecondary={() => undefined} />
        <SessionExpired reason="absolute" variant="compact" onSignIn={() => undefined} onSecondary={() => undefined} />
        <SessionExpired reason="revoked" variant="banner" onSignIn={() => undefined} onSecondary={() => undefined} />
        <SessionExpired reason="unknown" returnUrl="/projects/42" onSignIn={() => undefined} onSecondary={() => undefined} />
      </div>
    ),
  },
  "account-locked": {
    Preview: () => (
      <AccountLocked
        reason="attempts"
        variant="page"
        unlockHint="15 minutes"
        referenceId="LK-2048"
        onRecover={() => undefined}
        onSupport={() => undefined}
      />
    ),
    Mini: () => <AccountLocked reason="admin" variant="compact" onSupport={() => undefined} showRecover={false} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <AccountLocked reason="attempts" onRecover={() => undefined} onSupport={() => undefined} />
        <AccountLocked reason="admin" variant="compact" onRecover={() => undefined} onSupport={() => undefined} />
        <AccountLocked reason="policy" variant="banner" onRecover={() => undefined} onSupport={() => undefined} />
        <AccountLocked reason="risk" referenceId="RISK-991" onRecover={() => undefined} onSupport={() => undefined} />
        <AccountLocked reason="unknown" unlockHint="contact IT" onRecover={() => undefined} onSupport={() => undefined} />
      </div>
    ),
  },
  icon: {
    Preview: () => (
      <Icon size="lg" label="Demo">
        <GoogleIcon />
      </Icon>
    ),
    Mini: () => (
      <Icon size="sm">
        <GoogleIcon />
      </Icon>
    ),
    Variants: () => (
      <div className="pg-variant-grid">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <Icon key={size} size={size} label={size}>
            <GoogleIcon />
          </Icon>
        ))}
      </div>
    ),
  },
  "continue-with-provider": {
    Preview: () => (
      <ContinueWithProvider.Group>
        <ContinueWithGoogle onContinue={() => undefined} fullWidth />
        <ContinueWithMicrosoft onContinue={() => undefined} fullWidth />
        <ContinueWithApple onContinue={() => undefined} fullWidth />
        <ContinueWithDiscord onContinue={() => undefined} fullWidth />
        <ContinueWithSlack onContinue={() => undefined} fullWidth />
        <ContinueWithLinkedIn onContinue={() => undefined} fullWidth />
        <ContinueWithX onContinue={() => undefined} fullWidth />
        <ContinueWithFacebook onContinue={() => undefined} fullWidth />
        <ContinueWithProvider
          provider="acme"
          label="Continue with Acme"
          icon={<GoogleIcon />}
          onContinue={() => undefined}
          fullWidth
          tooltip="Example generic provider"
        />
      </ContinueWithProvider.Group>
    ),
    Mini: () => (
      <ContinueWithProvider provider="demo" label="Continue" icon={<GoogleIcon />} size="sm" />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ContinueWithProvider provider="demo" label="Idle" icon={<GoogleIcon />} state="idle" />
        <ContinueWithProvider provider="demo" label="Loading" icon={<GoogleIcon />} state="loading" />
        <ContinueWithProvider provider="demo" label="Success" icon={<GoogleIcon />} state="success" />
        <ContinueWithProvider provider="demo" label="Error" icon={<GoogleIcon />} state="error" />
        <ContinueWithProvider provider="demo" label="Disabled" icon={<GoogleIcon />} state="disabled" />
      </div>
    ),
  },
  "continue-with-google": {
    Preview: () => <ContinueWithGoogle onContinue={() => undefined} fullWidth />,
    Mini: () => <ContinueWithGoogle size="sm" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ContinueWithGoogle state="idle" />
        <ContinueWithGoogle state="loading" />
        <ContinueWithGoogle state="success" />
        <ContinueWithGoogle state="error" />
        <ContinueWithGoogle state="disabled" />
        <ContinueWithGoogle loading />
      </div>
    ),
  },
  "continue-with-microsoft": {
    Preview: () => <ContinueWithMicrosoft onContinue={() => undefined} fullWidth />,
    Mini: () => <ContinueWithMicrosoft size="sm" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ContinueWithMicrosoft state="idle" />
        <ContinueWithMicrosoft state="loading" />
        <ContinueWithMicrosoft state="success" />
        <ContinueWithMicrosoft state="error" />
        <ContinueWithMicrosoft state="disabled" />
        <ContinueWithMicrosoft loading />
      </div>
    ),
  },
  "continue-with-apple": {
    Preview: () => <ContinueWithApple onContinue={() => undefined} fullWidth />,
    Mini: () => <ContinueWithApple size="sm" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ContinueWithApple state="idle" />
        <ContinueWithApple state="loading" />
        <ContinueWithApple state="success" />
        <ContinueWithApple state="error" />
        <ContinueWithApple state="disabled" />
        <ContinueWithApple loading />
      </div>
    ),
  },
  "continue-with-discord": {
    Preview: () => <ContinueWithDiscord onContinue={() => undefined} fullWidth />,
    Mini: () => <ContinueWithDiscord size="sm" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ContinueWithDiscord state="idle" />
        <ContinueWithDiscord state="loading" />
        <ContinueWithDiscord state="success" />
        <ContinueWithDiscord state="error" />
        <ContinueWithDiscord state="disabled" />
        <ContinueWithDiscord loading />
      </div>
    ),
  },
  "continue-with-slack": {
    Preview: () => <ContinueWithSlack onContinue={() => undefined} fullWidth />,
    Mini: () => <ContinueWithSlack size="sm" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ContinueWithSlack state="idle" />
        <ContinueWithSlack state="loading" />
        <ContinueWithSlack state="success" />
        <ContinueWithSlack state="error" />
        <ContinueWithSlack state="disabled" />
        <ContinueWithSlack loading />
      </div>
    ),
  },
  "continue-with-linkedin": {
    Preview: () => <ContinueWithLinkedIn onContinue={() => undefined} fullWidth />,
    Mini: () => <ContinueWithLinkedIn size="sm" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ContinueWithLinkedIn state="idle" />
        <ContinueWithLinkedIn state="loading" />
        <ContinueWithLinkedIn state="success" />
        <ContinueWithLinkedIn state="error" />
        <ContinueWithLinkedIn state="disabled" />
        <ContinueWithLinkedIn loading />
      </div>
    ),
  },
  "continue-with-x": {
    Preview: () => <ContinueWithX onContinue={() => undefined} fullWidth />,
    Mini: () => <ContinueWithX size="sm" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ContinueWithX state="idle" />
        <ContinueWithX state="loading" />
        <ContinueWithX state="success" />
        <ContinueWithX state="error" />
        <ContinueWithX state="disabled" />
        <ContinueWithX loading />
      </div>
    ),
  },
  "continue-with-facebook": {
    Preview: () => <ContinueWithFacebook onContinue={() => undefined} fullWidth />,
    Mini: () => <ContinueWithFacebook size="sm" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ContinueWithFacebook state="idle" />
        <ContinueWithFacebook state="loading" />
        <ContinueWithFacebook state="success" />
        <ContinueWithFacebook state="error" />
        <ContinueWithFacebook state="disabled" />
        <ContinueWithFacebook loading />
      </div>
    ),
  },
  "countdown-timer": {
    Preview: () => (
      <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 360 }}>
        <CountdownTimer
          flow="verification"
          duration={45}
          expiredSlot={<Button size="sm">Resend code</Button>}
        />
      </div>
    ),
    Mini: () => <CountdownTimer flow="verification" duration={12} variant="compact" hideLabel showControls={false} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <CountdownTimer flow="verification" duration={20} variant="stacked" />
        <CountdownTimer flow="email-confirmation" duration={25} variant="compact" />
        <CountdownTimer flow="verification" duration={15} variant="inline" />
        <CountdownTimer flow="email-confirmation" duration={18} variant="meter" />
        <CountdownTimer flow="verification" duration={8} defaultPaused />
      </div>
    ),
  },
  "resend-verification": {
    Preview: () => (
      <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 360 }}>
        <ResendVerification
          flow="otp-verification"
          cooldownDuration={8}
          onResend={async () => {
            await new Promise((r) => setTimeout(r, 600));
          }}
        />
      </div>
    ),
    Mini: () => (
      <ResendVerification flow="two-factor" cooldownDuration={5} autoStartCooldown={false} onResend={() => undefined} />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ResendVerification flow="email-verification" cooldownDuration={12} onResend={async () => undefined} />
        <ResendVerification flow="otp-verification" variant="compact" cooldownDuration={10} onResend={async () => undefined} />
        <ResendVerification flow="password-reset" variant="inline" cooldownDuration={10} onResend={async () => undefined} />
        <ResendVerification flow="magic-link" cooldownDuration={15} onResend={async () => undefined} />
        <ResendVerification flow="two-factor" status="loading" autoStartCooldown={false} onResend={() => undefined} />
        <ResendVerification
          flow="otp-verification"
          autoStartCooldown={false}
          status="error"
          onResend={async () => {
            throw new Error("fail");
          }}
        />
      </div>
    ),
  },
  "verification-email-sent": {
    Preview: () => (
      <VerificationEmailSent
        email="ada@example.com"
        linkExpiryDuration={45}
        resendCooldownDuration={12}
        onResend={async () => {
          await new Promise((r) => setTimeout(r, 500));
        }}
        onChangeEmail={() => undefined}
      />
    ),
    Mini: () => (
      <VerificationEmailSent
        email="a@b.co"
        variant="compact"
        linkExpiryDuration={20}
        showResend={false}
        onChangeEmail={() => undefined}
      />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <VerificationEmailSent email="stacked@example.com" variant="stacked" onChangeEmail={() => undefined} onResend={async () => undefined} />
        <VerificationEmailSent email="compact@example.com" variant="compact" onChangeEmail={() => undefined} onResend={async () => undefined} />
        <VerificationEmailSent email="split@example.com" variant="split" onChangeEmail={() => undefined} onResend={async () => undefined} />
        <VerificationEmailSent email="loading@example.com" status="loading" onChangeEmail={() => undefined} />
        <VerificationEmailSent email="error@example.com" status="error" errorMessage="Mailbox rejected the message." onChangeEmail={() => undefined} showResend={false} />
      </div>
    ),
  },
  "forgot-password": {
    Preview: () => (
      <ForgotPassword
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 700));
        }}
        onBack={() => undefined}
      />
    ),
    Mini: () => (
      <ForgotPassword
        variant="compact"
        showMethodChoice={false}
        defaultEmail="a@b.co"
        onSubmit={async () => undefined}
      />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ForgotPassword variant="stacked" onSubmit={async () => undefined} onBack={() => undefined} />
        <ForgotPassword variant="compact" defaultMethod="verification-code" onSubmit={async () => undefined} />
        <ForgotPassword variant="split" onSubmit={async () => undefined} onBack={() => undefined} />
        <ForgotPassword status="loading" defaultEmail="loading@example.com" onSubmit={async () => undefined} />
        <ForgotPassword status="success" defaultEmail="ok@example.com" onSubmit={async () => undefined} onBack={() => undefined} />
        <ForgotPassword
          status="error"
          defaultEmail="fail@example.com"
          errorMessage="Too many attempts. Try again later."
          onSubmit={async () => undefined}
          onBack={() => undefined}
        />
      </div>
    ),
  },
  "magic-link-login": {
    Preview: () => (
      <MagicLinkLogin
        onRequestLink={async () => {
          await new Promise((r) => setTimeout(r, 600));
        }}
        providers={[
          { id: "google", label: "Continue with Google", icon: <GoogleIcon />, onContinue: () => undefined },
        ]}
        linkExpiryDuration={40}
        resendCooldownDuration={10}
      />
    ),
    Mini: () => (
      <MagicLinkLogin
        variant="compact"
        showProviders={false}
        defaultEmail="a@b.co"
        onRequestLink={async () => undefined}
      />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <MagicLinkLogin variant="stacked" showProviders={false} onRequestLink={async () => undefined} />
        <MagicLinkLogin variant="compact" showProviders={false} onRequestLink={async () => undefined} />
        <MagicLinkLogin
          variant="split"
          providers={[{ id: "apple", label: "Continue with Apple", icon: <AppleIcon />, onContinue: () => undefined }]}
          onRequestLink={async () => undefined}
        />
        <MagicLinkLogin status="loading" defaultEmail="loading@example.com" showProviders={false} onRequestLink={async () => undefined} />
        <MagicLinkLogin view="sent" defaultEmail="sent@example.com" linkExpiryDuration={30} onRequestLink={async () => undefined} />
        <MagicLinkLogin status="error" defaultEmail="bad" errorMessage="Enter a valid email address" showProviders={false} onRequestLink={async () => undefined} />
      </div>
    ),
  },
  "reset-password": {
    Preview: () => (
      <ResetPassword
        flow="recovery"
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 700));
        }}
        showCancel
        onCancel={() => undefined}
      />
    ),
    Mini: () => <ResetPassword flow="onboarding" variant="compact" onSubmit={async () => undefined} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ResetPassword flow="recovery" onSubmit={async () => undefined} />
        <ResetPassword flow="change" onSubmit={async () => undefined} />
        <ResetPassword flow="onboarding" variant="compact" onSubmit={async () => undefined} />
        <ResetPassword flow="recovery" variant="split" onSubmit={async () => undefined} />
        <ResetPassword flow="recovery" status="loading" defaultPassword="LoadingPass1!" defaultConfirmPassword="LoadingPass1!" onSubmit={async () => undefined} />
        <ResetPassword flow="recovery" status="success" onSubmit={async () => undefined} />
        <ResetPassword
          flow="change"
          status="error"
          errorMessage="Current password is incorrect."
          onSubmit={async () => undefined}
        />
      </div>
    ),
  },
  "passkey-login": {
    Preview: () => (
      <PasskeyLogin
        detectSupport={false}
        onAuthenticate={async () => {
          await new Promise((r) => setTimeout(r, 800));
        }}
        onFallback={() => undefined}
        onContinue={() => undefined}
      />
    ),
    Mini: () => (
      <PasskeyLogin
        variant="compact"
        detectSupport={false}
        showAuthenticatorList={false}
        onAuthenticate={async () => undefined}
      />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <PasskeyLogin detectSupport={false} variant="stacked" onAuthenticate={async () => undefined} onFallback={() => undefined} />
        <PasskeyLogin detectSupport={false} variant="compact" onAuthenticate={async () => undefined} />
        <PasskeyLogin detectSupport={false} variant="split" onAuthenticate={async () => undefined} onFallback={() => undefined} />
        <PasskeyLogin detectSupport={false} status="loading" onAuthenticate={async () => undefined} />
        <PasskeyLogin detectSupport={false} status="success" onAuthenticate={async () => undefined} onContinue={() => undefined} />
        <PasskeyLogin detectSupport={false} status="error" errorReason="canceled" onAuthenticate={async () => undefined} onFallback={() => undefined} />
        <PasskeyLogin detectSupport={false} status="error" errorReason="expired" onAuthenticate={async () => undefined} onFallback={() => undefined} />
        <PasskeyLogin detectSupport={false} status="unsupported" onAuthenticate={async () => undefined} onFallback={() => undefined} />
      </div>
    ),
  },
  "register-passkey": {
    Preview: () => (
      <RegisterPasskey
        detectSupport={false}
        accountLabel="ada@example.com"
        onRegister={async () => {
          await new Promise((r) => setTimeout(r, 700));
        }}
        onFallback={() => undefined}
        onContinue={() => undefined}
      />
    ),
    Mini: () => (
      <RegisterPasskey
        detectSupport={false}
        skipConfirmation
        variant="compact"
        showAuthenticatorList={false}
        onRegister={async () => undefined}
      />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <RegisterPasskey detectSupport={false} step="confirm" onRegister={async () => undefined} onFallback={() => undefined} />
        <RegisterPasskey detectSupport={false} skipConfirmation variant="compact" onRegister={async () => undefined} />
        <RegisterPasskey detectSupport={false} skipConfirmation step="register" status="loading" onRegister={async () => undefined} />
        <RegisterPasskey detectSupport={false} skipConfirmation status="success" onRegister={async () => undefined} onContinue={() => undefined} />
        <RegisterPasskey detectSupport={false} skipConfirmation status="error" onRegister={async () => undefined} onFallback={() => undefined} />
      </div>
    ),
  },
  "empty-state": {
    Preview: () => (
      <EmptyState
        title="No passkeys yet"
        description="Register a passkey to sign in without a password."
        actions={<Button size="sm" variant="secondary">Add passkey</Button>}
      />
    ),
    Mini: () => <EmptyState variant="compact" title="Nothing here" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <EmptyState variant="stacked" title="Stacked" description="Default empty region." />
        <EmptyState variant="compact" title="Compact" description="Dense placeholder." />
        <EmptyState variant="inline" title="Inline" description="Horizontal layout." />
      </div>
    ),
  },
  "dialog": {
    Preview: () => {
      const [open, setOpen] = useState(true);
      return (
        <>
          <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
            Open dialog
          </Button>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="Rename passkey"
            description="Choose a recognizable name."
            actions={
              <>
                <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={() => setOpen(false)}>
                  Save
                </Button>
              </>
            }
          >
            <TextInput label="Name" defaultValue="MacBook Pro" fullWidth />
          </Dialog>
        </>
      );
    },
  },
  "data-table": {
    Preview: () => (
      <DataTable
        caption="Sample rows"
        columns={[
          { id: "name", header: "Name", accessor: "name", sortable: true },
          { id: "os", header: "OS", accessor: "os", sortable: true },
        ]}
        data={[
          { id: "1", name: "MacBook Pro", os: "macOS" },
          { id: "2", name: "Pixel 8", os: "Android" },
        ]}
      />
    ),
    Mini: () => (
      <DataTable
        showSearch={false}
        columns={[{ id: "name", header: "Name", accessor: "name" }]}
        data={[{ id: "1", name: "Sample" }]}
      />
    ),
  },
  "passkey-management": {
    Preview: () => {
      const [passkeys, setPasskeys] = useState<PasskeyCredential[]>([
        {
          id: "1",
          name: "MacBook Pro",
          device: "mac",
          browser: "Safari",
          os: "macOS 15",
          createdAt: "2026-01-12",
          lastUsedAt: "2026-08-01",
          isDefault: true,
        },
        {
          id: "2",
          name: "iPhone 16",
          device: "iphone",
          browser: "Safari",
          os: "iOS 18",
          createdAt: "2026-03-04",
          lastUsedAt: "2026-07-20",
        },
        {
          id: "3",
          name: "YubiKey 5",
          device: "security-key",
          browser: "Chrome",
          os: "Windows 11",
          createdAt: "2025-11-02",
          lastUsedAt: "2026-06-15",
        },
      ]);
      return (
        <PasskeyManagement
          passkeys={passkeys}
          onRename={async (id, name) => {
            setPasskeys((rows) => rows.map((row) => (row.id === id ? { ...row, name } : row)));
          }}
          onRemove={async (id) => {
            setPasskeys((rows) => rows.filter((row) => row.id !== id));
          }}
          onSetDefault={async (id) => {
            setPasskeys((rows) => rows.map((row) => ({ ...row, isDefault: row.id === id })));
          }}
          onAdd={() => undefined}
        />
      );
    },
    Mini: () => <PasskeyManagement passkeys={[]} showFilters={false} onAdd={() => undefined} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <PasskeyManagement
          variant="compact"
          passkeys={[
            {
              id: "1",
              name: "Work laptop",
              device: "windows",
              browser: "Edge",
              os: "Windows 11",
              createdAt: "2026-02-01",
              lastUsedAt: "2026-08-02",
              isDefault: true,
            },
          ]}
          onRename={async () => undefined}
          onRemove={async () => undefined}
        />
        <PasskeyManagement passkeys={[]} onAdd={() => undefined} />
      </div>
    ),
  },
  "active-sessions": {
    Preview: () => {
      const [sessions, setSessions] = useState<ActiveSession[]>([
        {
          id: "1",
          deviceName: "MacBook Pro",
          deviceKind: "laptop",
          browser: "Chrome 128",
          os: "macOS 15",
          location: "San Francisco, US",
          ipAddress: "203.0.113.10",
          lastActiveAt: "2026-08-08T08:30:00Z",
          isCurrent: true,
          trusted: true,
        },
        {
          id: "2",
          deviceName: "iPhone 16",
          deviceKind: "phone",
          browser: "Safari",
          os: "iOS 18",
          location: "San Francisco, US",
          ipAddress: "203.0.113.22",
          lastActiveAt: "2026-08-07T19:12:00Z",
          trusted: true,
        },
        {
          id: "3",
          deviceName: "Windows Desktop",
          deviceKind: "desktop",
          browser: "Edge",
          os: "Windows 11",
          location: "Austin, US",
          ipAddress: "198.51.100.44",
          lastActiveAt: "2026-08-01T14:05:00Z",
        },
        {
          id: "4",
          deviceName: "Unknown tablet",
          deviceKind: "tablet",
          browser: "Firefox",
          os: "Android 14",
          location: "Berlin, DE",
          ipAddress: "192.0.2.88",
          lastActiveAt: "2026-07-20T09:40:00Z",
        },
      ]);
      return (
        <ActiveSessions
          sessions={sessions}
          onRevoke={async (id) => {
            await new Promise((r) => setTimeout(r, 400));
            setSessions((rows) => rows.filter((row) => row.id !== id));
          }}
          onRevokeAll={async () => {
            await new Promise((r) => setTimeout(r, 500));
            setSessions((rows) => rows.filter((row) => row.isCurrent));
          }}
          onTrust={async (id, trusted) => {
            await new Promise((r) => setTimeout(r, 300));
            setSessions((rows) =>
              rows.map((row) => (row.id === id ? { ...row, trusted } : row))
            );
          }}
        />
      );
    },
    Mini: () => <ActiveSessions sessions={[]} showFilters={false} showRevokeAll={false} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <ActiveSessions
          variant="compact"
          showIp={false}
          sessions={[
            {
              id: "c1",
              deviceName: "This browser",
              deviceKind: "laptop",
              browser: "Safari",
              os: "macOS",
              location: "Local",
              lastActiveAt: "2026-08-08T10:00:00Z",
              isCurrent: true,
            },
          ]}
          showRevokeAll={false}
        />
        <ActiveSessions status="loading" />
        <ActiveSessions status="error" errorReason="network" onRetry={() => undefined} />
        <ActiveSessions refreshing sessions={[]} />
      </div>
    ),
  },
  "trusted-devices": {
    Preview: () => {
      const [devices, setDevices] = useState<TrustedDevice[]>([
        {
          id: "1",
          name: "MacBook Pro",
          deviceKind: "laptop",
          browser: "Chrome 128",
          os: "macOS 15",
          lastActiveAt: "2026-08-08T08:30:00Z",
          trustedAt: "2026-01-12",
          isCurrent: true,
        },
        {
          id: "2",
          name: "iPhone 16",
          deviceKind: "phone",
          browser: "Safari",
          os: "iOS 18",
          lastActiveAt: "2026-08-07T19:12:00Z",
          trustedAt: "2026-03-04",
        },
        {
          id: "3",
          name: "Office desktop",
          deviceKind: "desktop",
          browser: "Edge",
          os: "Windows 11",
          lastActiveAt: "2026-07-28T11:05:00Z",
          trustedAt: "2025-11-02",
        },
      ]);
      return (
        <TrustedDevices
          devices={devices}
          onRename={async (id, name) => {
            await new Promise((r) => setTimeout(r, 300));
            setDevices((rows) => rows.map((row) => (row.id === id ? { ...row, name } : row)));
          }}
          onRemove={async (id) => {
            await new Promise((r) => setTimeout(r, 400));
            setDevices((rows) => rows.filter((row) => row.id !== id));
          }}
          onRemoveAll={async () => {
            await new Promise((r) => setTimeout(r, 500));
            setDevices([]);
          }}
        />
      );
    },
    Mini: () => <TrustedDevices devices={[]} showRemoveAll={false} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <TrustedDevices
          variant="compact"
          devices={[
            {
              id: "c1",
              name: "This browser",
              deviceKind: "laptop",
              browser: "Safari",
              os: "macOS",
              lastActiveAt: "2026-08-08T10:00:00Z",
              trustedAt: "2026-06-01",
              isCurrent: true,
            },
          ]}
          showRemoveAll={false}
          onRename={async () => undefined}
          onRemove={async () => undefined}
        />
        <TrustedDevices devices={[]} />
      </div>
    ),
  },
  "login-history": {
    Preview: () => {
      const events: LoginHistoryEvent[] = [
        {
          id: "1",
          timestamp: "2026-08-08T08:30:00Z",
          outcome: "success",
          method: "passkey",
          deviceKind: "laptop",
          deviceName: "MacBook Pro",
          browser: "Chrome 128",
          os: "macOS 15",
          location: "San Francisco, US",
          ipAddress: "203.0.113.10",
        },
        {
          id: "2",
          timestamp: "2026-08-07T22:14:00Z",
          outcome: "failure",
          method: "password",
          deviceKind: "phone",
          deviceName: "iPhone 16",
          browser: "Safari",
          os: "iOS 18",
          location: "San Francisco, US",
          failureReason: "Incorrect password",
          ipAddress: "203.0.113.22",
        },
        {
          id: "3",
          timestamp: "2026-08-06T11:05:00Z",
          outcome: "success",
          method: "sso",
          deviceKind: "desktop",
          deviceName: "Office PC",
          browser: "Edge",
          os: "Windows 11",
          location: "Austin, US",
        },
        {
          id: "4",
          timestamp: "2026-08-05T09:40:00Z",
          outcome: "success",
          method: "magic-link",
          deviceKind: "tablet",
          deviceName: "iPad",
          browser: "Safari",
          os: "iPadOS 18",
          location: "Berlin, DE",
        },
        {
          id: "5",
          timestamp: "2026-08-04T16:20:00Z",
          outcome: "failure",
          method: "oauth",
          deviceKind: "laptop",
          deviceName: "Unknown laptop",
          browser: "Firefox",
          os: "Ubuntu 24.04",
          location: "Unknown",
          failureReason: "Provider denied consent",
        },
      ];
      return <LoginHistory events={events} showIp />;
    },
    Mini: () => <LoginHistory events={[]} showExport={false} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <LoginHistory
          variant="compact"
          showMethodFilter={false}
          events={[
            {
              id: "c1",
              timestamp: "2026-08-08T10:00:00Z",
              outcome: "success",
              method: "password",
              deviceKind: "laptop",
              deviceName: "This browser",
              browser: "Safari",
              os: "macOS",
              location: "Local",
            },
          ]}
          showExport={false}
        />
        <LoginHistory loading events={[]} />
        <LoginHistory events={[]} />
      </div>
    ),
  },
  timeline: {
    Preview: () => (
      <Timeline aria-label="Example timeline">
        <Timeline.Group label="Today">
          <Timeline.Item title="Password changed" timestamp="10:42 AM" description="Updated from Settings" />
          <Timeline.Item title="Passkey registered" timestamp="9:15 AM" description="MacBook Pro" />
        </Timeline.Group>
        <Timeline.Group label="Yesterday">
          <Timeline.Item title="Session revoked" timestamp="6:03 PM" description="Windows Desktop" />
        </Timeline.Group>
      </Timeline>
    ),
    Mini: () => <Timeline />,
  },
  "security-events": {
    Preview: () => {
      const events: SecurityEvent[] = [
        {
          id: "1",
          type: "password-change",
          timestamp: "2026-08-08T10:42:00Z",
          description: "Password updated from Settings → Security",
          actor: "ada@example.com",
          location: "San Francisco, US",
          ipAddress: "203.0.113.10",
        },
        {
          id: "2",
          type: "passkey-registration",
          timestamp: "2026-08-08T09:15:00Z",
          description: "Registered passkey on MacBook Pro",
          actor: "ada@example.com",
          target: "MacBook Pro",
          location: "San Francisco, US",
        },
        {
          id: "3",
          type: "login-failure",
          timestamp: "2026-08-07T22:14:00Z",
          description: "Incorrect password",
          actor: "unknown",
          location: "Berlin, DE",
          severity: "warning",
          ipAddress: "192.0.2.88",
        },
        {
          id: "4",
          type: "suspicious-activity",
          timestamp: "2026-08-07T18:40:00Z",
          description: "Sign-in from a new country within 2 hours",
          actor: "ada@example.com",
          location: "São Paulo, BR",
          severity: "critical",
        },
        {
          id: "5",
          type: "authenticator-setup",
          timestamp: "2026-08-06T11:05:00Z",
          description: "Authenticator app enrolled",
          actor: "ada@example.com",
        },
        {
          id: "6",
          type: "recovery-code-generation",
          timestamp: "2026-08-06T11:06:00Z",
          description: "Generated 8 recovery codes",
          actor: "ada@example.com",
        },
        {
          id: "7",
          type: "email-verification",
          timestamp: "2026-08-05T08:20:00Z",
          description: "Verified ada@example.com",
          actor: "ada@example.com",
          target: "ada@example.com",
        },
        {
          id: "8",
          type: "device-change",
          timestamp: "2026-08-04T16:00:00Z",
          description: "Trusted device renamed",
          actor: "ada@example.com",
          target: "iPhone 16",
        },
        {
          id: "9",
          type: "session-revocation",
          timestamp: "2026-08-04T16:05:00Z",
          description: "Revoked session on Windows Desktop",
          actor: "ada@example.com",
          target: "Windows Desktop",
        },
        {
          id: "10",
          type: "administrative-action",
          timestamp: "2026-08-03T12:30:00Z",
          description: "Admin forced password reset",
          actor: "admin@example.com",
          target: "ada@example.com",
          severity: "info",
        },
      ];
      return <SecurityEvents events={events} showIp defaultView="timeline" />;
    },
    Mini: () => <SecurityEvents events={[]} showExport={false} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <SecurityEvents
          variant="compact"
          defaultView="table"
          showTypeFilter={false}
          events={[
            {
              id: "t1",
              type: "session-revocation",
              timestamp: "2026-08-08T10:00:00Z",
              description: "Revoked other sessions",
              actor: "ada@example.com",
            },
          ]}
          showExport={false}
        />
        <SecurityEvents loading events={[]} />
        <SecurityEvents events={[]} />
      </div>
    ),
  },
  "radio-group": {
    Preview: () => {
      const [value, setValue] = useState("passkey");
      return (
        <RadioGroup
          label="Authentication method"
          value={value}
          onValueChange={setValue}
          items={[
            { value: "password", label: "Password", description: "Sign in with your password." },
            { value: "passkey", label: "Passkey", description: "Use Face ID, Touch ID, or a security key." },
            { value: "magic-link", label: "Magic link", description: "Get a one-time sign-in link by email." },
          ]}
        />
      );
    },
    Mini: () => (
      <RadioGroup
        label="Method"
        hideLabel
        size="sm"
        defaultValue="a"
        items={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
      />
    ),
  },
  "select-authentication-method": {
    Preview: () => (
      <SelectAuthenticationMethod
        recommendedMethod="passkey"
        onContinue={async (method) => {
          await new Promise((r) => setTimeout(r, 600));
          console.log(method);
        }}
        providers={[
          { id: "google", label: "Continue with Google", onContinue: () => undefined },
          { id: "microsoft", label: "Continue with Microsoft", onContinue: () => undefined },
        ]}
      />
    ),
    Mini: () => (
      <SelectAuthenticationMethod
        variant="compact"
        methods={["password", "passkey", "magic-link"]}
        showContinue
        onContinue={async () => undefined}
      />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <SelectAuthenticationMethod
          methods={["password", "passkey", "authenticator-app"]}
          recommendedMethod="passkey"
          onContinue={async () => undefined}
        />
        <SelectAuthenticationMethod
          variant="compact"
          methods={[
            { id: "email-code", recommended: true },
            { id: "sms-code" },
            { id: "recovery-code", disabled: true },
          ]}
          loading
          onContinue={async () => undefined}
        />
      </div>
    ),
  },
  "qr-code-card": {
    Preview: () => {
      const demoQr =
        "data:image/svg+xml," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width="192" height="192">
            <rect width="21" height="21" fill="#fff"/>
            <g fill="#1d1d1f">
              <rect x="1" y="1" width="7" height="7"/><rect x="2" y="2" width="5" height="5" fill="#fff"/><rect x="3" y="3" width="3" height="3"/>
              <rect x="13" y="1" width="7" height="7"/><rect x="14" y="2" width="5" height="5" fill="#fff"/><rect x="15" y="3" width="3" height="3"/>
              <rect x="1" y="13" width="7" height="7"/><rect x="2" y="14" width="5" height="5" fill="#fff"/><rect x="3" y="15" width="3" height="3"/>
              <rect x="10" y="1" width="1" height="1"/><rect x="12" y="2" width="1" height="1"/><rect x="10" y="3" width="1" height="1"/>
              <rect x="9" y="5" width="1" height="1"/><rect x="11" y="6" width="1" height="1"/><rect x="9" y="8" width="1" height="1"/>
              <rect x="11" y="9" width="1" height="1"/><rect x="13" y="10" width="1" height="1"/><rect x="15" y="11" width="1" height="1"/>
              <rect x="17" y="9" width="1" height="1"/><rect x="19" y="10" width="1" height="1"/><rect x="10" y="12" width="1" height="1"/>
              <rect x="12" y="13" width="1" height="1"/><rect x="14" y="14" width="1" height="1"/><rect x="16" y="15" width="1" height="1"/>
              <rect x="18" y="16" width="1" height="1"/><rect x="10" y="17" width="1" height="1"/><rect x="12" y="19" width="1" height="1"/>
              <rect x="14" y="18" width="1" height="1"/><rect x="16" y="19" width="1" height="1"/><rect x="18" y="18" width="1" height="1"/>
            </g>
          </svg>`
        );
      const [secret, setSecret] = useState("JBSWY3DPEHPK3PXP");
      const [qrSrc, setQrSrc] = useState(demoQr);
      return (
        <QrCodeCard
          issuer="Roboticela"
          accountName="ada@example.com"
          qrSrc={qrSrc}
          secretKey={secret}
          expiresInSeconds={120}
          onRefresh={async () => {
            await new Promise((r) => setTimeout(r, 700));
            setSecret("HXDMVJECJJWSRB3H");
            setQrSrc(demoQr);
          }}
        />
      );
    },
    Mini: () => (
      <QrCodeCard
        variant="compact"
        secretKey="ABCD EFGH"
        status="loading"
        showCountdown={false}
      />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <QrCodeCard variant="split" secretKey="JBSWY3DPEHPK3PXP" status="idle" showCountdown={false} />
        <QrCodeCard secretKey="EXPIREDKEY" status="expired" onRefresh={async () => undefined} />
        <QrCodeCard secretKey="" status="error" onRefresh={async () => undefined} />
      </div>
    ),
  },
  "authenticator-app-setup": {
    Preview: () => {
      const demoQr =
        "data:image/svg+xml," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width="192" height="192"><rect width="21" height="21" fill="#fff"/><g fill="#1d1d1f"><rect x="1" y="1" width="7" height="7"/><rect x="2" y="2" width="5" height="5" fill="#fff"/><rect x="3" y="3" width="3" height="3"/><rect x="13" y="1" width="7" height="7"/><rect x="14" y="2" width="5" height="5" fill="#fff"/><rect x="15" y="3" width="3" height="3"/><rect x="1" y="13" width="7" height="7"/><rect x="2" y="14" width="5" height="5" fill="#fff"/><rect x="3" y="15" width="3" height="3"/><rect x="10" y="10" width="1" height="1"/><rect x="12" y="12" width="1" height="1"/><rect x="14" y="14" width="1" height="1"/><rect x="16" y="16" width="1" height="1"/></g></svg>`
        );
      return (
        <AuthenticatorAppSetup
          issuer="Roboticela"
          accountName="ada@example.com"
          qrSrc={demoQr}
          secretKey="JBSWY3DPEHPK3PXP"
          expiresInSeconds={180}
          onQrRefresh={async () => {
            await new Promise((r) => setTimeout(r, 500));
          }}
          onVerify={async (code) => {
            await new Promise((r) => setTimeout(r, 800));
            if (code !== "123456") {
              throw { reason: "invalid" };
            }
          }}
          onContinue={() => undefined}
          showCancel
          onCancel={() => undefined}
        />
      );
    },
    Mini: () => (
      <AuthenticatorAppSetup
        variant="compact"
        status="verifying"
        secretKey="ABCD"
      />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <AuthenticatorAppSetup status="success" onContinue={() => undefined} />
        <AuthenticatorAppSetup status="failed" failureReason="invalid" onRetry={() => undefined} />
        <AuthenticatorAppSetup
          variant="split"
          secretKey="JBSWY3DPEHPK3PXP"
          showInstructions
          onVerify={async () => undefined}
        />
      </div>
    ),
  },
  "backup-codes": {
    Preview: () => {
      const [codes, setCodes] = useState([
        "A1B2C3D4",
        "E5F6G7H8",
        "I9J0K1L2",
        "M3N4O5P6",
        "Q7R8S9T0",
        { id: "used-1", code: "U1V2W3X4", used: true },
        "Y5Z6A7B8",
        "C9D0E1F2",
      ]);
      return (
        <BackupCodes
          codes={codes}
          concealUntilReveal
          requireAcknowledgement
          onRegenerate={async () => {
            await new Promise((r) => setTimeout(r, 700));
            setCodes(["N1EW2COD", "E3SR4ET5", "B6ACK7UP", "C8ODE9S0", "R1EC2OVE", "R3Y4CODE", "S5EC6URE", "T7OT8P9X"]);
          }}
        />
      );
    },
    Mini: () => (
      <BackupCodes
        variant="compact"
        codes={["ABCD1234", "EFGH5678"]}
        showWarning={false}
        showRegenerate={false}
      />
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <BackupCodes codes={[]} onRegenerate={async () => undefined} />
        <BackupCodes
          variant="grid"
          codes={[
            { code: "AAAA1111", used: true },
            { code: "BBBB2222", used: false },
          ]}
          showPrint={false}
          showDownload={false}
        />
      </div>
    ),
  },
  "recovery-code-login": {
    Preview: () => (
      <RecoveryCodeLogin
        onAuthenticate={async (code) => {
          await new Promise((r) => setTimeout(r, 700));
          if (normalizeRecoveryCode(code) !== "A1B2C3D4") {
            throw { reason: "invalid" };
          }
        }}
        onSuccess={() => undefined}
        onTryAlternative={() => undefined}
        showCancel
        onCancel={() => undefined}
      />
    ),
    Mini: () => <RecoveryCodeLogin variant="compact" status="loading" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <RecoveryCodeLogin status="error" errorReason="invalid" onRetry={() => undefined} onTryAlternative={() => undefined} />
        <RecoveryCodeLogin status="error" errorReason="locked" onRetry={() => undefined} />
        <RecoveryCodeLogin variant="compact" showGuidance={false} defaultCode="ABCD-EFGH" onAuthenticate={async () => undefined} />
      </div>
    ),
  },
  "two-factor-authentication": {
    Preview: () => (
      <TwoFactorAuthentication
        mode="challenge"
        methods={["authenticator-app", "email-code", "sms-code", "recovery-code"]}
        recommendedMethod="authenticator-app"
        codeExpiresInSeconds={90}
        onStartChallenge={async () => {
          await new Promise((r) => setTimeout(r, 400));
        }}
        onVerifyCode={async ({ code }) => {
          await new Promise((r) => setTimeout(r, 600));
          if (code !== "123456") throw { reason: "invalid" };
        }}
        onAuthenticateRecoveryCode={async (code) => {
          await new Promise((r) => setTimeout(r, 500));
          if (normalizeRecoveryCode(code) !== "A1B2C3D4") throw { reason: "invalid" };
        }}
        onResendCode={async () => {
          await new Promise((r) => setTimeout(r, 400));
        }}
        onContinue={() => undefined}
      />
    ),
    Mini: () => <TwoFactorAuthentication mode="challenge" step="loading" />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <TwoFactorAuthentication mode="challenge" step="success" onContinue={() => undefined} />
        <TwoFactorAuthentication mode="challenge" step="error" errorReason="expired" />
        <TwoFactorAuthentication
          mode="enroll"
          issuer="Roboticela"
          accountName="ada@example.com"
          secretKey="JBSWY3DPEHPK3PXP"
          backupCodes={["A1B2C3D4", "E5F6G7H8", "I9J0K1L2", "M3N4O5P6"]}
          onEnrollVerify={async () => undefined}
          onBackupCodesRegenerate={async () => undefined}
        />
      </div>
    ),
  },
  form: {
    Preview: () => (
      <Form
        title="Example form"
        description="Compose fields inside Form.Fields"
        onSubmit={(event) => event.preventDefault()}
      >
        <Form.Fields>
          <TextInput label="Email" type="email" defaultValue="ada@example.com" />
        </Form.Fields>
        <Form.Actions>
          <Button
            type="submit"
            leadingIcon={
              <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
                <path
                  d="M4.5 10h11M11.5 6.5 15 10l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          >
            Submit
          </Button>
        </Form.Actions>
      </Form>
    ),
    Mini: () => (
      <Form aria-label="Compact form" onSubmit={(event) => event.preventDefault()}>
        <Form.Fields>
          <TextInput label="Name" hideLabel placeholder="Name" size="sm" />
        </Form.Fields>
      </Form>
    ),
  },
  "login-form": {
    Preview: () => (
      <LoginForm
        identifierMode="email"
        forgotPasswordHref="#forgot"
        providers={[
          {
            id: "google",
            label: "Continue with Google",
            onContinue: () => undefined,
          },
          {
            id: "microsoft",
            label: "Continue with Microsoft",
            onContinue: () => undefined,
          },
        ]}
        onSubmit={async ({ identifier, password }) => {
          await new Promise((r) => setTimeout(r, 700));
          if (identifier !== "ada@example.com" || password !== "password") {
            throw { reason: "invalid" };
          }
        }}
        onContinue={() => undefined}
        showGuidance
      />
    ),
    Mini: () => <LoginForm variant="compact" status="loading" showProviders={false} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <LoginForm
          variant="compact"
          identifierMode="username"
          showProviders={false}
          defaultIdentifier="ada"
          onSubmit={async () => undefined}
        />
        <LoginForm status="error" errorReason="locked" />
        <LoginForm status="success" onContinue={() => undefined} />
        <LoginForm
          identifierMode="email-or-username"
          showRememberMe={false}
          showGuidance={false}
          providers={[
            { id: "github", label: "Continue with GitHub", onContinue: () => undefined },
          ]}
          onSubmit={async () => {
            throw { reason: "network" };
          }}
        />
      </div>
    ),
  },
  "registration-form": {
    Preview: () => (
      <RegistrationForm
        termsHref="#terms"
        privacyHref="#privacy"
        signInHref="#login"
        providers={[
          {
            id: "google",
            label: "Continue with Google",
            onContinue: () => undefined,
          },
          {
            id: "microsoft",
            label: "Continue with Microsoft",
            onContinue: () => undefined,
          },
        ]}
        onSubmit={async ({ email, password, acceptTerms }) => {
          await new Promise((r) => setTimeout(r, 700));
          if (!acceptTerms) throw { reason: "invalid" };
          if (email === "taken@example.com") throw { reason: "invalid" };
          if (password.length < 8) throw { reason: "invalid" };
        }}
        onContinue={() => undefined}
        showGuidance
      />
    ),
    Mini: () => <RegistrationForm variant="compact" status="loading" showProviders={false} />,
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <RegistrationForm
          variant="compact"
          showProviders={false}
          showMarketingConsent={false}
          defaultFullName="Ada Lovelace"
          defaultEmail="ada@example.com"
          onSubmit={async () => undefined}
        />
        <RegistrationForm status="error" errorReason="network" />
        <RegistrationForm status="success" onContinue={() => undefined} />
        <RegistrationForm
          showGuidance={false}
          showStrength
          showChecklist
          providers={[
            { id: "github", label: "Continue with GitHub", onContinue: () => undefined },
          ]}
          onSubmit={async () => {
            throw { reason: "locked" };
          }}
        />
      </div>
    ),
  },
  "date-input": {
    Preview: () => <DateInput label="Date" />,
  },
  "time-input": {
    Preview: () => <TimeInput label="Time" />,
  },
  "date-time-input": {
    Preview: () => <DateTimeInput label="Date and time" />,
  },
  "input-group": {
    Preview: () => (
      <InputGroup label="Price">
        <InputGroup.Addon position="start">$</InputGroup.Addon>
        <InputGroup.Input>
          <TextInput label="Amount" hideLabel placeholder="0.00" />
        </InputGroup.Input>
      </InputGroup>
    ),
  },
  checkbox: {
    Preview: () => <Checkbox label="Subscribe to updates" defaultChecked />,
  },
  "checkbox-group": {
    Preview: () => (
      <CheckboxGroup
        label="Permissions"
        description="Select what this role can do"
        defaultValue={["read"]}
        items={[
          { value: "read", label: "Read" },
          { value: "write", label: "Write" },
          { value: "admin", label: "Admin" },
        ]}
      />
    ),
  },
  toast: {
    Preview: () => <Toast message="Saved successfully" variant="success" dismissible={false} />,
    Mini: () => <Toast message="Saved" variant="success" dismissible={false} />,
  },
  spinner: {
    Preview: () => <Spinner label="Loading" labelMode="visible" />,
    Mini: () => <Spinner label="Loading" />,
  },
  tooltip: {
    Preview: () => (
      <Tooltip content="Supplementary hint">
        <Button variant="secondary">Hover me</Button>
      </Tooltip>
    ),
  },
  "dropdown-menu": {
    Preview: () => (
      <DropdownMenu
        label="Account menu"
        items={[
          { id: "profile", label: "Profile" },
          { id: "settings", label: "Settings" },
          { type: "separator" },
          { id: "logout", label: "Log out", destructive: true },
        ]}
      >
        <Button variant="secondary">Open menu</Button>
      </DropdownMenu>
    ),
  },
  text: {
    Preview: () => <Text size="md">The quick brown fox jumps over the lazy dog.</Text>,
  },
  heading: {
    Preview: () => (
      <Heading level={2} size="lg">
        Section heading
      </Heading>
    ),
  },
  paragraph: {
    Preview: () => (
      <Paragraph>
        Paragraphs set readable measure and spacing for longer body copy in product UI.
      </Paragraph>
    ),
  },
  label: {
    Preview: () => <Label htmlFor="demo-field">Field label</Label>,
  },
  caption: {
    Preview: () => <Caption>Supporting caption text</Caption>,
  },
  link: {
    Preview: () => (
      <Link href="#preview" variant="standalone">
        Documentation
      </Link>
    ),
  },
  "action-button-group": {
    Preview: () => (
      <ActionButtonGroup label="Form actions">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </ActionButtonGroup>
    ),
  },
  "icon-button-group": {
    Preview: () => (
      <IconButtonGroup label="Formatting">
        <IconButton label="Bold" icon={<StarIcon />} />
        <IconButton label="Italic" icon={<StarIcon />} />
        <IconButton label="Underline" icon={<StarIcon />} />
      </IconButtonGroup>
    ),
  },
  "action-split-button": {
    Preview: () => (
      <ActionSplitButton
        menu={
          <DropdownMenu
            label="More export options"
            items={[
              { id: "pdf", label: "Export PDF" },
              { id: "csv", label: "Export CSV" },
            ]}
          >
            <ActionSplitMenuTrigger label="More export options" />
          </DropdownMenu>
        }
      >
        Export
      </ActionSplitButton>
    ),
  },
  "action-segmented-control": {
    Preview: () => (
      <ActionSegmentedControl
        label="View"
        defaultValue="list"
        options={[
          { id: "list", label: "List" },
          { id: "grid", label: "Grid" },
          { id: "board", label: "Board" },
        ]}
      />
    ),
  },
  "action-group": {
    Preview: () => (
      <ActionGroup label="Editor actions">
        <ActionGroup.Primary>
          <Button>Publish</Button>
        </ActionGroup.Primary>
        <ActionGroup.Item>
          <Button variant="secondary">Preview</Button>
        </ActionGroup.Item>
        <ActionGroup.Item rank="icon">
          <IconButton label="More" icon={<MoreIcon />} />
        </ActionGroup.Item>
      </ActionGroup>
    ),
  },
  tabs: {
    Preview: () => (
      <Tabs
        label="Example tabs"
        defaultValue="one"
        items={[
          { id: "one", label: "Overview", panel: <Paragraph>Overview panel</Paragraph> },
          { id: "two", label: "Details", panel: <Paragraph>Details panel</Paragraph> },
          { id: "three", label: "Activity", panel: <Paragraph>Activity panel</Paragraph> },
        ]}
      />
    ),
  },
  "tab-bar": {
    Preview: () => (
      <TabBar
        label="App sections"
        defaultValue="home"
        items={[
          { id: "home", label: "Home" },
          { id: "search", label: "Search" },
          { id: "profile", label: "Profile" },
        ]}
      />
    ),
  },
  card: {
    Preview: CardPreview,
    Mini: CardPreview,
    Variants: CardVariants,
  },
  "search-field": {
    Preview: () => (
      <SearchField label="Search" placeholder="Search packages…" clearable />
    ),
    Mini: () => <SearchField label="Search" hideLabel placeholder="Search…" />,
  },
  alert: {
    Preview: () => (
      <Alert variant="informational" title="Heads up">
        Your changes are saved as a draft until you publish.
      </Alert>
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        {(["informational", "success", "warning", "error"] as const).map((v) => (
          <Alert key={v} variant={v} title={v}>
            Example {v} message.
          </Alert>
        ))}
      </div>
    ),
  },
  badge: {
    Preview: () => (
      <Badge appearance="numeric" count={3} accessibleLabel="3 unread" tone="accent">
        <IconButton label="Notifications" icon={<StarIcon />} />
      </Badge>
    ),
    Mini: () => <Badge appearance="text" label="New" tone="accent" />,
    Variants: () => (
      <div className="pg-variant-grid">
        <Badge appearance="text" label="Beta" tone="neutral" />
        <Badge appearance="numeric" count={12} accessibleLabel="12 items" tone="accent" />
        <Badge appearance="dot" accessibleLabel="Online" tone="positive" />
        <Badge appearance="text" label="Error" tone="negative" />
      </div>
    ),
  },
  "progress-bar": {
    Preview: () => (
      <ProgressBar label="Upload" value={64} showValue description="Uploading assets…" />
    ),
    Mini: () => <ProgressBar label="Progress" hideLabel value={40} />,
  },
  skeleton: {
    Preview: () => (
      <SkeletonGroup label="Loading content">
        <Skeleton shape="avatar" />
        <Skeleton shape="title" width="60%" />
        <Skeleton shape="text" lines={3} />
      </SkeletonGroup>
    ),
    Mini: () => <Skeleton shape="text" lines={2} width="100%" />,
  },
  "alert-dialog": {
    Preview: () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="destructive" onClick={() => setOpen(true)}>
            Delete project
          </Button>
          <AlertDialog
            open={open}
            onOpenChange={setOpen}
            tone="destructive"
            title="Delete this project?"
            description="This permanently removes the project and its data. This cannot be undone."
            cancelAction={
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            }
            action={
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Delete
              </Button>
            }
          />
        </>
      );
    },
  },
  list: {
    Preview: () => (
      <List aria-label="Team members" dividers="between">
        <List.Item itemKey="a">
          <List.ItemLabel>Alex Rivera</List.ItemLabel>
          <List.ItemDescription>Product design</List.ItemDescription>
        </List.Item>
        <List.Item itemKey="b">
          <List.ItemLabel>Jordan Lee</List.ItemLabel>
          <List.ItemDescription>Engineering</List.ItemDescription>
        </List.Item>
        <List.Item itemKey="c">
          <List.ItemLabel>Sam Patel</List.ItemLabel>
          <List.ItemDescription>Research</List.ItemDescription>
        </List.Item>
      </List>
    ),
  },
  "list-item": {
    Preview: () => (
      <ListItem interactive density="comfortable" lines="two">
        <ListItem.Leading>
          <Skeleton shape="avatar" size="sm" animated={false} />
        </ListItem.Leading>
        <ListItem.Primary>
          <ListItem.Title as="h3">Inbox overview</ListItem.Title>
          <ListItem.Description>3 unread conversations need a reply.</ListItem.Description>
        </ListItem.Primary>
        <ListItem.Trailing>
          <Badge appearance="numeric" count={3} accessibleLabel="3 unread" tone="accent" />
        </ListItem.Trailing>
      </ListItem>
    ),
  },
  brand: {
    Preview: () => <Brand label="DevKit" name="DevKit" descriptor="Design system" layout="lockup" />,
    Mini: () => <Brand label="DevKit" layout="lockup" size="sm" />,
  },
  avatar: {
    Preview: () => <Avatar label="Alex Rivera" initials="AR" size={40} status="online" />,
    Mini: () => <Avatar label="Alex" initials="AR" size={32} />,
  },
  "avatar-group": {
    Preview: () => (
      <AvatarGroup label="Team" max={3} size={32}>
        <Avatar label="Alex" initials="AR" size={32} />
        <Avatar label="Jordan" initials="JL" size={32} />
        <Avatar label="Sam" initials="SP" size={32} />
        <Avatar label="Riley" initials="RK" size={32} />
      </AvatarGroup>
    ),
  },
  tag: {
    Preview: () => (
      <Tag.Group label="Filters">
        <Tag tone="accent" selected icon={<StarIcon />}>
          Components
        </Tag>
        <Tag removable onRemove={() => undefined}>
          Pages
        </Tag>
        <Tag tone="neutral" count={12}>
          Scaffolds
        </Tag>
      </Tag.Group>
    ),
  },
  divider: {
    Preview: () => <Divider variant="section" label="Or continue" />,
    Mini: () => <Divider />,
  },
  surface: {
    Preview: () => (
      <Surface variant="elevated" padding="md" bordered>
        <Paragraph>Surface content region</Paragraph>
      </Surface>
    ),
  },
  "nav-item": {
    Preview: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <NavItem label="Catalog" icon={<StarIcon />} current />
        <NavItem label="Docs" icon={<StarIcon />} />
        <NavItem label="Settings" icon={<StarIcon />} disabled />
      </div>
    ),
  },
  breadcrumb: {
    Preview: () => (
      <Breadcrumb
        items={[
          { id: "home", label: "Home", href: "#" },
          { id: "lib", label: "Library", href: "#" },
          { id: "comp", label: "Components", current: true },
        ]}
      />
    ),
  },
  "navigation-drawer": {
    Preview: () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open menu
          </Button>
          <NavigationDrawer
            open={open}
            onOpenChange={setOpen}
            label="Mobile navigation"
            header={<Brand label="DevKit" layout="lockup" size="sm" />}
            closeControl={
              <IconButton label="Close" icon={<MoreIcon />} onClick={() => setOpen(false)} />
            }
          >
            <NavItem label="Catalog" current onClick={() => setOpen(false)} />
            <NavItem label="Docs" onClick={() => setOpen(false)} />
          </NavigationDrawer>
        </>
      );
    },
  },
  navbar: {
    Preview: () => (
      <Navbar
        brand={<Brand label="DevKit" layout="lockup" size="sm" />}
        primary={
          <>
            <NavItem label="Catalog" current />
            <NavItem label="Docs" />
          </>
        }
        actions={<Button size="sm" variant="secondary">Accent</Button>}
        account={<Avatar label="You" initials="YO" size={32} />}
      />
    ),
    Mini: () => (
      <Navbar
        layout="minimal"
        density="compact"
        brand={<Brand label="DevKit" layout="wordmark" size="sm" />}
      />
    ),
  },
  "nav-actions": {
    Preview: () => (
      <NavActions label="Utility navigation" density="standard">
        <NavActions.Item>
          <ThemeToggle appearance="system" themes={DEFAULT_THEMES} size="sm" />
        </NavActions.Item>
        <NavActions.Item>
          <NavItem label="GitHub" href="https://github.com/Roboticela/DevKit" external size="md" />
        </NavActions.Item>
      </NavActions>
    ),
    Mini: () => (
      <NavActions label="Utilities" density="compact">
        <NavActions.Item>
          <NavItem label="Docs" size="sm" />
        </NavActions.Item>
        <NavActions.Item>
          <NavItem label="GitHub" size="sm" />
        </NavActions.Item>
      </NavActions>
    ),
  },
  "theme-toggle": {
    Preview: () => {
      const [appearance, setAppearance] = useState<"system" | "light" | "dark">("system");
      const [theme, setTheme] = useState("default");
      return (
        <ThemeToggle
          appearance={appearance}
          onAppearanceChange={setAppearance}
          theme={theme}
          onThemeChange={setTheme}
          themes={DEFAULT_THEMES}
          primaryColor="var(--color-accent-primary, #0071e3)"
          colorPalette={
            <ColorPalette
              label="Accent color"
              variant="grid"
              size="sm"
              colors={[
                { id: "blue", label: "Blue", color: "#0071e3" },
                { id: "green", label: "Green", color: "#30d158" },
                { id: "orange", label: "Orange", color: "#ff9500" },
                { id: "rose", label: "Rose", color: "#ff2d55" },
                { id: "violet", label: "Violet", color: "#af52de" },
                { id: "teal", label: "Teal", color: "#40c8e0" },
              ]}
              defaultValue="blue"
            />
          }
        />
      );
    },
  },
  "color-palette": {
    Preview: () => (
      <ColorPalette
        variant="popover"
        triggerLabel="Colors"
        colors={[
          { id: "blue", label: "Blue", color: "#0071e3" },
          { id: "green", label: "Green", color: "#30d158" },
          { id: "orange", label: "Orange", color: "#ff9500" },
          { id: "rose", label: "Rose", color: "#ff2d55" },
          { id: "violet", label: "Violet", color: "#af52de" },
          { id: "teal", label: "Teal", color: "#40c8e0" },
        ]}
        defaultValue="blue"
      />
    ),
    Mini: () => (
      <ColorPalette
        colors={[
          { id: "blue", label: "Blue", color: "#0071e3" },
          { id: "green", label: "Green", color: "#30d158" },
          { id: "orange", label: "Orange", color: "#ff9500" },
        ]}
        defaultValue="blue"
        size="sm"
      />
    ),
  },
};

export function getPreview(name: string): PreviewEntry | undefined {
  return PREVIEWS[name];
}

export function PreviewFallback({ children }: { children?: ReactNode }) {
  return <Caption>{children ?? "No preview available for this package yet."}</Caption>;
}
