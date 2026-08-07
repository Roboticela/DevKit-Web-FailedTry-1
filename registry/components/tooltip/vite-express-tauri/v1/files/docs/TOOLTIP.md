# Tooltip

Brief supplementary information about an interface element.

**Not for:** critical instructions, primary labels when a visible label is practical, interactive content (use Popover), or large paragraphs.

## When to use

- Short clarification for an icon or compact control
- Extra context the user may benefit from

## Behavior

| Input | Behavior |
|-------|----------|
| Pointer hover | Show after a short delay; hide shortly after leave |
| Keyboard focus | Show immediately; hide on blur |
| Touch | Long-press to show (does not replace short-tap activation); auto-dismiss / outside press |
| Escape | Dismisses |

Tooltips are **non-interactive** (`pointer-events: none`). Do not trap focus. Do not place controls inside.

## Placement

`top` · `bottom` · `left` · `right` · `auto`

The tooltip stays inside the viewport. When space is insufficient it flips / shifts automatically. Physical sides are used; text direction follows RTL via `text-align: start`.

## Semantics

- Floating surface: `role="tooltip"`
- Trigger: `aria-describedby` while open
- Host owns localized `content`

## Composition

```tsx
<Tooltip content="Download the report as CSV">
  <IconButton label="Download" />
</Tooltip>

<Tooltip content="Saved automatically every few minutes." placement="bottom">
  <Button variant="quiet">Autosave</Button>
</Tooltip>
```

## Accessibility notes

- Do not delay essential information excessively — focus shows immediately.
- Do not rely on tooltips as the only accessible name; controls still need a proper label.
- Subtle show/hide timing; respects `prefers-reduced-motion`.

## Themes

Light / Dark / High Contrast via tokens. Elevation uses border + surface tokens (no box-shadow, no gradient). Z-index: `var(--z-tooltip)`.
