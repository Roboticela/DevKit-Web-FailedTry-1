import * as React from "react";
import {
  Card,
  type CardVariant,
} from "../../../../../../../card/nextjs-compact/v1/files/components/ui/Card";
import { Badge } from "../../../../../../../badge/nextjs-compact/v1/files/components/ui/Badge";
import { Avatar } from "../../../../../../../avatar/nextjs-compact/v1/files/components/ui/Avatar";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import { Dialog } from "../../../../../../../dialog/nextjs-compact/v1/files/components/ui/Dialog";
import { EmptyState } from "../../../../../../../empty-state/nextjs-compact/v1/files/components/ui/EmptyState";
import { Icon, type IconSize } from "../../../../../../../icon/nextjs-compact/v1/files/components/ui/Icon";
import { TextInput } from "../../../../../../../text-input/nextjs-compact/v1/files/components/ui/TextInput";

/**
 * Trusted Devices — manage remembered devices used during authentication.
 * Composes Card, Badge, Avatar, Button, Dialog, Empty State, Icon, and Text Input
 * (rename). Never invent custom layout chrome.
 */

export type TrustedDeviceKind =
  | "desktop"
  | "laptop"
  | "phone"
  | "tablet"
  | "unknown";

export type TrustedDevice = {
  id: string;
  name: string;
  deviceKind?: TrustedDeviceKind;
  browser?: string;
  os?: string;
  lastActiveAt?: string | Date | null;
  trustedAt: string | Date;
  /** Device currently in use for this browser. */
  isCurrent?: boolean;
};

export type TrustedDevicesVariant = "stacked" | "compact";

export type TrustedDevicesProps = {
  devices?: TrustedDevice[];
  variant?: TrustedDevicesVariant;
  cardVariant?: CardVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  locale?: string;
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
  onRename?: (id: string, name: string) => void | Promise<void>;
  onRemove?: (id: string) => void | Promise<void>;
  onRemoveAll?: () => void | Promise<void>;
  showRemoveAll?: boolean;
  renameLabel?: string;
  removeLabel?: string;
  removeAllLabel?: string;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyActions?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  busyId?: string | null;
  actionButtonSize?: ButtonSize;
  removeAllButtonVariant?: ButtonVariant;
  iconSize?: IconSize;
  headerSlot?: React.ReactNode;
  emptySlot?: React.ReactNode;
  itemSlot?: (device: TrustedDevice, controls: TrustedDeviceItemControls) => React.ReactNode;
  className?: string;
  id?: string;
};

export type TrustedDeviceItemControls = {
  disabled: boolean;
  busy: boolean;
  openRename: () => void;
  openRemove: () => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toDate(value: string | Date | null | undefined): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateTime(
  value: string | Date | null | undefined,
  locale: string,
  dateStyle: Intl.DateTimeFormatOptions["dateStyle"],
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"]
): string {
  const date = toDate(value);
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle,
      ...(timeStyle ? { timeStyle } : {}),
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function DesktopGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="3.5" width="14.5" height="10" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 15.5h4M10 13.5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LaptopGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.5" y="4" width="13" height="9" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 15.5h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="6" y="2.5" width="8" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 14.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TabletGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.5" y="2.5" width="13" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 14.75h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UnknownDeviceGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v4.5M10 6.75v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 2.5 15.5 5v4.2c0 3.4-2.2 5.9-5.5 7.3C6.7 15.1 4.5 12.6 4.5 9.2V5L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CurrentGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.25" fill="currentColor" />
    </svg>
  );
}

function BrowserGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2 5.5h12" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function OsGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.5" y="3.5" width="11" height="9" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5.5 12.5h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function ClockGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 5.5V8l2 1.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function TrustDateGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M8 2.25 12.25 4v3.15c0 2.55-1.65 4.42-4.25 5.48C5.4 11.57 3.75 9.7 3.75 7.15V4L8 2.25Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="m6.25 7.5 1.25 1.25 2.5-2.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RenameGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.5 14.5 13.2 5.8a1.5 1.5 0 0 1 2.12 0l.88.88a1.5 1.5 0 0 1 0 2.12L7.5 17.5H4.5v-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.5 6.5h11M8 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M6.5 6.5 7.25 15a1 1 0 0 0 1 .9h3.5a1 1 0 0 0 1-.9L13.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyDevicesGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M12 3.25 18.5 5.75v5.1c0 4.05-2.7 7-6.5 8.65C8.2 17.85 5.5 14.9 5.5 10.85v-5.1L12 3.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 11.25 1.75 1.75 3.5-3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DEVICE_META: Record<TrustedDeviceKind, { label: string; icon: React.ReactNode }> = {
  desktop: { label: "Desktop", icon: <DesktopGlyph /> },
  laptop: { label: "Laptop", icon: <LaptopGlyph /> },
  phone: { label: "Phone", icon: <PhoneGlyph /> },
  tablet: { label: "Tablet", icon: <TabletGlyph /> },
  unknown: { label: "Device", icon: <UnknownDeviceGlyph /> },
};

function MetaLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="dk-trusted-devices__meta">
      <Icon size="xs" className="dk-trusted-devices__meta-icon" label={label}>
        {icon}
      </Icon>
      <span className="dk-trusted-devices__meta-text">{value}</span>
    </span>
  );
}

export const TrustedDevices = React.forwardRef<HTMLDivElement, TrustedDevicesProps>(
  function TrustedDevices(
    {
      devices = [],
      variant = "stacked",
      cardVariant = "outlined",
      title = "Trusted devices",
      description = "Devices remembered after authentication. Remove any you no longer recognize.",
      locale = "en-US",
      dateStyle = "medium",
      timeStyle = "short",
      onRename,
      onRemove,
      onRemoveAll,
      showRemoveAll = true,
      renameLabel = "Rename",
      removeLabel = "Remove",
      removeAllLabel = "Remove all",
      emptyTitle = "No trusted devices",
      emptyDescription = "When you trust a device during sign-in, it will appear here.",
      emptyActions,
      disabled = false,
      loading = false,
      busyId = null,
      actionButtonSize = "sm",
      removeAllButtonVariant = "destructive",
      iconSize = "md",
      headerSlot,
      emptySlot,
      itemSlot,
      className = "",
      id,
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = id ?? `dk-trusted-devices-${reactId}`;

    const [renameTarget, setRenameTarget] = React.useState<TrustedDevice | null>(null);
    const [renameValue, setRenameValue] = React.useState("");
    const [removeTarget, setRemoveTarget] = React.useState<TrustedDevice | null>(null);
    const [removeAllOpen, setRemoveAllOpen] = React.useState(false);
    const [actionBusy, setActionBusy] = React.useState(false);

    const sortedDevices = React.useMemo(() => {
      return [...devices].sort((a, b) => {
        if (a.isCurrent && !b.isCurrent) return -1;
        if (!a.isCurrent && b.isCurrent) return 1;
        const aTime = toDate(a.lastActiveAt)?.getTime() ?? toDate(a.trustedAt)?.getTime() ?? 0;
        const bTime = toDate(b.lastActiveAt)?.getTime() ?? toDate(b.trustedAt)?.getTime() ?? 0;
        return bTime - aTime;
      });
    }, [devices]);

    const openRename = (device: TrustedDevice) => {
      setRenameTarget(device);
      setRenameValue(device.name);
    };

    const closeRename = () => {
      if (actionBusy) return;
      setRenameTarget(null);
      setRenameValue("");
    };

    const submitRename = async () => {
      if (!renameTarget || !onRename) return;
      const next = renameValue.trim();
      if (!next || next === renameTarget.name) {
        closeRename();
        return;
      }
      setActionBusy(true);
      try {
        await onRename(renameTarget.id, next);
        setRenameTarget(null);
        setRenameValue("");
      } finally {
        setActionBusy(false);
      }
    };

    const submitRemove = async () => {
      if (!removeTarget || !onRemove) return;
      setActionBusy(true);
      try {
        await onRemove(removeTarget.id);
        setRemoveTarget(null);
      } finally {
        setActionBusy(false);
      }
    };

    const submitRemoveAll = async () => {
      if (!onRemoveAll) return;
      setActionBusy(true);
      try {
        await onRemoveAll();
        setRemoveAllOpen(false);
      } finally {
        setActionBusy(false);
      }
    };

    const removeAllAction =
      showRemoveAll && onRemoveAll && devices.length > 0 ? (
        <Button
          size={actionButtonSize}
          variant={removeAllButtonVariant}
          leadingIcon={<TrashGlyph />}
          disabled={disabled || loading || actionBusy}
          onClick={() => setRemoveAllOpen(true)}
        >
          {removeAllLabel}
        </Button>
      ) : null;

    const renderDevice = (device: TrustedDevice) => {
      const kind = device.deviceKind ?? "unknown";
      const meta = DEVICE_META[kind] ?? DEVICE_META.unknown;
      const rowBusy = loading || actionBusy || busyId === device.id;
      const controls: TrustedDeviceItemControls = {
        disabled: disabled || rowBusy,
        busy: rowBusy,
        openRename: () => openRename(device),
        openRemove: () => setRemoveTarget(device),
      };

      if (itemSlot) return <li key={device.id}>{itemSlot(device, controls)}</li>;

      return (
        <li key={device.id} className="dk-trusted-devices__item">
          <div className="dk-trusted-devices__identity">
            <Avatar
              label={device.name}
              initials={initialsFromName(device.name)}
              size={40}
              shape="rounded"
              status={device.isCurrent ? "online" : null}
              badge={
                <Icon size="xs" label={meta.label}>
                  {meta.icon}
                </Icon>
              }
            />
            <div className="dk-trusted-devices__copy">
              <div className="dk-trusted-devices__name-row">
                <span className="dk-trusted-devices__name">{device.name}</span>
                {device.isCurrent ? (
                  <Badge
                    appearance="icon-label"
                    tone="positive"
                    size="sm"
                    label="This device"
                    icon={<CurrentGlyph />}
                    accessibleLabel="Current device"
                  />
                ) : null}
                <Badge
                  appearance="icon-label"
                  tone="accent"
                  size="sm"
                  label="Trusted"
                  icon={<ShieldGlyph />}
                  accessibleLabel="Trusted device"
                />
              </div>
              <div className="dk-trusted-devices__meta-row">
                {device.browser ? (
                  <MetaLine icon={<BrowserGlyph />} label="Browser" value={device.browser} />
                ) : null}
                {device.os ? <MetaLine icon={<OsGlyph />} label="Operating system" value={device.os} /> : null}
                <MetaLine icon={meta.icon} label="Device type" value={meta.label} />
              </div>
              <div className="dk-trusted-devices__meta-row">
                <MetaLine
                  icon={<ClockGlyph />}
                  label="Last activity"
                  value={`Last activity ${formatDateTime(device.lastActiveAt, locale, dateStyle, timeStyle)}`}
                />
                <MetaLine
                  icon={<TrustDateGlyph />}
                  label="Trusted since"
                  value={`Trusted ${formatDateTime(device.trustedAt, locale, dateStyle)}`}
                />
              </div>
            </div>
          </div>

          <div className="dk-trusted-devices__actions">
            {onRename ? (
              <Button
                size={actionButtonSize}
                variant="quiet"
                leadingIcon={<RenameGlyph />}
                disabled={controls.disabled}
                onClick={controls.openRename}
              >
                {renameLabel}
              </Button>
            ) : null}
            {onRemove ? (
              <Button
                size={actionButtonSize}
                variant="destructive"
                leadingIcon={<TrashGlyph />}
                disabled={controls.disabled}
                loading={busyId === device.id}
                onClick={controls.openRemove}
              >
                {removeLabel}
              </Button>
            ) : null}
          </div>
        </li>
      );
    };

    return (
      <div
        ref={ref}
        id={rootId}
        className={cx("dk-trusted-devices", `dk-trusted-devices--${variant}`, className)}
        data-variant={variant}
        data-loading={loading || undefined}
      >
        <Card variant={cardVariant} className="dk-trusted-devices__card">
          {headerSlot ?? (
            <Card.Header className="dk-trusted-devices__header">
              <div className="dk-trusted-devices__heading">
                <div className="dk-trusted-devices__title-row">
                  <Icon size={iconSize} className="dk-trusted-devices__title-icon">
                    <ShieldGlyph />
                  </Icon>
                  <Card.Title>{title}</Card.Title>
                </div>
                {description ? <Card.Description>{description}</Card.Description> : null}
              </div>
              {removeAllAction ? <Card.Actions>{removeAllAction}</Card.Actions> : null}
            </Card.Header>
          )}

          <Card.Body className="dk-trusted-devices__body">
            {sortedDevices.length === 0
              ? emptySlot ?? (
                  <EmptyState
                    variant={variant === "compact" ? "compact" : "stacked"}
                    title={emptyTitle}
                    description={emptyDescription}
                    icon={<EmptyDevicesGlyph />}
                    actions={emptyActions}
                  />
                )
              : (
                  <ul className="dk-trusted-devices__list" aria-label="Trusted devices">
                    {sortedDevices.map(renderDevice)}
                  </ul>
                )}
          </Card.Body>
        </Card>

        <Dialog
          open={Boolean(renameTarget)}
          onOpenChange={(open) => {
            if (!open) closeRename();
          }}
          title="Rename trusted device"
          description="Choose a name you’ll recognize on this device."
          size="sm"
          closeOnOutsideClick={!actionBusy}
          closeOnEscape={!actionBusy}
          actions={
            <>
              <Button size="sm" variant="secondary" disabled={actionBusy} onClick={closeRename}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                leadingIcon={<RenameGlyph />}
                loading={actionBusy}
                disabled={disabled || !renameValue.trim()}
                onClick={() => void submitRename()}
              >
                Save name
              </Button>
            </>
          }
        >
          <TextInput
            label="Device name"
            value={renameValue}
            onValueChange={setRenameValue}
            leadingIcon={<RenameGlyph />}
            disabled={actionBusy}
            autoFocus
            required
          />
        </Dialog>

        <Dialog
          open={Boolean(removeTarget)}
          onOpenChange={(open) => {
            if (!open && !actionBusy) setRemoveTarget(null);
          }}
          title="Remove trusted device?"
          description={
            removeTarget
              ? `“${removeTarget.name}” will need to verify again on the next sign-in.`
              : undefined
          }
          size="sm"
          closeOnOutsideClick={!actionBusy}
          closeOnEscape={!actionBusy}
          actions={
            <>
              <Button
                size="sm"
                variant="secondary"
                disabled={actionBusy}
                onClick={() => setRemoveTarget(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                leadingIcon={<TrashGlyph />}
                loading={actionBusy}
                disabled={disabled}
                onClick={() => void submitRemove()}
              >
                {removeLabel}
              </Button>
            </>
          }
        >
          {removeTarget ? (
            <div className="dk-trusted-devices__dialog-preview">
              <Avatar
                label={removeTarget.name}
                initials={initialsFromName(removeTarget.name)}
                size={40}
                shape="rounded"
                badge={
                  <Icon
                    size="xs"
                    label={DEVICE_META[removeTarget.deviceKind ?? "unknown"].label}
                  >
                    {DEVICE_META[removeTarget.deviceKind ?? "unknown"].icon}
                  </Icon>
                }
              />
              <div>
                <div className="dk-trusted-devices__name">{removeTarget.name}</div>
                <div className="dk-trusted-devices__dialog-meta">
                  {[removeTarget.browser, removeTarget.os].filter(Boolean).join(" · ") ||
                    "Trusted device"}
                </div>
              </div>
            </div>
          ) : null}
        </Dialog>

        <Dialog
          open={removeAllOpen}
          onOpenChange={(open) => {
            if (!open && !actionBusy) setRemoveAllOpen(false);
          }}
          title="Remove all trusted devices?"
          description={`This removes trust from ${devices.length} device${
            devices.length === 1 ? "" : "s"
          }. You’ll need to verify again on the next sign-in.`}
          size="sm"
          closeOnOutsideClick={!actionBusy}
          closeOnEscape={!actionBusy}
          actions={
            <>
              <Button
                size="sm"
                variant="secondary"
                disabled={actionBusy}
                onClick={() => setRemoveAllOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                leadingIcon={<TrashGlyph />}
                loading={actionBusy}
                disabled={disabled}
                onClick={() => void submitRemoveAll()}
              >
                Remove all
              </Button>
            </>
          }
        >
          <p className="dk-trusted-devices__dialog-copy">
            Use this if you lost a device or notice unfamiliar remembered devices.
          </p>
        </Dialog>
      </div>
    );
  }
);

TrustedDevices.displayName = "TrustedDevices";
export default TrustedDevices;
