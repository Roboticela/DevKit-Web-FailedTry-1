import * as React from "react";

/**
 * Card — flexible surface for grouping related content.
 * Composable slots only; header / body / footer are optional.
 * Default uses the least visual treatment needed to establish grouping.
 */

export type CardVariant = "standard" | "compact" | "elevated" | "outlined";

/**
 * Layout of media vs text regions.
 * `responsive` — stacks on narrow viewports; horizontal from tablet up.
 */
export type CardOrientation = "vertical" | "horizontal" | "responsive";

export type CardProps = {
  variant?: CardVariant;
  /**
   * Opt-in interactivity. Enables hover / focus / pressed styles.
   * Do not set when the card only hosts independent nested actions
   * unless the interaction model is intentional (e.g. title link only).
   */
  interactive?: boolean;
  /** Selected / active grouping state. */
  selected?: boolean;
  disabled?: boolean;
  /**
   * Whole-card navigation. Renders as an anchor.
   * Avoid combining with nested buttons/links — prefer title href instead.
   */
  href?: string;
  target?: string;
  rel?: string;
  /**
   * Whole-card activation when interactive and no href.
   * Uses a non-button host so nested actions remain valid when present.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  orientation?: CardOrientation;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
} & Omit<
  React.HTMLAttributes<HTMLElement>,
  "onClick" | "children" | "className" | "id"
>;

export type CardMediaProps = {
  children?: React.ReactNode;
  /**
   * CSS aspect-ratio value, e.g. `"16 / 9"`, `"1"`, `"4 / 3"`.
   * Omit to let media size naturally.
   */
  aspectRatio?: string;
  /** Object-fit for replaced media inside. Default: cover. */
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Position within the crop box when using cover/contain. */
  position?: string;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "className">;

export type CardRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children?: React.ReactNode;
  as?: "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  /** Optional title-only link — preferred when the card has other actions. */
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function CardRoot(
  {
    variant = "standard",
    interactive = false,
    selected = false,
    disabled = false,
    href,
    target,
    rel,
    onClick,
    orientation = "vertical",
    children,
    className = "",
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    onKeyDown,
    ...rest
  }: CardProps,
  forwardedRef: React.ForwardedRef<HTMLElement>
) {
  const isLink = Boolean(href) && !disabled;
  const isPressable = interactive && !disabled && (isLink || onClick != null);
  const showInteractiveStyles = interactive && !disabled;

  const classNames = cx(
    "dk-card",
    `dk-card--${variant}`,
    `dk-card--${orientation}`,
    showInteractiveStyles && "dk-card--interactive",
    selected && "dk-card--selected",
    disabled && "dk-card--disabled",
    className
  );

  const sharedA11y = {
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-disabled": disabled || undefined,
    "aria-pressed":
      selected && showInteractiveStyles && !isLink ? true : undefined,
    "data-selected": selected ? "true" : undefined,
    "data-variant": variant,
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || isLink) return;
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(event as unknown as React.MouseEvent<HTMLElement>);
    }
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
        {...sharedA11y}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        onClick={
          disabled
            ? (e) => e.preventDefault()
            : (onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined)
        }
      >
        {children}
      </a>
    );
  }

  return (
    <div
      ref={forwardedRef as React.Ref<HTMLDivElement>}
      role={isPressable ? "button" : undefined}
      tabIndex={isPressable ? 0 : undefined}
      className={classNames}
      {...sharedA11y}
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      onClick={disabled ? undefined : onClick}
      onKeyDown={isPressable ? handleKeyDown : onKeyDown}
    >
      {children}
    </div>
  );
}

const CardForward = React.forwardRef(CardRoot);
CardForward.displayName = "Card";

function CardMedia({
  children,
  aspectRatio,
  fit = "cover",
  position = "center",
  className = "",
  style,
  ...rest
}: CardMediaProps) {
  return (
    <div
      className={cx("dk-card__media", className)}
      data-fit={fit}
      style={{
        ...(aspectRatio ? { aspectRatio } : null),
        ["--dk-card-media-fit" as string]: fit,
        ["--dk-card-media-position" as string]: position,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
CardMedia.displayName = "Card.Media";

function CardHeader({ className = "", children, ...rest }: CardRegionProps) {
  return (
    <div className={cx("dk-card__header", className)} {...rest}>
      {children}
    </div>
  );
}
CardHeader.displayName = "Card.Header";

function CardBody({ className = "", children, ...rest }: CardRegionProps) {
  return (
    <div className={cx("dk-card__body", className)} {...rest}>
      {children}
    </div>
  );
}
CardBody.displayName = "Card.Body";

function CardFooter({ className = "", children, ...rest }: CardRegionProps) {
  return (
    <div className={cx("dk-card__footer", className)} {...rest}>
      {children}
    </div>
  );
}
CardFooter.displayName = "Card.Footer";

function CardTitle({
  className = "",
  children,
  as: Tag = "h3",
  href,
  onClick,
  ...rest
}: CardTitleProps) {
  const content = href ? (
    <a
      className="dk-card__title-link"
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  ) : onClick ? (
    <button type="button" className="dk-card__title-link" onClick={onClick}>
      {children}
    </button>
  ) : (
    children
  );

  return (
    <Tag className={cx("dk-card__title", className)} {...rest}>
      {content}
    </Tag>
  );
}
CardTitle.displayName = "Card.Title";

function CardDescription({
  className = "",
  children,
  ...rest
}: CardRegionProps) {
  return (
    <div className={cx("dk-card__description", className)} {...rest}>
      {children}
    </div>
  );
}
CardDescription.displayName = "Card.Description";

function CardMetadata({ className = "", children, ...rest }: CardRegionProps) {
  return (
    <div className={cx("dk-card__metadata", className)} {...rest}>
      {children}
    </div>
  );
}
CardMetadata.displayName = "Card.Metadata";

function CardStatus({ className = "", children, ...rest }: CardRegionProps) {
  return (
    <div className={cx("dk-card__status", className)} {...rest}>
      {children}
    </div>
  );
}
CardStatus.displayName = "Card.Status";

function CardActions({ className = "", children, ...rest }: CardRegionProps) {
  return (
    <div className={cx("dk-card__actions", className)} {...rest}>
      {children}
    </div>
  );
}
CardActions.displayName = "Card.Actions";

function CardContent({ className = "", children, ...rest }: CardRegionProps) {
  return (
    <div className={cx("dk-card__content", className)} {...rest}>
      {children}
    </div>
  );
}
CardContent.displayName = "Card.Content";

export const Card = Object.assign(CardForward, {
  Media: CardMedia,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Title: CardTitle,
  Description: CardDescription,
  Metadata: CardMetadata,
  Status: CardStatus,
  Actions: CardActions,
  Content: CardContent,
});

export default Card;
