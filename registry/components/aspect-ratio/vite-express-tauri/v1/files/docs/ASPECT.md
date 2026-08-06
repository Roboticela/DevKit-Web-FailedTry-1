# Aspect Ratio

**Package:** `aspect-ratio` · **Layer:** 1 Foundation · **ID:** 20  
**Group:** Layout System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Keeps media and layouts in consistent proportions — images, video, charts, previews, documents, AI media, and embeds.

## Install

```bash
devkit add aspect-ratio
```

```css
@import "./aspect-system.css";
```

## API

```tsx
import {
  AspectRatio,
  AspectVideo, AspectSquare, AspectCard, AspectA4, AspectMobile,
} from "./AspectRatio";

<AspectRatio preset="16:9">
  <img src="…" alt="" />
</AspectRatio>

<AspectRatio preset="card" fit="contain" position="top" radius="lg" />
<AspectRatio ratio="21:9" />
<AspectRatio ratio={1.618} /> {/* golden */}
<AspectRatio preset={{ base: "9:16", md: "16:9" }} motion />

<AspectRatio loading="skeleton" lazy>
  <img src="…" alt="" />
</AspectRatio>

<AspectRatio preset="widget" align="center">
  <Chart />
</AspectRatio>
```

## Presets

| Preset | Ratio |
|--------|-------|
| `1:1` / `square` | 1 / 1 |
| `4:3` / `photo` | 4 / 3 |
| `3:4` / `portrait` | 3 / 4 |
| `16:9` / `video` | 16 / 9 |
| `9:16` | story / vertical |
| `21:9` / `ultrawide` | cinematic |
| `a4` / `a4-landscape` | document preview |
| `card` | 3 / 2 |
| `widget` | 4 / 3 dashboard tile |
| `mobile` | ~phone screen |
| `tablet` | portrait tablet |

Custom: `ratio="16:9"` · `ratio="16/9"` · `ratio={1.5}`

## Features

- **Fit** — cover · contain · fill · none · scale-down
- **Position** — crop focus (top, center, …)
- **Align** — content alignment inside the box
- **Overflow** — hidden · visible · clip · auto
- **Radius** — none → full
- **Loading** — skeleton placeholder
- **Lazy** — `content-visibility` + `loading="lazy"` on images
- **Motion** — smooth ratio transitions (honors reduced motion)
- **Responsive** — `preset={{ base, md, lg }}`

## Legacy

`preset="video|square|photo|portrait|custom"` and `ratio` string still work.
