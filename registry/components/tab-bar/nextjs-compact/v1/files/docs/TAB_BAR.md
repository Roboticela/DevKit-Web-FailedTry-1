# Tab Bar (032)

Persistent navigation for **primary destinations** inside a bounded application context.

Related to Tabs (031), but optimized for navigation — not in-page peer panels.

## Guidance

- Prefer **3–5** destinations (supported **2–5**)
- Icons reinforce labels; icon-only only when meaning is unambiguous
- Do not overload with many destinations or unrelated actions
- Active state uses indicator + weight — never color alone

## Placement

| `placement` | Behavior |
|-------------|----------|
| `auto` (default) | Bottom under ~480px; top on larger viewports |
| `bottom` | Sticky bottom bar with safe-area inset |
| `top` | Sticky top bar |
| `contextual` | Embedded local shell (not viewport-sticky) |

## Features

- Labels, icons, badges/counts, disabled items
- `href` items render as real links
- Safe-area insets for bottom (and top when enabled)
- Compact height — does not fight the home indicator
- Keyboard arrows / Home / End; roving tabindex
- RTL, dark, high contrast, reduced motion

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/TabBar.tsx`, `styles/tab-bar.css` |
| `vite-express-tauri` | `src/components/ui/TabBar.tsx`, `src/styles/tab-bar.css` |

## Example

```tsx
<TabBar
  label="Primary"
  placement="auto"
  value={section}
  onValueChange={setSection}
  items={[
    { id: "home", label: "Home", icon: <HomeIcon /> },
    { id: "search", label: "Search", icon: <SearchIcon /> },
    { id: "inbox", label: "Inbox", icon: <InboxIcon />, badge: 3 },
    { id: "profile", label: "Profile", icon: <UserIcon /> },
  ]}
/>
```
