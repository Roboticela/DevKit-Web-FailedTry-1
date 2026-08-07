# Content Block

Neutral structural primitive for grouping related content **without** a card-like visual container.

Establishes spacing, hierarchy, alignment, and grouping. Intentionally lighter than Card — no automatic background, border, shadow, or large radius.

## Structure

```
Heading
Supporting text
Content
```

or:

```
Heading + Action
Content
```

```tsx
<ContentBlock
  density="standard"
  heading="Notifications"
  description="Choose how you want to be reached."
  metadata="Updated today"
  divider
  actions={
    <>
      <Button size="sm" variant="quiet">Cancel</Button>
      <Button size="sm">Save</Button>
    </>
  }
>
  {/* form fields, lists, or nested primitives */}
</ContentBlock>
```

## Density

| `density` | Rhythm |
|-----------|--------|
| `compact` | Tight |
| `standard` (default) | Default |
| `spacious` | More breathing room |

## Header layout

| `headerLayout` | Behavior |
|----------------|----------|
| `responsive` (default) | Actions stack under heading on narrow screens; inline from 640px |
| `inline` | Heading and actions on one row |
| `stacked` | Always stacked |

## Slots

`ContentBlock.Heading` · `Description` · `Metadata` · `Actions` · `Content` · `Header`

Optional `divider` renders a subtle hairline under the header (or compose [Divider](./DIVIDER.md)).

## Composition

Suitable inside pages, cards, dialogs, drawers, lists, detail views, settings, and dashboards — without becoming visually dominant.

Actions must compose DevKit Interaction Controls.

Long headings and descriptions wrap naturally. Supports RTL, localization, dynamic text, and high contrast.
