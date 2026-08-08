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
import { Tooltip } from "../../../../../../../tooltip/nextjs-compact/v1/files/components/ui/Tooltip";
import { Skeleton } from "../../../../../../../skeleton/nextjs-compact/v1/files/components/ui/Skeleton";
import { Icon, type IconSize } from "../../../../../../../icon/nextjs-compact/v1/files/components/ui/Icon";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSort,
} from "../../../../../../../data-table/nextjs-compact/v1/files/components/ui/DataTable";
import { SearchField } from "../../../../../../../search-field/nextjs-compact/v1/files/components/ui/SearchField";
import { ActionSegmentedControl } from "../../../../../../../action-segmented-control/nextjs-compact/v1/files/components/ui/ActionSegmentedControl";
import {
  Tag,
  TagGroup,
} from "../../../../../../../tag/nextjs-compact/v1/files/components/ui/Tag";

/**
 * Login History — authentication event timeline.
 * Composes Data Table, Badge, Avatar, Tooltip, Action Segmented Control (Filter),
 * Search Field (Search Input), Empty State (via Data Table), Skeleton, Icon, Tag, Card, Button.
 * Never recreate those primitives.
 */

export type LoginHistoryDeviceKind =
  | "desktop"
  | "laptop"
  | "phone"
  | "tablet"
  | "unknown";

export type LoginHistoryMethod =
  | "password"
  | "passkey"
  | "magic-link"
  | "oauth"
  | "sso"
  | "totp"
  | "recovery"
  | "unknown";

export type LoginHistoryOutcome = "success" | "failure";

export type LoginHistoryEvent = {
  id: string;
  timestamp: string | Date;
  method: LoginHistoryMethod;
  outcome: LoginHistoryOutcome;
  browser?: string;
  os?: string;
  location?: string;
  deviceKind?: LoginHistoryDeviceKind;
  deviceName?: string;
  ipAddress?: string;
  failureReason?: string;
};

export type LoginHistoryOutcomeFilter = "all" | LoginHistoryOutcome;

export type LoginHistoryMethodFilter = "all" | LoginHistoryMethod;

export type LoginHistoryVariant = "stacked" | "compact";

export type LoginHistoryExportFormat = "csv";

export type LoginHistoryProps = {
  events?: LoginHistoryEvent[];
  variant?: LoginHistoryVariant;
  cardVariant?: CardVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (query: string) => void;
  outcomeFilter?: LoginHistoryOutcomeFilter;
  defaultOutcomeFilter?: LoginHistoryOutcomeFilter;
  onOutcomeFilterChange?: (filter: LoginHistoryOutcomeFilter) => void;
  methodFilter?: LoginHistoryMethodFilter;
  defaultMethodFilter?: LoginHistoryMethodFilter;
  onMethodFilterChange?: (filter: LoginHistoryMethodFilter) => void;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  showSearch?: boolean;
  showOutcomeFilter?: boolean;
  showMethodFilter?: boolean;
  showIp?: boolean;
  locale?: string;
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
  /**
   * Export currently visible (filtered + searched) rows.
   * When omitted, a CSV download is generated in-browser.
   */
  onExport?: (rows: LoginHistoryEvent[], format: LoginHistoryExportFormat) => void | Promise<void>;
  showExport?: boolean;
  exportLabel?: string;
  exportFormat?: LoginHistoryExportFormat;
  exportFileName?: string;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyActions?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  actionButtonSize?: ButtonSize;
  exportButtonVariant?: ButtonVariant;
  iconSize?: IconSize;
  headerSlot?: React.ReactNode;
  filterSlot?: React.ReactNode;
  toolbarSlot?: React.ReactNode;
  emptySlot?: React.ReactNode;
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

function formatTimestamp(
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

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadCsv(filename: string, rows: LoginHistoryEvent[]) {
  const header = [
    "id",
    "timestamp",
    "outcome",
    "method",
    "deviceName",
    "deviceKind",
    "browser",
    "os",
    "location",
    "ipAddress",
    "failureReason",
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.id,
        toDate(row.timestamp)?.toISOString() ?? String(row.timestamp),
        row.outcome,
        row.method,
        row.deviceName ?? "",
        row.deviceKind ?? "",
        row.browser ?? "",
        row.os ?? "",
        row.location ?? "",
        row.ipAddress ?? "",
        row.failureReason ?? "",
      ]
        .map((cell) => csvEscape(String(cell)))
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
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

function SuccessGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m7 10.25 2 2 4-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FailureGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="m7.5 7.5 5 5M12.5 7.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AllGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M4.5 6.5h11M4.5 10h11M4.5 13.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PasswordGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="4.5" y="8.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 8.5V6.5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PasskeyGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 10h5.5M14.5 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MagicLinkGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="4.5" width="14.5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m3.5 6.5 6.5 4.5 6.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OauthGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SsoGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.5" y="4.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10h6M10 7.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TotpGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="5" y="2.75" width="10" height="14.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 13.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RecoveryGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 3.5v3M6.2 5.8A5.5 5.5 0 1 0 15 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M14.5 3.5 15.5 7l-3.5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

function IpGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 5.25v3.5M8 10.75v.01" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function ExportGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M10 3.5v8.5M7 6.5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 12.5v3h11v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HistoryGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.5 10a5.5 5.5 0 1 0 1.6-3.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M4.5 4.5v3.5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 7.5V10l2 1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DEVICE_META: Record<LoginHistoryDeviceKind, { label: string; icon: React.ReactNode }> = {
  desktop: { label: "Desktop", icon: <DesktopGlyph /> },
  laptop: { label: "Laptop", icon: <LaptopGlyph /> },
  phone: { label: "Phone", icon: <PhoneGlyph /> },
  tablet: { label: "Tablet", icon: <TabletGlyph /> },
  unknown: { label: "Device", icon: <UnknownDeviceGlyph /> },
};

const METHOD_META: Record<LoginHistoryMethod, { label: string; icon: React.ReactNode }> = {
  password: { label: "Password", icon: <PasswordGlyph /> },
  passkey: { label: "Passkey", icon: <PasskeyGlyph /> },
  "magic-link": { label: "Magic link", icon: <MagicLinkGlyph /> },
  oauth: { label: "OAuth", icon: <OauthGlyph /> },
  sso: { label: "SSO", icon: <SsoGlyph /> },
  totp: { label: "Authenticator", icon: <TotpGlyph /> },
  recovery: { label: "Recovery", icon: <RecoveryGlyph /> },
  unknown: { label: "Unknown", icon: <UnknownDeviceGlyph /> },
};

const OUTCOME_FILTER_OPTIONS = [
  { id: "all", label: "All", icon: <AllGlyph /> },
  { id: "success", label: "Successful", icon: <SuccessGlyph /> },
  { id: "failure", label: "Failed", icon: <FailureGlyph /> },
] as const;

const METHOD_FILTER_OPTIONS: { id: LoginHistoryMethodFilter; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All methods", icon: <AllGlyph /> },
  { id: "password", label: "Password", icon: <PasswordGlyph /> },
  { id: "passkey", label: "Passkey", icon: <PasskeyGlyph /> },
  { id: "magic-link", label: "Magic link", icon: <MagicLinkGlyph /> },
  { id: "oauth", label: "OAuth", icon: <OauthGlyph /> },
  { id: "sso", label: "SSO", icon: <SsoGlyph /> },
  { id: "totp", label: "Authenticator", icon: <TotpGlyph /> },
  { id: "recovery", label: "Recovery", icon: <RecoveryGlyph /> },
];

function eventSearchBlob(event: LoginHistoryEvent): string {
  const method = METHOD_META[event.method]?.label ?? event.method;
  const device = DEVICE_META[event.deviceKind ?? "unknown"]?.label ?? "";
  return [
    event.outcome,
    method,
    event.method,
    event.deviceName,
    device,
    event.browser,
    event.os,
    event.location,
    event.ipAddress,
    event.failureReason,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesFilters(
  event: LoginHistoryEvent,
  outcomeFilter: LoginHistoryOutcomeFilter,
  methodFilter: LoginHistoryMethodFilter
): boolean {
  if (outcomeFilter !== "all" && event.outcome !== outcomeFilter) return false;
  if (methodFilter !== "all" && event.method !== methodFilter) return false;
  return true;
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
    <span className="dk-login-history__meta">
      <Icon size="xs" className="dk-login-history__meta-icon" label={label}>
        {icon}
      </Icon>
      <span className="dk-login-history__meta-text">{text}</span>
    </span>
  );
  if (!tooltip || text === "—") return content;
  return (
    <Tooltip content={tooltip}>
      <button type="button" className="dk-login-history__meta-trigger">
        {content}
      </button>
    </Tooltip>
  );
}

export const LoginHistory = React.forwardRef<HTMLDivElement, LoginHistoryProps>(
  function LoginHistory(
    {
      events = [],
      variant = "stacked",
      cardVariant = "outlined",
      title = "Login history",
      description = "Review recent authentication attempts across devices and methods.",
      search: searchProp,
      defaultSearch = "",
      onSearchChange,
      outcomeFilter: outcomeProp,
      defaultOutcomeFilter = "all",
      onOutcomeFilterChange,
      methodFilter: methodProp,
      defaultMethodFilter = "all",
      onMethodFilterChange,
      sort: sortProp,
      defaultSort = { columnId: "timestamp", direction: "desc" },
      onSortChange,
      showSearch = true,
      showOutcomeFilter = true,
      showMethodFilter = true,
      showIp = false,
      locale = "en-US",
      dateStyle = "medium",
      timeStyle = "short",
      onExport,
      showExport = true,
      exportLabel = "Export",
      exportFormat = "csv",
      exportFileName = "login-history.csv",
      emptyTitle = "No login history",
      emptyDescription = "Authentication attempts will appear here after you sign in.",
      emptyActions,
      loading = false,
      disabled = false,
      actionButtonSize = "sm",
      exportButtonVariant = "secondary",
      iconSize = "md",
      headerSlot,
      filterSlot,
      toolbarSlot,
      emptySlot,
      className = "",
      id,
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = id ?? `dk-login-history-${reactId}`;

    const controlledSearch = searchProp !== undefined;
    const controlledOutcome = outcomeProp !== undefined;
    const controlledMethod = methodProp !== undefined;

    const [uncontrolledSearch, setUncontrolledSearch] = React.useState(defaultSearch);
    const [uncontrolledOutcome, setUncontrolledOutcome] =
      React.useState<LoginHistoryOutcomeFilter>(defaultOutcomeFilter);
    const [uncontrolledMethod, setUncontrolledMethod] =
      React.useState<LoginHistoryMethodFilter>(defaultMethodFilter);
    const [exportBusy, setExportBusy] = React.useState(false);

    const search = controlledSearch ? searchProp! : uncontrolledSearch;
    const outcomeFilter = controlledOutcome ? outcomeProp! : uncontrolledOutcome;
    const methodFilter = controlledMethod ? methodProp! : uncontrolledMethod;

    const setSearch = React.useCallback(
      (next: string) => {
        if (!controlledSearch) setUncontrolledSearch(next);
        onSearchChange?.(next);
      },
      [controlledSearch, onSearchChange]
    );

    const setOutcomeFilter = React.useCallback(
      (next: LoginHistoryOutcomeFilter) => {
        if (!controlledOutcome) setUncontrolledOutcome(next);
        onOutcomeFilterChange?.(next);
      },
      [controlledOutcome, onOutcomeFilterChange]
    );

    const setMethodFilter = React.useCallback(
      (next: LoginHistoryMethodFilter) => {
        if (!controlledMethod) setUncontrolledMethod(next);
        onMethodFilterChange?.(next);
      },
      [controlledMethod, onMethodFilterChange]
    );

    const visibleMethodFilters = React.useMemo(() => {
      const present = new Set(events.map((event) => event.method));
      return METHOD_FILTER_OPTIONS.filter((option) => {
        if (option.id === "all") return true;
        return present.has(option.id);
      });
    }, [events]);

    const visibleRows = React.useMemo(() => {
      const query = search.trim().toLowerCase();
      return events.filter((event) => {
        if (!matchesFilters(event, outcomeFilter, methodFilter)) return false;
        if (!query) return true;
        return eventSearchBlob(event).includes(query);
      });
    }, [events, methodFilter, outcomeFilter, search]);

    const handleExport = async () => {
      if (disabled || loading || exportBusy) return;
      setExportBusy(true);
      try {
        if (onExport) {
          await onExport(visibleRows, exportFormat);
        } else if (exportFormat === "csv") {
          downloadCsv(exportFileName, visibleRows);
        }
      } finally {
        setExportBusy(false);
      }
    };

    const columns = React.useMemo<DataTableColumn<LoginHistoryEvent>[]>(() => {
      const cols: DataTableColumn<LoginHistoryEvent>[] = [
        {
          id: "timestamp",
          header: "When",
          sortable: true,
          getSortValue: (row) => toDate(row.timestamp)?.getTime() ?? 0,
          getSearchValue: (row) => eventSearchBlob(row),
          cell: (row) => (
            <MetaCell
              icon={<ClockGlyph />}
              label="Timestamp"
              value={formatTimestamp(row.timestamp, locale, dateStyle, timeStyle)}
              tooltip={`Signed in attempt at ${formatTimestamp(row.timestamp, locale, dateStyle, timeStyle)}`}
            />
          ),
        },
        {
          id: "outcome",
          header: "Result",
          sortable: true,
          getSortValue: (row) => row.outcome,
          getSearchValue: (row) => row.outcome,
          cell: (row) => {
            const success = row.outcome === "success";
            const badge = (
              <Badge
                appearance="icon-label"
                tone={success ? "positive" : "negative"}
                size="sm"
                label={success ? "Success" : "Failed"}
                icon={success ? <SuccessGlyph /> : <FailureGlyph />}
                accessibleLabel={success ? "Successful sign-in" : "Failed sign-in"}
              />
            );
            if (!success && row.failureReason) {
              return (
                <Tooltip content={row.failureReason}>
                  <button type="button" className="dk-login-history__meta-trigger">
                    {badge}
                  </button>
                </Tooltip>
              );
            }
            return badge;
          },
        },
        {
          id: "method",
          header: "Method",
          sortable: true,
          getSortValue: (row) => METHOD_META[row.method]?.label ?? row.method,
          getSearchValue: (row) => METHOD_META[row.method]?.label ?? row.method,
          cell: (row) => {
            const meta = METHOD_META[row.method] ?? METHOD_META.unknown;
            return (
              <Badge
                appearance="icon-label"
                tone="neutral"
                size="sm"
                label={meta.label}
                icon={meta.icon}
                accessibleLabel={`Authentication method: ${meta.label}`}
              />
            );
          },
        },
        {
          id: "device",
          header: "Device",
          sortable: true,
          getSortValue: (row) =>
            (row.deviceName ?? DEVICE_META[row.deviceKind ?? "unknown"].label).toLowerCase(),
          getSearchValue: (row) =>
            [row.deviceName, DEVICE_META[row.deviceKind ?? "unknown"].label].filter(Boolean).join(" "),
          cell: (row) => {
            const kind = row.deviceKind ?? "unknown";
            const meta = DEVICE_META[kind] ?? DEVICE_META.unknown;
            const name = row.deviceName?.trim() || meta.label;
            return (
              <div className="dk-login-history__identity">
                <Avatar
                  label={name}
                  initials={initialsFromName(name)}
                  size={32}
                  shape="rounded"
                  badge={
                    <Icon size="xs" label={meta.label}>
                      {meta.icon}
                    </Icon>
                  }
                />
                <div className="dk-login-history__identity-copy">
                  <span className="dk-login-history__device-name">{name}</span>
                  <span className="dk-login-history__device-kind">{meta.label}</span>
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

      return cols;
    }, [dateStyle, locale, showIp, timeStyle]);

    const exportAction = showExport ? (
      <Tooltip content="Export the currently filtered login history">
        <Button
          size={actionButtonSize}
          variant={exportButtonVariant}
          leadingIcon={<ExportGlyph />}
          disabled={disabled || loading || visibleRows.length === 0}
          loading={exportBusy}
          onClick={() => void handleExport()}
        >
          {exportLabel}
        </Button>
      </Tooltip>
    ) : null;

    const outcomeFilterControl = showOutcomeFilter ? (
      <ActionSegmentedControl
        label="Filter by result"
        size="sm"
        equalWidth={false}
        overflow="wrap"
        value={outcomeFilter}
        onValueChange={(value) => setOutcomeFilter(value as LoginHistoryOutcomeFilter)}
        disabled={disabled || loading}
        options={OUTCOME_FILTER_OPTIONS.map((option) => ({
          id: option.id,
          label: option.label,
          icon: option.icon,
        }))}
        className="dk-login-history__outcome-filter"
      />
    ) : null;

    const methodFilterControl =
      showMethodFilter && visibleMethodFilters.length > 1 ? (
        <TagGroup label="Filter by authentication method" className="dk-login-history__method-filters">
          {visibleMethodFilters.map((option) => (
            <Tag
              key={option.id}
              size="sm"
              tone={methodFilter === option.id ? "accent" : "neutral"}
              selected={methodFilter === option.id}
              icon={option.icon}
              disabled={disabled || loading}
              onClick={() => setMethodFilter(option.id)}
            >
              {option.label}
            </Tag>
          ))}
        </TagGroup>
      ) : null;

    return (
      <div
        ref={ref}
        id={rootId}
        className={cx("dk-login-history", `dk-login-history--${variant}`, className)}
        data-variant={variant}
        data-loading={loading || undefined}
      >
        <Card variant={cardVariant} className="dk-login-history__card">
          {headerSlot ?? (
            <Card.Header className="dk-login-history__header">
              <div className="dk-login-history__heading">
                <div className="dk-login-history__title-row">
                  <Icon size={iconSize} className="dk-login-history__title-icon">
                    <HistoryGlyph />
                  </Icon>
                  <Card.Title>{title}</Card.Title>
                </div>
                {description ? <Card.Description>{description}</Card.Description> : null}
              </div>
              {exportAction ? <Card.Actions>{exportAction}</Card.Actions> : null}
            </Card.Header>
          )}

          <Card.Body className="dk-login-history__body">
            {loading ? (
              <div className="dk-login-history__skeleton" aria-busy="true" aria-live="polite">
                <Skeleton shape="title" width="36%" label="Loading login history" />
                <Skeleton shape="text" lines={2} />
                <div className="dk-login-history__skeleton-row">
                  <Skeleton shape="avatar" size="md" />
                  <Skeleton shape="text" lines={2} width="70%" />
                </div>
                <div className="dk-login-history__skeleton-row">
                  <Skeleton shape="avatar" size="md" />
                  <Skeleton shape="text" lines={2} width="55%" />
                </div>
              </div>
            ) : (
              <>
                {filterSlot ?? (
                  <div className="dk-login-history__filters">
                    {outcomeFilterControl}
                    {methodFilterControl}
                  </div>
                )}

                <DataTable
                  caption="Login history"
                  columns={columns}
                  data={events}
                  search={search}
                  onSearchChange={setSearch}
                  showSearch={showSearch}
                  searchLabel="Search login history"
                  searchPlaceholder="Search by method, browser, OS, or location…"
                  sort={sortProp}
                  defaultSort={defaultSort}
                  onSortChange={onSortChange}
                  filterFn={(row) => matchesFilters(row, outcomeFilter, methodFilter)}
                  emptyTitle={emptyTitle}
                  emptyDescription={emptyDescription}
                  emptyIcon={<HistoryGlyph />}
                  emptyActions={emptyActions}
                  emptySlot={emptySlot}
                  noResultsTitle="No matching events"
                  noResultsDescription="Try another search or clear filters."
                  toolbarSlot={
                    toolbarSlot ??
                    (showSearch ? undefined : (
                      <SearchField
                        label="Search login history"
                        hideLabel
                        appearance="toolbar"
                        size="sm"
                        placeholder="Search login history…"
                        value={search}
                        onValueChange={setSearch}
                        resultsStatus={search ? (visibleRows.length ? "available" : "empty") : "idle"}
                        fullWidth
                      />
                    ))
                  }
                />
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
);

LoginHistory.displayName = "LoginHistory";
export default LoginHistory;
