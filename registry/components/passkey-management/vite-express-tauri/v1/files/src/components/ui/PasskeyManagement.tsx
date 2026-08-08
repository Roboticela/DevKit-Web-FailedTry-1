import * as React from "react";
import {
  Card,
  type CardVariant,
} from "../../../../../../../card/vite-express-tauri/v1/files/src/components/ui/Card";
import { Badge } from "../../../../../../../badge/vite-express-tauri/v1/files/src/components/ui/Badge";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import { Dialog } from "../../../../../../../dialog/vite-express-tauri/v1/files/src/components/ui/Dialog";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSort,
} from "../../../../../../../data-table/vite-express-tauri/v1/files/src/components/ui/DataTable";
import { TextInput } from "../../../../../../../text-input/vite-express-tauri/v1/files/src/components/ui/TextInput";
import {
  Tag,
  TagGroup,
} from "../../../../../../../tag/vite-express-tauri/v1/files/src/components/ui/Tag";

/**
 * Passkey Management — manage registered WebAuthn credentials.
 * Composes Data Table, Card, Badge, Button, Dialog, Empty State (via Data Table),
 * plus Text Input + Tag for rename / filters. Never invent custom tables or dialogs.
 */

export type PasskeyDeviceKind =
  | "iphone"
  | "ipad"
  | "mac"
  | "windows"
  | "android"
  | "security-key"
  | "browser"
  | "unknown";

export type PasskeyCredential = {
  id: string;
  name: string;
  device: PasskeyDeviceKind;
  browser?: string;
  os?: string;
  createdAt: string | Date;
  lastUsedAt?: string | Date | null;
  isDefault?: boolean;
};

export type PasskeyFilterId = "all" | "default" | PasskeyDeviceKind;

export type PasskeyManagementVariant = "stacked" | "compact";

export type PasskeyManagementProps = {
  passkeys?: PasskeyCredential[];
  variant?: PasskeyManagementVariant;
  cardVariant?: CardVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controlled search query. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (query: string) => void;
  /** Controlled filter. */
  filter?: PasskeyFilterId;
  defaultFilter?: PasskeyFilterId;
  onFilterChange?: (filter: PasskeyFilterId) => void;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  locale?: string;
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
  onRename?: (id: string, name: string) => void | Promise<void>;
  onRemove?: (id: string) => void | Promise<void>;
  onSetDefault?: (id: string) => void | Promise<void>;
  onAdd?: () => void;
  showAdd?: boolean;
  addLabel?: string;
  renameLabel?: string;
  removeLabel?: string;
  setDefaultLabel?: string;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyActions?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  /** Busy credential id while an action runs. */
  busyId?: string | null;
  actionButtonSize?: ButtonSize;
  addButtonVariant?: ButtonVariant;
  headerSlot?: React.ReactNode;
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

function formatDate(
  value: string | Date | null | undefined,
  locale: string,
  dateStyle: Intl.DateTimeFormatOptions["dateStyle"]
): string {
  const date = toDate(value);
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="6" y="2.5" width="8" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 14.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TabletIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.5" y="2.5" width="13" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 14.75h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LaptopIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.5" y="4" width="13" height="9" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 15.5h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DesktopIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="3.5" width="14.5" height="10" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 15.5h4M10 13.5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M6.5 8.5v5M13.5 8.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="5.5" y="7" width="9" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 4.5 10 7l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SecurityKeyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 10h5.5M14.5 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BrowserIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="4.25" width="14.5" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.75 7.25h14.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="12" r="1.75" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function UnknownDeviceIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v4.5M10 6.75v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PasskeyEmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 12h7M17.5 9.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 19.5a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RenameIcon() {
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

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M4.5 6.5h11M8 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M6.5 6.5 7.25 15a1 1 0 0 0 1 .9h3.5a1 1 0 0 0 1-.9L13.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="m10 3.5 1.8 3.65 4.03.59-2.91 2.84.69 4.01L10 12.7l-3.61 1.89.69-4.01L4.17 7.74l4.03-.59L10 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M10 4.5v11M4.5 10h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const DEVICE_META: Record<PasskeyDeviceKind, { label: string; icon: React.ReactNode }> = {
  iphone: { label: "iPhone", icon: <PhoneIcon /> },
  ipad: { label: "iPad", icon: <TabletIcon /> },
  mac: { label: "Mac", icon: <LaptopIcon /> },
  windows: { label: "Windows", icon: <DesktopIcon /> },
  android: { label: "Android", icon: <AndroidIcon /> },
  "security-key": { label: "Security key", icon: <SecurityKeyIcon /> },
  browser: { label: "Browser", icon: <BrowserIcon /> },
  unknown: { label: "Device", icon: <UnknownDeviceIcon /> },
};

const FILTER_OPTIONS: { id: PasskeyFilterId; label: string; icon?: React.ReactNode }[] = [
  { id: "all", label: "All" },
  { id: "default", label: "Default", icon: <StarIcon /> },
  { id: "iphone", label: "iPhone", icon: <PhoneIcon /> },
  { id: "ipad", label: "iPad", icon: <TabletIcon /> },
  { id: "mac", label: "Mac", icon: <LaptopIcon /> },
  { id: "windows", label: "Windows", icon: <DesktopIcon /> },
  { id: "android", label: "Android", icon: <AndroidIcon /> },
  { id: "security-key", label: "Security key", icon: <SecurityKeyIcon /> },
  { id: "browser", label: "Browser", icon: <BrowserIcon /> },
];

function matchesFilter(passkey: PasskeyCredential, filter: PasskeyFilterId): boolean {
  if (filter === "all") return true;
  if (filter === "default") return Boolean(passkey.isDefault);
  return passkey.device === filter;
}

function passkeySearchBlob(passkey: PasskeyCredential): string {
  const device = DEVICE_META[passkey.device]?.label ?? passkey.device;
  return [passkey.name, device, passkey.browser, passkey.os, passkey.isDefault ? "default" : ""]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export const PasskeyManagement = React.forwardRef<HTMLDivElement, PasskeyManagementProps>(
  function PasskeyManagement(
    {
      passkeys = [],
      variant = "stacked",
      cardVariant = "outlined",
      title = "Passkeys",
      description = "Manage the passkeys registered on your account.",
      search: searchProp,
      defaultSearch = "",
      onSearchChange,
      filter: filterProp,
      defaultFilter = "all",
      onFilterChange,
      sort: sortProp,
      defaultSort = { columnId: "lastUsedAt", direction: "desc" },
      onSortChange,
      showSearch = true,
      showFilters = true,
      locale = "en-US",
      dateStyle = "medium",
      onRename,
      onRemove,
      onSetDefault,
      onAdd,
      showAdd = true,
      addLabel = "Add passkey",
      renameLabel = "Rename",
      removeLabel = "Remove",
      setDefaultLabel = "Set default",
      emptyTitle = "No passkeys yet",
      emptyDescription = "Register a passkey to sign in without a password.",
      emptyActions,
      disabled = false,
      loading = false,
      busyId = null,
      actionButtonSize = "sm",
      addButtonVariant = "secondary",
      headerSlot,
      toolbarSlot,
      emptySlot,
      className = "",
      id,
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = id ?? `dk-passkey-mgmt-${reactId}`;

    const controlledSearch = searchProp !== undefined;
    const controlledFilter = filterProp !== undefined;
    const [uncontrolledSearch, setUncontrolledSearch] = React.useState(defaultSearch);
    const [uncontrolledFilter, setUncontrolledFilter] = React.useState<PasskeyFilterId>(defaultFilter);
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
      (next: PasskeyFilterId) => {
        if (!controlledFilter) setUncontrolledFilter(next);
        onFilterChange?.(next);
      },
      [controlledFilter, onFilterChange]
    );

    const [renameTarget, setRenameTarget] = React.useState<PasskeyCredential | null>(null);
    const [renameValue, setRenameValue] = React.useState("");
    const [removeTarget, setRemoveTarget] = React.useState<PasskeyCredential | null>(null);
    const [actionBusy, setActionBusy] = React.useState(false);

    const activeFilters = React.useMemo(() => {
      const present = new Set(passkeys.map((item) => item.device));
      const hasDefault = passkeys.some((item) => item.isDefault);
      return FILTER_OPTIONS.filter((option) => {
        if (option.id === "all") return true;
        if (option.id === "default") return hasDefault;
        return present.has(option.id as PasskeyDeviceKind);
      });
    }, [passkeys]);

    const openRename = (passkey: PasskeyCredential) => {
      setRenameTarget(passkey);
      setRenameValue(passkey.name);
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

    const handleSetDefault = async (passkey: PasskeyCredential) => {
      if (!onSetDefault || passkey.isDefault) return;
      setActionBusy(true);
      try {
        await onSetDefault(passkey.id);
      } finally {
        setActionBusy(false);
      }
    };

    const columns = React.useMemo<DataTableColumn<PasskeyCredential>[]>(
      () => [
        {
          id: "name",
          header: "Passkey",
          sortable: true,
          getSortValue: (row) => row.name.toLowerCase(),
          getSearchValue: (row) => passkeySearchBlob(row),
          cell: (row) => {
            const meta = DEVICE_META[row.device] ?? DEVICE_META.unknown;
            return (
              <div className="dk-passkey-mgmt__identity">
                <span className="dk-passkey-mgmt__device-icon" aria-hidden="true">
                  {meta.icon}
                </span>
                <div className="dk-passkey-mgmt__identity-copy">
                  <div className="dk-passkey-mgmt__name-row">
                    <span className="dk-passkey-mgmt__name">{row.name}</span>
                    {row.isDefault ? (
                      <Badge
                        appearance="icon-label"
                        tone="accent"
                        size="sm"
                        label="Default"
                        icon={<StarIcon />}
                        accessibleLabel="Default passkey"
                      />
                    ) : null}
                  </div>
                  <span className="dk-passkey-mgmt__device-label">{meta.label}</span>
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
          cell: (row) => row.browser || "—",
        },
        {
          id: "os",
          header: "OS",
          sortable: true,
          getSortValue: (row) => (row.os ?? "").toLowerCase(),
          getSearchValue: (row) => row.os ?? "",
          cell: (row) => row.os || "—",
        },
        {
          id: "createdAt",
          header: "Created",
          sortable: true,
          getSortValue: (row) => toDate(row.createdAt)?.getTime() ?? 0,
          getSearchValue: (row) => formatDate(row.createdAt, locale, dateStyle),
          cell: (row) => formatDate(row.createdAt, locale, dateStyle),
        },
        {
          id: "lastUsedAt",
          header: "Last used",
          sortable: true,
          getSortValue: (row) => toDate(row.lastUsedAt)?.getTime() ?? 0,
          getSearchValue: (row) => formatDate(row.lastUsedAt, locale, dateStyle),
          cell: (row) => formatDate(row.lastUsedAt, locale, dateStyle),
        },
        {
          id: "actions",
          header: "Actions",
          searchable: false,
          sortable: false,
          align: "end",
          cell: (row) => {
            const rowBusy = loading || actionBusy || busyId === row.id;
            return (
              <div className="dk-passkey-mgmt__actions">
                {onSetDefault && !row.isDefault ? (
                  <Button
                    size={actionButtonSize}
                    variant="quiet"
                    leadingIcon={<StarIcon />}
                    disabled={disabled || rowBusy}
                    loading={busyId === row.id}
                    onClick={() => void handleSetDefault(row)}
                  >
                    {setDefaultLabel}
                  </Button>
                ) : null}
                {onRename ? (
                  <Button
                    size={actionButtonSize}
                    variant="quiet"
                    leadingIcon={<RenameIcon />}
                    disabled={disabled || rowBusy}
                    onClick={() => openRename(row)}
                  >
                    {renameLabel}
                  </Button>
                ) : null}
                {onRemove ? (
                  <Button
                    size={actionButtonSize}
                    variant="destructive"
                    leadingIcon={<TrashIcon />}
                    disabled={disabled || rowBusy}
                    onClick={() => setRemoveTarget(row)}
                  >
                    {removeLabel}
                  </Button>
                ) : null}
              </div>
            );
          },
        },
      ],
      [
        actionBusy,
        actionButtonSize,
        busyId,
        dateStyle,
        disabled,
        loading,
        locale,
        onRemove,
        onRename,
        onSetDefault,
        renameLabel,
        removeLabel,
        setDefaultLabel,
      ]
    );

    const filterToolbar =
      showFilters && activeFilters.length > 1 ? (
        <TagGroup label="Filter passkeys" className="dk-passkey-mgmt__filters">
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

    const addAction =
      showAdd && onAdd ? (
        <Button
          size={actionButtonSize}
          variant={addButtonVariant}
          leadingIcon={<PlusIcon />}
          disabled={disabled || loading}
          onClick={onAdd}
        >
          {addLabel}
        </Button>
      ) : null;

    const resolvedEmptyActions =
      emptyActions ??
      (addAction ? <div className="dk-passkey-mgmt__empty-actions">{addAction}</div> : undefined);

    return (
      <div
        ref={ref}
        id={rootId}
        className={cx("dk-passkey-mgmt", `dk-passkey-mgmt--${variant}`, className)}
        data-variant={variant}
        data-loading={loading || undefined}
      >
        <Card variant={cardVariant} className="dk-passkey-mgmt__card">
          {headerSlot ?? (
            <Card.Header className="dk-passkey-mgmt__header">
              <div className="dk-passkey-mgmt__heading">
                <Card.Title>{title}</Card.Title>
                {description ? <Card.Description>{description}</Card.Description> : null}
              </div>
              {addAction ? <Card.Actions>{addAction}</Card.Actions> : null}
            </Card.Header>
          )}

          <Card.Body className="dk-passkey-mgmt__body">
            {filterToolbar}

            <DataTable
              caption="Registered passkeys"
              columns={columns}
              data={passkeys}
              search={search}
              onSearchChange={setSearch}
              showSearch={showSearch}
              searchLabel="Search passkeys"
              searchPlaceholder="Search by name, browser, or OS…"
              sort={sortProp}
              defaultSort={defaultSort}
              onSortChange={onSortChange}
              filterFn={(row) => matchesFilter(row, filter)}
              emptyTitle={emptyTitle}
              emptyDescription={emptyDescription}
              emptyIcon={<PasskeyEmptyIcon />}
              emptyActions={resolvedEmptyActions}
              emptySlot={emptySlot}
              noResultsTitle="No matching passkeys"
              noResultsDescription="Try another search or clear filters."
              toolbarSlot={toolbarSlot}
            />
          </Card.Body>
        </Card>

        <Dialog
          open={Boolean(renameTarget)}
          onOpenChange={(open) => {
            if (!open) closeRename();
          }}
          title="Rename passkey"
          description="Choose a name you’ll recognize on this device."
          size="sm"
          closeOnOutsideClick={!actionBusy}
          closeOnEscape={!actionBusy}
          actions={
            <>
              <Button
                size="sm"
                variant="secondary"
                disabled={actionBusy}
                onClick={closeRename}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                leadingIcon={<RenameIcon />}
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
            label="Passkey name"
            value={renameValue}
            onValueChange={setRenameValue}
            maxLength={64}
            fullWidth
            disabled={actionBusy}
            autoFocus
          />
        </Dialog>

        <Dialog
          open={Boolean(removeTarget)}
          onOpenChange={(open) => {
            if (!open && !actionBusy) setRemoveTarget(null);
          }}
          title="Remove passkey?"
          description={
            removeTarget
              ? `“${removeTarget.name}” will no longer be able to sign you in. This can’t be undone.`
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
                Keep passkey
              </Button>
              <Button
                size="sm"
                variant="destructive"
                leadingIcon={<TrashIcon />}
                loading={actionBusy}
                disabled={disabled}
                onClick={() => void submitRemove()}
              >
                Remove
              </Button>
            </>
          }
        />
      </div>
    );
  }
);

PasskeyManagement.displayName = "PasskeyManagement";
export default PasskeyManagement;
