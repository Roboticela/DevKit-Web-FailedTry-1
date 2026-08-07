# Theme Toggle

System / Light / Dark chips, then a ⋯ control that opens themes and primary colors.

## Purpose
Switch appearance mode, curated theme presets, and primary color without a separate color control in the toolbar.

## Anatomy
- Appearance radiogroup with icons (System, Light, Dark)
- Three-dots button after Dark → popup with Themes list + Colors (compose ColorPalette grid)

## Accessibility
- `role="radiogroup"` / `role="radio"` for appearance
- `aria-expanded` / `dialog` + `listbox` for presets
- Escape closes the popup

## Anti-patterns
- Do not replace this with Tabs for three appearance options.
- Do not communicate selection by color alone — selected chips use border + background.
- Prefer composing ColorPalette into `colorPalette` instead of building a custom swatch grid.
