import * as React from "react";

export type AnchorNavigationOrientation = "horizontal" | "vertical" | "auto";

/**
 * Overflow when anchors do not fit:
 * - `scroll` — scroll the list (preferred on compact horizontal mobile)
 * - `wrap` — wrap to additional lines (vertical stacks ignore this)
 */
export type AnchorNavigationOverflow = "scroll" | "wrap";

export type AnchorNavigationSize = "sm" | "md";

export interface AnchorNavigationItem {
  /** Section element id (without `#`). */
  id: string;
  /** Visible label. */
  label: string;
  /**
   * Destination hash. Defaults to `#${id}`.
   * Prefer real in-page anchors — do not replace with JS-only navigation.
   */
  href?: string;
  disabled?: boolean;
}

export interface AnchorNavigationProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "children" | "defaultValue" | "onChange"
  > {
  /** Accessible name for the navigation landmark. */
  label: string;
  items: AnchorNavigationItem[];
  orientation?: AnchorNavigationOrientation;
  size?: AnchorNavigationSize;
  /** Stick to the start edge of the scrollport. */
  sticky?: boolean;
  /**
   * Update the active item from scroll position (IntersectionObserver).
   * Default: true.
   */
  scrollSync?: boolean;
  /**
   * Enhance click scrolling with `scrollIntoView`.
   * Still uses real `href` anchors; respects `prefers-reduced-motion`.
   * Default: true.
   */
  smoothScroll?: boolean;
  /**
   * Offset reserved for this (or other) sticky chrome so section targets
   * are not hidden. Applied as `--dk-anchor-nav-offset` and used for
   * scroll margin when enhancing navigation. Default: auto-measured when sticky.
   */
  scrollMargin?: number;
  /**
   * Scroll root for sync / smooth scroll. Defaults to the viewport.
   * Pass a scrollable container element when content is not window-scrolled.
   */
  scrollRoot?: Element | null;
  overflow?: AnchorNavigationOverflow;
  /** Controlled active section id. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const SIZE_CLASS: Record<AnchorNavigationSize, string> = {
  sm: "dk-anchor-nav--sm",
  md: "dk-anchor-nav--md",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function preferVerticalOrientation(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 768px)").matches;
}

function resolveHref(item: AnchorNavigationItem): string {
  if (item.href) return item.href;
  return `#${item.id}`;
}

function sectionIdFromHref(href: string): string | null {
  if (!href.startsWith("#") || href.length < 2) return null;
  try {
    return decodeURIComponent(href.slice(1));
  } catch {
    return href.slice(1);
  }
}

/**
 * Anchor Navigation (ID 039) — in-page section wayfinding.
 *
 * Uses real `<a href="#…">` links. Scroll sync and smooth scrolling are
 * progressive enhancements and respect reduced-motion preferences.
 */
export const AnchorNavigation = React.forwardRef<
  HTMLElement,
  AnchorNavigationProps
>(function AnchorNavigation(
  {
    label,
    items,
    orientation = "auto",
    size = "md",
    sticky = false,
    scrollSync = true,
    smoothScroll = true,
    scrollMargin: scrollMarginProp,
    scrollRoot = null,
    overflow = "scroll",
    value: valueProp,
    defaultValue = null,
    onValueChange,
    disabled = false,
    className,
    id: idProp,
    style,
    ...rest
  },
  ref
) {
  const reactId = React.useId();
  const rootId = idProp ?? `dk-anchor-nav-${reactId}`;
  const navRef = React.useRef<HTMLElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const setRefs = React.useCallback(
    (node: HTMLElement | null) => {
      navRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [ref]
  );

  const [autoVertical, setAutoVertical] = React.useState(
    orientation === "vertical" || (orientation === "auto" && false)
  );

  React.useEffect(() => {
    if (orientation !== "auto") {
      setAutoVertical(orientation === "vertical");
      return;
    }
    const sync = () => setAutoVertical(preferVerticalOrientation());
    sync();
    const mq = window.matchMedia("(min-width: 768px)");
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [orientation]);

  const resolvedOrientation: "horizontal" | "vertical" =
    orientation === "auto"
      ? autoVertical
        ? "vertical"
        : "horizontal"
      : orientation;

  const [measuredOffset, setMeasuredOffset] = React.useState(0);

  React.useLayoutEffect(() => {
    if (scrollMarginProp != null) {
      setMeasuredOffset(scrollMarginProp);
      return;
    }
    if (!sticky || !navRef.current) {
      setMeasuredOffset(0);
      return;
    }
    const el = navRef.current;
    const update = () => setMeasuredOffset(Math.ceil(el.getBoundingClientRect().height));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sticky, scrollMarginProp, resolvedOrientation, size, items.length]);

  const scrollMargin = scrollMarginProp ?? measuredOffset;

  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<string | null>(
    defaultValue
  );
  const active = isControlled ? valueProp ?? null : uncontrolled;

  const commit = React.useCallback(
    (id: string) => {
      if (disabled) return;
      if (!isControlled) setUncontrolled(id);
      onValueChange?.(id);
    },
    [disabled, isControlled, onValueChange]
  );

  /* Scroll → active sync */
  React.useEffect(() => {
    if (!scrollSync || disabled || items.length === 0) return;
    if (typeof IntersectionObserver === "undefined") return;

    const ratios = new Map<string, number>();
    let frame = 0;

    const pickActive = () => {
      frame = 0;
      let bestId: string | null = null;
      let bestRatio = 0;
      for (const item of items) {
        if (item.disabled) continue;
        const ratio = ratios.get(item.id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = item.id;
        }
      }
      if (bestId) commit(bestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (!id) continue;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        if (!frame) frame = requestAnimationFrame(pickActive);
      },
      {
        root: scrollRoot,
        /* Bias toward the band just below sticky chrome */
        rootMargin: `-${Math.max(scrollMargin, 0) + 8}px 0px -45% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const item of items) {
      if (item.disabled) continue;
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [scrollSync, disabled, items, scrollRoot, scrollMargin, commit]);

  /* Keep active anchor visible in overflowing lists */
  React.useEffect(() => {
    if (!active || !listRef.current) return;
    const safe =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(active)
        : active.replace(/"/g, '\\"');
    const link = listRef.current.querySelector<HTMLElement>(
      `[data-anchor-id="${safe}"]`
    );
    if (!link) return;
    link.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [active, resolvedOrientation]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const reduced = prefersReducedMotion();
    if (!smoothScroll || reduced) {
      /* Native hash jump still works via href; this covers containers. */
      if (scrollRoot && "scrollTop" in scrollRoot) {
        const rootRect = (scrollRoot as Element).getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const next =
          (scrollRoot as HTMLElement).scrollTop +
          (elRect.top - rootRect.top) -
          scrollMargin;
        (scrollRoot as HTMLElement).scrollTo({ top: next, behavior: "auto" });
      } else {
        const top =
          el.getBoundingClientRect().top + window.scrollY - scrollMargin;
        window.scrollTo({ top, behavior: "auto" });
      }
      return;
    }

    el.style.scrollMarginBlockStart = `${scrollMargin}px`;
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  const onActivate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: AnchorNavigationItem
  ) => {
    if (disabled || item.disabled) {
      event.preventDefault();
      return;
    }
    commit(item.id);

    /* Progressive enhancement — keep href for open-in-new-tab / no-JS / share */
    if (!smoothScroll && scrollMargin <= 0 && !scrollRoot) return;

    const href = resolveHref(item);
    const id = sectionIdFromHref(href) ?? item.id;
    if (!document.getElementById(id)) return;

    event.preventDefault();
    scrollToSection(id);
    if (typeof history !== "undefined" && history.replaceState) {
      history.replaceState(null, "", href);
    }
  };

  const enabledIds = React.useMemo(
    () => items.filter((i) => !i.disabled && !disabled).map((i) => i.id),
    [items, disabled]
  );

  const focusItem = (id: string) => {
    const safe =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(id)
        : id.replace(/"/g, '\\"');
    listRef.current
      ?.querySelector<HTMLElement>(`[data-anchor-id="${safe}"]`)
      ?.focus();
  };

  const move = (direction: 1 | -1) => {
    if (enabledIds.length === 0) return;
    const current = active && enabledIds.includes(active) ? active : enabledIds[0];
    const index = enabledIds.indexOf(current!);
    const next =
      enabledIds[(index + direction + enabledIds.length) % enabledIds.length];
    if (!next) return;
    commit(next);
    focusItem(next);
  };

  const onListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rtl =
      typeof document !== "undefined" &&
      (document.documentElement.dir === "rtl" ||
        getComputedStyle(event.currentTarget).direction === "rtl");
    const horizontal = resolvedOrientation === "horizontal";

    const nextKey = horizontal
      ? rtl
        ? "ArrowLeft"
        : "ArrowRight"
      : "ArrowDown";
    const prevKey = horizontal
      ? rtl
        ? "ArrowRight"
        : "ArrowLeft"
      : "ArrowUp";

    switch (event.key) {
      case nextKey:
        event.preventDefault();
        move(1);
        break;
      case prevKey:
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        event.preventDefault();
        if (enabledIds[0]) {
          commit(enabledIds[0]);
          focusItem(enabledIds[0]);
        }
        break;
      case "End": {
        event.preventDefault();
        const last = enabledIds[enabledIds.length - 1];
        if (last) {
          commit(last);
          focusItem(last);
        }
        break;
      }
      default:
        break;
    }
  };

  const mergedStyle: React.CSSProperties = {
    ...style,
    ["--dk-anchor-nav-offset" as string]: `${scrollMargin}px`,
  };

  return (
    <nav
      {...rest}
      ref={setRefs}
      id={rootId}
      className={cx(
        "dk-anchor-nav",
        SIZE_CLASS[size],
        `dk-anchor-nav--${resolvedOrientation}`,
        `dk-anchor-nav--overflow-${overflow}`,
        sticky && "dk-anchor-nav--sticky",
        disabled && "dk-anchor-nav--disabled",
        className
      )}
      style={mergedStyle}
      aria-label={label}
      data-size={size}
      data-orientation={resolvedOrientation}
      data-overflow={overflow}
      data-sticky={sticky || undefined}
      data-scroll-sync={scrollSync || undefined}
      data-disabled={disabled || undefined}
    >
      <div
        ref={listRef}
        className={cx(
          "dk-anchor-nav__list",
          overflow === "scroll" && "dk-scroll"
        )}
        role="list"
        onKeyDown={onListKeyDown}
      >
        {items.map((item, index) => {
          const href = resolveHref(item);
          const isActive = active === item.id;
          const isDisabled = Boolean(disabled || item.disabled);
          const isTabStop =
            !isDisabled &&
            (isActive ||
              (active == null && item.id === enabledIds[0]) ||
              (active == null && enabledIds.length === 0 && index === 0));

          return (
            <a
              key={item.id}
              id={`${rootId}-item-${item.id}`}
              role="listitem"
              href={isDisabled ? undefined : href}
              data-anchor-id={item.id}
              className={cx(
                "dk-anchor-nav__item",
                isActive && "dk-anchor-nav__item--active",
                isDisabled && "dk-anchor-nav__item--disabled"
              )}
              aria-current={isActive ? "location" : undefined}
              aria-disabled={isDisabled || undefined}
              tabIndex={isTabStop ? 0 : -1}
              title={item.label}
              onClick={(event) => onActivate(event, item)}
            >
              <span className="dk-anchor-nav__hit" aria-hidden="true" />
              <span className="dk-anchor-nav__label">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
});

AnchorNavigation.displayName = "AnchorNavigation";

export default AnchorNavigation;
