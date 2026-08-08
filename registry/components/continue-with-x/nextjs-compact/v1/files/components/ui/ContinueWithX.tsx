import * as React from "react";
import {
  ContinueWithProvider,
  type ContinueWithProviderProps,
  type ContinueWithProviderState,
} from "../../../../../../../continue-with-provider/nextjs-compact/v1/files/components/ui/ContinueWithProvider";
import type { ButtonSize, ButtonVariant } from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import type { IconSize } from "../../../../../../../icon/nextjs-compact/v1/files/components/ui/Icon";

/**
 * Continue With X — X (Twitter) OAuth control.
 * Extends Continue With Provider only. No duplicate layout or auth chrome.
 */

export type ContinueWithXProps = Omit<
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

/** X mark — uses `currentColor` for theme contrast. */
export function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="currentColor">
      <path d="M18.24 2.25h3.31l-7.23 8.26l8.5 11.24h-6.65l-5.21-6.82l-5.96 6.82H1.69l7.73-8.84L1.25 2.25h6.81l4.71 6.23l5.47-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
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

export const ContinueWithX = React.forwardRef<HTMLButtonElement, ContinueWithXProps>(
  function ContinueWithX(
    {
      label = "Continue with X",
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
        provider="x"
        label={label}
        icon={iconSlot ? undefined : <XIcon />}
        iconSlot={iconSlot}
        state={resolved}
        variant={variant}
        {...rest}
      />
    );
  }
);

ContinueWithX.displayName = "ContinueWithX";
export default ContinueWithX;
