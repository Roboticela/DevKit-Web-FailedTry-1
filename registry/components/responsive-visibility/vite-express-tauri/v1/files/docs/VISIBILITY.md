# Responsive Visibility

DevKit Layer 1 foundation (`responsive-visibility`, id **96**).

Controls when UI is shown using **CSS-first viewport presets** and optional **JS gates** for roles, permissions, feature flags, accessibility preferences, intersection, and app state.

## Install

```bash
npx @roboticela/devkit add responsive-visibility
```

Import the system stylesheet once (after spacing / theme):

```ts
import "@/styles/visibility-system.css";
```

## Quick start

```tsx
import {
  Visibility,
  MobileOnly,
  DesktopOnly,
  VisibilityProvider,
} from "@/components/ui/ResponsiveVisibility";

<MobileOnly>Mobile nav</MobileOnly>
<DesktopOnly>Desktop sidebar</DesktopOnly>

<Visibility preset="landscape-only" block>
  Landscape toolbar
</Visibility>

<VisibilityProvider roles={["admin"]} flags={{ beta: true }}>
  <Visibility role="admin" flag="beta" lazy>
    Admin beta panel
  </Visibility>
</VisibilityProvider>
```

## Presets (CSS-first)

| Preset | Behavior |
|--------|----------|
| `mobile-only` | &lt; 768px |
| `tablet-only` | 768–1023px |
| `desktop-only` | ≥ 1024px |
| `large-only` / `large-screens` | ≥ 1280px |
| `landscape-only` / `portrait-only` | Orientation |
| `print` / `print-only` | Print media |
| `screen-only` | Hidden when printing |
| `foldables` / `foldable-only` | Multi-segment viewports |
| `accessibility` / `a11y-only` | Reduced motion **or** more contrast |
| `reduced-motion-only` | Prefers reduced motion |
| `motion-ok-only` | Hidden when motion is reduced |
| `from-md` / `until-md` / `from-lg` / `until-lg` | Breakpoint ranges |

Helpers: `MobileOnly`, `TabletOnly`, `DesktopOnly`, `LargeScreens`, `LandscapeOnly`, `PortraitOnly`, `PrintMode`, `ScreenOnly`, `Foldables`, `AccessibilityMode`.

Use `block` when `display: contents` is undesirable (e.g. measured boxes).

## Modes

| Mode | When gated off |
|------|----------------|
| `hide` (default) | Unmount / `display: none` + `hidden` |
| `preserve` | Keep layout (`visibility: hidden`) |
| `collapse` | Animate closed via grid rows |
| `fade` | Opacity transition |
| `show` | Always show (ignore negative gates) |

`motion` enables transition tokens (respects reduced motion).

## JS gates

```tsx
<Visibility when={ready} unless={loading} />
<Visibility match="(min-width: 900px)" />
<Visibility above="md" below="xl" />
<Visibility minWidth={600} maxWidth={1200} />
<Visibility orientation="portrait" />
<Visibility role="editor" permission="docs:write" />
<Visibility flag="new-dashboard" />
<Visibility stateKey="onboardingComplete" />
<Visibility reducedMotion="hide" />
<Visibility prefersContrast />
<Visibility invert when={isGuest} />
```

`strategy`:

- `css` — class-only (presets)
- `js` — always evaluate in JS
- `auto` (default) — CSS for presets alone; JS when gates / modes need it

## Performance & a11y

- **`lazy`** — skip mounting until visible (optional `keepMounted`)
- **`intersection`** — IntersectionObserver gate + `onVisible` / `onVisibilityChange`
- Hidden content gets `aria-hidden` / `hidden` as appropriate
- Prefer CSS presets for pure breakpoint UI to avoid hydration mismatch and listeners

```tsx
<Visibility
  lazy
  intersection={{ rootMargin: "80px", threshold: 0.1 }}
  onVisible={(e) => analytics.track("panel_view", e)}
>
  Heavy chart
</Visibility>
```

## Hooks

```tsx
const wide = useMediaQuery("(min-width: 1024px)");
const reduce = usePrefersReducedMotion();
const show = useVisibility({ above: "md", role: "admin" });
```

## Provider

```tsx
<VisibilityProvider
  roles={session.roles}
  permissions={session.permissions}
  flags={remoteFlags}
  state={{ sidebarOpen }}
>
  {children}
</VisibilityProvider>
```
