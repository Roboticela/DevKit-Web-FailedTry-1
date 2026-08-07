import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { PlaygroundToolbar } from "./PlaygroundToolbar";
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
import { Tabs } from "../../registry/components/tabs/vite-express-tauri/v1/files/src/components/ui/Tabs";
import type {
  TabsActivation,
  TabsIndicator,
} from "../../registry/components/tabs/vite-express-tauri/v1/files/src/components/ui/Tabs";
import { TabBar } from "../../registry/components/tab-bar/vite-express-tauri/v1/files/src/components/ui/TabBar";
import type { TabBarPlacement } from "../../registry/components/tab-bar/vite-express-tauri/v1/files/src/components/ui/TabBar";
import { Breadcrumbs } from "../../registry/components/breadcrumbs/vite-express-tauri/v1/files/src/components/ui/Breadcrumbs";
import type { BreadcrumbsMobile } from "../../registry/components/breadcrumbs/vite-express-tauri/v1/files/src/components/ui/Breadcrumbs";
import { Pagination } from "../../registry/components/pagination/vite-express-tauri/v1/files/src/components/ui/Pagination";
import type { PaginationLayout } from "../../registry/components/pagination/vite-express-tauri/v1/files/src/components/ui/Pagination";
import { Stepper } from "../../registry/components/stepper/vite-express-tauri/v1/files/src/components/ui/Stepper";
import type {
  StepperMode,
  StepperOrientation,
} from "../../registry/components/stepper/vite-express-tauri/v1/files/src/components/ui/Stepper";
import { NavigationMenu } from "../../registry/components/navigation-menu/vite-express-tauri/v1/files/src/components/ui/NavigationMenu";
import type { NavigationMenuDensity } from "../../registry/components/navigation-menu/vite-express-tauri/v1/files/src/components/ui/NavigationMenu";
import { NavigationItem } from "../../registry/components/navigation-item/vite-express-tauri/v1/files/src/components/ui/NavigationItem";
import type { NavigationItemIndicator } from "../../registry/components/navigation-item/vite-express-tauri/v1/files/src/components/ui/NavigationItem";
import { BottomNavigation } from "../../registry/components/bottom-navigation/vite-express-tauri/v1/files/src/components/ui/BottomNavigation";
import type { BottomNavigationKeyboardBehavior } from "../../registry/components/bottom-navigation/vite-express-tauri/v1/files/src/components/ui/BottomNavigation";
import { AnchorNavigation } from "../../registry/components/anchor-navigation/vite-express-tauri/v1/files/src/components/ui/AnchorNavigation";
import type { AnchorNavigationOrientation } from "../../registry/components/anchor-navigation/vite-express-tauri/v1/files/src/components/ui/AnchorNavigation";
import { PreviousNextNavigation } from "../../registry/components/previous-next-navigation/vite-express-tauri/v1/files/src/components/ui/PreviousNextNavigation";
import type {
  PreviousNextBoundary,
  PreviousNextLayout,
} from "../../registry/components/previous-next-navigation/vite-express-tauri/v1/files/src/components/ui/PreviousNextNavigation";
import { Alert } from "../../registry/components/alert/vite-express-tauri/v1/files/src/components/ui/Alert";
import type { AlertVariant } from "../../registry/components/alert/vite-express-tauri/v1/files/src/components/ui/Alert";
import { StatusIndicator } from "../../registry/components/status-indicator/vite-express-tauri/v1/files/src/components/ui/StatusIndicator";
import type { StatusIndicatorAppearance } from "../../registry/components/status-indicator/vite-express-tauri/v1/files/src/components/ui/StatusIndicator";
import { Badge } from "../../registry/components/badge/vite-express-tauri/v1/files/src/components/ui/Badge";
import { Notification } from "../../registry/components/notification/vite-express-tauri/v1/files/src/components/ui/Notification";
import type { NotificationDensity } from "../../registry/components/notification/vite-express-tauri/v1/files/src/components/ui/Notification";
import {
  Toast,
  ToastProvider,
  useToast,
} from "../../registry/components/toast/vite-express-tauri/v1/files/src/components/ui/Toast";
import type { ToastVariant } from "../../registry/components/toast/vite-express-tauri/v1/files/src/components/ui/Toast";
import { ProgressBar } from "../../registry/components/progress-bar/vite-express-tauri/v1/files/src/components/ui/ProgressBar";
import type { ProgressBarDensity } from "../../registry/components/progress-bar/vite-express-tauri/v1/files/src/components/ui/ProgressBar";
import { ProgressCircle } from "../../registry/components/progress-circle/vite-express-tauri/v1/files/src/components/ui/ProgressCircle";
import type { ProgressCircleSize } from "../../registry/components/progress-circle/vite-express-tauri/v1/files/src/components/ui/ProgressCircle";
import { Spinner } from "../../registry/components/spinner/vite-express-tauri/v1/files/src/components/ui/Spinner";
import type { SpinnerSize } from "../../registry/components/spinner/vite-express-tauri/v1/files/src/components/ui/Spinner";
import {
  Skeleton,
  SkeletonGroup,
} from "../../registry/components/skeleton/vite-express-tauri/v1/files/src/components/ui/Skeleton";
import type { SkeletonSize } from "../../registry/components/skeleton/vite-express-tauri/v1/files/src/components/ui/Skeleton";
import { EmptyState } from "../../registry/components/empty-state/vite-express-tauri/v1/files/src/components/ui/EmptyState";
import type {
  EmptyStateSize,
  EmptyStateVariant,
} from "../../registry/components/empty-state/vite-express-tauri/v1/files/src/components/ui/EmptyState";
import { Tooltip } from "../../registry/components/tooltip/vite-express-tauri/v1/files/src/components/ui/Tooltip";
import type { TooltipPlacement } from "../../registry/components/tooltip/vite-express-tauri/v1/files/src/components/ui/Tooltip";
import { Popover } from "../../registry/components/popover/vite-express-tauri/v1/files/src/components/ui/Popover";
import type { PopoverPlacement } from "../../registry/components/popover/vite-express-tauri/v1/files/src/components/ui/Popover";
import {
  DropdownMenu,
  type DropdownMenuEntry,
  type DropdownMenuPresentation,
} from "../../registry/components/dropdown-menu/vite-express-tauri/v1/files/src/components/ui/DropdownMenu";
import {
  ContextMenu,
  type ContextMenuEntry,
} from "../../registry/components/context-menu/vite-express-tauri/v1/files/src/components/ui/ContextMenu";
import {
  Menu,
  type MenuEntry,
  type MenuSize,
} from "../../registry/components/menu/vite-express-tauri/v1/files/src/components/ui/Menu";
import { Dialog } from "../../registry/components/dialog/vite-express-tauri/v1/files/src/components/ui/Dialog";
import type { DialogSize } from "../../registry/components/dialog/vite-express-tauri/v1/files/src/components/ui/Dialog";
import { AlertDialog } from "../../registry/components/alert-dialog/vite-express-tauri/v1/files/src/components/ui/AlertDialog";
import type { AlertDialogTone } from "../../registry/components/alert-dialog/vite-express-tauri/v1/files/src/components/ui/AlertDialog";
import { Drawer } from "../../registry/components/drawer/vite-express-tauri/v1/files/src/components/ui/Drawer";
import type {
  DrawerSide,
  DrawerSize,
} from "../../registry/components/drawer/vite-express-tauri/v1/files/src/components/ui/Drawer";
import { BottomSheet } from "../../registry/components/bottom-sheet/vite-express-tauri/v1/files/src/components/ui/BottomSheet";
import type {
  BottomSheetSize,
  BottomSheetVariant,
} from "../../registry/components/bottom-sheet/vite-express-tauri/v1/files/src/components/ui/BottomSheet";
import { ModalSurface } from "../../registry/components/modal-surface/vite-express-tauri/v1/files/src/components/ui/ModalSurface";
import type {
  ModalSurfacePosition,
  ModalSurfaceSize,
} from "../../registry/components/modal-surface/vite-express-tauri/v1/files/src/components/ui/ModalSurface";
import { Card } from "../../registry/components/card/vite-express-tauri/v1/files/src/components/ui/Card";
import type {
  CardOrientation,
  CardVariant,
} from "../../registry/components/card/vite-express-tauri/v1/files/src/components/ui/Card";
import { List } from "../../registry/components/list/vite-express-tauri/v1/files/src/components/ui/List";
import type {
  ListDensity,
  ListSelectionMode,
} from "../../registry/components/list/vite-express-tauri/v1/files/src/components/ui/List";
import { ListItem } from "../../registry/components/list-item/vite-express-tauri/v1/files/src/components/ui/ListItem";
import type {
  ListItemDensity,
  ListItemLines,
} from "../../registry/components/list-item/vite-express-tauri/v1/files/src/components/ui/ListItem";
import { DataRow } from "../../registry/components/data-row/vite-express-tauri/v1/files/src/components/ui/DataRow";
import type {
  DataRowDensity,
  DataRowLayout,
} from "../../registry/components/data-row/vite-express-tauri/v1/files/src/components/ui/DataRow";
import { Avatar } from "../../registry/components/avatar/vite-express-tauri/v1/files/src/components/ui/Avatar";
import type {
  AvatarPresence,
  AvatarSize,
} from "../../registry/components/avatar/vite-express-tauri/v1/files/src/components/ui/Avatar";
import { AvatarGroup } from "../../registry/components/avatar-group/vite-express-tauri/v1/files/src/components/ui/AvatarGroup";
import type {
  AvatarGroupLayout,
  AvatarGroupSize,
} from "../../registry/components/avatar-group/vite-express-tauri/v1/files/src/components/ui/AvatarGroup";
import { KeyValuePair } from "../../registry/components/key-value-pair/vite-express-tauri/v1/files/src/components/ui/KeyValuePair";
import type {
  KeyValuePairOrientation,
} from "../../registry/components/key-value-pair/vite-express-tauri/v1/files/src/components/ui/KeyValuePair";
import { Divider } from "../../registry/components/divider/vite-express-tauri/v1/files/src/components/ui/Divider";
import type {
  DividerOrientation,
  DividerVariant,
} from "../../registry/components/divider/vite-express-tauri/v1/files/src/components/ui/Divider";
import { Timeline } from "../../registry/components/timeline/vite-express-tauri/v1/files/src/components/ui/Timeline";
import type {
  TimelineOrientation,
} from "../../registry/components/timeline/vite-express-tauri/v1/files/src/components/ui/Timeline";
import { ContentBlock } from "../../registry/components/content-block/vite-express-tauri/v1/files/src/components/ui/ContentBlock";
import type {
  ContentBlockDensity,
  ContentBlockHeaderLayout,
} from "../../registry/components/content-block/vite-express-tauri/v1/files/src/components/ui/ContentBlock";
import { Image } from "../../registry/components/image/vite-express-tauri/v1/files/src/components/ui/Image";
import type {
  ImageObjectFit,
  ImageRadius,
} from "../../registry/components/image/vite-express-tauri/v1/files/src/components/ui/Image";
import { Thumbnail } from "../../registry/components/thumbnail/vite-express-tauri/v1/files/src/components/ui/Thumbnail";
import type {
  ThumbnailAspect,
  ThumbnailSize,
} from "../../registry/components/thumbnail/vite-express-tauri/v1/files/src/components/ui/Thumbnail";
import { MediaObject } from "../../registry/components/media-object/vite-express-tauri/v1/files/src/components/ui/MediaObject";
import type {
  MediaObjectDensity,
  MediaObjectLayout,
  MediaObjectMediaPosition,
  MediaObjectMediaSize,
} from "../../registry/components/media-object/vite-express-tauri/v1/files/src/components/ui/MediaObject";
import { IconContainer } from "../../registry/components/icon-container/vite-express-tauri/v1/files/src/components/ui/IconContainer";
import type {
  IconContainerShape,
  IconContainerSize,
  IconContainerTone,
} from "../../registry/components/icon-container/vite-express-tauri/v1/files/src/components/ui/IconContainer";
import { Illustration } from "../../registry/components/illustration/vite-express-tauri/v1/files/src/components/ui/Illustration";
import type {
  IllustrationAlign,
  IllustrationFit,
  IllustrationSize,
} from "../../registry/components/illustration/vite-express-tauri/v1/files/src/components/ui/Illustration";
import { CoverMedia } from "../../registry/components/cover-media/vite-express-tauri/v1/files/src/components/ui/CoverMedia";
import type {
  CoverMediaAspect,
  CoverMediaFocal,
  CoverMediaFit,
} from "../../registry/components/cover-media/vite-express-tauri/v1/files/src/components/ui/CoverMedia";
import { MediaPreview } from "../../registry/components/media-preview/vite-express-tauri/v1/files/src/components/ui/MediaPreview";
import type {
  MediaPreviewKind,
  MediaPreviewSize,
} from "../../registry/components/media-preview/vite-express-tauri/v1/files/src/components/ui/MediaPreview";
import { ImagePlaceholder } from "../../registry/components/image-placeholder/vite-express-tauri/v1/files/src/components/ui/ImagePlaceholder";
import type {
  ImagePlaceholderAspect,
  ImagePlaceholderState,
} from "../../registry/components/image-placeholder/vite-express-tauri/v1/files/src/components/ui/ImagePlaceholder";
import { MediaOverlay } from "../../registry/components/media-overlay/vite-express-tauri/v1/files/src/components/ui/MediaOverlay";
import type {
  MediaOverlayPlacement,
  MediaOverlayProtection,
} from "../../registry/components/media-overlay/vite-express-tauri/v1/files/src/components/ui/MediaOverlay";
import {
  MediaMetadata,
  formatMediaDate,
  formatMediaDimensions,
  formatMediaDuration,
  formatMediaFileSize,
} from "../../registry/components/media-metadata/vite-express-tauri/v1/files/src/components/ui/MediaMetadata";
import type { MediaMetadataDensity } from "../../registry/components/media-metadata/vite-express-tauri/v1/files/src/components/ui/MediaMetadata";
import { Text } from "../../registry/components/text/vite-express-tauri/v1/files/src/components/ui/Text";
import type {
  TextAlign,
  TextColor,
  TextSize,
  TextWeight,
} from "../../registry/components/text/vite-express-tauri/v1/files/src/components/ui/Text";
import { Heading } from "../../registry/components/heading/vite-express-tauri/v1/files/src/components/ui/Heading";
import type {
  HeadingAlign,
  HeadingLevel,
  HeadingSize,
} from "../../registry/components/heading/vite-express-tauri/v1/files/src/components/ui/Heading";
import { Paragraph } from "../../registry/components/paragraph/vite-express-tauri/v1/files/src/components/ui/Paragraph";
import type {
  ParagraphMeasure,
  ParagraphVariant,
} from "../../registry/components/paragraph/vite-express-tauri/v1/files/src/components/ui/Paragraph";
import { Label } from "../../registry/components/label/vite-express-tauri/v1/files/src/components/ui/Label";
import type { LabelSize } from "../../registry/components/label/vite-express-tauri/v1/files/src/components/ui/Label";
import { Caption } from "../../registry/components/caption/vite-express-tauri/v1/files/src/components/ui/Caption";
import type {
  CaptionMode,
  CaptionSize,
} from "../../registry/components/caption/vite-express-tauri/v1/files/src/components/ui/Caption";
import { Link } from "../../registry/components/link/vite-express-tauri/v1/files/src/components/ui/Link";
import type { LinkVariant } from "../../registry/components/link/vite-express-tauri/v1/files/src/components/ui/Link";
import { Code } from "../../registry/components/code/vite-express-tauri/v1/files/src/components/ui/Code";
import type {
  CodeOverflow,
  CodeVariant,
} from "../../registry/components/code/vite-express-tauri/v1/files/src/components/ui/Code";
import { CodeBlock } from "../../registry/components/code-block/vite-express-tauri/v1/files/src/components/ui/CodeBlock";
import type { CodeBlockOverflow } from "../../registry/components/code-block/vite-express-tauri/v1/files/src/components/ui/CodeBlock";
import { Blockquote } from "../../registry/components/blockquote/vite-express-tauri/v1/files/src/components/ui/Blockquote";
import type { BlockquoteSize } from "../../registry/components/blockquote/vite-express-tauri/v1/files/src/components/ui/Blockquote";
import { NumberDisplay } from "../../registry/components/number-display/vite-express-tauri/v1/files/src/components/ui/NumberDisplay";
import type {
  NumberDisplayCompact,
  NumberDisplayFormat,
} from "../../registry/components/number-display/vite-express-tauri/v1/files/src/components/ui/NumberDisplay";
import { ActionButtonGroup } from "../../registry/components/action-button-group/vite-express-tauri/v1/files/src/components/ui/ActionButtonGroup";
import type {
  ActionButtonGroupDensity,
  ActionButtonGroupOrientation,
  ActionButtonGroupOverflow,
  ActionButtonGroupSeparation,
} from "../../registry/components/action-button-group/vite-express-tauri/v1/files/src/components/ui/ActionButtonGroup";
import { IconButtonGroup } from "../../registry/components/icon-button-group/vite-express-tauri/v1/files/src/components/ui/IconButtonGroup";
import type {
  IconButtonGroupDensity,
  IconButtonGroupOrientation,
  IconButtonGroupOverflow,
  IconButtonGroupSeparation,
} from "../../registry/components/icon-button-group/vite-express-tauri/v1/files/src/components/ui/IconButtonGroup";
import {
  ActionSplitButton,
  ActionSplitMenuTrigger,
} from "../../registry/components/action-split-button/vite-express-tauri/v1/files/src/components/ui/ActionSplitButton";
import type { ActionSplitButtonVariant } from "../../registry/components/action-split-button/vite-express-tauri/v1/files/src/components/ui/ActionSplitButton";
import { ActionSegmentedControl } from "../../registry/components/action-segmented-control/vite-express-tauri/v1/files/src/components/ui/ActionSegmentedControl";
import type { ActionSegmentedControlOverflow } from "../../registry/components/action-segmented-control/vite-express-tauri/v1/files/src/components/ui/ActionSegmentedControl";
import { ActionGroup } from "../../registry/components/action-group/vite-express-tauri/v1/files/src/components/ui/ActionGroup";
import type { ActionGroupOrientation } from "../../registry/components/action-group/vite-express-tauri/v1/files/src/components/ui/ActionGroup";
import { countrySelectOptions, countryDialOptions, getCountry } from "./data/countries";
import {
  evaluatePhone,
  exampleNationalNumber,
  formatNationalAsYouType,
} from "./data/phone";
import {
  AddressIcon,
  CityIcon,
  CountyIcon,
  GlobeIcon,
  PinIcon,
  PostalIcon,
  RegionIcon,
  countyFieldLabel,
  geoCityOptions,
  geoCountryOptions,
  geoCountyOptions,
  geoStateOptions,
  stateFieldLabel,
} from "./data/geo";
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

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 10.5 12 4.75l7.5 5.75V19a1.25 1.25 0 0 1-1.25 1.25H5.75A1.25 1.25 0 0 1 4.5 19v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9.5 20.25V14h5v6.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.75 7.5h14.5v9.25A1.75 1.75 0 0 1 17.5 18.5h-11A1.75 1.75 0 0 1 4.75 16.75V7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4.75 12.5h3.4l1.35 2h5l1.35-2h3.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.75 18.5c1.4-2.4 3.55-3.75 6.25-3.75s4.85 1.35 6.25 3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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
  const [phoneCountry, setPhoneCountry] = useState<string | null>("pk");
  const [phoneNational, setPhoneNational] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  const dialOptions = useMemo(() => countryDialOptions(), []);
  const phoneCountryCode = phoneCountry ?? "pk";
  const phoneEval = useMemo(
    () => evaluatePhone(phoneCountryCode, phoneNational),
    [phoneCountryCode, phoneNational]
  );
  const phonePlaceholder = exampleNationalNumber(phoneCountryCode) || "Phone number";

  const onPhoneCountryChange = (next: string | null) => {
    const code = next ?? "pk";
    setPhoneCountry(code);
    setPhoneNational((prev) => (prev ? formatNationalAsYouType(code, prev) : ""));
  };

  const onPhoneNationalChange = (next: string) => {
    setPhoneNational(formatNationalAsYouType(phoneCountryCode, next));
  };

  const phoneValidation =
    !phoneTouched && phoneEval.state !== "valid"
      ? "none"
      : phoneEval.state === "valid"
        ? "success"
        : phoneEval.state === "invalid"
          ? "error"
          : phoneEval.state === "incomplete" && phoneTouched
            ? "warning"
            : "none";

  return (
    <section className="catalog-group" aria-labelledby="input-group-lab-heading">
      <h2 id="input-group-lab-heading">020 Input Group</h2>
      <p className="catalog-group-desc">
        Joins an input with related prefixes, suffixes, icons, units, or actions.
        Shared shell when attached; each interactive child keeps its own focus and
        accessibility. Not a generic layout tool.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Phone — country code + number</h3>
        <InputGroup
          label="Mobile number"
          description="Dial code Select + national number — formatted and validated with libphonenumber-js"
          required
          validation={phoneValidation}
          errorMessage={phoneValidation === "error" ? phoneEval.message ?? undefined : undefined}
          warningMessage={
            phoneValidation === "warning" ? phoneEval.message ?? undefined : undefined
          }
          successMessage={
            phoneValidation === "success" ? phoneEval.message ?? undefined : undefined
          }
          helpText={
            phoneValidation === "none"
              ? "Brackets and spacing appear as you type for the selected country"
              : undefined
          }
        >
          <InputGroup.Input className="dk-input-group__input--dial">
            <Select
              label="Country calling code"
              hideLabel
              presentation="listbox"
              searchable
              searchPlaceholder="Search country or code…"
              options={dialOptions}
              value={phoneCountry}
              onValueChange={onPhoneCountryChange}
              listLabel="Country calling code"
              menuMinWidth={280}
            />
          </InputGroup.Input>
          <InputGroup.Input className="dk-input-group__input--phone">
            <TextInput
              label="Phone number"
              hideLabel
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={phoneNational}
              onValueChange={onPhoneNationalChange}
              onBlur={() => setPhoneTouched(true)}
              placeholder={phonePlaceholder}
              clearable
            />
          </InputGroup.Input>
        </InputGroup>
      </div>

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
          description="All countries — searchable listbox with flags in the list and trigger"
          helpText={
            selectedCountry
              ? `Selected: ${selectedCountry.name}`
              : "Search or scroll — 250 countries"
          }
          options={COUNTRY_OPTIONS}
          value={country}
          onValueChange={setCountry}
          clearable
          presentation="listbox"
          searchable
          searchPlaceholder="Search countries…"
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
          label="Timezone"
          presentation="listbox"
          description="Custom listbox — same chrome as Theme and Country"
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
          description="Scrollable searchable listbox with viewport clamping"
          options={LARGE_OPTIONS}
          defaultValue="opt-12"
          searchable
          searchPlaceholder="Filter options…"
        />
        <Select
          label="Disabled"
          options={COUNTRY_OPTIONS}
          defaultValue="ae"
          disabled
          searchable
        />
        <Select
          label="Success"
          options={COUNTRY_OPTIONS}
          defaultValue="pk"
          validation="success"
          successMessage="Country saved"
          searchable
          searchPlaceholder="Search countries…"
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

const GEO_COUNTRY_OPTIONS = geoCountryOptions();

function AddressLocationLab() {
  const [country, setCountry] = useState<string | null>("PK");
  const [region, setRegion] = useState<string | null>(null);
  const [county, setCounty] = useState<string | null>(null);
  const [countyInput, setCountyInput] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState("");
  const [street, setStreet] = useState("");
  const [line2, setLine2] = useState("");
  const [postal, setPostal] = useState("");

  const regionOptions = useMemo(() => geoStateOptions(country), [country]);
  const countyOptions = useMemo(
    () => geoCountyOptions(country, region),
    [country, region]
  );
  const cityOptions = useMemo(
    () => geoCityOptions(country, region),
    [country, region]
  );

  const onCountryChange = (next: string | null) => {
    setCountry(next);
    setRegion(null);
    setCounty(null);
    setCountyInput("");
    setCity(null);
    setCityInput("");
  };

  const onRegionChange = (next: string | null) => {
    setRegion(next);
    setCounty(null);
    setCountyInput("");
    setCity(null);
    setCityInput("");
  };

  const regionLabel = stateFieldLabel(country);
  const countyLabel = countyFieldLabel(country);
  const selectedCountry = GEO_COUNTRY_OPTIONS.find((c) => c.value === country);
  const selectedRegion = regionOptions.find((r) => r.value === region);
  const selectedCity = cityOptions.find((c) => c.value === city);

  return (
    <section className="catalog-group" aria-labelledby="address-location-lab-heading">
      <h2 id="address-location-lab-heading">Address &amp; location</h2>
      <p className="catalog-group-desc">
        Cascading country → {regionLabel.toLowerCase()} → {countyLabel.toLowerCase()} →
        city, powered by <code>country-state-city</code> (all countries, regions, and
        cities). Searchable Selects and Comboboxes with icons; county/district also
        allows a custom value when your locale needs one.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Full address cascade</h3>
        <Select
          label="Country"
          description={`${GEO_COUNTRY_OPTIONS.length} countries`}
          presentation="listbox"
          searchable
          searchPlaceholder="Search countries…"
          options={GEO_COUNTRY_OPTIONS}
          value={country}
          onValueChange={onCountryChange}
          clearable
          leadingIcon={<GlobeIcon />}
          required
        />
        <Select
          label={regionLabel}
          description={
            country
              ? `${regionOptions.length} regions in ${selectedCountry?.label ?? country}`
              : "Choose a country first"
          }
          presentation="listbox"
          searchable
          searchPlaceholder={`Search ${regionLabel.toLowerCase()}…`}
          options={regionOptions}
          value={region}
          onValueChange={onRegionChange}
          clearable
          disabled={!country || regionOptions.length === 0}
          leadingIcon={<RegionIcon />}
          placeholder={
            !country
              ? "Select a country…"
              : regionOptions.length === 0
                ? "No regions for this country"
                : "Select…"
          }
        />
        <Combobox
          label={countyLabel}
          description="Optional — type a county or district (not always in the geo dataset)"
          options={countyOptions}
          value={county}
          onValueChange={setCounty}
          inputValue={countyInput}
          onInputChange={setCountyInput}
          allowsCustomValue
          clearable
          leadingIcon={<CountyIcon />}
          placeholder="County / district"
          disabled={!country}
          helpText={
            county || countyInput
              ? `County: ${countyOptions.find((o) => o.value === county)?.label ?? county ?? countyInput}`
              : "Regions that are counties (e.g. UK) are listed in the field above"
          }
        />
        <Combobox
          label="City / town"
          description={
            country
              ? `${cityOptions.length} cities${
                  selectedRegion ? ` in ${selectedRegion.label}` : " in country"
                }`
              : "Choose a country first"
          }
          options={cityOptions}
          value={city}
          onValueChange={setCity}
          inputValue={cityInput}
          onInputChange={setCityInput}
          clearable
          leadingIcon={<CityIcon />}
          placeholder="Search cities…"
          disabled={!country}
          noResultsLabel="No cities match"
          helpText={
            selectedCity
              ? `City: ${selectedCity.label}`
              : cityOptions.length > 500
                ? "Large list — type to filter"
                : undefined
          }
        />
        <TextInput
          label="Street address"
          description="Building, street, and number"
          value={street}
          onValueChange={setStreet}
          placeholder="123 Main Street"
          leadingIcon={<AddressIcon />}
          clearable
        />
        <TextInput
          label="Apartment, suite, unit"
          optional
          value={line2}
          onValueChange={setLine2}
          placeholder="Apt / suite / floor"
          leadingIcon={<PinIcon />}
          clearable
        />
        <TextInput
          label="Postal / ZIP code"
          value={postal}
          onValueChange={setPostal}
          placeholder="Postal code"
          leadingIcon={<PostalIcon />}
          clearable
          autoComplete="postal-code"
        />
        <p className="catalog-group-meta">
          {[
            street || null,
            line2 || null,
            selectedCity?.label || cityInput || null,
            (countyOptions.find((o) => o.value === county)?.label ??
              county ??
              countyInput) || null,
            selectedRegion?.label || null,
            selectedCountry?.label || null,
            postal || null,
          ]
            .filter(Boolean)
            .join(", ") || "Address summary appears as you fill the fields"}
        </p>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">City Combobox only (all in country)</h3>
        <CountryCityComboboxDemo />
      </div>
    </section>
  );
}

function CountryCityComboboxDemo() {
  const [country, setCountry] = useState<string | null>("PK");
  const [city, setCity] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState("");
  const cities = useMemo(() => geoCityOptions(country, null), [country]);

  useEffect(() => {
    setCity(null);
    setCityInput("");
  }, [country]);

  return (
    <>
      <Select
        label="Country"
        presentation="listbox"
        searchable
        options={GEO_COUNTRY_OPTIONS}
        value={country}
        onValueChange={setCountry}
        leadingIcon={<GlobeIcon />}
      />
      <Combobox
        label="City"
        description={`All ${cities.length} cities in this country — type to filter`}
        options={cities}
        value={city}
        onValueChange={setCity}
        inputValue={cityInput}
        onInputChange={setCityInput}
        leadingIcon={<CityIcon />}
        clearable
        placeholder="Search all cities…"
      />
    </>
  );
}

const CITY_DB = geoCityOptions("PK", null);

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
          label="City (Pakistan — async filter demo)"
          description={`Simulated remote filter over ${CITY_DB.length} cities — loading slot reserved`}
          filter={false}
          options={cityOptions}
          loading={cityLoading}
          value={city}
          onValueChange={setCity}
          inputValue={cityInput}
          onInputChange={onCityInput}
          leadingIcon={<CityIcon />}
          noResultsLabel="No cities match that query"
          helpText={city ? `Selected: ${city}` : undefined}
          clearable
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

function TabsLab() {
  const [section, setSection] = useState("overview");
  const [indicator, setIndicator] = useState<TabsIndicator>("underline");
  const [activation, setActivation] = useState<TabsActivation>("automatic");
  const [scrollTab, setScrollTab] = useState("tab-1");

  return (
    <section className="catalog-group" aria-labelledby="tabs-lab-heading">
      <h2 id="tabs-lab-heading">031 Tabs</h2>
      <p className="catalog-group-desc">
        Related peer views in one context — not site-wide navigation. Default
        horizontal with scroll on narrow widths; wrap only when configured. Active
        state uses underline, surface, or pill — never color alone.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Basic + indicators</h3>
        <SegmentedControl
          label="Indicator"
          options={[
            { id: "underline", label: "Underline" },
            { id: "surface", label: "Surface" },
            { id: "pill", label: "Pill" },
          ]}
          value={indicator}
          onValueChange={(id) => setIndicator(id as TabsIndicator)}
        />
        <Tabs
          label="Project sections"
          indicator={indicator}
          activation={activation}
          value={section}
          onValueChange={setSection}
          items={[
            {
              id: "overview",
              label: "Overview",
              panel: (
                <p style={{ margin: 0 }}>
                  High-level summary of the project health, owners, and recent
                  activity.
                </p>
              ),
            },
            {
              id: "activity",
              label: "Activity",
              icon: <ListIcon />,
              panel: (
                <p style={{ margin: 0 }}>
                  Timeline of commits, comments, and status changes for this
                  workspace.
                </p>
              ),
            },
            {
              id: "files",
              label: "Files",
              icon: <GridIcon />,
              panel: (
                <p style={{ margin: 0 }}>
                  Documents and assets attached to this project context.
                </p>
              ),
            },
            {
              id: "settings",
              label: "Settings",
              disabled: true,
              panel: <p style={{ margin: 0 }}>Disabled destination.</p>,
            },
            {
              id: "sync",
              label: "Sync",
              loading: true,
              panel: <p style={{ margin: 0 }}>Loading tab cannot activate.</p>,
            },
          ]}
        />
        <p className="catalog-group-meta">Active: {section}</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Activation model</h3>
        <SegmentedControl
          label="Activation"
          options={[
            { id: "automatic", label: "Automatic" },
            { id: "manual", label: "Manual" },
          ]}
          value={activation}
          onValueChange={(id) => setActivation(id as TabsActivation)}
        />
        <Tabs
          label="Manual vs automatic demo"
          indicator="underline"
          activation={activation}
          defaultValue="general"
          items={[
            {
              id: "general",
              label: "General",
              panel: (
                <p style={{ margin: 0 }}>
                  {activation === "manual"
                    ? "Arrow keys move focus; Enter or Space activates."
                    : "Arrow keys move focus and activate immediately."}
                </p>
              ),
            },
            {
              id: "privacy",
              label: "Privacy",
              panel: <p style={{ margin: 0 }}>Privacy preferences for this account.</p>,
            },
            {
              id: "notify",
              label: "Notifications",
              panel: <p style={{ margin: 0 }}>Email and push notification controls.</p>,
            },
          ]}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">Scrollable (narrow)</h3>
        <Tabs
          label="Many related views"
          overflow="scroll"
          indicator="underline"
          value={scrollTab}
          onValueChange={setScrollTab}
          items={Array.from({ length: 10 }, (_, i) => ({
            id: `tab-${i + 1}`,
            label: `Section ${String(i + 1).padStart(2, "0")}`,
            panel: (
              <p style={{ margin: 0 }}>
                Panel for section {i + 1}. Labels stay readable; the list scrolls
                horizontally instead of wrapping.
              </p>
            ),
          }))}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Icon-only + wrap</h3>
        <Tabs
          label="View mode"
          indicator="pill"
          overflow="wrap"
          defaultValue="list"
          items={[
            {
              id: "list",
              label: "List view",
              icon: <ListIcon />,
              iconOnly: true,
              panel: <p style={{ margin: 0 }}>List layout for dense scanning.</p>,
            },
            {
              id: "grid",
              label: "Grid view",
              icon: <GridIcon />,
              iconOnly: true,
              panel: <p style={{ margin: 0 }}>Grid layout for visual browsing.</p>,
            },
            {
              id: "board",
              label: "Board view",
              icon: <EditIcon />,
              iconOnly: true,
              panel: <p style={{ margin: 0 }}>Board columns for workflow status.</p>,
            },
          ]}
        />
      </div>
    </section>
  );
}

function TabBarLab() {
  const [dest, setDest] = useState("home");
  const [placement, setPlacement] = useState<TabBarPlacement>("contextual");

  return (
    <section className="catalog-group" aria-labelledby="tab-bar-lab-heading">
      <h2 id="tab-bar-lab-heading">032 Tab Bar</h2>
      <p className="catalog-group-desc">
        Persistent primary destinations (2–5) in a bounded app — related to Tabs,
        optimized for navigation. Icons reinforce labels; badges carry counts.
        Bottom placement respects safe-area insets without fighting system gestures.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Placement</h3>
        <SegmentedControl
          label="Placement"
          options={[
            { id: "contextual", label: "Contextual" },
            { id: "bottom", label: "Bottom" },
            { id: "top", label: "Top" },
            { id: "auto", label: "Auto" },
          ]}
          value={placement}
          onValueChange={(id) => setPlacement(id as TabBarPlacement)}
        />
        <div
          style={{
            position: "relative",
            minHeight: placement === "bottom" || placement === "auto" ? "12rem" : undefined,
            border: "1px solid var(--color-border-default, #d2d2d7)",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {(placement === "top" || placement === "auto") && (
            <TabBar
              label="Primary"
              placement={placement === "auto" ? "top" : placement}
              safeArea={false}
              value={dest}
              onValueChange={setDest}
              items={[
                { id: "home", label: "Home", icon: <HomeIcon /> },
                { id: "search", label: "Search", icon: <SearchIcon /> },
                { id: "inbox", label: "Inbox", icon: <InboxIcon />, badge: 3 },
                { id: "profile", label: "Profile", icon: <ProfileIcon /> },
              ]}
            />
          )}
          <div style={{ flex: 1, padding: "16px" }}>
            <p className="catalog-group-meta" style={{ margin: 0 }}>
              Active destination: <strong>{dest}</strong>
            </p>
            <p style={{ margin: "8px 0 0", color: "var(--color-text-secondary, #6e6e73)" }}>
              Compact chrome for Home, Search, Inbox, and Profile — not for unrelated
              actions.
            </p>
          </div>
          {(placement === "bottom" || placement === "contextual") && (
            <TabBar
              label="Primary"
              placement={placement}
              safeArea={placement === "bottom"}
              value={dest}
              onValueChange={setDest}
              items={[
                { id: "home", label: "Home", icon: <HomeIcon /> },
                { id: "search", label: "Search", icon: <SearchIcon /> },
                { id: "inbox", label: "Inbox", icon: <InboxIcon />, badge: 12 },
                { id: "profile", label: "Profile", icon: <ProfileIcon /> },
                {
                  id: "more",
                  label: "More",
                  icon: <MoreIcon />,
                  disabled: true,
                },
              ]}
            />
          )}
        </div>
      </div>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">Three destinations</h3>
        <TabBar
          label="Workspace"
          placement="contextual"
          defaultValue="work"
          items={[
            { id: "work", label: "Work", icon: <GridIcon /> },
            { id: "list", label: "List", icon: <ListIcon />, badge: "9+" },
            { id: "you", label: "You", icon: <ProfileIcon /> },
          ]}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">Icon-only (clear meanings)</h3>
        <TabBar
          label="Views"
          placement="contextual"
          defaultValue="home"
          items={[
            { id: "home", label: "Home", icon: <HomeIcon />, iconOnly: true },
            { id: "search", label: "Search", icon: <SearchIcon />, iconOnly: true },
            {
              id: "inbox",
              label: "Inbox",
              icon: <InboxIcon />,
              iconOnly: true,
              badge: 2,
            },
          ]}
        />
      </div>
    </section>
  );
}

function BreadcrumbsLab() {
  const [last, setLast] = useState("—");
  const [mobile, setMobile] = useState<BreadcrumbsMobile>("full");

  const longTrail = [
    { id: "home", label: "Home", href: "#home" },
    { id: "catalog", label: "Catalog", href: "#catalog" },
    { id: "electronics", label: "Electronics", href: "#electronics" },
    { id: "audio", label: "Audio", href: "#audio" },
    { id: "headphones", label: "Headphones", href: "#headphones" },
    { id: "current", label: "Studio Pro Wireless" },
  ];

  return (
    <section className="catalog-group" aria-labelledby="breadcrumbs-lab-heading">
      <h2 id="breadcrumbs-lab-heading">033 Breadcrumbs</h2>
      <p className="catalog-group-desc">
        Hierarchical location — linked ancestors, non-linked current page, quiet
        separators. Long paths collapse intermediate levels into a discoverable
        overflow menu rather than clipping without recovery.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Basic</h3>
        <h1 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 600 }}>
          Studio Pro Wireless
        </h1>
        <Breadcrumbs
          showHomeIcon
          onItemNavigate={(item) => setLast(item.label)}
          items={[
            { id: "home", label: "Home", href: "#home" },
            { id: "products", label: "Products", href: "#products" },
            { id: "audio", label: "Audio", href: "#audio" },
            { id: "current", label: "Studio Pro Wireless" },
          ]}
        />
        <p className="catalog-group-meta">Last ancestor activated: {last}</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Long path + overflow</h3>
        <Breadcrumbs
          showHomeIcon
          collapse="auto"
          maxVisible={4}
          itemsAfterCollapse={2}
          onItemNavigate={(item) => setLast(item.label)}
          items={longTrail}
        />
        <p className="catalog-group-meta">
          Opens as Home › … › Headphones › Studio Pro Wireless — use … to reach
          hidden ancestors.
        </p>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Mobile presentations</h3>
        <SegmentedControl
          label="Mobile mode"
          options={[
            { id: "full", label: "Full" },
            { id: "ancestor", label: "Ancestor" },
            { id: "back", label: "Back" },
          ]}
          value={mobile}
          onValueChange={(id) => setMobile(id as BreadcrumbsMobile)}
        />
        <Breadcrumbs
          mobile={mobile}
          showHomeIcon
          onItemNavigate={(item) => setLast(item.label)}
          items={[
            { id: "home", label: "Home", href: "#home" },
            { id: "products", label: "Products", href: "#products" },
            { id: "current", label: "Studio Pro Wireless" },
          ]}
        />
      </div>
    </section>
  );
}

function PaginationLab() {
  const [page, setPage] = useState(4);
  const [pageLarge, setPageLarge] = useState(12);
  const [layout, setLayout] = useState<PaginationLayout>("expanded");
  const [pageSize, setPageSize] = useState<string | null>("10");

  return (
    <section className="catalog-group" aria-labelledby="pagination-lab-heading">
      <h2 id="pagination-lab-heading">034 Pagination</h2>
      <p className="catalog-group-desc">
        Navigate finite multi-page collections. Large page counts collapse with
        ellipses. Compact mode shows Previous · Page X of N · Next on narrow
        layouts. Previous/Next keep their meaning in RTL.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <h3 className="catalog-subgroup-title">Expanded</h3>
        <Pagination
          page={page}
          pageCount={12}
          onPageChange={setPage}
          layout="expanded"
          showFirstLast
        />
        <p className="catalog-group-meta">Page {page} of 12</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <h3 className="catalog-subgroup-title">Large set (collapsed numbers)</h3>
        <Pagination
          page={pageLarge}
          pageCount={50}
          onPageChange={setPageLarge}
          layout="expanded"
          showFirstLast
        />
        <p className="catalog-group-meta">Page {pageLarge} of 50</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Layout</h3>
        <SegmentedControl
          label="Layout"
          options={[
            { id: "expanded", label: "Expanded" },
            { id: "compact", label: "Compact" },
            { id: "auto", label: "Auto" },
          ]}
          value={layout}
          onValueChange={(id) => setLayout(id as PaginationLayout)}
        />
        <Pagination
          page={page}
          pageCount={20}
          onPageChange={setPage}
          layout={layout}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <h3 className="catalog-subgroup-title">With page-size composition</h3>
        <Pagination
          page={page}
          pageCount={20}
          onPageChange={setPage}
          layout="expanded"
          pageSizeControl={
            <Select
              label="Rows per page"
              hideLabel
              presentation="listbox"
              options={[
                { value: "10", label: "10 / page" },
                { value: "25", label: "25 / page" },
                { value: "50", label: "50 / page" },
              ]}
              value={pageSize}
              onValueChange={setPageSize}
              searchable={false}
            />
          }
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Disabled edges</h3>
        <Pagination page={1} pageCount={8} onPageChange={() => {}} layout="expanded" />
        <Pagination
          page={8}
          pageCount={8}
          onPageChange={() => {}}
          layout="compact"
        />
      </div>
    </section>
  );
}

function SettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3.75v2.5M12 17.75v2.5M3.75 12h2.5M17.75 12h2.5M6.4 6.4l1.77 1.77M15.83 15.83l1.77 1.77M17.6 6.4l-1.77 1.77M8.17 15.83l-1.77 1.77"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StepperLab() {
  const [step, setStep] = useState("shipping");
  const [orientation, setOrientation] = useState<StepperOrientation>("horizontal");
  const [mode, setMode] = useState<StepperMode>("linear");

  return (
    <section className="catalog-group" aria-labelledby="stepper-lab-heading">
      <h2 id="stepper-lab-heading">035 Stepper</h2>
      <p className="catalog-group-desc">
        Ordered stages for workflows and setup. Completed is explicit — not merely
        visited. Linear blocks future steps; non-linear allows jumping. Set{" "}
        <code>interactive=&#123;false&#125;</code> for informational progress.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <h3 className="catalog-subgroup-title">Checkout (linear)</h3>
        <SegmentedControl
          label="Orientation"
          options={[
            { id: "horizontal", label: "Horizontal" },
            { id: "vertical", label: "Vertical" },
            { id: "compact", label: "Compact" },
            { id: "auto", label: "Auto" },
          ]}
          value={orientation}
          onValueChange={(id) => setOrientation(id as StepperOrientation)}
        />
        <Stepper
          label="Checkout"
          orientation={orientation}
          mode="linear"
          value={step}
          onValueChange={setStep}
          steps={[
            {
              id: "cart",
              label: "Cart",
              description: "Review items",
            },
            {
              id: "shipping",
              label: "Shipping",
              description: "Address & method",
            },
            {
              id: "payment",
              label: "Payment",
              description: "Billing details",
            },
            {
              id: "review",
              label: "Review",
              description: "Confirm order",
            },
          ]}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Button
            type="button"
            variant="secondary"
            disabled={step === "cart"}
            onClick={() => {
              const order = ["cart", "shipping", "payment", "review"];
              const i = order.indexOf(step);
              if (i > 0) setStep(order[i - 1]!);
            }}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={step === "review"}
            onClick={() => {
              const order = ["cart", "shipping", "payment", "review"];
              const i = order.indexOf(step);
              if (i < order.length - 1) setStep(order[i + 1]!);
            }}
          >
            Continue
          </Button>
        </div>
        <p className="catalog-group-meta">Current: {step}</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <h3 className="catalog-subgroup-title">Non-linear + error</h3>
        <SegmentedControl
          label="Mode"
          options={[
            { id: "linear", label: "Linear" },
            { id: "non-linear", label: "Non-linear" },
          ]}
          value={mode}
          onValueChange={(id) => setMode(id as StepperMode)}
        />
        <Stepper
          label="Account setup"
          orientation="horizontal"
          mode={mode}
          defaultValue="profile"
          steps={[
            { id: "account", label: "Account" },
            { id: "profile", label: "Profile" },
            {
              id: "security",
              label: "Security",
              description: "Fix verification",
              status: "error",
            },
            { id: "done", label: "Done", disabled: true },
          ]}
        />
      </div>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <h3 className="catalog-subgroup-title">Informational only</h3>
        <Stepper
          label="Sync progress"
          interactive={false}
          orientation="vertical"
          value="upload"
          steps={[
            { id: "prepare", label: "Prepare files", status: "completed" },
            { id: "upload", label: "Upload", status: "current", description: "In progress" },
            { id: "verify", label: "Verify", status: "upcoming" },
          ]}
        />
      </div>
    </section>
  );
}

function NavigationMenuLab() {
  const [active, setActive] = useState("home");
  const [density, setDensity] = useState<NavigationMenuDensity>("expanded");

  return (
    <section className="catalog-group" aria-labelledby="nav-menu-lab-heading">
      <h2 id="nav-menu-lab-heading">036 Navigation Menu</h2>
      <p className="catalog-group-desc">
        Hierarchical destinations — shell-independent. Compose inside your own
        sidebar, drawer, or sheet. Depth via indent and type; expand branches with
        chevrons or arrow keys. Recommended ≤ 3 visible levels.
      </p>

      <div className="lab-block" style={{ maxWidth: "18rem" }}>
        <h3 className="catalog-subgroup-title">Workspace</h3>
        <SegmentedControl
          label="Density"
          options={[
            { id: "expanded", label: "Expanded" },
            { id: "collapsed", label: "Collapsed" },
          ]}
          value={density}
          onValueChange={(id) => setDensity(id as NavigationMenuDensity)}
        />
        <NavigationMenu
          label="Workspace"
          density={density}
          value={active}
          onValueChange={setActive}
          groups={[
            {
              id: "main",
              label: "Main",
              items: [
                { id: "home", label: "Home", icon: <HomeIcon />, href: "#home" },
                {
                  id: "projects",
                  label: "Projects",
                  icon: <GridIcon />,
                  defaultExpanded: true,
                  children: [
                    { id: "active", label: "Active", href: "#active" },
                    {
                      id: "archived",
                      label: "Archived",
                      children: [
                        { id: "2024", label: "2024", href: "#2024" },
                        { id: "2023", label: "2023", href: "#2023" },
                      ],
                    },
                  ],
                },
                {
                  id: "inbox",
                  label: "Inbox",
                  icon: <InboxIcon />,
                  badge: 12,
                  href: "#inbox",
                },
              ],
            },
            {
              id: "account",
              label: "Account",
              items: [
                {
                  id: "profile",
                  label: "Profile",
                  icon: <ProfileIcon />,
                  href: "#profile",
                },
                {
                  id: "settings",
                  label: "Settings",
                  icon: <SettingsIcon />,
                  badge: { label: "New", tone: "accent" },
                  href: "#settings",
                },
                {
                  id: "billing",
                  label: "Billing",
                  icon: <SettingsIcon />,
                  disabled: true,
                },
              ],
            },
          ]}
        />
        <p className="catalog-group-meta">Active: {active}</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "18rem" }}>
        <h3 className="catalog-subgroup-title">Host drawer mock (same data)</h3>
        <p className="catalog-group-desc">
          The menu does not own drawer chrome — this bordered region stands in for
          a host sheet.
        </p>
        <div
          style={{
            border: "1px solid var(--color-border-default, #d2d2d7)",
            borderRadius: 8,
            padding: 8,
            maxHeight: 320,
            overflow: "auto",
          }}
        >
          <NavigationMenu
            label="Mobile destinations"
            size="sm"
            defaultValue="home"
            items={[
              { id: "home", label: "Home", icon: <HomeIcon />, href: "#m-home" },
              { id: "inbox", label: "Inbox", icon: <InboxIcon />, badge: 3 },
              {
                id: "more",
                label: "More",
                icon: <GridIcon />,
                defaultExpanded: true,
                children: [
                  { id: "team", label: "Team" },
                  { id: "help", label: "Help" },
                ],
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function NavigationItemLab() {
  const [active, setActive] = useState("home");
  const [moreOpen, setMoreOpen] = useState(false);
  const [indicator, setIndicator] =
    useState<NavigationItemIndicator>("start");

  return (
    <section className="catalog-group" aria-labelledby="nav-item-lab-heading">
      <h2 id="nav-item-lab-heading">037 Navigation Item</h2>
      <p className="catalog-group-desc">
        Atomic destination — link for URLs, expandable for submenus, selectable
        button for SPA hosts. Not for arbitrary actions (use Button). Full labels
        stay discoverable when truncated via <code>title</code>.
      </p>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">States &amp; composition</h3>
        <SegmentedControl
          label="Active indicator"
          options={[
            { id: "start", label: "Start" },
            { id: "underline", label: "Underline" },
            { id: "none", label: "None" },
          ]}
          value={indicator}
          onValueChange={(id) => setIndicator(id as NavigationItemIndicator)}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <NavigationItem
            label="Home"
            icon={<HomeIcon />}
            href="#ni-home"
            active={active === "home"}
            indicator={indicator}
            onSelect={() => setActive("home")}
          />
          <NavigationItem
            label="Inbox"
            description="Unread messages"
            icon={<InboxIcon />}
            badge={12}
            href="#ni-inbox"
            active={active === "inbox"}
            indicator={indicator}
            onSelect={() => setActive("inbox")}
          />
          <NavigationItem
            label="Projects"
            icon={<GridIcon />}
            expandable
            expanded={moreOpen}
            onExpandedChange={setMoreOpen}
            indicator={indicator}
          />
          {moreOpen ? (
            <div style={{ paddingInlineStart: 16 }}>
              <NavigationItem
                label="Active"
                href="#ni-active"
                size="sm"
                indicator={indicator}
                active={active === "active"}
                onSelect={() => setActive("active")}
              />
              <NavigationItem
                label="Archived"
                href="#ni-archived"
                size="sm"
                indicator={indicator}
                active={active === "archived"}
                onSelect={() => setActive("archived")}
              />
            </div>
          ) : null}
          <NavigationItem
            label="Documentation"
            icon={<SettingsIcon />}
            href="https://example.com"
            external
            indicator={indicator}
          />
          <NavigationItem
            label="Billing"
            icon={<ProfileIcon />}
            disabled
            indicator={indicator}
          />
          <NavigationItem
            label="Visited docs"
            href="#ni-visited"
            visited
            indicator={indicator}
          />
        </div>
        <p className="catalog-group-meta">Active: {active}</p>
      </div>

      <div className="lab-block" style={{ maxWidth: "22rem" }}>
        <h3 className="catalog-subgroup-title">Multiline &amp; truncate</h3>
        <NavigationItem
          label="Einstellungen für Benachrichtigungen und Privatsphäre"
          description="Localized long label wraps instead of clipping silently"
          layout="multiline"
          icon={<SettingsIcon />}
          href="#ni-settings"
        />
        <NavigationItem
          label="Very long single-line destination that needs discovery"
          truncate
          icon={<InboxIcon />}
          href="#ni-long"
          badge={{ label: "New", tone: "accent" }}
          style={{ marginTop: 8 }}
        />
      </div>
    </section>
  );
}

function BottomNavigationLab() {
  const [active, setActive] = useState("home");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardBehavior, setKeyboardBehavior] =
    useState<BottomNavigationKeyboardBehavior>("hide");

  return (
    <section className="catalog-group" aria-labelledby="bottom-nav-lab-heading">
      <h2 id="bottom-nav-lab-heading">038 Bottom Navigation</h2>
      <p className="catalog-group-desc">
        Mobile primary destinations (3–5) with icon + label. Edge-integrated with
        a top border — not floating. Yields when the keyboard opens so inputs stay
        uncovered. Distinct from Tab Bar (032), which also supports top/contextual
        placement.
      </p>

      <div className="lab-block" style={{ maxWidth: "24rem" }}>
        <h3 className="catalog-subgroup-title">Phone frame</h3>
        <SegmentedControl
          label="Keyboard behavior"
          options={[
            { id: "hide", label: "Hide" },
            { id: "persist", label: "Persist" },
            { id: "none", label: "None" },
          ]}
          value={keyboardBehavior}
          onValueChange={(id) =>
            setKeyboardBehavior(id as BottomNavigationKeyboardBehavior)
          }
        />
        <div style={{ marginBlock: 8 }}>
          <Switch
            label="Simulate keyboard open"
            checked={keyboardOpen}
            onCheckedChange={setKeyboardOpen}
          />
        </div>
        <div
          style={{
            position: "relative",
            border: "1px solid var(--color-border-default, #d2d2d7)",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--color-surface-secondary, #f5f5f7)",
            minHeight: 360,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="dk-scroll"
            style={{
              flex: 1,
              padding: 16,
              paddingBottom: keyboardOpen && keyboardBehavior === "hide" ? 16 : 72,
              overflow: "auto",
            }}
          >
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              Application content. Active: <strong>{active}</strong>. Hosts should
              pad scroll regions above the bar (~56px + safe-area) so content is
              not obscured.
            </p>
            {keyboardOpen ? (
              <TextInput
                label="Compose"
                placeholder="Type while keyboard is open…"
                style={{ marginTop: 12 }}
                autoFocus
              />
            ) : null}
          </div>
          <BottomNavigation
            label="Primary"
            value={active}
            onValueChange={setActive}
            keyboardBehavior={keyboardBehavior}
            keyboardOpen={keyboardOpen}
            safeArea={false}
            style={{ position: "relative" }}
            items={[
              { id: "home", label: "Home", icon: <HomeIcon />, href: "#bn-home" },
              {
                id: "inbox",
                label: "Inbox",
                icon: <InboxIcon />,
                badge: 8,
                href: "#bn-inbox",
              },
              {
                id: "search",
                label: "Search",
                icon: <SearchIcon />,
                href: "#bn-search",
              },
              {
                id: "profile",
                label: "Profile",
                icon: <ProfileIcon />,
                href: "#bn-profile",
              },
              {
                id: "settings",
                label: "Settings",
                icon: <SettingsIcon />,
                disabled: true,
              },
            ]}
          />
        </div>
        <p className="catalog-group-meta">
          Active: {active} · keyboard simulated: {keyboardOpen ? "yes" : "no"}
        </p>
      </div>
    </section>
  );
}

function AnchorNavigationLab() {
  const [orientation, setOrientation] =
    useState<AnchorNavigationOrientation>("horizontal");
  const [active, setActive] = useState<string | null>("overview");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scrollRoot, setScrollRoot] = useState<Element | null>(null);

  useEffect(() => {
    setScrollRoot(contentRef.current);
  }, []);

  const sections = [
    {
      id: "overview",
      title: "Overview",
      body: "Anchor Navigation uses real hash links so open-in-new-tab, copy-link, and no-JS fallbacks keep working. Scroll sync is a progressive enhancement.",
    },
    {
      id: "features",
      title: "Features",
      body: "Sticky mode measures its own height for scroll margin. Active state updates as you scroll when scrollSync is enabled.",
    },
    {
      id: "pricing",
      title: "Pricing",
      body: "Horizontal overflow scrolls with full-size targets — not a tiny cramped strip. Vertical mode suits side-of-page “on this page” lists.",
    },
    {
      id: "faq",
      title: "FAQ",
      body: "Smooth scrolling respects prefers-reduced-motion and falls back to immediate scrolling. Focused section content clears sticky chrome via scroll margin.",
    },
    {
      id: "support",
      title: "Support",
      body: "Keyboard arrows move between anchors. RTL reverses horizontal arrow behavior. High contrast strengthens the active indicator.",
    },
  ];

  return (
    <section className="catalog-group" aria-labelledby="anchor-nav-lab-heading">
      <h2 id="anchor-nav-lab-heading">039 Anchor Navigation</h2>
      <p className="catalog-group-desc">
        In-page section wayfinding. Real <code>&lt;a href="#…"&gt;</code> links,
        scroll sync, sticky offset, horizontal or vertical. Reduced motion uses
        immediate scrolling.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <SegmentedControl
          label="Orientation"
          options={[
            { id: "horizontal", label: "Horizontal" },
            { id: "vertical", label: "Vertical" },
            { id: "auto", label: "Auto" },
          ]}
          value={orientation}
          onValueChange={(id) =>
            setOrientation(id as AnchorNavigationOrientation)
          }
        />

        <div
          style={
            {
              marginTop: 12,
              border: "1px solid var(--color-border-default, #d2d2d7)",
              borderRadius: 12,
              overflow: "hidden",
              display: orientation === "vertical" ? "grid" : "block",
              gridTemplateColumns:
                orientation === "vertical" ? "11rem 1fr" : undefined,
              maxHeight: 420,
              ["--dk-anchor-nav-offset"]:
                orientation === "horizontal" ? "52px" : "0px",
            } as CSSProperties
          }
        >
          <div
            style={{
              position: orientation === "vertical" ? "relative" : undefined,
              borderInlineEnd:
                orientation === "vertical"
                  ? "1px solid var(--color-border-default, #d2d2d7)"
                  : undefined,
            }}
          >
            <AnchorNavigation
              label="On this page"
              sticky={orientation !== "vertical"}
              orientation={orientation}
              overflow="scroll"
              value={active}
              onValueChange={setActive}
              scrollRoot={scrollRoot}
              items={sections.map((s) => ({ id: s.id, label: s.title }))}
              style={
                orientation === "vertical"
                  ? { position: "sticky", top: 0, maxHeight: 420 }
                  : undefined
              }
            />
          </div>

          <div
            ref={contentRef}
            className="dk-scroll"
            style={{
              maxHeight: 420,
              overflow: "auto",
              padding: 16,
              background: "var(--color-surface-secondary, #f5f5f7)",
            }}
          >
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="dk-anchor-nav-target"
                style={{
                  marginBottom: 24,
                  paddingBottom: 24,
                  borderBottom:
                    "1px solid var(--color-border-default, #d2d2d7)",
                  minHeight: 140,
                }}
              >
                <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{section.title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
        <p className="catalog-group-meta">Active section: {active ?? "—"}</p>
      </div>
    </section>
  );
}

function PreviousNextNavigationLab() {
  const [page, setPage] = useState(1);
  const [boundary, setBoundary] = useState<PreviousNextBoundary>("disable");
  const [layout, setLayout] = useState<PreviousNextLayout>("auto");

  const pages = [
    { id: 0, title: "Introduction", href: "#pn-intro" },
    { id: 1, title: "Installation", href: "#pn-install" },
    {
      id: 2,
      title:
        "Configuring authentication providers and session persistence across devices",
      href: "#pn-auth",
    },
    { id: 3, title: "Deploy", href: "#pn-deploy" },
  ];

  const current = pages[page]!;
  const prevPage = pages[page - 1];
  const nextPage = pages[page + 1];

  return (
    <section className="catalog-group" aria-labelledby="prev-next-lab-heading">
      <h2 id="prev-next-lab-heading">040 Previous / Next Navigation</h2>
      <p className="catalog-group-desc">
        Sequential docs/articles/tutorials. Real links for destinations. RTL may
        flip placement — Previous and Next meaning stay the same. Boundary ends
        disable or hide.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <SegmentedControl
          label="Position"
          options={pages.map((p, i) => ({
            id: String(i),
            label: String(i + 1),
          }))}
          value={String(page)}
          onValueChange={(id) => setPage(Number(id))}
        />
        <SegmentedControl
          label="Boundary"
          options={[
            { id: "disable", label: "Disable" },
            { id: "hide", label: "Hide" },
          ]}
          value={boundary}
          onValueChange={(id) => setBoundary(id as PreviousNextBoundary)}
        />
        <SegmentedControl
          label="Layout"
          options={[
            { id: "auto", label: "Auto" },
            { id: "split", label: "Split" },
            { id: "stack", label: "Stack" },
          ]}
          value={layout}
          onValueChange={(id) => setLayout(id as PreviousNextLayout)}
        />

        <div
          style={{
            marginTop: 12,
            padding: 16,
            border: "1px solid var(--color-border-default, #d2d2d7)",
            borderRadius: 12,
            background: "var(--color-surface-secondary, #f5f5f7)",
          }}
        >
          <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{current.title}</h3>
          <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.5 }}>
            Page {page + 1} of {pages.length}. Use Previous / Next to move through
            the sequence.
          </p>
          <PreviousNextNavigation
            boundary={boundary}
            layout={layout}
            previous={
              prevPage
                ? {
                    href: prevPage.href,
                    title: prevPage.title,
                    onSelect: (e) => {
                      e.preventDefault();
                      setPage(page - 1);
                    },
                  }
                : null
            }
            next={
              nextPage
                ? {
                    href: nextPage.href,
                    title: nextPage.title,
                    onSelect: (e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    },
                  }
                : null
            }
          />
        </div>
        <p className="catalog-group-meta">
          Position: {page === 0 ? "first" : page === pages.length - 1 ? "last" : "middle"}
        </p>
      </div>
    </section>
  );
}

function AlertLab() {
  const [variant, setVariant] = useState<AlertVariant>("informational");
  const [dismissed, setDismissed] = useState(false);
  const [density, setDensity] = useState<"standard" | "compact">("standard");

  return (
    <section className="catalog-group" aria-labelledby="alert-lab-heading">
      <h2 id="alert-lab-heading">041 Alert</h2>
      <p className="catalog-group-desc">
        Persistent contextual feedback — not a toast. Status via icon + text +
        surface. Dismiss only when appropriate; persistent conditions use{" "}
        <code>live=&quot;off&quot;</code> and stay non-dismissible.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <SegmentedControl
          label="Variant"
          options={[
            { id: "informational", label: "Info" },
            { id: "success", label: "Success" },
            { id: "warning", label: "Warning" },
            { id: "error", label: "Error" },
            { id: "neutral", label: "Neutral" },
          ]}
          value={variant}
          onValueChange={(id) => setVariant(id as AlertVariant)}
        />
        <SegmentedControl
          label="Density"
          options={[
            { id: "standard", label: "Standard" },
            { id: "compact", label: "Compact" },
          ]}
          value={density}
          onValueChange={(id) => setDensity(id as "standard" | "compact")}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          <Alert variant={variant} density={density} title="Account update available">
            Review the new privacy settings before they take effect next week.
          </Alert>

          <Alert variant={variant} density={density}>
            Message-only alert — no title required for short notices.
          </Alert>

          <Alert
            variant="error"
            density={density}
            title="Couldn’t save changes"
            actions={[
              { label: "Retry", emphasis: "primary", onClick: () => undefined },
              {
                label: "Contact support",
                href: "#support",
                emphasis: "tertiary",
              },
            ]}
          >
            The server returned an unexpected error. Your draft is still saved
            locally and has not been lost.
          </Alert>

          <Alert
            variant="informational"
            density={density}
            live="off"
            title="Read-only archive"
          >
            Persistent condition — not dismissible. Dismissal would falsely imply
            the archive mode ended.
          </Alert>

          {!dismissed ? (
            <Alert
              variant="success"
              density={density}
              title="Invite sent"
              dismissible
              onDismiss={() => setDismissed(true)}
              actions={[
                { label: "View invite", href: "#invite", emphasis: "secondary" },
              ]}
            >
              Dismissal is appropriate here — the notice is contextual, not a
              standing system condition.
            </Alert>
          ) : (
            <Button type="button" variant="secondary" onClick={() => setDismissed(false)}>
              Show dismissible alert again
            </Button>
          )}

          <Alert variant="warning" density={density} title="Long localized message">
            Your subscription renews on 12 March 2027. If payment fails, access to
            shared workspaces, automated exports, and API keys may be paused until
            billing is updated. Contact your organization admin if you do not manage
            billing for this account.
          </Alert>
        </div>
      </div>
    </section>
  );
}

function StatusIndicatorLab() {
  const [appearance, setAppearance] =
    useState<StatusIndicatorAppearance>("dot-text");

  const rows: Array<{
    status: string;
    label: string;
    tone: "neutral" | "positive" | "warning" | "negative" | "informational";
    details?: string;
    preferIcon?: boolean;
  }> = [
    { status: "active", label: "Active", tone: "positive" },
    { status: "inactive", label: "Inactive", tone: "neutral" },
    {
      status: "pending",
      label: "Awaiting verification",
      tone: "warning",
      details: "Submitted 2 hours ago",
      preferIcon: true,
    },
    { status: "processing", label: "Processing", tone: "informational" },
    { status: "completed", label: "Completed", tone: "positive", preferIcon: true },
    { status: "failed", label: "Failed", tone: "negative", preferIcon: true },
    { status: "draft", label: "Draft", tone: "neutral" },
    { status: "archived", label: "Archived", tone: "neutral" },
    { status: "online", label: "Online", tone: "positive" },
    { status: "offline", label: "Offline", tone: "negative", preferIcon: true },
  ];

  return (
    <section className="catalog-group" aria-labelledby="status-lab-heading">
      <h2 id="status-lab-heading">042 Status Indicator</h2>
      <p className="catalog-group-desc">
        Compact entity/process state. Host vocabulary maps onto DevKit tones —
        not hardcoded “Active/Draft” primitives. Prefer icon + text for important
        states. Labels wrap; they are not truncated into fragments.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <SegmentedControl
          label="Appearance"
          options={[
            { id: "dot-text", label: "Dot + text" },
            { id: "icon-text", label: "Icon + text" },
            { id: "text", label: "Text" },
            { id: "dot", label: "Dot" },
          ]}
          value={appearance}
          onValueChange={(id) =>
            setAppearance(id as StatusIndicatorAppearance)
          }
        />

        <ul
          style={{
            listStyle: "none",
            margin: "12px 0 0",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {rows.map((row) => (
            <li
              key={row.status}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 16,
                padding: "8px 0",
                borderBottom: "1px solid var(--color-border-default, #d2d2d7)",
              }}
            >
              <code style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                {row.status}
              </code>
              <StatusIndicator
                status={row.status}
                label={row.label}
                tone={row.tone}
                details={row.details}
                appearance={
                  appearance === "dot-text" && row.preferIcon
                    ? "icon-text"
                    : appearance
                }
              />
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 16 }}>
          <h3 className="catalog-subgroup-title">Long localized label</h3>
          <StatusIndicator
            status="pending-review"
            tone="warning"
            appearance="icon-text"
            label="Awaiting verification from organization administrator"
            details="Usually completes within one business day"
          />
        </div>
      </div>
    </section>
  );
}

function BadgeLab() {
  const [count, setCount] = useState(3);

  return (
    <section className="catalog-group" aria-labelledby="badge-lab-heading">
      <h2 id="badge-lab-heading">043 Badge</h2>
      <p className="catalog-group-desc">
        Compact attached indicator for counts and short labels — not long
        messages. Numeric overflow uses configurable max (default 99+). Critical
        information must not rely on a badge alone.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <h3 className="catalog-subgroup-title">Standalone</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <Badge label="Beta" tone="accent" />
          <Badge label="New" tone="positive" shape="soft" />
          <Badge label="Docs" tone="neutral" appearance="icon-label" icon={<InboxIcon />} />
          <Badge appearance="dot" tone="negative" accessibleLabel="Unread" />
        </div>

        <h3 className="catalog-subgroup-title" style={{ marginTop: 16 }}>
          Numeric overflow
        </h3>
        <SegmentedControl
          label="Count"
          options={[
            { id: "0", label: "0" },
            { id: "1", label: "1" },
            { id: "9", label: "9" },
            { id: "99", label: "99" },
            { id: "100", label: "100" },
            { id: "1200", label: "1200" },
          ]}
          value={String(count)}
          onValueChange={(id) => setCount(Number(id))}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 8 }}>
          <Badge count={count} tone="negative" max={99} showZero accessibleLabel={`${count} items`} />
          <Badge count={count} tone="accent" max={999} />
          <span className="catalog-group-meta">max=99 vs max=999</span>
        </div>

        <h3 className="catalog-subgroup-title" style={{ marginTop: 16 }}>
          Attached to icon button
        </h3>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Badge
            count={count}
            tone="negative"
            max={99}
            accessibleLabel={`${count} unread messages`}
          >
            <IconButton label="Inbox" variant="outlined">
              <InboxIcon />
            </IconButton>
          </Badge>
          <Badge appearance="dot" tone="accent" accessibleLabel="Has updates">
            <IconButton label="Notifications" variant="outlined">
              <ProfileIcon />
            </IconButton>
          </Badge>
          <Badge label="Pro" tone="accent" shape="soft" decorative>
            <Button type="button" variant="secondary" size="sm">
              Workspace
            </Button>
          </Badge>
        </div>
      </div>
    </section>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m6.75 10.25 2.25 2.25 4.25-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NotificationLab() {
  const [density, setDensity] = useState<NotificationDensity>("comfortable");
  const [items, setItems] = useState([
    {
      id: "invite",
      unread: true,
      title: "Team invitation",
      description: "Alex invited you to join Design Systems.",
      timestamp: Date.now() - 5 * 60 * 1000,
      tone: "informational" as const,
    },
    {
      id: "export",
      unread: true,
      title: "Export completed",
      description:
        "customers-q1.csv is ready. The file includes localized columns and will expire in 7 days.",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      tone: "positive" as const,
    },
    {
      id: "security",
      unread: false,
      title: "Security event",
      description: "A new sign-in from Chrome on Windows was recorded.",
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      tone: "warning" as const,
    },
  ]);

  return (
    <section className="catalog-group" aria-labelledby="notification-lab-heading">
      <h2 id="notification-lab-heading">044 Notification</h2>
      <p className="catalog-group-desc">
        Reusable user-event item — not a notification center. Unread uses a mark +
        typography, not background alone. Actions stay separate controls; the whole
        row is not a single hit target.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <SegmentedControl
          label="Density"
          options={[
            { id: "comfortable", label: "Comfortable" },
            { id: "compact", label: "Compact" },
          ]}
          value={density}
          onValueChange={(id) => setDensity(id as NotificationDensity)}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          {items.map((item) => (
            <Notification
              key={item.id}
              density={density}
              unread={item.unread}
              tone={item.tone}
              title={item.title}
              description={item.description}
              timestamp={item.timestamp}
              timestampFormat="auto"
              icon={
                item.tone === "positive" ? (
                  <CheckCircleIcon />
                ) : (
                  <InboxIcon />
                )
              }
              truncateDescription={item.id === "export"}
              primaryAction={
                item.id === "invite"
                  ? {
                      label: "Accept",
                      onClick: () =>
                        setItems((prev) =>
                          prev.map((row) =>
                            row.id === item.id ? { ...row, unread: false } : row
                          )
                        ),
                    }
                  : undefined
              }
              secondaryAction={
                item.id === "invite"
                  ? { label: "Decline", emphasis: "secondary" }
                  : item.id === "export"
                    ? { label: "Download", href: "#download", emphasis: "primary" }
                    : undefined
              }
              dismissible
              onDismiss={() =>
                setItems((prev) => prev.filter((row) => row.id !== item.id))
              }
            />
          ))}

          <Notification
            density={density}
            unread={false}
            tone="neutral"
            title="Payment received"
            description="Invoice #1842 — $240.00"
            timestamp={Date.now() - 40 * 24 * 60 * 60 * 1000}
            timestampFormat="absolute"
            avatar={
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "100%",
                  height: "100%",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                JD
              </span>
            }
            thumbnail={
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "100%",
                  height: "100%",
                  fontSize: 10,
                  color: "var(--color-text-tertiary)",
                }}
              >
                PDF
              </span>
            }
            titleHref="#payment"
          />
        </div>
      </div>
    </section>
  );
}

function ToastLabInner() {
  const { publish, dismissAll } = useToast();
  const [variant, setVariant] = useState<ToastVariant>("success");

  return (
    <>
      <SegmentedControl
        label="Variant"
        options={[
          { id: "neutral", label: "Neutral" },
          { id: "informational", label: "Info" },
          { id: "success", label: "Success" },
          { id: "warning", label: "Warning" },
          { id: "error", label: "Error" },
        ]}
        value={variant}
        onValueChange={(id) => setVariant(id as ToastVariant)}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            publish({
              variant,
              message:
                variant === "success"
                  ? "Changes published"
                  : variant === "error"
                    ? "Couldn’t save — try again"
                    : variant === "warning"
                      ? "Connection is unstable"
                      : variant === "informational"
                        ? "Export started"
                        : "Link copied",
              groupKey: variant === "success" ? "publish" : undefined,
              action:
                variant === "error"
                  ? { label: "Retry", onClick: () => undefined }
                  : variant === "success"
                    ? { label: "View", href: "#view" }
                    : undefined,
            })
          }
        >
          Show toast
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            publish({ variant: "neutral", message: "Saved" });
            publish({ variant: "informational", message: "Export started" });
            publish({ variant: "success", message: "Copied" });
            publish({ variant: "warning", message: "Still syncing…" });
          }}
        >
          Queue several
        </Button>
        <Button type="button" variant="quiet" onClick={() => dismissAll()}>
          Dismiss all
        </Button>
      </div>

      <div style={{ marginTop: 16, maxWidth: "24rem" }}>
        <h3 className="catalog-subgroup-title">Standalone preview</h3>
        <Toast
          variant="success"
          message="Saved"
          duration={null}
          dismissible
        />
      </div>
    </>
  );
}

function ToastLab() {
  return (
    <section className="catalog-group" aria-labelledby="toast-lab-heading">
      <h2 id="toast-lab-heading">045 Toast</h2>
      <p className="catalog-group-desc">
        Temporary feedback — not for sustained critical state (use Alert). Errors
        default to persistent. Provider queues toasts (max 3 visible) and places
        them with safe-area clearance; optional bottom offset for bottom nav.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <ToastProvider placement="auto" maxVisible={3} bottomOffset={0}>
          <ToastLabInner />
        </ToastProvider>
      </div>
    </section>
  );
}

function ProgressBarLab() {
  const [value, setValue] = useState(45);
  const [density, setDensity] = useState<ProgressBarDensity>("standard");

  return (
    <section className="catalog-group" aria-labelledby="progress-bar-lab-heading">
      <h2 id="progress-bar-lab-heading">046 Progress Bar</h2>
      <p className="catalog-group-desc">
        Measurable progress toward a known end. Prefer Spinner when no value
        exists. Show percentages only when meaningful — otherwise use status text
        like “Uploading…”.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <SegmentedControl
          label="Density"
          options={[
            { id: "standard", label: "Standard" },
            { id: "compact", label: "Compact" },
          ]}
          value={density}
          onValueChange={(id) => setDensity(id as ProgressBarDensity)}
        />
        <SegmentedControl
          label="Value"
          options={[
            { id: "0", label: "0%" },
            { id: "25", label: "25%" },
            { id: "50", label: "50%" },
            { id: "75", label: "75%" },
            { id: "100", label: "100%" },
          ]}
          value={String(value)}
          onValueChange={(id) => setValue(Number(id))}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
          <ProgressBar
            density={density}
            label="Uploading report"
            value={value}
            showValue
            description="12 of 28 files"
            meta="About 1 min left"
          />

          <ProgressBar
            density={density}
            label="Install"
            value={value}
            tone="positive"
            showValue
          />

          <ProgressBar
            density={density}
            label="Preparing export"
            value={null}
            description="Uploading…"
          />

          <ProgressBar
            density={density}
            label="Custom range"
            min={0}
            max={50}
            value={Math.round((value / 100) * 50)}
            showValue
            formatValue={(v, _min, max) => `${v} / ${max}`}
            tone="warning"
          />
        </div>
      </div>
    </section>
  );
}

function ProgressCircleLab() {
  const [value, setValue] = useState(65);
  const [size, setSize] = useState<ProgressCircleSize>("md");

  return (
    <section className="catalog-group" aria-labelledby="progress-circle-lab-heading">
      <h2 id="progress-circle-lab-heading">047 Progress Circle</h2>
      <p className="catalog-group-desc">
        Compact measurable progress when horizontal space is limited. Arc maps
        accurately to the value. Not decorative — prefer Spinner when there is no
        progress value.
      </p>

      <div className="lab-block" style={{ maxWidth: "32rem" }}>
        <SegmentedControl
          label="Size"
          options={[
            { id: "sm", label: "SM 24" },
            { id: "md", label: "MD 40" },
            { id: "lg", label: "LG 64" },
          ]}
          value={size}
          onValueChange={(id) => setSize(id as ProgressCircleSize)}
        />
        <SegmentedControl
          label="Value"
          options={[
            { id: "0", label: "0%" },
            { id: "25", label: "25%" },
            { id: "50", label: "50%" },
            { id: "65", label: "65%" },
            { id: "100", label: "100%" },
          ]}
          value={String(value)}
          onValueChange={(id) => setValue(Number(id))}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "flex-start",
            marginTop: 16,
          }}
        >
          <ProgressCircle
            size={size}
            label="Sync"
            value={value}
            showValue
          />
          <ProgressCircle
            size={size}
            label="Upload"
            value={value}
            tone="positive"
            showValue
          />
          <ProgressCircle
            size={size}
            label="Preparing"
            value={null}
            description="Working…"
          />
          <ProgressCircle
            size="sm"
            label="Badge slot"
            hideLabel
            value={value}
            tone="warning"
          />
        </div>
      </div>
    </section>
  );
}

function SpinnerLab() {
  const [size, setSize] = useState<SpinnerSize>("md");

  return (
    <section className="catalog-group" aria-labelledby="spinner-lab-heading">
      <h2 id="spinner-lab-heading">048 Spinner</h2>
      <p className="catalog-group-desc">
        Indeterminate activity when duration is unknown. Use Progress Bar/Circle
        for measurable progress. No page overlay in the primitive — hosts compose
        placement and set <code>aria-busy</code> on the busy region.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <SegmentedControl
          label="Size"
          options={[
            { id: "xs", label: "XS" },
            { id: "sm", label: "SM" },
            { id: "md", label: "MD" },
            { id: "lg", label: "LG" },
            { id: "xl", label: "XL" },
          ]}
          value={size}
          onValueChange={(id) => setSize(id as SpinnerSize)}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <Spinner size={size} label="Loading" />
          <Spinner
            size={size}
            label="Saving"
            labelMode="visible"
            labelPlacement="end"
          />
          <Spinner
            size={size}
            layout="block"
            label="Loading workspace"
            labelMode="visible"
            labelPlacement="bottom"
            style={{ width: "8rem" }}
          />
        </div>

        <h3 className="catalog-subgroup-title" style={{ marginTop: 20 }}>
          Button composition
        </h3>
        <Button type="button" variant="primary" disabled aria-busy="true">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Spinner size="xs" labelMode="none" tone="inverse" />
            Saving…
          </span>
        </Button>

        <h3 className="catalog-subgroup-title" style={{ marginTop: 20 }}>
          Host overlay region (not built into Spinner)
        </h3>
        <div
          role="status"
          aria-busy="true"
          aria-label="Loading content"
          style={{
            border: "1px solid var(--color-border-default, #d2d2d7)",
            borderRadius: 8,
            padding: 24,
            background: "var(--color-surface-secondary, #f5f5f7)",
            minHeight: 120,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Spinner
            size="lg"
            layout="block"
            label="Loading"
            labelMode="visible"
            labelPlacement="bottom"
          />
        </div>
      </div>
    </section>
  );
}

function SkeletonLab() {
  const [size, setSize] = useState<SkeletonSize>("md");
  const [animated, setAnimated] = useState(true);

  return (
    <section className="catalog-group" aria-labelledby="skeleton-lab-heading">
      <h2 id="skeleton-lab-heading">049 Skeleton</h2>
      <p className="catalog-group-desc">
        Structural placeholders that match expected content geometry. Not for
        empty/error states. Calm opacity pulse (static under reduced motion).
        Non-interactive.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <SegmentedControl
          label="Size"
          options={[
            { id: "sm", label: "Small" },
            { id: "md", label: "Medium" },
            { id: "lg", label: "Large" },
          ]}
          value={size}
          onValueChange={(id) => setSize(id as SkeletonSize)}
        />
        <div style={{ marginBlock: 8 }}>
          <Switch
            label="Animated"
            checked={animated}
            onCheckedChange={setAnimated}
          />
        </div>

        <SkeletonGroup label="Loading profile card" gap="md">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <Skeleton shape="avatar" size={size} animated={animated} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Skeleton shape="title" size={size} animated={animated} />
              <div style={{ height: 8 }} />
              <Skeleton
                shape="text"
                size={size}
                lines={3}
                animated={animated}
              />
            </div>
          </div>
          <Skeleton
            shape="rectangle"
            size={size}
            height={size === "sm" ? 96 : size === "lg" ? 160 : 120}
            animated={animated}
          />
          <Skeleton shape="thumbnail" size={size} animated={animated} />
        </SkeletonGroup>
      </div>
    </section>
  );
}

const EMPTY_VARIANT_COPY: Record<
  EmptyStateVariant,
  { title: string; description: string; primary?: string; secondary?: string }
> = {
  default: {
    title: "No items",
    description: "Nothing is available in this area yet.",
  },
  "first-use": {
    title: "No projects yet",
    description: "Create a project to start organizing your work.",
    primary: "Create project",
    secondary: "Learn more",
  },
  "no-results": {
    title: "No results",
    description: "Try a different search term or clear filters.",
    primary: "Clear search",
  },
  filtered: {
    title: "No matching items",
    description: "Nothing matches the current filters.",
    primary: "Reset filters",
  },
  completed: {
    title: "All caught up",
    description: "There is nothing left in this queue.",
  },
  permission: {
    title: "Content unavailable",
    description: "You may not have access to view items here.",
    primary: "Request access",
  },
};

function EmptyStateLab() {
  const [variant, setVariant] = useState<EmptyStateVariant>("first-use");
  const [size, setSize] = useState<EmptyStateSize>("standard");
  const [showActions, setShowActions] = useState(true);
  const copy = EMPTY_VARIANT_COPY[variant];

  return (
    <section className="catalog-group" aria-labelledby="empty-state-lab-heading">
      <h2 id="empty-state-lab-heading">050 Empty State</h2>
      <p className="catalog-group-desc">
        Calm placeholder when a content area has nothing to show. Distinct from
        loading (Spinner/Skeleton) and error (Alert). Actions use DevKit Button —
        omit when no next step is useful. Host owns all copy.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Variant"
          presentation="listbox"
          options={[
            { value: "default", label: "Default" },
            { value: "first-use", label: "First use" },
            { value: "no-results", label: "No results" },
            { value: "filtered", label: "Filtered" },
            { value: "completed", label: "Completed" },
            { value: "permission", label: "Permission" },
          ]}
          value={variant}
          onValueChange={(v) => setVariant(v as EmptyStateVariant)}
        />
        <div style={{ marginBlock: 8 }}>
          <SegmentedControl
            label="Size"
            options={[
              { id: "compact", label: "Compact" },
              { id: "standard", label: "Standard" },
              { id: "large", label: "Large" },
            ]}
            value={size}
            onValueChange={(id) => setSize(id as EmptyStateSize)}
          />
        </div>
        <div style={{ marginBlock: 8 }}>
          <Switch
            label="Show actions"
            checked={showActions}
            onCheckedChange={setShowActions}
          />
        </div>

        <div
          style={{
            border: "1px solid var(--color-border, #e2e8f0)",
            padding: 8,
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EmptyState
            variant={variant}
            size={size}
            title={copy.title}
            description={copy.description}
            primaryAction={
              showActions && copy.primary ? (
                <Button size="sm">{copy.primary}</Button>
              ) : undefined
            }
            secondaryAction={
              showActions && copy.secondary ? (
                <Button size="sm" variant="quiet">
                  {copy.secondary}
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>
    </section>
  );
}

function TooltipLab() {
  const [placement, setPlacement] = useState<TooltipPlacement>("auto");
  const [clicks, setClicks] = useState(0);

  return (
    <section className="catalog-group" aria-labelledby="tooltip-lab-heading">
      <h2 id="tooltip-lab-heading">051 Tooltip</h2>
      <p className="catalog-group-desc">
        Brief supplementary text on hover, focus, or touch long-press.
        Non-interactive — no focus trap. Stays in viewport with auto flip.
        Not for critical instructions or primary labels.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Placement"
          presentation="listbox"
          options={[
            { value: "auto", label: "Auto" },
            { value: "top", label: "Top" },
            { value: "bottom", label: "Bottom" },
            { value: "left", label: "Left" },
            { value: "right", label: "Right" },
          ]}
          value={placement}
          onValueChange={(v) => setPlacement(v as TooltipPlacement)}
        />

        <div
          style={{
            marginBlockStart: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 120,
            border: "1px solid var(--color-border-default, #cbd5e1)",
            padding: 24,
          }}
        >
          <Tooltip content="Download the report as CSV" placement={placement}>
            <IconButton
              label="Download"
              tooltip={false}
              icon={
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                  <path
                    d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M4 16h12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </Tooltip>

          <Tooltip
            content="Autosave keeps a recent copy. You can still export manually."
            placement={placement}
          >
            <Button variant="quiet" size="sm">
              Autosave
            </Button>
          </Tooltip>

          <Tooltip content="Activates on short tap — long-press shows this tip." placement={placement}>
            <Button
              size="sm"
              onClick={() => setClicks((n) => n + 1)}
            >
              Action ({clicks})
            </Button>
          </Tooltip>
        </div>

        <p className="catalog-meta" style={{ marginBlockStart: 8 }}>
          Hover or focus desktop controls. On touch, long-press the action button —
          short taps still count.
        </p>
      </div>
    </section>
  );
}

function PopoverLab() {
  const [placement, setPlacement] = useState<PopoverPlacement>("auto");
  const [arrow, setArrow] = useState(true);
  const [modal, setModal] = useState(false);
  const [showClose, setShowClose] = useState(true);
  const [closeOutside, setCloseOutside] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="popover-lab-heading">
      <h2 id="popover-lab-heading">052 Popover</h2>
      <p className="catalog-group-desc">
        Contextual interactive surface anchored to a trigger. Unlike Tooltip, may
        contain controls. Configurable outside-click, Escape, and close button.
        Non-modal by default (no focus trap).
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Placement"
          presentation="listbox"
          options={[
            { value: "auto", label: "Auto" },
            { value: "top", label: "Top" },
            { value: "bottom", label: "Bottom" },
            { value: "left", label: "Left" },
            { value: "right", label: "Right" },
          ]}
          value={placement}
          onValueChange={(v) => setPlacement(v as PopoverPlacement)}
        />

        <div
          style={{
            marginBlock: 12,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Switch label="Arrow" checked={arrow} onCheckedChange={setArrow} />
          <Switch label="Modal" checked={modal} onCheckedChange={setModal} />
          <Switch
            label="Close button"
            checked={showClose}
            onCheckedChange={setShowClose}
          />
          <Switch
            label="Outside click"
            checked={closeOutside}
            onCheckedChange={setCloseOutside}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 160,
            border: "1px solid var(--color-border-default, #cbd5e1)",
            padding: 24,
          }}
        >
          <Popover
            open={open}
            onOpenChange={setOpen}
            placement={placement}
            arrow={arrow}
            modal={modal}
            showCloseButton={showClose}
            closeOnOutsideClick={closeOutside}
            title="Filters"
            content={
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Switch
                  label="Unread only"
                  checked={unreadOnly}
                  onCheckedChange={setUnreadOnly}
                />
                <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                  Adjust filters without leaving the page. Long lists scroll inside
                  the surface.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="quiet"
                    onClick={() => {
                      setUnreadOnly(false);
                      setOpen(false);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            }
          >
            <Button size="sm">Open filters</Button>
          </Popover>
        </div>
      </div>
    </section>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M6 3.5h5l3 3V16.5H6v-13z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropdownMenuLab() {
  const [presentation, setPresentation] =
    useState<DropdownMenuPresentation>("auto");
  const [starred, setStarred] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [lastAction, setLastAction] = useState("—");

  const items: DropdownMenuEntry[] = [
    {
      id: "edit",
      label: "Edit",
      icon: <DocIcon />,
      shortcut: "⌘E",
      onSelect: () => setLastAction("Edit"),
    },
    {
      id: "duplicate",
      label: "Duplicate",
      shortcut: "⌘D",
      onSelect: () => setLastAction("Duplicate"),
    },
    {
      id: "move",
      label: "Move",
      children: [
        {
          id: "inbox",
          label: "Inbox",
          onSelect: () => setLastAction("Move → Inbox"),
        },
        {
          id: "archive-folder",
          label: "Archive",
          onSelect: () => setLastAction("Move → Archive"),
        },
      ],
    },
    { type: "separator" },
    {
      id: "starred",
      type: "checkbox",
      label: "Starred",
      checked: starred,
      onCheckedChange: setStarred,
    },
    {
      id: "view-list",
      type: "radio",
      name: "view",
      label: "List view",
      checked: view === "list",
      onSelect: () => setView("list"),
    },
    {
      id: "view-grid",
      type: "radio",
      name: "view",
      label: "Grid view",
      checked: view === "grid",
      onSelect: () => setView("grid"),
    },
    { type: "separator" },
    {
      id: "archive",
      label: "Archive",
      onSelect: () => setLastAction("Archive"),
    },
    {
      id: "delete",
      label: "Delete",
      destructive: true,
      shortcut: "⌫",
      onSelect: () => setLastAction("Delete"),
    },
    {
      id: "disabled",
      label: "Share (unavailable)",
      disabled: true,
    },
  ];

  return (
    <section className="catalog-group" aria-labelledby="dropdown-menu-lab-heading">
      <h2 id="dropdown-menu-lab-heading">053 Dropdown Menu</h2>
      <p className="catalog-group-desc">
        Command-oriented action collection — not a form container. Supports
        shortcuts, nested submenus, checkbox/radio items, type-ahead, and a
        touch sheet on narrow viewports.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Presentation"
          presentation="listbox"
          options={[
            { value: "auto", label: "Auto" },
            { value: "menu", label: "Menu" },
            { value: "sheet", label: "Sheet" },
          ]}
          value={presentation}
          onValueChange={(v) => setPresentation(v as DropdownMenuPresentation)}
        />

        <div
          style={{
            marginBlockStart: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
          }}
        >
          <DropdownMenu
            label="Document actions"
            presentation={presentation}
            items={items}
          >
            <Button size="sm">Actions</Button>
          </DropdownMenu>

          <p className="catalog-meta" style={{ margin: 0 }}>
            Last action: {lastAction}
            {starred ? " · Starred" : ""}
            {` · ${view} view`}
          </p>
        </div>
      </div>
    </section>
  );
}

function ContextMenuLab() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState("—");

  const items: ContextMenuEntry[] = [
    {
      id: "open",
      label: "Open",
      shortcut: "↵",
      onSelect: () => setLastAction("Open"),
    },
    {
      id: "rename",
      label: "Rename",
      onSelect: () => setLastAction("Rename"),
    },
    {
      id: "share",
      label: "Share",
      children: [
        {
          id: "copy-link",
          label: "Copy link",
          onSelect: () => setLastAction("Share → Copy link"),
        },
        {
          id: "email",
          label: "Email",
          onSelect: () => setLastAction("Share → Email"),
        },
      ],
    },
    { type: "separator" },
    {
      id: "archive",
      label: "Archive",
      onSelect: () => setLastAction("Archive"),
    },
    {
      id: "delete",
      label: "Delete",
      destructive: true,
      onSelect: () => setLastAction("Delete"),
    },
    {
      id: "locked",
      label: "Move (locked)",
      disabled: true,
    },
  ];

  return (
    <section className="catalog-group" aria-labelledby="context-menu-lab-heading">
      <h2 id="context-menu-lab-heading">054 Context Menu</h2>
      <p className="catalog-group-desc">
        Actions for a specific object or region. Right-click, long-press, or
        Shift+F10 / ContextMenu key. Also open from an explicit button — never
        rely on right-click alone. Closed menus are not in the a11y tree.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <Button size="sm" onClick={() => setOpen(true)}>
            Actions
          </Button>
          <p className="catalog-meta" style={{ margin: 0, alignSelf: "center" }}>
            Last action: {lastAction}
          </p>
        </div>

        <ContextMenu
          label="File actions"
          items={items}
          open={open}
          onOpenChange={setOpen}
        >
          <div
            tabIndex={0}
            style={{
              border: "1px dashed var(--color-border-default, #cbd5e1)",
              padding: 24,
              minHeight: 120,
              color: "var(--color-text-secondary)",
              outline: "none",
            }}
          >
            Focus this region, then Shift+F10 — or right-click / long-press.
            <br />
            Project brief.pdf
          </div>
        </ContextMenu>
      </div>
    </section>
  );
}

function MenuLab() {
  const [size, setSize] = useState<MenuSize>("md");
  const [submenuMode, setSubmenuMode] = useState<"defer" | "inline">("inline");
  const [starred, setStarred] = useState(false);
  const [align, setAlign] = useState<"start" | "end">("start");
  const [last, setLast] = useState("—");
  const [flyout, setFlyout] = useState<{
    items: MenuEntry[];
    label: string;
    style: CSSProperties;
    parentId: string;
  } | null>(null);

  const items: MenuEntry[] = [
    { type: "label", id: "file", label: "File" },
    {
      id: "open",
      label: "Open",
      shortcut: "⌘O",
      onSelect: () => setLast("Open"),
    },
    {
      id: "save",
      label: "Save a copy with a deliberately long localized label",
      shortcut: "⌘S",
      onSelect: () => setLast("Save"),
    },
    {
      id: "move",
      label: "Move to",
      children: [
        {
          id: "inbox",
          label: "Inbox",
          onSelect: () => setLast("Move → Inbox"),
        },
        {
          id: "archive",
          label: "Archive",
          onSelect: () => setLast("Move → Archive"),
        },
      ],
    },
    { type: "separator" },
    { type: "label", id: "view", label: "View" },
    {
      id: "star",
      type: "checkbox",
      label: "Starred",
      checked: starred,
      onCheckedChange: setStarred,
      keepOpen: true,
    },
    {
      id: "align-start",
      type: "radio",
      name: "align",
      label: "Align start",
      checked: align === "start",
      onSelect: () => setAlign("start"),
      keepOpen: true,
    },
    {
      id: "align-end",
      type: "radio",
      name: "align",
      label: "Align end",
      checked: align === "end",
      onSelect: () => setAlign("end"),
      keepOpen: true,
    },
    { type: "separator" },
    {
      id: "delete",
      label: "Delete",
      destructive: true,
      shortcut: "⌫",
      onSelect: () => setLast("Delete"),
    },
    { id: "share", label: "Share (unavailable)", disabled: true },
  ];

  return (
    <section className="catalog-group" aria-labelledby="menu-lab-heading">
      <h2 id="menu-lab-heading">055 Menu</h2>
      <p className="catalog-group-desc">
        Generalized command collection — semantics and keyboard only. Parent
        supplies layout (here: a static panel). Foundation for Dropdown Menu and
        Context Menu. Active state uses a cue bar, not background alone.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <SegmentedControl
            label="Size"
            size="sm"
            equalWidth={false}
            options={[
              { id: "sm", label: "Sm" },
              { id: "md", label: "Md" },
              { id: "lg", label: "Lg" },
            ]}
            value={size}
            onValueChange={(id) => setSize(id as MenuSize)}
          />
          <SegmentedControl
            label="Submenu"
            size="sm"
            equalWidth={false}
            options={[
              { id: "inline", label: "Inline" },
              { id: "defer", label: "Defer" },
            ]}
            value={submenuMode}
            onValueChange={(id) => {
              setSubmenuMode(id as "defer" | "inline");
              setFlyout(null);
            }}
          />
        </div>

        <p className="catalog-meta" style={{ marginBottom: 8 }}>
          Last: {last}
          {starred ? " · Starred" : ""} · align {align}
        </p>

        {/* Parent-owned layout — Menu does not position itself */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            maxWidth: "100%",
          }}
        >
          <Menu
            label="Document menu"
            size={size}
            items={items}
            submenuMode={submenuMode}
            openSubmenuId={flyout?.parentId ?? null}
            style={{ width: "min(20rem, 100%)" }}
            onClose={() => setFlyout(null)}
            onSubmenuClose={() => setFlyout(null)}
            onSubmenuOpen={(req) => {
              if (submenuMode !== "defer") return;
              const rect = req.trigger.getBoundingClientRect();
              const parent = req.trigger.closest(
                '[style*="position: relative"]'
              ) as HTMLElement | null;
              const root = parent?.getBoundingClientRect();
              setFlyout({
                parentId: req.parentId,
                label: req.label,
                items: req.items,
                style: {
                  position: "absolute",
                  top: root ? rect.top - root.top : 0,
                  left: root ? rect.right - root.left + 4 : rect.width + 4,
                  zIndex: 2,
                  width: "12rem",
                },
              });
            }}
          />

          {flyout ? (
            <Menu
              label={flyout.label}
              size={size}
              items={flyout.items}
              style={flyout.style}
              autoFocus
              onClose={() => setFlyout(null)}
              onAction={() => setFlyout(null)}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function DialogLab() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<DialogSize>("md");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [outsideClose, setOutsideClose] = useState(false);
  const [name, setName] = useState("Project North");
  const [longContent, setLongContent] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="dialog-lab-heading">
      <h2 id="dialog-lab-heading">056 Dialog</h2>
      <p className="catalog-group-desc">
        Modal focused interaction — header, scrollable content, sticky footer.
        Focus trap + restore. Outside click does not close by default. Prefer
        Popover when interruption is unnecessary.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Size"
          presentation="listbox"
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
            { value: "fullscreen", label: "Fullscreen" },
          ]}
          value={size}
          onValueChange={(v) => setSize(v as DialogSize)}
        />

        <div
          style={{
            marginBlock: 12,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Switch
            label="Loading"
            checked={loading}
            onCheckedChange={setLoading}
          />
          <Switch
            label="Error"
            checked={showError}
            onCheckedChange={setShowError}
          />
          <Switch
            label="Outside click closes"
            checked={outsideClose}
            onCheckedChange={setOutsideClose}
          />
          <Switch
            label="Long content"
            checked={longContent}
            onCheckedChange={setLongContent}
          />
        </div>

        <Button size="sm" onClick={() => setOpen(true)}>
          Open dialog
        </Button>

        <Dialog
          open={open}
          onOpenChange={setOpen}
          size={size}
          title="Rename project"
          description="Choose a clear name your team will recognize."
          loading={loading}
          error={
            showError
              ? "That name is already in use. Try another."
              : undefined
          }
          closeOnOutsideClick={outsideClose}
          primaryAction={
            <Button
              size="sm"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Save
            </Button>
          }
          secondaryAction={
            <Button
              size="sm"
              variant="quiet"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <TextInput
              label="Name"
              value={name}
              onValueChange={setName}
            />
            {longContent
              ? Array.from({ length: 12 }, (_, i) => (
                  <p key={i} style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                    Supporting detail line {i + 1}. Long content scrolls in the
                    body while footer actions stay reachable.
                  </p>
                ))
              : (
                <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                  Destructive flows should use a destructive Button variant in
                  the primary slot when appropriate.
                </p>
              )}
          </div>
        </Dialog>
      </div>
    </section>
  );
}

function AlertDialogLab() {
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState<AlertDialogTone>("destructive");
  const [escapeBehavior, setEscapeBehavior] = useState<"cancel" | "none">(
    "cancel"
  );
  const [last, setLast] = useState("—");

  return (
    <section className="catalog-group" aria-labelledby="alert-dialog-lab-heading">
      <h2 id="alert-dialog-lab-heading">057 Alert Dialog</h2>
      <p className="catalog-group-desc">
        High-priority confirmation — outside click never dismisses. Focus starts
        on Cancel (safe), not the destructive action. Prefer specific labels
        over OK / Yes. Not for routine info.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Tone"
          presentation="listbox"
          options={[
            { value: "destructive", label: "Destructive" },
            { value: "warning", label: "Warning" },
            { value: "critical", label: "Critical" },
          ]}
          value={tone}
          onValueChange={(v) => setTone(v as AlertDialogTone)}
        />
        <div style={{ marginBlock: 12 }}>
          <SegmentedControl
            label="Escape"
            size="sm"
            equalWidth={false}
            options={[
              { id: "cancel", label: "Cancel" },
              { id: "none", label: "None" },
            ]}
            value={escapeBehavior}
            onValueChange={(id) =>
              setEscapeBehavior(id as "cancel" | "none")
            }
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
            Delete project…
          </Button>
          <p className="catalog-meta" style={{ margin: 0 }}>
            Last choice: {last}
          </p>
        </div>

        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          tone={tone}
          escapeBehavior={escapeBehavior}
          title="Delete this project?"
          description="This permanently removes the project and its files. This cannot be undone."
          cancelAction={
            <Button
              size="sm"
              variant="quiet"
              onClick={() => {
                setLast("Cancel");
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          }
          action={
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setLast("Delete project");
                setOpen(false);
              }}
            >
              Delete project
            </Button>
          }
        />
      </div>
    </section>
  );
}

function DrawerLab() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<DrawerSide>("right");
  const [size, setSize] = useState<DrawerSize>("md");
  const [modal, setModal] = useState(true);
  const [allowBg, setAllowBg] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="drawer-lab-heading">
      <h2 id="drawer-lab-heading">058 Drawer</h2>
      <p className="catalog-group-desc">
        Side-entering temporary surface for filters, settings, and supporting
        content. Modal by default. On narrow viewports becomes a bottom sheet.
        Swipe to dismiss. Close stays reachable while content scrolls.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <SegmentedControl
            label="Side"
            size="sm"
            equalWidth={false}
            options={[
              { id: "left", label: "Left" },
              { id: "right", label: "Right" },
            ]}
            value={side}
            onValueChange={(id) => setSide(id as DrawerSide)}
          />
          <SegmentedControl
            label="Size"
            size="sm"
            equalWidth={false}
            options={[
              { id: "sm", label: "Sm" },
              { id: "md", label: "Md" },
              { id: "lg", label: "Lg" },
            ]}
            value={size}
            onValueChange={(id) => setSize(id as DrawerSize)}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
          <Switch label="Modal" checked={modal} onCheckedChange={setModal} />
          <Switch
            label="Allow background (non-modal)"
            checked={allowBg}
            onCheckedChange={setAllowBg}
            disabled={modal}
          />
        </div>

        <Button size="sm" onClick={() => setOpen(true)}>
          Open drawer
        </Button>

        <Drawer
          open={open}
          onOpenChange={setOpen}
          side={side}
          size={size}
          modal={modal}
          allowBackgroundInteraction={!modal && allowBg}
          title="Filters"
          description="Narrow the list without leaving the page."
          primaryAction={
            <Button size="sm" onClick={() => setOpen(false)}>
              Apply
            </Button>
          }
          secondaryAction={
            <Button size="sm" variant="quiet" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Switch label="Unread only" defaultChecked={false} />
            <Switch label="Has attachments" defaultChecked={false} />
            <TextInput label="Contains text" />
            {Array.from({ length: 8 }, (_, i) => (
              <p
                key={i}
                style={{ margin: 0, color: "var(--color-text-secondary)" }}
              >
                Supporting filter note {i + 1}. Long content scrolls inside the
                drawer.
              </p>
            ))}
          </div>
        </Drawer>
      </div>
    </section>
  );
}

function BottomSheetLab() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<BottomSheetSize>("standard");
  const [variant, setVariant] = useState<BottomSheetVariant>("modal");
  const [forceSheet, setForceSheet] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="bottom-sheet-lab-heading">
      <h2 id="bottom-sheet-lab-heading">059 Bottom Sheet</h2>
      <p className="catalog-group-desc">
        Touch-oriented surface from the bottom. Drag is optional — close,
        Escape, and outside tap also dismiss (except persistent). On desktop
        (≥1024px) presents as a dialog-like panel unless forced to sheet.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Size"
          presentation="listbox"
          options={[
            { value: "compact", label: "Compact" },
            { value: "standard", label: "Standard" },
            { value: "expanded", label: "Expanded" },
            { value: "full", label: "Full height" },
          ]}
          value={size}
          onValueChange={(v) => setSize(v as BottomSheetSize)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Variant"
            presentation="listbox"
            options={[
              { value: "modal", label: "Modal" },
              { value: "non-modal", label: "Non-modal" },
              { value: "persistent", label: "Persistent" },
            ]}
            value={variant}
            onValueChange={(v) => setVariant(v as BottomSheetVariant)}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <Switch
            label="Force sheet on desktop"
            checked={forceSheet}
            onCheckedChange={setForceSheet}
          />
        </div>

        <Button size="sm" onClick={() => setOpen(true)}>
          Open bottom sheet
        </Button>

        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          size={size}
          variant={variant}
          desktopPresentation={forceSheet ? "sheet" : "auto"}
          title="Share options"
          description="Choose how to share this item."
          primaryAction={
            <Button size="sm" onClick={() => setOpen(false)}>
              Copy link
            </Button>
          }
          secondaryAction={
            <Button size="sm" variant="quiet" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <TextInput label="Recipient" />
            <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
              Long content scrolls inside the sheet. The page behind stays put.
              On mobile, drag the handle down to dismiss — or use Close / Cancel.
            </p>
            {Array.from({ length: 6 }, (_, i) => (
              <p
                key={i}
                style={{ margin: 0, color: "var(--color-text-secondary)" }}
              >
                Detail line {i + 1}.
              </p>
            ))}
          </div>
        </BottomSheet>
      </div>
    </section>
  );
}

function ModalSurfaceLab() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<ModalSurfaceSize>("md");
  const [position, setPosition] = useState<ModalSurfacePosition>("center");
  const [modal, setModal] = useState(true);
  const [outside, setOutside] = useState(false);
  const titleId = "modal-surface-lab-title";

  return (
    <section className="catalog-group" aria-labelledby="modal-surface-lab-heading">
      <h2 id="modal-surface-lab-heading">060 Modal Surface</h2>
      <p className="catalog-group-desc">
        Generic elevated surface with backdrop, focus, positioning, and
        dismissal — no forced title or actions. Compose Header / Body / Footer
        slots yourself. Foundation for Dialog and Alert Dialog.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Size"
          presentation="listbox"
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
            { value: "fullscreen", label: "Fullscreen" },
          ]}
          value={size}
          onValueChange={(v) => setSize(v as ModalSurfaceSize)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Position"
            presentation="listbox"
            options={[
              { value: "center", label: "Centered" },
              { value: "top", label: "Top-aligned" },
              { value: "bottom", label: "Bottom-aligned" },
            ]}
            value={position}
            onValueChange={(v) => setPosition(v as ModalSurfacePosition)}
          />
        </div>
        <div style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <Switch label="Modal behavior" checked={modal} onCheckedChange={setModal} />
          <Switch
            label="Close on outside click"
            checked={outside}
            onCheckedChange={setOutside}
          />
        </div>

        <Button size="sm" onClick={() => setOpen(true)}>
          Open modal surface
        </Button>

        <ModalSurface
          open={open}
          onOpenChange={setOpen}
          size={size}
          position={position}
          modal={modal}
          closeOnOutsideClick={outside}
          aria-labelledby={titleId}
        >
          <ModalSurface.Header>
            <h2
              id={titleId}
              style={{
                margin: 0,
                fontSize: "var(--font-size-heading-3, 18px)",
                fontWeight: 600,
              }}
            >
              Composed content
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                color: "var(--color-text-secondary)",
                fontSize: "var(--font-size-body-sm, 14px)",
              }}
            >
              Title and actions are consumer-owned — not built into the surface.
            </p>
          </ModalSurface.Header>
          <ModalSurface.Body>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <TextInput label="Example field" />
              <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                Forms, lists, media, or custom layouts go here. The body scrolls
                when content is long; scroll lock prevents page jump behind the
                surface.
              </p>
              {Array.from({ length: 4 }, (_, i) => (
                <p
                  key={i}
                  style={{ margin: 0, color: "var(--color-text-secondary)" }}
                >
                  Scrollable line {i + 1}.
                </p>
              ))}
            </div>
          </ModalSurface.Body>
          <ModalSurface.Footer>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "flex-end",
              }}
            >
              <Button size="sm" variant="quiet" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </div>
          </ModalSurface.Footer>
        </ModalSurface>
      </div>
    </section>
  );
}

function CardLab() {
  const [variant, setVariant] = useState<CardVariant>("standard");
  const [orientation, setOrientation] = useState<CardOrientation>("vertical");
  const [interactive, setInteractive] = useState(false);
  const [selected, setSelected] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="card-lab-heading">
      <h2 id="card-lab-heading">061 Card</h2>
      <p className="catalog-group-desc">
        Flexible grouping surface. Default is quiet (subtle border). Compose
        media, header, body, footer, and actions — none are mandatory. Prefer
        title links when the card also has independent actions.
      </p>

      <div className="lab-block" style={{ maxWidth: "44rem" }}>
        <Select
          label="Variant"
          presentation="listbox"
          options={[
            { value: "standard", label: "Standard" },
            { value: "compact", label: "Compact" },
            { value: "elevated", label: "Elevated" },
            { value: "outlined", label: "Outlined" },
          ]}
          value={variant}
          onValueChange={(v) => setVariant(v as CardVariant)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Orientation"
            presentation="listbox"
            options={[
              { value: "vertical", label: "Vertical" },
              { value: "horizontal", label: "Horizontal" },
              { value: "responsive", label: "Responsive" },
            ]}
            value={orientation}
            onValueChange={(v) => setOrientation(v as CardOrientation)}
          />
        </div>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Switch
            label="Interactive"
            checked={interactive}
            onCheckedChange={setInteractive}
          />
          <Switch
            label="Selected"
            checked={selected}
            onCheckedChange={setSelected}
          />
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
          }}
        >
          <Card
            variant={variant}
            orientation={orientation}
            interactive={interactive}
            selected={selected}
            onClick={interactive ? () => undefined : undefined}
            aria-label={interactive ? "Project overview card" : undefined}
          >
            <Card.Media aspectRatio="16 / 9">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: "6rem",
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--font-size-body-sm, 14px)",
                }}
                aria-hidden="true"
              >
                Media
              </div>
            </Card.Media>
            <Card.Content>
              <Card.Header>
                <Card.Status>
                  <Badge label="Active" tone="positive" shape="soft" />
                </Card.Status>
                <Card.Title>Project overview</Card.Title>
                <Card.Description>
                  Group related content without forcing chrome. Padding follows
                  the global spacing scale.
                </Card.Description>
                <Card.Metadata>Updated · 2 hours ago</Card.Metadata>
              </Card.Header>
              <Card.Body>
                Body content grows with the text — avoid fixed heights that leave
                empty space.
              </Card.Body>
              {!interactive ? (
                <Card.Footer>
                  <Card.Actions>
                    <Button size="sm" variant="quiet">
                      Details
                    </Button>
                    <Button size="sm">Open</Button>
                  </Card.Actions>
                </Card.Footer>
              ) : null}
            </Card.Content>
          </Card>

          <Card variant={variant}>
            <Card.Header>
              <Card.Title href="#card-title-only">Title-linked card</Card.Title>
              <Card.Description>
                Independent footer actions — only the title is a link, so nesting
                stays correct.
              </Card.Description>
            </Card.Header>
            <Card.Footer>
              <Card.Actions>
                <Button size="sm" variant="quiet">
                  Share
                </Button>
                <Button size="sm">Edit</Button>
              </Card.Actions>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ListLab() {
  const [density, setDensity] = useState<ListDensity>("comfortable");
  const [selectionMode, setSelectionMode] =
    useState<ListSelectionMode>("multiple");
  const [dividers, setDividers] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    () => new Set(["inbox"])
  );

  return (
    <section className="catalog-group" aria-labelledby="list-lab-heading">
      <h2 id="list-lab-heading">062 List</h2>
      <p className="catalog-group-desc">
        Container for related items — density, optional dividers, groups, and
        single/multiple/none selection. Empty lists use Empty State. Keyboard:
        Arrow Up/Down, Home/End, Enter, Space when interactive.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <Select
          label="Density"
          presentation="listbox"
          options={[
            { value: "compact", label: "Compact" },
            { value: "comfortable", label: "Comfortable" },
            { value: "spacious", label: "Spacious" },
          ]}
          value={density}
          onValueChange={(v) => setDensity(v as ListDensity)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Selection"
            presentation="listbox"
            options={[
              { value: "none", label: "None (informational)" },
              { value: "single", label: "Single" },
              { value: "multiple", label: "Multiple" },
            ]}
            value={selectionMode}
            onValueChange={(v) => setSelectionMode(v as ListSelectionMode)}
          />
        </div>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Switch
            label="Dividers between items"
            checked={dividers}
            onCheckedChange={setDividers}
          />
          <Switch
            label="Show empty state"
            checked={showEmpty}
            onCheckedChange={setShowEmpty}
          />
        </div>

        <List
          density={density}
          selectionMode={selectionMode}
          dividers={dividers ? "between" : "none"}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          aria-label="Mailbox folders"
          empty={
            <EmptyState
              title="No items"
              description="This list is empty. Compose Empty State — do not invent a parallel empty UI."
              variant="no-results"
              size="compact"
            />
          }
        >
          {showEmpty ? null : (
            <>
              <List.Group label="Primary">
                <List.Item itemKey="inbox" lines="two">
                  <List.ItemLabel>Inbox</List.ItemLabel>
                  <List.ItemDescription>
                    Messages waiting for you
                  </List.ItemDescription>
                </List.Item>
                <List.Item itemKey="starred" lines="one">
                  <List.ItemLabel>Starred</List.ItemLabel>
                </List.Item>
              </List.Group>
              <List.Divider />
              <List.Group label="Other">
                <List.Item itemKey="archive" lines="multi">
                  <List.ItemLabel>Archive</List.ItemLabel>
                  <List.ItemDescription>
                    Older conversations you may still need. Descriptions wrap
                    freely in multi-line mode without clipping important text.
                  </List.ItemDescription>
                </List.Item>
                <List.Item itemKey="spam" lines="one" disabled>
                  <List.ItemLabel>Spam (disabled)</List.ItemLabel>
                </List.Item>
              </List.Group>
            </>
          )}
        </List>

        {selectionMode !== "none" && !showEmpty ? (
          <p
            style={{
              marginTop: 12,
              color: "var(--color-text-secondary)",
              fontSize: "var(--font-size-body-sm, 14px)",
            }}
          >
            Selected:{" "}
            {selectedKeys.size
              ? Array.from(selectedKeys).join(", ")
              : "none"}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ListItemLab() {
  const [density, setDensity] = useState<ListItemDensity>("comfortable");
  const [lines, setLines] = useState<ListItemLines>("two");

  return (
    <section className="catalog-group" aria-labelledby="list-item-lab-heading">
      <h2 id="list-item-lab-heading">063 List Item</h2>
      <p className="catalog-group-desc">
        Atomic content row — leading, primary, secondary, trailing. Primary stays
        dominant. Whole-row links use semantic anchors; independent trailing
        actions keep clicks unambiguous via title links.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <Select
          label="Density"
          presentation="listbox"
          options={[
            { value: "compact", label: "Compact" },
            { value: "comfortable", label: "Comfortable" },
            { value: "spacious", label: "Spacious" },
          ]}
          value={density}
          onValueChange={(v) => setDensity(v as ListItemDensity)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Lines"
            presentation="listbox"
            options={[
              { value: "one", label: "Single-line" },
              { value: "two", label: "Two-line" },
              { value: "multi", label: "Multi-line" },
            ]}
            value={lines}
            onValueChange={(v) => setLines(v as ListItemLines)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ListItem
            density={density}
            lines={lines}
            interactive
            href="#list-item-nav"
          >
            <ListItem.Leading>
              <span aria-hidden="true" style={{ fontSize: 18 }}>
                ●
              </span>
            </ListItem.Leading>
            <ListItem.Primary>
              <ListItem.Title>Whole-row navigation</ListItem.Title>
            </ListItem.Primary>
            <ListItem.Secondary>
              <ListItem.Description>
                The entire item is an anchor — no nested buttons.
              </ListItem.Description>
              <ListItem.Metadata>Folder · Shared</ListItem.Metadata>
            </ListItem.Secondary>
            <ListItem.Trailing>
              <ListItem.Disclosure />
            </ListItem.Trailing>
          </ListItem>

          <ListItem
            density={density}
            lines={lines}
            interactive
            hasTrailingActions
            selected
          >
            <ListItem.Leading>
              <span
                aria-hidden="true"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--color-surface-secondary)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                AL
              </span>
            </ListItem.Leading>
            <ListItem.Primary>
              <ListItem.Title href="#ada">Ada Lovelace</ListItem.Title>
            </ListItem.Primary>
            <ListItem.Secondary>
              <ListItem.Description>
                Mathematician and writer. Long names wrap rather than truncating
                when multi-line is selected.
              </ListItem.Description>
              <ListItem.Timestamp dateTime="2026-08-07T12:00:00">
                2 hours ago
              </ListItem.Timestamp>
            </ListItem.Secondary>
            <ListItem.Trailing>
              <Badge label="Active" tone="positive" shape="soft" />
              <ListItem.Value>12</ListItem.Value>
              <ListItem.Action>
                <Button size="sm" variant="quiet">
                  Message
                </Button>
              </ListItem.Action>
            </ListItem.Trailing>
          </ListItem>

          <ListItem density={density} lines="one">
            <ListItem.Leading>
              <span aria-hidden="true">☑</span>
            </ListItem.Leading>
            <ListItem.Primary>
              <ListItem.Label>Informational row</ListItem.Label>
            </ListItem.Primary>
            <ListItem.Trailing>
              <ListItem.Value>$240</ListItem.Value>
            </ListItem.Trailing>
          </ListItem>
        </div>
      </div>
    </section>
  );
}

function DataRowLab() {
  const [density, setDensity] = useState<DataRowDensity>("comfortable");
  const [layout, setLayout] = useState<DataRowLayout>("responsive");
  const [dividers, setDividers] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [selected, setSelected] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="data-row-lab-heading">
      <h2 id="data-row-lab-heading">064 Data Row</h2>
      <p className="catalog-group-desc">
        Structured label/value fields for detail views and records — not a table
        row. Narrow screens stack pairs; wider screens align columns. Long
        values wrap by default.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Density"
          presentation="listbox"
          options={[
            { value: "compact", label: "Compact" },
            { value: "comfortable", label: "Comfortable" },
            { value: "spacious", label: "Spacious" },
          ]}
          value={density}
          onValueChange={(v) => setDensity(v as DataRowDensity)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Layout"
            presentation="listbox"
            options={[
              { value: "responsive", label: "Responsive" },
              { value: "horizontal", label: "Horizontal" },
              { value: "stacked", label: "Stacked" },
            ]}
            value={layout}
            onValueChange={(v) => setLayout(v as DataRowLayout)}
          />
        </div>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Switch
            label="Dividers"
            checked={dividers}
            onCheckedChange={setDividers}
          />
          <Switch
            label="Interactive"
            checked={interactive}
            onCheckedChange={setInteractive}
          />
          <Switch
            label="Selected"
            checked={selected}
            onCheckedChange={setSelected}
          />
        </div>

        <DataRow
          density={density}
          layout={layout}
          dividers={dividers}
          interactive={interactive}
          selected={selected}
          onActivate={interactive ? () => undefined : undefined}
          aria-label="Contact record"
        >
          <DataRow.Leading>
            <span
              aria-hidden="true"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--color-surface-secondary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              JS
            </span>
          </DataRow.Leading>
          <DataRow.Field label="Name" value="John Smith" />
          <DataRow.Field label="Status">
            <Badge label="Active" tone="positive" shape="soft" />
          </DataRow.Field>
          <DataRow.Field
            label="Created"
            value="Aug 7, 2026"
            valueType="date"
          />
          <DataRow.Field
            label="Email"
            value="john.smith@example.com"
            valueType="email"
          />
          <DataRow.Field
            label="Balance"
            value="12,450.00"
            valueType="number"
          />
          <DataRow.Field
            label="Reference"
            value="ord_7f3a9c2e1b8d4056"
            valueType="id"
          />
          <DataRow.Status>
            <Badge label="Verified" tone="accent" shape="soft" />
          </DataRow.Status>
          <DataRow.Actions>
            <Button size="sm" variant="quiet">
              Edit
            </Button>
            <Button size="sm">Open</Button>
          </DataRow.Actions>
        </DataRow>
      </div>
    </section>
  );
}

function AvatarLab() {
  const [size, setSize] = useState<AvatarSize>("md");
  const [presence, setPresence] = useState<AvatarPresence | "none">("online");

  return (
    <section className="catalog-group" aria-labelledby="avatar-lab-heading">
      <h2 id="avatar-lab-heading">065 Avatar</h2>
      <p className="catalog-group-desc">
        Identity mark with deterministic fallback (image → initials → icon).
        Presence uses shape and labels, not color alone. Sizes map to
        control-height tokens.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Size"
          presentation="listbox"
          options={[
            { value: "xs", label: "XS" },
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
            { value: "xl", label: "XL" },
            { value: "2xl", label: "2XL" },
          ]}
          value={size}
          onValueChange={(v) => setSize(v as AvatarSize)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Presence"
            presentation="listbox"
            options={[
              { value: "none", label: "None" },
              { value: "online", label: "Online" },
              { value: "offline", label: "Offline" },
              { value: "busy", label: "Busy" },
              { value: "away", label: "Away" },
              { value: "unknown", label: "Unknown" },
            ]}
            value={presence}
            onValueChange={(v) => setPresence(v as AvatarPresence | "none")}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <Avatar
            size={size}
            name="Ada Lovelace"
            presence={presence === "none" ? undefined : presence}
          />
          <Avatar
            size={size}
            name="李雷"
            presence={presence === "none" ? undefined : presence}
          />
          <Avatar
            size={size}
            name="Madonna"
            presence={presence === "none" ? undefined : presence}
          />
          <Avatar
            size={size}
            entity="organization"
            name="Roboticela"
            presence={presence === "none" ? undefined : presence}
          />
          <Avatar
            size={size}
            entity="generic"
            prefer="icon"
            aria-label="Unknown identity"
          />
          <Avatar size={size} decorative name="Hidden from AT" />
        </div>

        <p
          style={{
            margin: "0 0 8px",
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-size-body-sm, 14px)",
          }}
        >
          Broken image falls through to initials:
        </p>
        <Avatar
          size={size}
          name="John Smith"
          src="/this-image-does-not-exist.jpg"
          presence={presence === "none" ? undefined : presence}
        />
      </div>
    </section>
  );
}

const AVATAR_GROUP_DEMO_NAMES = [
  "Ada Lovelace",
  "Grace Hopper",
  "Alan Turing",
  "Katherine Johnson",
  "Hedy Lamarr",
  "Margaret Hamilton",
  "Tim Berners-Lee",
  "Radia Perlman",
  "Donald Knuth",
  "Barbara Liskov",
  "Dennis Ritchie",
  "Ken Thompson",
];

function AvatarGroupLab() {
  const [size, setSize] = useState<AvatarGroupSize>("md");
  const [layout, setLayout] = useState<AvatarGroupLayout>("overlap");
  const [compact, setCompact] = useState(false);
  const [max, setMax] = useState(3);
  const [count, setCount] = useState(5);

  const identities = Array.from({ length: count }, (_, i) => ({
    key: `ag-${i}`,
    name: AVATAR_GROUP_DEMO_NAMES[i] ?? `Member ${i + 1}`,
  }));
  const overflowNames = identities.slice(max).map((i) => i.name);

  return (
    <section className="catalog-group" aria-labelledby="avatar-group-lab-heading">
      <h2 id="avatar-group-lab-heading">066 Avatar Group</h2>
      <p className="catalog-group-desc">
        Compact multi-identity arrangement. Modest overlap keeps initials
        readable. Overflow shows +N; activate it for details (touch-friendly —
        not hover-only). Only max visible avatars mount.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Size"
          presentation="listbox"
          options={[
            { value: "xs", label: "XS" },
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
          ]}
          value={size}
          onValueChange={(v) => setSize(v as AvatarGroupSize)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Layout"
            presentation="listbox"
            options={[
              { value: "overlap", label: "Overlap" },
              { value: "separated", label: "Separated" },
            ]}
            value={layout}
            onValueChange={(v) => setLayout(v as AvatarGroupLayout)}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <Select
            label="Identities"
            presentation="listbox"
            options={[
              { value: "2", label: "2" },
              { value: "5", label: "5" },
              { value: "12", label: "12 (overflow)" },
              { value: "24", label: "24 (large — still max mount)" },
            ]}
            value={String(count)}
            onValueChange={(v) => setCount(Number(v))}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <Select
            label="Max visible"
            presentation="listbox"
            options={[
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "5", label: "5" },
            ]}
            value={String(max)}
            onValueChange={(v) => setMax(Number(v))}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Switch label="Compact" checked={compact} onCheckedChange={setCompact} />
        </div>

        <AvatarGroup
          size={size}
          layout={layout}
          compact={compact}
          max={max}
          aria-label="Contributors"
          items={identities}
          renderItem={(item) => <Avatar name={item.name} size={size} />}
          overflowTooltip={
            overflowNames.length ? overflowNames.join(", ") : undefined
          }
          overflowDetails={
            overflowNames.length ? (
              <div>
                <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Also includes</p>
                <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                  {overflowNames.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ) : undefined
          }
        />
      </div>
    </section>
  );
}

function CopyGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
      <rect
        x="7"
        y="7"
        width="9"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 13V4.5A1.5 1.5 0 0 1 5.5 3H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KeyValuePairLab() {
  const [orientation, setOrientation] =
    useState<KeyValuePairOrientation>("responsive");

  return (
    <section className="catalog-group" aria-labelledby="kvp-lab-heading">
      <h2 id="kvp-lab-heading">067 Key-Value Pair</h2>
      <p className="catalog-group-desc">
        Label is secondary; value is dominant. Horizontal where space allows;
        vertical on narrow screens or for complex values. Long values wrap —
        compose copy with IconButton, not a custom control.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <Select
          label="Orientation"
          presentation="listbox"
          options={[
            { value: "responsive", label: "Responsive" },
            { value: "horizontal", label: "Horizontal" },
            { value: "vertical", label: "Vertical" },
          ]}
          value={orientation}
          onValueChange={(v) => setOrientation(v as KeyValuePairOrientation)}
        />

        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <KeyValuePair
            orientation={orientation}
            label="Email"
            value="hello@example.com"
            valueType="email"
            action={
              <IconButton
                size="sm"
                variant="subtle"
                label="Copy email"
                icon={<CopyGlyph />}
                onClick={() => {
                  void navigator.clipboard?.writeText("hello@example.com");
                }}
              />
            }
          />
          <KeyValuePair
            orientation={orientation}
            label="Plan"
            value="Professional"
            status={<Badge label="Active" tone="positive" shape="soft" />}
          />
          <KeyValuePair
            orientation={orientation}
            label="Created"
            value="August 7, 2026"
            valueType="date"
            description="Account creation date"
          />
          <KeyValuePair
            orientation={orientation}
            label="Website"
            value="https://docs.example.com/products/roboticela/getting-started/overview"
            valueType="url"
          />
          <KeyValuePair
            orientation={orientation}
            label="Address"
            valueType="address"
            value={"221B Baker Street\nLondon NW1 6XE\nUnited Kingdom"}
          />
          <KeyValuePair
            orientation={orientation}
            label="Reference"
            value="ord_7f3a9c2e1b8d4056abcdef"
            valueType="id"
            overflow="clip"
            description="Clip overflow is opt-in for dense IDs"
          />
        </div>
      </div>
    </section>
  );
}

function DividerLab() {
  const [orientation, setOrientation] =
    useState<DividerOrientation>("horizontal");
  const [variant, setVariant] = useState<DividerVariant>("full");
  const [semantic, setSemantic] = useState(false);
  const [tall, setTall] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="divider-lab-heading">
      <h2 id="divider-lab-heading">068 Divider</h2>
      <p className="catalog-group-desc">
        Subtle structural separation — not decoration. Prefer spacing when it
        is enough. Vertical dividers stretch with neighboring content (no fixed
        height).
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Orientation"
          presentation="listbox"
          options={[
            { value: "horizontal", label: "Horizontal" },
            { value: "vertical", label: "Vertical" },
          ]}
          value={orientation}
          onValueChange={(v) => setOrientation(v as DividerOrientation)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Variant"
            presentation="listbox"
            options={[
              { value: "full", label: "Full width" },
              { value: "inset", label: "Inset" },
              { value: "section", label: "Section" },
              { value: "content", label: "Content-aligned" },
            ]}
            value={variant}
            onValueChange={(v) => setVariant(v as DividerVariant)}
          />
        </div>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Switch
            label="Semantic section boundary"
            checked={semantic}
            onCheckedChange={setSemantic}
          />
          {orientation === "vertical" ? (
            <Switch
              label="Taller neighbor content"
              checked={tall}
              onCheckedChange={setTall}
            />
          ) : null}
        </div>

        {orientation === "horizontal" ? (
          <div
            style={{
              border: "1px solid var(--color-border-subtle)",
              borderRadius: 8,
              paddingBlock: 8,
            }}
          >
            <p style={{ margin: "0 16px", color: "var(--color-text-secondary)" }}>
              Group A
            </p>
            <Divider
              orientation="horizontal"
              variant={variant}
              semantic={semantic}
              aria-label={semantic ? "Next section" : undefined}
            />
            <p style={{ margin: "0 16px", color: "var(--color-text-secondary)" }}>
              Group B
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: 8,
              padding: 12,
              gap: 0,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0 }}>Primary pane</p>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "var(--color-text-secondary)",
                  fontSize: 14,
                }}
              >
                Neighbor content
                {tall
                  ? " grows taller — the vertical divider stretches with it instead of staying a fixed height."
                  : "."}
              </p>
              {tall
                ? Array.from({ length: 4 }, (_, i) => (
                    <p
                      key={i}
                      style={{
                        margin: "8px 0 0",
                        color: "var(--color-text-secondary)",
                        fontSize: 14,
                      }}
                    >
                      Extra line {i + 1}
                    </p>
                  ))
                : null}
            </div>
            <Divider
              orientation="vertical"
              variant={variant}
              semantic={semantic}
              aria-label={semantic ? "Split panes" : undefined}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0 }}>Secondary pane</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TimelineLab() {
  const [orientation, setOrientation] =
    useState<TimelineOrientation>("vertical");

  return (
    <section className="catalog-group" aria-labelledby="timeline-lab-heading">
      <h2 id="timeline-lab-heading">069 Timeline</h2>
      <p className="catalog-group-desc">
        Ordered events with markers and thin connectors. Status uses marker
        shape/glyph — not connector color alone. Vertical for rich content;
        horizontal only for short events (becomes vertical on narrow screens).
        Events are not clickable by default.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Orientation"
          presentation="listbox"
          options={[
            { value: "vertical", label: "Vertical" },
            { value: "horizontal", label: "Horizontal (short content)" },
            { value: "responsive", label: "Responsive (vertical)" },
          ]}
          value={orientation}
          onValueChange={(v) => setOrientation(v as TimelineOrientation)}
        />

        <div style={{ marginTop: 16 }}>
          <Timeline orientation={orientation} aria-label="Shipment progress">
            <Timeline.Item
              status="completed"
              timestamp="Aug 5, 2026 · 09:14"
            >
              <Timeline.Title>Order placed</Timeline.Title>
              <Timeline.Description>
                Payment confirmed and inventory reserved.
              </Timeline.Description>
            </Timeline.Item>
            <Timeline.Item status="completed" timestamp="Aug 6, 2026 · 16:02">
              <Timeline.Marker>
                <Avatar name="Warehouse" size="xs" entity="organization" />
              </Timeline.Marker>
              <Timeline.Title>Packed at warehouse</Timeline.Title>
              <Timeline.Description>
                Long descriptions wrap freely and are not forced into narrow
                fixed widths, even when the timeline is dense.
              </Timeline.Description>
              <Timeline.Metadata>Facility · SEA1</Timeline.Metadata>
            </Timeline.Item>
            <Timeline.Item status="current" timestamp="Aug 7, 2026 · 11:40">
              <Timeline.Title>Out for delivery</Timeline.Title>
              <Timeline.Description>
                Carrier is en route to the delivery address.
              </Timeline.Description>
              <Timeline.Status>
                <Badge label="In progress" tone="accent" shape="soft" />
              </Timeline.Status>
            </Timeline.Item>
            <Timeline.Item status="warning" timestamp="Aug 7, 2026 · 12:05">
              <Timeline.Title>Recipient unavailable</Timeline.Title>
              <Timeline.Description>
                Attempt recorded — will retry later today.
              </Timeline.Description>
            </Timeline.Item>
            <Timeline.Item status="upcoming" showIndex>
              <Timeline.Title>Delivered</Timeline.Title>
              <Timeline.Description>Expected by end of day.</Timeline.Description>
            </Timeline.Item>
          </Timeline>
        </div>
      </div>
    </section>
  );
}

function ContentBlockLab() {
  const [density, setDensity] = useState<ContentBlockDensity>("standard");
  const [headerLayout, setHeaderLayout] =
    useState<ContentBlockHeaderLayout>("responsive");
  const [divider, setDivider] = useState(true);

  return (
    <section className="catalog-group" aria-labelledby="content-block-lab-heading">
      <h2 id="content-block-lab-heading">070 Content Block</h2>
      <p className="catalog-group-desc">
        Neutral structural grouping — spacing and hierarchy only. No card chrome
        (no background, border, shadow, or large radius). Lighter than Card;
        suitable inside pages, dialogs, drawers, and settings.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Density"
          presentation="listbox"
          options={[
            { value: "compact", label: "Compact" },
            { value: "standard", label: "Standard" },
            { value: "spacious", label: "Spacious" },
          ]}
          value={density}
          onValueChange={(v) => setDensity(v as ContentBlockDensity)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Header layout"
            presentation="listbox"
            options={[
              { value: "responsive", label: "Responsive" },
              { value: "inline", label: "Inline" },
              { value: "stacked", label: "Stacked" },
            ]}
            value={headerLayout}
            onValueChange={(v) =>
              setHeaderLayout(v as ContentBlockHeaderLayout)
            }
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Switch
            label="Optional divider"
            checked={divider}
            onCheckedChange={setDivider}
          />
        </div>

        <ContentBlock
          density={density}
          headerLayout={headerLayout}
          divider={divider}
          heading="Notification preferences"
          description="Choose how you want to be reached. Long headings and descriptions wrap naturally without truncating important copy."
          metadata="Last updated · Aug 7, 2026"
          actions={
            <>
              <Button size="sm" variant="quiet">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
            </>
          }
        >
          <KeyValuePair
            orientation="vertical"
            label="Email"
            value="hello@example.com"
            valueType="email"
          />
          <div style={{ marginTop: 12 }}>
            <KeyValuePair
              orientation="vertical"
              label="Plan"
              value="Professional"
            />
          </div>
        </ContentBlock>
      </div>
    </section>
  );
}

function ImageLab() {
  const [fit, setFit] = useState<ImageObjectFit>("cover");
  const [radius, setRadius] = useState<ImageRadius>("none");
  const [showBroken, setShowBroken] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="image-lab-heading">
      <h2 id="image-lab-heading">071 Image</h2>
      <p className="catalog-group-desc">
        Fundamental visual primitive. Aspect ratio reserves space while loading.
        Failed sources show a fallback — never browser broken-image artifacts.
        Fill (distort) is opt-in only.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Object fit"
          presentation="listbox"
          options={[
            { value: "cover", label: "Cover" },
            { value: "contain", label: "Contain" },
            { value: "fill", label: "Fill (explicit distortion)" },
            { value: "none", label: "None / natural" },
            { value: "scale-down", label: "Scale down" },
          ]}
          value={fit}
          onValueChange={(v) => setFit(v as ImageObjectFit)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Radius"
            presentation="listbox"
            options={[
              { value: "none", label: "None (default)" },
              { value: "sm", label: "Small" },
              { value: "md", label: "Medium" },
              { value: "lg", label: "Large" },
              { value: "full", label: "Full" },
              { value: "square", label: "Square" },
            ]}
            value={radius}
            onValueChange={(v) => setRadius(v as ImageRadius)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Switch
            label="Simulate broken source"
            checked={showBroken}
            onCheckedChange={setShowBroken}
          />
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <Image
            src={
              showBroken
                ? "/this-image-does-not-exist.jpg"
                : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
            }
            alt="Abstract soft shapes"
            aspectRatio="16 / 9"
            objectFit={fit}
            radius={radius}
            loading="eager"
            fallback={
              <span style={{ color: "var(--color-text-secondary)" }}>
                Image unavailable
              </span>
            }
          />
          <Image
            decorative
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=60"
            aspectRatio="1"
            objectFit="cover"
            radius="full"
            style={{ width: 64 }}
          />
        </div>
      </div>
    </section>
  );
}

function ThumbnailLab() {
  const [size, setSize] = useState<ThumbnailSize>("md");
  const [aspect, setAspect] = useState<ThumbnailAspect>("square");
  const [selected, setSelected] = useState(false);

  const demoSrc =
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80";

  return (
    <section className="catalog-group" aria-labelledby="thumbnail-lab-heading">
      <h2 id="thumbnail-lab-heading">072 Thumbnail</h2>
      <p className="catalog-group-desc">
        Compact previews for lists and media. Cover for photos; contain for
        documents. Keep overlays sparse. Sizes map to control-height tokens.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Size"
          presentation="listbox"
          options={[
            { value: "xs", label: "XS" },
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
            { value: "xl", label: "XL" },
          ]}
          value={size}
          onValueChange={(v) => setSize(v as ThumbnailSize)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Aspect"
            presentation="listbox"
            options={[
              { value: "square", label: "Square" },
              { value: "portrait", label: "Portrait" },
              { value: "landscape", label: "Landscape" },
            ]}
            value={aspect}
            onValueChange={(v) => setAspect(v as ThumbnailAspect)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Switch
            label="Selected"
            checked={selected}
            onCheckedChange={setSelected}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            gap: 12,
          }}
        >
          <Thumbnail
            src={demoSrc}
            alt="Abstract preview"
            size={size}
            aspect={aspect}
            kind="image"
            selected={selected}
            showSelection
            interactive
            onActivate={() => setSelected((s) => !s)}
          />
          <Thumbnail
            src={demoSrc}
            alt="Video clip"
            size={size}
            aspect="landscape"
            kind="video"
            showPlay
            duration="3:42"
            interactive
            aria-label="Play video clip"
          />
          <Thumbnail
            size={size}
            aspect="square"
            kind="document"
            fileType="PDF"
            alt="Report.pdf"
          />
          <Thumbnail size={size} kind="file" alt="Attachment" />
          <Thumbnail size={size} kind="generic" loading />
        </div>
      </div>
    </section>
  );
}

function MediaObjectLab() {
  const [density, setDensity] = useState<MediaObjectDensity>("comfortable");
  const [mediaSize, setMediaSize] = useState<MediaObjectMediaSize>("md");
  const [layout, setLayout] = useState<MediaObjectLayout>("auto");
  const [mediaPosition, setMediaPosition] =
    useState<MediaObjectMediaPosition>("leading");

  const demoSrc =
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80";

  return (
    <section className="catalog-group" aria-labelledby="media-object-lab-heading">
      <h2 id="media-object-lab-heading">073 Media Object</h2>
      <p className="catalog-group-desc">
        Media with adjacent text. Fixed media box; body never collapses. Auto
        stacks when narrow. Split interactivity when trailing controls exist.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Density"
          presentation="listbox"
          options={[
            { value: "compact", label: "Compact" },
            { value: "comfortable", label: "Comfortable" },
            { value: "spacious", label: "Spacious" },
          ]}
          value={density}
          onValueChange={(v) => setDensity(v as MediaObjectDensity)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Media size"
            presentation="listbox"
            options={[
              { value: "xs", label: "XS" },
              { value: "sm", label: "SM" },
              { value: "md", label: "MD" },
              { value: "lg", label: "LG" },
              { value: "xl", label: "XL" },
            ]}
            value={mediaSize}
            onValueChange={(v) => setMediaSize(v as MediaObjectMediaSize)}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <Select
            label="Layout"
            presentation="listbox"
            options={[
              { value: "auto", label: "Auto" },
              { value: "horizontal", label: "Horizontal" },
              { value: "stack", label: "Stack" },
            ]}
            value={layout}
            onValueChange={(v) => setLayout(v as MediaObjectLayout)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Select
            label="Media position"
            presentation="listbox"
            options={[
              { value: "leading", label: "Leading" },
              { value: "trailing", label: "Trailing" },
            ]}
            value={mediaPosition}
            onValueChange={(v) =>
              setMediaPosition(v as MediaObjectMediaPosition)
            }
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <MediaObject
            density={density}
            mediaSize={mediaSize}
            layout={layout}
            mediaPosition={mediaPosition}
            interactive
            href="#media-object-person"
            media={<Avatar name="Ada Lovelace" size="md" />}
            title="Ada Lovelace"
            description="Mathematician · Analytical Engine"
            metadata="Online"
          />

          <MediaObject
            density={density}
            mediaSize={mediaSize}
            layout={layout}
            mediaPosition={mediaPosition}
            interactive
            hasTrailingActions
          >
            <MediaObject.Media>
              <Thumbnail
                src={demoSrc}
                alt="Cover preview"
                size="md"
                aspect="square"
              />
            </MediaObject.Media>
            <MediaObject.Body>
              <MediaObject.Title href="#media-object-doc">
                Quarterly report with an intentionally long title that must wrap
                without collapsing the media region
              </MediaObject.Title>
              <MediaObject.Description>
                Finance summary for Q3 — figures, notes, and shared comments.
              </MediaObject.Description>
              <MediaObject.Metadata>PDF · 2.4 MB</MediaObject.Metadata>
              <MediaObject.Status>Shared</MediaObject.Status>
            </MediaObject.Body>
            <MediaObject.Trailing>
              <MediaObject.Actions>
                <IconButton
                  label="More"
                  variant="subtle"
                  size="sm"
                  icon={<MoreIcon />}
                />
              </MediaObject.Actions>
            </MediaObject.Trailing>
          </MediaObject>

          <MediaObject
            density={density}
            mediaSize={mediaSize}
            layout={layout}
            mediaPosition={mediaPosition}
            media={
              <span aria-hidden="true" style={{ fontSize: 18 }}>
                ▣
              </span>
            }
            title="notes.txt"
            metadata="Text file"
          />
        </div>
      </div>
    </section>
  );
}

function IconContainerLab() {
  const [size, setSize] = useState<IconContainerSize>("md");
  const [shape, setShape] = useState<IconContainerShape>("transparent");
  const [tone, setTone] = useState<IconContainerTone>("neutral");

  const demoIcon = (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 14.2 9h5.8l-4.7 3.4 1.8 5.6L12 14.8 7 18l1.8-5.6L4 9h5.8L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <section
      className="catalog-group"
      aria-labelledby="icon-container-lab-heading"
    >
      <h2 id="icon-container-lab-heading">074 Icon Container</h2>
      <p className="catalog-group-desc">
        Quiet frame for icons. Optically centered. Default shape is transparent —
        do not force colored circles. Tones use semantic tokens only.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Size"
          presentation="listbox"
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
          ]}
          value={size}
          onValueChange={(v) => setSize(v as IconContainerSize)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Shape"
            presentation="listbox"
            options={[
              { value: "transparent", label: "Transparent" },
              { value: "square", label: "Square" },
              { value: "rounded", label: "Rounded square" },
              { value: "circle", label: "Circle" },
            ]}
            value={shape}
            onValueChange={(v) => setShape(v as IconContainerShape)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Select
            label="Tone"
            presentation="listbox"
            options={[
              { value: "neutral", label: "Neutral" },
              { value: "positive", label: "Positive" },
              { value: "warning", label: "Warning" },
              { value: "negative", label: "Negative" },
              { value: "informational", label: "Informational" },
            ]}
            value={tone}
            onValueChange={(v) => setTone(v as IconContainerTone)}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
          }}
        >
          <IconContainer size={size} shape={shape} tone={tone} icon={demoIcon} />
          <IconContainer
            size={size}
            shape="rounded"
            tone="informational"
            icon={demoIcon}
          />
          <IconContainer
            size={size}
            shape="circle"
            tone="positive"
            decorative={false}
            label="Success"
            icon={demoIcon}
          />
          <IconContainer
            size={size}
            shape="square"
            tone="warning"
            icon={demoIcon}
          />
          <IconContainer
            size={size}
            shape="transparent"
            tone="negative"
            icon={demoIcon}
          />
        </div>
      </div>
    </section>
  );
}

function IllustrationLab() {
  const [illSize, setIllSize] = useState<IllustrationSize>("md");
  const [align, setAlign] = useState<IllustrationAlign>("center");
  const [fit, setFit] = useState<IllustrationFit>("contain");

  const emptySvg = (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden="true">
      <rect
        x="28"
        y="28"
        width="104"
        height="72"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M28 52h104M52 28v24M108 28v24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="80" cy="78" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M80 74v8M76 78h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <section
      className="catalog-group"
      aria-labelledby="illustration-lab-heading"
    >
      <h2 id="illustration-lab-heading">075 Illustration</h2>
      <p className="catalog-group-desc">
        Presentation container for conceptual visuals. Contain/natural only —
        never distort. Modest by default; hero is explicit. No default
        animation.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Size"
          presentation="listbox"
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
            { value: "hero", label: "Hero" },
          ]}
          value={illSize}
          onValueChange={(v) => setIllSize(v as IllustrationSize)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Align"
            presentation="listbox"
            options={[
              { value: "start", label: "Start" },
              { value: "center", label: "Center" },
              { value: "end", label: "End" },
            ]}
            value={align}
            onValueChange={(v) => setAlign(v as IllustrationAlign)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Select
            label="Fit"
            presentation="listbox"
            options={[
              { value: "contain", label: "Contain" },
              { value: "natural", label: "Natural" },
            ]}
            value={fit}
            onValueChange={(v) => setFit(v as IllustrationFit)}
          />
        </div>

        <Illustration
          size={illSize}
          align={align}
          fit={fit}
          purpose="empty"
          alt="Empty folder — nothing here yet"
        >
          {emptySvg}
        </Illustration>

        <div style={{ marginTop: 24 }}>
          <Illustration
            size="sm"
            align="start"
            purpose="success"
            decorative
          >
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle
                cx="32"
                cy="32"
                r="22"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m22 33 7 7 14-16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Illustration>
        </div>
      </div>
    </section>
  );
}

function CoverMediaLab() {
  const [aspect, setAspect] = useState<CoverMediaAspect>("standard");
  const [focal, setFocal] = useState<CoverMediaFocal>("top");
  const [fit, setFit] = useState<CoverMediaFit>("cover");

  const demoSrc =
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80";

  return (
    <section
      className="catalog-group"
      aria-labelledby="cover-media-lab-heading"
    >
      <h2 id="cover-media-lab-heading">076 Cover Media</h2>
      <p className="catalog-group-desc">
        Fills a rectangle with controlled cropping. Focal points matter for
        portraits — do not blind center-crop. Solid scrim for overlay text, not
        a heavy gradient.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Aspect"
          presentation="listbox"
          options={[
            { value: "compact", label: "Compact (4:3)" },
            { value: "standard", label: "Standard (16:9)" },
            { value: "wide", label: "Wide (2:1)" },
            { value: "hero", label: "Hero (21:9)" },
          ]}
          value={aspect}
          onValueChange={(v) => setAspect(v as CoverMediaAspect)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Focal"
            presentation="listbox"
            options={[
              { value: "top", label: "Top" },
              { value: "center", label: "Center" },
              { value: "bottom", label: "Bottom" },
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ]}
            value={focal}
            onValueChange={(v) => setFocal(v as CoverMediaFocal)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Select
            label="Fit"
            presentation="listbox"
            options={[
              { value: "cover", label: "Cover" },
              { value: "contain", label: "Contain" },
            ]}
            value={fit}
            onValueChange={(v) => setFit(v as CoverMediaFit)}
          />
        </div>

        <CoverMedia
          src={demoSrc}
          alt="Team collaborating at a table"
          aspect={aspect}
          focal={focal}
          objectFit={fit}
          radius="sm"
        >
          <CoverMedia.Overlay>
            <strong>Design systems meetup</strong>
          </CoverMedia.Overlay>
          <CoverMedia.Caption>Q3 kickoff workshop</CoverMedia.Caption>
          <CoverMedia.Metadata>San Francisco · 2026</CoverMedia.Metadata>
        </CoverMedia>
      </div>
    </section>
  );
}

function MediaPreviewLab() {
  const [kind, setKind] = useState<MediaPreviewKind>("video");
  const [size, setSize] = useState<MediaPreviewSize>("md");

  const demoSrc =
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80";

  const playIcon = (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 5.5v9l8-4.5-8-4.5z" fill="currentColor" />
    </svg>
  );
  const downloadIcon = (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 3.5v9M6.5 9.5 10 13l3.5-3.5M4.5 15.5h11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  const expandIcon = (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4.5 8V4.5H8M12 4.5h3.5V8M15.5 12v3.5H12M8 15.5H4.5V12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <section
      className="catalog-group"
      aria-labelledby="media-preview-lab-heading"
    >
      <h2 id="media-preview-lab-heading">077 Media Preview</h2>
      <p className="catalog-group-desc">
        Larger preview — not a lightbox or full player. Video shows poster +
        play mark. Actions compose IconButton.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <Select
          label="Kind"
          presentation="listbox"
          options={[
            { value: "image", label: "Image" },
            { value: "video", label: "Video" },
            { value: "document", label: "Document" },
            { value: "audio", label: "Audio" },
            { value: "generic", label: "Generic" },
          ]}
          value={kind}
          onValueChange={(v) => setKind(v as MediaPreviewKind)}
        />
        <div style={{ marginBlock: 12, marginBottom: 16 }}>
          <Select
            label="Size"
            presentation="listbox"
            options={[
              { value: "sm", label: "Small" },
              { value: "md", label: "Medium" },
              { value: "lg", label: "Large" },
            ]}
            value={size}
            onValueChange={(v) => setSize(v as MediaPreviewSize)}
          />
        </div>

        <MediaPreview
          kind={kind}
          size={size}
          src={kind === "document" || kind === "generic" ? undefined : demoSrc}
          poster={kind === "video" ? demoSrc : undefined}
          alt="Abstract media preview"
          title={
            kind === "video"
              ? "Product demo"
              : kind === "document"
                ? "Quarterly report"
                : kind === "audio"
                  ? "Podcast episode"
                  : "Preview asset"
          }
          type={
            kind === "video"
              ? "MP4"
              : kind === "document"
                ? "PDF"
                : kind === "audio"
                  ? "MP3"
                  : "PNG"
          }
          duration={kind === "video" || kind === "audio" ? "3:42" : undefined}
          fileSize="2.4 MB"
          status={kind === "generic" ? "Unavailable" : "Ready"}
          interactive
          onOpen={() => undefined}
        >
          <MediaPreview.Actions>
            <IconButton
              label="Play"
              size="sm"
              variant="subtle"
              icon={playIcon}
            />
            <IconButton
              label="Download"
              size="sm"
              variant="subtle"
              icon={downloadIcon}
            />
            <IconButton
              label="Expand"
              size="sm"
              variant="subtle"
              icon={expandIcon}
            />
          </MediaPreview.Actions>
        </MediaPreview>
      </div>
    </section>
  );
}

function ImagePlaceholderLab() {
  const [state, setState] = useState<ImagePlaceholderState>("missing");
  const [aspect, setAspect] = useState<ImagePlaceholderAspect>("landscape");

  return (
    <section
      className="catalog-group"
      aria-labelledby="image-placeholder-lab-heading"
    >
      <h2 id="image-placeholder-lab-heading">078 Image Placeholder</h2>
      <p className="catalog-group-desc">
        Media region without available media — not Skeleton. Neutral unless
        state is error. Aspect-locked to avoid layout shift.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <Select
          label="State"
          presentation="listbox"
          options={[
            { value: "loading", label: "Loading" },
            { value: "missing", label: "Missing" },
            { value: "unavailable", label: "Unavailable" },
            { value: "error", label: "Error" },
          ]}
          value={state}
          onValueChange={(v) => setState(v as ImagePlaceholderState)}
        />
        <div style={{ marginBlock: 12, marginBottom: 16 }}>
          <Select
            label="Aspect"
            presentation="listbox"
            options={[
              { value: "square", label: "Square" },
              { value: "portrait", label: "Portrait" },
              { value: "landscape", label: "Landscape" },
              { value: "wide", label: "Wide" },
            ]}
            value={aspect}
            onValueChange={(v) => setAspect(v as ImagePlaceholderAspect)}
          />
        </div>

        <ImagePlaceholder
          state={state}
          aspect={aspect}
          mediaType="image"
          typeLabel="PNG"
          message={
            state === "error"
              ? "Couldn’t load"
              : state === "loading"
                ? "Loading"
                : state === "unavailable"
                  ? "Unavailable"
                  : "No image"
          }
        />
      </div>
    </section>
  );
}

function MediaOverlayLab() {
  const [placement, setPlacement] = useState<MediaOverlayPlacement>("bottom");
  const [protection, setProtection] =
    useState<MediaOverlayProtection>("subtle");

  const demoSrc =
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80";

  return (
    <section
      className="catalog-group"
      aria-labelledby="media-overlay-lab-heading"
    >
      <h2 id="media-overlay-lab-heading">079 Media Overlay</h2>
      <p className="catalog-group-desc">
        Controlled content over media. Solid scrim for contrast — not a heavy
        gradient. Hover enhances only; actions stay reachable.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Placement"
          presentation="listbox"
          options={[
            { value: "top", label: "Top" },
            { value: "bottom", label: "Bottom" },
            { value: "corner", label: "Corner" },
            { value: "full", label: "Full" },
          ]}
          value={placement}
          onValueChange={(v) => setPlacement(v as MediaOverlayPlacement)}
        />
        <div style={{ marginBlock: 12, marginBottom: 16 }}>
          <Select
            label="Protection"
            presentation="listbox"
            options={[
              { value: "none", label: "None" },
              { value: "subtle", label: "Subtle" },
              { value: "medium", label: "Medium" },
            ]}
            value={protection}
            onValueChange={(v) => setProtection(v as MediaOverlayProtection)}
          />
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            borderRadius: "var(--radius-3, 8px)",
          }}
        >
          <img
            src={demoSrc}
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <MediaOverlay
            placement={placement}
            corner="end-end"
            protection={protection}
            showPlay={placement === "full"}
            aria-label="Product demo overlay"
          >
            <MediaOverlay.Title>Product demo</MediaOverlay.Title>
            <MediaOverlay.Metadata>Design systems meetup</MediaOverlay.Metadata>
            <MediaOverlay.Duration>3:42</MediaOverlay.Duration>
            <MediaOverlay.Status>Ready</MediaOverlay.Status>
            <MediaOverlay.Action>
              <IconButton
                label="More"
                size="sm"
                variant="subtle"
                icon={<MoreIcon />}
              />
            </MediaOverlay.Action>
          </MediaOverlay>
        </div>
      </div>
    </section>
  );
}

function MediaMetadataLab() {
  const [density, setDensity] = useState<MediaMetadataDensity>("standard");

  return (
    <section
      className="catalog-group"
      aria-labelledby="media-metadata-lab-heading"
    >
      <h2 id="media-metadata-lab-heading">080 Media Metadata</h2>
      <p className="catalog-group-desc">
        Secondary media details. Wraps on narrow viewports. Localizable size,
        duration, dimensions, and date helpers.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <Select
          label="Density"
          presentation="listbox"
          options={[
            { value: "compact", label: "Compact" },
            { value: "standard", label: "Standard" },
          ]}
          value={density}
          onValueChange={(v) => setDensity(v as MediaMetadataDensity)}
        />

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <p className="catalog-group-desc" style={{ marginBottom: 8 }}>
              Photo
            </p>
            <MediaMetadata density={density} aria-label="Photo details">
              <MediaMetadata.Item kind="type">Photo</MediaMetadata.Item>
              <MediaMetadata.Item kind="size">
                {formatMediaFileSize(2_400_000)}
              </MediaMetadata.Item>
              <MediaMetadata.Item kind="dimensions">
                {formatMediaDimensions(1920, 1080)}
              </MediaMetadata.Item>
            </MediaMetadata>
          </div>

          <div>
            <p className="catalog-group-desc" style={{ marginBottom: 8 }}>
              Video
            </p>
            <MediaMetadata density={density} aria-label="Video details">
              <MediaMetadata.Item kind="type">Video</MediaMetadata.Item>
              <MediaMetadata.Item kind="duration">
                {formatMediaDuration(272)}
              </MediaMetadata.Item>
              <MediaMetadata.Item kind="custom" label="Resolution">
                1080p
              </MediaMetadata.Item>
            </MediaMetadata>
          </div>

          <div>
            <p className="catalog-group-desc" style={{ marginBottom: 8 }}>
              Document
            </p>
            <MediaMetadata density={density} aria-label="Document details">
              <MediaMetadata.Item kind="type">Document</MediaMetadata.Item>
              <MediaMetadata.Item kind="custom" label="Format">
                PDF
              </MediaMetadata.Item>
              <MediaMetadata.Item kind="custom" label="Pages">
                2 pages
              </MediaMetadata.Item>
              <MediaMetadata.Item kind="date">
                {formatMediaDate("2026-08-07")}
              </MediaMetadata.Item>
              <MediaMetadata.Item kind="author">Ada Lovelace</MediaMetadata.Item>
              <MediaMetadata.Item kind="status" label="Status">
                Shared
              </MediaMetadata.Item>
            </MediaMetadata>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeadingLab() {
  const [level, setLevel] = useState<HeadingLevel>(2);
  const [size, setSize] = useState<HeadingSize | "auto">("auto");
  const [align, setAlign] = useState<HeadingAlign>("start");

  return (
    <section className="catalog-group" aria-labelledby="heading-lab-heading">
      <h2 id="heading-lab-heading">082 Heading</h2>
      <p className="catalog-group-desc">
        Semantic h1–h6 with visual size independent of level. Wrap by default —
        do not truncate important titles. Hierarchy via size and weight, not
        color alone.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Level (semantic)"
          presentation="listbox"
          options={[
            { value: "1", label: "H1" },
            { value: "2", label: "H2" },
            { value: "3", label: "H3" },
            { value: "4", label: "H4" },
            { value: "5", label: "H5" },
            { value: "6", label: "H6" },
          ]}
          value={String(level)}
          onValueChange={(v) => setLevel(Number(v) as HeadingLevel)}
        />
        <div style={{ marginBlock: 12 }}>
          <Select
            label="Size (visual)"
            presentation="listbox"
            options={[
              { value: "auto", label: "Auto from level" },
              { value: "display", label: "Display" },
              { value: "title", label: "Title" },
              { value: "lg", label: "Large" },
              { value: "md", label: "Medium" },
              { value: "sm", label: "Small" },
              { value: "xs", label: "Extra small" },
            ]}
            value={size}
            onValueChange={(v) => setSize(v as HeadingSize | "auto")}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Select
            label="Align"
            presentation="listbox"
            options={[
              { value: "start", label: "Start" },
              { value: "center", label: "Center" },
              { value: "end", label: "End" },
            ]}
            value={align}
            onValueChange={(v) => setAlign(v as HeadingAlign)}
          />
        </div>

        <Heading
          level={level}
          size={size === "auto" ? undefined : size}
          align={align}
          subtitle="Visual size can diverge from semantic level when the layout requires it."
        >
          Product overview with a longer title that wraps naturally on narrow
          widths
        </Heading>

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <Heading level={2} size="md">
            Section title sized like a typical H3
          </Heading>
          <Heading level={3} size="lg">
            Subsection visually emphasized without changing outline logic
          </Heading>
        </div>
      </div>
    </section>
  );
}

function ParagraphLab() {
  const [variant, setVariant] = useState<ParagraphVariant>("standard");
  const [measure, setMeasure] = useState<ParagraphMeasure>("reading");

  return (
    <section
      className="catalog-group"
      aria-labelledby="paragraph-lab-heading"
    >
      <h2 id="paragraph-lab-heading">083 Paragraph</h2>
      <p className="catalog-group-desc">
        Readable body content. Variants map to global tokens only. Reading
        measure caps desktop width; consecutive paragraphs share modest rhythm.
      </p>

      <div className="lab-block" style={{ maxWidth: "48rem" }}>
        <Select
          label="Variant"
          presentation="listbox"
          options={[
            { value: "standard", label: "Standard" },
            { value: "lead", label: "Lead" },
            { value: "secondary", label: "Secondary" },
          ]}
          value={variant}
          onValueChange={(v) => setVariant(v as ParagraphVariant)}
        />
        <div style={{ marginBlock: 12, marginBottom: 16 }}>
          <Select
            label="Measure"
            presentation="listbox"
            options={[
              { value: "reading", label: "Reading" },
              { value: "none", label: "None (full width)" },
            ]}
            value={measure}
            onValueChange={(v) => setMeasure(v as ParagraphMeasure)}
          />
        </div>

        <Paragraph variant="lead" measure={measure}>
          Lead paragraphs introduce a section with slightly larger body type
          from existing tokens — not an arbitrary size.
        </Paragraph>
        <Paragraph variant={variant} measure={measure}>
          Use paragraphs for descriptions, instructions, and explanations.
          Inline <a href="#paragraph-docs">links</a> stay underlined with visible
          focus, and <strong>emphasis</strong> remains accessible. Long lines wrap
          naturally without manual line breaks.
        </Paragraph>
        <Paragraph variant="secondary" measure={measure}>
          Secondary paragraphs carry supporting notes in a quieter token color.
        </Paragraph>
      </div>
    </section>
  );
}

function LabelLab() {
  const [size, setSize] = useState<LabelSize>("md");
  const [required, setRequired] = useState(true);
  const [optional, setOptional] = useState(false);
  const [error, setError] = useState(false);

  return (
    <section className="catalog-group" aria-labelledby="label-lab-heading">
      <h2 id="label-lab-heading">084 Label</h2>
      <p className="catalog-group-desc">
        Identifies controls and content — not Caption. Associates via htmlFor.
        Required/optional are not color-only. Long labels wrap.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <Select
          label="Size"
          presentation="listbox"
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
          ]}
          value={size}
          onValueChange={(v) => setSize(v as LabelSize)}
        />
        <div style={{ marginBlock: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <Switch
            label="Required"
            checked={required}
            onCheckedChange={(v) => {
              setRequired(v);
              if (v) setOptional(false);
            }}
          />
          <Switch
            label="Optional"
            checked={optional}
            onCheckedChange={(v) => {
              setOptional(v);
              if (v) setRequired(false);
            }}
          />
          <Switch label="Error context" checked={error} onCheckedChange={setError} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label
              htmlFor="label-lab-email"
              size={size}
              required={required}
              optional={optional}
              error={error}
            >
              Email address
            </Label>
            <input
              id="label-lab-email"
              type="email"
              placeholder="you@example.com"
              required={required}
              disabled={false}
              aria-invalid={error || undefined}
              style={{
                boxSizing: "border-box",
                width: "100%",
                minHeight: "var(--control-height-md, 40px)",
                paddingInline: "12px",
                border: "1px solid var(--color-border-default, #d2d2d7)",
                borderRadius: "var(--radius-2, 6px)",
                font: "inherit",
              }}
            />
          </div>

          <Label size={size} required showRequiredLabel>
            Visible required word
          </Label>

          <Label size={size}>
            Preference name that may become quite long after localization and
            should wrap instead of forcing a single cramped line
          </Label>
        </div>
      </div>
    </section>
  );
}

function CaptionLab() {
  const [mode, setMode] = useState<CaptionMode>("multiline");
  const [size, setSize] = useState<CaptionSize>("md");

  return (
    <section className="catalog-group" aria-labelledby="caption-lab-heading">
      <h2 id="caption-lab-heading">085 Caption</h2>
      <p className="catalog-group-desc">
        Secondary explanatory text — not Label. Readable caption tokens.
        Associate via figcaption or aria-describedby. Not for primary
        instructions or sole warnings.
      </p>

      <div className="lab-block" style={{ maxWidth: "28rem" }}>
        <Select
          label="Mode"
          presentation="listbox"
          options={[
            { value: "short", label: "Short" },
            { value: "multiline", label: "Multiline" },
          ]}
          value={mode}
          onValueChange={(v) => setMode(v as CaptionMode)}
        />
        <div style={{ marginBlock: 12, marginBottom: 16 }}>
          <Select
            label="Size"
            presentation="listbox"
            options={[
              { value: "sm", label: "Small" },
              { value: "md", label: "Medium" },
            ]}
            value={size}
            onValueChange={(v) => setSize(v as CaptionSize)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <figure style={{ margin: 0 }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                background: "var(--color-surface-secondary, #f5f5f7)",
                borderRadius: "var(--radius-2, 6px)",
              }}
              role="img"
              aria-label="Workshop photo placeholder"
            />
            <Caption as="figcaption" mode={mode} size={size} style={{ marginTop: 8 }}>
              Design systems meetup — supporting image description
            </Caption>
          </figure>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label htmlFor="caption-lab-field">Display name</Label>
            <input
              id="caption-lab-field"
              aria-describedby="caption-lab-hint"
              style={{
                boxSizing: "border-box",
                width: "100%",
                minHeight: "var(--control-height-md, 40px)",
                paddingInline: "12px",
                border: "1px solid var(--color-border-default, #d2d2d7)",
                borderRadius: "var(--radius-2, 6px)",
                font: "inherit",
              }}
            />
            <Caption id="caption-lab-hint" mode="multiline" size={size}>
              Shown on your public profile. Supporting hint only — not a primary
              instruction.
            </Caption>
          </div>

          <Caption mode="short" size={size}>
            Updated 2 hours ago
          </Caption>
        </div>
      </div>
    </section>
  );
}

function LinkLab() {
  const [variant, setVariant] = useState<LinkVariant>("inline");

  return (
    <section className="catalog-group" aria-labelledby="link-lab-heading">
      <h2 id="link-lab-heading">086 Link</h2>
      <p className="catalog-group-desc">
        Real navigation anchors — not Button. Underline distinguishes links
        without color alone. External icon is opt-in. Long URLs wrap.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <Select
          label="Variant"
          presentation="listbox"
          options={[
            { value: "inline", label: "Inline" },
            { value: "standalone", label: "Standalone" },
          ]}
          value={variant}
          onValueChange={(v) => setVariant(v as LinkVariant)}
        />

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <Paragraph measure="none">
            Inline with body copy: read the{" "}
            <Link href="#link-docs" variant={variant}>
              documentation
            </Link>{" "}
            or jump to{" "}
            <Link href="#section-api" variant={variant}>
              API reference
            </Link>
            .
          </Paragraph>

          <Link href="/settings" variant="standalone">
            Account settings
          </Link>

          <Link
            href="https://example.com/docs"
            variant="standalone"
            target="_blank"
            external
          >
            External documentation
          </Link>

          <Link
            href="https://example.com/very/long/path/to/a/resource/that-should-wrap-without-breaking-layout"
            variant="standalone"
          >
            https://example.com/very/long/path/to/a/resource/that-should-wrap-without-breaking-layout
          </Link>
        </div>
      </div>
    </section>
  );
}

function CodeLab() {
  const [variant, setVariant] = useState<CodeVariant>("inline");
  const [overflow, setOverflow] = useState<CodeOverflow>("wrap");

  return (
    <section className="catalog-group" aria-labelledby="code-lab-heading">
      <h2 id="code-lab-heading">087 Code</h2>
      <p className="catalog-group-desc">
        Short inline technical content — monospace only, no syntax highlighting.
        Compact surface; long tokens wrap or scroll without careless breaks.
      </p>

      <div className="lab-block" style={{ maxWidth: "36rem" }}>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          }}
        >
          <Select
            label="Variant"
            presentation="listbox"
            options={[
              { value: "inline", label: "Inline" },
              { value: "identifier", label: "Identifier" },
              { value: "keyboard", label: "Keyboard" },
            ]}
            value={variant}
            onValueChange={(v) => setVariant(v as CodeVariant)}
          />
          <Select
            label="Overflow"
            presentation="listbox"
            options={[
              { value: "wrap", label: "Wrap" },
              { value: "nowrap", label: "Nowrap" },
              { value: "scroll", label: "Scroll" },
            ]}
            value={overflow}
            onValueChange={(v) => setOverflow(v as CodeOverflow)}
          />
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <Paragraph measure="none">
            Install with <Code variant={variant} overflow={overflow}>npm install</Code> then
            set <Code variant="identifier">userId</Code>.
          </Paragraph>

          <Paragraph measure="none">
            Query: <Code>SELECT *</Code> — open search with{" "}
            <Code variant="keyboard">Ctrl + K</Code>.
          </Paragraph>

          <Paragraph measure="none">
            Long identifier (scroll default):{" "}
            <Code variant="identifier">
              VeryLongPackageNamespace.InternalModule.exportNameThatMustStayIntact
            </Code>
          </Paragraph>

          <Paragraph measure="none">
            Controlled overflow demo:{" "}
            <Code variant={variant} overflow={overflow}>
              path/to/extremely/long/module/identifier-that-should-not-break-meaning
            </Code>
          </Paragraph>
        </div>
      </div>
    </section>
  );
}

const CODE_BLOCK_SAMPLE = `function greet(name: string) {
  // Prefer explicit returns
  const message = \`Hello, \${name}\`;
  console.log(message);
  return message;
}

export const userId = "u_01HXYZ";
`;

const CODE_BLOCK_LONG = Array.from({ length: 24 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `line_${n}: value_${n}_and_a_very_long_token_that_should_scroll_horizontally_when_overflow_is_scroll`;
}).join("\n");

function CodeBlockCheckGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M4.5 10.5 8 14l7.5-8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodeBlockLab() {
  const [overflow, setOverflow] = useState<CodeBlockOverflow>("scroll");
  const [lineNumbers, setLineNumbers] = useState("on");
  const [demoState, setDemoState] = useState("idle");

  return (
    <section className="catalog-group" aria-labelledby="code-block-lab-heading">
      <h2 id="code-block-lab-heading">088 Code Block</h2>
      <p className="catalog-group-desc">
        Multiline source — language label, optional line numbers (not copied),
        copy via IconButton, scroll by default, optional wrap, highlighted lines,
        collapse, and loading/empty/error. Code stays LTR.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          }}
        >
          <Select
            label="Overflow"
            presentation="listbox"
            options={[
              { value: "scroll", label: "Scroll (default)" },
              { value: "wrap", label: "Wrap" },
            ]}
            value={overflow}
            onValueChange={(v) => setOverflow(v as CodeBlockOverflow)}
          />
          <Select
            label="Line numbers"
            presentation="listbox"
            options={[
              { value: "on", label: "On" },
              { value: "off", label: "Off" },
            ]}
            value={lineNumbers}
            onValueChange={setLineNumbers}
          />
          <Select
            label="State"
            presentation="listbox"
            options={[
              { value: "idle", label: "Idle" },
              { value: "loading", label: "Loading" },
              { value: "empty", label: "Empty" },
              { value: "error", label: "Error" },
            ]}
            value={demoState}
            onValueChange={setDemoState}
          />
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 20 }}>
          <CodeBlock
            language="TypeScript"
            showLineNumbers={lineNumbers === "on"}
            overflow={overflow}
            highlightedLines={[2, 6]}
            defaultCollapsed
            collapsedLines={6}
            maxHeight="16rem"
            state={
              demoState === "idle"
                ? undefined
                : (demoState as "loading" | "empty" | "error")
            }
            code={demoState === "empty" ? "" : CODE_BLOCK_LONG}
            copyAction={({ copy, copied, copyLabel, copiedLabel, disabled }) => (
              <IconButton
                size="sm"
                variant="subtle"
                label={copied ? copiedLabel : copyLabel}
                icon={copied ? <CodeBlockCheckGlyph /> : <CopyGlyph />}
                disabled={disabled}
                onClick={() => {
                  void copy();
                }}
              />
            )}
          />

          <CodeBlock
            language="ts"
            showLineNumbers
            overflow="scroll"
            code={CODE_BLOCK_SAMPLE}
            maxHeight="14rem"
          >
            <span className="dk-code-block__line">
              <span className="dk-code-block__line-no" aria-hidden="true">
                1
              </span>
              <span className="dk-code-block__line-text">
                <span data-dk-token="keyword">function</span>{" "}
                <span data-dk-token="punctuation">greet</span>
                <span data-dk-token="punctuation">(</span>
                name<span data-dk-token="punctuation">:</span> string
                <span data-dk-token="punctuation">)</span>{" "}
                <span data-dk-token="punctuation">{"{"}</span>
              </span>
            </span>
            <span className="dk-code-block__line dk-code-block__line--highlight" data-line={2}>
              <span className="dk-code-block__line-no" aria-hidden="true">
                2
              </span>
              <span className="dk-code-block__line-text">
                {"  "}
                <span data-dk-token="comment">{"// Prefer explicit returns"}</span>
              </span>
            </span>
            <span className="dk-code-block__line">
              <span className="dk-code-block__line-no" aria-hidden="true">
                3
              </span>
              <span className="dk-code-block__line-text">
                {"  "}
                <span data-dk-token="keyword">const</span> message ={" "}
                <span data-dk-token="string">{"`Hello, ${name}`"}</span>
                <span data-dk-token="punctuation">;</span>
              </span>
            </span>
            <span className="dk-code-block__line">
              <span className="dk-code-block__line-no" aria-hidden="true">
                4
              </span>
              <span className="dk-code-block__line-text">
                {"  "}console.log(message)
                <span data-dk-token="punctuation">;</span>
              </span>
            </span>
            <span className="dk-code-block__line">
              <span className="dk-code-block__line-no" aria-hidden="true">
                5
              </span>
              <span className="dk-code-block__line-text">
                {"  "}
                <span data-dk-token="keyword">return</span> message
                <span data-dk-token="punctuation">;</span>
              </span>
            </span>
            <span className="dk-code-block__line">
              <span className="dk-code-block__line-no" aria-hidden="true">
                6
              </span>
              <span className="dk-code-block__line-text">
                <span data-dk-token="punctuation">{"}"}</span>
              </span>
            </span>
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}

function BlockquoteLab() {
  const [size, setSize] = useState<BlockquoteSize>("standard");

  return (
    <section className="catalog-group" aria-labelledby="blockquote-lab-heading">
      <h2 id="blockquote-lab-heading">089 Blockquote</h2>
      <p className="catalog-group-desc">
        Quoted content — border, spacing, and typography only. Citation is
        secondary. Source links use Link. Not a testimonial or marketing quote.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Size"
          presentation="listbox" 
          options={[
            { value: "standard", label: "Standard" },
            { value: "compact", label: "Compact" },
          ]}
          value={size}
          onValueChange={(v) => setSize(v as BlockquoteSize)}
        />

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 24 }}>
          <Blockquote
            size={size}
            author="Ada Lovelace"
            source="Notes on the Analytical Engine"
            sourceHref="https://example.com/analytical-engine"
            sourceExternal
            cite="https://example.com/analytical-engine"
          >
            The Analytical Engine weaves algebraical patterns just as the Jacquard
            loom weaves flowers and leaves. Long quotations wrap naturally on
            narrow viewports without horizontal scrolling or forced truncation.
          </Blockquote>

          <Blockquote
            size={size}
            author="Design Constitution"
            source={
              <Link href="#typography-constitution" variant="inline">
                Typography & Content
              </Link>
            }
          >
            Typography must prioritize readability, hierarchy, scannability,
            consistency, accessibility, and localization.
          </Blockquote>

          <Blockquote
            size={size}
            dir="rtl"
            author="مثال"
            source="مصدر عربي"
          >
            هذا اقتباس طويل يجب أن يلتف بشكل طبيعي على الشاشات الضيقة مع الحفاظ على
            حد الاقتباس المنطقي في واجهات من اليمين إلى اليسار.
          </Blockquote>

          <Blockquote size={size} measure="none">
            A short unattributed quotation — still a blockquote, still restrained.
          </Blockquote>
        </div>
      </div>
    </section>
  );
}

function NumberDisplayLab() {
  const [locale, setLocale] = useState("en-US");
  const [compact, setCompact] = useState<NumberDisplayCompact>("never");
  const [format, setFormat] = useState<NumberDisplayFormat>("decimal");

  return (
    <section className="catalog-group" aria-labelledby="number-display-lab-heading">
      <h2 id="number-display-lab-heading">090 Number Display</h2>
      <p className="catalog-group-desc">
        Locale-aware numbers — not a metric card. Compact only when configured.
        Screen readers get the full value. Negatives stay clear without color alone.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          }}
        >
          <Select
            label="Locale"
            presentation="listbox"
            options={[
              { value: "en-US", label: "en-US (1,234.56)" },
              { value: "fr-FR", label: "fr-FR (1 234,56)" },
              { value: "de-DE", label: "de-DE (1.234,56)" },
              { value: "ar-EG", label: "ar-EG" },
            ]}
            value={locale}
            onValueChange={setLocale}
          />
          <Select
            label="Format"
            presentation="listbox"
            options={[
              { value: "integer", label: "Integer" },
              { value: "decimal", label: "Decimal" },
              { value: "currency", label: "Currency" },
              { value: "percent", label: "Percent" },
              { value: "signed", label: "Signed" },
            ]}
            value={format}
            onValueChange={(v) => setFormat(v as NumberDisplayFormat)}
          />
          <Select
            label="Compact"
            presentation="listbox"
            options={[
              { value: "never", label: "Never (default)" },
              { value: "short", label: "Short (1.2K)" },
              { value: "long", label: "Long" },
            ]}
            value={compact}
            onValueChange={(v) => setCompact(v as NumberDisplayCompact)}
          />
        </div>

        <div
          style={{
            marginTop: 20,
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))",
            alignItems: "end",
          }}
        >
          <NumberDisplay
            label="Integer"
            value={42}
            format="integer"
            locale={locale}
            size="lg"
          />
          <NumberDisplay
            label="Grouped"
            value={1284}
            format="integer"
            locale={locale}
            size="lg"
          />
          <NumberDisplay
            label="Currency"
            value={12450.5}
            format="currency"
            currency="USD"
            locale={locale}
            size="lg"
          />
          <NumberDisplay
            label="Percent"
            value={98.4}
            format="percent"
            percentAs="unit"
            locale={locale}
            maximumFractionDigits={1}
            size="lg"
          />
        </div>

        <div
          style={{
            marginTop: 20,
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))",
            alignItems: "end",
          }}
        >
          <NumberDisplay
            label="Live format"
            value={format === "percent" ? 12.7 : format === "currency" ? 12450.5 : 1234.56}
            format={format}
            currency="EUR"
            percentAs="unit"
            locale={locale}
            compact={compact}
            signDisplay={format === "signed" ? "exceptZero" : undefined}
            size="lg"
            trend={format === "signed" || format === "percent" ? "down" : undefined}
            comparison={format === "signed" ? "vs prior" : undefined}
          />
          <NumberDisplay
            label="Negative"
            value={-12.7}
            format="percent"
            percentAs="unit"
            locale={locale}
            maximumFractionDigits={1}
            size="lg"
            tone="negative"
            trend="down"
            comparison="vs last week"
          />
          <NumberDisplay
            label="Compact demo"
            value={4_800_000}
            format="decimal"
            locale={locale}
            compact="short"
            size="lg"
            context="Explicit compact only"
          />
          <NumberDisplay
            label="Unit"
            value={12.5}
            format="unit"
            unit="kilogram"
            locale={locale}
            size="lg"
          />
        </div>

        <div
          style={{
            marginTop: 20,
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))",
            alignItems: "end",
          }}
        >
          <NumberDisplay label="Zero" value={0} format="integer" locale={locale} size="md" />
          <NumberDisplay label="Loading" state="loading" loadingWidthCh={5} size="md" />
          <NumberDisplay label="Unknown" state="unknown" size="md" />
          <NumberDisplay label="N/A" state="unavailable" size="md" />
        </div>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gap: 8,
            gridTemplateColumns: "1fr auto",
            maxWidth: "16rem",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span style={{ color: "var(--color-text-secondary, #6e6e73)" }}>Revenue</span>
          <NumberDisplay
            value={12450.5}
            format="currency"
            currency="USD"
            locale={locale}
            align="end"
            tabular
            size="sm"
          />
          <span style={{ color: "var(--color-text-secondary, #6e6e73)" }}>Refunds</span>
          <NumberDisplay
            value={-320}
            format="currency"
            currency="USD"
            locale={locale}
            align="end"
            tabular
            size="sm"
            tone="negative"
          />
          <span style={{ color: "var(--color-text-secondary, #6e6e73)" }}>Net</span>
          <NumberDisplay
            value={12130.5}
            format="currency"
            currency="USD"
            locale={locale}
            align="end"
            tabular
            size="sm"
          />
        </div>
      </div>
    </section>
  );
}

function ActionButtonGroupLab() {
  const [orientation, setOrientation] =
    useState<ActionButtonGroupOrientation>("horizontal");
  const [density, setDensity] = useState<ActionButtonGroupDensity>("standard");
  const [separation, setSeparation] =
    useState<ActionButtonGroupSeparation>("joined");
  const [overflow, setOverflow] =
    useState<ActionButtonGroupOverflow>("wrap");

  return (
    <section
      className="catalog-group"
      aria-labelledby="action-button-group-lab-heading"
    >
      <h2 id="action-button-group-lab-heading">091 Button Group</h2>
      <p className="catalog-group-desc">
        Action composition cluster — compose Button, keep each action independent.
        Wrap or stack on narrow viewports. For 4+ actions prefer Action Group /
        Overflow. Distinct from Interaction 003.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          }}
        >
          <Select
            label="Orientation"
            presentation="listbox"
            options={[
              { value: "horizontal", label: "Horizontal" },
              { value: "vertical", label: "Vertical" },
            ]}
            value={orientation}
            onValueChange={(v) =>
              setOrientation(v as ActionButtonGroupOrientation)
            }
          />
          <Select
            label="Density"
            presentation="listbox"
            options={[
              { value: "standard", label: "Standard" },
              { value: "compact", label: "Compact" },
            ]}
            value={density}
            onValueChange={(v) => setDensity(v as ActionButtonGroupDensity)}
          />
          <Select
            label="Separation"
            presentation="listbox"
            options={[
              { value: "joined", label: "Joined" },
              { value: "separated", label: "Separated" },
            ]}
            value={separation}
            onValueChange={(v) =>
              setSeparation(v as ActionButtonGroupSeparation)
            }
          />
          <Select
            label="Overflow"
            presentation="listbox"
            options={[
              { value: "wrap", label: "Wrap" },
              { value: "stack", label: "Stack" },
            ]}
            value={overflow}
            onValueChange={(v) => setOverflow(v as ActionButtonGroupOverflow)}
          />
        </div>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h3 className="catalog-subgroup-title">Primary + secondary</h3>
            <ActionButtonGroup
              label="Save document"
              orientation={orientation}
              density={density}
              separation={separation}
              overflow={overflow}
            >
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Save</Button>
            </ActionButtonGroup>
          </div>

          <div>
            <h3 className="catalog-subgroup-title">Three related actions</h3>
            <ActionButtonGroup
              label="View mode"
              orientation={orientation}
              density={density}
              separation={separation}
              overflow={overflow}
            >
              <Button variant="secondary">List</Button>
              <Button variant="secondary">Grid</Button>
              <Button variant="secondary" disabled>
                Board
              </Button>
            </ActionButtonGroup>
          </div>

          <div>
            <h3 className="catalog-subgroup-title">Equal width</h3>
            <ActionButtonGroup
              label="Billing period"
              orientation={orientation}
              density={density}
              separation={separation}
              overflow={overflow}
              equalWidth
            >
              <Button variant="secondary">Monthly</Button>
              <Button variant="primary">Yearly</Button>
            </ActionButtonGroup>
          </div>

          <div>
            <h3 className="catalog-subgroup-title">Long labels (localization)</h3>
            <ActionButtonGroup
              label="Export options"
              orientation={orientation}
              density={density}
              separation="separated"
              overflow={overflow}
            >
              <Button variant="secondary">Als PDF-Dokument exportieren</Button>
              <Button variant="secondary">Als Tabelle speichern</Button>
              <Button variant="primary">Freigeben</Button>
            </ActionButtonGroup>
          </div>
        </div>
      </div>
    </section>
  );
}

function ZoomInIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="4.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M11.75 11.75 16 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8.5 6.5v4M6.5 8.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="4.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M11.75 11.75 16 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M6.5 8.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconButtonGroupLab() {
  const [orientation, setOrientation] =
    useState<IconButtonGroupOrientation>("horizontal");
  const [density, setDensity] = useState<IconButtonGroupDensity>("standard");
  const [separation, setSeparation] =
    useState<IconButtonGroupSeparation>("joined");
  const [overflow, setOverflow] = useState<IconButtonGroupOverflow>("wrap");
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <section
      className="catalog-group"
      aria-labelledby="icon-button-group-lab-heading"
    >
      <h2 id="icon-button-group-lab-heading">092 Icon Button Group</h2>
      <p className="catalog-group-desc">
        Related icon-only actions via Icon Button — labels required, sizes from
        the primitive. Selected uses surface + border + aria-pressed. Prefer
        Overflow Action when the set grows large.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          }}
        >
          <Select
            label="Orientation"
            presentation="listbox"
            options={[
              { value: "horizontal", label: "Horizontal" },
              { value: "vertical", label: "Vertical" },
            ]}
            value={orientation}
            onValueChange={(v) =>
              setOrientation(v as IconButtonGroupOrientation)
            }
          />
          <Select
            label="Density"
            presentation="listbox"
            options={[
              { value: "standard", label: "Standard" },
              { value: "compact", label: "Compact" },
            ]}
            value={density}
            onValueChange={(v) => setDensity(v as IconButtonGroupDensity)}
          />
          <Select
            label="Separation"
            presentation="listbox"
            options={[
              { value: "joined", label: "Joined" },
              { value: "separated", label: "Separated" },
            ]}
            value={separation}
            onValueChange={(v) =>
              setSeparation(v as IconButtonGroupSeparation)
            }
          />
          <Select
            label="Overflow"
            presentation="listbox"
            options={[
              { value: "wrap", label: "Wrap" },
              { value: "stack", label: "Stack" },
            ]}
            value={overflow}
            onValueChange={(v) => setOverflow(v as IconButtonGroupOverflow)}
          />
        </div>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h3 className="catalog-subgroup-title">Zoom controls</h3>
            <IconButtonGroup
              label="Zoom"
              orientation={orientation}
              density={density}
              separation={separation}
              overflow={overflow}
            >
              <IconButton label="Zoom out" variant="outlined" icon={<ZoomOutIcon />} />
              <IconButton label="Zoom in" variant="outlined" icon={<ZoomInIcon />} />
              <IconButton
                label="Reset zoom"
                variant="filled"
                icon={<PlusIcon />}
              />
            </IconButtonGroup>
          </div>

          <div>
            <h3 className="catalog-subgroup-title">View switching (selected)</h3>
            <IconButtonGroup
              label="View mode"
              orientation={orientation}
              density={density}
              separation={separation}
              overflow={overflow}
            >
              <IconButton
                label="List view"
                variant="outlined"
                icon={<ListIcon />}
                selected={view === "list"}
                onClick={() => setView("list")}
              />
              <IconButton
                label="Grid view"
                variant="outlined"
                icon={<GridIcon />}
                selected={view === "grid"}
                onClick={() => setView("grid")}
              />
            </IconButtonGroup>
          </div>

          <div>
            <h3 className="catalog-subgroup-title">Formatting + disabled</h3>
            <IconButtonGroup
              label="Formatting"
              orientation={orientation}
              density={density}
              separation={separation}
              overflow={overflow}
            >
              <IconButton label="Add item" variant="outlined" icon={<PlusIcon />} />
              <IconButton label="More options" variant="outlined" icon={<MoreIcon />} />
              <IconButton
                label="Delete"
                variant="outlined"
                icon={<TrashIcon />}
                disabled
              />
            </IconButtonGroup>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionSplitButtonLab() {
  const [variant, setVariant] = useState<ActionSplitButtonVariant>("primary");
  const [last, setLast] = useState("—");
  const [primaryOff, setPrimaryOff] = useState(false);

  const saveItems: DropdownMenuEntry[] = [
    {
      id: "save",
      label: "Save",
      onSelect: () => setLast("Save"),
    },
    {
      id: "save-as",
      label: "Save as…",
      onSelect: () => setLast("Save as…"),
    },
    {
      id: "save-copy",
      label: "Save a copy",
      onSelect: () => setLast("Save a copy"),
    },
  ];

  return (
    <section
      className="catalog-group"
      aria-labelledby="action-split-button-lab-heading"
    >
      <h2 id="action-split-button-lab-heading">093 Split Button</h2>
      <p className="catalog-group-desc">
        Primary runs immediately; chevron opens related alternatives via Dropdown
        Menu. Menu is not built into the split. Regions disable independently.
        Distinct from Interaction 004.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Variant"
          presentation="listbox"
          options={[
            { value: "primary", label: "Primary" },
            { value: "secondary", label: "Secondary" },
            { value: "destructive", label: "Destructive" },
          ]}
          value={variant}
          onValueChange={(v) => setVariant(v as ActionSplitButtonVariant)}
        />

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 20 }}>
          <ActionSplitButton
            variant={variant}
            onPrimaryClick={() => setLast("Primary: Save")}
            primaryDisabled={primaryOff}
            menu={
              <DropdownMenu label="Save options" items={saveItems}>
                <ActionSplitMenuTrigger
                  label="More save options"
                  variant={variant}
                />
              </DropdownMenu>
            }
          >
            Save
          </ActionSplitButton>

          <ActionSplitButton
            variant="secondary"
            onPrimaryClick={() => setLast("Primary: Export")}
            menu={
              <DropdownMenu
                label="Export options"
                items={[
                  {
                    id: "pdf",
                    label: "Export PDF",
                    onSelect: () => setLast("Export PDF"),
                  },
                  {
                    id: "csv",
                    label: "Export CSV",
                    onSelect: () => setLast("Export CSV"),
                  },
                ]}
              >
                <ActionSplitMenuTrigger
                  label="More export options"
                  variant="secondary"
                />
              </DropdownMenu>
            }
          >
            Export
          </ActionSplitButton>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={primaryOff}
              onChange={(e) => setPrimaryOff(e.target.checked)}
            />
            Disable primary only (menu stays available)
          </label>

          <p className="catalog-group-desc" aria-live="polite">
            Last action: {last}
          </p>
        </div>
      </div>
    </section>
  );
}

function ActionSegmentedControlLab() {
  const [range, setRange] = useState("week");
  const [view, setView] = useState("list");
  const [size, setSize] = useState("md");
  const [overflow, setOverflow] =
    useState<ActionSegmentedControlOverflow>("wrap");

  return (
    <section
      className="catalog-group"
      aria-labelledby="action-segmented-control-lab-heading"
    >
      <h2 id="action-segmented-control-lab-heading">094 Segmented Control</h2>
      <p className="catalog-group-desc">
        Small exclusive choices (2–5). Selected uses fill, border, and weight —
        not color alone. Default overflow wraps; scroll is opt-in. Never
        auto-converts to a dropdown. Distinct from Interaction 008.
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Overflow"
          presentation="listbox"
          options={[
            { value: "wrap", label: "Wrap (default)" },
            { value: "stack", label: "Stack" },
            { value: "scroll", label: "Scroll (opt-in)" },
          ]}
          value={overflow}
          onValueChange={(v) => setOverflow(v as ActionSegmentedControlOverflow)}
        />

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h3 className="catalog-subgroup-title">Day · Week · Month</h3>
            <ActionSegmentedControl
              label="Date range"
              overflow={overflow}
              value={range}
              onValueChange={setRange}
              options={[
                { id: "day", label: "Day" },
                { id: "week", label: "Week" },
                { id: "month", label: "Month" },
              ]}
            />
          </div>

          <div>
            <h3 className="catalog-subgroup-title">List · Grid (icons)</h3>
            <ActionSegmentedControl
              label="View mode"
              overflow={overflow}
              value={view}
              onValueChange={setView}
              options={[
                { id: "list", label: "List", icon: <ListIcon /> },
                { id: "grid", label: "Grid", icon: <GridIcon /> },
              ]}
            />
          </div>

          <div>
            <h3 className="catalog-subgroup-title">Size + disabled segment</h3>
            <ActionSegmentedControl
              label="Control size"
              overflow={overflow}
              value={size}
              onValueChange={setSize}
              options={[
                { id: "sm", label: "Small" },
                { id: "md", label: "Medium" },
                { id: "lg", label: "Large", disabled: true },
              ]}
            />
          </div>

          <div>
            <h3 className="catalog-subgroup-title">Long localized labels</h3>
            <ActionSegmentedControl
              label="Export format"
              overflow={overflow}
              defaultValue="pdf"
              options={[
                { id: "pdf", label: "PDF-Dokument" },
                { id: "sheet", label: "Tabelle" },
                { id: "slide", label: "Präsentation" },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionGroupLab() {
  const [orientation, setOrientation] =
    useState<ActionGroupOrientation>("responsive");
  const [showImport, setShowImport] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [last, setLast] = useState("—");

  const moreItems: DropdownMenuEntry[] = [
    {
      id: "duplicate",
      label: "Duplicate",
      onSelect: () => setLast("Duplicate"),
    },
    {
      id: "archive",
      label: "Archive",
      onSelect: () => setLast("Archive"),
    },
    {
      id: "delete",
      label: "Delete",
      destructive: true,
      onSelect: () => setLast("Delete"),
    },
  ];

  return (
    <section className="catalog-group" aria-labelledby="action-group-lab-heading">
      <h2 id="action-group-lab-heading">095 Action Group</h2>
      <p className="catalog-group-desc">
        Mixed action treatments — primary stays dominant; secondary and overflow
        compose existing Buttons / menus. Hidden items leave no gaps. Responsive
        stacks on narrow screens. Unlike Button Group (091).
      </p>

      <div className="lab-block" style={{ maxWidth: "40rem" }}>
        <Select
          label="Orientation"
          presentation="listbox"
          options={[
            { value: "responsive", label: "Responsive (default)" },
            { value: "horizontal", label: "Horizontal" },
            { value: "vertical", label: "Vertical" },
          ]}
          value={orientation}
          onValueChange={(v) => setOrientation(v as ActionGroupOrientation)}
        />

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 24 }}>
          <ActionGroup label="Document actions" orientation={orientation}>
            <ActionGroup.Primary>
              <Button
                variant="primary"
                loading={createLoading}
                onClick={() => {
                  setCreateLoading(true);
                  setLast("Create");
                  window.setTimeout(() => setCreateLoading(false), 1200);
                }}
              >
                Create
              </Button>
            </ActionGroup.Primary>
            <ActionGroup.Item rank="secondary" hidden={!showImport}>
              <Button
                variant="secondary"
                onClick={() => setLast("Import")}
              >
                Import
              </Button>
            </ActionGroup.Item>
            <ActionGroup.Item rank="icon">
              <IconButton
                label="Add related"
                variant="outlined"
                icon={<PlusIcon />}
                onClick={() => setLast("Add related")}
              />
            </ActionGroup.Item>
            <ActionGroup.Overflow>
              <DropdownMenu label="More actions" items={moreItems}>
                <Button variant="secondary">More</Button>
              </DropdownMenu>
            </ActionGroup.Overflow>
          </ActionGroup>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={showImport}
              onChange={(e) => setShowImport(e.target.checked)}
            />
            Show Import (hidden leaves no gap)
          </label>

          <ActionGroup
            label="Destructive set"
            orientation={orientation}
            density="compact"
          >
            <ActionGroup.Item rank="secondary">
              <Button variant="secondary" onClick={() => setLast("Keep")}>
                Keep
              </Button>
            </ActionGroup.Item>
            <ActionGroup.Item rank="destructive">
              <Button
                variant="destructive"
                onClick={() => setLast("Delete forever")}
              >
                Delete forever
              </Button>
            </ActionGroup.Item>
          </ActionGroup>

          <p className="catalog-group-desc" aria-live="polite">
            Last action: {last}
          </p>
        </div>
      </div>
    </section>
  );
}

export function App() {
  return (
    <div className="playground">
      <PlaygroundToolbar />

      <header className="playground-header">
        <div>
          <h1>DevKit</h1>
          <p>
            Layer 1 — Interaction 001–010; Form 011–020; Selection 021–030;
            Navigation 031–040; Feedback 041–050; Overlays 051–060; Data Display 061–070; Media 071–080; Typography 081–090; Actions 091–095 ready.
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
      <AddressLocationLab />
      <ComboboxLab />
      <MultiSelectLab />
      <ChoiceChipsLab />
      <SliderLab />
      <TabsLab />
      <TabBarLab />
      <BreadcrumbsLab />
      <PaginationLab />
      <StepperLab />
      <NavigationMenuLab />
      <NavigationItemLab />
      <BottomNavigationLab />
      <AnchorNavigationLab />
      <PreviousNextNavigationLab />
      <AlertLab />
      <StatusIndicatorLab />
      <BadgeLab />
      <NotificationLab />
      <ToastLab />
      <ProgressBarLab />
      <ProgressCircleLab />
      <SpinnerLab />
      <SkeletonLab />
      <EmptyStateLab />
      <TooltipLab />
      <PopoverLab />
      <DropdownMenuLab />
      <ContextMenuLab />
      <MenuLab />
      <DialogLab />
      <AlertDialogLab />
      <DrawerLab />
      <BottomSheetLab />
      <ModalSurfaceLab />
      <CardLab />
      <ListLab />
      <ListItemLab />
      <DataRowLab />
      <AvatarLab />
      <AvatarGroupLab />
      <KeyValuePairLab />
      <DividerLab />
      <TimelineLab />
      <ContentBlockLab />
      <ImageLab />
      <ThumbnailLab />
      <MediaObjectLab />
      <IconContainerLab />
      <IllustrationLab />
      <CoverMediaLab />
      <MediaPreviewLab />
      <ImagePlaceholderLab />
      <MediaOverlayLab />
      <MediaMetadataLab />
      <HeadingLab />
      <ParagraphLab />
      <LabelLab />
      <CaptionLab />
      <LinkLab />
      <CodeLab />
      <CodeBlockLab />
      <BlockquoteLab />
      <NumberDisplayLab />
      <ActionButtonGroupLab />
      <IconButtonGroupLab />
      <ActionSplitButtonLab />
      <ActionSegmentedControlLab />
      <ActionGroupLab />

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
