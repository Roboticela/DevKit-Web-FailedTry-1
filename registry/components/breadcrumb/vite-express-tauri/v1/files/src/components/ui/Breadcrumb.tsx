import * as React from "react";

/**
 * Breadcrumb — hierarchical trail.
 * Compose with links; current page is plain text with aria-current.
 */

export type BreadcrumbItem = {
  id: string;
  label: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  current?: boolean;
};

export type BreadcrumbProps = {
  label?: string;
  items: BreadcrumbItem[];
  /** Max visible crumbs before collapsing middle. Default: 4. */
  maxItems?: number;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function Sep() {
  return (
    <span className="dk-breadcrumb__sep" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none">
        <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { label = "Breadcrumb", items, maxItems = 4, className = "", id },
  ref
) {
  const collapsed =
    items.length > maxItems
      ? [items[0]!, { id: "__ellipsis", label: "…", current: false }, ...items.slice(-(maxItems - 2))]
      : items;

  return (
    <nav ref={ref} id={id} className={cx("dk-breadcrumb", className)} aria-label={label}>
      <ol className="dk-breadcrumb__list">
        {collapsed.map((item, index) => {
          const isLast = index === collapsed.length - 1;
          const current = item.current || (isLast && item.id !== "__ellipsis");
          return (
            <li key={item.id} className="dk-breadcrumb__item">
              {index > 0 ? <Sep /> : null}
              {item.id === "__ellipsis" ? (
                <span className="dk-breadcrumb__ellipsis">{item.label}</span>
              ) : current || !item.href ? (
                <span className="dk-breadcrumb__current" aria-current={current ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <a className="dk-breadcrumb__link" href={item.href} onClick={item.onClick}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = "Breadcrumb";
export default Breadcrumb;
