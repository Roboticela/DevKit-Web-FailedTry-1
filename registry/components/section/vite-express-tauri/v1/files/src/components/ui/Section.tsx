import * as React from "react";

export type SectionWidth =
  | "full"
  | "form"
  | "reading"
  | "narrow"
  | "modal"
  | "default"
  | "wide"
  | "hero"
  | "dashboard";

export type SectionBackground =
  | "transparent"
  | "canvas"
  | "base"
  | "subtle"
  | "muted"
  | "surface";

export type SectionElevation = 0 | 1 | 2 | 3 | 4 | 5;
export type SectionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface SectionVisibilityEvent {
  id?: string;
  visible: boolean;
  ratio: number;
  entry: IntersectionObserverEntry;
}

export interface SectionEmptyState {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Section title — rendered with automatic heading level */
  title?: React.ReactNode;
  /** Supporting description under the title */
  description?: React.ReactNode;
  /** Actions aligned to the header end */
  actions?: React.ReactNode;
  /** Footer slot */
  footer?: React.ReactNode;
  /** Show skeleton loading state instead of body */
  loading?: boolean;
  /** Show empty state instead of body */
  empty?: boolean;
  /** Empty state content */
  emptyState?: SectionEmptyState | React.ReactNode;
  /** Collapsible body/footer */
  collapsible?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled default open */
  defaultOpen?: boolean;
  /** Sticky section header */
  stickyHeader?: boolean;
  /** Sticky offset (px or CSS length) */
  stickyOffset?: string | number;
  /** Nested section — tighter rhythm */
  nested?: boolean;
  /** Compact vertical padding (legacy) */
  compact?: boolean;
  /** Remove vertical padding */
  flush?: boolean;
  /** Add page horizontal padding */
  padded?: boolean;
  /** Inherit container max-width */
  width?: SectionWidth;
  /** Background variation */
  background?: SectionBackground;
  /** Soft elevated surface shell */
  elevated?: boolean;
  /** Elevation token class hook (0–5) */
  elevation?: SectionElevation;
  /** Explicit heading level (overrides hierarchy context) */
  level?: SectionHeadingLevel;
  /** Anchor id for in-page navigation (also sets id when id omitted) */
  anchor?: string;
  /** Animate mount */
  animate?: boolean;
  /** Lazy reveal body via IntersectionObserver + content-visibility */
  lazy?: boolean;
  /** Motion-aware padding/width transitions */
  motion?: boolean;
  /** Visibility analytics threshold 0–1 */
  visibilityThreshold?: number | number[];
  /** Fires when section enters/leaves the viewport */
  onVisible?: (event: SectionVisibilityEvent) => void;
  /** Fires on collapse toggle */
  onToggle?: (open: boolean) => void;
  /** Landmark element */
  as?: "section" | "div" | "main" | "aside" | "article";
  children?: React.ReactNode;
}

type SectionContextValue = {
  headingLevel: SectionHeadingLevel;
  collapsible: boolean;
  open: boolean;
  toggle: () => void;
  titleId?: string;
  bodyId?: string;
};

const SectionLevelContext = React.createContext<SectionHeadingLevel>(2);
const SectionContext = React.createContext<SectionContextValue | null>(null);

function useSectionContext(optional = false) {
  const ctx = React.useContext(SectionContext);
  if (!ctx && !optional) {
    throw new Error("Section compound components must be used within <Section>");
  }
  return ctx;
}

function toCssLength(value: string | number | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function isEmptyStateObject(
  value: SectionEmptyState | React.ReactNode | undefined
): value is SectionEmptyState {
  return (
    value != null &&
    typeof value === "object" &&
    !React.isValidElement(value) &&
    ("title" in value || "description" in value || "action" in value)
  );
}

function HeadingTag({
  level,
  className,
  id,
  children,
}: {
  level: SectionHeadingLevel;
  className?: string;
  id?: string;
  children?: React.ReactNode;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}

function SectionSkeleton() {
  return (
    <div className="dk-section-loading" role="status" aria-live="polite" aria-busy="true">
      <span className="dk-sr-only">Loading</span>
      <div className="dk-section-skeleton" aria-hidden>
        <div className="dk-section-skeleton-line" />
        <div className="dk-section-skeleton-line" />
        <div className="dk-section-skeleton-line" />
      </div>
    </div>
  );
}

function SectionEmpty({ state }: { state?: SectionEmptyState | React.ReactNode }) {
  if (state == null) {
    return (
      <div className="dk-section-empty" role="status">
        <p className="dk-section-empty-title">Nothing here yet</p>
        <p className="dk-section-empty-description">
          Content will appear in this section when available.
        </p>
      </div>
    );
  }
  if (!isEmptyStateObject(state)) {
    return (
      <div className="dk-section-empty" role="status">
        {state}
      </div>
    );
  }
  return (
    <div className="dk-section-empty" role="status">
      {state.title ? <p className="dk-section-empty-title">{state.title}</p> : null}
      {state.description ? (
        <p className="dk-section-empty-description">{state.description}</p>
      ) : null}
      {state.action}
    </div>
  );
}

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  sticky?: boolean;
  as?: "header" | "div";
}

/** Section header with optional title, description, actions, and collapse control */
export function SectionHeader({
  title,
  description,
  actions,
  sticky = false,
  as = "header",
  className = "",
  children,
  ...props
}: SectionHeaderProps) {
  const ctx = useSectionContext(true);
  const fallbackLevel = React.useContext(SectionLevelContext);
  const level = ctx?.headingLevel ?? fallbackLevel;
  const Tag = as as React.ElementType;

  return (
    <Tag
      className={["dk-section-header", sticky ? "dk-section-header-sticky" : "", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {title || description || children ? (
        <div className="dk-section-header-main">
          {title ? (
            <HeadingTag level={level} id={ctx?.titleId} className="dk-section-title">
              {title}
            </HeadingTag>
          ) : null}
          {description ? <p className="dk-section-description">{description}</p> : null}
          {children}
        </div>
      ) : null}
      {actions ? <div className="dk-section-actions">{actions}</div> : null}
      {ctx?.collapsible ? (
        <button
          type="button"
          className="dk-section-trigger"
          aria-expanded={ctx.open}
          aria-controls={ctx.bodyId}
          onClick={(e) => {
            e.stopPropagation();
            ctx.toggle();
          }}
        >
          <span className="dk-section-trigger-icon" aria-hidden />
          <span className="dk-sr-only">{ctx.open ? "Collapse section" : "Expand section"}</span>
        </button>
      ) : null}
    </Tag>
  );
}

export interface SectionBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SectionBody({ className = "", children, ...props }: SectionBodyProps) {
  const ctx = useSectionContext(true);
  return (
    <div
      id={ctx?.bodyId}
      className={`dk-section-body ${className}`.trim()}
      role={ctx?.collapsible ? "region" : undefined}
      aria-labelledby={ctx?.collapsible ? ctx.titleId : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SectionFooterProps extends React.HTMLAttributes<HTMLElement> {
  as?: "footer" | "div";
}

export function SectionFooter({
  as = "footer",
  className = "",
  children,
  ...props
}: SectionFooterProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={`dk-section-footer ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}

/**
 * Section — logical content group with header/body/footer, collapse, sticky,
 * empty/loading states, width & surface inheritance, and visibility analytics.
 */
export function Section({
  title,
  description,
  actions,
  footer,
  loading = false,
  empty = false,
  emptyState,
  collapsible = false,
  open: openProp,
  defaultOpen = true,
  stickyHeader = false,
  stickyOffset,
  nested = false,
  compact = false,
  flush = false,
  padded = false,
  width,
  background = "transparent",
  elevated = false,
  elevation,
  level,
  anchor,
  animate = false,
  lazy = false,
  motion = true,
  visibilityThreshold = 0.25,
  onVisible,
  onToggle,
  as = "section",
  id,
  className = "",
  style,
  children,
  ...props
}: SectionProps) {
  const parentLevel = React.useContext(SectionLevelContext);
  const headingLevel = (level ??
    Math.min(6, nested ? parentLevel + 1 : parentLevel)) as SectionHeadingLevel;
  const childLevel = Math.min(6, headingLevel + 1) as SectionHeadingLevel;

  const reactId = React.useId();
  const sectionId = id ?? anchor;
  const titleId = `${reactId}-title`;
  const bodyId = `${reactId}-body`;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const toggle = React.useCallback(() => {
    const next = !open;
    if (openProp == null) setUncontrolledOpen(next);
    onToggle?.(next);
  }, [open, openProp, onToggle]);

  const rootRef = React.useRef<HTMLElement>(null);
  const [lazyVisible, setLazyVisible] = React.useState(!lazy);

  React.useEffect(() => {
    if (!onVisible && !lazy) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setLazyVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (lazy && entry.isIntersecting) setLazyVisible(true);
        onVisible?.({
          id: sectionId,
          visible: entry.isIntersecting,
          ratio: entry.intersectionRatio,
          entry,
        });
      },
      { threshold: visibilityThreshold, rootMargin: lazy ? "120px 0px" : "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy, onVisible, sectionId, visibilityThreshold]);

  const hasChrome = title != null || description != null || actions != null || footer != null;

  const ctxValue = React.useMemo<SectionContextValue>(
    () => ({
      headingLevel,
      collapsible,
      open,
      toggle,
      titleId,
      bodyId,
    }),
    [headingLevel, collapsible, open, toggle, titleId, bodyId]
  );

  const classes = [
    "dk-section",
    compact ? "dk-section-compact" : "",
    flush ? "dk-section-flush" : "",
    padded ? "dk-section-padded" : "",
    nested ? "dk-section-nested" : "",
    width ? `dk-section-width-${width}` : "",
    `dk-section-bg-${background}`,
    elevated ? "dk-section-elevated" : "",
    elevation != null ? `dk-surface-elev-${elevation}` : "",
    stickyHeader ? "dk-section-sticky" : "",
    motion ? "dk-section-motion" : "",
    animate ? "dk-section-animate" : "",
    lazy ? "dk-section-lazy" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: React.CSSProperties = {
    ...(stickyOffset != null
      ? { ["--section-sticky-offset" as string]: toCssLength(stickyOffset) }
      : null),
    ...style,
  };

  const bodyNode = loading ? (
    <SectionSkeleton />
  ) : empty ? (
    <SectionEmpty state={emptyState} />
  ) : lazy && !lazyVisible ? null : (
    children
  );

  const Tag = as as React.ElementType;

  return (
    <SectionLevelContext.Provider value={childLevel}>
      <SectionContext.Provider value={ctxValue}>
        <Tag
          ref={rootRef}
          id={sectionId}
          className={classes}
          style={mergedStyle}
          data-open={collapsible ? (open ? "true" : "false") : undefined}
          data-visible={lazy ? (lazyVisible ? "true" : "false") : undefined}
          aria-labelledby={title ? titleId : props["aria-labelledby"]}
          {...props}
        >
          {anchor && sectionId && anchor !== sectionId ? (
            <span id={anchor} className="dk-section-anchor" aria-hidden />
          ) : null}

          {!hasChrome ? (
            bodyNode
          ) : (
            <>
              <SectionHeader
                title={title}
                description={description}
                actions={actions}
                sticky={stickyHeader}
              />
              {collapsible ? (
                <div className="dk-section-collapse">
                  <div
                    className="dk-section-collapse-inner"
                    {...(!open ? ({ inert: "" } as Record<string, string>) : null)}
                  >
                    <div
                      id={bodyId}
                      className="dk-section-body"
                      role="region"
                      aria-labelledby={title ? titleId : undefined}
                    >
                      {bodyNode}
                    </div>
                    {footer != null ? <SectionFooter>{footer}</SectionFooter> : null}
                  </div>
                </div>
              ) : (
                <>
                  <div id={bodyId} className="dk-section-body">
                    {bodyNode}
                  </div>
                  {footer != null ? <SectionFooter>{footer}</SectionFooter> : null}
                </>
              )}
            </>
          )}
        </Tag>
      </SectionContext.Provider>
    </SectionLevelContext.Provider>
  );
}

Section.Header = SectionHeader;
Section.Body = SectionBody;
Section.Footer = SectionFooter;

export { SectionLevelContext };
