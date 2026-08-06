# Responsive Visibility Engine

DevKit Layer 1 foundation (`responsive-visibility`, id **96**).

Determines whether UI should render based on **device characteristics**, **viewport size**, **orientation**, **permissions**, **feature flags**, **application state**, **accessibility preferences**, and **responsive breakpoints**.

CSS-first presets (zero JS) plus optional React gates for roles, intersection, lazy mount, and app state — with SSR / hydration safety.

## Install

```bash
npx @roboticela/devkit add responsive-visibility
```

```ts
import "@/styles/visibility-system.css";
import {
  Visibility,
  VisibilityProvider,
  MobileOnly,
  DesktopOnly,
  useVisibility,
  useViewportObservation,
} from "@/components/ui/ResponsiveVisibility";
```

## Quick start

```tsx
<MobileOnly>Mobile nav</MobileOnly>
<DesktopOnly>Desktop sidebar</DesktopOnly>

<Visibility preset="landscape-only" block>
  Landscape toolbar
</Visibility>

<VisibilityProvider roles={["admin"]} flags={{ beta: true }} state={{ onboarded: true }}>
  <Visibility role="admin" flag="beta" stateKey="onboarded" lazy>
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
| `touch-only` / `coarse-pointer` | Coarse pointer |
| `hover-capable` / `fine-pointer` | Hover / fine pointer |
| `from-sm` … `until-xl` | Breakpoint ranges |

Helpers: `MobileOnly`, `TabletOnly`, `DesktopOnly`, `LargeScreens`, `LandscapeOnly`, `PortraitOnly`, `PrintMode`, `ScreenOnly`, `Foldables`, `AccessibilityMode`, `TouchOnly`, `HoverCapable`.

Use `block` when `display: contents` is undesirable.

## Modes

| Mode | When gated off |
|------|----------------|
| `hide` (default) | Unmount / `display: none` + `hidden` |
| `preserve` | Keep layout (`visibility: hidden`) — not in a11y tree |
| `accessible` | **Hidden-but-accessible** — visually clipped, stays in a11y tree |
| `collapse` | Animate closed via grid rows |
| `fade` | Opacity transition |
| `show` | Always show |

`motion` enables transition tokens (honors reduced motion).

## JS gates

```tsx
<Visibility when={ready} unless={loading} />
<Visibility match="(min-width: 900px)" />
<Visibility above="md" below="xl" />
<Visibility minWidth={600} maxWidth={1200} />
<Visibility orientation="portrait" pointer="coarse" hover="none" touch />
<Visibility role="editor" permission="docs:write" matchMode="all" />
<Visibility flag="new-dashboard" flagsAll={["beta", "charts"]} />
<Visibility stateKey="onboardingComplete" />
<Visibility whenState={(s) => s.step === 3 && !s.dismissed} />
<Visibility reducedMotion="hide" prefersContrast />
<Visibility invert when={isGuest} />
```

`strategy`: `css` | `js` | `auto` (default — CSS for presets alone; JS when gates need it).

## Lazy · intersection · viewport

```tsx
<Visibility
  lazy
  keepMounted
  intersection={{ rootMargin: "80px", threshold: 0.1 }}
  motion
  mode="fade"
  onVisible={(e) => analytics.track("panel_view", e)}
>
  Heavy chart
</Visibility>

const viewport = useViewportObservation();
// width, height, visualWidth, scale, offsetTop…
```

Intersection always mounts a **sentinel** so `lazy` + `hide` still observe the viewport.

## SSR & hydration

- CSS presets are hydration-safe (`suppressHydrationWarning`).
- JS media gates use `ssrFallback` (default `true`) until hydrated when `hydrateSafe` (default `true`).
- Prefer CSS presets for pure breakpoint UI to avoid listeners and mismatch.

```tsx
<Visibility above="lg" ssrFallback={false} hydrateSafe>
  Desktop-only after hydrate
</Visibility>
```

Optional: `<VisibilityScript />` in `<head>` for `data-dk-vis-hydrated`.

## Hooks

```tsx
const wide = useMediaQuery("(min-width: 1024px)");
const reduce = usePrefersReducedMotion();
const show = useVisibility({ above: "md", role: "admin", flag: "beta" });
const vp = useViewportObservation();
const hydrated = useHydrated();
```

## Provider

```tsx
<VisibilityProvider
  roles={session.roles}
  permissions={session.permissions}
  flags={remoteFlags}
  state={{ sidebarOpen, step }}
>
  {children}
</VisibilityProvider>
```
