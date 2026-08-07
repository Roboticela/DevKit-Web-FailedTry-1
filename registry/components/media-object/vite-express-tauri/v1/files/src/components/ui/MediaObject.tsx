import * as React from "react";

/**
 * Media Object — media with adjacent textual content.
 * Regions: media · body (title / description / metadata / status) · trailing.
 * Media keeps predictable dimensions; body min-width:0 so text never collapses.
 * Whole-object interactivity only when trailing has no independent controls.
 */

export type MediaObjectDensity = "compact" | "comfortable" | "spacious";

export type MediaObjectAlign = "start" | "center";

export type MediaObjectMediaPosition = "leading" | "trailing";

/**
 * Predictable media region size — maps to global control-height tokens.
 * Does not invent arbitrary pixel values.
 */
export type MediaObjectMediaSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Layout: horizontal on wide viewports; `auto` stacks when the container is narrow.
 */
export type MediaObjectLayout = "auto" | "horizontal" | "stack";

export type MediaObjectProps = {
  density?: MediaObjectDensity;
  /**
   * Cross-axis alignment for the horizontal layout.
   * Default `start` keeps multi-line bodies balanced with media.
   */
  align?: MediaObjectAlign;
  mediaPosition?: MediaObjectMediaPosition;
  /** Fixed media region size. Default `md`. */
  mediaSize?: MediaObjectMediaSize;
  layout?: MediaObjectLayout;
  /**
   * Whole-object interactivity. Use with `href` or `onActivate`.
   * When trailing has independent actions, set `hasTrailingActions`
   * and put navigation on `MediaObject.Title` instead.
   */
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  onActivate?: (event: React.SyntheticEvent) => void;
  /**
   * Trailing region has independent controls.
   * Host will not be a single button/link.
   */
  hasTrailingActions?: boolean;
  /** Leading/trailing media slot (Avatar, Thumbnail, Image, icon, …). */
  media?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  metadata?: React.ReactNode;
  status?: React.ReactNode;
  /** Trailing actions / extras (IconButton, Badge, …). */
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

export type MediaObjectRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export type MediaObjectTitleProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  as?: "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type HostProps = MediaObjectProps &
  Omit<
    React.HTMLAttributes<HTMLElement>,
    "children" | "className" | "id" | "onClick" | "title"
  > & {
    children: React.ReactNode;
  };

const MediaObjectHost = React.forwardRef<HTMLElement, HostProps>(
  function MediaObjectHost(
    {
      density = "comfortable",
      align = "start",
      mediaPosition = "leading",
      mediaSize = "md",
      layout = "auto",
      interactive = false,
      selected = false,
      disabled = false,
      href,
      target,
      rel,
      onActivate,
      hasTrailingActions = false,
      children,
      className = "",
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      onKeyDown,
      media: _media,
      title: _title,
      description: _description,
      metadata: _metadata,
      status: _status,
      trailing: _trailing,
      ...rest
    },
    forwardedRef
  ) {
    void _media;
    void _title;
    void _description;
    void _metadata;
    void _status;
    void _trailing;

    const wholeInteractive =
      interactive &&
      !disabled &&
      !hasTrailingActions &&
      (href != null || onActivate != null);
    const isLink = Boolean(href) && !disabled && !hasTrailingActions;

    const classNames = cx(
      "dk-media-object",
      `dk-media-object--${density}`,
      `dk-media-object--align-${align}`,
      `dk-media-object--media-${mediaPosition}`,
      `dk-media-object--media-size-${mediaSize}`,
      `dk-media-object--layout-${layout}`,
      interactive && !disabled && "dk-media-object--interactive",
      wholeInteractive && "dk-media-object--pressable",
      hasTrailingActions && "dk-media-object--split",
      selected && "dk-media-object--selected",
      disabled && "dk-media-object--disabled",
      className
    );

    const activate = (event: React.SyntheticEvent) => {
      if (disabled) return;
      onActivate?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled || !wholeInteractive || isLink) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate(event);
      }
    };

    const a11y = {
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-disabled": disabled || undefined,
      "data-selected": selected ? "true" : undefined,
    };

    if (isLink) {
      const linkRel =
        rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);
      return (
        <a
          ref={forwardedRef as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={linkRel}
          className={classNames}
          {...a11y}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          onClick={disabled ? (e) => e.preventDefault() : (e) => activate(e)}
        >
          {children}
        </a>
      );
    }

    return (
      <div
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        role={wholeInteractive ? "button" : undefined}
        tabIndex={wholeInteractive ? 0 : undefined}
        className={classNames}
        {...a11y}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
        onClick={wholeInteractive ? (e) => activate(e) : undefined}
        onKeyDown={wholeInteractive ? handleKeyDown : onKeyDown}
      >
        {children}
      </div>
    );
  }
);
MediaObjectHost.displayName = "MediaObjectHost";

function MediaObjectMedia({ className = "", children, ...rest }: MediaObjectRegionProps) {
  return (
    <div className={cx("dk-media-object__media", className)} {...rest}>
      {children}
    </div>
  );
}
MediaObjectMedia.displayName = "MediaObject.Media";

function MediaObjectBody({ className = "", children, ...rest }: MediaObjectRegionProps) {
  return (
    <div className={cx("dk-media-object__body", className)} {...rest}>
      {children}
    </div>
  );
}
MediaObjectBody.displayName = "MediaObject.Body";

function MediaObjectTrailing({
  className = "",
  children,
  ...rest
}: MediaObjectRegionProps) {
  return (
    <div
      className={cx("dk-media-object__trailing", className)}
      data-dk-media-object-trailing=""
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      {...rest}
    >
      {children}
    </div>
  );
}
MediaObjectTrailing.displayName = "MediaObject.Trailing";

function MediaObjectTitle({
  className = "",
  children,
  as: Tag = "div",
  href,
  onClick,
  ...rest
}: MediaObjectTitleProps) {
  const inner =
    href != null ? (
      <a className="dk-media-object__title-link" href={href} onClick={onClick}>
        {children}
      </a>
    ) : onClick != null ? (
      <button
        type="button"
        className="dk-media-object__title-link"
        onClick={onClick}
      >
        {children}
      </button>
    ) : (
      children
    );

  return (
    <Tag className={cx("dk-media-object__title", className)} {...rest}>
      {inner}
    </Tag>
  );
}
MediaObjectTitle.displayName = "MediaObject.Title";

function MediaObjectDescription({
  className = "",
  children,
  ...rest
}: MediaObjectRegionProps) {
  return (
    <div className={cx("dk-media-object__description", className)} {...rest}>
      {children}
    </div>
  );
}
MediaObjectDescription.displayName = "MediaObject.Description";

function MediaObjectMetadata({
  className = "",
  children,
  ...rest
}: MediaObjectRegionProps) {
  return (
    <div className={cx("dk-media-object__metadata", className)} {...rest}>
      {children}
    </div>
  );
}
MediaObjectMetadata.displayName = "MediaObject.Metadata";

function MediaObjectStatus({
  className = "",
  children,
  ...rest
}: MediaObjectRegionProps) {
  return (
    <div className={cx("dk-media-object__status", className)} {...rest}>
      {children}
    </div>
  );
}
MediaObjectStatus.displayName = "MediaObject.Status";

function MediaObjectActions({
  className = "",
  children,
  ...rest
}: MediaObjectRegionProps) {
  return (
    <div className={cx("dk-media-object__actions", className)} {...rest}>
      {children}
    </div>
  );
}
MediaObjectActions.displayName = "MediaObject.Actions";

function displayNameOf(child: React.ReactElement): string | undefined {
  return (child.type as { displayName?: string })?.displayName;
}

function MediaObjectRoot(
  props: MediaObjectProps &
    Omit<
      React.HTMLAttributes<HTMLElement>,
      "children" | "className" | "id" | "onClick" | "title"
    >,
  forwardedRef: React.ForwardedRef<HTMLElement>
) {
  const {
    media,
    title,
    description,
    metadata,
    status,
    trailing,
    children,
    hasTrailingActions,
    interactive,
    ...rest
  } = props;

  const mediaNodes: React.ReactNode[] = [];
  const trailingNodes: React.ReactNode[] = [];
  const bodyNodes: React.ReactNode[] = [];
  let hasCompoundBody = false;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      bodyNodes.push(child);
      return;
    }
    const name = displayNameOf(child);
    if (name === "MediaObject.Media") mediaNodes.push(child);
    else if (name === "MediaObject.Trailing") trailingNodes.push(child);
    else if (name === "MediaObject.Body") {
      hasCompoundBody = true;
      bodyNodes.push(child);
    } else bodyNodes.push(child);
  });

  const hasCompoundTrailing = trailingNodes.length > 0;
  const hasPropTrailing = trailing != null;
  const split =
    hasTrailingActions ??
    ((hasCompoundTrailing || hasPropTrailing) && interactive === true);

  const resolvedMedia =
    mediaNodes.length > 0
      ? mediaNodes
      : media != null
        ? (
            <div className="dk-media-object__media">{media}</div>
          )
        : null;

  const resolvedBody = hasCompoundBody ? (
    bodyNodes
  ) : (
    <div className="dk-media-object__body">
      {title != null ? (
        <div className="dk-media-object__title">{title}</div>
      ) : null}
      {description != null ? (
        <div className="dk-media-object__description">{description}</div>
      ) : null}
      {metadata != null ? (
        <div className="dk-media-object__metadata">{metadata}</div>
      ) : null}
      {status != null ? (
        <div className="dk-media-object__status">{status}</div>
      ) : null}
      {bodyNodes}
    </div>
  );

  const resolvedTrailing = hasCompoundTrailing
    ? trailingNodes
    : trailing != null
      ? (
          <div
            className="dk-media-object__trailing"
            data-dk-media-object-trailing=""
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {trailing}
          </div>
        )
      : null;

  return (
    <MediaObjectHost
      ref={forwardedRef}
      interactive={interactive}
      hasTrailingActions={Boolean(split)}
      {...rest}
    >
      {resolvedMedia}
      {resolvedBody}
      {resolvedTrailing}
    </MediaObjectHost>
  );
}

const MediaObjectForward = React.forwardRef(MediaObjectRoot);
MediaObjectForward.displayName = "MediaObject";

export const MediaObject = Object.assign(MediaObjectForward, {
  Media: MediaObjectMedia,
  Body: MediaObjectBody,
  Trailing: MediaObjectTrailing,
  Title: MediaObjectTitle,
  Description: MediaObjectDescription,
  Metadata: MediaObjectMetadata,
  Status: MediaObjectStatus,
  Actions: MediaObjectActions,
});

export default MediaObject;
