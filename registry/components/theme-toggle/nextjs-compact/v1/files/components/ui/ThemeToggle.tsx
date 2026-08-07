import * as React from "react";

/**
 * Theme Toggle — System / Light / Dark chips, then ⋯ opens themes + colors.
 * No gradients. No box-shadows.
 */

export type ThemeToggleAppearance = "system" | "light" | "dark";

export type ThemeToggleOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
};

export type ThemeToggleProps = {
  label?: string;
  appearance: ThemeToggleAppearance;
  onAppearanceChange?: (value: ThemeToggleAppearance) => void;
  theme?: string;
  onThemeChange?: (value: string) => void;
  themes?: ThemeToggleOption[];
  /** Current primary color shown on the ⋯ control. */
  primaryColor?: string;
  /**
   * Color picker panel (compose ColorPalette grid).
   * Rendered inside the ⋯ popup under Themes.
   */
  colorPalette?: React.ReactNode;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 16.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LightIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2.75v1.5M10 15.75v1.5M2.75 10h1.5M15.75 10h1.5M4.4 4.4l1.06 1.06M14.54 14.54l1.06 1.06M15.6 4.4l-1.06 1.06M5.46 14.54l-1.06 1.06"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DarkIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M16.5 11.2A6.75 6.75 0 0 1 8.8 3.5 6.75 6.75 0 1 0 16.5 11.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="10" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="16" cy="10" r="1.5" />
    </svg>
  );
}

const APPEARANCE_ICONS: Record<ThemeToggleAppearance, React.ReactNode> = {
  system: <SystemIcon />,
  light: <LightIcon />,
  dark: <DarkIcon />,
};

const DEFAULT_APPEARANCE: ThemeToggleOption[] = [
  { id: "system", label: "System", description: "Match device" },
  { id: "light", label: "Light", description: "Bright surfaces" },
  { id: "dark", label: "Dark", description: "Dim surfaces" },
];

export const DEFAULT_THEMES: ThemeToggleOption[] = [
  { id: "default", label: "Default", description: "Balanced blue" },
  { id: "minimal", label: "Minimal", description: "Quiet mono" },
  { id: "bold", label: "Bold", description: "Strong accent" },
  { id: "playful", label: "Playful", description: "Soft & lively" },
  { id: "corporate", label: "Corporate", description: "Sharp & formal" },
  { id: "midnight", label: "Midnight", description: "Deep indigo" },
  { id: "dawn", label: "Dawn", description: "Warm morning" },
  { id: "forest", label: "Forest", description: "Calm green" },
  { id: "ocean", label: "Ocean", description: "Cool teal" },
  { id: "sunset", label: "Sunset", description: "Warm coral" },
  { id: "mono", label: "Mono", description: "Neutral gray" },
  { id: "contrast", label: "Contrast", description: "High contrast" },
];

export const ThemeToggle = React.forwardRef<HTMLDivElement, ThemeToggleProps>(function ThemeToggle(
  {
    label = "Theme",
    appearance,
    onAppearanceChange,
    theme = "default",
    onThemeChange,
    themes = DEFAULT_THEMES,
    primaryColor,
    colorPalette,
    size = "md",
    disabled = false,
    className = "",
    id,
  },
  ref
) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const moreRef = React.useRef<HTMLButtonElement | null>(null);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        moreRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activeTheme = themes.find((t) => t.id === theme) ?? themes[0];

  return (
    <div
      ref={setRefs}
      id={id}
      className={cx("dk-theme-toggle", `dk-theme-toggle--${size}`, disabled && "dk-theme-toggle--disabled", className)}
    >
      <div className="dk-theme-toggle__appearance" role="radiogroup" aria-label={`${label} appearance`}>
        {DEFAULT_APPEARANCE.map((opt) => {
          const value = opt.id as ThemeToggleAppearance;
          const selected = appearance === value;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={opt.label}
              title={opt.description ?? opt.label}
              className={cx("dk-theme-toggle__chip", selected && "dk-theme-toggle__chip--selected")}
              disabled={disabled || opt.disabled}
              onClick={() => onAppearanceChange?.(value)}
            >
              <span className="dk-theme-toggle__icon">{APPEARANCE_ICONS[value]}</span>
              <span className="dk-theme-toggle__chip-label">{opt.label}</span>
            </button>
          );
        })}

        <div className="dk-theme-toggle__more-wrap">
          <button
            ref={moreRef}
            type="button"
            className={cx("dk-theme-toggle__chip", "dk-theme-toggle__more", open && "dk-theme-toggle__more--open")}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`${label} presets and colors, current ${activeTheme?.label ?? "Default"}`}
            title="Themes and colors"
            disabled={disabled}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className="dk-theme-toggle__primary-dot"
              aria-hidden="true"
              style={primaryColor ? { backgroundColor: primaryColor } : undefined}
            />
            <span className="dk-theme-toggle__icon dk-theme-toggle__more-icon">
              <MoreIcon />
            </span>
          </button>

          {open ? (
            <div className="dk-theme-toggle__popup" role="dialog" aria-label={`${label} presets and colors`}>
              <div className="dk-theme-toggle__popup-header">Themes</div>
              <ul className="dk-theme-toggle__menu" role="listbox" aria-label={`${label} presets`}>
                {themes.map((t) => {
                  const selected = t.id === theme;
                  return (
                    <li key={t.id} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={cx(
                          "dk-theme-toggle__option",
                          selected && "dk-theme-toggle__option--selected"
                        )}
                        disabled={disabled || t.disabled}
                        onClick={() => {
                          onThemeChange?.(t.id);
                        }}
                      >
                        <span className="dk-theme-toggle__option-icon" aria-hidden="true">
                          {t.icon ?? <span className="dk-theme-toggle__swatch" data-theme={t.id} />}
                        </span>
                        <span className="dk-theme-toggle__option-text">
                          <span className="dk-theme-toggle__option-label">{t.label}</span>
                          {t.description ? (
                            <span className="dk-theme-toggle__option-desc">{t.description}</span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {colorPalette ? (
                <div className="dk-theme-toggle__colors">
                  <div className="dk-theme-toggle__popup-header">Colors</div>
                  <div className="dk-theme-toggle__colors-body">{colorPalette}</div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

ThemeToggle.displayName = "ThemeToggle";
export default ThemeToggle;
