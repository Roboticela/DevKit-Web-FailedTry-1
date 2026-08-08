import * as React from "react";
import {
  SearchField,
  type SearchFieldSize,
} from "../../../../../../../search-field/nextjs-compact/v1/files/components/ui/SearchField";
import { EmptyState } from "../../../../../../../empty-state/nextjs-compact/v1/files/components/ui/EmptyState";

/**
 * Data Table — sortable, searchable tabular data.
 * Semantic <table>. Compose Empty State for empty / no-results. Do not invent custom tables.
 */

export type DataTableSortDirection = "asc" | "desc";

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  /** Field key on the row, or custom cell renderer. */
  accessor?: keyof T & string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  /** Used for text search when `searchable` columns are scanned. */
  searchable?: boolean;
  getSortValue?: (row: T) => string | number | Date | null | undefined;
  getSearchValue?: (row: T) => string;
  align?: "start" | "center" | "end";
  width?: string | number;
};

export type DataTableSort = {
  columnId: string;
  direction: DataTableSortDirection;
};

export type DataTableProps<T extends { id: string }> = {
  columns: DataTableColumn<T>[];
  data: T[];
  caption?: string;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
  searchLabel?: string;
  searchPlaceholder?: string;
  searchSize?: SearchFieldSize;
  /** Host filter predicate applied after search. */
  filterFn?: (row: T, query: string) => boolean;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyActions?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  noResultsTitle?: React.ReactNode;
  noResultsDescription?: React.ReactNode;
  emptySlot?: React.ReactNode;
  toolbarSlot?: React.ReactNode;
  getRowId?: (row: T) => string;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function defaultSearchValue<T>(row: T, column: DataTableColumn<T>): string {
  if (column.getSearchValue) return column.getSearchValue(row);
  if (column.accessor) {
    const value = row[column.accessor];
    return value == null ? "" : String(value);
  }
  return "";
}

function defaultSortValue<T>(row: T, column: DataTableColumn<T>): string | number {
  if (column.getSortValue) {
    const value = column.getSortValue(row);
    if (value instanceof Date) return value.getTime();
    if (value == null) return "";
    return value as string | number;
  }
  if (column.accessor) {
    const value = row[column.accessor];
    if (value instanceof Date) return value.getTime();
    if (typeof value === "number") return value;
    return value == null ? "" : String(value);
  }
  return "";
}

function SortIcon({ direction }: { direction: DataTableSortDirection | null }) {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.5 6.25 8 2.75l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={direction === "asc" ? 1 : 0.35}
      />
      <path
        d="M4.5 9.75 8 13.25l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={direction === "desc" ? 1 : 0.35}
      />
    </svg>
  );
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  caption,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  showSearch = true,
  searchLabel = "Search",
  searchPlaceholder = "Search…",
  searchSize = "sm",
  filterFn,
  emptyTitle = "No items",
  emptyDescription = "There is nothing to show yet.",
  emptyActions,
  emptyIcon,
  noResultsTitle = "No matches",
  noResultsDescription = "Try a different search.",
  emptySlot,
  toolbarSlot,
  getRowId = (row) => row.id,
  className = "",
  id,
}: DataTableProps<T>) {
  const controlledSort = sortProp !== undefined;
  const controlledSearch = searchProp !== undefined;
  const [uncontrolledSort, setUncontrolledSort] = React.useState<DataTableSort | null>(defaultSort);
  const [uncontrolledSearch, setUncontrolledSearch] = React.useState(defaultSearch);

  const sort = controlledSort ? sortProp! : uncontrolledSort;
  const search = controlledSearch ? searchProp! : uncontrolledSearch;

  const setSort = React.useCallback(
    (next: DataTableSort | null) => {
      if (!controlledSort) setUncontrolledSort(next);
      onSortChange?.(next);
    },
    [controlledSort, onSortChange]
  );

  const setSearch = React.useCallback(
    (next: string) => {
      if (!controlledSearch) setUncontrolledSearch(next);
      onSearchChange?.(next);
    },
    [controlledSearch, onSearchChange]
  );

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    let rows = data;
    if (filterFn) {
      rows = rows.filter((row) => filterFn(row, query));
    }
    if (query) {
      const searchable = columns.filter((column) => column.searchable !== false);
      rows = rows.filter((row) =>
        searchable.some((column) => defaultSearchValue(row, column).toLowerCase().includes(query))
      );
    }
    if (sort) {
      const column = columns.find((item) => item.id === sort.columnId);
      if (column?.sortable) {
        const direction = sort.direction === "asc" ? 1 : -1;
        rows = [...rows].sort((a, b) => {
          const av = defaultSortValue(a, column);
          const bv = defaultSortValue(b, column);
          if (av < bv) return -1 * direction;
          if (av > bv) return 1 * direction;
          return 0;
        });
      }
    }
    return rows;
  }, [columns, data, filterFn, search, sort]);

  const toggleSort = (columnId: string) => {
    if (!sort || sort.columnId !== columnId) {
      setSort({ columnId, direction: "asc" });
      return;
    }
    if (sort.direction === "asc") {
      setSort({ columnId, direction: "desc" });
      return;
    }
    setSort(null);
  };

  const isEmptyData = data.length === 0;
  const isNoResults = !isEmptyData && filtered.length === 0;

  return (
    <div id={id} className={cx("dk-data-table", className)} data-empty={isEmptyData || isNoResults}>
      {(showSearch || toolbarSlot) && (
        <div className="dk-data-table__toolbar">
          {showSearch ? (
            <SearchField
              label={searchLabel}
              hideLabel
              appearance="toolbar"
              size={searchSize}
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
              resultsStatus={search ? (filtered.length ? "available" : "empty") : "idle"}
              fullWidth
            />
          ) : null}
          {toolbarSlot}
        </div>
      )}

      {isEmptyData || isNoResults ? (
        emptySlot ?? (
          <EmptyState
            variant="compact"
            title={isEmptyData ? emptyTitle : noResultsTitle}
            description={isEmptyData ? emptyDescription : noResultsDescription}
            icon={emptyIcon}
            actions={isEmptyData ? emptyActions : undefined}
          />
        )
      ) : (
        <div className="dk-data-table__scroller">
          <table className="dk-data-table__table">
            {caption ? <caption className="dk-data-table__caption">{caption}</caption> : null}
            <thead>
              <tr>
                {columns.map((column) => {
                  const active = sort?.columnId === column.id ? sort.direction : null;
                  const align = column.align ?? "start";
                  return (
                    <th
                      key={column.id}
                      scope="col"
                      className={cx(
                        "dk-data-table__th",
                        `dk-data-table__th--${align}`,
                        column.sortable && "dk-data-table__th--sortable"
                      )}
                      style={column.width ? { width: column.width } : undefined}
                      aria-sort={
                        column.sortable
                          ? active === "asc"
                            ? "ascending"
                            : active === "desc"
                              ? "descending"
                              : "none"
                          : undefined
                      }
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          className="dk-data-table__sort"
                          onClick={() => toggleSort(column.id)}
                        >
                          <span>{column.header}</span>
                          <SortIcon direction={active} />
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={getRowId(row)} className="dk-data-table__tr">
                  {columns.map((column) => {
                    const align = column.align ?? "start";
                    const content =
                      column.cell?.(row) ??
                      (column.accessor ? String(row[column.accessor] ?? "") : null);
                    return (
                      <td
                        key={column.id}
                        className={cx("dk-data-table__td", `dk-data-table__td--${align}`)}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

DataTable.displayName = "DataTable";
export default DataTable;
