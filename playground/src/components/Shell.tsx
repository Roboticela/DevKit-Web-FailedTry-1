import {
  ActionSegmentedControl,
  Button,
  DropdownMenu,
  Heading,
  Link,
  ToastProvider,
} from "../ui/registry";
import { useTheme } from "../theme/ThemeProvider";
import { accentById } from "../theme/accents";
import { Outlet, useNavigate } from "react-router-dom";

export function Shell() {
  const { appearance, accentId, accents, setAppearance, setAccentId } = useTheme();
  const navigate = useNavigate();
  const accent = accentById(accentId);

  return (
    <ToastProvider placement="bottom-end">
      <div className="pg-shell">
        <header className="pg-header">
          <button
            type="button"
            className="pg-brand"
            onClick={() => navigate("/")}
            aria-label="DevKit home"
          >
            <Heading level={1} size="sm">
              DevKit
            </Heading>
          </button>

          <div className="pg-header-controls">
            <ActionSegmentedControl
              label="Appearance"
              size="sm"
              equalWidth
              value={appearance}
              onValueChange={(v: string) => setAppearance(v === "dark" ? "dark" : "light")}
              options={[
                { id: "light", label: "Light" },
                { id: "dark", label: "Dark" },
              ]}
            />

            <DropdownMenu
              label="Accent color"
              align="end"
              presentation="menu"
              items={accents.map((a) => ({
                id: a.id,
                type: "radio" as const,
                name: "accent",
                label: a.label,
                checked: a.id === accentId,
                onSelect: () => setAccentId(a.id),
              }))}
            >
              <Button type="button" size="sm" variant="secondary">
                Color: {accent.label}
              </Button>
            </DropdownMenu>
          </div>
        </header>

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
