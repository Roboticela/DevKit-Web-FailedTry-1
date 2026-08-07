# Empty State

Calm placeholder when a content area has nothing to show.

**Empty ≠ loading ≠ error.** Use Spinner/Skeleton while loading and Alert (or similar) for failures. Do not show an error icon for a normal empty state.

## Purpose

Answers:

1. **What** is empty?
2. **Why** is it empty (when useful)?
3. **What** can the user do next?

Do not blame the user. Do not force an action when none is meaningful.

## Structure

| Slot | Required | Notes |
|------|----------|--------|
| Illustration / icon | No | Modest; reinforces the situation |
| Title | Yes | What is empty |
| Description | No | Context / why |
| Primary action | No | DevKit `Button` / `LinkButton` |
| Secondary action | No | DevKit `Button` (secondary/ghost) |

Default hierarchy: **Title → Description → Action**.

## Variants (semantic cue only)

Host owns all copy — the component stays generic.

| `variant` | Typical use |
|-----------|-------------|
| `default` | Generic empty area |
| `first-use` | Nothing created yet |
| `no-results` | Search returned nothing |
| `filtered` | Filters hide everything |
| `completed` | Inbox / queue cleared |
| `permission` | No access (not a hard error chrome) |

## Size

| `size` | When |
|--------|------|
| `compact` | Dense panels, sidebars |
| `standard` | Default content areas |
| `large` | Full-page or hero empty |

Layout chooses size. Mobile tightens vertical spacing; desktop allows more room for `standard` / `large`.

## Actions

Pass existing DevKit interaction components — do not style custom buttons inside Empty State.

```tsx
<EmptyState
  title="No projects yet"
  description="Create a project to get started."
  variant="first-use"
  primaryAction={<Button onClick={onCreate}>Create project</Button>}
  secondaryAction={<Button variant="ghost">Learn more</Button>}
/>
```

Omit `primaryAction` / `secondaryAction` when there is nothing useful to do.

## Accessibility

- Landmark `section` labelled by the title (`aria-labelledby`).
- Description linked via `aria-describedby` when present.
- Decorative illustration marked `aria-hidden`.
- Action focus/labels come from the composed Button components.
- Supports Light / Dark / High Contrast, RTL, and dynamic localized text.

## Themes & motion

Uses design tokens. High contrast uses `CanvasText` outline. Honors `prefers-reduced-motion`.
