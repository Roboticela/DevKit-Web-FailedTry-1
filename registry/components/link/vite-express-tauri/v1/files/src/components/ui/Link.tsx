import * as React from "react";

/**
 * Link — navigation to another destination or resource.
 * Always an `<a>` (or inert span when disabled). Not a Button — actions use Button / LinkButton.
 * Distinguishable without color alone (underline). External icon is opt-in.
 */

export type LinkVariant = "inline" | "standalone";

export type LinkTone = "accent" | "neutral";

export type LinkProps = {
  /** Destination URL or hash (internal, external, or in-page anchor). */
  href: string;
  children?: React.ReactNode;
  /**
   * - `inline` — text-flow; underline by default
   * - `standalone` — block-ish; underline strengthens on hover/focus
   */
  variant?: LinkVariant;
  tone?: LinkTone;
  /**
   * Opt-in external affordance. Does not auto-apply to every link.
   * When `target="_blank"`, defaults `rel` to `noopener noreferrer` if unset.
   */
  external?: boolean;
  /** Accessible name for the external mark. Default `"Opens in a new window"`. */
  externalLabel?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  target?: string;
  rel?: string;
  download?: boolean | string;
  /**
   * Rare — only when navigation is truly unavailable.
   * Prefer removing the link over disabling it.
   */
  disabled?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
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

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(
    {
      href,
      children,
      variant = "inline",
      tone = "accent",
      external = false,
      externalLabel = "Opens in a new window",
      leadingIcon,
      trailingIcon,
      target,
      rel,
      download,
      disabled = false,
      className = "",
      id,
      style,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      onClick,
    },
    forwardedRef
  ) {
    const classNames = cx(
      "dk-link",
      `dk-link--${variant}`,
      `dk-link--${tone}`,
      external && "dk-link--external",
      disabled && "dk-link--disabled",
      className
    );

    const resolvedRel =
      rel ??
      (target === "_blank" ? "noopener noreferrer" : undefined);

    const content = (
      <span className="dk-link__content">
        {leadingIcon != null ? (
          <span className="dk-link__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <span className="dk-link__label">{children}</span>
        {trailingIcon != null ? (
          <span className="dk-link__icon" aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
        {external ? (
          <span
            className="dk-link__external"
            aria-hidden={ariaLabel ? true : undefined}
            title={externalLabel}
          >
            <ExternalIcon />
            {!ariaLabel ? (
              <span className="dk-link__sr-only">{externalLabel}</span>
            ) : null}
          </span>
        ) : null}
      </span>
    );

    if (disabled) {
      return (
        <span
          id={id}
          className={classNames}
          style={style}
          role="link"
          aria-disabled="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          {content}
        </span>
      );
    }

    return (
      <a
        ref={forwardedRef}
        id={id}
        href={href}
        target={target}
        rel={resolvedRel}
        download={download}
        className={classNames}
        style={style}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }
);

Link.displayName = "Link";

export default Link;
