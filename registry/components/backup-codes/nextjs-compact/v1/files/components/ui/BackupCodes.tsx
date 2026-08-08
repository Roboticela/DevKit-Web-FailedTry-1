import * as React from "react";
import {
  Card,
  type CardVariant,
} from "../../../../../../../card/nextjs-compact/v1/files/components/ui/Card";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import { Dialog } from "../../../../../../../dialog/nextjs-compact/v1/files/components/ui/Dialog";
import {
  Alert,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/nextjs-compact/v1/files/components/ui/Alert";
import { Icon, type IconSize } from "../../../../../../../icon/nextjs-compact/v1/files/components/ui/Icon";
import { Checkbox } from "../../../../../../../checkbox/nextjs-compact/v1/files/components/ui/Checkbox";

/**
 * Backup Codes — 2FA recovery code surface.
 * Composes Card, Button, Dialog, Alert, and Icon.
 * Do not invent custom cards, dialogs, or alerts.
 */

export type BackupCodeItem = {
  id?: string;
  code: string;
  /** When true, code is already consumed. */
  used?: boolean;
  usedAt?: string | Date | null;
};

export type BackupCodesVariant = "stacked" | "compact" | "grid";

export type BackupCodesProps = {
  variant?: BackupCodesVariant;
  cardVariant?: CardVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /**
   * Recovery codes. Prefer opaque strings from the host — never generate secrets here.
   * Accepts plain strings or `{ code, used }` objects.
   */
  codes?: Array<string | BackupCodeItem>;
  /** Security warning Alert body. */
  warningTitle?: React.ReactNode;
  warningMessage?: React.ReactNode;
  showWarning?: boolean;
  /** Blur codes until revealed (secure display). Default: false. */
  concealUntilReveal?: boolean;
  defaultRevealed?: boolean;
  revealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
  /** Download filename. Default: `backup-codes.txt`. */
  downloadFilename?: string;
  /** Prefix lines in downloaded / printed content. */
  downloadHeader?: string;
  onCopy?: (codes: string[]) => void | Promise<void>;
  onDownload?: (codes: string[], blob: Blob) => void | Promise<void>;
  onPrint?: (codes: string[]) => void;
  /**
   * Regenerate codes. Host invalidates previous set.
   * Confirmation Dialog is shown before calling.
   */
  onRegenerate?: () => void | Promise<void>;
  showCopy?: boolean;
  showDownload?: boolean;
  showPrint?: boolean;
  showRegenerate?: boolean;
  showReveal?: boolean;
  /** Require user acknowledgement that codes were saved. */
  requireAcknowledgement?: boolean;
  acknowledged?: boolean;
  defaultAcknowledged?: boolean;
  onAcknowledgedChange?: (acknowledged: boolean) => void;
  acknowledgeLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
  downloadLabel?: string;
  printLabel?: string;
  regenerateLabel?: string;
  revealLabel?: string;
  hideLabel?: string;
  regenerateDialogTitle?: React.ReactNode;
  regenerateDialogDescription?: React.ReactNode;
  regenerateConfirmLabel?: string;
  regenerateCancelLabel?: string;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  usedLabel?: string;
  actionButtonSize?: ButtonSize;
  regenerateButtonVariant?: ButtonVariant;
  iconSize?: IconSize;
  density?: AlertDensity;
  live?: AlertLive;
  disabled?: boolean;
  loading?: boolean;
  regenerating?: boolean;
  headerSlot?: React.ReactNode;
  warningSlot?: React.ReactNode;
  codesSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function ShieldGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 2.75 16 5v4.5c0 3.75-2.5 6.5-6 7.75-3.5-1.25-6-4-6-7.75V5l6-2.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 3.25 17.25 16H2.75L10 3.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 8v4M10 14.25v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CopyGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-7A1.5 1.5 0 0 0 3 5.5v7A1.5 1.5 0 0 0 4.5 14H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="m4.5 10.5 3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M10 3.5v9M6.5 9.5 10 13l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PrintGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M6 7V3.5h8V7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="4" y="7" width="12" height="6.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 13.5h8V16.5H6v-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="14.25" cy="9.75" r="0.75" fill="currentColor" />
    </svg>
  );
}

function RefreshGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M16 10a6 6 0 1 1-1.6-4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 4.5v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M2.5 10s2.75-5 7.5-5 7.5 5 7.5 5-2.75 5-7.5 5-7.5-5-7.5-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="m4 4 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M8.2 5.3A8.6 8.6 0 0 1 10 5c4.75 0 7.5 5 7.5 5a12.4 12.4 0 0 1-2.15 2.85M5.4 6.9A12.3 12.3 0 0 0 2.5 10S5.25 15 10 15c1.1 0 2.12-.25 3.05-.68"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function normalizeCodes(codes: Array<string | BackupCodeItem>): BackupCodeItem[] {
  return codes.map((entry, index) => {
    if (typeof entry === "string") {
      return { id: `code-${index}`, code: entry, used: false };
    }
    return {
      id: entry.id ?? `code-${index}`,
      code: entry.code,
      used: Boolean(entry.used),
      usedAt: entry.usedAt,
    };
  });
}

function formatCode(code: string): string {
  const compact = code.replace(/\s+/g, "").toUpperCase();
  if (compact.length <= 4) return compact;
  const mid = Math.ceil(compact.length / 2);
  return `${compact.slice(0, mid)}-${compact.slice(mid)}`;
}

function codesPlainText(items: BackupCodeItem[], header?: string): string {
  const unused = items.filter((item) => !item.used).map((item) => item.code.replace(/\s+/g, ""));
  const lines = [
    header?.trim() || "Two-factor backup codes",
    "Store these codes securely. Each code can be used once.",
    "",
    ...unused,
  ];
  return `${lines.join("\n")}\n`;
}

async function writeClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  throw new Error("Clipboard unavailable");
}

function downloadTextFile(filename: string, content: string): Blob {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return blob;
}

export const BackupCodes = React.forwardRef<HTMLDivElement, BackupCodesProps>(function BackupCodes(
  {
    variant = "stacked",
    cardVariant = "outlined",
    title = "Backup codes",
    description = "Use these one-time codes if you lose access to your authenticator app.",
    codes = [],
    warningTitle = "Store these codes securely",
    warningMessage = "Treat backup codes like passwords. Anyone with a code can sign in once. Each code works only once, and regenerating invalidates previous codes.",
    showWarning = true,
    concealUntilReveal = false,
    defaultRevealed = false,
    revealed: revealedProp,
    onRevealedChange,
    downloadFilename = "backup-codes.txt",
    downloadHeader = "Two-factor backup codes",
    onCopy,
    onDownload,
    onPrint,
    onRegenerate,
    showCopy = true,
    showDownload = true,
    showPrint = true,
    showRegenerate = true,
    showReveal = true,
    requireAcknowledgement = false,
    acknowledged: acknowledgedProp,
    defaultAcknowledged = false,
    onAcknowledgedChange,
    acknowledgeLabel = "I have saved these codes in a secure place",
    copyLabel = "Copy",
    copiedLabel = "Copied",
    downloadLabel = "Download",
    printLabel = "Print",
    regenerateLabel = "Regenerate",
    revealLabel = "Reveal codes",
    hideLabel = "Hide codes",
    regenerateDialogTitle = "Regenerate backup codes?",
    regenerateDialogDescription = "Your current unused backup codes will stop working immediately. Make sure you can save the new set before continuing.",
    regenerateConfirmLabel = "Regenerate codes",
    regenerateCancelLabel = "Keep current codes",
    emptyTitle = "No backup codes",
    emptyDescription = "Generate a new set of recovery codes to continue.",
    usedLabel = "Used",
    actionButtonSize = "sm",
    regenerateButtonVariant = "destructive",
    iconSize = "md",
    density = "standard",
    live = "polite",
    disabled = false,
    loading = false,
    regenerating: regeneratingProp,
    headerSlot,
    warningSlot,
    codesSlot,
    actionSlot,
    footerSlot,
    className = "",
    id,
  },
  ref
) {
  const reactId = React.useId();
  const rootId = id ?? `dk-backup-codes-${reactId}`;
  const listId = `${rootId}-list`;
  const printId = `${rootId}-print`;
  const acknowledgeId = `${rootId}-ack`;

  const items = React.useMemo(() => normalizeCodes(codes), [codes]);
  const unusedCodes = React.useMemo(
    () => items.filter((item) => !item.used).map((item) => item.code.replace(/\s+/g, "")),
    [items]
  );
  const hasCodes = items.length > 0;

  const controlledReveal = revealedProp !== undefined;
  const [uncontrolledReveal, setUncontrolledReveal] = React.useState(
    concealUntilReveal ? defaultRevealed : true
  );
  const revealed = concealUntilReveal
    ? controlledReveal
      ? revealedProp!
      : uncontrolledReveal
    : true;

  const setRevealed = (next: boolean) => {
    if (!controlledReveal) setUncontrolledReveal(next);
    onRevealedChange?.(next);
  };

  const controlledAck = acknowledgedProp !== undefined;
  const [uncontrolledAck, setUncontrolledAck] = React.useState(defaultAcknowledged);
  const acknowledged = controlledAck ? acknowledgedProp! : uncontrolledAck;

  const setAcknowledged = (next: boolean) => {
    if (!controlledAck) setUncontrolledAck(next);
    onAcknowledgedChange?.(next);
  };

  const [copied, setCopied] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [internalRegenerating, setInternalRegenerating] = React.useState(false);
  const regenerating = regeneratingProp ?? internalRegenerating;
  const copyResetRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (copyResetRef.current != null) window.clearTimeout(copyResetRef.current);
    };
  }, []);

  const busy = disabled || loading || regenerating;
  const canUseSecrets = hasCodes && revealed && !busy;

  const handleCopy = async () => {
    if (!canUseSecrets || unusedCodes.length === 0) return;
    const text = unusedCodes.join("\n");
    try {
      if (onCopy) await onCopy(unusedCodes);
      else await writeClipboard(text);
      setCopied(true);
      if (copyResetRef.current != null) window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = async () => {
    if (!canUseSecrets || unusedCodes.length === 0) return;
    const content = codesPlainText(items, downloadHeader);
    if (onDownload) {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      await onDownload(unusedCodes, blob);
      return;
    }
    downloadTextFile(downloadFilename, content);
  };

  const handlePrint = () => {
    if (!canUseSecrets || unusedCodes.length === 0) return;
    if (onPrint) {
      onPrint(unusedCodes);
      return;
    }
    const node = document.getElementById(printId);
    if (!node || typeof window === "undefined") return;
    const popup = window.open("", "_blank", "noopener,noreferrer,width=640,height=720");
    if (!popup) return;
    popup.document.write(`<!doctype html><html><head><title>${downloadHeader}</title>
      <style>
        body{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:24px;color:#1d1d1f}
        h1{font-family:system-ui,sans-serif;font-size:18px}
        p{font-family:system-ui,sans-serif;font-size:13px;color:#6e6e73}
        ul{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:8px}
        li{border:1px solid #d2d2d7;padding:8px 12px;border-radius:6px;letter-spacing:.06em}
      </style></head><body>${node.innerHTML}</body></html>`);
    popup.document.close();
    popup.focus();
    popup.print();
    popup.close();
  };

  const handleRegenerate = async () => {
    if (!onRegenerate || busy) return;
    setInternalRegenerating(true);
    try {
      await onRegenerate();
      setConfirmOpen(false);
      setCopied(false);
      setAcknowledged(false);
      if (concealUntilReveal) setRevealed(false);
    } finally {
      setInternalRegenerating(false);
    }
  };

  const codeList =
    codesSlot ??
    (hasCodes ? (
      <ul
        id={listId}
        className={cx(
          "dk-backup-codes__list",
          `dk-backup-codes__list--${variant === "grid" ? "grid" : "columns"}`,
          !revealed && "dk-backup-codes__list--concealed"
        )}
        aria-label="Backup recovery codes"
        aria-hidden={!revealed || undefined}
      >
        {items.map((item) => (
          <li
            key={item.id}
            className={cx("dk-backup-codes__item", item.used && "dk-backup-codes__item--used")}
            data-used={item.used || undefined}
          >
            <code className="dk-backup-codes__code" aria-label={item.used ? `${formatCode(item.code)}, ${usedLabel}` : formatCode(item.code)}>
              {revealed ? formatCode(item.code) : "••••-••••"}
            </code>
            {item.used ? (
              <span className="dk-backup-codes__used">{usedLabel}</span>
            ) : null}
          </li>
        ))}
      </ul>
    ) : (
      <div className="dk-backup-codes__empty" role="status">
        <Icon size="lg">
          <ShieldGlyph />
        </Icon>
        <p className="dk-backup-codes__empty-title">{emptyTitle}</p>
        <p className="dk-backup-codes__empty-desc">{emptyDescription}</p>
      </div>
    ));

  const actions =
    actionSlot ??
    (
      <div className="dk-backup-codes__actions">
        {concealUntilReveal && showReveal ? (
          <Button
            size={actionButtonSize}
            variant="secondary"
            leadingIcon={revealed ? <EyeOffGlyph /> : <EyeGlyph />}
            disabled={busy || !hasCodes}
            onClick={() => setRevealed(!revealed)}
            aria-controls={listId}
            aria-expanded={revealed}
          >
            {revealed ? hideLabel : revealLabel}
          </Button>
        ) : null}
        {showCopy ? (
          <Button
            size={actionButtonSize}
            variant={copied ? "success" : "secondary"}
            leadingIcon={copied ? <CheckGlyph /> : <CopyGlyph />}
            disabled={!canUseSecrets || unusedCodes.length === 0}
            onClick={() => void handleCopy()}
          >
            {copied ? copiedLabel : copyLabel}
          </Button>
        ) : null}
        {showDownload ? (
          <Button
            size={actionButtonSize}
            variant="secondary"
            leadingIcon={<DownloadGlyph />}
            disabled={!canUseSecrets || unusedCodes.length === 0}
            onClick={() => void handleDownload()}
          >
            {downloadLabel}
          </Button>
        ) : null}
        {showPrint ? (
          <Button
            size={actionButtonSize}
            variant="secondary"
            leadingIcon={<PrintGlyph />}
            disabled={!canUseSecrets || unusedCodes.length === 0}
            onClick={handlePrint}
          >
            {printLabel}
          </Button>
        ) : null}
        {showRegenerate && onRegenerate ? (
          <Button
            size={actionButtonSize}
            variant={regenerateButtonVariant}
            leadingIcon={<RefreshGlyph />}
            disabled={busy}
            loading={regenerating}
            onClick={() => setConfirmOpen(true)}
          >
            {regenerateLabel}
          </Button>
        ) : null}
      </div>
    );

  return (
    <div
      ref={ref}
      id={rootId}
      className={cx("dk-backup-codes", `dk-backup-codes--${variant}`, className)}
      data-variant={variant}
      data-revealed={revealed || undefined}
      data-loading={loading || regenerating || undefined}
    >
      <Card variant={cardVariant} className="dk-backup-codes__card">
        {headerSlot ?? (
          <Card.Header className="dk-backup-codes__header">
            <div className="dk-backup-codes__heading">
              <div className="dk-backup-codes__title-row">
                <Icon size={iconSize} className="dk-backup-codes__title-icon">
                  <ShieldGlyph />
                </Icon>
                <Card.Title>{title}</Card.Title>
              </div>
              {description ? <Card.Description>{description}</Card.Description> : null}
            </div>
          </Card.Header>
        )}

        <Card.Body className="dk-backup-codes__body">
          {warningSlot ??
            (showWarning ? (
              <Alert
                variant="warning"
                density={density}
                live={live}
                title={warningTitle}
                icon={<WarningGlyph />}
                className="dk-backup-codes__warning"
              >
                {warningMessage}
              </Alert>
            ) : null)}

          {codeList}
          {actions}

          {requireAcknowledgement && hasCodes ? (
            <Checkbox
              id={acknowledgeId}
              label={acknowledgeLabel}
              checked={acknowledged}
              disabled={busy || (concealUntilReveal && !revealed)}
              onCheckedChange={setAcknowledged}
              className="dk-backup-codes__ack"
            />
          ) : null}

          {footerSlot}
        </Card.Body>
      </Card>

      {/* Printable fragment kept off-screen for default print handler */}
      <div id={printId} className="dk-backup-codes__print" hidden>
        <h1>{downloadHeader}</h1>
        <p>Store these codes securely. Each code can be used once.</p>
        <ul>
          {unusedCodes.map((code) => (
            <li key={code}>{formatCode(code)}</li>
          ))}
        </ul>
      </div>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!regenerating) setConfirmOpen(open);
        }}
        title={regenerateDialogTitle}
        description={regenerateDialogDescription}
        size="sm"
        closeOnOutsideClick={!regenerating}
        closeOnEscape={!regenerating}
        actions={
          <>
            <Button
              size="sm"
              variant="secondary"
              disabled={regenerating}
              onClick={() => setConfirmOpen(false)}
            >
              {regenerateCancelLabel}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              leadingIcon={<RefreshGlyph />}
              loading={regenerating}
              disabled={disabled}
              onClick={() => void handleRegenerate()}
            >
              {regenerateConfirmLabel}
            </Button>
          </>
        }
      />
    </div>
  );
});

BackupCodes.displayName = "BackupCodes";
export default BackupCodes;
