import * as React from "react";

/**
 * Media Preview — larger preview of visual/media content.
 * Not a lightbox, document editor, or complete media player.
 * Video shows poster + play affordance only. Actions compose DevKit controls.
 */

export type MediaPreviewKind =
  | "image"
  | "video"
  | "document"
  | "audio"
  | "generic";

export type MediaPreviewSize = "sm" | "md" | "lg";

export type MediaPreviewAspect =
  | "square"
  | "portrait"
  | "landscape"
  | "wide"
  | "custom";

export type MediaPreviewFit = "cover" | "contain";

export type MediaPreviewState = "loading" | "loaded" | "error" | "empty";

export type MediaPreviewProps = {
  src?: string;
  /**
   * Video poster / audio artwork URL when distinct from `src`.
   * For `kind="video"`, prefer `poster` for the still frame.
   */
  poster?: string;
  alt?: string;
  decorative?: boolean;
  kind?: MediaPreviewKind;
  size?: MediaPreviewSize;
  aspect?: MediaPreviewAspect;
  aspectRatio?: string;
  /**
   * Default: cover for image/video/audio; contain for document/generic.
   */
  objectFit?: MediaPreviewFit;
  objectPosition?: string;
  /** Controlled media state. Derived from src/loading/error when omitted. */
  state?: MediaPreviewState;
  loading?: boolean;
  error?: boolean;
  /** Optional info */
  title?: React.ReactNode;
  /** Media type label, e.g. MP4, PDF, PNG */
  type?: React.ReactNode;
  duration?: React.ReactNode;
  /** File size label, e.g. 2.4 MB */
  fileSize?: React.ReactNode;
  status?: React.ReactNode;
  /**
   * Action controls — compose DevKit `Button` / `IconButton`.
   * Do not invent custom action chrome here.
   */
  actions?: React.ReactNode;
  /**
   * Show a non-interactive play mark for video poster state.
   * Wire actual play via `actions` (IconButton) or `onOpen`.
   */
  showPlayMark?: boolean;
  /**
   * Whole-preview open/expand interaction (button or link).
   * Keep separate from action IconButtons — do not nest buttons.
   */
  interactive?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  onOpen?: (event: React.SyntheticEvent) => void;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

export type MediaPreviewRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

const ASPECT_RATIO: Record<Exclude<MediaPreviewAspect, "custom">, string> = {
  square: "1",
  portrait: "3 / 4",
  landscape: "4 / 3",
  wide: "16 / 9",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function defaultFit(
  kind: MediaPreviewKind,
  fit?: MediaPreviewFit
): MediaPreviewFit {
  if (fit) return fit;
  if (kind === "document" || kind === "generic") return "contain";
  return "cover";
}

function defaultAspect(kind: MediaPreviewKind): MediaPreviewAspect {
  if (kind === "audio") return "square";
  if (kind === "document") return "portrait";
  if (kind === "video") return "wide";
  return "landscape";
}

function KindGlyph({ kind }: { kind: MediaPreviewKind }) {
  const common = {
    viewBox: "0 0 48 48",
    width: "2.5rem",
    height: "2.5rem",
    fill: "none" as const,
    "aria-hidden": true as const,
  };
  if (kind === "video") {
    return (
      <svg {...common}>
        <rect
          x="6"
          y="12"
          width="36"
          height="24"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M20 18v12l12-6-12-6z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "document") {
    return (
      <svg {...common}>
        <path
          d="M14 6h14l10 10v24a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M28 6v10h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M18 24h12M18 30h12M18 36h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "audio") {
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="24" r="5" fill="currentColor" />
        <path
          d="M24 8v4M24 36v4M8 24h4M36 24h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "generic") {
    return (
      <svg {...common}>
        <rect
          x="8"
          y="10"
          width="32"
          height="28"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 30l8-7 6 5 5-4 13 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect
        x="8"
        y="10"
        width="32"
        height="28"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="18" cy="20" r="3" fill="currentColor" />
      <path
        d="M8 32l9-8 6 5 5-4 12 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="#fff" />
    </svg>
  );
}

function displayNameOf(child: React.ReactElement): string | undefined {
  return (child.type as { displayName?: string })?.displayName;
}

function MediaPreviewActions({
  className = "",
  children,
  ...rest
}: MediaPreviewRegionProps) {
  return (
    <div
      className={cx("dk-media-preview__actions", className)}
      data-dk-media-preview-actions=""
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      {...rest}
    >
      {children}
    </div>
  );
}
MediaPreviewActions.displayName = "MediaPreview.Actions";

function MediaPreviewInfo({
  className = "",
  children,
  ...rest
}: MediaPreviewRegionProps) {
  return (
    <div className={cx("dk-media-preview__info", className)} {...rest}>
      {children}
    </div>
  );
}
MediaPreviewInfo.displayName = "MediaPreview.Info";

function MediaPreviewRoot(
  {
    src,
    poster,
    alt = "",
    decorative = false,
    kind = "image",
    size = "md",
    aspect: aspectProp,
    aspectRatio: aspectRatioProp,
    objectFit: objectFitProp,
    objectPosition = "center",
    state: stateProp,
    loading = false,
    error = false,
    title,
    type,
    duration,
    fileSize,
    status,
    actions,
    showPlayMark,
    interactive = false,
    href,
    target,
    rel,
    onOpen,
    fallback,
    children,
    className = "",
    id,
    "aria-label": ariaLabel,
  }: MediaPreviewProps,
  forwardedRef: React.ForwardedRef<HTMLElement>
) {
  const [imgError, setImgError] = React.useState(false);
  const aspect = aspectProp ?? defaultAspect(kind);
  const objectFit = defaultFit(kind, objectFitProp);
  const mediaSrc = kind === "video" ? poster || src : src || poster;

  React.useEffect(() => {
    setImgError(false);
  }, [mediaSrc]);

  const derivedEmpty = !mediaSrc && !loading && !error;
  const failed = error || imgError;
  const resolvedState: MediaPreviewState =
    stateProp ??
    (loading
      ? "loading"
      : failed
        ? "error"
        : derivedEmpty
          ? "empty"
          : "loaded");

  const ratio =
    aspect === "custom"
      ? aspectRatioProp ?? "16 / 9"
      : aspectRatioProp ?? ASPECT_RATIO[aspect];

  const actionNodes: React.ReactNode[] = [];
  const infoNodes: React.ReactNode[] = [];
  const otherNodes: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      otherNodes.push(child);
      return;
    }
    const name = displayNameOf(child);
    if (name === "MediaPreview.Actions") actionNodes.push(child);
    else if (name === "MediaPreview.Info") infoNodes.push(child);
    else otherNodes.push(child);
  });

  const hasActions = actionNodes.length > 0 || actions != null;
  const hasInfo =
    infoNodes.length > 0 ||
    title != null ||
    type != null ||
    duration != null ||
    fileSize != null ||
    status != null;

  const playMark =
    showPlayMark ?? (kind === "video" && resolvedState === "loaded");

  const isInteractive =
    !loading &&
    resolvedState !== "empty" &&
    (interactive || href != null || onOpen != null);
  const isLink = Boolean(href) && isInteractive;
  /* Split when action buttons exist — host must not be a button wrapping buttons */
  const splitActions = hasActions && isInteractive;

  const accessibleName =
    ariaLabel ||
    (typeof title === "string" ? title : undefined) ||
    (decorative ? undefined : alt) ||
    (kind !== "image" ? `${kind} preview` : "Media preview");

  const activate = (event: React.SyntheticEvent) => {
    onOpen?.(event);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!isInteractive || isLink || splitActions) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(event);
    }
  };

  const surfaceStyle: React.CSSProperties = {
    aspectRatio: ratio,
    ["--dk-mp-fit" as string]: objectFit,
    ["--dk-mp-position" as string]: objectPosition,
  };

  const media =
    resolvedState === "loaded" && mediaSrc && !failed ? (
      <img
        className="dk-media-preview__media"
        src={mediaSrc}
        alt={decorative || isInteractive ? "" : alt}
        draggable={false}
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
      />
    ) : (
      <span className="dk-media-preview__fallback" aria-hidden="true">
        {fallback ?? <KindGlyph kind={kind} />}
      </span>
    );

  const surface = (
    <div className="dk-media-preview__surface" style={surfaceStyle}>
      {media}
      {resolvedState === "loading" ? (
        <span className="dk-media-preview__loading" aria-hidden="true" />
      ) : null}
      {playMark && resolvedState === "loaded" ? (
        <span className="dk-media-preview__play" aria-hidden="true">
          <PlayMark />
        </span>
      ) : null}
    </div>
  );

  const infoBlock =
    infoNodes.length > 0 ? (
      infoNodes
    ) : hasInfo ? (
      <div className="dk-media-preview__info">
        {title != null ? (
          <div className="dk-media-preview__title">{title}</div>
        ) : null}
        <div className="dk-media-preview__meta">
          {type != null ? (
            <span className="dk-media-preview__type">{type}</span>
          ) : null}
          {duration != null ? (
            <span className="dk-media-preview__duration">{duration}</span>
          ) : null}
          {fileSize != null ? (
            <span className="dk-media-preview__size">{fileSize}</span>
          ) : null}
          {status != null ? (
            <span className="dk-media-preview__status">{status}</span>
          ) : null}
        </div>
      </div>
    ) : null;

  const actionsBlock =
    actionNodes.length > 0
      ? actionNodes
      : actions != null
        ? (
            <div
              className="dk-media-preview__actions"
              data-dk-media-preview-actions=""
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {actions}
            </div>
          )
        : null;

  const footer =
    infoBlock || actionsBlock ? (
      <div className="dk-media-preview__footer">
        {infoBlock}
        {actionsBlock}
      </div>
    ) : null;

  const classNames = cx(
    "dk-media-preview",
    `dk-media-preview--${size}`,
    `dk-media-preview--${kind}`,
    `dk-media-preview--${aspect}`,
    `dk-media-preview--state-${resolvedState}`,
    isInteractive && "dk-media-preview--interactive",
    splitActions && "dk-media-preview--split",
    className
  );

  const mediaRegion =
    isInteractive && splitActions ? (
      <button
        type="button"
        className="dk-media-preview__open"
        aria-label={accessibleName}
        onClick={activate}
      >
        {surface}
      </button>
    ) : (
      surface
    );

  const content = (
    <>
      {mediaRegion}
      {footer}
      {otherNodes}
    </>
  );

  if (isLink && !splitActions) {
    const linkRel =
      rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);
    return (
      <a
        ref={forwardedRef as React.Ref<HTMLAnchorElement>}
        id={id}
        href={href}
        target={target}
        rel={linkRel}
        className={classNames}
        aria-label={accessibleName}
        onClick={activate}
      >
        {content}
      </a>
    );
  }

  if (isInteractive && !splitActions) {
    return (
      <div
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        id={id}
        role="button"
        tabIndex={0}
        className={classNames}
        aria-label={accessibleName}
        onClick={activate}
        onKeyDown={onKeyDown}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      ref={forwardedRef as React.Ref<HTMLDivElement>}
      id={id}
      className={classNames}
      role={decorative ? "presentation" : undefined}
      aria-label={
        decorative || splitActions ? undefined : accessibleName
      }
      aria-busy={resolvedState === "loading" || undefined}
    >
      {content}
    </div>
  );
}

const MediaPreviewForward = React.forwardRef(MediaPreviewRoot);
MediaPreviewForward.displayName = "MediaPreview";

export const MediaPreview = Object.assign(MediaPreviewForward, {
  Actions: MediaPreviewActions,
  Info: MediaPreviewInfo,
});

export default MediaPreview;
