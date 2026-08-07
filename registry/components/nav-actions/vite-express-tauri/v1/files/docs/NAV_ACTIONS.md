# Nav Actions

Spacing cluster for navbar utility items (theme, account links, icon actions).

## Purpose
Keep consistent gaps between navbar end actions without ad-hoc margins.

## Anatomy
- Root group (`role="group"`)
- `NavActions.Item` wrappers for each control

## Composition
Compose ThemeToggle, NavItem, Link, IconButton, ColorPalette — do not invent controls inside this package.

## Densities
`compact` | `standard` | `spacious` — mapped to spacing tokens (`--space-2` / `--space-3` / `--space-4`).

## Mobile
With `collapseLabelsOnMobile` (default), NavItem / Link labels visually collapse under `md` while accessible names remain.

## Anti-patterns
- Do not use this for primary navigation lists — use NavItem rows / NavigationDrawer.
- Do not add box-shadows or gradients.
