import { useState } from "react";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../registry/components/button/vite-express-tauri/v1/files/src/components/ui/Button";
import {
  IconButton,
  type IconButtonSize,
  type IconButtonVariant,
} from "../../registry/components/icon-button/vite-express-tauri/v1/files/src/components/ui/IconButton";
import { ButtonGroup } from "../../registry/components/button-group/vite-express-tauri/v1/files/src/components/ui/ButtonGroup";
import { SplitButton } from "../../registry/components/split-button/vite-express-tauri/v1/files/src/components/ui/SplitButton";
import { LinkButton } from "../../registry/components/link-button/vite-express-tauri/v1/files/src/components/ui/LinkButton";
import { FloatingActionButton } from "../../registry/components/floating-action-button/vite-express-tauri/v1/files/src/components/ui/FloatingActionButton";
import { ToggleButton } from "../../registry/components/toggle-button/vite-express-tauri/v1/files/src/components/ui/ToggleButton";
import { SegmentedControl } from "../../registry/components/segmented-control/vite-express-tauri/v1/files/src/components/ui/SegmentedControl";
import { ActionMenuTrigger } from "../../registry/components/action-menu-trigger/vite-express-tauri/v1/files/src/components/ui/ActionMenuTrigger";
import { CommandButton } from "../../registry/components/command-button/vite-express-tauri/v1/files/src/components/ui/CommandButton";
import { TextInput } from "../../registry/components/text-input/vite-express-tauri/v1/files/src/components/ui/TextInput";
import { Textarea } from "../../registry/components/textarea/vite-express-tauri/v1/files/src/components/ui/Textarea";
import { SearchField } from "../../registry/components/search-field/vite-express-tauri/v1/files/src/components/ui/SearchField";
import { NumberInput } from "../../registry/components/number-input/vite-express-tauri/v1/files/src/components/ui/NumberInput";
import { PasswordInput } from "../../registry/components/password-input/vite-express-tauri/v1/files/src/components/ui/PasswordInput";
import { OtpInput } from "../../registry/components/otp-input/vite-express-tauri/v1/files/src/components/ui/OtpInput";
import { DateInput } from "../../registry/components/date-input/vite-express-tauri/v1/files/src/components/ui/DateInput";
import { TimeInput } from "../../registry/components/time-input/vite-express-tauri/v1/files/src/components/ui/TimeInput";
import { DateTimeInput } from "../../registry/components/date-time-input/vite-express-tauri/v1/files/src/components/ui/DateTimeInput";
import { InputGroup } from "../../registry/components/input-group/vite-express-tauri/v1/files/src/components/ui/InputGroup";
import { Checkbox } from "../../registry/components/checkbox/vite-express-tauri/v1/files/src/components/ui/Checkbox";
import { CheckboxGroup } from "../../registry/components/checkbox-group/vite-express-tauri/v1/files/src/components/ui/CheckboxGroup";
import { Radio } from "../../registry/components/radio/vite-express-tauri/v1/files/src/components/ui/Radio";
import { RadioGroup } from "../../registry/components/radio-group/vite-express-tauri/v1/files/src/components/ui/RadioGroup";
import { Switch } from "../../registry/components/switch/vite-express-tauri/v1/files/src/components/ui/Switch";
import { Select } from "../../registry/components/select/vite-express-tauri/v1/files/src/components/ui/Select";
import { Combobox } from "../../registry/components/combobox/vite-express-tauri/v1/files/src/components/ui/Combobox";
import { MultiSelect } from "../../registry/components/multi-select/vite-express-tauri/v1/files/src/components/ui/MultiSelect";
import { ChoiceChips } from "../../registry/components/choice-chips/vite-express-tauri/v1/files/src/components/ui/ChoiceChips";
import { Slider } from "../../registry/components/slider/vite-express-tauri/v1/files/src/components/ui/Slider";
import { countrySelectOptions, getCountry } from "./data/countries";
import { THEME_OPTIONS } from "./data/themes";
import catalog from "./foundation-catalog.json";

type CatalogComponent = {
  id: number;
  name: string;
  displayName: string;
  stub?: boolean;
};

type Subgroup = {
  id: string;
  name: string;
  components: CatalogComponent[];
};

type Group = {
  id: string;
  name: string;
  description: string;
  templates: string[];
  subgroups: Subgroup[];
};

const groups = catalog.groups as Group[];

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "tertiary",
  "destructive",
  "success",
  "quiet",
  "inverse",
];

const SIZES: ButtonSize[] = ["xs", "sm", "md", "lg", "xl"];

const ICON_VARIANTS: IconButtonVariant[] = [
  "neutral",
  "subtle",
  "filled",
  "outlined",
  "destructive",
  "inverse",
];

const ICON_SIZES: IconButtonSize[] = ["xs", "sm", "md", "lg", "xl"];

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 4.5v11M4.5 10h11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="10" r="1.25" fill="currentColor" />
      <circle cx="10" cy="10" r="1.25" fill="currentColor" />
      <circle cx="15.5" cy="10" r="1.25" fill="currentColor" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 6.5h10M8 6.5V5.25A1.25 1.25 0 0 1 9.25 4h1.5A1.25 1.25 0 0 1 12 5.25V6.5m2.5 0V15a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 6.5 15V6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function packageCount(group: Group) {
  return group.subgroups.reduce((n, s) => n + s.components.length, 0);
}

function ButtonLab() {
  const [loading, setLoading] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="button-lab-heading">
      <h2 id="button-lab-heading">001 Button</h2>
      <p className="catalog-group-desc">
        Foundational action control. Icon-only belongs on Icon Button (002).
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Variants</h3>
        <div className="lab-row">
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Sizes</h3>
        <div className="lab-row lab-row--baseline">
          {SIZES.map((size) => (
            <Button key={size} size={size}>
              {size.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Content</h3>
        <div className="lab-row">
          <Button>Text only</Button>
          <Button leadingIcon={<PlusIcon />}>Leading icon</Button>
          <Button trailingIcon={<ChevronIcon />}>Trailing icon</Button>
          <Button leadingIcon={<PlusIcon />} trailingIcon={<ChevronIcon />}>
            Both icons
          </Button>
          <Button
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 1600);
            }}
          >
            Save changes
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      <div className="lab-block lab-block--inverse">
        <h3 className="catalog-subgroup-title">Inverse on dark surface</h3>
        <div className="lab-row">
          <Button variant="inverse">Inverse</Button>
          <Button variant="primary">Primary</Button>
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Long label</h3>
        <Button variant="secondary" fullWidth>
          Continue to review your organization settings and billing preferences
        </Button>
      </div>
    </section>
  );
}

function IconButtonLab() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="icon-button-lab-heading">
      <h2 id="icon-button-lab-heading">002 Icon Button</h2>
      <p className="catalog-group-desc">
        Icon-only control with required accessible label. Tooltip is optional and
        never the sole name.
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Variants</h3>
        <div className="lab-row">
          {ICON_VARIANTS.map((variant) => (
            <IconButton
              key={variant}
              variant={variant}
              label={variant.charAt(0).toUpperCase() + variant.slice(1)}
              icon={variant === "destructive" ? <TrashIcon /> : <MoreIcon />}
            />
          ))}
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Sizes</h3>
        <div className="lab-row lab-row--baseline">
          {ICON_SIZES.map((size) => (
            <IconButton
              key={size}
              size={size}
              variant="outlined"
              label={`Size ${size.toUpperCase()}`}
              icon={<PlusIcon />}
            />
          ))}
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">States</h3>
        <div className="lab-row">
          <IconButton label="Add item" icon={<PlusIcon />} />
          <IconButton
            label="More options"
            variant="subtle"
            selected={selected}
            onClick={() => setSelected((v) => !v)}
            icon={<MoreIcon />}
          />
          <IconButton
            label="Refresh"
            variant="filled"
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 1600);
            }}
            icon={<PlusIcon />}
          />
          <IconButton label="Delete" variant="destructive" disabled icon={<TrashIcon />} />
          <IconButton
            label="No tooltip"
            tooltip={false}
            variant="outlined"
            icon={<ChevronIcon />}
          />
        </div>
      </div>

      <div className="lab-block lab-block--inverse">
        <h3 className="catalog-subgroup-title">Inverse</h3>
        <div className="lab-row">
          <IconButton label="More" variant="inverse" icon={<MoreIcon />} />
          <IconButton label="Add" variant="filled" icon={<PlusIcon />} />
        </div>
      </div>
    </section>
  );
}

function ButtonGroupLab() {
  const [loading, setLoading] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="button-group-lab-heading">
      <h2 id="button-group-lab-heading">003 Button Group</h2>
      <p className="catalog-group-desc">
        Related actions only. Joined (<code>gap=&quot;none&quot;</code>) or spaced
        (<code>sm</code>/<code>md</code>. Loading a child does not shift layout.
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Joined primary + secondary</h3>
        <ButtonGroup label="Save document">
          <Button variant="secondary">Cancel</Button>
          <Button
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 1600);
            }}
          >
            Save
          </Button>
        </ButtonGroup>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Spaced (8px)</h3>
        <ButtonGroup label="View mode" gap="sm">
          <Button variant="secondary">List</Button>
          <Button variant="secondary">Grid</Button>
          <Button variant="secondary" disabled>
            Board
          </Button>
        </ButtonGroup>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Equal width</h3>
        <ButtonGroup label="Plan selection" equalWidth>
          <Button variant="secondary">Monthly</Button>
          <Button>Yearly</Button>
        </ButtonGroup>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Icon toolbar (joined)</h3>
        <ButtonGroup label="Editor toolbar">
          <IconButton label="Add" variant="outlined" icon={<PlusIcon />} />
          <IconButton label="More" variant="outlined" icon={<MoreIcon />} />
          <IconButton label="Delete" variant="outlined" icon={<TrashIcon />} />
        </ButtonGroup>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Destructive combination (spaced)</h3>
        <ButtonGroup label="Delete confirmation" gap="md">
          <Button variant="secondary">Keep</Button>
          <Button variant="destructive">Delete forever</Button>
        </ButtonGroup>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Vertical</h3>
        <div style={{ maxWidth: "16rem" }}>
          <ButtonGroup label="Account menu" orientation="vertical" gap="sm">
            <Button variant="secondary" fullWidth>
              Profile
            </Button>
            <Button variant="secondary" fullWidth>
              Settings
            </Button>
            <Button variant="quiet" fullWidth>
              Sign out
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Responsive stack (compact)</h3>
        <ButtonGroup
          label="Publish actions"
          orientation="responsive"
          overflow="stack"
          gap="sm"
        >
          <Button variant="secondary">Preview</Button>
          <Button variant="secondary">Save draft</Button>
          <Button>Publish</Button>
        </ButtonGroup>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Long labels</h3>
        <ButtonGroup label="Long localization sample" gap="sm">
          <Button variant="secondary">Abbrechen und zurück zur Übersicht</Button>
          <Button>Änderungen speichern und fortfahren</Button>
        </ButtonGroup>
      </div>
    </section>
  );
}

function SplitButtonLab() {
  const [last, setLast] = useState("Save");
  const [loading, setLoading] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="split-button-lab-heading">
      <h2 id="split-button-lab-heading">004 Split Button</h2>
      <p className="catalog-group-desc">
        Primary action and menu trigger are separately focusable. Last action:{" "}
        <strong>{last}</strong>
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Primary</h3>
        <SplitButton
          menuLabel="More save options"
          leadingIcon={<PlusIcon />}
          loading={loading}
          onPrimaryClick={() => {
            setLast("Save");
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1200);
          }}
          items={[
            {
              id: "draft",
              label: "Save as draft",
              onSelect: () => setLast("Save as draft"),
            },
            {
              id: "copy",
              label: "Save a copy",
              onSelect: () => setLast("Save a copy"),
            },
            {
              id: "template",
              label: "Save as template",
              disabled: true,
            },
          ]}
        >
          Save
        </SplitButton>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Secondary</h3>
        <SplitButton
          variant="secondary"
          menuLabel="More export options"
          onPrimaryClick={() => setLast("Export PDF")}
          items={[
            { id: "csv", label: "Export CSV", onSelect: () => setLast("Export CSV") },
            { id: "xlsx", label: "Export Excel", onSelect: () => setLast("Export Excel") },
          ]}
        >
          Export PDF
        </SplitButton>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Destructive</h3>
        <SplitButton
          variant="destructive"
          menuLabel="More delete options"
          onPrimaryClick={() => setLast("Delete")}
          items={[
            {
              id: "archive",
              label: "Archive instead",
              onSelect: () => setLast("Archive instead"),
            },
            {
              id: "forever",
              label: "Delete forever",
              destructive: true,
              onSelect: () => setLast("Delete forever"),
            },
          ]}
        >
          Delete
        </SplitButton>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Full width</h3>
        <SplitButton
          fullWidth
          variant="secondary"
          menuLabel="More publish options"
          onPrimaryClick={() => setLast("Publish")}
          items={[
            {
              id: "schedule",
              label: "Schedule publish",
              onSelect: () => setLast("Schedule publish"),
            },
            {
              id: "preview",
              label: "Preview first",
              onSelect: () => setLast("Preview first"),
            },
          ]}
        >
          Publish
        </SplitButton>
      </div>
    </section>
  );
}

function LinkButtonLab() {
  const [action, setAction] = useState("none");

  return (
    <section className="catalog-group" aria-labelledby="link-button-lab-heading">
      <h2 id="link-button-lab-heading">005 Link Button</h2>
      <p className="catalog-group-desc">
        Looks like a link, acts as a <code>button</code>. Last action:{" "}
        <strong>{action}</strong>
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Standalone</h3>
        <div className="lab-row">
          <LinkButton onClick={() => setAction("Learn more")}>Learn more</LinkButton>
          <LinkButton
            tone="neutral"
            leadingIcon={<PlusIcon />}
            onClick={() => setAction("Add filter")}
          >
            Add filter
          </LinkButton>
          <LinkButton
            trailingIcon={<ChevronIcon />}
            onClick={() => setAction("View details")}
          >
            View details
          </LinkButton>
          <LinkButton
            external
            onClick={() => setAction("Open docs (action)")}
          >
            Open docs
          </LinkButton>
          <LinkButton tone="destructive" onClick={() => setAction("Remove")}>
            Remove
          </LinkButton>
          <LinkButton disabled>Disabled</LinkButton>
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Inline in copy</h3>
        <p className="catalog-group-desc">
          Review your plan and{" "}
          <LinkButton layout="inline" onClick={() => setAction("Upgrade")}>
            upgrade anytime
          </LinkButton>{" "}
          from settings, or{" "}
          <LinkButton
            layout="inline"
            tone="destructive"
            onClick={() => setAction("Cancel plan")}
          >
            cancel the subscription
          </LinkButton>
          .
        </p>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Long localized label</h3>
        <LinkButton onClick={() => setAction("Long label")}>
          Änderungen speichern und zur detaillierten Übersicht der
          Organisationseinstellungen zurückkehren
        </LinkButton>
      </div>
    </section>
  );
}

function FabLab() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="fab-lab-heading">
      <h2 id="fab-lab-heading">006 Floating Action Button</h2>
      <p className="catalog-group-desc">
        Use only for one persistent contextual action. Clicks: {count}
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Inline sizes (desktop contextual)</h3>
        <div className="lab-row lab-row--baseline">
          <FloatingActionButton
            position="inline"
            size="sm"
            label="Compose"
            icon={<PlusIcon />}
            onClick={() => setCount((n) => n + 1)}
          />
          <FloatingActionButton
            position="inline"
            size="md"
            label="Compose"
            icon={<PlusIcon />}
            onClick={() => setCount((n) => n + 1)}
          />
          <FloatingActionButton
            position="inline"
            size="lg"
            label="Compose"
            icon={<PlusIcon />}
            onClick={() => setCount((n) => n + 1)}
          />
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Icon + label / extended</h3>
        <div className="lab-row">
          <FloatingActionButton
            position="inline"
            appearance="label"
            compact={false}
            label="New note"
            icon={<PlusIcon />}
            onClick={() => setCount((n) => n + 1)}
          />
          <FloatingActionButton
            position="inline"
            appearance="extended"
            compact={false}
            label="Create project"
            icon={<PlusIcon />}
            onClick={() => setCount((n) => n + 1)}
          />
          <FloatingActionButton
            position="inline"
            appearance="label"
            label="Saving"
            icon={<PlusIcon />}
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 1400);
            }}
          />
          <FloatingActionButton
            position="inline"
            label="Disabled"
            icon={<PlusIcon />}
            disabled
          />
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Corner placement (staged)</h3>
        <div className="lab-fab-stage" aria-label="FAB placement preview">
          <FloatingActionButton
            position="bottom-end"
            label="Add item"
            icon={<PlusIcon />}
            offsetBottom="16px"
            offsetInline="16px"
            onClick={() => setCount((n) => n + 1)}
          />
        </div>
      </div>
    </section>
  );
}

function BoldIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6 4.5h5.2a3.1 3.1 0 0 1 0 6.2H6V4.5Zm0 6.2h5.8a3.2 3.2 0 0 1 0 6.4H6v-6.4Z"
        stroke="currentColor"
        strokeWidth={filled ? 2 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6.5 5.5h9M6.5 10h9M6.5 14.5h9M4 5.5h.01M4 10h.01M4 14.5h.01"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="3.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3.5" y="11.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="11.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ToggleButtonLab() {
  const [bold, setBold] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [notify, setNotify] = useState(true);

  return (
    <section className="catalog-group" aria-labelledby="toggle-button-lab-heading">
      <h2 id="toggle-button-lab-heading">007 Toggle Button</h2>
      <p className="catalog-group-desc">
        Stateful action with <code>aria-pressed</code>. Selected uses border,
        surface, indicator, and optional icon/text — not color alone. Prefer
        Switch for settings.
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Icon + text with indicator</h3>
        <div className="lab-row">
          <ToggleButton
            label="Bold"
            pressedLabel="Bold on"
            icon={<BoldIcon />}
            pressedIcon={<BoldIcon filled />}
            pressed={bold}
            onPressedChange={setBold}
          />
          <ToggleButton label="Notifications" pressed={notify} onPressedChange={setNotify} />
          <ToggleButton label="Disabled" defaultPressed disabled />
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Icon-only (icon swap)</h3>
        <div className="lab-row">
          <ToggleButton
            appearance="icon"
            label={view === "list" ? "List view selected" : "List view"}
            icon={<ListIcon />}
            pressed={view === "list"}
            onPressedChange={(on) => on && setView("list")}
          />
          <ToggleButton
            appearance="icon"
            label={view === "grid" ? "Grid view selected" : "Grid view"}
            icon={<GridIcon />}
            pressed={view === "grid"}
            onPressedChange={(on) => on && setView("grid")}
          />
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Variants</h3>
        <div className="lab-row">
          <ToggleButton label="Outline" variant="outline" defaultPressed />
          <ToggleButton label="Subtle" variant="subtle" defaultPressed />
          <ToggleButton label="Filled" variant="filled" defaultPressed />
        </div>
      </div>
    </section>
  );
}

function SegmentedControlLab() {
  const [plan, setPlan] = useState("pro");
  const [view, setView] = useState("list");
  const [align, setAlign] = useState("left");
  const [period, setPeriod] = useState("week");

  return (
    <section className="catalog-group" aria-labelledby="segmented-control-lab-heading">
      <h2 id="segmented-control-lab-heading">008 Segmented Control</h2>
      <p className="catalog-group-desc">
        Mutually exclusive selection among 2–5 options. Selected segment uses an
        integrated track fill — not a floating indicator. Arrow keys move
        selection; Home/End jump to ends.
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Label only</h3>
        <SegmentedControl
          label="Plan"
          value={plan}
          onValueChange={setPlan}
          options={[
            { id: "free", label: "Free" },
            { id: "pro", label: "Pro" },
            { id: "team", label: "Team" },
          ]}
        />
        <p className="catalog-group-meta">Selected: {plan}</p>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Icon + label</h3>
        <SegmentedControl
          label="View mode"
          value={view}
          onValueChange={setView}
          options={[
            { id: "list", label: "List", icon: <ListIcon /> },
            { id: "grid", label: "Grid", icon: <GridIcon /> },
          ]}
        />
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Icon only</h3>
        <SegmentedControl
          label="Text alignment"
          equalWidth={false}
          value={align}
          onValueChange={setAlign}
          options={[
            { id: "left", label: "Align left", icon: <AlignLeftIcon />, iconOnly: true },
            { id: "center", label: "Align center", icon: <AlignCenterIcon />, iconOnly: true },
            { id: "right", label: "Align right", icon: <AlignRightIcon />, iconOnly: true },
          ]}
        />
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Sizes</h3>
        <div className="lab-row">
          <SegmentedControl
            label="Size small"
            size="sm"
            defaultValue="a"
            options={[
              { id: "a", label: "Day" },
              { id: "b", label: "Week" },
              { id: "c", label: "Month" },
            ]}
          />
          <SegmentedControl
            label="Size large"
            size="lg"
            defaultValue="b"
            options={[
              { id: "a", label: "Day" },
              { id: "b", label: "Week" },
              { id: "c", label: "Month" },
            ]}
          />
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Overflow — scroll</h3>
        <div style={{ maxWidth: 280 }}>
          <SegmentedControl
            label="Period"
            overflow="scroll"
            value={period}
            onValueChange={setPeriod}
            options={[
              { id: "day", label: "Today" },
              { id: "week", label: "This week" },
              { id: "month", label: "This month" },
              { id: "quarter", label: "This quarter" },
              { id: "year", label: "This year" },
            ]}
          />
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Overflow — stack</h3>
        <div style={{ maxWidth: 240 }}>
          <SegmentedControl
            label="Shipping method"
            overflow="stack"
            defaultValue="standard"
            options={[
              { id: "standard", label: "Standard shipping (3–5 days)" },
              { id: "express", label: "Express shipping (1–2 days)" },
              { id: "pickup", label: "Store pickup today" },
            ]}
          />
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Disabled segment</h3>
        <SegmentedControl
          label="Billing cycle"
          defaultValue="monthly"
          options={[
            { id: "monthly", label: "Monthly" },
            { id: "yearly", label: "Yearly" },
            { id: "lifetime", label: "Lifetime", disabled: true },
          ]}
        />
      </div>
    </section>
  );
}

function AlignLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 4h12M3 9h8M3 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AlignCenterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 4h12M5 9h8M4 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AlignRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 4h12M7 9h8M5 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M12.5 3.5 14.5 5.5 6.75 13.25 4.5 13.5l.25-2.25L12.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 12V4.5A1.5 1.5 0 0 1 5.5 3H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CommandButtonLab() {
  const [active, setActive] = useState("open");
  const [ran, setRan] = useState("—");

  return (
    <section className="catalog-group" aria-labelledby="command-button-lab-heading">
      <h2 id="command-button-lab-heading">009 Command Button</h2>
      <p className="catalog-group-desc">
        Workflow action with optional description, shortcut hint, status, and
        trailing affordance. Built for command palettes — shortcuts hide on
        mobile; keyboard activation is first-class.
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Palette row (role=option)</h3>
        <div
          className="lab-palette"
          role="listbox"
          aria-label="Demo commands"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
            maxWidth: "28rem",
            padding: "var(--space-2)",
            border: "var(--border-width-default) solid var(--color-border-default)",
            borderRadius: "var(--radius-6)",
            background: "var(--color-surface-primary)",
          }}
        >
          <CommandButton
            role="option"
            commandId="open"
            label="Open file"
            description="Browse the workspace"
            leadingIcon={<SearchIcon />}
            shortcut={["⌘", "O"]}
            selected={active === "open"}
            fullWidth
            onClick={() => {
              setActive("open");
              setRan("Open file");
            }}
          />
          <CommandButton
            role="option"
            commandId="duplicate"
            label="Duplicate"
            description="Copy the current document"
            leadingIcon={<DuplicateIcon />}
            shortcut={["⌘", "D"]}
            selected={active === "duplicate"}
            fullWidth
            onClick={() => {
              setActive("duplicate");
              setRan("Duplicate");
            }}
          />
          <CommandButton
            role="option"
            commandId="edit"
            label="Rename"
            description="Change the display name"
            leadingIcon={<EditIcon />}
            shortcut={["↵"]}
            trailingAffordance={<ChevronIcon />}
            status="info"
            statusLabel="Has unsaved changes"
            selected={active === "edit"}
            fullWidth
            onClick={() => {
              setActive("edit");
              setRan("Rename");
            }}
          />
          <CommandButton
            role="option"
            commandId="delete"
            label="Delete"
            description="Move to trash"
            leadingIcon={<TrashIcon />}
            shortcut={["⌘", "⌫"]}
            variant="destructive"
            status="error"
            statusLabel="Destructive"
            selected={active === "delete"}
            fullWidth
            onClick={() => {
              setActive("delete");
              setRan("Delete");
            }}
          />
        </div>
        <p className="catalog-group-meta">Last run: {ran}</p>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Standalone + states</h3>
        <div className="lab-row">
          <CommandButton
            label="Save"
            shortcut={["⌘", "S"]}
            variant="outline"
            leadingIcon={<EditIcon />}
            onClick={() => setRan("Save")}
          />
          <CommandButton label="Loading" loading leadingIcon={<SearchIcon />} />
          <CommandButton label="Disabled" disabled shortcut={["⌘", "K"]} />
          <CommandButton
            label="Selected"
            selected
            shortcut={["⌘", "P"]}
            leadingIcon={<SearchIcon />}
          />
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Sizes</h3>
        <div className="lab-row">
          <CommandButton size="sm" label="Small" shortcut={["⌘", "1"]} />
          <CommandButton size="md" label="Medium" shortcut={["⌘", "2"]} />
          <CommandButton size="lg" label="Large" shortcut={["⌘", "3"]} />
        </div>
      </div>
    </section>
  );
}

function ActionMenuTriggerLab() {
  const [last, setLast] = useState("—");

  const fileActions = [
    {
      id: "edit",
      label: "Edit",
      icon: <EditIcon />,
      onSelect: () => setLast("Edit"),
    },
    {
      id: "duplicate",
      label: "Duplicate",
      icon: <DuplicateIcon />,
      onSelect: () => setLast("Duplicate"),
    },
    {
      id: "share",
      label: "Share",
      onSelect: () => setLast("Share"),
    },
    {
      id: "delete",
      label: "Delete",
      icon: <TrashIcon />,
      destructive: true,
      confirmLabel: "Delete item",
      onSelect: () => setLast("Delete (confirmed)"),
    },
  ];

  return (
    <section className="catalog-group" aria-labelledby="action-menu-trigger-lab-heading">
      <h2 id="action-menu-trigger-lab-heading">010 Action Menu Trigger</h2>
      <p className="catalog-group-desc">
        Opens a contextual action collection. Disclosure chevron / more glyph
        signals more actions. Open state connects to the menu; on narrow touch
        screens it becomes a bottom sheet. Destructive items require confirmation.
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Labeled button</h3>
        <div className="lab-row">
          <ActionMenuTrigger label="Actions" items={fileActions}>
            Actions
          </ActionMenuTrigger>
          <ActionMenuTrigger
            label="File actions"
            icon={<EditIcon />}
            variant="outline"
            items={fileActions}
          >
            File
          </ActionMenuTrigger>
          <ActionMenuTrigger label="Disabled" items={fileActions} disabled>
            Actions
          </ActionMenuTrigger>
        </div>
        <p className="catalog-group-meta">Last action: {last}</p>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Icon-only</h3>
        <div className="lab-row">
          <ActionMenuTrigger
            appearance="icon"
            label="More actions"
            variant="subtle"
            items={fileActions}
          />
          <ActionMenuTrigger
            appearance="icon"
            label="More actions"
            variant="outline"
            items={fileActions}
          />
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Contextual (row)</h3>
        <div className="lab-row">
          <span>Project brief.pdf</span>
          <ActionMenuTrigger
            appearance="contextual"
            variant="ghost"
            label="Row actions"
            items={fileActions}
          />
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Force sheet / force menu</h3>
        <div className="lab-row">
          <ActionMenuTrigger
            label="Sheet demo"
            presentation="sheet"
            items={fileActions}
          >
            Open as sheet
          </ActionMenuTrigger>
          <ActionMenuTrigger
            label="Menu demo"
            presentation="menu"
            items={fileActions}
          >
            Open as menu
          </ActionMenuTrigger>
        </div>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Grouped hierarchy</h3>
        <ActionMenuTrigger
          label="Organize"
          groups={[
            {
              id: "organize",
              label: "Organize",
              items: [
                { id: "rename", label: "Rename", onSelect: () => setLast("Rename") },
                { id: "move", label: "Move…", onSelect: () => setLast("Move") },
              ],
            },
            {
              id: "danger",
              label: "Danger zone",
              items: [
                {
                  id: "archive",
                  label: "Archive",
                  destructive: true,
                  onSelect: () => setLast("Archive (confirmed)"),
                },
                {
                  id: "purge",
                  label: "Delete forever",
                  destructive: true,
                  confirmLabel: "Delete forever",
                  onSelect: () => setLast("Purge (confirmed)"),
                },
              ],
            },
          ]}
        >
          Organize
        </ActionMenuTrigger>
      </div>
    </section>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 5.5 9 10l6-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 14.5c1.2-2.4 3-3.5 5.5-3.5s4.3 1.1 5.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TextInputLab() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("bad@");
  const [website, setWebsite] = useState("roboticela.com");
  const [bio, setBio] = useState("Short");

  return (
    <section className="catalog-group" aria-labelledby="text-input-lab-heading">
      <h2 id="text-input-lab-heading">011 Text Input</h2>
      <p className="catalog-group-desc">
        Foundational single-line field. Visible label (not floating). Semantic
        types share one visual identity. Validation uses border + icon + message.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Basic + clear</h3>
        <TextInput
          label="Display name"
          description="Shown on your public profile"
          placeholder="Jane Cooper"
          value={name}
          onValueChange={setName}
          clearable
          optional
          helpText="You can change this later"
          leadingIcon={<UserIcon />}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Semantic types</h3>
        <TextInput
          label="Email"
          type="email"
          required
          value={email}
          onValueChange={setEmail}
          validation="error"
          errorMessage="Enter a valid email address"
          leadingIcon={<MailIcon />}
          clearable
        />
        <TextInput
          label="Website"
          type="url"
          value={website}
          onValueChange={setWebsite}
          validation="success"
          successMessage="Looks good"
          prefix="https://"
        />
        <TextInput label="Phone" type="tel" placeholder="+1 555 0100" defaultValue="" />
        <TextInput
          label="Username"
          type="username"
          placeholder="jane"
          leadingIcon={<UserIcon />}
          defaultValue=""
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Counter, loading, read-only, disabled</h3>
        <TextInput
          label="Tagline"
          value={bio}
          onValueChange={setBio}
          maxLength={24}
          clearable
        />
        <TextInput label="Checking availability" defaultValue="jane" loading />
        <TextInput label="Account ID" defaultValue="acct_1842" readOnly />
        <TextInput label="Locked field" defaultValue="Cannot edit" disabled />
      </div>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Sizes</h3>
        <div className="lab-row">
          <TextInput size="sm" label="SM" defaultValue="Small" fullWidth={false} />
          <TextInput size="md" label="MD" defaultValue="Medium" fullWidth={false} />
          <TextInput size="lg" label="LG" defaultValue="Large" fullWidth={false} />
        </div>
      </div>
    </section>
  );
}

function TextareaLab() {
  const [notes, setNotes] = useState("");
  const [bio, setBio] = useState(
    "DevKit Form Controls keep multi-line entry calm and predictable."
  );
  const [grow, setGrow] = useState("Type to grow…\n");

  return (
    <section className="catalog-group" aria-labelledby="textarea-lab-heading">
      <h2 id="textarea-lab-heading">012 Textarea</h2>
      <p className="catalog-group-desc">
        Multi-line sibling of Text Input. Default min height 96px. Auto-grow
        expands to a max then scrolls — it will not push the page without bound.
      </p>

      <div className="lab-block" style={{ maxWidth: "32rem" }}>
        <h3 className="catalog-subgroup-title">Fixed (96px)</h3>
        <Textarea
          label="Notes"
          description="Visible label, shared field chrome"
          placeholder="Write a short note…"
          value={notes}
          onValueChange={setNotes}
          minHeight="sm"
          optional
          helpText="Default padding 12px · text 16/24"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "32rem" }}>
        <h3 className="catalog-subgroup-title">Auto-grow (96 → 240)</h3>
        <Textarea
          label="Expanding reply"
          resize="auto"
          minHeight="sm"
          maxHeight="xl"
          value={grow}
          onValueChange={setGrow}
          maxLength={280}
          helpText="Grows with content, then scrolls internally"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "32rem" }}>
        <h3 className="catalog-subgroup-title">Manual resize + counter</h3>
        <Textarea
          label="Bio"
          resize="vertical"
          minHeight="md"
          maxHeight="xl"
          value={bio}
          onValueChange={setBio}
          maxLength={160}
          minLength={12}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "32rem" }}>
        <h3 className="catalog-subgroup-title">Validation & states</h3>
        <Textarea
          label="Feedback"
          defaultValue="Too short"
          validation="error"
          errorMessage="Please write at least two sentences"
          minHeight="sm"
        />
        <Textarea
          label="Approved copy"
          defaultValue="Looks complete and publish-ready."
          validation="success"
          successMessage="Ready to publish"
          minHeight="sm"
        />
        <Textarea label="Saving…" defaultValue="Draft content" loading minHeight="sm" />
        <Textarea label="Read-only" defaultValue="Locked transcript" readOnly minHeight="sm" />
        <Textarea label="Disabled" defaultValue="Cannot edit" disabled minHeight="sm" />
      </div>

      <div className="lab-block" style={{ maxWidth: "32rem" }}>
        <h3 className="catalog-subgroup-title">Height presets</h3>
        <Textarea label="128px (md)" height="md" defaultValue="Medium block" />
        <Textarea label="160px (lg)" height="lg" defaultValue="Large block" />
      </div>
    </section>
  );
}

function SearchFieldLab() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [submitted, setSubmitted] = useState("—");
  const [loading, setLoading] = useState(false);
  const [resultsStatus, setResultsStatus] = useState<
    "idle" | "available" | "empty"
  >("idle");

  const runSearch = (value: string) => {
    setSubmitted(value || "(empty)");
    if (!value.trim()) {
      setResultsStatus("idle");
      setLoading(false);
      return;
    }
    setLoading(true);
    setResultsStatus("idle");
    window.setTimeout(() => {
      setLoading(false);
      setResultsStatus(value.toLowerCase().includes("void") ? "empty" : "available");
    }, 700);
  };

  return (
    <section className="catalog-group" aria-labelledby="search-field-lab-heading">
      <h2 id="search-field-lab-heading">013 Search Field</h2>
      <p className="catalog-group-desc">
        Specialized find control — distinct from Text Input. Leading search icon,
        clear when populated, reserved loading slot. Hosts own instant / debounce /
        submit / async behavior.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Submit + async status</h3>
        <SearchField
          label="Find components"
          placeholder="Try “button” or “void”"
          value={query}
          onValueChange={setQuery}
          onSearch={runSearch}
          loading={loading}
          resultsStatus={resultsStatus}
          resultsStatusLabel={
            resultsStatus === "available"
              ? "Results available"
              : resultsStatus === "empty"
                ? "No results"
                : undefined
          }
          helpText="Enter submits · Escape clears"
        />
        <p className="catalog-group-meta">Last submit: {submitted}</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Debounced (300ms)</h3>
        <SearchField
          label="Live filter"
          placeholder="Type to debounce…"
          defaultValue=""
          onDebouncedChange={setDebounced}
          debounceMs={300}
          hideLabel
          aria-label="Live filter"
        />
        <p className="catalog-group-meta">Debounced value: {debounced || "—"}</p>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Toolbar (desktop compact)</h3>
        <div
          className="lab-row"
          style={{
            padding: "var(--space-3)",
            border: "var(--border-width-default) solid var(--color-border-default)",
            borderRadius: "var(--radius-6)",
            background: "var(--color-surface-primary)",
            justifyContent: "flex-end",
          }}
        >
          <SearchField
            appearance="toolbar"
            size="sm"
            label="Toolbar search"
            hideLabel
            placeholder="Search docs"
            fullWidth={false}
            defaultValue=""
          />
        </div>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <SearchField label="Disabled" defaultValue="Cannot search" disabled />
        <SearchField label="Loading" defaultValue="button" loading />
      </div>
    </section>
  );
}

function NumberInputLab() {
  const [qty, setQty] = useState<number | null>(2);
  const [price, setPrice] = useState<number | null>(12.5);
  const [raw, setRaw] = useState("");
  const [temp, setTemp] = useState<number | null>(null);

  return (
    <section className="catalog-group" aria-labelledby="number-input-lab-heading">
      <h2 id="number-input-lab-heading">014 Number Input</h2>
      <p className="catalog-group-desc">
        Numeric entry with distinct empty (<code>null</code>) vs zero. Optional
        steppers; typing and arrows remain first-class. No reformat while focused.
      </p>

      <div className="lab-block" style={{ maxWidth: "20rem" }}>
        <h3 className="catalog-subgroup-title">Integer + stepper</h3>
        <NumberInput
          label="Quantity"
          value={qty}
          onValueChange={setQty}
          min={0}
          max={99}
          step={1}
          stepper
          positiveOnly
          helpText={`Committed: ${qty === null ? "empty (null)" : qty}`}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "20rem" }}>
        <h3 className="catalog-subgroup-title">Decimal currency (prefix)</h3>
        <NumberInput
          label="Price"
          value={price}
          onValueChange={setPrice}
          onRawChange={setRaw}
          decimal
          precision={2}
          min={0}
          step={0.25}
          stepper
          prefix="$"
          locale="en-US"
          helpText={`Raw while editing shown in meta · raw="${raw}"`}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "20rem" }}>
        <h3 className="catalog-subgroup-title">Percent + empty vs zero</h3>
        <NumberInput
          label="Discount"
          value={temp}
          onValueChange={setTemp}
          decimal
          precision={1}
          min={0}
          max={100}
          positiveOnly
          suffix="%"
          optional
          helpText={
            temp === null
              ? "Empty (null) — not zero"
              : temp === 0
                ? "Zero"
                : `Value ${temp}`
          }
        />
        <div className="lab-row" style={{ marginTop: "var(--space-2)" }}>
          <button type="button" onClick={() => setTemp(null)}>
            Set empty
          </button>
          <button type="button" onClick={() => setTemp(0)}>
            Set zero
          </button>
        </div>
      </div>

      <div className="lab-block" style={{ maxWidth: "20rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <NumberInput label="Invalid range" defaultValue={150} min={0} max={100} validation="error" errorMessage="Must be 0–100" />
        <NumberInput label="Loading" defaultValue={4} loading />
        <NumberInput label="Read-only" defaultValue={42} readOnly />
        <NumberInput label="Disabled" defaultValue={7} disabled />
      </div>
    </section>
  );
}

function PasswordInputLab() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mismatch =
    confirm.length > 0 && password.length > 0 && confirm !== password;

  return (
    <section className="catalog-group" aria-labelledby="password-input-lab-heading">
      <h2 id="password-input-lab-heading">015 Password Input</h2>
      <p className="catalog-group-desc">
        Masked by default with an accessible show/hide control. Strength stays
        outside the primitive via <code>strengthSlot</code>. Password managers
        keep working through purpose-based autocomplete.
      </p>

      <div className="lab-block" style={{ maxWidth: "24rem" }}>
        <h3 className="catalog-subgroup-title">Create + confirm</h3>
        <PasswordInput
          label="New password"
          purpose="new"
          required
          value={password}
          onValueChange={setPassword}
          requirements={
            <ul>
              <li>At least 8 characters</li>
              <li>Include a number</li>
            </ul>
          }
          strengthSlot={
            <p
              className="catalog-group-meta"
              style={{ margin: 0 }}
              aria-live="polite"
            >
              Strength slot (compose later):{" "}
              {password.length === 0
                ? "—"
                : password.length < 8
                  ? "Too short"
                  : "Ready for a real indicator"}
            </p>
          }
        />
        <PasswordInput
          label="Confirm password"
          purpose="confirm"
          required
          value={confirm}
          onValueChange={setConfirm}
          validation={mismatch ? "error" : "none"}
          errorMessage={mismatch ? "Passwords do not match" : undefined}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "24rem" }}>
        <h3 className="catalog-subgroup-title">Sign-in (current)</h3>
        <PasswordInput
          label="Password"
          purpose="current"
          placeholder="Enter your password"
          defaultValue=""
          helpText="Show/hide uses type=button and aria-pressed"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "24rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <PasswordInput label="Loading" defaultValue="secret" loading />
        <PasswordInput label="Disabled" defaultValue="secret" disabled />
        <PasswordInput
          label="Paste disabled"
          purpose="new"
          allowPaste={false}
          helpText="allowPaste=false for strict security policies"
          defaultValue=""
        />
      </div>
    </section>
  );
}

function OtpInputLab() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"none" | "error" | "success">("none");
  const [alpha, setAlpha] = useState("");

  return (
    <section className="catalog-group" aria-labelledby="otp-input-lab-heading">
      <h2 id="otp-input-lab-heading">016 OTP / Verification Input</h2>
      <p className="catalog-group-desc">
        Six-digit default with multi-cell visuals and one logical value. Paste a
        full code at once. Invalid state does not wipe the entry.
      </p>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Default (6 numeric)</h3>
        <OtpInput
          label="Verification code"
          description="Paste 123456 or type digit by digit"
          value={code}
          onValueChange={(next) => {
            setCode(next);
            setStatus("none");
          }}
          onComplete={(next) => {
            setStatus(next === "123456" ? "success" : "error");
          }}
          validation={status}
          errorMessage={status === "error" ? "Incorrect code — entry kept" : undefined}
          successMessage={status === "success" ? "Verified" : undefined}
          helpText={status === "none" ? "Try complete code 123456" : undefined}
          autoFocus
        />
        <p className="catalog-group-meta">Value: {code || "(empty)"}</p>
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Lengths</h3>
        <OtpInput label="4-digit PIN" length={4} defaultValue="" />
        <OtpInput label="8-digit code" length={8} defaultValue="" />
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">Alphanumeric</h3>
        <OtpInput
          label="Invite code"
          mode="alphanumeric"
          length={6}
          value={alpha}
          onValueChange={setAlpha}
          helpText="Letters and digits"
        />
      </div>

      <div className="lab-block">
        <h3 className="catalog-subgroup-title">States</h3>
        <OtpInput label="Loading" defaultValue="482910" loading />
        <OtpInput label="Disabled" defaultValue="482910" disabled />
      </div>
    </section>
  );
}

function DateInputLab() {
  const [iso, setIso] = useState<string | null>("2026-08-07");
  const [raw, setRaw] = useState("");
  const [locale, setLocale] = useState("en-US");

  return (
    <section className="catalog-group" aria-labelledby="date-input-lab-heading">
      <h2 id="date-input-lab-heading">017 Date Input</h2>
      <p className="catalog-group-desc">
        Locale-aware calendar date with manual typing and a calendar trigger that
        composes with an external Date Picker. Values are ISO{" "}
        <code>YYYY-MM-DD</code>; typed text is not rewritten while focused.
      </p>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">Controlled</h3>
        <DateInput
          label="Event date"
          value={iso}
          onValueChange={setIso}
          onRawChange={setRaw}
          locale={locale}
          min="2026-01-01"
          max="2026-12-31"
          clearable
          showCalendarTrigger
          helpText={`ISO: ${iso ?? "null"} · raw while editing: "${raw}"`}
        />
        <div className="lab-row" style={{ marginTop: "var(--space-2)" }}>
          <button type="button" onClick={() => setLocale("en-US")}>
            en-US
          </button>
          <button type="button" onClick={() => setLocale("en-GB")}>
            en-GB
          </button>
          <button type="button" onClick={() => setLocale("de-DE")}>
            de-DE
          </button>
          <button type="button" onClick={() => setLocale("ar-SA")}>
            ar-SA
          </button>
        </div>
        <p className="catalog-group-meta">Locale: {locale}</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">Disabled dates</h3>
        <DateInput
          label="Weekdays only"
          defaultValue={null}
          locale="en-GB"
          clearable
          showCalendarTrigger
          isDateDisabled={(d) => {
            const [y, m, day] = d.split("-").map(Number);
            const wd = new Date(y, m - 1, day).getDay();
            return wd === 0 || wd === 6;
          }}
          helpText="Weekends rejected on commit (blur / Enter)"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">Invalid kept for correction</h3>
        <DateInput
          label="Birth date"
          defaultValue={null}
          locale="en-GB"
          validation="error"
          errorMessage="Enter a valid date"
          helpText="Invalid typed text stays until you fix it"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <DateInput label="Required" required defaultValue={null} showCalendarTrigger />
        <DateInput label="Optional" optional defaultValue="2026-03-01" clearable />
        <DateInput label="Read-only" readOnly defaultValue="2026-08-07" />
        <DateInput label="Loading" defaultValue="2026-08-07" loading />
        <DateInput label="Disabled" defaultValue="2026-08-07" disabled />
        <DateInput
          label="Success"
          defaultValue="2026-08-07"
          validation="success"
          successMessage="Looks good"
        />
      </div>
    </section>
  );
}

function TimeInputLab() {
  const [time, setTime] = useState<string | null>("14:30");
  const [raw, setRaw] = useState("");
  const [hourCycle, setHourCycle] = useState<"auto" | "h12" | "h23">("auto");
  const [locale, setLocale] = useState("en-US");

  return (
    <section className="catalog-group" aria-labelledby="time-input-lab-heading">
      <h2 id="time-input-lab-heading">018 Time Input</h2>
      <p className="catalog-group-desc">
        Locale-aware time with hours + minutes by default. Display follows{" "}
        <code>locale</code> / <code>hourCycle</code> — AM/PM only when applicable.
        Clock trigger composes with an external Time Picker.
      </p>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">Controlled</h3>
        <TimeInput
          label="Start time"
          value={time}
          onValueChange={setTime}
          onRawChange={setRaw}
          locale={locale}
          hourCycle={hourCycle}
          min="08:00"
          max="18:00"
          step={900}
          clearable
          showPickerTrigger
          helpText={`Value: ${time ?? "null"} · raw: "${raw}" · step 15m · ArrowUp/Down`}
        />
        <div className="lab-row" style={{ marginTop: "var(--space-2)" }}>
          <button type="button" onClick={() => setLocale("en-US")}>
            en-US
          </button>
          <button type="button" onClick={() => setLocale("en-GB")}>
            en-GB
          </button>
          <button type="button" onClick={() => setLocale("de-DE")}>
            de-DE
          </button>
          <button type="button" onClick={() => setLocale("ja-JP")}>
            ja-JP
          </button>
        </div>
        <div className="lab-row" style={{ marginTop: "var(--space-2)" }}>
          <button type="button" onClick={() => setHourCycle("auto")}>
            auto
          </button>
          <button type="button" onClick={() => setHourCycle("h12")}>
            h12
          </button>
          <button type="button" onClick={() => setHourCycle("h23")}>
            h23
          </button>
        </div>
        <p className="catalog-group-meta">
          locale={locale} · hourCycle={hourCycle}
        </p>
      </div>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">With seconds</h3>
        <TimeInput
          label="Precise time"
          defaultValue="14:30:45"
          withSeconds
          hourCycle="h23"
          step={1}
          clearable
          showPickerTrigger
          helpText="HH:mm:ss · step 1 second"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <TimeInput label="Required" required defaultValue={null} showPickerTrigger />
        <TimeInput label="Optional" optional defaultValue="12:00" clearable />
        <TimeInput label="Read-only" readOnly defaultValue="14:30" />
        <TimeInput label="Loading" defaultValue="14:30" loading />
        <TimeInput label="Disabled" defaultValue="14:30" disabled />
        <TimeInput
          label="Invalid"
          defaultValue={null}
          validation="error"
          errorMessage="Enter a valid time"
        />
      </div>
    </section>
  );
}

function DateTimeInputLab() {
  const [value, setValue] = useState<string | null>("2026-08-07T14:30");
  const [parts, setParts] = useState<{ date: string | null; time: string | null }>({
    date: "2026-08-07",
    time: "14:30",
  });
  const [withSeconds, setWithSeconds] = useState(false);
  const [showTz, setShowTz] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="date-time-input-lab-heading">
      <h2 id="date-time-input-lab-heading">019 Date &amp; Time Input</h2>
      <p className="catalog-group-desc">
        One coherent temporal value. Default is date + hours + minutes. Seconds and
        timezone stay progressive. Stacks on mobile; horizontal from tablet up.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Default (date + time)</h3>
        <DateTimeInput
          label="Appointment"
          description="Both date and time are part of this value"
          value={value}
          onValueChange={setValue}
          onPartsChange={setParts}
          clearable
          required
          min="2026-01-01T08:00"
          max="2026-12-31T18:00"
          withSeconds={withSeconds}
          showTimeZone={showTz}
          timeZone="America/New_York"
          advancedOpen={advancedOpen}
          onAdvancedOpenChange={setAdvancedOpen}
          advancedSlot={
            <div>
              <p className="catalog-group-meta" style={{ marginTop: 0 }}>
                Advanced slot — compose timezone pickers or offsets here.
              </p>
              <label className="lab-row">
                <input
                  type="checkbox"
                  checked={withSeconds}
                  onChange={(e) => setWithSeconds(e.target.checked)}
                />
                Include seconds
              </label>
              <label className="lab-row">
                <input
                  type="checkbox"
                  checked={showTz}
                  onChange={(e) => setShowTz(e.target.checked)}
                />
                Show timezone indicator
              </label>
            </div>
          }
          helpText={`Value: ${value ?? "null (incomplete or empty)"}`}
        />
        <p className="catalog-group-meta">
          Parts — date: {parts.date ?? "null"} · time: {parts.time ?? "null"}
        </p>
      </div>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Modes</h3>
        <DateTimeInput
          label="Date only"
          mode="date"
          defaultValue="2026-08-07"
          clearable
        />
        <DateTimeInput
          label="Time only"
          mode="time"
          defaultValue="09:15"
          clearable
          hourCycle="h12"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Always stacked</h3>
        <DateTimeInput
          label="Mobile-style"
          orientation="vertical"
          defaultValue="2026-08-07T10:00"
          clearable
          helpText="orientation=vertical"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <DateTimeInput label="Read-only" readOnly defaultValue="2026-08-07T14:30" />
        <DateTimeInput label="Loading" loading defaultValue="2026-08-07T14:30" />
        <DateTimeInput label="Disabled" disabled defaultValue="2026-08-07T14:30" />
        <DateTimeInput
          label="Invalid"
          defaultValue={null}
          validation="error"
          errorMessage="Choose a valid date and time"
        />
      </div>
    </section>
  );
}

function InputGroupLab() {
  const [domain, setDomain] = useState("example.com");
  const [amount, setAmount] = useState<number | null>(42);
  const [query, setQuery] = useState("");

  return (
    <section className="catalog-group" aria-labelledby="input-group-lab-heading">
      <h2 id="input-group-lab-heading">020 Input Group</h2>
      <p className="catalog-group-desc">
        Joins an input with related prefixes, suffixes, icons, units, or actions.
        Shared shell when attached; each interactive child keeps its own focus and
        accessibility. Not a generic layout tool.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Prefix — https:// + domain</h3>
        <InputGroup label="Website" description="Scheme is fixed; enter the host">
          <InputGroup.Addon>https://</InputGroup.Addon>
          <InputGroup.Input>
            <TextInput
              label="Domain"
              hideLabel
              value={domain}
              onValueChange={setDomain}
              placeholder="example.com"
            />
          </InputGroup.Input>
        </InputGroup>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Currency + unit</h3>
        <InputGroup label="Amount" helpText="Currency and unit are contextual addons">
          <InputGroup.Addon>$</InputGroup.Addon>
          <InputGroup.Input>
            <NumberInput
              label="Amount"
              hideLabel
              value={amount}
              onValueChange={setAmount}
              min={0}
              decimal
              precision={2}
            />
          </InputGroup.Input>
          <InputGroup.Addon position="end">USD</InputGroup.Addon>
        </InputGroup>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Search + action</h3>
        <InputGroup label="Find docs">
          <InputGroup.Input>
            <SearchField
              label="Query"
              hideLabel
              value={query}
              onValueChange={setQuery}
              placeholder="Search…"
            />
          </InputGroup.Input>
          <InputGroup.Button>
            <Button type="button" variant="primary">
              Search
            </Button>
          </InputGroup.Button>
        </InputGroup>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Icon + verification action</h3>
        <InputGroup label="Email" required>
          <InputGroup.Icon>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="18" height="18">
              <rect
                x="3.25"
                y="5.25"
                width="13.5"
                height="9.5"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M4 6.5 10 11l6-4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </InputGroup.Icon>
          <InputGroup.Input>
            <TextInput
              label="Email"
              hideLabel
              type="email"
              defaultValue=""
              placeholder="you@company.com"
            />
          </InputGroup.Input>
          <InputGroup.Button>
            <Button type="button" variant="secondary">
              Verify
            </Button>
          </InputGroup.Button>
        </InputGroup>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <InputGroup
          label="Invalid group"
          validation="error"
          errorMessage="Enter a valid domain"
        >
          <InputGroup.Addon>https://</InputGroup.Addon>
          <InputGroup.Input>
            <TextInput label="Domain" hideLabel defaultValue="not a domain" />
          </InputGroup.Input>
        </InputGroup>
        <InputGroup label="Loading" loading>
          <InputGroup.Addon>$</InputGroup.Addon>
          <InputGroup.Input>
            <NumberInput label="Amount" hideLabel defaultValue={10} />
          </InputGroup.Input>
        </InputGroup>
        <InputGroup label="Disabled" disabled>
          <InputGroup.Addon>https://</InputGroup.Addon>
          <InputGroup.Input>
            <TextInput label="Domain" hideLabel defaultValue="example.com" />
          </InputGroup.Input>
        </InputGroup>
        <InputGroup label="Read-only" readOnly>
          <InputGroup.Addon>$</InputGroup.Addon>
          <InputGroup.Input>
            <NumberInput label="Amount" hideLabel defaultValue={99} readOnly />
          </InputGroup.Input>
          <InputGroup.Addon position="end">USD</InputGroup.Addon>
        </InputGroup>
      </div>
    </section>
  );
}

function CheckboxLab() {
  const [marketing, setMarketing] = useState(false);
  const [terms, setTerms] = useState(false);
  const [parent, setParent] = useState(false);
  const [childA, setChildA] = useState(true);
  const [childB, setChildB] = useState(false);

  const parentIndeterminate = childA !== childB;
  const parentChecked = childA && childB;

  return (
    <section className="catalog-group" aria-labelledby="checkbox-lab-heading">
      <h2 id="checkbox-lab-heading">021 Checkbox</h2>
      <p className="catalog-group-desc">
        Independent boolean or multi-select item. Label is clickable; visual box is
        20px at MD with a ≥44×44 hit. Indeterminate is derived only — not a third
        toggle value. Prefer Switch for immediate system settings.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Basic</h3>
        <Checkbox
          label="Send me product updates"
          description="Occasional email about new features. Never spam."
          checked={marketing}
          onCheckedChange={setMarketing}
          optional
        />
        <Checkbox
          label="I agree to the terms of service"
          checked={terms}
          onCheckedChange={setTerms}
          required
          validation={!terms ? "error" : "none"}
          errorMessage={!terms ? "You must accept the terms to continue" : undefined}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Indeterminate (derived)</h3>
        <Checkbox
          label="Select all notifications"
          description="Parent reflects mixed child selection"
          checked={parentChecked}
          indeterminate={parentIndeterminate}
          onCheckedChange={(next: boolean) => {
            setParent(next);
            setChildA(next);
            setChildB(next);
          }}
        />
        <div style={{ paddingInlineStart: "var(--space-8)", marginBlockStart: "var(--space-2)" }}>
          <Checkbox label="Email alerts" checked={childA} onCheckedChange={setChildA} />
          <Checkbox label="Push alerts" checked={childB} onCheckedChange={setChildB} />
        </div>
        <p className="catalog-group-meta">
          parent checked={String(parentChecked)} · indeterminate={String(parentIndeterminate)} ·
          stored parent={String(parent)}
        </p>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Long label alignment</h3>
        <Checkbox
          label="Keep my shopping cart items available across devices so I can continue checkout later from another browser or phone without losing selected options, quantities, or applied coupons."
          description="Box aligns to the first line of the label, not the middle of the block."
          defaultChecked
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <Checkbox label="Unchecked" defaultChecked={false} />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate defaultChecked={false} />
        <Checkbox label="Disabled unchecked" disabled />
        <Checkbox label="Disabled checked" disabled defaultChecked />
        <Checkbox label="Disabled indeterminate" disabled indeterminate />
        <Checkbox
          label="Invalid"
          validation="error"
          errorMessage="This option is required"
        />
      </div>
    </section>
  );
}

function CheckboxGroupLab() {
  const [channels, setChannels] = useState<string[]>(["email"]);
  const [perms, setPerms] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>(["mon", "wed"]);

  return (
    <section className="catalog-group" aria-labelledby="checkbox-group-lab-heading">
      <h2 id="checkbox-group-lab-heading">022 Checkbox Group</h2>
      <p className="catalog-group-desc">
        Related independent multi-select choices. Optional select-all is derived
        (checked / unchecked / indeterminate) — never a third persistent value.
        Default layout is vertical; horizontal only when labels stay short.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Select all + items</h3>
        <CheckboxGroup
          label="Notification channels"
          description="Choose how we may contact you"
          name="channels"
          value={channels}
          onValueChange={setChannels}
          selectAll
          items={[
            { value: "email", label: "Email", description: "Product updates and receipts" },
            { value: "sms", label: "SMS", description: "Time-sensitive alerts only" },
            { value: "push", label: "Push notifications" },
            { value: "post", label: "Postal mail", disabled: true },
          ]}
        />
        <p className="catalog-group-meta">Selected: {channels.join(", ") || "none"}</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Required + error</h3>
        <CheckboxGroup
          label="Permissions"
          required
          value={perms}
          onValueChange={setPerms}
          validation={perms.length === 0 ? "error" : "none"}
          errorMessage={perms.length === 0 ? "Select at least one permission" : undefined}
          items={[
            { value: "read", label: "Read" },
            { value: "write", label: "Write" },
            { value: "admin", label: "Admin" },
          ]}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Horizontal (short labels)</h3>
        <CheckboxGroup
          label="Preferred days"
          orientation="horizontal"
          selectAll="Every day"
          value={days}
          onValueChange={setDays}
          items={[
            { value: "mon", label: "Mon" },
            { value: "tue", label: "Tue" },
            { value: "wed", label: "Wed" },
            { value: "thu", label: "Thu" },
            { value: "fri", label: "Fri" },
          ]}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Disabled group</h3>
        <CheckboxGroup
          label="Legacy options"
          disabled
          defaultValue={["a"]}
          items={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
          ]}
        />
      </div>
    </section>
  );
}

function RadioLab() {
  const [plan, setPlan] = useState("pro");
  const [ship, setShip] = useState("standard");

  return (
    <section className="catalog-group" aria-labelledby="radio-lab-heading">
      <h2 id="radio-lab-heading">023 Radio</h2>
      <p className="catalog-group-desc">
        Mutually exclusive choice within a set. Share a <code>name</code> (or use
        Radio Group next) so arrow keys move between options. Do not use for
        independent multi-select — use Checkbox instead.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Shared name set</h3>
        <Radio
          name="plan"
          value="free"
          label="Free"
          description="Community support"
          checked={plan === "free"}
          onCheckedChange={() => setPlan("free")}
        />
        <Radio
          name="plan"
          value="pro"
          label="Pro"
          description="Priority support and higher limits"
          checked={plan === "pro"}
          onCheckedChange={() => setPlan("pro")}
        />
        <Radio
          name="plan"
          value="team"
          label="Team"
          description="Shared seats and admin controls"
          checked={plan === "team"}
          onCheckedChange={() => setPlan("team")}
        />
        <p className="catalog-group-meta">Selected: {plan}</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Long label alignment</h3>
        <Radio
          name="ship-demo"
          value="standard"
          label="Standard shipping across regions with tracking updates emailed when the package leaves the warehouse and again when it is out for delivery."
          description="Control aligns to the first line of the label."
          checked={ship === "standard"}
          onCheckedChange={() => setShip("standard")}
        />
        <Radio
          name="ship-demo"
          value="express"
          label="Express"
          checked={ship === "express"}
          onCheckedChange={() => setShip("express")}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <Radio name="radio-states-a" value="u" label="Unselected" />
        <Radio name="radio-states-b" value="s" label="Selected" defaultChecked />
        <Radio name="radio-states-c" value="du" label="Disabled unselected" disabled />
        <Radio
          name="radio-states-d"
          value="ds"
          label="Disabled selected"
          disabled
          defaultChecked
        />
        <Radio
          name="radio-states-e"
          value="err"
          label="Error"
          validation="error"
          errorMessage="Choose a valid option"
        />
      </div>
    </section>
  );
}

function RadioGroupLab() {
  const [plan, setPlan] = useState<string | null>("pro");
  const [size, setSize] = useState<string | null>("m");
  const [theme, setTheme] = useState<string | null>(null);

  return (
    <section className="catalog-group" aria-labelledby="radio-group-lab-heading">
      <h2 id="radio-group-lab-heading">024 Radio Group</h2>
      <p className="catalog-group-desc">
        Mutually exclusive options — only one selected. Tab enters/leaves the
        group; arrows move and select; Space selects. Full option rows are the
        target. Not for multi-select (use Checkbox Group).
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Vertical (default)</h3>
        <RadioGroup
          label="Plan"
          description="Choose one billing plan"
          name="billing-plan"
          value={plan}
          onValueChange={setPlan}
          items={[
            { value: "free", label: "Free", description: "Community support" },
            { value: "pro", label: "Pro", description: "Priority support" },
            {
              value: "enterprise",
              label: "Enterprise",
              description: "Custom contracts",
              disabled: true,
            },
          ]}
        />
        <p className="catalog-group-meta">Selected: {plan ?? "none"}</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Horizontal (short labels)</h3>
        <RadioGroup
          label="Size"
          orientation="horizontal"
          value={size}
          onValueChange={setSize}
          items={[
            { value: "s", label: "S" },
            { value: "m", label: "M" },
            { value: "l", label: "L" },
            { value: "xl", label: "XL" },
          ]}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Required + error</h3>
        <RadioGroup
          label="Theme"
          required
          value={theme}
          onValueChange={setTheme}
          validation={theme == null ? "error" : "none"}
          errorMessage={theme == null ? "Select a theme to continue" : undefined}
          items={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
          ]}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Disabled group</h3>
        <RadioGroup
          label="Legacy mode"
          disabled
          defaultValue="a"
          items={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
          ]}
        />
      </div>
    </section>
  );
}

function SwitchLab() {
  const [wifi, setWifi] = useState(true);
  const [notify, setNotify] = useState(false);
  const [asyncOn, setAsyncOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleAsync = (next: boolean) => {
    setLoading(true);
    window.setTimeout(() => {
      setAsyncOn(next);
      setLoading(false);
    }, 900);
  };

  return (
    <section className="catalog-group" aria-labelledby="switch-lab-heading">
      <h2 id="switch-lab-heading">025 Switch</h2>
      <p className="catalog-group-desc">
        Immediate binary ON/OFF setting — not a Checkbox. Track is 48×28 at MD with
        a ≥44×44 hit. Status text plus track color reinforce state beyond thumb
        position. Loading locks interaction until the result settles.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Settings</h3>
        <Switch
          label="Wi‑Fi"
          description="Connect to available networks automatically"
          checked={wifi}
          onCheckedChange={setWifi}
        />
        <Switch
          label="Push notifications"
          description="Alerts for mentions and replies"
          checked={notify}
          onCheckedChange={setNotify}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Async loading</h3>
        <Switch
          label="Sync in background"
          description="Simulated save — control stays locked while updating"
          checked={asyncOn}
          loading={loading}
          onCheckedChange={toggleAsync}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <Switch label="Off" defaultChecked={false} />
        <Switch label="On" defaultChecked />
        <Switch label="Disabled off" disabled />
        <Switch label="Disabled on" disabled defaultChecked />
        <Switch label="Loading" defaultChecked loading />
        <Switch
          label="Error"
          validation="error"
          errorMessage="Could not update this setting"
          defaultChecked
        />
      </div>
    </section>
  );
}

const COUNTRY_OPTIONS = countrySelectOptions();

const LARGE_OPTIONS = Array.from({ length: 40 }, (_, i) => ({
  value: `opt-${i + 1}`,
  label: `Option ${String(i + 1).padStart(2, "0")} — sample label that can wrap when very long`,
  disabled: i === 3 || i === 17,
}));

function SelectLab() {
  const [country, setCountry] = useState<string | null>("pk");
  const [role, setRole] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>("system");
  const [forced, setForced] = useState<string | null>(null);
  const selectedCountry = getCountry(country);

  return (
    <section className="catalog-group" aria-labelledby="select-lab-heading">
      <h2 id="select-lab-heading">026 Select</h2>
      <p className="catalog-group-desc">
        One choice from a predefined list — not a Combobox.{" "}
        <code>presentation=&quot;auto&quot;</code> uses a native picker on compact/touch and a
        listbox on desktop. Popup width matches the field control.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Basic</h3>
        <Select
          label="Country"
          description="From countries module — flags in the list and trigger"
          helpText={
            selectedCountry
              ? `${selectedCountry.flag} ${selectedCountry.name}`
              : "Type-ahead works when the listbox is open on desktop"
          }
          options={COUNTRY_OPTIONS}
          value={country}
          onValueChange={setCountry}
          clearable
          presentation="listbox"
        />
        <Select
          label="Role"
          placeholder="Choose a role…"
          required
          presentation="listbox"
          options={[
            { value: "owner", label: "Owner", description: "Full workspace access" },
            { value: "editor", label: "Editor", description: "Create and edit content" },
            { value: "viewer", label: "Viewer", description: "Read-only" },
            { value: "guest", label: "Guest", disabled: true },
          ]}
          value={role}
          onValueChange={setRole}
          errorMessage={!role ? "Select a role to continue" : undefined}
          validation={!role ? "error" : "none"}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Presentation</h3>
        <Select
          label="Theme"
          description="Appearance preference — listbox matches field width"
          presentation="listbox"
          options={THEME_OPTIONS}
          value={theme}
          onValueChange={setTheme}
          helpText="Selected option shows a check mark, not color alone"
        />
        <Select
          label="Timezone (native)"
          presentation="native"
          description="Forces the platform select UI"
          options={[
            { value: "utc", label: "UTC", description: "Coordinated Universal Time" },
            { value: "pkt", label: "Asia/Karachi", description: "PKT · UTC+5" },
            { value: "gst", label: "Asia/Dubai", description: "GST · UTC+4" },
            { value: "est", label: "America/New_York", description: "Eastern Time" },
            { value: "cet", label: "Europe/Berlin", description: "Central European Time" },
            { value: "jst", label: "Asia/Tokyo", description: "Japan Standard Time" },
          ]}
          value={forced}
          onValueChange={setForced}
          clearable
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Large set</h3>
        <Select
          label="Many options"
          presentation="listbox"
          description="Scrollable listbox with viewport clamping"
          options={LARGE_OPTIONS}
          defaultValue="opt-12"
        />
        <Select label="Disabled" options={COUNTRY_OPTIONS} defaultValue="ae" disabled />
        <Select
          label="Success"
          options={COUNTRY_OPTIONS}
          defaultValue="pk"
          validation="success"
          successMessage="Country saved"
        />
      </div>
    </section>
  );
}

const FRUIT_OPTIONS = [
  { value: "apple", label: "Apple", description: "Crisp orchard fruit" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
  { value: "peach", label: "Peach" },
  { value: "pear", label: "Pear" },
  { value: "strawberry", label: "Strawberry" },
];

const CITY_DB = [
  { value: "khi", label: "Karachi" },
  { value: "lhr", label: "Lahore" },
  { value: "isb", label: "Islamabad" },
  { value: "dxb", label: "Dubai" },
  { value: "auh", label: "Abu Dhabi" },
  { value: "ryd", label: "Riyadh" },
  { value: "jed", label: "Jeddah" },
  { value: "lon", label: "London" },
  { value: "nyc", label: "New York" },
  { value: "tyo", label: "Tokyo" },
];

function ComboboxLab() {
  const [fruit, setFruit] = useState<string | null>(null);
  const [fruitInput, setFruitInput] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState("");
  const [cityOptions, setCityOptions] = useState(CITY_DB);
  const [cityLoading, setCityLoading] = useState(false);

  const onCityInput = (next: string) => {
    setCityInput(next);
    setCityLoading(true);
    window.setTimeout(() => {
      const q = next.trim().toLowerCase();
      setCityOptions(
        CITY_DB.filter(
          (c) => !q || c.label.toLowerCase().includes(q) || c.value.includes(q)
        )
      );
      setCityLoading(false);
    }, 450);
  };

  return (
    <section className="catalog-group" aria-labelledby="combobox-lab-heading">
      <h2 id="combobox-lab-heading">027 Combobox</h2>
      <p className="catalog-group-desc">
        Editable text plus suggestions — not a Select. Typed text stays visible even
        when there are no matches. With{" "}
        <code>allowsCustomValue=&#123;false&#125;</code>, free text is not auto-accepted
        as a valid selection.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Filtered (predefined only)</h3>
        <Combobox
          label="Fruit"
          description="Type to filter — Enter selects a highlighted option"
          helpText={
            fruit
              ? `Selected value: ${fruit}`
              : fruitInput
                ? "Text entered; pick a suggestion to confirm"
                : "No selection yet"
          }
          options={FRUIT_OPTIONS}
          value={fruit}
          onValueChange={setFruit}
          inputValue={fruitInput}
          onInputChange={setFruitInput}
          clearable
          leadingIcon={
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="5.25" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M13 13.5 16.25 16.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Free text</h3>
        <Combobox
          label="Tag"
          description="Custom values allowed — Enter or blur commits typed text"
          allowsCustomValue
          options={[
            { value: "ui", label: "ui" },
            { value: "a11y", label: "a11y" },
            { value: "forms", label: "forms" },
            { value: "design-tokens", label: "design-tokens" },
          ]}
          value={tag}
          onValueChange={setTag}
          inputValue={tagInput}
          onInputChange={setTagInput}
          helpText={tag ? `Committed: ${tag}` : "Type a new tag or pick one"}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Async suggestions</h3>
        <Combobox
          label="City"
          description="Simulated remote filter — loading slot does not shift layout"
          filter={false}
          options={cityOptions}
          loading={cityLoading}
          value={city}
          onValueChange={setCity}
          inputValue={cityInput}
          onInputChange={onCityInput}
          noResultsLabel="No cities match that query"
          helpText={city ? `Selected: ${city}` : undefined}
        />
        <Combobox
          label="Disabled"
          options={FRUIT_OPTIONS}
          defaultInputValue="Apple"
          defaultValue="apple"
          disabled
        />
        <Combobox
          label="Error"
          options={FRUIT_OPTIONS}
          validation="error"
          errorMessage="Choose a fruit from the list"
          defaultInputValue="xyz"
        />
      </div>
    </section>
  );
}

const SKILL_OPTIONS = [
  { value: "ts", label: "TypeScript", group: "languages" },
  { value: "js", label: "JavaScript", group: "languages" },
  { value: "py", label: "Python", group: "languages", disabled: true },
  { value: "react", label: "React", group: "frameworks" },
  { value: "vue", label: "Vue", group: "frameworks" },
  { value: "svelte", label: "Svelte", group: "frameworks" },
  { value: "a11y", label: "Accessibility", group: "practice" },
  { value: "testing", label: "Testing", group: "practice" },
  { value: "design", label: "Design systems", group: "practice" },
];

const LARGE_MULTI_OPTIONS = Array.from({ length: 120 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `Option ${String(i + 1).padStart(3, "0")}`,
  group: i < 40 ? "A–D" : i < 80 ? "E–H" : "I–Z",
  disabled: i === 4 || i === 55,
}));

function MultiSelectLab() {
  const [skills, setSkills] = useState<string[]>(["ts", "react"]);
  const [tags, setTags] = useState<string[]>(["a11y", "testing", "design", "ts", "js"]);
  const [many, setMany] = useState<string[]>(["item-1", "item-2"]);
  const [asyncOpts, setAsyncOpts] = useState(SKILL_OPTIONS);
  const [asyncLoading, setAsyncLoading] = useState(false);
  const [asyncVal, setAsyncVal] = useState<string[]>([]);

  const onAsyncSearch = (q: string) => {
    setAsyncLoading(true);
    window.setTimeout(() => {
      const needle = q.trim().toLowerCase();
      setAsyncOpts(
        SKILL_OPTIONS.filter(
          (o) =>
            !needle ||
            o.label.toLowerCase().includes(needle) ||
            o.value.includes(needle)
        )
      );
      setAsyncLoading(false);
    }, 350);
  };

  return (
    <section className="catalog-group" aria-labelledby="multiselect-lab-heading">
      <h2 id="multiselect-lab-heading">028 Multi-Select</h2>
      <p className="catalog-group-desc">
        Multiple choices from a predefined set. Selected values adapt between chips,
        compact text, and a count summary so many selections never overflow
        horizontally. Large lists virtualize past 80 options.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Grouped + chips</h3>
        <MultiSelect
          label="Skills"
          description="Space toggles; Enter closes"
          helpText={`${skills.length} selected`}
          options={SKILL_OPTIONS}
          groups={[
            { id: "languages", label: "Languages" },
            { id: "frameworks", label: "Frameworks" },
            { id: "practice", label: "Practice" },
          ]}
          value={skills}
          onValueChange={setSkills}
          maxSelections={5}
          maxExceededMessage="Choose up to 5 skills"
          presentation="popover"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Many selections → count</h3>
        <MultiSelect
          label="Tags"
          description="Auto display collapses to a count when chips would overwhelm"
          options={SKILL_OPTIONS}
          value={tags}
          onValueChange={setTags}
          maxVisibleChips={2}
          minSelections={2}
          minNotMetMessage="Pick at least two tags"
          presentation="popover"
        />
        <MultiSelect
          label="Count only"
          displayMode="count"
          options={SKILL_OPTIONS}
          defaultValue={["react", "vue", "a11y"]}
          presentation="popover"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Large set (virtualized)</h3>
        <MultiSelect
          label="120 options"
          description="Search + windowed list"
          options={LARGE_MULTI_OPTIONS}
          value={many}
          onValueChange={setMany}
          presentation="popover"
          virtualizeThreshold={80}
        />
        <MultiSelect
          label="Async filter"
          filter={false}
          loading={asyncLoading}
          options={asyncOpts}
          value={asyncVal}
          onValueChange={setAsyncVal}
          onSearchChange={onAsyncSearch}
          presentation="popover"
          searchable
          searchPlaceholder="Filter remotely…"
          noResultsLabel="Nothing matched"
        />
        <MultiSelect
          label="Error"
          options={SKILL_OPTIONS}
          validation="error"
          errorMessage="Select at least one skill"
          defaultValue={[]}
          presentation="popover"
        />
      </div>
    </section>
  );
}

function ChoiceChipsLab() {
  const [size, setSize] = useState<string | string[] | null>("md");
  const [filters, setFilters] = useState<string | string[] | null>(["open", "mine"]);
  const [priority, setPriority] = useState<string | string[] | null>("normal");

  return (
    <section className="catalog-group" aria-labelledby="choice-chips-lab-heading">
      <h2 id="choice-chips-lab-heading">029 Choice Chips</h2>
      <p className="catalog-group-desc">
        Compact selection among a small related set — not a Button, Tag, Badge,
        Checkbox, or Radio. Selected state uses a check mark, semibold label, and
        emphasis border (not color alone). Chips wrap; hits stay ≥44×44.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Single selection</h3>
        <ChoiceChips
          label="Density"
          description="Mutually exclusive — radiogroup semantics"
          helpText={size ? `Selected: ${size}` : "None selected"}
          selectionMode="single"
          allowDeselect
          value={size}
          onValueChange={setSize}
          options={[
            { value: "sm", label: "Compact" },
            { value: "md", label: "Comfortable" },
            { value: "lg", label: "Spacious" },
          ]}
        />
        <ChoiceChips
          label="Priority"
          selectionMode="single"
          value={priority}
          onValueChange={setPriority}
          options={[
            {
              value: "low",
              label: "Low",
              icon: (
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4 6.5 8 10.5 12 6.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            { value: "normal", label: "Normal" },
            {
              value: "high",
              label: "High",
              icon: (
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4 9.5 8 5.5 12 9.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            { value: "blocked", label: "Blocked", disabled: true },
          ]}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Multiple selection</h3>
        <ChoiceChips
          label="Filters"
          description="Each chip toggles independently"
          selectionMode="multiple"
          value={filters}
          onValueChange={setFilters}
          options={[
            { value: "open", label: "Open" },
            { value: "mine", label: "Assigned to me" },
            { value: "overdue", label: "Overdue" },
            { value: "comments", label: "Has comments" },
            { value: "attachments", label: "Has attachments" },
          ]}
          helpText={
            Array.isArray(filters) && filters.length
              ? `${filters.length} active`
              : "No filters"
          }
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Wrapping + states</h3>
        <ChoiceChips
          label="Localized / longer labels"
          description="Chips wrap instead of overflowing the page"
          selectionMode="single"
          defaultValue="en"
          options={[
            { value: "en", label: "English" },
            { value: "ur", label: "اردو" },
            { value: "ar", label: "العربية" },
            { value: "de", label: "Deutsch (Deutschland)" },
            { value: "fr", label: "Français (Canada)" },
            { value: "ja", label: "日本語" },
          ]}
        />
        <ChoiceChips
          label="Disabled group"
          options={[
            { value: "a", label: "Alpha" },
            { value: "b", label: "Beta" },
          ]}
          defaultValue="a"
          disabled
        />
        <ChoiceChips
          label="Error"
          selectionMode="single"
          validation="error"
          errorMessage="Choose a delivery window"
          options={[
            { value: "am", label: "Morning" },
            { value: "pm", label: "Afternoon" },
            { value: "eve", label: "Evening" },
          ]}
        />
      </div>
    </section>
  );
}

function SliderLab() {
  const [volume, setVolume] = useState(42);
  const [opacity, setOpacity] = useState(0.75);
  const [temp, setTemp] = useState(21);
  const [commits, setCommits] = useState(0);

  return (
    <section className="catalog-group" aria-labelledby="slider-lab-heading">
      <h2 id="slider-lab-heading">030 Slider</h2>
      <p className="catalog-group-desc">
        Numeric continuous or stepped range — not for categorical choices. Thumb hit
        is ≥44×44 while the visual may be smaller. Use{" "}
        <code>onValueChange</code> for immediate UI; debounce expensive work, or listen
        to <code>onValueCommit</code> on release.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Basic</h3>
        <Slider
          label="Volume"
          description="Arrow keys step by 1; Page Up/Down jump by 10"
          unit="%"
          min={0}
          max={100}
          step={1}
          value={volume}
          onValueChange={setVolume}
          onValueCommit={() => setCommits((c) => c + 1)}
          helpText={`Commits: ${commits}`}
        />
        <Slider
          label="Opacity"
          description="Decimal step"
          min={0}
          max={1}
          step={0.05}
          value={opacity}
          onValueChange={setOpacity}
          unit=""
          formatValue={(v) => v.toFixed(2)}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Precise input</h3>
        <Slider
          label="Temperature"
          description="Slider plus numeric field for exact values"
          min={16}
          max={30}
          step={0.5}
          value={temp}
          onValueChange={setTemp}
          unit="°C"
          showInput
          inputLabel="Temperature"
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">States</h3>
        <Slider label="Disabled" defaultValue={30} disabled unit="%" />
        <Slider
          label="Error"
          defaultValue={8}
          min={0}
          max={10}
          validation="error"
          errorMessage="Value is outside the safe operating range"
        />
        <Slider
          label="Success"
          defaultValue={100}
          validation="success"
          successMessage="Target reached"
          unit="%"
        />
      </div>
    </section>
  );
}

export function App() {
  return (
    <div className="playground">
      <header className="playground-header">
        <div>
          <h1>DevKit</h1>
          <p>
            Layer 1 — Interaction Controls 001–010; Form Controls 011–020;
            Selection Controls 021–030 ready.
          </p>
        </div>
      </header>

      <ButtonLab />
      <IconButtonLab />
      <ButtonGroupLab />
      <SplitButtonLab />
      <LinkButtonLab />
      <FabLab />
      <ToggleButtonLab />
      <SegmentedControlLab />
      <CommandButtonLab />
      <ActionMenuTriggerLab />
      <TextInputLab />
      <TextareaLab />
      <SearchFieldLab />
      <NumberInputLab />
      <PasswordInputLab />
      <OtpInputLab />
      <DateInputLab />
      <TimeInputLab />
      <DateTimeInputLab />
      <InputGroupLab />
      <CheckboxLab />
      <CheckboxGroupLab />
      <RadioLab />
      <RadioGroupLab />
      <SwitchLab />
      <SelectLab />
      <ComboboxLab />
      <MultiSelectLab />
      <ChoiceChipsLab />
      <SliderLab />

      {groups.map((group) => (
        <section
          key={group.id}
          className="catalog-group"
          aria-labelledby={`group-${group.id}`}
        >
          <h2 id={`group-${group.id}`}>{group.name}</h2>
          <p className="catalog-group-desc">{group.description}</p>
          <p className="catalog-group-meta">
            templates={group.templates.join(", ")} · subgroups=
            {group.subgroups.length} · packages={packageCount(group)}
          </p>

          {group.subgroups.map((subgroup) => (
            <div key={subgroup.id} className="catalog-subgroup">
              <h3 className="catalog-subgroup-title">
                {subgroup.name}
                <span className="catalog-meta">
                  {" "}
                  · {subgroup.components.length} packages
                </span>
              </h3>
              <ul className="catalog-list">
                {subgroup.components.length === 0 ? (
                  <li>
                    <span className="catalog-name">None registered</span>
                    <span className="catalog-meta">{subgroup.id}</span>
                  </li>
                ) : (
                  subgroup.components.map((comp) => (
                    <li key={comp.name}>
                      <span className="catalog-name">
                        {String(comp.id).padStart(3, "0")} {comp.displayName}
                        {comp.stub ? (
                          <span className="catalog-badge">stub</span>
                        ) : (
                          <span className="catalog-badge">ready</span>
                        )}
                      </span>
                      <span className="catalog-meta">{comp.name}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </section>
      ))}

      <section className="catalog-group" aria-labelledby="scaffolds-heading">
        <h2 id="scaffolds-heading">Scaffolds</h2>
        <ul className="catalog-list">
          <li>
            <span className="catalog-name">None registered</span>
            <span className="catalog-meta">kind=scaffold</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
