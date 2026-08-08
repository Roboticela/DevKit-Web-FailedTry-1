import * as React from "react";
import {
  ContinueWithProvider,
  type ContinueWithProviderProps,
  type ContinueWithProviderState,
} from "../../../../../../../continue-with-provider/vite-express-tauri/v1/files/src/components/ui/ContinueWithProvider";
import type { ButtonSize, ButtonVariant } from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import type { IconSize } from "../../../../../../../icon/vite-express-tauri/v1/files/src/components/ui/Icon";

/**
 * Continue With Slack — Slack OAuth control.
 * Extends Continue With Provider only. No duplicate layout or auth chrome.
 */

export type ContinueWithSlackProps = Omit<
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

/** Official multicolor Slack mark. */
export function SlackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path
        fill="#E01E5A"
        d="M5.04 15.16a2.04 2.04 0 1 1-2.04-2.04h2.04v2.04zm1.02 0a2.04 2.04 0 1 1 4.08 0v5.11a2.04 2.04 0 1 1-4.08 0v-5.11z"
      />
      <path
        fill="#36C5F0"
        d="M8.86 5.04a2.04 2.04 0 1 1 2.04-2.04v2.04H8.86zm0 1.02a2.04 2.04 0 1 1 0 4.08H3.75a2.04 2.04 0 1 1 0-4.08h5.11z"
      />
      <path
        fill="#2EB67D"
        d="M18.96 8.86a2.04 2.04 0 1 1 2.04 2.04h-2.04V8.86zm-1.02 0a2.04 2.04 0 1 1-4.08 0V3.75a2.04 2.04 0 1 1 4.08 0v5.11z"
      />
      <path
        fill="#ECB22E"
        d="M15.16 18.96a2.04 2.04 0 1 1-2.04 2.04v-2.04h2.04zm0-1.02a2.04 2.04 0 1 1 0-4.08h5.11a2.04 2.04 0 1 1 0 4.08h-5.11z"
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

export const ContinueWithSlack = React.forwardRef<HTMLButtonElement, ContinueWithSlackProps>(
  function ContinueWithSlack(
    {
      label = "Continue with Slack",
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
        provider="slack"
        label={label}
        icon={iconSlot ? undefined : <SlackIcon />}
        iconSlot={iconSlot}
        state={resolved}
        variant={variant}
        {...rest}
      />
    );
  }
);

ContinueWithSlack.displayName = "ContinueWithSlack";
export default ContinueWithSlack;
