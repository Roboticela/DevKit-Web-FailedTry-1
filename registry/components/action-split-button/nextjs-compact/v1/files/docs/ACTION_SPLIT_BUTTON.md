# Split Button

**ID 093** — Action & Control Compositions.

Combines a **primary action** (runs immediately) with a **menu trigger** (opens related alternatives).

Example: `[ Save ] [ ⌄ ]`

Distinct from Interaction Controls **004 Split Button**, which embeds its own menu. This composition **does not implement the menu** — compose **Dropdown Menu** (or another menu primitive) around `ActionSplitMenuTrigger`.

## Behavior

| Region | Role |
|--------|------|
| Primary | Immediate action (`onPrimaryClick`) |
| Menu trigger | Opens alternatives — `aria-haspopup`, chevron / disclosure |

- Do not make the entire control open the menu.
- Keyboard: each region is independently focusable (Tab).
- Primary disabled ≠ menu disabled (`primaryDisabled` / `menuDisabled`).
- Menu trigger meets the minimum touch target via an expanded hit area.

## API

```tsx
<ActionSplitButton
  variant="primary"
  onPrimaryClick={() => save()}
  menu={
    <DropdownMenu label="Save options" items={saveItems}>
      <ActionSplitMenuTrigger label="More save options" />
    </DropdownMenu>
  }
>
  Save
</ActionSplitButton>
```

Pass matching `size` / `variant` to `ActionSplitMenuTrigger` when not using defaults.

## States

Default · hover · focus · pressed · disabled (per region) · loading (primary).

## Themes

Light · Dark · High Contrast · RTL (logical radii).
