import * as React from "react";
import {
  Card,
  type CardVariant,
} from "../../../../../../../card/vite-express-tauri/v1/files/src/components/ui/Card";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import {
  RadioGroup,
  type RadioGroupOrientation,
  type RadioGroupSize,
} from "../../../../../../../radio-group/vite-express-tauri/v1/files/src/components/ui/RadioGroup";
import { Divider } from "../../../../../../../divider/vite-express-tauri/v1/files/src/components/ui/Divider";
import { Icon, type IconSize } from "../../../../../../../icon/vite-express-tauri/v1/files/src/components/ui/Icon";
import { Badge } from "../../../../../../../badge/vite-express-tauri/v1/files/src/components/ui/Badge";
import {
  ContinueWithProvider,
  type ContinueWithProviderProps,
} from "../../../../../../../continue-with-provider/vite-express-tauri/v1/files/src/components/ui/ContinueWithProvider";

/**
 * Select Authentication Method — choose how to authenticate.
 * Composes Card, Button, Radio Group, Divider, and Icon.
 * Do not invent custom selection controls.
 */

export type AuthenticationMethodId =
  | "password"
  | "passkey"
  | "authenticator-app"
  | "email-code"
  | "sms-code"
  | "recovery-code"
  | "magic-link";

export type AuthenticationMethodOption = {
  id: AuthenticationMethodId | (string & {});
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** Show a recommended Badge. */
  recommended?: boolean;
  disabled?: boolean;
  /** When false, method is omitted. Default: true. */
  available?: boolean;
};

/** Federated / social provider entry rendered below the Divider. */
export type AuthenticationProviderOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onContinue?: ContinueWithProviderProps["onContinue"];
  state?: ContinueWithProviderProps["state"];
  disabled?: boolean;
};

export type SelectAuthenticationMethodVariant = "stacked" | "compact";

export type SelectAuthenticationMethodProps = {
  variant?: SelectAuthenticationMethodVariant;
  cardVariant?: CardVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /**
   * Enabled methods. Pass ids for defaults, or full option objects to override.
   * Default: all built-in methods.
   */
  methods?: Array<AuthenticationMethodId | AuthenticationMethodOption>;
  /** Method id marked recommended when not set per-option. */
  recommendedMethod?: AuthenticationMethodId | string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (methodId: string) => void;
  /**
   * Continue with the selected method.
   * Resolve/reject drives Button loading when uncontrolled.
   */
  onContinue?: (methodId: string) => void | Promise<void>;
  continueLabel?: string;
  continueLoadingLabel?: string;
  showContinue?: boolean;
  loading?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  radioSize?: RadioGroupSize;
  orientation?: RadioGroupOrientation;
  continueButtonSize?: ButtonSize;
  continueButtonVariant?: ButtonVariant;
  iconSize?: IconSize;
  /** Federated providers under a Divider. */
  providers?: AuthenticationProviderOption[];
  providersDividerLabel?: React.ReactNode | false;
  showProvidersDivider?: boolean;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  methodSlot?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function PasswordGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.5" y="8.5" width="13" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 8.5V6.5a3.5 3.5 0 0 1 7 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PasskeyGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 10h5.5M14.5 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AuthenticatorGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="6" y="2.5" width="8" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 12.5h3M10 6.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmailCodeGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="4.5" width="14.5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6.5 6.5 4.5 6.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SmsCodeGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 16.5h6M10 13.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 7.5h7M6.5 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RecoveryCodeGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.5 6.5h11M4.5 10h11M4.5 13.5h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="3.25" y="3.5" width="13.5" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MagicLinkGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M7.5 12.5 4.75 15.25a2.12 2.12 0 0 0 3 3L10.5 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="m12.5 7.5 2.75-2.75a2.12 2.12 0 0 0-3-3L9.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="m8 12 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ContinueGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M4.5 10h11M11.5 6.5 15 10l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="m8 2.5 1.45 2.95 3.25.47-2.35 2.29.56 3.23L8 10.1l-2.91 1.53.56-3.23-2.35-2.29 3.25-.47L8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type MethodDefaults = {
  label: string;
  description: string;
  glyph: React.ReactNode;
};

const METHOD_DEFAULTS: Record<AuthenticationMethodId, MethodDefaults> = {
  password: {
    label: "Password",
    description: "Sign in with the password for this account.",
    glyph: <PasswordGlyph />,
  },
  passkey: {
    label: "Passkey",
    description: "Use Face ID, Touch ID, Windows Hello, or a security key.",
    glyph: <PasskeyGlyph />,
  },
  "authenticator-app": {
    label: "Authenticator app",
    description: "Enter a one-time code from your authenticator app.",
    glyph: <AuthenticatorGlyph />,
  },
  "email-code": {
    label: "Email verification code",
    description: "Receive a one-time code by email.",
    glyph: <EmailCodeGlyph />,
  },
  "sms-code": {
    label: "SMS verification code",
    description: "Receive a one-time code by text message.",
    glyph: <SmsCodeGlyph />,
  },
  "recovery-code": {
    label: "Recovery code",
    description: "Use a backup recovery code if other methods aren’t available.",
    glyph: <RecoveryCodeGlyph />,
  },
  "magic-link": {
    label: "Magic link",
    description: "Get a one-time sign-in link sent to your email.",
    glyph: <MagicLinkGlyph />,
  },
};

const DEFAULT_METHOD_IDS: AuthenticationMethodId[] = [
  "password",
  "passkey",
  "authenticator-app",
  "email-code",
  "sms-code",
  "recovery-code",
  "magic-link",
];

function normalizeMethods(
  methods: Array<AuthenticationMethodId | AuthenticationMethodOption> | undefined,
  recommendedMethod: string | undefined,
  iconSize: IconSize
): AuthenticationMethodOption[] {
  const source = methods?.length ? methods : DEFAULT_METHOD_IDS;
  return source
    .map((entry): AuthenticationMethodOption | null => {
      const option: AuthenticationMethodOption =
        typeof entry === "string" ? { id: entry } : entry;
      if (option.available === false) return null;
      const defaults =
        option.id in METHOD_DEFAULTS
          ? METHOD_DEFAULTS[option.id as AuthenticationMethodId]
          : undefined;
      const recommended =
        option.recommended ?? (recommendedMethod != null && option.id === recommendedMethod);
      return {
        ...option,
        label: option.label ?? defaults?.label ?? option.id,
        description: option.description ?? defaults?.description,
        recommended,
        icon:
          option.icon ??
          (defaults ? (
            <Icon size={iconSize}>{defaults.glyph}</Icon>
          ) : (
            <Icon size={iconSize}>
              <PasswordGlyph />
            </Icon>
          )),
      };
    })
    .filter((item): item is AuthenticationMethodOption => item != null);
}

export const SelectAuthenticationMethod = React.forwardRef<
  HTMLDivElement,
  SelectAuthenticationMethodProps
>(function SelectAuthenticationMethod(
  {
    variant = "stacked",
    cardVariant = "outlined",
    title = "Choose how to sign in",
    description = "Select an authentication method to continue.",
    methods,
    recommendedMethod = "passkey",
    value: valueProp,
    defaultValue,
    onValueChange,
    onContinue,
    continueLabel = "Continue",
    continueLoadingLabel = "Continuing",
    showContinue = true,
    loading: loadingProp,
    disabled = false,
    errorMessage,
    radioSize = "md",
    orientation = "vertical",
    continueButtonSize = "md",
    continueButtonVariant = "primary",
    iconSize = "md",
    providers,
    providersDividerLabel = "Or continue with",
    showProvidersDivider = true,
    headerSlot,
    footerSlot,
    actionSlot,
    methodSlot,
    className = "",
    id,
  },
  ref
) {
  const reactId = React.useId();
  const rootId = id ?? `dk-select-auth-method-${reactId}`;

  const resolvedMethods = React.useMemo(
    () => normalizeMethods(methods, recommendedMethod, iconSize),
    [iconSize, methods, recommendedMethod]
  );

  const firstEnabled = resolvedMethods.find((item) => !item.disabled)?.id ?? "";
  const controlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? recommendedMethod ?? firstEnabled
  );
  const value = controlled ? valueProp! : uncontrolled;

  const [internalLoading, setInternalLoading] = React.useState(false);
  const loading = loadingProp ?? internalLoading;

  const setValue = React.useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange]
  );

  React.useEffect(() => {
    if (controlled) return;
    if (value && resolvedMethods.some((item) => item.id === value && !item.disabled)) return;
    if (firstEnabled) setUncontrolled(firstEnabled);
  }, [controlled, firstEnabled, resolvedMethods, value]);

  const handleContinue = async () => {
    if (!onContinue || !value || disabled || loading) return;
    setInternalLoading(true);
    try {
      await onContinue(value);
    } finally {
      setInternalLoading(false);
    }
  };

  const radioItems = resolvedMethods.map((method) => ({
    value: String(method.id),
    label: method.label,
    description: method.description,
    disabled: method.disabled,
    icon: method.icon,
    trailing: method.recommended ? (
      <Badge
        appearance="icon-label"
        tone="accent"
        size="sm"
        label="Recommended"
        icon={<StarGlyph />}
        accessibleLabel="Recommended method"
      />
    ) : undefined,
  }));

  const continueAction =
    actionSlot ??
    (showContinue ? (
      <Button
        size={continueButtonSize}
        variant={continueButtonVariant}
        leadingIcon={<ContinueGlyph />}
        fullWidth
        disabled={disabled || !value}
        loading={loading}
        loadingLabel={continueLoadingLabel}
        onClick={() => void handleContinue()}
      >
        {continueLabel}
      </Button>
    ) : null);

  const providerBlock =
    footerSlot ??
    (providers && providers.length > 0 ? (
      <div className="dk-select-auth-method__providers">
        {showProvidersDivider ? (
          <Divider
            variant="section"
            label={providersDividerLabel === false ? undefined : providersDividerLabel}
          />
        ) : null}
        <ContinueWithProvider.Group
          showDivider={false}
          orientation="stacked"
          dividerLabel={false}
        >
          {providers.map((provider) => (
            <ContinueWithProvider
              key={provider.id}
              provider={provider.id}
              label={provider.label}
              icon={provider.icon}
              state={provider.disabled ? "disabled" : provider.state}
              fullWidth
              onContinue={provider.onContinue}
            />
          ))}
        </ContinueWithProvider.Group>
      </div>
    ) : null);

  return (
    <div
      ref={ref}
      id={rootId}
      className={cx(
        "dk-select-auth-method",
        `dk-select-auth-method--${variant}`,
        className
      )}
      data-variant={variant}
      data-loading={loading || undefined}
    >
      <Card variant={cardVariant} className="dk-select-auth-method__card">
        {headerSlot ?? (
          <Card.Header className="dk-select-auth-method__header">
            <Card.Title>{title}</Card.Title>
            {description ? <Card.Description>{description}</Card.Description> : null}
          </Card.Header>
        )}

        <Card.Body className="dk-select-auth-method__body">
          {methodSlot ?? (
            <RadioGroup
              label="Authentication method"
              hideLabel
              size={radioSize}
              orientation={orientation}
              value={value}
              onValueChange={setValue}
              disabled={disabled || loading}
              errorMessage={errorMessage}
              items={radioItems}
              className="dk-select-auth-method__methods"
            />
          )}

          {continueAction ? (
            <div className="dk-select-auth-method__actions">{continueAction}</div>
          ) : null}

          {providerBlock}
        </Card.Body>
      </Card>
    </div>
  );
});

SelectAuthenticationMethod.displayName = "SelectAuthenticationMethod";
export default SelectAuthenticationMethod;
