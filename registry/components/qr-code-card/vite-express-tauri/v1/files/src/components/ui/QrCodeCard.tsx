import * as React from "react";
import {
  Card,
  type CardVariant,
} from "../../../../../../../card/vite-express-tauri/v1/files/src/components/ui/Card";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import { Badge } from "../../../../../../../badge/vite-express-tauri/v1/files/src/components/ui/Badge";
import { Tooltip } from "../../../../../../../tooltip/vite-express-tauri/v1/files/src/components/ui/Tooltip";
import { Icon, type IconSize } from "../../../../../../../icon/vite-express-tauri/v1/files/src/components/ui/Icon";
import { Skeleton } from "../../../../../../../skeleton/vite-express-tauri/v1/files/src/components/ui/Skeleton";
import {
  CountdownTimer,
  type CountdownTimerHandle,
} from "../../../../../../../countdown-timer/vite-express-tauri/v1/files/src/components/ui/CountdownTimer";

/**
 * QR Code Card — authenticator app setup surface.
 * Composes Card, Button, Badge, Tooltip, and Icon
 * (plus Skeleton + Countdown Timer for loading / expiry — no duplicated chrome).
 */

export type QrCodeCardStatus = "idle" | "loading" | "expired" | "error";

export type QrCodeCardVariant = "stacked" | "compact" | "split";

export type QrCodeCardProps = {
  variant?: QrCodeCardVariant;
  cardVariant?: CardVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Image URL or data URI for the QR code. */
  qrSrc?: string;
  /** Accessible name for the QR image. */
  qrAlt?: string;
  /** Manual setup / secret key (TOTP base32). */
  secretKey?: string;
  /** Display-only issuer (e.g. product name). */
  issuer?: string;
  /** Display-only account label (e.g. email). */
  accountName?: string;
  status?: QrCodeCardStatus;
  defaultStatus?: QrCodeCardStatus;
  onStatusChange?: (status: QrCodeCardStatus) => void;
  /**
   * Seconds until the QR / secret expires.
   * Composes Countdown Timer when set and status is not expired.
   */
  expiresInSeconds?: number;
  /** Controlled remaining seconds. */
  remainingSeconds?: number;
  onExpire?: () => void;
  onRemainingChange?: (seconds: number) => void;
  /** Copy the secret key. Defaults to clipboard write. */
  onCopy?: (secretKey: string) => void | Promise<void>;
  /** Refresh / regenerate the QR + secret. */
  onRefresh?: () => void | Promise<void>;
  showCopy?: boolean;
  showRefresh?: boolean;
  showManualKey?: boolean;
  showCountdown?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  copyTooltip?: string;
  refreshLabel?: string;
  refreshTooltip?: string;
  refreshLoadingLabel?: string;
  expiredTitle?: React.ReactNode;
  expiredDescription?: React.ReactNode;
  errorMessage?: React.ReactNode;
  loadingLabel?: string;
  secretLabel?: string;
  copyButtonSize?: ButtonSize;
  refreshButtonSize?: ButtonSize;
  refreshButtonVariant?: ButtonVariant;
  iconSize?: IconSize;
  disabled?: boolean;
  /** Slot: replace QR image region. */
  qrSlot?: React.ReactNode;
  /** Slot: replace manual key row. */
  secretSlot?: React.ReactNode;
  /** Slot: replace status Badge. */
  badgeSlot?: React.ReactNode;
  /** Slot: replace action buttons. */
  actionSlot?: React.ReactNode;
  /** Slot: replace countdown. */
  countdownSlot?: React.ReactNode;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function QrGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12h2v2h-2zM15 12h2v2h-2zM12 15h2v2h-2zM15 15h2v2h-2z" fill="currentColor" />
      <rect x="5" y="5" width="2" height="2" fill="currentColor" />
      <rect x="13" y="5" width="2" height="2" fill="currentColor" />
      <rect x="5" y="13" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function KeyGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 10h5.5M14.5 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

function RefreshGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M16 10a6 6 0 1 1-1.6-4.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M16 4.5v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M8 2.75 13.5 12.5H2.5L8 2.75Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M8 6.5v3M8 11.25v.01" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function ClockGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 5v3.25L10 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatSecretKey(key: string): string {
  const compact = key.replace(/\s+/g, "").toUpperCase();
  return compact.replace(/(.{4})(?=.)/g, "$1 ");
}

async function writeClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  throw new Error("Clipboard unavailable");
}

export const QrCodeCard = React.forwardRef<HTMLDivElement, QrCodeCardProps>(function QrCodeCard(
  {
    variant = "stacked",
    cardVariant = "outlined",
    title = "Set up authenticator app",
    description = "Scan this QR code with your authenticator app, or enter the setup key manually.",
    qrSrc,
    qrAlt = "Authenticator setup QR code",
    secretKey = "",
    issuer,
    accountName,
    status: statusProp,
    defaultStatus = "idle",
    onStatusChange,
    expiresInSeconds,
    remainingSeconds,
    onExpire,
    onRemainingChange,
    onCopy,
    onRefresh,
    showCopy = true,
    showRefresh = true,
    showManualKey = true,
    showCountdown = true,
    copyLabel = "Copy key",
    copiedLabel = "Copied",
    copyTooltip = "Copy setup key to clipboard",
    refreshLabel = "Refresh code",
    refreshTooltip = "Generate a new QR code and setup key",
    refreshLoadingLabel = "Refreshing",
    expiredTitle = "QR code expired",
    expiredDescription = "Refresh to generate a new authenticator setup code.",
    errorMessage = "Could not load the QR code. Try refreshing.",
    loadingLabel = "Loading QR code",
    secretLabel = "Manual setup key",
    copyButtonSize = "sm",
    refreshButtonSize = "sm",
    refreshButtonVariant = "secondary",
    iconSize = "md",
    disabled = false,
    qrSlot,
    secretSlot,
    badgeSlot,
    actionSlot,
    countdownSlot,
    headerSlot,
    footerSlot,
    className = "",
    id,
  },
  ref
) {
  const reactId = React.useId();
  const rootId = id ?? `dk-qr-code-card-${reactId}`;
  const secretId = `${rootId}-secret`;
  const qrRegionId = `${rootId}-qr`;

  const controlledStatus = statusProp !== undefined;
  const [uncontrolledStatus, setUncontrolledStatus] = React.useState<QrCodeCardStatus>(defaultStatus);
  const status = controlledStatus ? statusProp! : uncontrolledStatus;

  const setStatus = React.useCallback(
    (next: QrCodeCardStatus) => {
      if (!controlledStatus) setUncontrolledStatus(next);
      onStatusChange?.(next);
    },
    [controlledStatus, onStatusChange]
  );

  const [copied, setCopied] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [localExpired, setLocalExpired] = React.useState(false);
  const timerRef = React.useRef<CountdownTimerHandle | null>(null);
  const copyResetRef = React.useRef<number | null>(null);

  const isExpired = status === "expired" || localExpired;
  const isLoading = status === "loading" || refreshing;
  const isError = status === "error";
  const interactive = !disabled && !isLoading;

  React.useEffect(() => {
    return () => {
      if (copyResetRef.current != null) window.clearTimeout(copyResetRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (status !== "expired") setLocalExpired(false);
  }, [status, qrSrc, secretKey, expiresInSeconds]);

  const handleExpire = () => {
    setLocalExpired(true);
    setStatus("expired");
    onExpire?.();
  };

  const handleCopy = async () => {
    if (!secretKey || !interactive || isExpired) return;
    try {
      if (onCopy) await onCopy(secretKey);
      else await writeClipboard(secretKey.replace(/\s+/g, ""));
      setCopied(true);
      if (copyResetRef.current != null) window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleRefresh = async () => {
    if (!onRefresh || disabled || refreshing) return;
    setRefreshing(true);
    setCopied(false);
    setLocalExpired(false);
    if (!controlledStatus) setUncontrolledStatus("loading");
    onStatusChange?.("loading");
    try {
      await onRefresh();
      if (!controlledStatus) setUncontrolledStatus("idle");
      onStatusChange?.("idle");
      timerRef.current?.reset(expiresInSeconds);
    } finally {
      setRefreshing(false);
    }
  };

  const statusBadge =
    badgeSlot ??
    (isLoading ? (
      <Badge
        appearance="icon-label"
        tone="neutral"
        size="sm"
        label="Loading"
        icon={
          <Icon size="sm">
            <QrGlyph />
          </Icon>
        }
        accessibleLabel={loadingLabel}
      />
    ) : isExpired ? (
      <Badge
        appearance="icon-label"
        tone="warning"
        size="sm"
        label="Expired"
        icon={<WarningGlyph />}
        accessibleLabel="QR code expired"
      />
    ) : isError ? (
      <Badge
        appearance="icon-label"
        tone="negative"
        size="sm"
        label="Error"
        icon={<WarningGlyph />}
        accessibleLabel="QR code error"
      />
    ) : expiresInSeconds != null ? (
      <Badge
        appearance="icon-label"
        tone="accent"
        size="sm"
        label="Active"
        icon={<ClockGlyph />}
        accessibleLabel="QR code active"
      />
    ) : (
      <Badge
        appearance="icon-label"
        tone="accent"
        size="sm"
        label="Ready"
        icon={
          <Icon size="sm">
            <QrGlyph />
          </Icon>
        }
        accessibleLabel="QR code ready"
      />
    ));

  const qrContent = (() => {
    if (qrSlot !== undefined) return qrSlot;
    if (isLoading) {
      return (
        <Skeleton
          shape="rectangle"
          width="12rem"
          height="12rem"
          label={loadingLabel}
          className="dk-qr-code-card__skeleton"
        />
      );
    }
    if (isExpired) {
      return (
        <div className="dk-qr-code-card__expired" role="status">
          <Icon size="lg" label="Expired">
            <WarningGlyph />
          </Icon>
          <p className="dk-qr-code-card__expired-title">{expiredTitle}</p>
          <p className="dk-qr-code-card__expired-desc">{expiredDescription}</p>
        </div>
      );
    }
    if (isError) {
      return (
        <div className="dk-qr-code-card__expired" role="alert">
          <Icon size="lg" label="Error">
            <WarningGlyph />
          </Icon>
          <p className="dk-qr-code-card__expired-title">{errorMessage}</p>
        </div>
      );
    }
    if (qrSrc) {
      return (
        <img
          className="dk-qr-code-card__image"
          src={qrSrc}
          alt={qrAlt}
          width={192}
          height={192}
          decoding="async"
        />
      );
    }
    return (
      <div className="dk-qr-code-card__placeholder" role="img" aria-label={qrAlt}>
        <Icon size="xl">
          <QrGlyph />
        </Icon>
        <span>QR unavailable</span>
      </div>
    );
  })();

  const secretRow =
    secretSlot ??
    (showManualKey ? (
      <div className="dk-qr-code-card__secret">
        <div className="dk-qr-code-card__secret-label">
          <Icon size={iconSize}>
            <KeyGlyph />
          </Icon>
          <span id={secretId}>{secretLabel}</span>
        </div>
        <code
          className="dk-qr-code-card__secret-value"
          aria-labelledby={secretId}
          aria-disabled={isExpired || !secretKey || undefined}
        >
          {secretKey ? formatSecretKey(secretKey) : "—"}
        </code>
      </div>
    ) : null);

  const actions =
    actionSlot ??
    ((showCopy || showRefresh) && (
      <div className="dk-qr-code-card__actions">
        {showCopy ? (
          <Tooltip content={copied ? copiedLabel : copyTooltip} placement="top">
            <Button
              size={copyButtonSize}
              variant={copied ? "success" : "secondary"}
              leadingIcon={copied ? <CheckGlyph /> : <CopyGlyph />}
              disabled={!interactive || isExpired || !secretKey}
              onClick={() => void handleCopy()}
              aria-describedby={secretId}
            >
              {copied ? copiedLabel : copyLabel}
            </Button>
          </Tooltip>
        ) : null}
        {showRefresh && onRefresh ? (
          <Tooltip content={refreshTooltip} placement="top">
            <Button
              size={refreshButtonSize}
              variant={refreshButtonVariant}
              leadingIcon={<RefreshGlyph />}
              disabled={disabled}
              loading={refreshing}
              loadingLabel={refreshLoadingLabel}
              onClick={() => void handleRefresh()}
            >
              {refreshLabel}
            </Button>
          </Tooltip>
        ) : null}
      </div>
    ));

  const countdown =
    countdownSlot ??
    (showCountdown && expiresInSeconds != null && !isError ? (
      <CountdownTimer
        ref={timerRef}
        flow="verification"
        variant="compact"
        duration={expiresInSeconds}
        remaining={remainingSeconds}
        defaultRemaining={expiresInSeconds}
        autoStart={!isExpired && status !== "loading"}
        paused={isLoading || disabled}
        label="Code expires in"
        showControls={false}
        onTick={onRemainingChange}
        onExpire={handleExpire}
        expiredSlot={
          <Button
            size="sm"
            variant="secondary"
            leadingIcon={<RefreshGlyph />}
            disabled={disabled || !onRefresh}
            loading={refreshing}
            onClick={() => void handleRefresh()}
          >
            {refreshLabel}
          </Button>
        }
      />
    ) : null);

  return (
    <div
      ref={ref}
      id={rootId}
      className={cx("dk-qr-code-card", `dk-qr-code-card--${variant}`, className)}
      data-variant={variant}
      data-status={isExpired ? "expired" : status}
      data-loading={isLoading || undefined}
    >
      <Card variant={cardVariant} className="dk-qr-code-card__card">
        {headerSlot ?? (
          <Card.Header className="dk-qr-code-card__header">
            <div className="dk-qr-code-card__heading">
              <div className="dk-qr-code-card__title-row">
                <Icon size={iconSize} className="dk-qr-code-card__title-icon">
                  <QrGlyph />
                </Icon>
                <Card.Title>{title}</Card.Title>
              </div>
              {description ? <Card.Description>{description}</Card.Description> : null}
              {(issuer || accountName) && (
                <Card.Metadata className="dk-qr-code-card__meta">
                  {issuer ? <span>{issuer}</span> : null}
                  {issuer && accountName ? <span aria-hidden="true">·</span> : null}
                  {accountName ? <span>{accountName}</span> : null}
                </Card.Metadata>
              )}
            </div>
            <Card.Status>{statusBadge}</Card.Status>
          </Card.Header>
        )}

        <Card.Body className="dk-qr-code-card__body">
          <div
            id={qrRegionId}
            className="dk-qr-code-card__qr"
            data-expired={isExpired || undefined}
            aria-busy={isLoading || undefined}
          >
            {qrContent}
          </div>

          {secretRow}
          {countdown}
          {actions}
          {footerSlot}
        </Card.Body>
      </Card>
    </div>
  );
});

QrCodeCard.displayName = "QrCodeCard";
export default QrCodeCard;
