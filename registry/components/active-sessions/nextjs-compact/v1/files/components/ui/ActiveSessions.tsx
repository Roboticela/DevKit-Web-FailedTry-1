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
import { IconButton } from "../../../../../../../icon-button/nextjs-compact/v1/files/components/ui/IconButton";
import { Dialog } from "../../../../../../../dialog/nextjs-compact/v1/files/components/ui/Dialog";
import { DropdownMenu } from "../../../../../../../dropdown-menu/nextjs-compact/v1/files/components/ui/DropdownMenu";
import { Tooltip } from "../../../../../../../tooltip/nextjs-compact/v1/files/components/ui/Tooltip";
import { Skeleton } from "../../../../../../../skeleton/nextjs-compact/v1/files/components/ui/Skeleton";
import { Icon, type IconSize } from "../../../../../../../icon/nextjs-compact/v1/files/components/ui/Icon";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSort,
} from "../../../../../../../data-table/nextjs-compact/v1/files/components/ui/DataTable";
import {
  Tag,
  TagGroup,
} from "../../../../../../../tag/nextjs-compact/v1/files/components/ui/Tag";
import {
  AuthenticationLoading,
  type AuthenticationLoadingVariant,
} from "../../../../../../../authentication-loading/nextjs-compact/v1/files/components/ui/AuthenticationLoading";
import {
  AuthenticationError,
  type AuthenticationErrorReason,
  type AuthenticationErrorVariant,
} from "../../../../../../../authentication-error/nextjs-compact/v1/files/components/ui/AuthenticationError";

/**
 * Active Sessions — manage authenticated sessions across devices.
 * Composes Data Table, Card, Badge, Avatar, Button, Dialog, Dropdown Menu,
 * Tooltip, Empty State (via Data Table), Skeleton, Icon, Tag,
 * Authentication Loading, and Authentication Error.
 * Never recreate those primitives.
 */

export type ActiveSessionDeviceKind =
  | "desktop"
  | "laptop"
  | "phone"
  | "tablet"
  | "unknown";

export type ActiveSession = {
  id: string;
  deviceName: string;
  deviceKind?: ActiveSessionDeviceKind;
  browser?: string;
  os?: string;
  location?: string;
  ipAddress?: string;
  lastActiveAt: string | Date;
  isCurrent?: boolean;
  trusted?: boolean;
};

export type ActiveSessionsFilterId = "all" | "current" | "trusted" | "other";

export type ActiveSessionsStatus = "idle" | "loading" | "error";

export type ActiveSessionsVariant = "stacked" | "compact";

export type ActiveSessionsProps = {
  sessions?: ActiveSession[];
  variant?: ActiveSessionsVariant;
  cardVariant?: CardVariant;
  status?: ActiveSessionsStatus;
  defaultStatus?: ActiveSessionsStatus;
  onStatusChange?: (status: ActiveSessionsStatus) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (query: string) => void;
  filter?: ActiveSessionsFilterId;
  defaultFilter?: ActiveSessionsFilterId;
  onFilterChange?: (filter: ActiveSessionsFilterId) => void;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showIp?: boolean;
  locale?: string;
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
  /**
   * Revoke a single session. Resolve → close dialog; reject → Authentication Error.
   */
  onRevoke?: (id: string) => void | Promise<void>;
  /**
   * Revoke every session except the current one (when present).
   * Resolve → close dialog; reject → Authentication Error.
   */
  onRevokeAll?: () => void | Promise<void>;
  onTrust?: (id: string, trusted: boolean) => void | Promise<void>;
  onRetry?: () => void;
  showRevokeAll?: boolean;
  revokeLabel?: string;
  revokeAllLabel?: string;
  trustLabel?: string;
  untrustLabel?: string;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyActions?: React.ReactNode;
  errorReason?: AuthenticationErrorReason;
  defaultErrorReason?: AuthenticationErrorReason;
  onErrorReasonChange?: (reason: AuthenticationErrorReason) => void;
  errorTitle?: React.ReactNode;
  errorDescription?: React.ReactNode;
  loadingVariant?: AuthenticationLoadingVariant;
  errorVariant?: AuthenticationErrorVariant;
  disabled?: boolean;
  /** Row-level busy id while an action runs. */
  busyId?: string | null;
  /** Soft loading overlay with Skeleton rows (in addition to status="loading"). */
  refreshing?: boolean;
  actionButtonSize?: ButtonSize;
  revokeAllButtonVariant?: ButtonVariant;
  iconSize?: IconSize;
  headerSlot?: React.ReactNode;
  toolbarSlot?: React.ReactNode;
  emptySlot?: React.ReactNode;
  loadingSlot?: React.ReactNode;
  errorSlot?: React.ReactNode;
  className?: string;
  id?: string;
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

function formatActivity(
  value: string | Date | null | undefined,
  locale: string,
  dateStyle: Intl.DateTimeFormatOptions["dateStyle"],
  timeStyle: Intl.DateTimeFormatOptions["timeStyle"]
): string {
  const date = toDate(value);
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle, timeStyle }).format(date);
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

function mapSessionError(error: unknown): AuthenticationErrorReason {
  if (!error) return "unknown";
  if (typeof error === "object" && error !== null && "reason" in error) {
    const reason = String((error as { reason: string }).reason);
    if (
      reason === "invalid" ||
      reason === "expired" ||
      reason === "locked" ||
      reason === "network" ||
      reason === "canceled" ||
      reason === "unknown"
    ) {
      return reason;
    }
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("network")) return "network";
    if (msg.includes("expir") || msg.includes("timeout")) return "expired";
    if (msg.includes("lock")) return "locked";
    if (msg.includes("cancel")) return "canceled";
  }
  return "unknown";
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

function CurrentGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.25" fill="currentColor" />
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

function LocationGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M8 13.5s4.25-3.1 4.25-6.25a4.25 4.25 0 1 0-8.5 0C3.75 10.4 8 13.5 8 13.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="7.25" r="1.35" stroke="currentColor" strokeWidth="1.25" />
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

function IpGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 5.25v3.5M8 10.75v.01" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function RevokeGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="m7 7 6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoreGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="10" r="1.25" fill="currentColor" />
      <circle cx="10" cy="10" r="1.25" fill="currentColor" />
      <circle cx="15.5" cy="10" r="1.25" fill="currentColor" />
    </svg>
  );
}

function SessionsEmptyGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 18.5h6M12 16v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

const DEVICE_META: Record<
  ActiveSessionDeviceKind,
  { label: string; icon: React.ReactNode }
> = {
  desktop: { label: "Desktop", icon: <DesktopGlyph /> },
  laptop: { label: "Laptop", icon: <LaptopGlyph /> },
  phone: { label: "Phone", icon: <PhoneGlyph /> },
  tablet: { label: "Tablet", icon: <TabletGlyph /> },
  unknown: { label: "Device", icon: <UnknownDeviceGlyph /> },
};

const FILTER_OPTIONS: {
  id: ActiveSessionsFilterId;
  label: string;
  icon?: React.ReactNode;
}[] = [
  { id: "all", label: "All", icon: <SessionsEmptyGlyph /> },
  { id: "current", label: "This device", icon: <CurrentGlyph /> },
  { id: "trusted", label: "Trusted", icon: <ShieldGlyph /> },
  { id: "other", label: "Other devices", icon: <LaptopGlyph /> },
];

function matchesFilter(session: ActiveSession, filter: ActiveSessionsFilterId): boolean {
  if (filter === "all") return true;
  if (filter === "current") return Boolean(session.isCurrent);
  if (filter === "trusted") return Boolean(session.trusted);
  return !session.isCurrent;
}

function sessionSearchBlob(session: ActiveSession): string {
  const kind = DEVICE_META[session.deviceKind ?? "unknown"]?.label ?? "";
  return [
    session.deviceName,
    kind,
    session.browser,
    session.os,
    session.location,
    session.ipAddress,
    session.isCurrent ? "current this device" : "",
    session.trusted ? "trusted" : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function MetaCell({
  icon,
  label,
  value,
  tooltip,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  tooltip?: string;
}) {
  const text = value?.trim() || "—";
  const content = (
    <span className="dk-active-sessions__meta">
      <Icon size="xs" className="dk-active-sessions__meta-icon" label={label}>
        {icon}
      </Icon>
      <span className="dk-active-sessions__meta-text">{text}</span>
    </span>
  );
  if (!tooltip || text === "—") return content;
  return (
    <Tooltip content={tooltip}>
      <button type="button" className="dk-active-sessions__meta-trigger">
        {content}
      </button>
    </Tooltip>
  );
}

export const ActiveSessions = React.forwardRef<HTMLDivElement, ActiveSessionsProps>(
  function ActiveSessions(
    {
      sessions = [],
      variant = "stacked",
      cardVariant = "outlined",
      status: statusProp,
      defaultStatus = "idle",
      onStatusChange,
      title = "Active sessions",
      description = "Review devices signed in to your account and revoke access you don’t recognize.",
      search: searchProp,
      defaultSearch = "",
      onSearchChange,
      filter: filterProp,
      defaultFilter = "all",
      onFilterChange,
      sort: sortProp,
      defaultSort = { columnId: "lastActiveAt", direction: "desc" },
      onSortChange,
      showSearch = true,
      showFilters = true,
      showIp = true,
      locale = "en-US",
      dateStyle = "medium",
      timeStyle = "short",
      onRevoke,
      onRevokeAll,
      onTrust,
      onRetry,
      showRevokeAll = true,
      revokeLabel = "Revoke",
      revokeAllLabel = "Revoke all other sessions",
      trustLabel = "Mark trusted",
      untrustLabel = "Remove trust",
      emptyTitle = "No active sessions",
      emptyDescription = "There are no signed-in devices to show right now.",
      emptyActions,
      errorReason: errorReasonProp,
      defaultErrorReason = "unknown",
      onErrorReasonChange,
      errorTitle,
      errorDescription,
      loadingVariant = "stacked",
      errorVariant = "stacked",
      disabled = false,
      busyId = null,
      refreshing = false,
      actionButtonSize = "sm",
      revokeAllButtonVariant = "destructive",
      iconSize = "md",
      headerSlot,
      toolbarSlot,
      emptySlot,
      loadingSlot,
      errorSlot,
      className = "",
      id,
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = id ?? `dk-active-sessions-${reactId}`;

    const controlledStatus = statusProp !== undefined;
    const [uncontrolledStatus, setUncontrolledStatus] =
      React.useState<ActiveSessionsStatus>(defaultStatus);
    const status = controlledStatus ? statusProp! : uncontrolledStatus;

    const setStatus = React.useCallback(
      (next: ActiveSessionsStatus) => {
        if (!controlledStatus) setUncontrolledStatus(next);
        onStatusChange?.(next);
      },
      [controlledStatus, onStatusChange]
    );

    const controlledSearch = searchProp !== undefined;
    const controlledFilter = filterProp !== undefined;
    const [uncontrolledSearch, setUncontrolledSearch] = React.useState(defaultSearch);
    const [uncontrolledFilter, setUncontrolledFilter] =
      React.useState<ActiveSessionsFilterId>(defaultFilter);
    const search = controlledSearch ? searchProp! : uncontrolledSearch;
    const filter = controlledFilter ? filterProp! : uncontrolledFilter;

    const setSearch = React.useCallback(
      (next: string) => {
        if (!controlledSearch) setUncontrolledSearch(next);
        onSearchChange?.(next);
      },
      [controlledSearch, onSearchChange]
    );

    const setFilter = React.useCallback(
      (next: ActiveSessionsFilterId) => {
        if (!controlledFilter) setUncontrolledFilter(next);
        onFilterChange?.(next);
      },
      [controlledFilter, onFilterChange]
    );

    const controlledError = errorReasonProp !== undefined;
    const [uncontrolledError, setUncontrolledError] =
      React.useState<AuthenticationErrorReason>(defaultErrorReason);
    const errorReason = controlledError ? errorReasonProp! : uncontrolledError;

    const setErrorReason = React.useCallback(
      (next: AuthenticationErrorReason) => {
        if (!controlledError) setUncontrolledError(next);
        onErrorReasonChange?.(next);
      },
      [controlledError, onErrorReasonChange]
    );

    const [revokeTarget, setRevokeTarget] = React.useState<ActiveSession | null>(null);
    const [revokeAllOpen, setRevokeAllOpen] = React.useState(false);
    const [actionBusy, setActionBusy] = React.useState(false);

    const otherSessions = React.useMemo(
      () => sessions.filter((session) => !session.isCurrent),
      [sessions]
    );

    const activeFilters = React.useMemo(() => {
      const hasCurrent = sessions.some((session) => session.isCurrent);
      const hasTrusted = sessions.some((session) => session.trusted);
      const hasOther = sessions.some((session) => !session.isCurrent);
      return FILTER_OPTIONS.filter((option) => {
        if (option.id === "all") return true;
        if (option.id === "current") return hasCurrent;
        if (option.id === "trusted") return hasTrusted;
        return hasOther;
      });
    }, [sessions]);

    const failAction = (error: unknown) => {
      setErrorReason(mapSessionError(error));
      setStatus("error");
    };

    const submitRevoke = async () => {
      if (!revokeTarget || !onRevoke) return;
      setActionBusy(true);
      try {
        await onRevoke(revokeTarget.id);
        setRevokeTarget(null);
      } catch (error) {
        setRevokeTarget(null);
        failAction(error);
      } finally {
        setActionBusy(false);
      }
    };

    const submitRevokeAll = async () => {
      if (!onRevokeAll) return;
      setActionBusy(true);
      try {
        await onRevokeAll();
        setRevokeAllOpen(false);
      } catch (error) {
        setRevokeAllOpen(false);
        failAction(error);
      } finally {
        setActionBusy(false);
      }
    };

    const handleTrust = async (session: ActiveSession, trusted: boolean) => {
      if (!onTrust) return;
      setActionBusy(true);
      try {
        await onTrust(session.id, trusted);
      } catch (error) {
        failAction(error);
      } finally {
        setActionBusy(false);
      }
    };

    const columns = React.useMemo<DataTableColumn<ActiveSession>[]>(() => {
      const cols: DataTableColumn<ActiveSession>[] = [
        {
          id: "device",
          header: "Device",
          sortable: true,
          getSortValue: (row) => row.deviceName.toLowerCase(),
          getSearchValue: (row) => sessionSearchBlob(row),
          cell: (row) => {
            const kind = row.deviceKind ?? "unknown";
            const meta = DEVICE_META[kind] ?? DEVICE_META.unknown;
            return (
              <div className="dk-active-sessions__identity">
                <Avatar
                  label={row.deviceName}
                  initials={initialsFromName(row.deviceName)}
                  size={36}
                  shape="rounded"
                  status={row.isCurrent ? "online" : null}
                  badge={
                    <Icon size="xs" label={meta.label}>
                      {meta.icon}
                    </Icon>
                  }
                />
                <div className="dk-active-sessions__identity-copy">
                  <div className="dk-active-sessions__name-row">
                    <span className="dk-active-sessions__name">{row.deviceName}</span>
                    {row.isCurrent ? (
                      <Badge
                        appearance="icon-label"
                        tone="positive"
                        size="sm"
                        label="Current"
                        icon={<CurrentGlyph />}
                        accessibleLabel="Current session"
                      />
                    ) : null}
                    {row.trusted ? (
                      <Badge
                        appearance="icon-label"
                        tone="accent"
                        size="sm"
                        label="Trusted"
                        icon={<ShieldGlyph />}
                        accessibleLabel="Trusted device"
                      />
                    ) : null}
                  </div>
                  <span className="dk-active-sessions__device-kind">{meta.label}</span>
                </div>
              </div>
            );
          },
        },
        {
          id: "browser",
          header: "Browser",
          sortable: true,
          getSortValue: (row) => (row.browser ?? "").toLowerCase(),
          getSearchValue: (row) => row.browser ?? "",
          cell: (row) => (
            <MetaCell
              icon={<BrowserGlyph />}
              label="Browser"
              value={row.browser}
              tooltip={row.browser ? `Browser: ${row.browser}` : undefined}
            />
          ),
        },
        {
          id: "os",
          header: "OS",
          sortable: true,
          getSortValue: (row) => (row.os ?? "").toLowerCase(),
          getSearchValue: (row) => row.os ?? "",
          cell: (row) => (
            <MetaCell
              icon={<OsGlyph />}
              label="Operating system"
              value={row.os}
              tooltip={row.os ? `OS: ${row.os}` : undefined}
            />
          ),
        },
        {
          id: "location",
          header: "Location",
          sortable: true,
          getSortValue: (row) => (row.location ?? "").toLowerCase(),
          getSearchValue: (row) => row.location ?? "",
          cell: (row) => (
            <MetaCell
              icon={<LocationGlyph />}
              label="Approximate location"
              value={row.location}
              tooltip={
                row.location
                  ? `Approximate location: ${row.location}`
                  : "Location unavailable"
              }
            />
          ),
        },
      ];

      if (showIp) {
        cols.push({
          id: "ipAddress",
          header: "IP",
          sortable: true,
          getSortValue: (row) => (row.ipAddress ?? "").toLowerCase(),
          getSearchValue: (row) => row.ipAddress ?? "",
          cell: (row) => (
            <MetaCell
              icon={<IpGlyph />}
              label="IP address"
              value={row.ipAddress}
              tooltip={row.ipAddress ? `IP address: ${row.ipAddress}` : undefined}
            />
          ),
        });
      }

      cols.push(
        {
          id: "lastActiveAt",
          header: "Last activity",
          sortable: true,
          getSortValue: (row) => toDate(row.lastActiveAt)?.getTime() ?? 0,
          getSearchValue: (row) =>
            formatActivity(row.lastActiveAt, locale, dateStyle, timeStyle),
          cell: (row) => (
            <MetaCell
              icon={<ClockGlyph />}
              label="Last activity"
              value={formatActivity(row.lastActiveAt, locale, dateStyle, timeStyle)}
              tooltip={`Last activity: ${formatActivity(row.lastActiveAt, locale, dateStyle, timeStyle)}`}
            />
          ),
        },
        {
          id: "actions",
          header: "Actions",
          searchable: false,
          sortable: false,
          align: "end",
          cell: (row) => {
            const rowBusy = actionBusy || busyId === row.id || refreshing;
            const canRevoke = Boolean(onRevoke) && !row.isCurrent;
            const menuItems = [
              onTrust
                ? {
                    id: "trust",
                    label: row.trusted ? untrustLabel : trustLabel,
                    icon: <ShieldGlyph />,
                    disabled: disabled || rowBusy,
                    onSelect: () => void handleTrust(row, !row.trusted),
                  }
                : null,
              canRevoke
                ? {
                    id: "revoke",
                    label: revokeLabel,
                    icon: <RevokeGlyph />,
                    destructive: true,
                    disabled: disabled || rowBusy,
                    onSelect: () => setRevokeTarget(row),
                  }
                : null,
            ].filter(Boolean) as {
              id: string;
              label: string;
              icon: React.ReactNode;
              destructive?: boolean;
              disabled?: boolean;
              onSelect: () => void;
            }[];

            if (menuItems.length === 0) {
              return (
                <span className="dk-active-sessions__actions-empty" aria-hidden="true">
                  —
                </span>
              );
            }

            return (
              <div className="dk-active-sessions__actions">
                {canRevoke ? (
                  <Tooltip content={`${revokeLabel} session on ${row.deviceName}`}>
                    <Button
                      size={actionButtonSize}
                      variant="destructive"
                      leadingIcon={<RevokeGlyph />}
                      disabled={disabled || rowBusy}
                      loading={busyId === row.id}
                      onClick={() => setRevokeTarget(row)}
                    >
                      {revokeLabel}
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip content="This is your current session">
                    <span className="dk-active-sessions__current-hint">
                      <Icon size="sm" label="Current session">
                        <CurrentGlyph />
                      </Icon>
                    </span>
                  </Tooltip>
                )}

                <DropdownMenu
                  label={`Session actions for ${row.deviceName}`}
                  align="end"
                  disabled={disabled || rowBusy}
                  items={menuItems}
                >
                  <IconButton
                    label={`More actions for ${row.deviceName}`}
                    icon={<MoreGlyph />}
                    size={actionButtonSize === "xs" ? "xs" : "sm"}
                    variant="quiet"
                    disabled={disabled || rowBusy}
                  />
                </DropdownMenu>
              </div>
            );
          },
        }
      );

      return cols;
    }, [
      actionBusy,
      actionButtonSize,
      busyId,
      dateStyle,
      disabled,
      locale,
      onRevoke,
      onTrust,
      refreshing,
      revokeLabel,
      showIp,
      timeStyle,
      trustLabel,
      untrustLabel,
    ]);

    if (status === "loading") {
      return (
        <div
          ref={ref}
          id={rootId}
          className={cx(
            "dk-active-sessions",
            "dk-active-sessions--loading",
            `dk-active-sessions--${variant}`,
            className
          )}
          data-status="loading"
        >
          {loadingSlot ?? (
            <AuthenticationLoading
              flow="sign-in"
              variant={variant === "compact" ? "compact" : loadingVariant}
              message="Loading sessions"
              description="Checking devices signed in to your account…"
            />
          )}
        </div>
      );
    }

    if (status === "error") {
      return (
        <div
          ref={ref}
          id={rootId}
          className={cx(
            "dk-active-sessions",
            "dk-active-sessions--error",
            `dk-active-sessions--${variant}`,
            className
          )}
          data-status="error"
          data-reason={errorReason}
        >
          {errorSlot ?? (
            <AuthenticationError
              flow="sign-in"
              reason={errorReason}
              variant={errorVariant}
              title={errorTitle ?? "Couldn’t manage sessions"}
              description={
                errorDescription ??
                "Something went wrong while updating your active sessions. Try again."
              }
              onRetry={() => {
                setStatus("idle");
                onRetry?.();
              }}
              showRetry
            />
          )}
        </div>
      );
    }

    const filterToolbar =
      showFilters && activeFilters.length > 1 ? (
        <TagGroup label="Filter sessions" className="dk-active-sessions__filters">
          {activeFilters.map((option) => (
            <Tag
              key={option.id}
              size="sm"
              tone={filter === option.id ? "accent" : "neutral"}
              selected={filter === option.id}
              icon={option.icon}
              disabled={disabled}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </Tag>
          ))}
        </TagGroup>
      ) : null;

    const revokeAllAction =
      showRevokeAll && onRevokeAll && otherSessions.length > 0 ? (
        <Tooltip content="Sign out every device except this one">
          <Button
            size={actionButtonSize}
            variant={revokeAllButtonVariant}
            leadingIcon={<RevokeGlyph />}
            disabled={disabled || actionBusy || refreshing}
            onClick={() => setRevokeAllOpen(true)}
          >
            {revokeAllLabel}
          </Button>
        </Tooltip>
      ) : null;

    return (
      <div
        ref={ref}
        id={rootId}
        className={cx("dk-active-sessions", `dk-active-sessions--${variant}`, className)}
        data-status="idle"
        data-variant={variant}
        data-refreshing={refreshing || undefined}
      >
        <Card variant={cardVariant} className="dk-active-sessions__card">
          {headerSlot ?? (
            <Card.Header className="dk-active-sessions__header">
              <div className="dk-active-sessions__heading">
                <div className="dk-active-sessions__title-row">
                  <Icon size={iconSize} className="dk-active-sessions__title-icon">
                    <SessionsEmptyGlyph />
                  </Icon>
                  <Card.Title>{title}</Card.Title>
                </div>
                {description ? <Card.Description>{description}</Card.Description> : null}
              </div>
              {revokeAllAction ? <Card.Actions>{revokeAllAction}</Card.Actions> : null}
            </Card.Header>
          )}

          <Card.Body className="dk-active-sessions__body">
            {refreshing ? (
              <div className="dk-active-sessions__skeleton" aria-busy="true" aria-live="polite">
                <Skeleton shape="title" width="40%" label="Loading session list" />
                <Skeleton shape="text" lines={3} />
                <div className="dk-active-sessions__skeleton-row">
                  <Skeleton shape="avatar" size="md" />
                  <Skeleton shape="text" lines={2} width="70%" />
                </div>
                <div className="dk-active-sessions__skeleton-row">
                  <Skeleton shape="avatar" size="md" />
                  <Skeleton shape="text" lines={2} width="55%" />
                </div>
              </div>
            ) : (
              <>
                {filterToolbar}
                <DataTable
                  caption="Active sessions"
                  columns={columns}
                  data={sessions}
                  search={search}
                  onSearchChange={setSearch}
                  showSearch={showSearch}
                  searchLabel="Search sessions"
                  searchPlaceholder="Search by device, browser, OS, or location…"
                  sort={sortProp}
                  defaultSort={defaultSort}
                  onSortChange={onSortChange}
                  filterFn={(row) => matchesFilter(row, filter)}
                  emptyTitle={emptyTitle}
                  emptyDescription={emptyDescription}
                  emptyIcon={<SessionsEmptyGlyph />}
                  emptyActions={emptyActions}
                  emptySlot={emptySlot}
                  noResultsTitle="No matching sessions"
                  noResultsDescription="Try another search or clear filters."
                  toolbarSlot={toolbarSlot}
                />
              </>
            )}
          </Card.Body>
        </Card>

        <Dialog
          open={Boolean(revokeTarget)}
          onOpenChange={(open) => {
            if (!open && !actionBusy) setRevokeTarget(null);
          }}
          title="Revoke session?"
          description={
            revokeTarget
              ? `Sign out “${revokeTarget.deviceName}”. You’ll need to sign in again on that device.`
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
                onClick={() => setRevokeTarget(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                leadingIcon={<RevokeGlyph />}
                loading={actionBusy}
                disabled={disabled}
                onClick={() => void submitRevoke()}
              >
                {revokeLabel}
              </Button>
            </>
          }
        >
          {revokeTarget ? (
            <div className="dk-active-sessions__dialog-preview">
              <Avatar
                label={revokeTarget.deviceName}
                initials={initialsFromName(revokeTarget.deviceName)}
                size={40}
                shape="rounded"
                badge={
                  <Icon
                    size="xs"
                    label={DEVICE_META[revokeTarget.deviceKind ?? "unknown"].label}
                  >
                    {DEVICE_META[revokeTarget.deviceKind ?? "unknown"].icon}
                  </Icon>
                }
              />
              <div>
                <div className="dk-active-sessions__name">{revokeTarget.deviceName}</div>
                <div className="dk-active-sessions__dialog-meta">
                  {[revokeTarget.browser, revokeTarget.os, revokeTarget.location]
                    .filter(Boolean)
                    .join(" · ") || "Unknown device details"}
                </div>
              </div>
            </div>
          ) : null}
        </Dialog>

        <Dialog
          open={revokeAllOpen}
          onOpenChange={(open) => {
            if (!open && !actionBusy) setRevokeAllOpen(false);
          }}
          title="Revoke all other sessions?"
          description={`This signs out ${otherSessions.length} other device${
            otherSessions.length === 1 ? "" : "s"
          }. Your current session stays signed in.`}
          size="sm"
          closeOnOutsideClick={!actionBusy}
          closeOnEscape={!actionBusy}
          actions={
            <>
              <Button
                size="sm"
                variant="secondary"
                disabled={actionBusy}
                onClick={() => setRevokeAllOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                leadingIcon={<RevokeGlyph />}
                loading={actionBusy}
                disabled={disabled}
                onClick={() => void submitRevokeAll()}
              >
                Revoke all
              </Button>
            </>
          }
        >
          <p className="dk-active-sessions__dialog-copy">
            Use this if you lost a device or notice unfamiliar activity.
          </p>
        </Dialog>
      </div>
    );
  }
);

ActiveSessions.displayName = "ActiveSessions";
export default ActiveSessions;
