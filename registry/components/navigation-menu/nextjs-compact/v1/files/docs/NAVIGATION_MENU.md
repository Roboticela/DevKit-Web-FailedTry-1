# Navigation Menu (036)

Reusable **hierarchical destinations** — independent of application shells.

Do **not** embed a sidebar, drawer, or sheet here. Hosts compose those surfaces and pass the same menu data.

## Features

- Primary / secondary / nested / grouped items
- Section labels, icons, badges
- Active + disabled states
- Expandable branches (≤ 3 visible levels recommended)
- `density="expanded" | "collapsed"` for collapsible host chrome
- Keyboard: ↑ ↓ Home End, ← → expand/collapse, Enter/Space, Escape collapses parent
- RTL, high contrast, reduced motion, ≥44×44 hits

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/NavigationMenu.tsx`, `styles/navigation-menu.css` |
| `vite-express-tauri` | `src/components/ui/NavigationMenu.tsx`, `src/styles/navigation-menu.css` |

## Example

```tsx
<NavigationMenu
  label="Workspace"
  density={collapsed ? "collapsed" : "expanded"}
  value={active}
  onValueChange={setActive}
  groups={[
    {
      id: "main",
      label: "Main",
      items: [
        { id: "home", label: "Home", icon: <HomeIcon />, href: "#home" },
        {
          id: "projects",
          label: "Projects",
          icon: <GridIcon />,
          defaultExpanded: true,
          children: [
            { id: "active", label: "Active", href: "#active" },
            { id: "archived", label: "Archived", href: "#archived" },
          ],
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      items: [
        { id: "team", label: "Team", badge: 3 },
        { id: "billing", label: "Billing", disabled: true },
      ],
    },
  ]}
/>
```
