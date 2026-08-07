import * as React from "react";

/**
 * Cover Media — fills a defined rectangular region with controlled cropping.
 * Default fit is cover. Focal point is configurable — do not blind center-crop.
 * Aspect presets use ratios only (compact / standard / wide / hero).
 * Overlay text uses a solid scrim for contrast — no heavy gradients.
 */

export type CoverMediaFit = "cover" | "contain";

/**
 * Aspect preset — ratio tokens, not arbitrary pixel dimensions.
 * Override with `aspectRatio` when needed.
 */
export type CoverMediaAspect = "compact" | "standard" | "wide" | "hero" | "custom";

export type CoverMediaFocal =
  | "top"
  | "center"
  | "bottom"
  | "left"
  | "right"
  | "custom";

export type CoverMediaRadius = "none" | "sm" | "md";

export type CoverMediaProps = {
  src?: string;
  srcSet?: string;
  sizes?: string;
  /**
   * Alternative text for meaningful content.
   * Required unless `decorative` is true.
   */
  alt?: string;
  decorative?: boolean;
  /**
   * Default `cover` — fills the region with controlled cropping.
   * Use `contain` when the full asset must remain visible.
   */
  objectFit?: CoverMediaFit;
  /**
   * Preset aspect. Default `standard` (16 / 9).
   * Use `custom` with `aspectRatio` for free ratios.
   */
  aspect?: CoverMediaAspect;
  /** CSS aspect-ratio when `aspect="custom"`, e.g. `"3 / 2"`. */
  aspectRatio?: string;
  /**
   * Focal point for cropping. Default `center`.
   * Prefer `top` for portraits / human subjects when faces sit high.
   */
  focal?: CoverMediaFocal;
  /**
   * CSS object-position when `focal="custom"`, e.g. `"30% 20%"`.
   */
  objectPosition?: string;
  /**
   * Corner treatment via global radius tokens.
   * Default `none` — avoid excessive rounding.
   */
  radius?: CoverMediaRadius;
  /**
   * When true (and caption/overlay present), shows a solid contrast scrim.
   * Default: on when overlay/caption/metadata content exists.
   */
  contrastProtection?: boolean;
  /** Optional overlay slot (prop API). Prefer compound `CoverMedia.Overlay`. */
  overlay?: React.ReactNode;
  caption?: React.ReactNode;
  metadata?: React.ReactNode;
  children?: React.ReactNode;
  loading?: "lazy" | "eager";
  priority?: boolean;
  fallback?: React.ReactNode;
  error?: boolean;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

export type CoverMediaRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

const ASPECT_RATIO: Record<Exclude<CoverMediaAspect, "custom">, string> = {
  compact: "4 / 3",
  standard: "16 / 9",
  wide: "2 / 1",
  hero: "21 / 9",
};

const FOCAL_POSITION: Record<Exclude<CoverMediaFocal, "custom">, string> = {
  top: "center top",
  center: "center center",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function displayNameOf(child: React.ReactElement): string | undefined {
  return (child.type as { displayName?: string })?.displayName;
}

function CoverMediaOverlay({
  className = "",
  children,
  ...rest
}: CoverMediaRegionProps) {
  return (
    <div className={cx("dk-cover-media__overlay", className)} {...rest}>
      {children}
    </div>
  );
}
CoverMediaOverlay.displayName = "CoverMedia.Overlay";

function CoverMediaCaption({
  className = "",
  children,
  ...rest
}: CoverMediaRegionProps) {
  return (
    <div className={cx("dk-cover-media__caption", className)} {...rest}>
      {children}
    </div>
  );
}
CoverMediaCaption.displayName = "CoverMedia.Caption";

function CoverMediaMetadata({
  className = "",
  children,
  ...rest
}: CoverMediaRegionProps) {
  return (
    <div className={cx("dk-cover-media__metadata", className)} {...rest}>
      {children}
    </div>
  );
}
CoverMediaMetadata.displayName = "CoverMedia.Metadata";

function CoverMediaRoot(
  {
    src,
    srcSet,
    sizes,
    alt = "",
    decorative = false,
    objectFit = "cover",
    aspect = "standard",
    aspectRatio: aspectRatioProp,
    focal = "center",
    objectPosition: objectPositionProp,
    radius = "none",
    contrastProtection,
    overlay,
    caption,
    metadata,
    children,
    loading = "lazy",
    priority = false,
    fallback,
    error: errorProp,
    onLoad,
    onError,
    className = "",
    id,
    style,
  }: CoverMediaProps,
  forwardedRef: React.ForwardedRef<HTMLElement>
) {
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "loaded" | "error"
  >(src || srcSet ? "loading" : "idle");

  React.useEffect(() => {
    if (src || srcSet) setStatus("loading");
    else setStatus("idle");
  }, [src, srcSet]);

  const failed = errorProp === true || status === "error";
  const accessibleAlt = decorative ? "" : alt;

  const ratio =
    aspect === "custom"
      ? aspectRatioProp ?? ASPECT_RATIO.standard
      : aspectRatioProp;

  const position =
    focal === "custom"
      ? objectPositionProp ?? "center center"
      : FOCAL_POSITION[focal];

  const overlayNodes: React.ReactNode[] = [];
  const captionNodes: React.ReactNode[] = [];
  const metadataNodes: React.ReactNode[] = [];
  const otherNodes: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      otherNodes.push(child);
      return;
    }
    const name = displayNameOf(child);
    if (name === "CoverMedia.Overlay") overlayNodes.push(child);
    else if (name === "CoverMedia.Caption") captionNodes.push(child);
    else if (name === "CoverMedia.Metadata") metadataNodes.push(child);
    else otherNodes.push(child);
  });

  const hasOverlay =
    overlayNodes.length > 0 ||
    overlay != null ||
    captionNodes.length > 0 ||
    caption != null ||
    metadataNodes.length > 0 ||
    metadata != null;

  const useScrim = contrastProtection ?? hasOverlay;

  const frameStyle: React.CSSProperties = {
    ...(ratio ? { aspectRatio: ratio } : null),
    ["--dk-cover-fit" as string]: objectFit,
    ["--dk-cover-position" as string]: position,
    ...style,
  };

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setStatus("loaded");
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setStatus("error");
    onError?.(event);
  };

  return (
    <figure
      ref={forwardedRef as React.Ref<HTMLElement>}
      id={id}
      className={cx(
        "dk-cover-media",
        `dk-cover-media--${aspect}`,
        `dk-cover-media--fit-${objectFit}`,
        `dk-cover-media--focal-${focal}`,
        `dk-cover-media--radius-${radius}`,
        useScrim && "dk-cover-media--scrim",
        status === "loading" && !failed && "dk-cover-media--loading",
        status === "loaded" && !failed && "dk-cover-media--loaded",
        failed && "dk-cover-media--error",
        decorative && "dk-cover-media--decorative",
        className
      )}
      style={frameStyle}
      role={decorative ? "presentation" : undefined}
      aria-hidden={decorative ? true : undefined}
    >
      {!failed && (src || srcSet) ? (
        <img
          className="dk-cover-media__media"
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={accessibleAlt}
          loading={priority ? "eager" : loading}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          draggable={false}
          onLoad={handleLoad}
          onError={handleError}
          aria-hidden={decorative || undefined}
        />
      ) : null}

      {failed ? (
        <span
          className="dk-cover-media__fallback"
          role={decorative ? undefined : "img"}
          aria-label={
            decorative ? undefined : accessibleAlt || "Cover media unavailable"
          }
          aria-hidden={decorative || undefined}
        >
          {fallback != null ? (
            fallback
          ) : (
            <span className="dk-cover-media__fallback-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                <rect
                  x="3.5"
                  y="5.5"
                  width="17"
                  height="13"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                <path
                  d="M4 16l4.5-4.5L12 15l3-3 4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </span>
      ) : null}

      {useScrim ? (
        <span className="dk-cover-media__scrim" aria-hidden="true" />
      ) : null}

      {hasOverlay ? (
        <div className="dk-cover-media__content">
          {overlayNodes.length > 0
            ? overlayNodes
            : overlay != null
              ? (
                  <div className="dk-cover-media__overlay">{overlay}</div>
                )
              : null}

          {(captionNodes.length > 0 ||
            caption != null ||
            metadataNodes.length > 0 ||
            metadata != null) && (
            <figcaption className="dk-cover-media__footer">
              {captionNodes.length > 0
                ? captionNodes
                : caption != null
                  ? (
                      <div className="dk-cover-media__caption">{caption}</div>
                    )
                  : null}
              {metadataNodes.length > 0
                ? metadataNodes
                : metadata != null
                  ? (
                      <div className="dk-cover-media__metadata">{metadata}</div>
                    )
                  : null}
            </figcaption>
          )}
        </div>
      ) : null}

      {otherNodes}
    </figure>
  );
}

const CoverMediaForward = React.forwardRef(CoverMediaRoot);
CoverMediaForward.displayName = "CoverMedia";

export const CoverMedia = Object.assign(CoverMediaForward, {
  Overlay: CoverMediaOverlay,
  Caption: CoverMediaCaption,
  Metadata: CoverMediaMetadata,
});

export default CoverMedia;
