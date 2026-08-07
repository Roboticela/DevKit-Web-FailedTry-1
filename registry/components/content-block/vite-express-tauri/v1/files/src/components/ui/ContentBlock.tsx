import * as React from "react";

/**
 * Content Block — neutral structural grouping without card-like chrome.
 * Establishes spacing, hierarchy, alignment, and grouping.
 * No automatic background, border, shadow, or large radius.
 * Visually lighter than Card. Compose actions with DevKit Interaction Controls.
 */

export type ContentBlockDensity = "compact" | "standard" | "spacious";

/**
 * Header layout: heading (+ description) with optional actions.
 * `responsive` stacks actions below on narrow screens.
 */
export type ContentBlockHeaderLayout = "stacked" | "inline" | "responsive";

export type ContentBlockProps = {
  density?: ContentBlockDensity;
  headerLayout?: ContentBlockHeaderLayout;
  /** Optional heading. */
  heading?: React.ReactNode;
  /** Supporting text under / beside the heading. */
  description?: React.ReactNode;
  /** Supporting metadata (quieter than description). */
  metadata?: React.ReactNode;
  /** Compose DevKit Button / IconButton / LinkButton — not custom controls. */
  actions?: React.ReactNode;
  /** Main content. Also accepts children. */
  content?: React.ReactNode;
  /** Show a subtle Divider under the header region. */
  divider?: boolean;
  /**
   * Heading level for semantics. Visual size follows density, not the level.
   * Default: h2.
   */
  headingAs?: "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p";
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export type ContentBlockRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export type ContentBlockHeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children?: React.ReactNode;
  as?: "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p";
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function displayNameOf(child: React.ReactElement): string | undefined {
  return (child.type as { displayName?: string })?.displayName;
}

const ContentBlockRoot = React.forwardRef<HTMLElement, ContentBlockProps>(
  function ContentBlock(
    {
      density = "standard",
      headerLayout = "responsive",
      heading,
      description,
      metadata,
      actions,
      content,
      divider = false,
      headingAs = "h2",
      children,
      className = "",
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const rootId = id ?? `dk-content-block-${reactId}`;
    const headingId = `${rootId}-heading`;

    const headingNodes: React.ReactNode[] = [];
    const descriptionNodes: React.ReactNode[] = [];
    const metadataNodes: React.ReactNode[] = [];
    const actionNodes: React.ReactNode[] = [];
    const contentNodes: React.ReactNode[] = [];
    const otherNodes: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        otherNodes.push(child);
        return;
      }
      const name = displayNameOf(child);
      if (name === "ContentBlock.Heading") headingNodes.push(child);
      else if (name === "ContentBlock.Description") descriptionNodes.push(child);
      else if (name === "ContentBlock.Metadata") metadataNodes.push(child);
      else if (name === "ContentBlock.Actions") actionNodes.push(child);
      else if (name === "ContentBlock.Content") contentNodes.push(child);
      else if (name === "ContentBlock.Header") {
        // Header is a grouping slot — expand into header region later
        otherNodes.push(child);
      } else otherNodes.push(child);
    });

    const hasHeading =
      headingNodes.length > 0 || heading != null;
    const hasDescription =
      descriptionNodes.length > 0 || description != null;
    const hasMetadata = metadataNodes.length > 0 || metadata != null;
    const hasActions = actionNodes.length > 0 || actions != null;
    const hasHeader = hasHeading || hasDescription || hasMetadata || hasActions;

    const bodyContent =
      contentNodes.length > 0
        ? contentNodes
        : content != null
          ? <div className="dk-content-block__body">{content}</div>
          : otherNodes.length > 0
            ? <div className="dk-content-block__body">{otherNodes}</div>
            : null;

    const HeadingTag = headingAs;

    return (
      <section
        ref={forwardedRef as React.Ref<HTMLElement>}
        id={rootId}
        className={cx(
          "dk-content-block",
          `dk-content-block--${density}`,
          `dk-content-block--header-${headerLayout}`,
          className
        )}
        aria-label={ariaLabel}
        aria-labelledby={
          ariaLabelledBy ?? (hasHeading && heading != null ? headingId : undefined)
        }
        data-density={density}
      >
        {hasHeader ? (
          <div className="dk-content-block__header">
            <div className="dk-content-block__intro">
              {headingNodes.length > 0 ? (
                headingNodes
              ) : heading != null ? (
                <HeadingTag
                  id={headingId}
                  className="dk-content-block__heading"
                >
                  {heading}
                </HeadingTag>
              ) : null}

              {descriptionNodes.length > 0 ? (
                descriptionNodes
              ) : description != null ? (
                <div className="dk-content-block__description">{description}</div>
              ) : null}

              {metadataNodes.length > 0 ? (
                metadataNodes
              ) : metadata != null ? (
                <div className="dk-content-block__metadata">{metadata}</div>
              ) : null}
            </div>

            {actionNodes.length > 0 ? (
              actionNodes
            ) : actions != null ? (
              <div className="dk-content-block__actions">{actions}</div>
            ) : null}
          </div>
        ) : null}

        {divider && hasHeader ? (
          <hr className="dk-content-block__divider" aria-hidden="true" />
        ) : null}

        {bodyContent}
      </section>
    );
  }
);

ContentBlockRoot.displayName = "ContentBlock";

function ContentBlockHeading({
  className = "",
  children,
  as: Tag = "h2",
  ...rest
}: ContentBlockHeadingProps) {
  return (
    <Tag className={cx("dk-content-block__heading", className)} {...rest}>
      {children}
    </Tag>
  );
}
ContentBlockHeading.displayName = "ContentBlock.Heading";

function ContentBlockDescription({
  className = "",
  children,
  ...rest
}: ContentBlockRegionProps) {
  return (
    <div className={cx("dk-content-block__description", className)} {...rest}>
      {children}
    </div>
  );
}
ContentBlockDescription.displayName = "ContentBlock.Description";

function ContentBlockMetadata({
  className = "",
  children,
  ...rest
}: ContentBlockRegionProps) {
  return (
    <div className={cx("dk-content-block__metadata", className)} {...rest}>
      {children}
    </div>
  );
}
ContentBlockMetadata.displayName = "ContentBlock.Metadata";

function ContentBlockActions({
  className = "",
  children,
  ...rest
}: ContentBlockRegionProps) {
  return (
    <div className={cx("dk-content-block__actions", className)} {...rest}>
      {children}
    </div>
  );
}
ContentBlockActions.displayName = "ContentBlock.Actions";

function ContentBlockContent({
  className = "",
  children,
  ...rest
}: ContentBlockRegionProps) {
  return (
    <div className={cx("dk-content-block__body", className)} {...rest}>
      {children}
    </div>
  );
}
ContentBlockContent.displayName = "ContentBlock.Content";

function ContentBlockHeader({
  className = "",
  children,
  ...rest
}: ContentBlockRegionProps) {
  return (
    <div className={cx("dk-content-block__header", className)} {...rest}>
      {children}
    </div>
  );
}
ContentBlockHeader.displayName = "ContentBlock.Header";

export const ContentBlock = Object.assign(ContentBlockRoot, {
  Heading: ContentBlockHeading,
  Description: ContentBlockDescription,
  Metadata: ContentBlockMetadata,
  Actions: ContentBlockActions,
  Content: ContentBlockContent,
  Header: ContentBlockHeader,
});

export default ContentBlock;
