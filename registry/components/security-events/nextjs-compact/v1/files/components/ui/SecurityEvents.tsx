import * as React from "react";
import {
  Card,
  type CardVariant,
} from "../../../../../../../card/nextjs-compact/v1/files/components/ui/Card";
import { Badge } from "../../../../../../../badge/nextjs-compact/v1/files/components/ui/Badge";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import { Dialog } from "../../../../../../../dialog/nextjs-compact/v1/files/components/ui/Dialog";
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
import { Timeline } from "../../../../../../../timeline/nextjs-compact/v1/files/components/ui/Timeline";

/**
 * Security Events — account security activity.
 * Composes Data Table, Timeline, Badge, Action Segmented Control (Filter),
 * Search Field (Search Input), Empty State, Skeleton, Dialog, Icon, Tag, Card, Button.
 * Never duplicate audit-log or timeline implementations.
 */

export type SecurityEventType =
  | "password-change"
  | "passkey-registration"
  | "authenticator-setup"
  | "recovery-code-generation"
  | "email-verification"
  | "login-failure"
  | "suspicious-activity"
  | "device-change"
  | "session-revocation"
  | "administrative-action";

export type SecurityEventSeverity = "info" | "success" | "warning" | "critical";

export type SecurityEvent = {
  id: string;
  type: SecurityEventType;
  timestamp: string | Date;
  title?: string;
  description?: string;
  actor?: string;
  target?: string;
  location?: string;
  ipAddress?: string;
  severity?: SecurityEventSeverity;
  metadata?: Record<string, string>;
};

export type SecurityEventsView = "timeline" | "table";

export type SecurityEventsGroupBy = "none" | "day" | "type";

export type SecurityEventTypeFilter = "all" | SecurityEventType;

export type SecurityEventSeverityFilter = "all" | SecurityEventSeverity;

export type SecurityEventsVariant = "stacked" | "compact";

export type SecurityEventsExportFormat = "csv";

export type SecurityEventsProps = {
  events?: SecurityEvent[];
  variant?: SecurityEventsVariant;
  cardVariant?: CardVariant;
  view?: SecurityEventsView;
  defaultView?: SecurityEventsView;
  onViewChange?: (view: SecurityEventsView) => void;
  groupBy?: SecurityEventsGroupBy;
  defaultGroupBy?: SecurityEventsGroupBy;
  onGroupByChange?: (groupBy: SecurityEventsGroupBy) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (query: string) => void;
  typeFilter?: SecurityEventTypeFilter;
  defaultTypeFilter?: SecurityEventTypeFilter;
  onTypeFilterChange?: (filter: SecurityEventTypeFilter) => void;
  severityFilter?: SecurityEventSeverityFilter;
  defaultSeverityFilter?: SecurityEventSeverityFilter;
  onSeverityFilterChange?: (filter: SecurityEventSeverityFilter) => void;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  showSearch?: boolean;
  showTypeFilter?: boolean;
  showSeverityFilter?: boolean;
  showViewToggle?: boolean;
  showGroupBy?: boolean;
  showIp?: boolean;
  locale?: string;
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
  onExport?: (rows: SecurityEvent[], format: SecurityEventsExportFormat) => void | Promise<void>;
  showExport?: boolean;
  exportLabel?: string;
  exportFormat?: SecurityEventsExportFormat;
  exportFileName?: string;
  onEventSelect?: (event: SecurityEvent) => void;
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
  detailSlot?: (event: SecurityEvent) => React.ReactNode;
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

function formatDayLabel(value: string | Date, locale: string): string {
  const date = toDate(value);
  if (!date) return "Unknown date";
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadCsv(filename: string, rows: SecurityEvent[]) {
  const header = [
    "id",
    "timestamp",
    "type",
    "severity",
    "title",
    "description",
    "actor",
    "target",
    "location",
    "ipAddress",
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.id,
        toDate(row.timestamp)?.toISOString() ?? String(row.timestamp),
        row.type,
        row.severity ?? "",
        row.title ?? "",
        row.description ?? "",
        row.actor ?? "",
        row.target ?? "",
        row.location ?? "",
        row.ipAddress ?? "",
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

function AuthenticatorGlyph() {
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

function EmailGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="4.5" width="14.5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6.5 6.5 4.5 6.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoginFailGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="m7.5 7.5 5 5M12.5 7.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SuspiciousGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 3.25 16.75 15.5H3.25L10 3.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 8.25v3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13.75" r="0.85" fill="currentColor" />
    </svg>
  );
}

function DeviceGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.5" y="4" width="13" height="9" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 15.5h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SessionGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="m7 7 6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AdminGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 16.5a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.5 4.5 16 6l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

function TableViewGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.5" y="4.5" width="13" height="11" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 8h13M8.5 8v7.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TimelineViewGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M6 4.5v11M6 7h7M6 11h9M6 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const EVENT_META: Record<
  SecurityEventType,
  {
    label: string;
    defaultTitle: string;
    icon: React.ReactNode;
    defaultSeverity: SecurityEventSeverity;
  }
> = {
  "password-change": {
    label: "Password change",
    defaultTitle: "Password changed",
    icon: <PasswordGlyph />,
    defaultSeverity: "success",
  },
  "passkey-registration": {
    label: "Passkey",
    defaultTitle: "Passkey registered",
    icon: <PasskeyGlyph />,
    defaultSeverity: "success",
  },
  "authenticator-setup": {
    label: "Authenticator",
    defaultTitle: "Authenticator app set up",
    icon: <AuthenticatorGlyph />,
    defaultSeverity: "success",
  },
  "recovery-code-generation": {
    label: "Recovery codes",
    defaultTitle: "Recovery codes generated",
    icon: <RecoveryGlyph />,
    defaultSeverity: "warning",
  },
  "email-verification": {
    label: "Email verification",
    defaultTitle: "Email verified",
    icon: <EmailGlyph />,
    defaultSeverity: "success",
  },
  "login-failure": {
    label: "Login failure",
    defaultTitle: "Sign-in failed",
    icon: <LoginFailGlyph />,
    defaultSeverity: "warning",
  },
  "suspicious-activity": {
    label: "Suspicious activity",
    defaultTitle: "Suspicious activity detected",
    icon: <SuspiciousGlyph />,
    defaultSeverity: "critical",
  },
  "device-change": {
    label: "Device change",
    defaultTitle: "Trusted device updated",
    icon: <DeviceGlyph />,
    defaultSeverity: "info",
  },
  "session-revocation": {
    label: "Session revocation",
    defaultTitle: "Session revoked",
    icon: <SessionGlyph />,
    defaultSeverity: "warning",
  },
  "administrative-action": {
    label: "Admin action",
    defaultTitle: "Administrative action",
    icon: <AdminGlyph />,
    defaultSeverity: "info",
  },
};

const SEVERITY_META: Record<
  SecurityEventSeverity,
  { label: string; tone: "neutral" | "positive" | "warning" | "negative" | "accent" }
> = {
  info: { label: "Info", tone: "neutral" },
  success: { label: "Success", tone: "positive" },
  warning: { label: "Warning", tone: "warning" },
  critical: { label: "Critical", tone: "negative" },
};

const TYPE_FILTER_OPTIONS: { id: SecurityEventTypeFilter; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All types", icon: <ShieldGlyph /> },
  ...((Object.keys(EVENT_META) as SecurityEventType[]).map((type) => ({
    id: type,
    label: EVENT_META[type].label,
    icon: EVENT_META[type].icon,
  })) as { id: SecurityEventTypeFilter; label: string; icon: React.ReactNode }[]),
];

function resolveSeverity(event: SecurityEvent): SecurityEventSeverity {
  return event.severity ?? EVENT_META[event.type].defaultSeverity;
}

function resolveTitle(event: SecurityEvent): string {
  return event.title?.trim() || EVENT_META[event.type].defaultTitle;
}

function eventSearchBlob(event: SecurityEvent): string {
  return [
    event.type,
    EVENT_META[event.type].label,
    resolveTitle(event),
    event.description,
    event.actor,
    event.target,
    event.location,
    event.ipAddress,
    resolveSeverity(event),
    ...Object.values(event.metadata ?? {}),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesFilters(
  event: SecurityEvent,
  typeFilter: SecurityEventTypeFilter,
  severityFilter: SecurityEventSeverityFilter
): boolean {
  if (typeFilter !== "all" && event.type !== typeFilter) return false;
  if (severityFilter !== "all" && resolveSeverity(event) !== severityFilter) return false;
  return true;
}

export const SecurityEvents = React.forwardRef<HTMLDivElement, SecurityEventsProps>(
  function SecurityEvents(
    {
      events = [],
      variant = "stacked",
      cardVariant = "outlined",
      view: viewProp,
      defaultView = "timeline",
      onViewChange,
      groupBy: groupByProp,
      defaultGroupBy = "day",
      onGroupByChange,
      title = "Security events",
      description = "Review security-related activity on your account.",
      search: searchProp,
      defaultSearch = "",
      onSearchChange,
      typeFilter: typeProp,
      defaultTypeFilter = "all",
      onTypeFilterChange,
      severityFilter: severityProp,
      defaultSeverityFilter = "all",
      onSeverityFilterChange,
      sort: sortProp,
      defaultSort = { columnId: "timestamp", direction: "desc" },
      onSortChange,
      showSearch = true,
      showTypeFilter = true,
      showSeverityFilter = true,
      showViewToggle = true,
      showGroupBy = true,
      showIp = false,
      locale = "en-US",
      dateStyle = "medium",
      timeStyle = "short",
      onExport,
      showExport = true,
      exportLabel = "Export",
      exportFormat = "csv",
      exportFileName = "security-events.csv",
      onEventSelect,
      emptyTitle = "No security events",
      emptyDescription = "Password changes, device updates, and other security activity will appear here.",
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
      detailSlot,
      className = "",
      id,
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = id ?? `dk-security-events-${reactId}`;

    const controlledView = viewProp !== undefined;
    const controlledGroupBy = groupByProp !== undefined;
    const controlledSearch = searchProp !== undefined;
    const controlledType = typeProp !== undefined;
    const controlledSeverity = severityProp !== undefined;

    const [uncontrolledView, setUncontrolledView] = React.useState<SecurityEventsView>(defaultView);
    const [uncontrolledGroupBy, setUncontrolledGroupBy] =
      React.useState<SecurityEventsGroupBy>(defaultGroupBy);
    const [uncontrolledSearch, setUncontrolledSearch] = React.useState(defaultSearch);
    const [uncontrolledType, setUncontrolledType] =
      React.useState<SecurityEventTypeFilter>(defaultTypeFilter);
    const [uncontrolledSeverity, setUncontrolledSeverity] =
      React.useState<SecurityEventSeverityFilter>(defaultSeverityFilter);
    const [detailEvent, setDetailEvent] = React.useState<SecurityEvent | null>(null);
    const [exportBusy, setExportBusy] = React.useState(false);

    const view = controlledView ? viewProp! : uncontrolledView;
    const groupBy = controlledGroupBy ? groupByProp! : uncontrolledGroupBy;
    const search = controlledSearch ? searchProp! : uncontrolledSearch;
    const typeFilter = controlledType ? typeProp! : uncontrolledType;
    const severityFilter = controlledSeverity ? severityProp! : uncontrolledSeverity;

    const setView = React.useCallback(
      (next: SecurityEventsView) => {
        if (!controlledView) setUncontrolledView(next);
        onViewChange?.(next);
      },
      [controlledView, onViewChange]
    );

    const setGroupBy = React.useCallback(
      (next: SecurityEventsGroupBy) => {
        if (!controlledGroupBy) setUncontrolledGroupBy(next);
        onGroupByChange?.(next);
      },
      [controlledGroupBy, onGroupByChange]
    );

    const setSearch = React.useCallback(
      (next: string) => {
        if (!controlledSearch) setUncontrolledSearch(next);
        onSearchChange?.(next);
      },
      [controlledSearch, onSearchChange]
    );

    const setTypeFilter = React.useCallback(
      (next: SecurityEventTypeFilter) => {
        if (!controlledType) setUncontrolledType(next);
        onTypeFilterChange?.(next);
      },
      [controlledType, onTypeFilterChange]
    );

    const setSeverityFilter = React.useCallback(
      (next: SecurityEventSeverityFilter) => {
        if (!controlledSeverity) setUncontrolledSeverity(next);
        onSeverityFilterChange?.(next);
      },
      [controlledSeverity, onSeverityFilterChange]
    );

    const visibleTypeFilters = React.useMemo(() => {
      const present = new Set(events.map((event) => event.type));
      return TYPE_FILTER_OPTIONS.filter((option) => {
        if (option.id === "all") return true;
        return present.has(option.id as SecurityEventType);
      });
    }, [events]);

    const visibleRows = React.useMemo(() => {
      const query = search.trim().toLowerCase();
      const filtered = events.filter((event) => {
        if (!matchesFilters(event, typeFilter, severityFilter)) return false;
        if (!query) return true;
        return eventSearchBlob(event).includes(query);
      });
      return [...filtered].sort((a, b) => {
        const at = toDate(a.timestamp)?.getTime() ?? 0;
        const bt = toDate(b.timestamp)?.getTime() ?? 0;
        return bt - at;
      });
    }, [events, search, severityFilter, typeFilter]);

    const groupedTimeline = React.useMemo(() => {
      if (groupBy === "none") {
        return [{ id: "all", label: "All events", items: visibleRows }];
      }
      if (groupBy === "type") {
        const map = new Map<SecurityEventType, SecurityEvent[]>();
        for (const event of visibleRows) {
          const list = map.get(event.type) ?? [];
          list.push(event);
          map.set(event.type, list);
        }
        return Array.from(map.entries()).map(([type, items]) => ({
          id: type,
          label: EVENT_META[type].label,
          items,
        }));
      }
      const map = new Map<string, SecurityEvent[]>();
      for (const event of visibleRows) {
        const label = formatDayLabel(event.timestamp, locale);
        const list = map.get(label) ?? [];
        list.push(event);
        map.set(label, list);
      }
      return Array.from(map.entries()).map(([label, items]) => ({
        id: label,
        label,
        items,
      }));
    }, [groupBy, locale, visibleRows]);

    const openDetail = (event: SecurityEvent) => {
      setDetailEvent(event);
      onEventSelect?.(event);
    };

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

    const columns = React.useMemo<DataTableColumn<SecurityEvent>[]>(() => {
      const cols: DataTableColumn<SecurityEvent>[] = [
        {
          id: "timestamp",
          header: "When",
          sortable: true,
          getSortValue: (row) => toDate(row.timestamp)?.getTime() ?? 0,
          getSearchValue: (row) => eventSearchBlob(row),
          cell: (row) => formatTimestamp(row.timestamp, locale, dateStyle, timeStyle),
        },
        {
          id: "type",
          header: "Event",
          sortable: true,
          getSortValue: (row) => EVENT_META[row.type].label,
          getSearchValue: (row) => EVENT_META[row.type].label,
          cell: (row) => {
            const meta = EVENT_META[row.type];
            return (
              <div className="dk-security-events__event-cell">
                <Icon size="sm" label={meta.label}>
                  {meta.icon}
                </Icon>
                <div className="dk-security-events__event-copy">
                  <span className="dk-security-events__event-title">{resolveTitle(row)}</span>
                  <span className="dk-security-events__event-type">{meta.label}</span>
                </div>
              </div>
            );
          },
        },
        {
          id: "severity",
          header: "Severity",
          sortable: true,
          getSortValue: (row) => resolveSeverity(row),
          getSearchValue: (row) => resolveSeverity(row),
          cell: (row) => {
            const severity = resolveSeverity(row);
            const meta = SEVERITY_META[severity];
            return (
              <Badge
                appearance="icon-label"
                tone={meta.tone}
                size="sm"
                label={meta.label}
                icon={EVENT_META[row.type].icon}
                accessibleLabel={`Severity ${meta.label}`}
              />
            );
          },
        },
        {
          id: "actor",
          header: "Actor",
          sortable: true,
          getSortValue: (row) => (row.actor ?? "").toLowerCase(),
          getSearchValue: (row) => row.actor ?? "",
          cell: (row) => row.actor || "—",
        },
        {
          id: "location",
          header: "Location",
          sortable: true,
          getSortValue: (row) => (row.location ?? "").toLowerCase(),
          getSearchValue: (row) => row.location ?? "",
          cell: (row) => row.location || "—",
        },
      ];

      if (showIp) {
        cols.push({
          id: "ipAddress",
          header: "IP",
          sortable: true,
          getSortValue: (row) => (row.ipAddress ?? "").toLowerCase(),
          getSearchValue: (row) => row.ipAddress ?? "",
          cell: (row) => row.ipAddress || "—",
        });
      }

      cols.push({
        id: "actions",
        header: "Details",
        searchable: false,
        sortable: false,
        align: "end",
        cell: (row) => (
          <Button
            size={actionButtonSize}
            variant="quiet"
            leadingIcon={<ShieldGlyph />}
            disabled={disabled}
            onClick={() => openDetail(row)}
          >
            View
          </Button>
        ),
      });

      return cols;
    }, [actionButtonSize, dateStyle, disabled, locale, showIp, timeStyle]);

    const exportAction = showExport ? (
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
    ) : null;

    const viewToggle = showViewToggle ? (
      <ActionSegmentedControl
        label="Display mode"
        size="sm"
        equalWidth={false}
        value={view}
        onValueChange={(value) => setView(value as SecurityEventsView)}
        disabled={disabled || loading}
        options={[
          { id: "timeline", label: "Timeline", icon: <TimelineViewGlyph /> },
          { id: "table", label: "Table", icon: <TableViewGlyph /> },
        ]}
      />
    ) : null;

    const groupByControl =
      showGroupBy && view === "timeline" ? (
        <ActionSegmentedControl
          label="Group events"
          size="sm"
          equalWidth={false}
          value={groupBy}
          onValueChange={(value) => setGroupBy(value as SecurityEventsGroupBy)}
          disabled={disabled || loading}
          options={[
            { id: "day", label: "By day" },
            { id: "type", label: "By type" },
            { id: "none", label: "Ungrouped" },
          ]}
        />
      ) : null;

    const severityFilterControl = showSeverityFilter ? (
      <ActionSegmentedControl
        label="Filter by severity"
        size="sm"
        equalWidth={false}
        overflow="wrap"
        value={severityFilter}
        onValueChange={(value) => setSeverityFilter(value as SecurityEventSeverityFilter)}
        disabled={disabled || loading}
        options={[
          { id: "all", label: "All severity" },
          { id: "info", label: "Info" },
          { id: "success", label: "Success" },
          { id: "warning", label: "Warning" },
          { id: "critical", label: "Critical" },
        ]}
      />
    ) : null;

    const typeFilterControl =
      showTypeFilter && visibleTypeFilters.length > 1 ? (
        <TagGroup label="Filter by event type" className="dk-security-events__type-filters">
          {visibleTypeFilters.map((option) => (
            <Tag
              key={option.id}
              size="sm"
              tone={typeFilter === option.id ? "accent" : "neutral"}
              selected={typeFilter === option.id}
              icon={option.icon}
              disabled={disabled || loading}
              onClick={() => setTypeFilter(option.id)}
            >
              {option.label}
            </Tag>
          ))}
        </TagGroup>
      ) : null;

    const timelineNode =
      visibleRows.length === 0 ? (
        <Timeline
          variant={variant === "compact" ? "compact" : "stacked"}
          aria-label="Security events timeline"
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          emptyActions={emptyActions}
          emptySlot={emptySlot}
          emptyIcon={<ShieldGlyph />}
        />
      ) : (
        <Timeline
          variant={variant === "compact" ? "compact" : "stacked"}
          aria-label="Security events timeline"
        >
          {groupedTimeline
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <Timeline.Group key={group.id} label={group.label}>
                {group.items.map((event) => {
                  const meta = EVENT_META[event.type];
                  const severity = resolveSeverity(event);
                  return (
                    <Timeline.Item
                      key={event.id}
                      icon={meta.icon}
                      title={resolveTitle(event)}
                      timestamp={formatTimestamp(event.timestamp, locale, dateStyle, timeStyle)}
                      description={event.description}
                      badge={
                        <Badge
                          appearance="icon-label"
                          tone={SEVERITY_META[severity].tone}
                          size="sm"
                          label={SEVERITY_META[severity].label}
                          icon={meta.icon}
                          accessibleLabel={`${meta.label}, ${SEVERITY_META[severity].label}`}
                        />
                      }
                      onActivate={() => openDetail(event)}
                      disabled={disabled}
                    >
                      <div className="dk-security-events__timeline-meta">
                        {[event.actor, event.location, showIp ? event.ipAddress : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </Timeline.Item>
                  );
                })}
              </Timeline.Group>
            ))}
        </Timeline>
      );

    const tableNode = (
      <DataTable
        caption="Security events"
        columns={columns}
        data={events}
        search={search}
        onSearchChange={setSearch}
        showSearch={showSearch}
        searchLabel="Search security events"
        searchPlaceholder="Search by event, actor, or location…"
        sort={sortProp}
        defaultSort={defaultSort}
        onSortChange={onSortChange}
        filterFn={(row) => matchesFilters(row, typeFilter, severityFilter)}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        emptyIcon={<ShieldGlyph />}
        emptyActions={emptyActions}
        emptySlot={emptySlot}
        noResultsTitle="No matching events"
        noResultsDescription="Try another search or clear filters."
        toolbarSlot={toolbarSlot}
      />
    );

    return (
      <div
        ref={ref}
        id={rootId}
        className={cx("dk-security-events", `dk-security-events--${variant}`, className)}
        data-variant={variant}
        data-view={view}
        data-loading={loading || undefined}
      >
        <Card variant={cardVariant} className="dk-security-events__card">
          {headerSlot ?? (
            <Card.Header className="dk-security-events__header">
              <div className="dk-security-events__heading">
                <div className="dk-security-events__title-row">
                  <Icon size={iconSize} className="dk-security-events__title-icon">
                    <ShieldGlyph />
                  </Icon>
                  <Card.Title>{title}</Card.Title>
                </div>
                {description ? <Card.Description>{description}</Card.Description> : null}
              </div>
              {exportAction ? <Card.Actions>{exportAction}</Card.Actions> : null}
            </Card.Header>
          )}

          <Card.Body className="dk-security-events__body">
            {loading ? (
              <div className="dk-security-events__skeleton" aria-busy="true" aria-live="polite">
                <Skeleton shape="title" width="40%" label="Loading security events" />
                <Skeleton shape="text" lines={3} />
                <Skeleton shape="text" lines={2} width="70%" />
              </div>
            ) : (
              <>
                {filterSlot ?? (
                  <div className="dk-security-events__filters">
                    <div className="dk-security-events__filter-row">
                      {viewToggle}
                      {groupByControl}
                      {severityFilterControl}
                    </div>
                    {typeFilterControl}
                    {view === "timeline" && showSearch ? (
                      <SearchField
                        label="Search security events"
                        hideLabel
                        appearance="toolbar"
                        size="sm"
                        placeholder="Search by event, actor, or location…"
                        value={search}
                        onValueChange={setSearch}
                        resultsStatus={
                          search ? (visibleRows.length ? "available" : "empty") : "idle"
                        }
                        fullWidth
                      />
                    ) : null}
                  </div>
                )}

                {view === "timeline" ? timelineNode : tableNode}
              </>
            )}
          </Card.Body>
        </Card>

        <Dialog
          open={Boolean(detailEvent)}
          onOpenChange={(open) => {
            if (!open) setDetailEvent(null);
          }}
          title={detailEvent ? resolveTitle(detailEvent) : "Event details"}
          description={
            detailEvent
              ? formatTimestamp(detailEvent.timestamp, locale, dateStyle, timeStyle)
              : undefined
          }
          size="md"
          actions={
            <Button size="sm" variant="secondary" onClick={() => setDetailEvent(null)}>
              Close
            </Button>
          }
        >
          {detailEvent
            ? detailSlot?.(detailEvent) ?? (
                <div className="dk-security-events__detail">
                  <div className="dk-security-events__detail-badges">
                    <Badge
                      appearance="icon-label"
                      tone="accent"
                      size="sm"
                      label={EVENT_META[detailEvent.type].label}
                      icon={EVENT_META[detailEvent.type].icon}
                    />
                    <Badge
                      appearance="icon-label"
                      tone={SEVERITY_META[resolveSeverity(detailEvent)].tone}
                      size="sm"
                      label={SEVERITY_META[resolveSeverity(detailEvent)].label}
                      icon={EVENT_META[detailEvent.type].icon}
                    />
                  </div>
                  {detailEvent.description ? <p>{detailEvent.description}</p> : null}
                  <dl className="dk-security-events__detail-list">
                    {detailEvent.actor ? (
                      <>
                        <dt>Actor</dt>
                        <dd>{detailEvent.actor}</dd>
                      </>
                    ) : null}
                    {detailEvent.target ? (
                      <>
                        <dt>Target</dt>
                        <dd>{detailEvent.target}</dd>
                      </>
                    ) : null}
                    {detailEvent.location ? (
                      <>
                        <dt>Location</dt>
                        <dd>{detailEvent.location}</dd>
                      </>
                    ) : null}
                    {showIp && detailEvent.ipAddress ? (
                      <>
                        <dt>IP</dt>
                        <dd>{detailEvent.ipAddress}</dd>
                      </>
                    ) : null}
                    {Object.entries(detailEvent.metadata ?? {}).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <dt>{key}</dt>
                        <dd>{value}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </div>
              )
            : null}
        </Dialog>
      </div>
    );
  }
);

SecurityEvents.displayName = "SecurityEvents";
export default SecurityEvents;
