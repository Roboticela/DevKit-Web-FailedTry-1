import * as React from "react";

export type PaginationSize = "sm" | "md";

/**
 * - `auto` — compact under ~480px, expanded otherwise
 * - `expanded` — previous / numbers / next (with collapse)
 * - `compact` — Previous · Page X of N · Next
 */
export type PaginationLayout = "auto" | "expanded" | "compact";

export type PaginationItemType =
  | "page"
  | "ellipsis"
  | "previous"
  | "next"
  | "first"
  | "last";

export interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "onChange"> {
  /** Accessible name for the navigation landmark. Default: `Pagination`. */
  label?: string;
  /** 1-based current page. */
  page: number;
  /** Total number of pages (≥ 1). */
  pageCount: number;
  onPageChange: (page: number) => void;
  size?: PaginationSize;
  layout?: PaginationLayout;
  /** Show first/last controls. Default: false. */
  showFirstLast?: boolean;
  /**
   * Sibling pages on each side of the current page in expanded mode.
   * Default: 1.
   */
  siblingCount?: number;
  /**
   * Boundary pages always shown at each end when collapsing.
   * Default: 1.
   */
  boundaryCount?: number;
  previousLabel?: string;
  nextLabel?: string;
  firstLabel?: string;
  lastLabel?: string;
  /** Format for compact summary. Receives 1-based page and pageCount. */
  pageSummary?: (page: number, pageCount: number) => string;
  disabled?: boolean;
  /**
   * Optional page-size control rendered beside the pager (composition slot).
   * Pagination does not own page-size logic.
   */
  pageSizeControl?: React.ReactNode;
}

const SIZE_CLASS: Record<PaginationSize, string> = {
  sm: "dk-pagination--sm",
  md: "dk-pagination--md",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function preferCompact(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 479px)").matches;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Build an expanded page list with intelligent ellipses. */
export function getPaginationRange(options: {
  page: number;
  pageCount: number;
  siblingCount?: number;
  boundaryCount?: number;
}): Array<number | "ellipsis-start" | "ellipsis-end"> {
  const page = clamp(options.page, 1, Math.max(1, options.pageCount));
  const pageCount = Math.max(1, options.pageCount);
  const siblingCount = Math.max(0, options.siblingCount ?? 1);
  const boundaryCount = Math.max(1, options.boundaryCount ?? 1);

  const totalNumbers = siblingCount * 2 + boundaryCount * 2 + 3;
  // e.g. boundaries + siblings + current + 2 ellipsis slots
  if (pageCount <= totalNumbers) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const startPages = Array.from({ length: boundaryCount }, (_, i) => i + 1);
  const endPages = Array.from(
    { length: boundaryCount },
    (_, i) => pageCount - boundaryCount + 1 + i
  );

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, pageCount - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages[0]! - 2
  );

  const showStartEllipsis = siblingsStart > boundaryCount + 2;
  const showEndEllipsis = siblingsEnd < pageCount - boundaryCount - 1;

  if (!showStartEllipsis && showEndEllipsis) {
    const leftCount = boundaryCount + siblingCount * 2 + 2;
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...leftRange, "ellipsis-end", ...endPages];
  }

  if (showStartEllipsis && !showEndEllipsis) {
    const rightCount = boundaryCount + siblingCount * 2 + 2;
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => pageCount - rightCount + 1 + i
    );
    return [...startPages, "ellipsis-start", ...rightRange];
  }

  const middle = Array.from(
    { length: siblingsEnd - siblingsStart + 1 },
    (_, i) => siblingsStart + i
  );
  return [
    ...startPages,
    "ellipsis-start",
    ...middle,
    "ellipsis-end",
    ...endPages,
  ];
}

function ChevronPrev() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 3.5 5.5 8 10 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronNext() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 3.5 10.5 8 6 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronFirst() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.5 3.5 7 8l4.5 4.5M4.5 3.5v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLast() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.5 3.5 9 8l-4.5 4.5M11.5 3.5v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Pagination (ID 034) — navigate a finite multi-page collection.
 *
 * Previous/Next keep their semantic meaning in RTL; only chevrons mirror.
 * Current page is not color-alone. Compact layout preferred on narrow screens.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      label = "Pagination",
      page: pageProp,
      pageCount: pageCountProp,
      onPageChange,
      size = "md",
      layout = "auto",
      showFirstLast = false,
      siblingCount = 1,
      boundaryCount = 1,
      previousLabel = "Previous page",
      nextLabel = "Next page",
      firstLabel = "First page",
      lastLabel = "Last page",
      pageSummary = (p, total) => `Page ${p} of ${total}`,
      disabled = false,
      pageSizeControl,
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-pagination-${reactId}`;

    const pageCount = Math.max(1, Math.floor(pageCountProp) || 1);
    const page = clamp(Math.floor(pageProp) || 1, 1, pageCount);

    const [compact, setCompact] = React.useState(layout === "compact");

    React.useEffect(() => {
      if (layout === "compact") {
        setCompact(true);
        return;
      }
      if (layout === "expanded") {
        setCompact(false);
        return;
      }
      const sync = () => setCompact(preferCompact());
      sync();
      const mq = window.matchMedia("(max-width: 479px)");
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }, [layout]);

    const range = React.useMemo(
      () =>
        getPaginationRange({
          page,
          pageCount,
          siblingCount,
          boundaryCount,
        }),
      [page, pageCount, siblingCount, boundaryCount]
    );

    const go = (next: number) => {
      if (disabled) return;
      const clamped = clamp(next, 1, pageCount);
      if (clamped === page) return;
      onPageChange(clamped);
    };

    const atFirst = page <= 1;
    const atLast = page >= pageCount;

    const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
      if (disabled) return;
      const rtl =
        typeof document !== "undefined" &&
        (document.documentElement.dir === "rtl" ||
          getComputedStyle(event.currentTarget).direction === "rtl");

      // Arrow keys move page; semantic previous/next stay bound to page order,
      // while visual chevrons are mirrored in CSS for RTL.
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          go(page + (rtl ? 1 : -1));
          break;
        case "ArrowRight":
          event.preventDefault();
          go(page + (rtl ? -1 : 1));
          break;
        case "Home":
          event.preventDefault();
          go(1);
          break;
        case "End":
          event.preventDefault();
          go(pageCount);
          break;
        default:
          break;
      }
    };

    const renderNavButton = (options: {
      kind: "previous" | "next" | "first" | "last";
      ariaLabel: string;
      visibleLabel?: string;
      disabled: boolean;
      onClick: () => void;
      icon: React.ReactNode;
    }) => {
      const { kind, ariaLabel, visibleLabel, disabled: isDisabled, onClick, icon } =
        options;
      return (
        <li className="dk-pagination__item">
          <button
            type="button"
            className={cx(
              "dk-pagination__control",
              `dk-pagination__control--${kind}`,
              isDisabled && "dk-pagination__control--disabled"
            )}
            aria-label={ariaLabel}
            disabled={isDisabled || disabled}
            onClick={onClick}
          >
            <span
              className={cx(
                "dk-pagination__icon",
                (kind === "previous" || kind === "first") &&
                  "dk-pagination__icon--start",
                (kind === "next" || kind === "last") && "dk-pagination__icon--end"
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
            {visibleLabel ? (
              <span className="dk-pagination__control-label">{visibleLabel}</span>
            ) : null}
          </button>
        </li>
      );
    };

    return (
      <nav
        {...rest}
        ref={ref}
        id={rootId}
        className={cx(
          "dk-pagination",
          SIZE_CLASS[size],
          compact ? "dk-pagination--compact" : "dk-pagination--expanded",
          disabled && "dk-pagination--disabled",
          className
        )}
        aria-label={label}
        data-size={size}
        data-layout={compact ? "compact" : "expanded"}
        data-page={page}
        data-page-count={pageCount}
        data-disabled={disabled || undefined}
      >
        <div className="dk-pagination__row">
          <ul
            className="dk-pagination__list"
            onKeyDown={onListKeyDown}
          >
            {showFirstLast
              ? renderNavButton({
                  kind: "first",
                  ariaLabel: firstLabel,
                  disabled: atFirst,
                  onClick: () => go(1),
                  icon: <ChevronFirst />,
                })
              : null}

            {renderNavButton({
              kind: "previous",
              ariaLabel: previousLabel,
              visibleLabel: compact ? "Previous" : undefined,
              disabled: atFirst,
              onClick: () => go(page - 1),
              icon: <ChevronPrev />,
            })}

            {compact ? (
              <li className="dk-pagination__item dk-pagination__item--summary">
                <span className="dk-pagination__summary" aria-live="polite">
                  {pageSummary(page, pageCount)}
                </span>
              </li>
            ) : (
              range.map((entry, index) => {
                if (entry === "ellipsis-start" || entry === "ellipsis-end") {
                  return (
                    <li
                      key={`${entry}-${index}`}
                      className="dk-pagination__item dk-pagination__item--ellipsis"
                    >
                      <span className="dk-pagination__ellipsis" aria-hidden="true">
                        …
                      </span>
                      <span className="dk-pagination__sr-only">
                        Skipped pages
                      </span>
                    </li>
                  );
                }

                const isCurrent = entry === page;
                return (
                  <li key={entry} className="dk-pagination__item">
                    <button
                      type="button"
                      className={cx(
                        "dk-pagination__page",
                        isCurrent && "dk-pagination__page--current"
                      )}
                      aria-label={`Page ${entry}`}
                      aria-current={isCurrent ? "page" : undefined}
                      disabled={disabled}
                      onClick={() => go(entry)}
                    >
                      <span className="dk-pagination__page-hit" aria-hidden="true" />
                      {entry}
                    </button>
                  </li>
                );
              })
            )}

            {renderNavButton({
              kind: "next",
              ariaLabel: nextLabel,
              visibleLabel: compact ? "Next" : undefined,
              disabled: atLast,
              onClick: () => go(page + 1),
              icon: <ChevronNext />,
            })}

            {showFirstLast
              ? renderNavButton({
                  kind: "last",
                  ariaLabel: lastLabel,
                  disabled: atLast,
                  onClick: () => go(pageCount),
                  icon: <ChevronLast />,
                })
              : null}
          </ul>

          {pageSizeControl ? (
            <div className="dk-pagination__size">{pageSizeControl}</div>
          ) : null}
        </div>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;
