# Data Table

Semantic sortable / searchable table. Composes **Search Field** and **Empty State**. Do not invent ad-hoc tables.

## Usage

```tsx
<DataTable
  caption="Registered passkeys"
  columns={[
    { id: "name", header: "Name", accessor: "name", sortable: true },
    { id: "createdAt", header: "Created", cell: (row) => formatDate(row.createdAt), sortable: true },
  ]}
  data={rows}
  showSearch
/>
```

## Features

- Column sorting (`sortable`, `aria-sort`)
- Toolbar search via Search Field
- Empty / no-results via Empty State
