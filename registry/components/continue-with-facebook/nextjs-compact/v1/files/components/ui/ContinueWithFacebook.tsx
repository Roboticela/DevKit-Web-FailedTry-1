import * as React from "react";
import {
  ContinueWithProvider,
  type ContinueWithProviderProps,
  type ContinueWithProviderState,
} from "../../../../../../../continue-with-provider/nextjs-compact/v1/files/components/ui/ContinueWithProvider";
import type { ButtonSize, ButtonVariant } from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import type { IconSize } from "../../../../../../../icon/nextjs-compact/v1/files/components/ui/Icon";

/**
 * Continue With Facebook — Facebook OAuth control.
 * Extends Continue With Provider only. No duplicate layout or auth chrome.
 */

export type ContinueWithFacebookProps = Omit<
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

/** Facebook “f” mark in brand blue. */
export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="#1877F2">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7c1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z" />
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

export const ContinueWithFacebook = React.forwardRef<
  HTMLButtonElement,
  ContinueWithFacebookProps
>(function ContinueWithFacebook(
  {
    label = "Continue with Facebook",
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
      provider="facebook"
      label={label}
      icon={iconSlot ? undefined : <FacebookIcon />}
      iconSlot={iconSlot}
      state={resolved}
      variant={variant}
      {...rest}
    />
  );
});

ContinueWithFacebook.displayName = "ContinueWithFacebook";
export default ContinueWithFacebook;
