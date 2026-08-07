import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Brand,
  ColorPalette,
  Link,
  NavActions,
  NavItem,
  Navbar,
  ThemeToggle,
  ToastProvider,
} from "../ui/registry";
import { useTheme } from "../theme/ThemeProvider";
import type { Appearance, ThemePresetId } from "../theme/accents";

function FaviconMark() {
  return (
    <img
      src="/favicon.svg"
      alt=""
      width={28}
      height={28}
      decoding="async"
      className="pg-brand-favicon"
    />
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.68 7.68 0 0 1 8 3.85c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function Shell() {
  const {
    appearance,
    accentId,
    themeId,
    primaryColor,
    accents,
    themes,
    setAppearance,
    setAccentId,
    setThemeId,
  } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ToastProvider placement="bottom-end">
      <div className="pg-shell">
        <Navbar
          layout="minimal"
          density="standard"
          position="sticky"
          scrolled={scrolled}
          brand={
            <Brand
              label="DevKit home"
              name="DevKit"
              layout="lockup"
              size="md"
              mark={<FaviconMark />}
              onClick={() => navigate("/")}
            />
          }
          actions={
            <NavActions label="Utility navigation" density="standard" collapseLabelsOnMobile>
              <NavActions.Item>
                <ThemeToggle
                  label="Theme"
                  appearance={appearance}
                  onAppearanceChange={(v) => setAppearance(v as Appearance)}
                  theme={themeId}
                  onThemeChange={(id) => setThemeId(id as ThemePresetId)}
                  primaryColor={primaryColor}
                  themes={themes.map((t) => ({
                    id: t.id,
                    label: t.label,
                    description: t.description,
                  }))}
                  colorPalette={
                    <ColorPalette
                      label="Accent color"
                      variant="grid"
                      size="sm"
                      value={accentId}
                      onValueChange={(id) => setAccentId(id as typeof accentId)}
                      colors={accents.map((a) => ({
                        id: a.id,
                        label: a.label,
                        color: a.primary,
                      }))}
                    />
                  }
                  size="sm"
                />
              </NavActions.Item>
              <NavActions.Item>
                <NavItem
                  label="GitHub"
                  icon={<GitHubIcon />}
                  href="https://github.com/Roboticela/DevKit"
                  target="_blank"
                  rel="noopener noreferrer"
                  external
                  size="md"
                  density="standard"
                />
              </NavActions.Item>
            </NavActions>
          }
        />

        <main className="pg-main">
          <Outlet />
        </main>

        <footer className="pg-footer">
          <Link href="https://github.com/Roboticela/DevKit" tone="neutral" variant="standalone">
            Roboticela DevKit
          </Link>
        </footer>
      </div>
    </ToastProvider>
  );
}
