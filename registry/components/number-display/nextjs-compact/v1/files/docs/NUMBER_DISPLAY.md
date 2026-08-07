# Number Display

Presents numeric information with strong visual clarity.

Not a metric card — optional label, trend, comparison, and context stay secondary.

## Formats

| `format` | Notes |
|----------|--------|
| `integer` | Whole numbers |
| `decimal` | Default when value is non-integer |
| `currency` | Requires `currency` (ISO 4217, default `USD`) |
| `percent` | See `percentAs` |
| `signed` | Emphasizes sign via `signDisplay` |
| `unit` | CLDR `unit` (e.g. `kilogram`) or use `suffix` for custom |

Formatting uses **`Intl.NumberFormat`** — separators follow the locale (`1,234.56` / `1 234,56` / `1.234,56`). Never hardcode commas or periods.

## Compact (opt-in only)

```tsx
<NumberDisplay value={1_200_000} compact="short" /> // e.g. 1.2M
```

`compact`: `never` (default) · `short` · `long`

Do not enable compact when precision matters. Screen readers receive the **full** non-compact value via `aria-label`.

## Percent

- `percentAs="ratio"` (default) — `0.984` → 98.4%
- `percentAs="unit"` — `98.4` → 98.4%

## States

`value` · `loading` · `unknown` · `unavailable`

Loading uses a reserved skeleton width (`loadingWidthCh`) to avoid layout shift.

## Optional chrome (keep light)

`label` · `context` · `comparison` · `trend` · `prefix` · `suffix` · `unit`

## Alignment & tabular

`tabular` defaults on for currency / decimal / integer / signed / percent — stable digit width for columns.

`align`: `start` · `end` · `center`

## Sign / tone

Negative values keep a visible sign. Tone (`auto` / `positive` / `negative`) adds weight and underline — **not color alone**. High contrast reinforces non-color cues.

## Themes

Light · Dark · High Contrast · RTL · dynamic text scaling.
