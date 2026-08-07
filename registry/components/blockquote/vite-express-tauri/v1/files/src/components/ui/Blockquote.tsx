import * as React from "react";

/**
 * Blockquote — quoted content with optional citation.
 * Distinguished via spacing, border, typography, and indentation — not oversized marks.
 * Not a testimonial card, marketing quote, or review composition.
 * Source URLs navigate via DevKit Link markup (`dk-link`) or a composed `source` node.
 */

export type BlockquoteSize = "standard" | "compact";

/**
 * Reading measure for long quotations.
 * `reading` (default) caps width; `none` fills the parent.
 */
export type BlockquoteMeasure = "reading" | "none";

/**
 * Quotation direction for localized / mixed content.
 * Default `auto` — browser resolves from content.
 */
export type BlockquoteDir = "auto" | "ltr" | "rtl";

export type BlockquoteProps = {
  /** Quoted content. Prefer this or `children`. */
  quote?: React.ReactNode;
  /** Alias for `quote`. */
  children?: React.ReactNode;
  /**
   * Full citation region. When set, replaces the composed author/source line.
   */
  citation?: React.ReactNode;
  /** Attribution name — visually secondary. */
  author?: React.ReactNode;
  /**
   * Source title / publication.
   * When `sourceHref` is set and `source` is plain text, rendered as DevKit Link.
   * Pass a composed `<Link>` node to use the Link component directly.
   */
  source?: React.ReactNode;
  /** Makes `source` navigable (DevKit Link styles / semantics). */
  sourceHref?: string;
  /** Opt-in external affordance when using built-in source link. */
  sourceExternal?: boolean;
  /** Accessible name for the external mark. */
  sourceExternalLabel?: string;
  /**
   * URL of the source document — maps to the HTML `cite` attribute on `<blockquote>`.
   */
  cite?: string;
  size?: BlockquoteSize;
  measure?: BlockquoteMeasure;
  /**
   * Direction for the quotation body. Default `auto` for localized content.
   * Citation chrome follows surrounding UI direction.
   */
  dir?: BlockquoteDir;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V9.5M9.5 2.5h4v4M13.5 2.5 7 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Built-in source control using DevKit Link classes (requires link.css).
 * Prefer composing the Link component via the `source` prop when available.
 */
function SourceLink({
  href,
  children,
  external,
  externalLabel,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  externalLabel: string;
}) {
  const rel = external ? "noopener noreferrer" : undefined;
  const target = external ? "_blank" : undefined;

  return (
    <a
      href={href}
      className={cx(
        "dk-link",
        "dk-link--inline",
        "dk-link--accent",
        external && "dk-link--external",
        "dk-blockquote__source-link"
      )}
      target={target}
      rel={rel}
    >
      <span className="dk-link__content">
        <span className="dk-link__label">{children}</span>
        {external ? (
          <span className="dk-link__external" aria-label={externalLabel}>
            <ExternalIcon />
          </span>
        ) : null}
      </span>
    </a>
  );
}

function isPlainSource(node: React.ReactNode): boolean {
  return (
    typeof node === "string" ||
    typeof node === "number" ||
    node == null
  );
}

export const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  function Blockquote(
    {
      quote,
      children,
      citation,
      author,
      source,
      sourceHref,
      sourceExternal = false,
      sourceExternalLabel = "Opens in a new window",
      cite,
      size = "standard",
      measure = "reading",
      dir = "auto",
      className = "",
      id,
      style,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    forwardedRef
  ) {
    const body = quote ?? children;

    const sourceNode = (() => {
      if (sourceHref && isPlainSource(source)) {
        const label = source ?? sourceHref;
        return (
          <SourceLink
            href={sourceHref}
            external={sourceExternal}
            externalLabel={sourceExternalLabel}
          >
            {label}
          </SourceLink>
        );
      }
      if (sourceHref && React.isValidElement(source)) {
        // Host composed Link (or other anchor) — render as provided
        return source;
      }
      if (source != null) return source;
      if (sourceHref) {
        return (
          <SourceLink
            href={sourceHref}
            external={sourceExternal}
            externalLabel={sourceExternalLabel}
          >
            {sourceHref}
          </SourceLink>
        );
      }
      return null;
    })();

    const hasCitation =
      citation != null || author != null || sourceNode != null;

    const composedCitation =
      citation != null ? (
        citation
      ) : (
        <>
          {author != null ? (
            <cite className="dk-blockquote__author">{author}</cite>
          ) : null}
          {author != null && sourceNode != null ? (
            <span className="dk-blockquote__sep" aria-hidden="true">
              ,{" "}
            </span>
          ) : null}
          {sourceNode != null ? (
            <span className="dk-blockquote__source">{sourceNode}</span>
          ) : null}
        </>
      );

    return (
      <blockquote
        ref={forwardedRef}
        id={id}
        cite={cite}
        className={cx(
          "dk-blockquote",
          `dk-blockquote--${size}`,
          `dk-blockquote--measure-${measure}`,
          className
        )}
        style={style}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        <div className="dk-blockquote__body" dir={dir}>
          {typeof body === "string" || typeof body === "number" ? (
            <p className="dk-blockquote__quote">{body}</p>
          ) : (
            body
          )}
        </div>

        {hasCitation ? (
          <footer className="dk-blockquote__footer">
            <span className="dk-blockquote__mark" aria-hidden="true">
              —
            </span>{" "}
            <span className="dk-blockquote__citation">{composedCitation}</span>
          </footer>
        ) : null}
      </blockquote>
    );
  }
);

Blockquote.displayName = "Blockquote";

export default Blockquote;
