import * as React from "react";

/**
 * Avatar Group — stacked/grouped faces with overflow count.
 * Compose registry `Avatar` children. Does not reimplement faces.
 */

export type AvatarGroupSize = 24 | 28 | 32 | 36 | 40 | 48 | 56 | 64;

export type AvatarGroupProps = {
  /** Accessible name for the group. */
  label: string;
  /** Max faces before +N overflow. Default: 4. */
  max?: number;
  size?: AvatarGroupSize;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup({ label, max = 4, size = 32, children, className = "", id }, ref) {
    const items = React.Children.toArray(children).filter(React.isValidElement);
    const visible = items.slice(0, max);
    const overflow = items.length - visible.length;

    return (
      <div
        ref={ref}
        id={id}
        className={cx("dk-avatar-group", className)}
        role="group"
        aria-label={label}
        style={{ ["--dk-avatar-group-size" as string]: `${size}px` }}
      >
        {visible.map((child, index) => (
          <span key={index} className="dk-avatar-group__item">
            {child}
          </span>
        ))}
        {overflow > 0 ? (
          <span className="dk-avatar-group__item">
            <span className="dk-avatar-group__overflow" aria-label={`${overflow} more`}>
              +{overflow}
            </span>
          </span>
        ) : null}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";
export default AvatarGroup;
