import * as React from "react";

/**
 * Illustration — presentation container for conceptual visual assets.
 * Empty state, onboarding, success/failure, information, product context.
 * Not an illustration library. Contain / natural only — no distortion.
 * Default sizes stay modest; `hero` is the explicit large presentation.
 */

export type IllustrationSize = "sm" | "md" | "lg" | "hero";

export type IllustrationAlign = "start" | "center" | "end";

/**
 * `contain` — fit inside the size box without cropping or stretching.
 * `natural` — intrinsic aspect ratio; constrained only by max size.
 */
export type IllustrationFit = "contain" | "natural";

export type IllustrationPurpose =
  | "concept"
  | "empty"
  | "onboarding"
  | "success"
  | "failure"
  | "information"
  | "product";

export type IllustrationProps = {
  /** Raster or vector URL (SVG/PNG/WebP). Prefer SVG for UI illustrations. */
  src?: string;
  /**
   * Inline illustration (SVG React node). Used when `src` is omitted.
   * Prefer `currentColor` / theme-aware artwork.
   */
  children?: React.ReactNode;
  /**
   * Alternative text when the illustration communicates information.
   * Required unless `decorative` is true.
   */
  alt?: string;
  /**
   * Purely decorative — hidden from assistive technology.
   * Default `false` when `alt` is provided; pass `true` for ornament only.
   */
  decorative?: boolean;
  /**
   * Size category. Default `md`.
   * Only `hero` is intended to dominate a viewport region.
   */
  size?: IllustrationSize;
  align?: IllustrationAlign;
  fit?: IllustrationFit;
  /** Optional CSS aspect-ratio, e.g. `"4 / 3"`. Reserves space; media uses contain. */
  aspectRatio?: string;
  /**
   * Contextual purpose — data hook for hosts; does not add chrome/frames.
   */
  purpose?: IllustrationPurpose;
  /**
   * When true, host may animate children / CSS. Default false.
   * Animated content must pause under reduced-motion.
   */
  animated?: boolean;
  /** Shown when `src` fails to load. */
  fallback?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  loading?: "lazy" | "eager";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Illustration = React.forwardRef<HTMLElement, IllustrationProps>(
  function Illustration(
    {
      src,
      children,
      alt = "",
      decorative: decorativeProp,
      size = "md",
      align = "center",
      fit = "contain",
      aspectRatio,
      purpose,
      animated = false,
      fallback,
      width,
      height,
      loading = "lazy",
      className = "",
      id,
      style,
      onLoad,
      onError,
    },
    forwardedRef
  ) {
    const decorative =
      decorativeProp === true || (decorativeProp !== false && !alt);
    const [failed, setFailed] = React.useState(false);

    React.useEffect(() => {
      setFailed(false);
    }, [src]);

    const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setFailed(false);
      onLoad?.(event);
    };

    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setFailed(true);
      onError?.(event);
    };

    const frameStyle: React.CSSProperties = {
      ...(aspectRatio ? { aspectRatio } : null),
      ...(width != null ? { width } : null),
      ...(height != null && !aspectRatio ? { height } : null),
      ...style,
    };

    const showImg = Boolean(src) && !failed;
    const showChildren = !src && children != null;
    const showFallback = failed && src;

    const accessibleAlt = decorative ? "" : alt;

    return (
      <figure
        ref={forwardedRef as React.Ref<HTMLElement>}
        id={id}
        className={cx(
          "dk-illustration",
          `dk-illustration--${size}`,
          `dk-illustration--align-${align}`,
          `dk-illustration--fit-${fit}`,
          animated && "dk-illustration--animated",
          decorative && "dk-illustration--decorative",
          failed && "dk-illustration--error",
          className
        )}
        data-purpose={purpose}
        style={frameStyle}
        role={decorative ? "presentation" : undefined}
        aria-hidden={decorative ? true : undefined}
        aria-label={!decorative && !showImg ? accessibleAlt || undefined : undefined}
      >
        {showImg ? (
          <img
            className="dk-illustration__media"
            src={src}
            alt={accessibleAlt}
            loading={loading}
            decoding="async"
            draggable={false}
            onLoad={handleLoad}
            onError={handleError}
            aria-hidden={decorative || undefined}
          />
        ) : null}

        {showChildren ? (
          <span className="dk-illustration__vector" aria-hidden="true">
            {children}
          </span>
        ) : null}

        {showFallback ? (
          <span
            className="dk-illustration__fallback"
            role={decorative ? undefined : "img"}
            aria-label={decorative ? undefined : accessibleAlt || "Illustration unavailable"}
            aria-hidden={decorative || undefined}
          >
            {fallback != null ? (
              fallback
            ) : (
              <span className="dk-illustration__fallback-mark" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                  <rect
                    x="6"
                    y="10"
                    width="36"
                    height="28"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="18" cy="22" r="3" fill="currentColor" />
                  <path
                    d="M8 34l10-9 7 6 6-5 9 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </span>
        ) : null}
      </figure>
    );
  }
);

Illustration.displayName = "Illustration";

export default Illustration;
