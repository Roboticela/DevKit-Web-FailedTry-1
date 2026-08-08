import * as React from "react";
import {
  ContinueWithProvider,
  type ContinueWithProviderProps,
  type ContinueWithProviderState,
} from "../../../../../../../continue-with-provider/vite-express-tauri/v1/files/src/components/ui/ContinueWithProvider";
import type { ButtonSize, ButtonVariant } from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import type { IconSize } from "../../../../../../../icon/vite-express-tauri/v1/files/src/components/ui/Icon";

/**
 * Continue With Microsoft — Microsoft OAuth / Entra ID control.
 * Extends Continue With Provider only. No duplicate layout or auth chrome.
 */

export type ContinueWithMicrosoftProps = Omit<
  ContinueWithProviderProps,
  "provider" | "icon" | "label"
> & {
  label?: string;
  /** Alias for `state="loading"`. Ignored when `state` is set. */
  loading?: boolean;
  /** Alias for `state="disabled"`. Ignored when `state` is set. */
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  iconSize?: IconSize;
  state?: ContinueWithProviderState;
};

/** Official Microsoft four-square mark. */
export function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M13 1h10v10H13z" />
      <path fill="#00A4EF" d="M1 13h10v10H1z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  );
}

function resolveState(
  state: ContinueWithProviderState | undefined,
  loading: boolean | undefined,
  disabled: boolean | undefined
): ContinueWithProviderState {
  if (state) return state;
  if (loading) return "loading";
  if (disabled) return "disabled";
  return "idle";
}

export const ContinueWithMicrosoft = React.forwardRef<
  HTMLButtonElement,
  ContinueWithMicrosoftProps
>(function ContinueWithMicrosoft(
  {
    label = "Continue with Microsoft",
    loading,
    disabled,
    state,
    variant = "secondary",
    iconSlot,
    ...rest
  },
  ref
) {
  const resolved = resolveState(state, loading, disabled);

  return (
    <ContinueWithProvider
      ref={ref}
      provider="microsoft"
      label={label}
      icon={iconSlot ? undefined : <MicrosoftIcon />}
      iconSlot={iconSlot}
      state={resolved}
      variant={variant}
      {...rest}
    />
  );
});

ContinueWithMicrosoft.displayName = "ContinueWithMicrosoft";
export default ContinueWithMicrosoft;
