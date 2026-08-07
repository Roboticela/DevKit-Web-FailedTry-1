import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

import { Button } from "@registry/components/button/vite-express-tauri/v1/files/src/components/ui/Button";
import "@registry/components/button/vite-express-tauri/v1/files/src/styles/button.css";

import { IconButton } from "@registry/components/icon-button/vite-express-tauri/v1/files/src/components/ui/IconButton";
import "@registry/components/icon-button/vite-express-tauri/v1/files/src/styles/icon-button.css";

import { ButtonGroup } from "@registry/components/button-group/vite-express-tauri/v1/files/src/components/ui/ButtonGroup";
import "@registry/components/button-group/vite-express-tauri/v1/files/src/styles/button-group.css";

import { SplitButton } from "@registry/components/split-button/vite-express-tauri/v1/files/src/components/ui/SplitButton";
import "@registry/components/split-button/vite-express-tauri/v1/files/src/styles/split-button.css";

import { LinkButton } from "@registry/components/link-button/vite-express-tauri/v1/files/src/components/ui/LinkButton";
import "@registry/components/link-button/vite-express-tauri/v1/files/src/styles/link-button.css";

import { ToggleButton } from "@registry/components/toggle-button/vite-express-tauri/v1/files/src/components/ui/ToggleButton";
import "@registry/components/toggle-button/vite-express-tauri/v1/files/src/styles/toggle-button.css";

import { CommandButton } from "@registry/components/command-button/vite-express-tauri/v1/files/src/components/ui/CommandButton";
import "@registry/components/command-button/vite-express-tauri/v1/files/src/styles/command-button.css";

import { ActionMenuTrigger } from "@registry/components/action-menu-trigger/vite-express-tauri/v1/files/src/components/ui/ActionMenuTrigger";
import "@registry/components/action-menu-trigger/vite-express-tauri/v1/files/src/styles/action-menu-trigger.css";

import { TextInput } from "@registry/components/text-input/vite-express-tauri/v1/files/src/components/ui/TextInput";
import "@registry/components/text-input/vite-express-tauri/v1/files/src/styles/text-input.css";

import { NumberInput } from "@registry/components/number-input/vite-express-tauri/v1/files/src/components/ui/NumberInput";
import "@registry/components/number-input/vite-express-tauri/v1/files/src/styles/number-input.css";

import { PasswordInput } from "@registry/components/password-input/vite-express-tauri/v1/files/src/components/ui/PasswordInput";
import "@registry/components/password-input/vite-express-tauri/v1/files/src/styles/password-input.css";

import { OtpInput } from "@registry/components/otp-input/vite-express-tauri/v1/files/src/components/ui/OtpInput";
import "@registry/components/otp-input/vite-express-tauri/v1/files/src/styles/otp-input.css";

import { DateInput } from "@registry/components/date-input/vite-express-tauri/v1/files/src/components/ui/DateInput";
import "@registry/components/date-input/vite-express-tauri/v1/files/src/styles/date-input.css";

import { TimeInput } from "@registry/components/time-input/vite-express-tauri/v1/files/src/components/ui/TimeInput";
import "@registry/components/time-input/vite-express-tauri/v1/files/src/styles/time-input.css";

import { DateTimeInput } from "@registry/components/date-time-input/vite-express-tauri/v1/files/src/components/ui/DateTimeInput";
import "@registry/components/date-time-input/vite-express-tauri/v1/files/src/styles/date-time-input.css";

import { InputGroup } from "@registry/components/input-group/vite-express-tauri/v1/files/src/components/ui/InputGroup";
import "@registry/components/input-group/vite-express-tauri/v1/files/src/styles/input-group.css";

import { Checkbox } from "@registry/components/checkbox/vite-express-tauri/v1/files/src/components/ui/Checkbox";
import "@registry/components/checkbox/vite-express-tauri/v1/files/src/styles/checkbox.css";

import { CheckboxGroup } from "@registry/components/checkbox-group/vite-express-tauri/v1/files/src/components/ui/CheckboxGroup";
import "@registry/components/checkbox-group/vite-express-tauri/v1/files/src/styles/checkbox-group.css";

import { Toast } from "@registry/components/toast/vite-express-tauri/v1/files/src/components/ui/Toast";
import "@registry/components/toast/vite-express-tauri/v1/files/src/styles/toast.css";

import { Spinner } from "@registry/components/spinner/vite-express-tauri/v1/files/src/components/ui/Spinner";
import "@registry/components/spinner/vite-express-tauri/v1/files/src/styles/spinner.css";

import { Tooltip } from "@registry/components/tooltip/vite-express-tauri/v1/files/src/components/ui/Tooltip";
import "@registry/components/tooltip/vite-express-tauri/v1/files/src/styles/tooltip.css";

import { DropdownMenu } from "@registry/components/dropdown-menu/vite-express-tauri/v1/files/src/components/ui/DropdownMenu";
import "@registry/components/dropdown-menu/vite-express-tauri/v1/files/src/styles/dropdown-menu.css";

import { Text } from "@registry/components/text/vite-express-tauri/v1/files/src/components/ui/Text";
import "@registry/components/text/vite-express-tauri/v1/files/src/styles/text.css";

import { Heading } from "@registry/components/heading/vite-express-tauri/v1/files/src/components/ui/Heading";
import "@registry/components/heading/vite-express-tauri/v1/files/src/styles/heading.css";

import { Paragraph } from "@registry/components/paragraph/vite-express-tauri/v1/files/src/components/ui/Paragraph";
import "@registry/components/paragraph/vite-express-tauri/v1/files/src/styles/paragraph.css";

import { Label } from "@registry/components/label/vite-express-tauri/v1/files/src/components/ui/Label";
import "@registry/components/label/vite-express-tauri/v1/files/src/styles/label.css";

import { Caption } from "@registry/components/caption/vite-express-tauri/v1/files/src/components/ui/Caption";
import "@registry/components/caption/vite-express-tauri/v1/files/src/styles/caption.css";

import { Link } from "@registry/components/link/vite-express-tauri/v1/files/src/components/ui/Link";
import "@registry/components/link/vite-express-tauri/v1/files/src/styles/link.css";

import { ActionButtonGroup } from "@registry/components/action-button-group/vite-express-tauri/v1/files/src/components/ui/ActionButtonGroup";
import "@registry/components/action-button-group/vite-express-tauri/v1/files/src/styles/action-button-group.css";

import { IconButtonGroup } from "@registry/components/icon-button-group/vite-express-tauri/v1/files/src/components/ui/IconButtonGroup";
import "@registry/components/icon-button-group/vite-express-tauri/v1/files/src/styles/icon-button-group.css";

import {
  ActionSplitButton,
  ActionSplitMenuTrigger,
} from "@registry/components/action-split-button/vite-express-tauri/v1/files/src/components/ui/ActionSplitButton";
import "@registry/components/action-split-button/vite-express-tauri/v1/files/src/styles/action-split-button.css";

import { ActionSegmentedControl } from "@registry/components/action-segmented-control/vite-express-tauri/v1/files/src/components/ui/ActionSegmentedControl";
import "@registry/components/action-segmented-control/vite-express-tauri/v1/files/src/styles/action-segmented-control.css";

import { ActionGroup } from "@registry/components/action-group/vite-express-tauri/v1/files/src/components/ui/ActionGroup";
import "@registry/components/action-group/vite-express-tauri/v1/files/src/styles/action-group.css";

import { Tabs } from "@registry/components/tabs/vite-express-tauri/v1/files/src/components/ui/Tabs";
import "@registry/components/tabs/vite-express-tauri/v1/files/src/styles/tabs.css";

import { TabBar } from "@registry/components/tab-bar/vite-express-tauri/v1/files/src/components/ui/TabBar";
import "@registry/components/tab-bar/vite-express-tauri/v1/files/src/styles/tab-bar.css";

import { Card } from "@registry/components/card/vite-express-tauri/v1/files/src/components/ui/Card";
import "@registry/components/card/vite-express-tauri/v1/files/src/styles/card.css";

import { Alert } from "@registry/components/alert/vite-express-tauri/v1/files/src/components/ui/Alert";
import "@registry/components/alert/vite-express-tauri/v1/files/src/styles/alert.css";

import { AlertDialog } from "@registry/components/alert-dialog/vite-express-tauri/v1/files/src/components/ui/AlertDialog";
import "@registry/components/alert-dialog/vite-express-tauri/v1/files/src/styles/alert-dialog.css";

import { Badge } from "@registry/components/badge/vite-express-tauri/v1/files/src/components/ui/Badge";
import "@registry/components/badge/vite-express-tauri/v1/files/src/styles/badge.css";

import { List } from "@registry/components/list/vite-express-tauri/v1/files/src/components/ui/List";
import "@registry/components/list/vite-express-tauri/v1/files/src/styles/list.css";

import { ListItem } from "@registry/components/list-item/vite-express-tauri/v1/files/src/components/ui/ListItem";
import "@registry/components/list-item/vite-express-tauri/v1/files/src/styles/list-item.css";

import { ProgressBar } from "@registry/components/progress-bar/vite-express-tauri/v1/files/src/components/ui/ProgressBar";
import "@registry/components/progress-bar/vite-express-tauri/v1/files/src/styles/progress-bar.css";

import { SearchField } from "@registry/components/search-field/vite-express-tauri/v1/files/src/components/ui/SearchField";
import "@registry/components/search-field/vite-express-tauri/v1/files/src/styles/search-field.css";

import { Skeleton, SkeletonGroup } from "@registry/components/skeleton/vite-express-tauri/v1/files/src/components/ui/Skeleton";
import "@registry/components/skeleton/vite-express-tauri/v1/files/src/styles/skeleton.css";

import { Brand } from "@registry/components/brand/vite-express-tauri/v1/files/src/components/ui/Brand";
import "@registry/components/brand/vite-express-tauri/v1/files/src/styles/brand.css";

import { Avatar } from "@registry/components/avatar/vite-express-tauri/v1/files/src/components/ui/Avatar";
import "@registry/components/avatar/vite-express-tauri/v1/files/src/styles/avatar.css";

import { AvatarGroup } from "@registry/components/avatar-group/vite-express-tauri/v1/files/src/components/ui/AvatarGroup";
import "@registry/components/avatar-group/vite-express-tauri/v1/files/src/styles/avatar-group.css";

import { Tag } from "@registry/components/tag/vite-express-tauri/v1/files/src/components/ui/Tag";
import "@registry/components/tag/vite-express-tauri/v1/files/src/styles/tag.css";

import { Divider } from "@registry/components/divider/vite-express-tauri/v1/files/src/components/ui/Divider";
import "@registry/components/divider/vite-express-tauri/v1/files/src/styles/divider.css";

import { Surface } from "@registry/components/surface/vite-express-tauri/v1/files/src/components/ui/Surface";
import "@registry/components/surface/vite-express-tauri/v1/files/src/styles/surface.css";

import { NavItem } from "@registry/components/nav-item/vite-express-tauri/v1/files/src/components/ui/NavItem";
import "@registry/components/nav-item/vite-express-tauri/v1/files/src/styles/nav-item.css";

import { Breadcrumb } from "@registry/components/breadcrumb/vite-express-tauri/v1/files/src/components/ui/Breadcrumb";
import "@registry/components/breadcrumb/vite-express-tauri/v1/files/src/styles/breadcrumb.css";

import { NavigationDrawer } from "@registry/components/navigation-drawer/vite-express-tauri/v1/files/src/components/ui/NavigationDrawer";
import "@registry/components/navigation-drawer/vite-express-tauri/v1/files/src/styles/navigation-drawer.css";

import { Navbar } from "@registry/components/navbar/vite-express-tauri/v1/files/src/components/ui/Navbar";
import "@registry/components/navbar/vite-express-tauri/v1/files/src/styles/navbar.css";

import { NavActions } from "@registry/components/nav-actions/vite-express-tauri/v1/files/src/components/ui/NavActions";
import "@registry/components/nav-actions/vite-express-tauri/v1/files/src/styles/nav-actions.css";

import { ThemeToggle, DEFAULT_THEMES } from "@registry/components/theme-toggle/vite-express-tauri/v1/files/src/components/ui/ThemeToggle";
import "@registry/components/theme-toggle/vite-express-tauri/v1/files/src/styles/theme-toggle.css";

import { ColorPalette } from "@registry/components/color-palette/vite-express-tauri/v1/files/src/components/ui/ColorPalette";
import "@registry/components/color-palette/vite-express-tauri/v1/files/src/styles/color-palette.css";


export type PreviewEntry = {
  Preview: ComponentType;
  Mini?: ComponentType;
  Variants?: ComponentType;
  Playground?: ComponentType;
  sourceImport?: string;
};

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5l2.1 4.26 4.7.68-3.4 3.31.8 4.68L10 13.27 5.8 15.43l.8-4.68-3.4-3.31 4.7-.68L10 2.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="10" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="16" cy="10" r="1.5" />
    </svg>
  );
}

const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "tertiary",
  "destructive",
  "success",
  "quiet",
  "inverse",
] as const;

function ButtonPreview() {
  return <Button>Button</Button>;
}

function ButtonVariants() {
  return (
    <div className="pg-variant-grid">
      {BUTTON_VARIANTS.map((v) => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  );
}

function ButtonPlayground() {
  const [variant, setVariant] = useState<(typeof BUTTON_VARIANTS)[number]>("primary");
  const [label, setLabel] = useState("Save changes");
  const [loading, setLoading] = useState(false);
  return (
    <div className="pg-playground">
      <div className="pg-playground__controls">
        <TextInput label="Label" value={label} onValueChange={setLabel} />
        <ActionSegmentedControl
          label="Variant"
          size="sm"
          value={variant}
          onValueChange={(v: string) => setVariant(v as (typeof BUTTON_VARIANTS)[number])}
          options={BUTTON_VARIANTS.map((v) => ({ id: v, label: v }))}
          overflow="scroll"
          equalWidth={false}
        />
        <Checkbox
          label="Loading"
          checked={loading}
          onCheckedChange={(c: boolean) => setLoading(Boolean(c))}
        />
      </div>
      <div className="pg-playground__stage">
        <Button variant={variant} loading={loading}>
          {label}
        </Button>
      </div>
    </div>
  );
}

function IconButtonPreview() {
  return <IconButton label="Favorite" icon={<StarIcon />} />;
}

function CardPreview() {
  return (
    <Card variant="outlined">
      <Card.Header>
        <Card.Title as="h3">Card title</Card.Title>
        <Card.Description>Composable surface for related content.</Card.Description>
      </Card.Header>
    </Card>
  );
}

function CardVariants() {
  const variants = ["standard", "compact", "elevated", "outlined"] as const;
  return (
    <div className="pg-variant-grid">
      {variants.map((v) => (
        <Card key={v} variant={v}>
          <Card.Header>
            <Card.Title as="h3">{v}</Card.Title>
            <Card.Description>Card variant preview</Card.Description>
          </Card.Header>
        </Card>
      ))}
    </div>
  );
}

export const PREVIEWS: Record<string, PreviewEntry> = {
  button: {
    Preview: ButtonPreview,
    Mini: ButtonPreview,
    Variants: ButtonVariants,
    Playground: ButtonPlayground,
  },
  "icon-button": {
    Preview: IconButtonPreview,
    Mini: IconButtonPreview,
    Variants: () => (
      <div className="pg-variant-grid">
        {(["neutral", "subtle", "filled", "outlined", "destructive"] as const).map((v) => (
          <IconButton key={v} label={v} variant={v} icon={<StarIcon />} />
        ))}
      </div>
    ),
  },
  "button-group": {
    Preview: () => (
      <ButtonGroup label="Actions">
        <Button variant="secondary">One</Button>
        <Button variant="secondary">Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    ),
  },
  "split-button": {
    Preview: () => (
      <SplitButton
        menuLabel="More save options"
        items={[
          { id: "draft", label: "Save draft" },
          { id: "copy", label: "Save a copy" },
        ]}
      >
        Save
      </SplitButton>
    ),
  },
  "link-button": {
    Preview: () => <LinkButton>Learn more</LinkButton>,
  },
  "toggle-button": {
    Preview: () => <ToggleButton label="Bold" appearance="text" defaultPressed />,
  },
  "command-button": {
    Preview: () => (
      <CommandButton label="Open file" description="Browse your library" shortcut="⌘O" fullWidth />
    ),
  },
  "action-menu-trigger": {
    Preview: () => (
      <ActionMenuTrigger
        label="More actions"
        appearance="icon"
        icon={<MoreIcon />}
        items={[
          { id: "edit", label: "Edit" },
          { id: "duplicate", label: "Duplicate" },
          { id: "delete", label: "Delete", destructive: true },
        ]}
      />
    ),
    Mini: () => (
      <ActionMenuTrigger
        label="More"
        appearance="labeled"
        items={[{ id: "a", label: "Action" }]}
      >
        Menu
      </ActionMenuTrigger>
    ),
  },
  "text-input": {
    Preview: () => <TextInput label="Email" type="email" placeholder="you@example.com" />,
    Mini: () => <TextInput label="Name" hideLabel placeholder="Name" />,
  },
  "number-input": {
    Preview: () => <NumberInput label="Quantity" defaultValue={1} />,
  },
  "password-input": {
    Preview: () => <PasswordInput label="Password" />,
  },
  "otp-input": {
    Preview: () => <OtpInput label="Verification code" length={6} />,
  },
  "date-input": {
    Preview: () => <DateInput label="Date" />,
  },
  "time-input": {
    Preview: () => <TimeInput label="Time" />,
  },
  "date-time-input": {
    Preview: () => <DateTimeInput label="Date and time" />,
  },
  "input-group": {
    Preview: () => (
      <InputGroup label="Price">
        <InputGroup.Addon position="start">$</InputGroup.Addon>
        <InputGroup.Input>
          <TextInput label="Amount" hideLabel placeholder="0.00" />
        </InputGroup.Input>
      </InputGroup>
    ),
  },
  checkbox: {
    Preview: () => <Checkbox label="Subscribe to updates" defaultChecked />,
  },
  "checkbox-group": {
    Preview: () => (
      <CheckboxGroup
        label="Permissions"
        description="Select what this role can do"
        defaultValue={["read"]}
        items={[
          { value: "read", label: "Read" },
          { value: "write", label: "Write" },
          { value: "admin", label: "Admin" },
        ]}
      />
    ),
  },
  toast: {
    Preview: () => <Toast message="Saved successfully" variant="success" dismissible={false} />,
    Mini: () => <Toast message="Saved" variant="success" dismissible={false} />,
  },
  spinner: {
    Preview: () => <Spinner label="Loading" labelMode="visible" />,
    Mini: () => <Spinner label="Loading" />,
  },
  tooltip: {
    Preview: () => (
      <Tooltip content="Supplementary hint">
        <Button variant="secondary">Hover me</Button>
      </Tooltip>
    ),
  },
  "dropdown-menu": {
    Preview: () => (
      <DropdownMenu
        label="Account menu"
        items={[
          { id: "profile", label: "Profile" },
          { id: "settings", label: "Settings" },
          { type: "separator" },
          { id: "logout", label: "Log out", destructive: true },
        ]}
      >
        <Button variant="secondary">Open menu</Button>
      </DropdownMenu>
    ),
  },
  text: {
    Preview: () => <Text size="md">The quick brown fox jumps over the lazy dog.</Text>,
  },
  heading: {
    Preview: () => (
      <Heading level={2} size="lg">
        Section heading
      </Heading>
    ),
  },
  paragraph: {
    Preview: () => (
      <Paragraph>
        Paragraphs set readable measure and spacing for longer body copy in product UI.
      </Paragraph>
    ),
  },
  label: {
    Preview: () => <Label htmlFor="demo-field">Field label</Label>,
  },
  caption: {
    Preview: () => <Caption>Supporting caption text</Caption>,
  },
  link: {
    Preview: () => (
      <Link href="#preview" variant="standalone">
        Documentation
      </Link>
    ),
  },
  "action-button-group": {
    Preview: () => (
      <ActionButtonGroup label="Form actions">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </ActionButtonGroup>
    ),
  },
  "icon-button-group": {
    Preview: () => (
      <IconButtonGroup label="Formatting">
        <IconButton label="Bold" icon={<StarIcon />} />
        <IconButton label="Italic" icon={<StarIcon />} />
        <IconButton label="Underline" icon={<StarIcon />} />
      </IconButtonGroup>
    ),
  },
  "action-split-button": {
    Preview: () => (
      <ActionSplitButton
        menu={
          <DropdownMenu
            label="More export options"
            items={[
              { id: "pdf", label: "Export PDF" },
              { id: "csv", label: "Export CSV" },
            ]}
          >
            <ActionSplitMenuTrigger label="More export options" />
          </DropdownMenu>
        }
      >
        Export
      </ActionSplitButton>
    ),
  },
  "action-segmented-control": {
    Preview: () => (
      <ActionSegmentedControl
        label="View"
        defaultValue="list"
        options={[
          { id: "list", label: "List" },
          { id: "grid", label: "Grid" },
          { id: "board", label: "Board" },
        ]}
      />
    ),
  },
  "action-group": {
    Preview: () => (
      <ActionGroup label="Editor actions">
        <ActionGroup.Primary>
          <Button>Publish</Button>
        </ActionGroup.Primary>
        <ActionGroup.Item>
          <Button variant="secondary">Preview</Button>
        </ActionGroup.Item>
        <ActionGroup.Item rank="icon">
          <IconButton label="More" icon={<MoreIcon />} />
        </ActionGroup.Item>
      </ActionGroup>
    ),
  },
  tabs: {
    Preview: () => (
      <Tabs
        label="Example tabs"
        defaultValue="one"
        items={[
          { id: "one", label: "Overview", panel: <Paragraph>Overview panel</Paragraph> },
          { id: "two", label: "Details", panel: <Paragraph>Details panel</Paragraph> },
          { id: "three", label: "Activity", panel: <Paragraph>Activity panel</Paragraph> },
        ]}
      />
    ),
  },
  "tab-bar": {
    Preview: () => (
      <TabBar
        label="App sections"
        defaultValue="home"
        items={[
          { id: "home", label: "Home" },
          { id: "search", label: "Search" },
          { id: "profile", label: "Profile" },
        ]}
      />
    ),
  },
  card: {
    Preview: CardPreview,
    Mini: CardPreview,
    Variants: CardVariants,
  },
  "search-field": {
    Preview: () => (
      <SearchField label="Search" placeholder="Search packages…" clearable />
    ),
    Mini: () => <SearchField label="Search" hideLabel placeholder="Search…" />,
  },
  alert: {
    Preview: () => (
      <Alert variant="informational" title="Heads up">
        Your changes are saved as a draft until you publish.
      </Alert>
    ),
    Variants: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        {(["informational", "success", "warning", "error"] as const).map((v) => (
          <Alert key={v} variant={v} title={v}>
            Example {v} message.
          </Alert>
        ))}
      </div>
    ),
  },
  badge: {
    Preview: () => (
      <Badge appearance="numeric" count={3} accessibleLabel="3 unread" tone="accent">
        <IconButton label="Notifications" icon={<StarIcon />} />
      </Badge>
    ),
    Mini: () => <Badge appearance="text" label="New" tone="accent" />,
    Variants: () => (
      <div className="pg-variant-grid">
        <Badge appearance="text" label="Beta" tone="neutral" />
        <Badge appearance="numeric" count={12} accessibleLabel="12 items" tone="accent" />
        <Badge appearance="dot" accessibleLabel="Online" tone="positive" />
        <Badge appearance="text" label="Error" tone="negative" />
      </div>
    ),
  },
  "progress-bar": {
    Preview: () => (
      <ProgressBar label="Upload" value={64} showValue description="Uploading assets…" />
    ),
    Mini: () => <ProgressBar label="Progress" hideLabel value={40} />,
  },
  skeleton: {
    Preview: () => (
      <SkeletonGroup label="Loading content">
        <Skeleton shape="avatar" />
        <Skeleton shape="title" width="60%" />
        <Skeleton shape="text" lines={3} />
      </SkeletonGroup>
    ),
    Mini: () => <Skeleton shape="text" lines={2} width="100%" />,
  },
  "alert-dialog": {
    Preview: () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="destructive" onClick={() => setOpen(true)}>
            Delete project
          </Button>
          <AlertDialog
            open={open}
            onOpenChange={setOpen}
            tone="destructive"
            title="Delete this project?"
            description="This permanently removes the project and its data. This cannot be undone."
            cancelAction={
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            }
            action={
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Delete
              </Button>
            }
          />
        </>
      );
    },
  },
  list: {
    Preview: () => (
      <List aria-label="Team members" dividers="between">
        <List.Item itemKey="a">
          <List.ItemLabel>Alex Rivera</List.ItemLabel>
          <List.ItemDescription>Product design</List.ItemDescription>
        </List.Item>
        <List.Item itemKey="b">
          <List.ItemLabel>Jordan Lee</List.ItemLabel>
          <List.ItemDescription>Engineering</List.ItemDescription>
        </List.Item>
        <List.Item itemKey="c">
          <List.ItemLabel>Sam Patel</List.ItemLabel>
          <List.ItemDescription>Research</List.ItemDescription>
        </List.Item>
      </List>
    ),
  },
  "list-item": {
    Preview: () => (
      <ListItem interactive density="comfortable" lines="two">
        <ListItem.Leading>
          <Skeleton shape="avatar" size="sm" animated={false} />
        </ListItem.Leading>
        <ListItem.Primary>
          <ListItem.Title as="h3">Inbox overview</ListItem.Title>
          <ListItem.Description>3 unread conversations need a reply.</ListItem.Description>
        </ListItem.Primary>
        <ListItem.Trailing>
          <Badge appearance="numeric" count={3} accessibleLabel="3 unread" tone="accent" />
        </ListItem.Trailing>
      </ListItem>
    ),
  },
  brand: {
    Preview: () => <Brand label="DevKit" name="DevKit" descriptor="Design system" layout="lockup" />,
    Mini: () => <Brand label="DevKit" layout="lockup" size="sm" />,
  },
  avatar: {
    Preview: () => <Avatar label="Alex Rivera" initials="AR" size={40} status="online" />,
    Mini: () => <Avatar label="Alex" initials="AR" size={32} />,
  },
  "avatar-group": {
    Preview: () => (
      <AvatarGroup label="Team" max={3} size={32}>
        <Avatar label="Alex" initials="AR" size={32} />
        <Avatar label="Jordan" initials="JL" size={32} />
        <Avatar label="Sam" initials="SP" size={32} />
        <Avatar label="Riley" initials="RK" size={32} />
      </AvatarGroup>
    ),
  },
  tag: {
    Preview: () => (
      <Tag.Group label="Filters">
        <Tag tone="accent" selected icon={<StarIcon />}>
          Components
        </Tag>
        <Tag removable onRemove={() => undefined}>
          Pages
        </Tag>
        <Tag tone="neutral" count={12}>
          Scaffolds
        </Tag>
      </Tag.Group>
    ),
  },
  divider: {
    Preview: () => <Divider variant="section" label="Or continue" />,
    Mini: () => <Divider />,
  },
  surface: {
    Preview: () => (
      <Surface variant="elevated" padding="md" bordered>
        <Paragraph>Surface content region</Paragraph>
      </Surface>
    ),
  },
  "nav-item": {
    Preview: () => (
      <div className="pg-variant-grid" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <NavItem label="Catalog" icon={<StarIcon />} current />
        <NavItem label="Docs" icon={<StarIcon />} />
        <NavItem label="Settings" icon={<StarIcon />} disabled />
      </div>
    ),
  },
  breadcrumb: {
    Preview: () => (
      <Breadcrumb
        items={[
          { id: "home", label: "Home", href: "#" },
          { id: "lib", label: "Library", href: "#" },
          { id: "comp", label: "Components", current: true },
        ]}
      />
    ),
  },
  "navigation-drawer": {
    Preview: () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open menu
          </Button>
          <NavigationDrawer
            open={open}
            onOpenChange={setOpen}
            label="Mobile navigation"
            header={<Brand label="DevKit" layout="lockup" size="sm" />}
            closeControl={
              <IconButton label="Close" icon={<MoreIcon />} onClick={() => setOpen(false)} />
            }
          >
            <NavItem label="Catalog" current onClick={() => setOpen(false)} />
            <NavItem label="Docs" onClick={() => setOpen(false)} />
          </NavigationDrawer>
        </>
      );
    },
  },
  navbar: {
    Preview: () => (
      <Navbar
        brand={<Brand label="DevKit" layout="lockup" size="sm" />}
        primary={
          <>
            <NavItem label="Catalog" current />
            <NavItem label="Docs" />
          </>
        }
        actions={<Button size="sm" variant="secondary">Accent</Button>}
        account={<Avatar label="You" initials="YO" size={32} />}
      />
    ),
    Mini: () => (
      <Navbar
        layout="minimal"
        density="compact"
        brand={<Brand label="DevKit" layout="wordmark" size="sm" />}
      />
    ),
  },
  "nav-actions": {
    Preview: () => (
      <NavActions label="Utility navigation" density="standard">
        <NavActions.Item>
          <ThemeToggle appearance="system" themes={DEFAULT_THEMES} size="sm" />
        </NavActions.Item>
        <NavActions.Item>
          <NavItem label="GitHub" href="https://github.com/Roboticela/DevKit" external size="md" />
        </NavActions.Item>
      </NavActions>
    ),
    Mini: () => (
      <NavActions label="Utilities" density="compact">
        <NavActions.Item>
          <NavItem label="Docs" size="sm" />
        </NavActions.Item>
        <NavActions.Item>
          <NavItem label="GitHub" size="sm" />
        </NavActions.Item>
      </NavActions>
    ),
  },
  "theme-toggle": {
    Preview: () => {
      const [appearance, setAppearance] = useState<"system" | "light" | "dark">("system");
      const [theme, setTheme] = useState("default");
      return (
        <ThemeToggle
          appearance={appearance}
          onAppearanceChange={setAppearance}
          theme={theme}
          onThemeChange={setTheme}
          themes={DEFAULT_THEMES}
          primaryColor="var(--color-accent-primary, #0071e3)"
          colorPalette={
            <ColorPalette
              label="Accent color"
              variant="grid"
              size="sm"
              colors={[
                { id: "blue", label: "Blue", color: "#0071e3" },
                { id: "green", label: "Green", color: "#30d158" },
                { id: "orange", label: "Orange", color: "#ff9500" },
                { id: "rose", label: "Rose", color: "#ff2d55" },
                { id: "violet", label: "Violet", color: "#af52de" },
                { id: "teal", label: "Teal", color: "#40c8e0" },
              ]}
              defaultValue="blue"
            />
          }
        />
      );
    },
  },
  "color-palette": {
    Preview: () => (
      <ColorPalette
        variant="popover"
        triggerLabel="Colors"
        colors={[
          { id: "blue", label: "Blue", color: "#0071e3" },
          { id: "green", label: "Green", color: "#30d158" },
          { id: "orange", label: "Orange", color: "#ff9500" },
          { id: "rose", label: "Rose", color: "#ff2d55" },
          { id: "violet", label: "Violet", color: "#af52de" },
          { id: "teal", label: "Teal", color: "#40c8e0" },
        ]}
        defaultValue="blue"
      />
    ),
    Mini: () => (
      <ColorPalette
        colors={[
          { id: "blue", label: "Blue", color: "#0071e3" },
          { id: "green", label: "Green", color: "#30d158" },
          { id: "orange", label: "Orange", color: "#ff9500" },
        ]}
        defaultValue="blue"
        size="sm"
      />
    ),
  },
};

export function getPreview(name: string): PreviewEntry | undefined {
  return PREVIEWS[name];
}

export function PreviewFallback({ children }: { children?: ReactNode }) {
  return <Caption>{children ?? "No preview available for this package yet."}</Caption>;
}
