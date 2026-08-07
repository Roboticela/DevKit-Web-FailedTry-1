# Media Overlay

Places controlled content over visual media — play mark, status, duration, selection, title, metadata, and actions.

## Placement

| `placement` | Use |
|-------------|-----|
| `top` | Edge band at the start of the block axis |
| `bottom` (default) | Edge band at the end — preferred on mobile for thumb reach |
| `corner` | Compact chip; set `corner` |
| `full` | Centered full-region overlay (e.g. large play) |

### Corner

`start-start` · `start-end` · `end-start` · `end-end` (default). Logical — RTL mirrors.

Scrims for top/bottom/full cover only the band needed for readability — not the entire image unless `full`.

## Contrast protection

| `protection` | Behavior |
|--------------|----------|
| `none` | No scrim |
| `subtle` (default when content exists) | Solid light scrim |
| `medium` | Stronger solid scrim |
| `true` / `false` | Aliases for subtle / none |

DevKit uses a **solid scrim**, not a heavy decorative gradient. Do not assume the photo provides enough contrast.

## Content

Props or compound slots:

- `showPlay` / `MediaOverlay.Play` — visual play mark (wire real play via Action)
- `selected` / `MediaOverlay.Selection`
- `status` / `MediaOverlay.Status`
- `duration` / `MediaOverlay.Duration`
- `title` / `MediaOverlay.Title`
- `metadata` / `MediaOverlay.Metadata`
- `action` / `MediaOverlay.Action` — compose DevKit `IconButton` / `Button`

```tsx
<div style={{ position: "relative" }}>
  <img src="/clip.jpg" alt="" />
  <MediaOverlay placement="bottom" protection="subtle">
    <MediaOverlay.Title>Product demo</MediaOverlay.Title>
    <MediaOverlay.Duration>3:42</MediaOverlay.Duration>
    <MediaOverlay.Action>
      <IconButton label="More" size="sm" variant="subtle" icon={<MoreIcon />} />
    </MediaOverlay.Action>
  </MediaOverlay>
</div>
```

Parent must establish a positioning context (`position: relative`).

## Interaction

- Overlay chrome is `pointer-events: none`; actions re-enable pointer events.
- Controls need visible `:focus-visible` and ≥44×44 touch targets (via DevKit controls).
- `revealOnHover`: fine-pointer enhancement only. On touch, content stays visible. Important actions must remain keyboard-reachable (`:focus-within`).

## Accessibility

- `decorative` — `aria-hidden`; use only for non-informative chrome.
- Meaningful overlays: provide `aria-label` and/or textual slots (title, status, duration).

## Themes

Light · Dark · High Contrast · RTL · reduced motion.
