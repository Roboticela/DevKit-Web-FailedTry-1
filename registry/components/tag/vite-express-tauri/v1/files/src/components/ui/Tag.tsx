import * as React from "react";

/**
 * Tag — compact category / filter chip (not Label, not Badge).
 * Supports icon, count, dismiss, selected. No gradients. No box-shadows.
 */

export type TagSize = "sm" | "md";
export type TagTone = "neutral" | "accent" | "positive" | "warning" | "negative";

export type TagProps = {
  children: React.ReactNode;
  size?: TagSize;
  tone?: TagTone;
  icon?: React.ReactNode;
  count?: number;
  selected?: boolean;
  disabled?: boolean;
  /** Shows dismiss control. */
  removable?: boolean;
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  removeLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  className?: string;
  id?: string;
};

export type TagGroupProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Tag = React.forwardRef<HTMLElement, TagProps>(function Tag(
  {
    children,
    size = "md",
    tone = "neutral",
    icon,
    count,
    selected = false,
    disabled = false,
    removable = false,
    onRemove,
    removeLabel = "Remove",
    onClick,
    href,
    className = "",
    id,
  },
  ref
) {
  const interactive = (Boolean(onClick) || Boolean(href)) && !disabled;
  const classNames = cx(
    "dk-tag",
    `dk-tag--${size}`,
    `dk-tag--${tone}`,
    selected && "dk-tag--selected",
    disabled && "dk-tag--disabled",
    interactive && "dk-tag--interactive",
    className
  );

  const content = (
    <>
      {icon ? <span className="dk-tag__icon" aria-hidden="true">{icon}</span> : null}
      <span className="dk-tag__label">{children}</span>
      {typeof count === "number" ? <span className="dk-tag__count">{count}</span> : null}
      {removable ? (
        <button
          type="button"
          className="dk-tag__remove"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(e);
          }}
        >
          <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
            <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </>
  );

  if (href && !disabled) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} id={id} href={href} className={classNames} aria-pressed={selected || undefined}>
        {content}
      </a>
    );
  }

  if (interactive || removable) {
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        id={id}
        className={classNames}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-pressed={interactive ? selected : undefined}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
                }
              }
            : undefined
        }
      >
        {content}
      </span>
    );
  }

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} id={id} className={classNames}>
      {content}
    </span>
  );
});

Tag.displayName = "Tag";

export const TagGroup = React.forwardRef<HTMLDivElement, TagGroupProps>(function TagGroup(
  { label, children, className = "", id },
  ref
) {
  return (
    <div ref={ref} id={id} className={cx("dk-tag-group", className)} role="group" aria-label={label}>
      {children}
    </div>
  );
});

TagGroup.displayName = "Tag.Group";

export const TagNamespace = Object.assign(Tag, { Group: TagGroup });
export default TagNamespace;
