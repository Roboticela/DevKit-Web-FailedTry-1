import * as React from "react";
import {
  ContinueWithProvider,
  type ContinueWithProviderProps,
  type ContinueWithProviderState,
} from "../../../../../../../continue-with-provider/vite-express-tauri/v1/files/src/components/ui/ContinueWithProvider";
import type { ButtonSize, ButtonVariant } from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import type { IconSize } from "../../../../../../../icon/vite-express-tauri/v1/files/src/components/ui/Icon";

/**
 * Continue With Apple — Sign in with Apple control.
 * Extends Continue With Provider only. No duplicate layout or auth chrome.
 */

export type ContinueWithAppleProps = Omit<
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

/** Apple mark — uses `currentColor` for theme contrast. */
export function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.46 2.22-1.21 3.02-.79.86-2.1 1.52-3.2 1.43-.13-1.1.4-2.25 1.17-3.04.8-.84 2.18-1.45 3.24-1.41zM20.9 17.45c-.55 1.27-.82 1.84-1.53 2.96-.99 1.56-2.38 3.5-4.1 3.51-1.53.02-1.93-1-4.02-1-2.08 0-2.53.98-4.04 1.02-1.72.04-3.04-1.69-4.04-3.24C1.5 17.7-.2 12.9 1.5 9.55c.95-1.88 2.66-3.07 4.5-3.1 1.77-.04 3.44 1.19 4.02 1.19.58 0 2.66-1.47 4.49-1.25.77.03 2.93.31 4.32 2.34-.11.07-2.58 1.5-2.55 4.48.03 3.55 3.11 4.73 3.14 4.74z" />
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

export const ContinueWithApple = React.forwardRef<HTMLButtonElement, ContinueWithAppleProps>(
  function ContinueWithApple(
    {
      label = "Continue with Apple",
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
        provider="apple"
        label={label}
        icon={iconSlot ? undefined : <AppleIcon />}
        iconSlot={iconSlot}
        state={resolved}
        variant={variant}
        {...rest}
      />
    );
  }
);

ContinueWithApple.displayName = "ContinueWithApple";
export default ContinueWithApple;
