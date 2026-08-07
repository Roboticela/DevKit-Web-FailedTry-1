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

export function App() {
  return (
    <div className="playground">
      <header className="playground-header">
        <div>
          <h1>DevKit</h1>
          <p>
            Layer 1 Interaction Controls — through Floating Action Button (006)
            ready; remaining packages are stubs.
          </p>
        </div>
      </header>

      <ButtonLab />
      <IconButtonLab />
      <ButtonGroupLab />
      <SplitButtonLab />
      <LinkButtonLab />
      <FabLab />

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
