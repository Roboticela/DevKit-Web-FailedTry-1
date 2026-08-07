# Pagination (034)

Navigate a **finite multi-page** dataset or content collection.

## Patterns

**Expanded (desktop default)**

`Previous · 1 · 2 · 3 · … · N · Next`

**Compact (mobile / `layout="compact"`)**

`Previous · Page 4 of 20 · Next`

## Features

- Previous / Next (optional First / Last)
- Intelligent page-number collapsing — never dumps every page when `pageCount` is large
- Current page marked with weight + border + surface (not color alone)
- Disabled previous on first page; disabled next on last page
- Meaningful accessible names on every control (no unlabeled icon-only arrows)
- `layout="auto" | "expanded" | "compact"`
- Optional `pageSizeControl` composition slot
- RTL: chevrons mirror; Previous/Next semantics stay bound to page order
- Keyboard: ← → Home End when focus is within the list

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Pagination.tsx`, `styles/pagination.css` |
| `vite-express-tauri` | `src/components/ui/Pagination.tsx`, `src/styles/pagination.css` |

## Example

```tsx
<Pagination
  page={page}
  pageCount={50}
  onPageChange={setPage}
  showFirstLast
  layout="auto"
  pageSizeControl={
    <Select
      label="Rows"
      hideLabel
      options={[
        { value: "10", label: "10 / page" },
        { value: "25", label: "25 / page" },
      ]}
      value={pageSize}
      onValueChange={setPageSize}
    />
  }
/>
```
