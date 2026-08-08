import * as React from "react";
import {
  ContinueWithProvider,
  type ContinueWithProviderProps,
  type ContinueWithProviderState,
} from "../../../../../../../continue-with-provider/vite-express-tauri/v1/files/src/components/ui/ContinueWithProvider";
import type { ButtonSize, ButtonVariant } from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import type { IconSize } from "../../../../../../../icon/vite-express-tauri/v1/files/src/components/ui/Icon";

/**
 * Continue With Google — Google OAuth control.
 * Extends Continue With Provider only. No duplicate layout or auth chrome.
 */

export type ContinueWithGoogleProps = Omit<
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

/** Official multicolor Google “G” mark. */
export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
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

export const ContinueWithGoogle = React.forwardRef<HTMLButtonElement, ContinueWithGoogleProps>(
  function ContinueWithGoogle(
    {
      label = "Continue with Google",
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
        provider="google"
        label={label}
        icon={iconSlot ? undefined : <GoogleIcon />}
        iconSlot={iconSlot}
        state={resolved}
        variant={variant}
        {...rest}
      />
    );
  }
);

ContinueWithGoogle.displayName = "ContinueWithGoogle";
export default ContinueWithGoogle;
