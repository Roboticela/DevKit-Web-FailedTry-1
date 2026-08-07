import * as React from "react";

/**
 * Code Block — multiline source / preformatted technical content.
 * Not a code editor. Syntax highlighting is host-provided and must not rely on color alone.
 * Code stays LTR; chrome (toolbar) is RTL-aware.
 * Copy uses DevKit Icon Button (classes or `copyAction` slot) — line numbers are never copied.
 */

export type CodeBlockOverflow = "scroll" | "wrap";

export type CodeBlockState = "idle" | "loading" | "empty" | "error";

export type CodeBlockCopyApi = {
  copy: () => Promise<void>;
  copied: boolean;
  copyLabel: string;
  copiedLabel: string;
  disabled: boolean;
};

export type CodeBlockLineRenderContext = {
  /** 1-based absolute line number in the full source */
  lineNumber: number;
  /** 0-based index within the currently rendered window */
  index: number;
  text: string;
  highlighted: boolean;
};

export type CodeBlockProps = {
  /**
   * Source text. Prefer this for copy fidelity.
   * When omitted, `children` may supply custom (e.g. highlighted) nodes — provide `code` for copy.
   */
  code?: string;
  /**
   * Custom highlighted / structured content inside `<code>`.
   * Prefer token markup that is not color-only (weight, style, marks).
   */
  children?: React.ReactNode;
  /** Language id/label (e.g. `ts`, `SQL`). Shown when `showLanguage`. */
  language?: string;
  /** Show language indicator. Default: true when `language` is set. */
  showLanguage?: boolean;
  /** Optional line numbers. Default: false. Never included in copied text. */
  showLineNumbers?: boolean;
  /** 1-based start for the first displayed line (virtualization / windows). Default: 1. */
  startLine?: number;
  /**
   * Total line count when rendering a window of a larger file.
   * Defaults to lines in `code`.
   */
  totalLines?: number;
  /**
   * 1-based line numbers to emphasize (background + edge mark — not color alone).
   */
  highlightedLines?: number[];
  /**
   * Long-line behavior. Default `scroll` — preserve formatting.
   * `wrap` is opt-in when horizontal scroll is undesirable.
   */
  overflow?: CodeBlockOverflow;
  /**
   * Max height of the code viewport. Prevents infinite growth.
   * Default: `24rem`. Pass `none` to disable (host must constrain).
   */
  maxHeight?: string | "none";
  /**
   * Collapsed preview. Controlled via `collapsed` / `defaultCollapsed` / `onCollapsedChange`.
   */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Lines visible while collapsed. Default: 8. */
  collapsedLines?: number;
  expandLabel?: string;
  collapseLabel?: string;
  /**
   * Content state. Derived from `loading` / `error` / empty `code` when omitted.
   */
  state?: CodeBlockState;
  loading?: boolean;
  error?: boolean;
  loadingLabel?: string;
  emptyMessage?: string;
  errorMessage?: string;
  /**
   * Enable copy. Default: true for idle non-empty code.
   * Copy text is plain source from `code` (or string children) — never line numbers.
   */
  copyable?: boolean;
  /**
   * Compose DevKit `IconButton`, or a render prop receiving copy API.
   * When omitted, a default control using Icon Button classes is rendered.
   */
  copyAction?: React.ReactNode | ((api: CodeBlockCopyApi) => React.ReactNode);
  /** Extra toolbar actions — compose DevKit Button / IconButton. */
  actions?: React.ReactNode;
  copyLabel?: string;
  copiedLabel?: string;
  copyFailedLabel?: string;
  onCopy?: (text: string) => void;
  onCopyError?: (error: unknown) => void;
  /**
   * Host-controlled line rendering (virtualization / selective paint).
   * When set, replaces the default line map for the code body.
   */
  renderLine?: (ctx: CodeBlockLineRenderContext) => React.ReactNode;
  /**
   * Optional accessible name. Defaults from language / “Code block”.
   */
  label?: string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function splitLines(source: string): string[] {
  if (source.length === 0) return [];
  const parts = source.split("\n");
  // Keep a trailing empty line representation only when source ends with \n
  if (parts.length > 1 && parts[parts.length - 1] === "") {
    return parts.slice(0, -1).length === 0 ? [""] : parts.slice(0, -1);
  }
  return parts;
}

function resolveState(
  state: CodeBlockState | undefined,
  loading: boolean | undefined,
  error: boolean | undefined,
  hasCode: boolean
): CodeBlockState {
  if (state) return state;
  if (loading) return "loading";
  if (error) return "error";
  if (!hasCode) return "empty";
  return "idle";
}

function CopyGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
      <rect
        x="7"
        y="7"
        width="9"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 13V4.5A1.5 1.5 0 0 1 5.5 3H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M4.5 10.5 8 14l7.5-8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

async function writeClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  throw new Error("Clipboard unavailable");
}

export const CodeBlock = React.forwardRef<HTMLElement, CodeBlockProps>(
  function CodeBlock(
    {
      code,
      children,
      language,
      showLanguage: showLanguageProp,
      showLineNumbers = false,
      startLine = 1,
      totalLines: totalLinesProp,
      highlightedLines,
      overflow = "scroll",
      maxHeight = "24rem",
      collapsed: collapsedProp,
      defaultCollapsed = false,
      onCollapsedChange,
      collapsedLines = 8,
      expandLabel = "Show more",
      collapseLabel = "Show less",
      state: stateProp,
      loading = false,
      error = false,
      loadingLabel = "Loading code",
      emptyMessage = "No code",
      errorMessage = "Unable to load code",
      copyable: copyableProp,
      copyAction,
      actions,
      copyLabel = "Copy code",
      copiedLabel = "Copied",
      copyFailedLabel = "Copy failed",
      onCopy,
      onCopyError,
      renderLine,
      label,
      className = "",
      id,
      style,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const rootId = id ?? `dk-code-block-${reactId}`;
    const liveId = `${rootId}-live`;
    const labelId = `${rootId}-label`;

    const source = code ?? (typeof children === "string" ? children : "");
    const allLines = React.useMemo(() => splitLines(source), [source]);
    const totalLines = totalLinesProp ?? Math.max(allLines.length, 1);
    const hasSource = source.length > 0 || (children != null && typeof children !== "string");

    const status = resolveState(stateProp, loading, error, hasSource);
    const showLanguage =
      showLanguageProp ?? Boolean(language && language.trim().length > 0);
    const copyable =
      copyableProp ?? (status === "idle" && source.length > 0);

    const isCollapsedControlled = collapsedProp !== undefined;
    const [uncontrolledCollapsed, setUncontrolledCollapsed] =
      React.useState(defaultCollapsed);
    const collapsed = isCollapsedControlled
      ? Boolean(collapsedProp)
      : uncontrolledCollapsed;

    const setCollapsed = (next: boolean) => {
      if (!isCollapsedControlled) setUncontrolledCollapsed(next);
      onCollapsedChange?.(next);
    };

    const highlightSet = React.useMemo(() => {
      const set = new Set<number>();
      highlightedLines?.forEach((n) => {
        if (Number.isFinite(n) && n >= 1) set.add(Math.floor(n));
      });
      return set;
    }, [highlightedLines]);

    const canCollapse =
      status === "idle" &&
      allLines.length > collapsedLines &&
      children == null;

    const visibleLines =
      canCollapse && collapsed
        ? allLines.slice(0, Math.max(1, collapsedLines))
        : allLines;

    const [copied, setCopied] = React.useState(false);
    const [liveMessage, setLiveMessage] = React.useState("");
    const copiedTimer = React.useRef<number | null>(null);

    React.useEffect(() => {
      return () => {
        if (copiedTimer.current != null) window.clearTimeout(copiedTimer.current);
      };
    }, []);

    const announce = (message: string) => {
      setLiveMessage("");
      // Retrigger polite live region for repeated copies
      window.requestAnimationFrame(() => setLiveMessage(message));
    };

    const copy = React.useCallback(async () => {
      if (!source) return;
      try {
        await writeClipboard(source);
        setCopied(true);
        announce(copiedLabel);
        onCopy?.(source);
        if (copiedTimer.current != null) window.clearTimeout(copiedTimer.current);
        copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setCopied(false);
        announce(copyFailedLabel);
        onCopyError?.(err);
      }
    }, [source, copiedLabel, copyFailedLabel, onCopy, onCopyError]);

    const copyApi: CodeBlockCopyApi = {
      copy,
      copied,
      copyLabel,
      copiedLabel,
      disabled: status !== "idle" || source.length === 0,
    };

    const accessibleName =
      ariaLabel ??
      label ??
      (language ? `Code block, ${language}` : "Code block");

    const viewportStyle: React.CSSProperties =
      maxHeight === "none"
        ? {}
        : { maxHeight: maxHeight ?? "24rem" };

    const renderDefaultLines = () =>
      visibleLines.map((text, index) => {
        const lineNumber = startLine + index;
        const highlighted = highlightSet.has(lineNumber);
        if (renderLine) {
          return (
            <React.Fragment key={lineNumber}>
              {renderLine({ lineNumber, index, text, highlighted })}
            </React.Fragment>
          );
        }
        return (
          <span
            key={lineNumber}
            className={cx(
              "dk-code-block__line",
              highlighted && "dk-code-block__line--highlight"
            )}
            data-line={lineNumber}
          >
            {showLineNumbers ? (
              <span className="dk-code-block__line-no" aria-hidden="true">
                {lineNumber}
              </span>
            ) : null}
            <span className="dk-code-block__line-text">{text.length ? text : " "}</span>
          </span>
        );
      });

    const resolvedCopyAction =
      typeof copyAction === "function" ? copyAction(copyApi) : copyAction;

    const defaultCopyControl = (
      <button
        type="button"
        className={cx(
          "dk-icon-button",
          "dk-icon-button--sm",
          "dk-icon-button--subtle",
          "dk-code-block__copy"
        )}
        aria-label={copied ? copiedLabel : copyLabel}
        title={copied ? copiedLabel : copyLabel}
        data-size="sm"
        data-variant="subtle"
        disabled={copyApi.disabled}
        onClick={() => {
          void copy();
        }}
      >
        <span className="dk-icon-button__hit" aria-hidden="true" />
        <span className="dk-icon-button__glyph" aria-hidden="true">
          {copied ? <CheckGlyph /> : <CopyGlyph />}
        </span>
      </button>
    );

    return (
      <figure
        ref={forwardedRef as React.Ref<HTMLElement>}
        id={rootId}
        className={cx(
          "dk-code-block",
          `dk-code-block--overflow-${overflow}`,
          `dk-code-block--${status}`,
          showLineNumbers && "dk-code-block--line-numbers",
          collapsed && canCollapse && "dk-code-block--collapsed",
          className
        )}
        style={style}
        aria-label={ariaLabelledBy ? undefined : accessibleName}
        aria-labelledby={ariaLabelledBy}
        data-language={language || undefined}
        data-state={status}
        data-overflow={overflow}
      >
        <div className="dk-code-block__chrome">
          <div className="dk-code-block__meta">
            {showLanguage && language ? (
              <span className="dk-code-block__language" id={labelId}>
                {language}
              </span>
            ) : null}
          </div>
          <div className="dk-code-block__actions">
            {actions}
            {copyable
              ? (resolvedCopyAction ?? defaultCopyControl)
              : null}
          </div>
        </div>

        <div
          className="dk-code-block__viewport"
          style={viewportStyle}
          tabIndex={status === "idle" ? 0 : undefined}
          role="region"
          aria-label={accessibleName}
        >
          {status === "loading" ? (
            <div
              className="dk-code-block__status"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <span className="dk-code-block__status-spinner" aria-hidden="true" />
              <span>{loadingLabel}</span>
            </div>
          ) : null}

          {status === "empty" ? (
            <div className="dk-code-block__status" role="status">
              {emptyMessage}
            </div>
          ) : null}

          {status === "error" ? (
            <div className="dk-code-block__status dk-code-block__status--error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          {status === "idle" ? (
            <pre className="dk-code-block__pre" dir="ltr" translate="no">
              <code className="dk-code-block__code">
                {children != null && typeof children !== "string"
                  ? children
                  : renderDefaultLines()}
              </code>
            </pre>
          ) : null}
        </div>

        {canCollapse ? (
          <div className="dk-code-block__footer">
            <button
              type="button"
              className="dk-code-block__expand"
              onClick={() => setCollapsed(!collapsed)}
              aria-expanded={!collapsed}
            >
              {collapsed ? expandLabel : collapseLabel}
              <span className="dk-code-block__expand-meta" aria-hidden="true">
                {collapsed
                  ? ` (${collapsedLines} of ${totalLines} lines)`
                  : ` (${totalLines} lines)`}
              </span>
            </button>
          </div>
        ) : null}

        <div id={liveId} className="dk-code-block__live" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </div>
      </figure>
    );
  }
);

CodeBlock.displayName = "CodeBlock";

export default CodeBlock;
