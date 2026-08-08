import * as React from "react";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import { Icon, type IconSize } from "../../../../../../../icon/nextjs-compact/v1/files/components/ui/Icon";
import { Divider } from "../../../../../../../divider/nextjs-compact/v1/files/components/ui/Divider";
import { Tooltip } from "../../../../../../../tooltip/nextjs-compact/v1/files/components/ui/Tooltip";

/**
 * Continue With Provider — foundation for third-party auth buttons.
 * Composes Button + Icon + Tooltip (+ Divider via Group).
 * Provider-specific packages must extend this — do not fork layout.
 */

export type ContinueWithProviderState =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "disabled";

export type ContinueWithProviderProps = {
  /** Stable provider id (e.g. `google`, `github`). */
  provider: string;
  /** Visible button label. */
  label: string;
  /** Provider mark — wrapped in Icon unless `iconSlot` replaces it. */
  icon?: React.ReactNode;
  state?: ContinueWithProviderState;
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  /** Icon size inside the button. Defaults from Button `size`. */
  iconSize?: IconSize;
  /** Optional Tooltip content wrapping the Button. */
  tooltip?: React.ReactNode;
  /** Disable tooltip open behavior. */
  tooltipDisabled?: boolean;
  className?: string;
  id?: string;
  /**
   * Fired when the user activates Continue.
   * Host owns OAuth redirect / token exchange.
   */
  onContinue?: (provider: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Slot: replace Icon-wrapped mark. */
  iconSlot?: React.ReactNode;
  /** Slot: replace visible label text. */
  labelSlot?: React.ReactNode;
  /** Slot: replace Button entirely (advanced). */
  buttonSlot?: React.ReactNode;
};

export type ContinueWithProviderGroupProps = {
  children: React.ReactNode;
  /** Section divider label. Default: “Or continue with”. Pass `false` to hide. */
  dividerLabel?: React.ReactNode | false;
  orientation?: "stacked" | "inline";
  showDivider?: boolean;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function iconSizeForButton(size: ButtonSize): IconSize {
  switch (size) {
    case "xs":
    case "sm":
      return "sm";
    case "lg":
    case "xl":
      return "md";
    default:
      return "sm";
  }
}

function resolveVariant(
  state: ContinueWithProviderState,
  variant: ButtonVariant
): ButtonVariant {
  if (state === "success") return "success";
  return variant;
}

const ContinueWithProviderRoot = React.forwardRef<
  HTMLButtonElement,
  ContinueWithProviderProps
>(function ContinueWithProvider(
  {
    provider,
    label,
    icon,
    state = "idle",
    size = "md",
    variant = "secondary",
    fullWidth = false,
    iconSize,
    tooltip,
    tooltipDisabled = false,
    className = "",
    id,
    onContinue,
    iconSlot,
    labelSlot,
    buttonSlot,
  },
  ref
) {
  const loading = state === "loading";
  const disabled = state === "disabled" || state === "loading";
  const resolvedVariant = resolveVariant(state, variant);
  const markSize = iconSize ?? iconSizeForButton(size);

  const leading =
    iconSlot ??
    (icon != null ? (
      <Icon size={markSize} className="dk-continue-with-provider__icon">
        {icon}
      </Icon>
    ) : null);

  const button =
    buttonSlot ?? (
      <Button
        ref={ref}
        id={id}
        type="button"
        size={size}
        variant={resolvedVariant}
        fullWidth={fullWidth}
        loading={loading}
        loadingLabel={`${label}, Loading`}
        disabled={disabled}
        leadingIcon={leading}
        className={cx(
          "dk-continue-with-provider__button",
          `dk-continue-with-provider__button--${state}`,
          className
        )}
        aria-invalid={state === "error" || undefined}
        data-provider={provider}
        data-state={state}
        onClick={(event) => {
          if (disabled) return;
          onContinue?.(provider, event);
        }}
      >
        {labelSlot ?? label}
      </Button>
    );

  const control = tooltip ? (
    <Tooltip content={tooltip} disabled={tooltipDisabled || disabled}>
      {button as React.ReactElement}
    </Tooltip>
  ) : (
    button
  );

  return (
    <div
      className={cx(
        "dk-continue-with-provider",
        `dk-continue-with-provider--${state}`,
        fullWidth && "dk-continue-with-provider--full"
      )}
      data-provider={provider}
      data-state={state}
    >
      {control}
      <span className="dk-continue-with-provider__sr-status" aria-live="polite">
        {state === "loading"
          ? `${label} in progress`
          : state === "success"
            ? `${label} succeeded`
            : state === "error"
              ? `${label} failed`
              : ""}
      </span>
    </div>
  );
});

ContinueWithProviderRoot.displayName = "ContinueWithProvider";

function ContinueWithProviderGroup({
  children,
  dividerLabel = "Or continue with",
  orientation = "stacked",
  showDivider = true,
  className = "",
  id,
}: ContinueWithProviderGroupProps) {
  return (
    <div
      id={id}
      className={cx(
        "dk-continue-with-provider-group",
        `dk-continue-with-provider-group--${orientation}`,
        className
      )}
      data-orientation={orientation}
    >
      {showDivider && dividerLabel !== false ? (
        <Divider
          variant="section"
          label={dividerLabel}
          className="dk-continue-with-provider-group__divider"
        />
      ) : null}
      <div className="dk-continue-with-provider-group__list">{children}</div>
    </div>
  );
}

ContinueWithProviderGroup.displayName = "ContinueWithProvider.Group";

export const ContinueWithProvider = Object.assign(ContinueWithProviderRoot, {
  Group: ContinueWithProviderGroup,
});

export default ContinueWithProvider;
