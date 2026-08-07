import * as React from "react";

/**
 * Brand — product / organization identity lockup.
 * Compose mark + name + optional descriptor. Not a generic image.
 * No gradients. No box-shadows.
 */

export type BrandLayout = "symbol" | "wordmark" | "lockup" | "stacked";
export type BrandTone = "color" | "monochrome" | "inverse";
export type BrandSize = "sm" | "md" | "lg";

export type BrandProps = {
  /** Accessible name for the brand (required). */
  label: string;
  layout?: BrandLayout;
  tone?: BrandTone;
  size?: BrandSize;
  /** Mark / symbol node (SVG preferred). Required for symbol/lockup/stacked. */
  mark?: React.ReactNode;
  /** Visible product name. Defaults to `label` for wordmark/lockup. */
  name?: React.ReactNode;
  /** Optional secondary descriptor. */
  descriptor?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Brand = React.forwardRef<HTMLElement, BrandProps>(function Brand(
  {
    label,
    layout = "lockup",
    tone = "color",
    size = "md",
    mark,
    name,
    descriptor,
    href,
    target,
    rel,
    onClick,
    disabled = false,
    className = "",
    id,
  },
  ref
) {
  const showMark = layout !== "wordmark";
  const showName = layout !== "symbol";
  const title = name ?? label;
  const interactive = Boolean(href || onClick) && !disabled;

  const classNames = cx(
    "dk-brand",
    `dk-brand--${layout}`,
    `dk-brand--${tone}`,
    `dk-brand--${size}`,
    interactive && "dk-brand--interactive",
    disabled && "dk-brand--disabled",
    className
  );

  const body = (
    <>
      {showMark ? (
        <span className="dk-brand__mark" aria-hidden={showName ? true : undefined}>
          {mark ?? (
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.75" />
              <path d="M8 12.5h8M12 8.5v8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          )}
        </span>
      ) : null}
      {showName ? (
        <span className="dk-brand__text">
          <span className="dk-brand__name">{title}</span>
          {descriptor ? <span className="dk-brand__descriptor">{descriptor}</span> : null}
        </span>
      ) : null}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        id={id}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        className={classNames}
        aria-label={label}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
      >
        {body}
      </a>
    );
  }

  if (onClick || disabled) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        id={id}
        type="button"
        className={classNames}
        aria-label={label}
        disabled={disabled}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement> | undefined}
      >
        {body}
      </button>
    );
  }

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} id={id} className={classNames} role="img" aria-label={label}>
      {body}
    </span>
  );
});

Brand.displayName = "Brand";
export default Brand;
