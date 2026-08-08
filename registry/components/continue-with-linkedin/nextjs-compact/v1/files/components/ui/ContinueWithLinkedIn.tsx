import * as React from "react";
import {
  ContinueWithProvider,
  type ContinueWithProviderProps,
  type ContinueWithProviderState,
} from "../../../../../../../continue-with-provider/nextjs-compact/v1/files/components/ui/ContinueWithProvider";
import type { ButtonSize, ButtonVariant } from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import type { IconSize } from "../../../../../../../icon/nextjs-compact/v1/files/components/ui/Icon";

/**
 * Continue With LinkedIn — LinkedIn OAuth control.
 * Extends Continue With Provider only. No duplicate layout or auth chrome.
 */

export type ContinueWithLinkedInProps = Omit<
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

/** LinkedIn “in” mark in brand blue. */
export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="#0A66C2">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04c-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12a2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0z" />
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

export const ContinueWithLinkedIn = React.forwardRef<
  HTMLButtonElement,
  ContinueWithLinkedInProps
>(function ContinueWithLinkedIn(
  {
    label = "Continue with LinkedIn",
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
      provider="linkedin"
      label={label}
      icon={iconSlot ? undefined : <LinkedInIcon />}
      iconSlot={iconSlot}
      state={resolved}
      variant={variant}
      {...rest}
    />
  );
});

ContinueWithLinkedIn.displayName = "ContinueWithLinkedIn";
export default ContinueWithLinkedIn;
