import * as React from "react";
import {
  Spinner,
  type SpinnerSize,
  type SpinnerTone,
  type SpinnerLabelMode,
  type SpinnerLabelPlacement,
} from "../../../../../../../spinner/vite-express-tauri/v1/files/src/components/ui/Spinner";
import {
  Skeleton,
  SkeletonGroup,
  type SkeletonSize,
} from "../../../../../../../skeleton/vite-express-tauri/v1/files/src/components/ui/Skeleton";

/**
 * Authentication Loading — progress UI while an auth step runs.
 * Composes Spinner + Skeleton / Skeleton Group only.
 * No custom loaders or shimmer chrome.
 *
 * Flows: sign-in · account-creation · password-reset · passkey ·
 * email-verification · session-restoration
 */

export type AuthenticationLoadingFlow =
  | "sign-in"
  | "account-creation"
  | "password-reset"
  | "passkey"
  | "email-verification"
  | "session-restoration";

/**
 * - `stacked` — spinner + skeleton form (default)
 * - `compact` — spinner + short skeleton
 * - `inline` — spinner with visible label only
 * - `form` — skeleton form-forward, spinner in header
 */
export type AuthenticationLoadingVariant = "stacked" | "compact" | "inline" | "form";

export type AuthenticationLoadingProps = {
  flow?: AuthenticationLoadingFlow;
  variant?: AuthenticationLoadingVariant;
  /** Primary status message. Defaults from `flow`. */
  message?: string;
  /** Supporting line under the spinner. Defaults from `flow`. */
  description?: string;
  showSpinner?: boolean;
  showSkeleton?: boolean;
  /** Hide visible description (message still announced via Spinner). */
  hideDescription?: boolean;
  spinnerSize?: SpinnerSize;
  spinnerTone?: SpinnerTone;
  spinnerLabelMode?: SpinnerLabelMode;
  spinnerLabelPlacement?: SpinnerLabelPlacement;
  skeletonSize?: SkeletonSize;
  skeletonAnimated?: boolean;
  /** Slot: replace Spinner. */
  spinnerSlot?: React.ReactNode;
  /** Slot: replace Skeleton Group. */
  skeletonSlot?: React.ReactNode;
  /** Slot: extra content under the loading region. */
  footerSlot?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const AUTHENTICATION_LOADING_FLOW_COPY: Record<
  AuthenticationLoadingFlow,
  { message: string; description: string }
> = {
  "sign-in": {
    message: "Signing you in",
    description: "Checking your credentials…",
  },
  "account-creation": {
    message: "Creating your account",
    description: "Setting up your profile…",
  },
  "password-reset": {
    message: "Resetting your password",
    description: "Applying your new credentials…",
  },
  passkey: {
    message: "Verifying passkey",
    description: "Waiting for your authenticator…",
  },
  "email-verification": {
    message: "Verifying your email",
    description: "Confirming your verification code…",
  },
  "session-restoration": {
    message: "Restoring your session",
    description: "Loading your secure workspace…",
  },
};

function FormSkeleton({
  flow,
  size,
  animated,
}: {
  flow: AuthenticationLoadingFlow;
  size: SkeletonSize;
  animated: boolean;
}) {
  if (flow === "passkey") {
    return (
      <>
        <Skeleton shape="circle" size={size === "sm" ? "md" : "lg"} animated={animated} />
        <Skeleton shape="title" size={size} lines={1} width="55%" animated={animated} />
        <Skeleton shape="text" size={size} lines={2} animated={animated} />
        <Skeleton shape="rectangle" size={size} height={44} width="100%" animated={animated} />
      </>
    );
  }

  if (flow === "session-restoration") {
    return (
      <>
        <Skeleton shape="avatar" size={size === "sm" ? "md" : "lg"} animated={animated} />
        <Skeleton shape="title" size={size} lines={1} width="40%" animated={animated} />
        <Skeleton shape="text" size={size} lines={3} animated={animated} />
        <Skeleton shape="rectangle" size={size} height={120} width="100%" animated={animated} />
      </>
    );
  }

  if (flow === "email-verification") {
    return (
      <>
        <Skeleton shape="title" size={size} lines={1} width="50%" animated={animated} />
        <Skeleton shape="text" size={size} lines={1} width="70%" animated={animated} />
        <div className="dk-authentication-loading__code-row">
          <Skeleton shape="rectangle" size={size} height={44} width={44} animated={animated} />
          <Skeleton shape="rectangle" size={size} height={44} width={44} animated={animated} />
          <Skeleton shape="rectangle" size={size} height={44} width={44} animated={animated} />
          <Skeleton shape="rectangle" size={size} height={44} width={44} animated={animated} />
          <Skeleton shape="rectangle" size={size} height={44} width={44} animated={animated} />
          <Skeleton shape="rectangle" size={size} height={44} width={44} animated={animated} />
        </div>
      </>
    );
  }

  // sign-in · account-creation · password-reset
  return (
    <>
      <Skeleton shape="title" size={size} lines={1} width="45%" animated={animated} />
      <Skeleton shape="text" size={size} lines={1} width="65%" animated={animated} />
      <Skeleton shape="rectangle" size={size} height={44} width="100%" animated={animated} />
      <Skeleton shape="rectangle" size={size} height={44} width="100%" animated={animated} />
      {flow === "account-creation" ? (
        <Skeleton shape="rectangle" size={size} height={44} width="100%" animated={animated} />
      ) : null}
      <Skeleton shape="rectangle" size={size} height={44} width="40%" animated={animated} />
    </>
  );
}

export const AuthenticationLoading = React.forwardRef<
  HTMLDivElement,
  AuthenticationLoadingProps
>(function AuthenticationLoading(
  {
    flow = "sign-in",
    variant = "stacked",
    message: messageProp,
    description: descriptionProp,
    showSpinner = true,
    showSkeleton = true,
    hideDescription = false,
    spinnerSize = "lg",
    spinnerTone = "accent",
    spinnerLabelMode = "visible",
    spinnerLabelPlacement = "bottom",
    skeletonSize = "md",
    skeletonAnimated = true,
    spinnerSlot,
    skeletonSlot,
    footerSlot,
    className = "",
    id,
  },
  ref
) {
  const copy = AUTHENTICATION_LOADING_FLOW_COPY[flow];
  const message = messageProp ?? copy.message;
  const description = descriptionProp ?? copy.description;

  const showSkeletonRegion = showSkeleton && variant !== "inline";
  const compactSkeleton = variant === "compact";

  const spinnerNode =
    spinnerSlot ??
    (showSpinner ? (
      <Spinner
        size={variant === "inline" || variant === "compact" ? "md" : spinnerSize}
        tone={spinnerTone}
        label={message}
        labelMode={spinnerLabelMode}
        labelPlacement={
          variant === "inline" ? "end" : spinnerLabelPlacement
        }
        layout={variant === "inline" ? "inline" : "block"}
        className="dk-authentication-loading__spinner"
      />
    ) : null);

  const skeletonNode =
    skeletonSlot ??
    (showSkeletonRegion ? (
      <SkeletonGroup
        label={message}
        gap={compactSkeleton ? "sm" : "md"}
        orientation="vertical"
        className="dk-authentication-loading__skeleton"
      >
        {compactSkeleton ? (
          <>
            <Skeleton
              shape="title"
              size={skeletonSize}
              lines={1}
              width="50%"
              animated={skeletonAnimated}
            />
            <Skeleton
              shape="text"
              size={skeletonSize}
              lines={2}
              animated={skeletonAnimated}
            />
          </>
        ) : (
          <FormSkeleton
            flow={flow}
            size={skeletonSize}
            animated={skeletonAnimated}
          />
        )}
      </SkeletonGroup>
    ) : null);

  return (
    <div
      ref={ref}
      id={id}
      className={cx(
        "dk-authentication-loading",
        `dk-authentication-loading--${variant}`,
        `dk-authentication-loading--${flow}`,
        className
      )}
      data-variant={variant}
      data-flow={flow}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={message}
    >
      <div className="dk-authentication-loading__main">
        {variant === "form" ? (
          <>
            {skeletonNode}
            {spinnerNode ? (
              <div className="dk-authentication-loading__spinner-row">{spinnerNode}</div>
            ) : null}
          </>
        ) : (
          <>
            {spinnerNode}
            {!hideDescription && variant !== "inline" && description ? (
              <p className="dk-authentication-loading__description">{description}</p>
            ) : null}
            {skeletonNode}
          </>
        )}
      </div>

      {footerSlot ? (
        <div className="dk-authentication-loading__footer">{footerSlot}</div>
      ) : null}
    </div>
  );
});

AuthenticationLoading.displayName = "AuthenticationLoading";
export default AuthenticationLoading;
