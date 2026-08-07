import { useEffect, useState } from "react";
import { SegmentedControl } from "../../registry/components/segmented-control/vite-express-tauri/v1/files/src/components/ui/SegmentedControl";
import { Switch } from "../../registry/components/switch/vite-express-tauri/v1/files/src/components/ui/Switch";

export type PlaygroundTheme = "light" | "dark" | "hc";
export type PlaygroundDensity = "compact" | "comfortable" | "spacious";
export type PlaygroundDir = "ltr" | "rtl";

const STORAGE_KEY = "devkit-playground-prefs";

type Prefs = {
  theme: PlaygroundTheme;
  density: PlaygroundDensity;
  dir: PlaygroundDir;
  reducedMotion: boolean;
  reducedTransparency: boolean;
};

const DEFAULTS: Prefs = {
  theme: "light",
  density: "comfortable",
  dir: "ltr",
  reducedMotion: false,
  reducedTransparency: false,
};

function readPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function applyPrefs(prefs: Prefs) {
  const root = document.documentElement;
  root.setAttribute("data-theme", prefs.theme);
  if (prefs.theme === "hc") {
    root.setAttribute("data-contrast", "high");
  } else {
    root.removeAttribute("data-contrast");
  }
  root.setAttribute("data-density", prefs.density);
  root.setAttribute("dir", prefs.dir);
  root.setAttribute("data-motion", prefs.reducedMotion ? "reduce" : "full");
  root.setAttribute(
    "data-transparency",
    prefs.reducedTransparency ? "reduce" : "full"
  );
}

// Apply before first paint when the module loads (avoids a theme flash).
if (typeof document !== "undefined") {
  applyPrefs(readPrefs());
}

/** Sticky chrome — appearance modes DevKit components are built to support. */
export function PlaygroundToolbar() {
  const [prefs, setPrefs] = useState<Prefs>(() =>
    typeof window === "undefined" ? DEFAULTS : readPrefs()
  );

  useEffect(() => {
    applyPrefs(prefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore quota */
    }
  }, [prefs]);

  const patch = (partial: Partial<Prefs>) =>
    setPrefs((prev) => ({ ...prev, ...partial }));

  return (
    <div className="playground-toolbar" role="region" aria-label="Playground appearance">
      <div className="playground-toolbar__row">
        <SegmentedControl
          label="Theme"
          size="sm"
          overflow="scroll"
          equalWidth={false}
          options={[
            { id: "light", label: "Light" },
            { id: "dark", label: "Dark" },
            { id: "hc", label: "High contrast" },
          ]}
          value={prefs.theme}
          onValueChange={(id) => patch({ theme: id as PlaygroundTheme })}
        />
        <SegmentedControl
          label="Density"
          size="sm"
          overflow="scroll"
          equalWidth={false}
          options={[
            { id: "compact", label: "Compact" },
            { id: "comfortable", label: "Comfortable" },
            { id: "spacious", label: "Spacious" },
          ]}
          value={prefs.density}
          onValueChange={(id) => patch({ density: id as PlaygroundDensity })}
        />
        <SegmentedControl
          label="Direction"
          size="sm"
          equalWidth={false}
          options={[
            { id: "ltr", label: "LTR" },
            { id: "rtl", label: "RTL" },
          ]}
          value={prefs.dir}
          onValueChange={(id) => patch({ dir: id as PlaygroundDir })}
        />
      </div>

      <div className="playground-toolbar__row playground-toolbar__row--toggles">
        <Switch
          label="Reduced motion"
          checked={prefs.reducedMotion}
          onCheckedChange={(on) => patch({ reducedMotion: on })}
        />
        <Switch
          label="Reduced transparency"
          checked={prefs.reducedTransparency}
          onCheckedChange={(on) => patch({ reducedTransparency: on })}
        />
      </div>
    </div>
  );
}
