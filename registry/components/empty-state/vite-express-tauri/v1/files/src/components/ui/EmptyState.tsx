import * as React from "react";

/**
 * EmptyState — calm placeholder when a content area has nothing to show.
 * Distinguishes empty (this component) from loading (Spinner/Skeleton) and error (Alert).
 * Actions are slots — compose with DevKit Button / LinkButton; do not invent custom buttons.
 */

export type EmptyStateVariant =
  | "default"
  | "first-use"
  | "no-results"
  | "filtered"
  | "completed"
  | "permission";

export type EmptyStateSize = "compact" | "standard" | "large";

export type EmptyStateProps = {
  /** Required: what is empty (localized by host). */
  title: React.ReactNode;
  /** Optional: why / context — useful, never blaming. */
  description?: React.ReactNode;
  /** Optional illustration or icon — keep modest; do not dominate. */
  illustration?: React.ReactNode;
  /**
   * Semantic situation (visual cue only). Host supplies copy.
   * Never use an error icon for a normal empty — permission may use a quieter cue.
   */
  variant?: EmptyStateVariant;
  size?: EmptyStateSize;
  /** Primary next step — pass a DevKit Button/LinkButton. Omit if none. */
  primaryAction?: React.ReactNode;
  /** Secondary action — pass a DevKit Button (secondary/ghost) or link. */
  secondaryAction?: React.ReactNode;
  /** Extra content below actions (e.g. help link). */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & Omit<React.HTMLAttributes<HTMLElement>, "title" | "children">;

function DefaultGlyph({ variant }: { variant: EmptyStateVariant }) {
  const common = {
    width: "1.5em",
    height: "1.5em",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    focusable: false as const,
  };

  switch (variant) {
    case "no-results":
    case "filtered":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
    case "completed":
      return (
        <svg {...common}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "permission":
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "first-use":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      );
  }
}

export const EmptyState = React.forwardRef<HTMLElement, EmptyStateProps>(
  function EmptyState(
    {
      title,
      description,
      illustration,
      variant = "default",
      size = "standard",
      primaryAction,
      secondaryAction,
      children,
      className = "",
      style,
      id,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const titleId = `${id ?? reactId}-title`;
    const descId = description != null ? `${id ?? reactId}-desc` : undefined;
    const hasActions = primaryAction != null || secondaryAction != null;

    return (
      <section
        ref={ref}
        id={id}
        className={[
          "dk-empty",
          `dk-empty--${variant}`,
          `dk-empty--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={style}
        data-variant={variant}
        data-size={size}
        aria-labelledby={titleId}
        aria-describedby={descId}
        {...rest}
      >
        <div className="dk-empty__media" aria-hidden="true">
          {illustration ?? (
            <span className="dk-empty__glyph">
              <DefaultGlyph variant={variant} />
            </span>
          )}
        </div>

        <div className="dk-empty__body">
          <h2 id={titleId} className="dk-empty__title">
            {title}
          </h2>
          {description != null && (
            <p id={descId} className="dk-empty__description">
              {description}
            </p>
          )}
        </div>

        {hasActions && (
          <div className="dk-empty__actions">
            {primaryAction}
            {secondaryAction}
          </div>
        )}

        {children != null && <div className="dk-empty__extra">{children}</div>}
      </section>
    );
  }
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
