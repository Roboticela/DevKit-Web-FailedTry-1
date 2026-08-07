# Bottom Navigation (038)

Persistent **primary destinations** at the bottom of a mobile-oriented interface.

Distinct from Tab Bar (032): always bottom-anchored, labels stay visible, keyboard-aware so the bar does not cover focused inputs.

## Guidance

- Recommended **3–5** destinations (hard cap: 5 visible).
- Every destination: **icon + label** + active state.
- Optional badge/count.
- Edge-integrated surface with a top border — not a floating decorative object.
- No box-shadows / gradients.

## Keyboard & overlays

| `keyboardBehavior` | Behavior |
|--------------------|----------|
| `hide` (default) | Hides when the visual viewport shrinks (on-screen keyboard) |
| `persist` | Stays visible — host must scroll inputs above the bar |
| `none` | No automatic adaptation |

Hosts can also control via `keyboardOpen`. Content padding may use `--dk-bottom-nav-occupied`.

Safe area: `env(safe-area-inset-bottom)` when `safeArea` (default true).

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/BottomNavigation.tsx`, `styles/bottom-navigation.css` |
| `vite-express-tauri` | `src/components/ui/BottomNavigation.tsx`, `src/styles/bottom-navigation.css` |

## Example

```tsx
<BottomNavigation
  label="Primary"
  value={active}
  onValueChange={setActive}
  items={[
    { id: "home", label: "Home", icon: <HomeIcon />, href: "#home" },
    { id: "inbox", label: "Inbox", icon: <InboxIcon />, badge: 3 },
    { id: "search", label: "Search", icon: <SearchIcon /> },
    { id: "profile", label: "Profile", icon: <ProfileIcon /> },
  ]}
/>
```
