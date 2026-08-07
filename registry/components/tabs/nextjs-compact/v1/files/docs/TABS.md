# Tabs (031)

Switch between a **small set of related peer views** in the same contextual area.

Not for unrelated destinations or large navigation structures (use Navigation Menu / Tab Bar for those).

## Features

- Text, icon + text, and unambiguous icon-only tabs
- Active, hover, focus, pressed, disabled, loading
- Indicators: `underline` (default), `surface`, `pill`
- Activation: `automatic` (default) or `manual`
- Overflow: `scroll` (default, narrow-friendly) or explicit `wrap`
- Semantic `tablist` / `tab` / `tabpanel` relationships
- Only the active panel is rendered as active (`hidden` + no simultaneous content)
- RTL, high contrast, reduced motion, ≥44×44 hit targets

## Keyboard

| Key | Automatic | Manual |
|-----|-----------|--------|
| ← → | Move focus + activate | Move focus only |
| Home / End | First / last enabled | First / last focus |
| Enter / Space | — | Activate focused tab |
| Tab | Leave tab list to panel / page | Same |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Tabs.tsx`, `styles/tabs.css` |
| `vite-express-tauri` | `src/components/ui/Tabs.tsx`, `src/styles/tabs.css` |

## Example

```tsx
<Tabs
  label="Account sections"
  indicator="underline"
  activation="automatic"
  overflow="scroll"
  items={[
    { id: "overview", label: "Overview", panel: <p>…</p> },
    { id: "members", label: "Members", icon: <UsersIcon />, panel: <p>…</p> },
    { id: "billing", label: "Billing", disabled: true, panel: <p>…</p> },
  ]}
/>
```
