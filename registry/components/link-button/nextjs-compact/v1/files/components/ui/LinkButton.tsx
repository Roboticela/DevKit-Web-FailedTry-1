import * as React from "react";

export type LinkButtonTone = "accent" | "neutral" | "destructive";

export type LinkButtonLayout = "inline" | "standalone";

export interface LinkButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * Layout mode.
   * - `inline` — sits in text flow; underline by default
   * - `standalone` — block-ish control; underline on hover/focus
   */
  layout?: LinkButtonLayout;
  /** Color tone. Default: `accent`. */
  tone?: LinkButtonTone;
  /** Leading action/category icon. */
  leadingIcon?: React.ReactNode;
  /** Trailing navigation/expansion icon. */
  trailingIcon?: React.ReactNode;
  /**
   * Shows an external-affordance glyph after the label.
   * Visual only — this control remains a `button` (action), not an anchor.
   * For true navigation, use a dedicated Link component with `<a href>`.
   */
  external?: boolean;
  /** Visible label. Required. */
  children: React.ReactNode;
}

const LAYOUT_CLASS: Record<LinkButtonLayout, string> = {
  inline: "dk-link-button--inline",
  standalone: "dk-link-button--standalone",
};

const TONE_CLASS: Record<LinkButtonTone, string> = {
  accent: "dk-link-button--accent",
  neutral: "dk-link-button--neutral",
  destructive: "dk-link-button--destructive",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V9.5M9.5 2.5h4v4M13.5 2.5 7 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Link Button (ID 005) — action control that looks like a link.
 *
 * Always renders a `<button>`. Do not use for navigation; use a real link for URLs.
 * Distinguish: navigation links (`<a>`) · actions (this) · buttons (Button 001).
 */
export const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
  function LinkButton(
    {
      layout = "standalone",
      tone = "accent",
      leadingIcon,
      trailingIcon,
      external = false,
      disabled = false,
      type = "button",
      className,
      children,
      onClick,
      ...rest
    },
    ref
  ) {
    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        className={cx(
          "dk-link-button",
          LAYOUT_CLASS[layout],
          TONE_CLASS[tone],
          external && "dk-link-button--external",
          className
        )}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        data-layout={layout}
        data-tone={tone}
        data-external={external || undefined}
        onClick={disabled ? undefined : onClick}
      >
        <span className="dk-link-button__hit" aria-hidden="true" />

        <span className="dk-link-button__content">
          {leadingIcon ? (
            <span className="dk-link-button__icon dk-link-button__icon--leading" aria-hidden="true">
              {leadingIcon}
            </span>
          ) : null}

          <span className="dk-link-button__label">{children}</span>

          {trailingIcon ? (
            <span className="dk-link-button__icon dk-link-button__icon--trailing" aria-hidden="true">
              {trailingIcon}
            </span>
          ) : null}

          {external ? (
            <span className="dk-link-button__external" aria-hidden="true">
              <ExternalIcon />
            </span>
          ) : null}
        </span>
      </button>
    );
  }
);

LinkButton.displayName = "LinkButton";

export default LinkButton;
