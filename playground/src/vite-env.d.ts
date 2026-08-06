/// <reference types="vite/client" />

declare module "@devkit/color-tokens.css";
declare module "@devkit/typography-tokens.css";
declare module "@devkit/container-system.css";
declare module "@devkit/stack-system.css";
declare module "@devkit/flex-system.css";
declare module "@devkit/spacer-system.css";
declare module "@devkit/section-system.css";
declare module "@devkit/safe-area-system.css";
declare module "@devkit/aspect-system.css";
declare module "@devkit/visibility-system.css";
declare module "@devkit/breakpoint-system.css";
declare module "@devkit/responsive-grid.css";
declare module "@devkit/responsive-spacing.css";
declare module "@devkit/theme-engine.css";
declare module "@devkit/elevation-system.css";
declare module "@devkit/motion-system.css";
declare module "@devkit/icon-system.css";
declare module "@devkit/surface-system.css";
declare module "@devkit/shape-system.css";

declare module "@devkit/DisplayText" {
  import type * as React from "react";
  export type DisplayTextVariant = "display" | "hero";
  export interface DisplayTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
    variant?: DisplayTextVariant;
    as?: "h1" | "h2" | "p" | "span";
    truncate?: boolean;
    clamp?: 2 | 3;
  }
  export function DisplayText(props: DisplayTextProps): React.ReactElement;
}

declare module "@devkit/Heading" {
  import type * as React from "react";
  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
  export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: HeadingLevel;
    truncate?: boolean;
    clamp?: 2 | 3;
  }
  export function Heading(props: HeadingProps): React.ReactElement;
}

declare module "@devkit/Title" {
  import type * as React from "react";
  export type TitleVariant = "page" | "section";
  export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    variant?: TitleVariant;
    as?: "h1" | "h2" | "h3" | "p";
    truncate?: boolean;
  }
  export function Title(props: TitleProps): React.ReactElement;
}

declare module "@devkit/Subtitle" {
  import type * as React from "react";
  export interface SubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
    as?: "p" | "h2" | "h3" | "span";
    truncate?: boolean;
    clamp?: 2 | 3;
  }
  export function Subtitle(props: SubtitleProps): React.ReactElement;
}

declare module "@devkit/BodyText" {
  import type * as React from "react";
  export type BodyTextSize = "md" | "sm";
  export interface BodyTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    size?: BodyTextSize;
    as?: "p" | "span" | "div";
    truncate?: boolean;
    clamp?: 2 | 3;
    hyphens?: boolean;
  }
  export function BodyText(props: BodyTextProps): React.ReactElement;
}

declare module "@devkit/Caption" {
  import type * as React from "react";
  export interface CaptionProps extends React.HTMLAttributes<HTMLElement> {
    as?: "p" | "span" | "figcaption";
    truncate?: boolean;
  }
  export function Caption(props: CaptionProps): React.ReactElement;
}

declare module "@devkit/Label" {
  import type * as React from "react";
  export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    truncate?: boolean;
  }
  export function Label(props: LabelProps): React.ReactElement;
}

declare module "@devkit/HelperText" {
  import type * as React from "react";
  export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    as?: "p" | "span";
    error?: boolean;
  }
  export function HelperText(props: HelperTextProps): React.ReactElement;
}

declare module "@devkit/CodeText" {
  import type * as React from "react";
  export interface CodeTextProps extends React.HTMLAttributes<HTMLElement> {
    as?: "code" | "pre" | "span";
  }
  export function CodeText(props: CodeTextProps): React.ReactElement;
}

declare module "@devkit/NumericDisplay" {
  import type * as React from "react";
  export type NumericDisplayVariant = "numeric" | "stat";
  export interface NumericDisplayProps extends React.HTMLAttributes<HTMLElement> {
    variant?: NumericDisplayVariant;
    as?: "span" | "p" | "div";
  }
  export function NumericDisplay(props: NumericDisplayProps): React.ReactElement;
}

declare module "@devkit/ResponsiveGrid" {
  import type * as React from "react";
  export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
    columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
    gap?: "none" | "tight" | "default" | "loose";
    equalHeight?: boolean;
    nested?: boolean;
    autofit?: boolean;
    autofill?: boolean;
    masonry?: boolean;
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "stretch";
    as?: keyof React.JSX.IntrinsicElements;
  }
  export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
    span?: number | "full" | { sm?: number | "full"; md?: number | "full"; lg?: number | "full"; xl?: number | "full" };
    start?: number | "auto";
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function ResponsiveGrid(props: ResponsiveGridProps): React.ReactElement;
  export function GridItem(props: GridItemProps): React.ReactElement;
  export function Grid(props: ResponsiveGridProps): React.ReactElement;
}

declare module "@devkit/Surface" {
  import type * as React from "react";
  export type SurfaceVariant =
    | "default"
    | "page"
    | "card"
    | "panel"
    | "sheet"
    | "popover"
    | "tooltip"
    | "dropdown"
    | "menu"
    | "sidebar"
    | "side-panel"
    | "modal"
    | "dashboard"
    | "widget"
    | "overlay";
  export type SurfaceElevation = 0 | 1 | 2 | 3 | 4 | 5;
  export type SurfaceMaterial =
    | "solid"
    | "glass"
    | "frosted"
    | "material"
    | "translucent"
    | "veil";
  export type SurfaceRadius =
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "card"
    | "control";
  export type SurfacePadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";
  export type ModalSize = "sm" | "md" | "lg" | "full";
  export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
    variant?: SurfaceVariant;
    elevation?: SurfaceElevation;
    material?: SurfaceMaterial;
    radius?: SurfaceRadius;
    padding?: SurfacePadding;
    quiet?: boolean;
    outlined?: boolean;
    sunken?: boolean;
    interactive?: boolean;
    pressed?: boolean;
    flush?: boolean;
    stack?: boolean;
    motion?: boolean;
    contain?: boolean;
    veil?: boolean;
    side?: "start" | "end";
    size?: ModalSize;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function Surface(props: SurfaceProps): React.ReactElement;
  export const PageSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const CardSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const PanelSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const SheetSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const PopoverSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const TooltipSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const DropdownSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const MenuSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const SidebarSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const SidePanelSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const ModalSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const DashboardSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const WidgetSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const OverlaySurface: React.FC<Omit<SurfaceProps, "variant">>;
}

declare module "@devkit/Overlay" {
  import type * as React from "react";
  import type { SurfaceProps } from "@devkit/Surface";
  export type OverlayPlacement = "center" | "bottom";
  export interface OverlayProps extends Omit<SurfaceProps, "variant"> {
    open?: boolean;
    onClose?: () => void;
    placement?: OverlayPlacement;
    contentVariant?: "modal" | "sheet";
    scrimClassName?: string;
    labelledBy?: string;
    describedBy?: string;
  }
  export function Overlay(props: OverlayProps): React.ReactElement | null;
}

declare module "@devkit/GlassSurface" {
  import type * as React from "react";
  import type { SurfaceProps } from "@devkit/Surface";
  export type GlassSurfaceProps = Omit<SurfaceProps, "material">;
  export function GlassSurface(props: GlassSurfaceProps): React.ReactElement;
}

declare module "@devkit/FrostedSurface" {
  import type * as React from "react";
  import type { SurfaceProps } from "@devkit/Surface";
  export type FrostedSurfaceProps = Omit<SurfaceProps, "material">;
  export function FrostedSurface(props: FrostedSurfaceProps): React.ReactElement;
}

declare module "@devkit/Elevation" {
  import type * as React from "react";
  export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;
  export type ElevationRole =
    | "flat"
    | "button"
    | "card"
    | "fab"
    | "nav"
    | "modal"
    | "drawer"
    | "dropdown"
    | "popover"
    | "tooltip"
    | "panel"
    | "panel-float";
  export interface ElevationProps extends React.HTMLAttributes<HTMLElement> {
    level?: ElevationLevel;
    semantic?: ElevationRole;
    interactive?: boolean;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function Elevation(props: ElevationProps): React.ReactElement;
}

declare module "@devkit/ShadowLayer" {
  import type * as React from "react";
  import type { ElevationLevel, ElevationProps } from "@devkit/Elevation";
  export interface ShadowLayerProps extends Omit<ElevationProps, "level" | "semantic"> {
    level?: ElevationLevel;
    interactive?: boolean;
  }
  export function ShadowLayer(props: ShadowLayerProps): React.ReactElement;
}

declare module "@devkit/Motion" {
  import type * as React from "react";
  export type MotionPreset =
    | "fade"
    | "fade-out"
    | "scale"
    | "scale-out"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right"
    | "slide-up-out"
    | "page"
    | "page-exit"
    | "modal"
    | "drawer"
    | "drawer-end"
    | "sheet"
    | "dropdown"
    | "tooltip"
    | "notify"
    | "success";
  export type MotionSpeed = "fast" | "normal" | "slow";
  export interface MotionProps extends React.HTMLAttributes<HTMLElement> {
    preset?: MotionPreset;
    in?: boolean;
    speed?: MotionSpeed;
    staggerIndex?: number;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function Motion(props: MotionProps): React.ReactElement | null;
  export function MotionStagger(
    props: React.HTMLAttributes<HTMLElement> & {
      as?: keyof React.JSX.IntrinsicElements;
      speed?: "fast" | "normal" | "slow";
    }
  ): React.ReactElement;
}

declare module "@devkit/MotionPresets" {
  import type * as React from "react";
  import type { MotionProps } from "@devkit/Motion";
  export const FadeAnimation: React.FC<Omit<MotionProps, "preset">>;
  export const ScaleAnimation: React.FC<Omit<MotionProps, "preset">>;
  export const SlideAnimation: React.FC<Omit<MotionProps, "preset">>;
  export const PageTransition: React.FC<Omit<MotionProps, "preset">>;
  export interface HoverAnimationProps extends React.HTMLAttributes<HTMLElement> {
    lift?: boolean;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function HoverAnimation(props: HoverAnimationProps): React.ReactElement;
  export interface PressAnimationProps extends React.HTMLAttributes<HTMLElement> {
    highlight?: boolean;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function PressAnimation(props: PressAnimationProps): React.ReactElement;
  export function RippleAlternative(props: PressAnimationProps): React.ReactElement;
  export function LoadingTransition(props: {
    loading?: boolean;
    children?: React.ReactNode;
    className?: string;
  }): React.ReactElement;
  export function SkeletonAnimation(
    props: React.HTMLAttributes<HTMLDivElement> & {
      variant?: "text" | "title" | "avatar" | "block";
    }
  ): React.ReactElement;
  export function DragAnimation(
    props: React.HTMLAttributes<HTMLElement> & {
      dragging?: boolean;
      as?: keyof React.JSX.IntrinsicElements;
    }
  ): React.ReactElement;
}

declare module "@devkit/useReducedMotion" {
  export type MotionPreference = "system" | "full" | "reduce";
  export function useReducedMotion(): boolean;
  export function useMotionPreference(preference?: MotionPreference): void;
}

declare module "@devkit/Icon" {
  import type * as React from "react";
  export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
  export type IconStatus = "success" | "warning" | "danger" | "info" | "ai" | "neutral";
  export type IconVariant = "outlined" | "filled" | "duotone" | "status";
  export type IconCategory = string;
  export interface IconDefinition {
    name: string;
    label: string;
    category: IconCategory;
    aliases: string[];
    outlined: string;
    filled?: string;
    duotone?: string;
  }
  export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, "name"> {
    name: string;
    variant?: IconVariant;
    size?: IconSize;
    label?: string;
    status?: IconStatus;
    muted?: boolean;
    spin?: boolean;
    pulse?: boolean;
    className?: string;
  }
  export function Icon(props: IconProps): React.ReactElement;
  export function IconLabel(
    props: React.HTMLAttributes<HTMLSpanElement> & {
      icon: string;
      children: React.ReactNode;
      iconProps?: Omit<IconProps, "name">;
    }
  ): React.ReactElement;
  export const ICON_REGISTRY: IconDefinition[];
  export const ICON_CATEGORIES: IconCategory[];
  export function searchIcons(query: string): IconDefinition[];
  export function getIcon(nameOrAlias: string): IconDefinition | undefined;
}

declare module "@devkit/IconExtras" {
  import type * as React from "react";
  import type { IconProps, IconStatus } from "@devkit/Icon";
  export type IconButtonTone = "ghost" | "filled" | "primary" | "danger";
  export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    name: string;
    label: string;
    iconOnly?: boolean;
    tone?: IconButtonTone;
    iconProps?: Omit<IconProps, "name" | "label">;
  }
  export function IconButton(props: IconButtonProps): React.ReactElement;
  export function AnimatedIcon(
    props: IconProps & { animation?: "spin" | "pulse" }
  ): React.ReactElement;
  export function StatusIcon(
    props: Omit<IconProps, "status" | "variant"> & { status?: IconStatus }
  ): React.ReactElement;
  export function BrandIcon(props: Omit<IconProps, "name"> & { name?: string }): React.ReactElement;
  export function FileIcon(props: Omit<IconProps, "name"> & { name?: string }): React.ReactElement;
  export function SocialIcon(props: IconProps): React.ReactElement;
  export function AiIcon(props: Omit<IconProps, "name"> & { name?: string }): React.ReactElement;
  export function EmojiRenderer(
    props: React.HTMLAttributes<HTMLSpanElement> & { emoji: string; label?: string }
  ): React.ReactElement;
  export function IconBadge(
    props: IconProps & { count?: number; dot?: boolean }
  ): React.ReactElement;
}

declare module "@devkit/RoundedCorner" {
  import type * as React from "react";
  export type RadiusScale =
    | "none"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "full"
    | "smooth";
  export type RadiusRole =
    | "button"
    | "button-sm"
    | "button-lg"
    | "input"
    | "card"
    | "panel"
    | "container"
    | "modal"
    | "popover"
    | "chip"
    | "badge"
    | "avatar"
    | "avatar-square"
    | "avatar-soft"
    | "image"
    | "tooltip";
  export interface RoundedCornerProps extends React.HTMLAttributes<HTMLElement> {
    radius?: RadiusScale;
    semantic?: RadiusRole;
    nest?: boolean;
    nestRadius?: "lg" | "xl" | "2xl" | "3xl" | "card" | "container";
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function RoundedCorner(props: RoundedCornerProps): React.ReactElement;
  export function ShapeNested(
    props: React.HTMLAttributes<HTMLElement> & { as?: keyof React.JSX.IntrinsicElements }
  ): React.ReactElement;
  export const Shape: typeof RoundedCorner;
}

declare module "@devkit/CircleShape" {
  import type * as React from "react";
  export type CircleSize = "sm" | "md" | "lg" | "xl";
  export interface CircleShapeProps extends React.HTMLAttributes<HTMLElement> {
    size?: CircleSize;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function CircleShape(props: CircleShapeProps): React.ReactElement;
}

declare module "@devkit/PillShape" {
  import type * as React from "react";
  export type PillSize = "sm" | "md" | "lg";
  export interface PillShapeProps extends React.HTMLAttributes<HTMLElement> {
    size?: PillSize;
    chip?: boolean;
    interactive?: boolean;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function PillShape(props: PillShapeProps): React.ReactElement;
}

declare module "@devkit/AvatarShape" {
  import type * as React from "react";
  export type AvatarSize = "sm" | "md" | "lg" | "xl";
  export type AvatarCorner = "circle" | "square" | "soft";
  export interface AvatarShapeProps extends React.HTMLAttributes<HTMLElement> {
    size?: AvatarSize;
    corner?: AvatarCorner;
    src?: string;
    alt?: string;
    initials?: string;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function AvatarShape(props: AvatarShapeProps): React.ReactElement;
}

declare module "@devkit/Border" {
  import type * as React from "react";
  export type BorderTone = "default" | "subtle" | "strong" | "none";
  export interface BorderProps extends React.HTMLAttributes<HTMLElement> {
    tone?: BorderTone;
    edge?: "all" | "t" | "b" | "x" | "y";
    radius?: "none" | "sm" | "md" | "lg" | "xl" | "card" | "full";
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function Border(props: BorderProps): React.ReactElement;
}

declare module "@devkit/Divider" {
  import type * as React from "react";
  export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
    orientation?: "horizontal" | "vertical";
    strong?: boolean;
    inset?: boolean;
    as?: "hr" | "div" | "span";
  }
  export function Divider(props: DividerProps): React.ReactElement;
  export const Separator: typeof Divider;
}

declare module "@devkit/Container" {
  import type * as React from "react";
  export type ContainerVariant =
    | "fluid"
    | "fixed"
    | "centered"
    | "full"
    | "narrow"
    | "wide"
    | "reading"
    | "dashboard"
    | "form"
    | "hero"
    | "modal"
    | "custom";
  export type ContainerWidth = "default" | "fluid" | "narrow" | "wide";
  export type ContainerPadding = "none" | "sm" | "md" | "lg" | "xl" | "responsive";
  export type ContainerAlign = "start" | "center" | "end" | "stretch";
  export type ContainerOverflow = "visible" | "auto" | "hidden" | "clip";
  export type ContainerSticky = boolean | "top" | "bottom";
  export type ContainerSafeArea = boolean | "x" | "y" | "all";
  export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
    variant?: ContainerVariant;
    width?: ContainerWidth;
    maxWidth?: string | number;
    padding?: ContainerPadding;
    paddingX?: ContainerPadding;
    paddingY?: ContainerPadding | "section";
    align?: ContainerAlign;
    safeArea?: ContainerSafeArea;
    sticky?: ContainerSticky;
    scrollLock?: boolean;
    overflow?: ContainerOverflow;
    nested?: boolean;
    motion?: boolean;
    surface?: boolean;
    elevated?: boolean;
    stack?: boolean;
    fold?: boolean;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function Container(props: ContainerProps): React.ReactElement;
  export const ResponsiveContainer: typeof Container;
}

declare module "@devkit/AspectRatio" {
  import type * as React from "react";
  export type AspectPreset =
    | "1:1"
    | "4:3"
    | "3:4"
    | "16:9"
    | "9:16"
    | "21:9"
    | "square"
    | "video"
    | "photo"
    | "portrait"
    | "ultrawide"
    | "a4"
    | "a4-landscape"
    | "card"
    | "widget"
    | "mobile"
    | "tablet"
    | "custom";
  export type AspectFit = "cover" | "contain" | "fill" | "none" | "scale-down";
  export type AspectPosition =
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  export type AspectAlign = "center" | "start" | "end" | "stretch";
  export type AspectOverflow = "hidden" | "visible" | "clip" | "auto";
  export type AspectRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";
  export type AspectBreakpoint = "sm" | "md" | "lg";
  export type ResponsiveValue<T> = T | (Partial<Record<AspectBreakpoint, T>> & { base?: T });
  export type AspectRatioValue = number | string;
  export interface AspectRatioProps extends Omit<React.HTMLAttributes<HTMLElement>, "placeholder"> {
    preset?: ResponsiveValue<AspectPreset>;
    ratio?: ResponsiveValue<AspectRatioValue>;
    fit?: AspectFit;
    position?: AspectPosition;
    align?: AspectAlign;
    overflow?: AspectOverflow;
    radius?: AspectRadius;
    loading?: boolean | "skeleton";
    placeholder?: React.ReactNode;
    lazy?: boolean;
    motion?: boolean;
    inline?: boolean;
    fill?: boolean;
    as?: keyof React.JSX.IntrinsicElements;
    children?: React.ReactNode;
  }
  export function AspectRatio(props: AspectRatioProps): React.ReactElement;
  export function AspectSquare(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
  export function AspectVideo(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
  export function AspectPhoto(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
  export function AspectPortrait(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
  export function AspectUltrawide(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
  export function AspectStory(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
  export function AspectA4(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
  export function AspectCard(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
  export function AspectWidget(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
  export function AspectMobile(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
  export function AspectTablet(props: Omit<AspectRatioProps, "preset">): React.ReactElement;
}

declare module "@devkit/ResponsiveVisibility" {
  import type * as React from "react";
  export type VisibilityPreset =
    | "mobile-only"
    | "tablet-only"
    | "desktop-only"
    | "large-only"
    | "large-screens"
    | "landscape-only"
    | "portrait-only"
    | "print-only"
    | "print"
    | "screen-only"
    | "foldable-only"
    | "foldables"
    | "a11y-only"
    | "accessibility"
    | "reduced-motion-only"
    | "motion-ok-only"
    | "from-md"
    | "until-md"
    | "from-lg"
    | "until-lg";
  export type VisibilityMode = "show" | "hide" | "collapse" | "preserve" | "fade";
  export type VisibilityStrategy = "css" | "js" | "auto";
  export type VisibilityBreakpoint = "sm" | "md" | "lg" | "xl";
  export interface VisibilityContextValue {
    roles?: string[];
    permissions?: string[];
    flags?: Record<string, boolean>;
    state?: Record<string, unknown>;
  }
  export interface VisibilityChangeEvent {
    visible: boolean;
    reason: "condition" | "media" | "intersection" | "controlled";
    entry?: IntersectionObserverEntry;
  }
  export interface ResponsiveVisibilityProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "role"> {
    preset?: VisibilityPreset;
    mode?: VisibilityMode;
    visible?: boolean;
    invert?: boolean;
    when?: boolean;
    unless?: boolean;
    match?: string;
    above?: VisibilityBreakpoint;
    below?: VisibilityBreakpoint;
    minWidth?: number;
    maxWidth?: number;
    orientation?: "landscape" | "portrait";
    role?: string | string[];
    permission?: string | string[];
    flag?: string;
    flags?: Record<string, boolean>;
    stateKey?: string;
    state?: Record<string, unknown>;
    reducedMotion?: boolean | "show" | "hide";
    prefersContrast?: boolean;
    strategy?: VisibilityStrategy;
    block?: boolean;
    lazy?: boolean;
    keepMounted?: boolean;
    motion?: boolean;
    intersection?: boolean | IntersectionObserverInit;
    ssrFallback?: boolean;
    onVisibilityChange?: (event: VisibilityChangeEvent) => void;
    onVisible?: (event: VisibilityChangeEvent) => void;
    as?: keyof React.JSX.IntrinsicElements;
    children?: React.ReactNode;
  }
  export function ResponsiveVisibility(props: ResponsiveVisibilityProps): React.ReactElement | null;
  export const Visibility: typeof ResponsiveVisibility;
  export function VisibilityProvider(
    props: VisibilityContextValue & { children?: React.ReactNode }
  ): React.ReactElement;
  export function useVisibilityContext(): VisibilityContextValue;
  export function useMediaQuery(query: string | null | undefined, ssrFallback?: boolean): boolean;
  export function usePrefersReducedMotion(ssrFallback?: boolean): boolean;
  export function useIntersectionVisibility(
    ref: React.RefObject<Element | null>,
    options?: boolean | IntersectionObserverInit
  ): boolean;
  export function useVisibility(options?: {
    when?: boolean;
    unless?: boolean;
    match?: string;
    above?: VisibilityBreakpoint;
    below?: VisibilityBreakpoint;
    minWidth?: number;
    maxWidth?: number;
    orientation?: "landscape" | "portrait";
    role?: string | string[];
    permission?: string | string[];
    flag?: string;
    flags?: Record<string, boolean>;
    stateKey?: string;
    state?: Record<string, unknown>;
    reducedMotion?: boolean | "show" | "hide";
    prefersContrast?: boolean;
    invert?: boolean;
    visible?: boolean;
    ssrFallback?: boolean;
  }): boolean;
  export const MobileOnly: React.FC<Omit<ResponsiveVisibilityProps, "preset">>;
  export const TabletOnly: React.FC<Omit<ResponsiveVisibilityProps, "preset">>;
  export const DesktopOnly: React.FC<Omit<ResponsiveVisibilityProps, "preset">>;
  export const LargeScreens: React.FC<Omit<ResponsiveVisibilityProps, "preset">>;
  export const LandscapeOnly: React.FC<Omit<ResponsiveVisibilityProps, "preset">>;
  export const PortraitOnly: React.FC<Omit<ResponsiveVisibilityProps, "preset">>;
  export const PrintMode: React.FC<Omit<ResponsiveVisibilityProps, "preset">>;
  export const ScreenOnly: React.FC<Omit<ResponsiveVisibilityProps, "preset">>;
  export const Foldables: React.FC<Omit<ResponsiveVisibilityProps, "preset">>;
  export const AccessibilityMode: React.FC<Omit<ResponsiveVisibilityProps, "preset">>;
  export function Show(props: Omit<ResponsiveVisibilityProps, "mode">): React.ReactElement | null;
  export function Hide(
    props: Omit<ResponsiveVisibilityProps, "invert">
  ): React.ReactElement | null;
}

declare module "@devkit/BreakpointManager" {
  import type * as React from "react";
  export const BREAKPOINTS: {
    readonly xs: 0;
    readonly sm: 480;
    readonly md: 768;
    readonly lg: 1024;
    readonly xl: 1280;
    readonly "2xl": 1440;
    readonly "3xl": 1680;
  };
  export type Breakpoint = keyof typeof BREAKPOINTS;
  export const BREAKPOINT_ORDER: Breakpoint[];
  export type Orientation = "portrait" | "landscape";
  export type PointerType = "fine" | "coarse" | "none";
  export type HoverCapability = "hover" | "none";
  export type BreakpointDirection = "up" | "down" | "only";
  export type BreakpointInput = Breakpoint | string;
  export interface BreakpointSnapshot {
    breakpoint: Breakpoint;
    width: number;
    height: number;
    orientation: Orientation;
    dpr: number;
    dense: boolean;
    touch: boolean;
    pointer: PointerType;
    hover: HoverCapability;
    reducedMotion: boolean;
    reducedTransparency: boolean;
    prefersContrast: string;
    prefersColorScheme: string;
    foldable: boolean;
    print: boolean;
    hydrated: boolean;
  }
  export const mq: {
    up: (bp: BreakpointInput) => string;
    down: (bp: BreakpointInput) => string;
    only: (bp: BreakpointInput) => string;
    between: (min: BreakpointInput, max: BreakpointInput) => string;
    orientation: (value: Orientation) => string;
    pointer: (value: PointerType) => string;
    hover: (value: HoverCapability) => string;
    reducedMotion: () => string;
    reducedTransparency: () => string;
    contrastMore: () => string;
    dense: () => string;
    foldable: () => string;
    print: () => string;
  };
  export function resolveBreakpoint(width: number): Breakpoint;
  export function matchesBreakpoint(
    width: number,
    bp: BreakpointInput,
    direction?: BreakpointDirection
  ): boolean;
  export function getBreakpointSnapshot(): BreakpointSnapshot;
  export function getBreakpointInitScript(ssrBreakpoint?: Breakpoint): string;
  export function scheduleLayoutRecalc(fn?: () => void): void;
  export interface BreakpointProviderProps {
    children?: React.ReactNode;
    ssrBreakpoint?: Breakpoint;
    syncDocument?: boolean;
    syncCssVars?: boolean;
  }
  export function BreakpointProvider(props: BreakpointProviderProps): React.ReactElement;
  export const BreakpointManager: typeof BreakpointProvider;
  export function BreakpointScript(props: { ssrBreakpoint?: Breakpoint }): React.ReactElement;
  export function BreakpointMatch(props: {
    above?: BreakpointInput;
    below?: BreakpointInput;
    only?: BreakpointInput;
    children?: React.ReactNode;
    fallback?: React.ReactNode;
  }): React.ReactElement;
  export function DeviceDetector(
    props: React.HTMLAttributes<HTMLElement> & {
      mirror?: boolean;
      as?: keyof React.JSX.IntrinsicElements;
    }
  ): React.ReactElement;
  export function useBreakpointSnapshot(): BreakpointSnapshot;
  export function useBreakpoint(): Breakpoint;
  export function useBreakpointMatch(
    bp: BreakpointInput,
    direction?: BreakpointDirection
  ): boolean;
  export function useBreakpointValue<T>(
    map: Partial<Record<Breakpoint, T>> & { base?: T },
    fallback?: T
  ): T | undefined;
  export function useMediaQuery(query: string | null | undefined, ssrFallback?: boolean): boolean;
  export function useOrientation(): Orientation;
  export function usePointer(): PointerType;
  export function useHoverCapability(): HoverCapability;
  export function useTouch(): boolean;
  export function usePrefersReducedMotion(): boolean;
  export function usePrefersReducedTransparency(): boolean;
  export function useFoldable(): boolean;
  export function useDensity(): { dpr: number; dense: boolean };
  export function useContainerQuery(
    ref: React.RefObject<Element | null>,
    options: {
      minWidth?: number;
      maxWidth?: number;
      minHeight?: number;
      maxHeight?: number;
      from?: "sm" | "md" | "lg" | "xl";
    }
  ): boolean;
  export function useLayoutRecalc(callback: (snapshot: BreakpointSnapshot) => void): void;
  export function useBreakpointEvent(
    listener: (snapshot: BreakpointSnapshot, prev: BreakpointSnapshot | null) => void
  ): void;
  export const BREAKPOINT_EVENT: string;
  export const BREAKPOINT_RESIZE_EVENT: string;
  export const BREAKPOINT_LAYOUT_EVENT: string;
}

declare module "@devkit/SafeArea" {
  import type * as React from "react";
  export type SafeAreaEdge = "top" | "right" | "bottom" | "left";
  export type SafeAreaEdges =
    | "all"
    | "x"
    | "y"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | SafeAreaEdge[];
  export type SafeAreaMode =
    | "default"
    | "immersive"
    | "fullscreen"
    | "nav"
    | "fab"
    | "panel"
    | "keyboard";
  export type SafeAreaInsets = {
    top: number;
    right: number;
    bottom: number;
    left: number;
    keyboard: number;
    orientation: "portrait" | "landscape" | "unknown";
  };
  export type SafeAreaEdgeMap = Partial<Record<SafeAreaEdge, boolean | string | number>>;
  export interface SafeAreaProps extends React.HTMLAttributes<HTMLElement> {
    edges?: SafeAreaEdges;
    top?: boolean | string | number;
    right?: boolean | string | number;
    bottom?: boolean | string | number;
    left?: boolean | string | number;
    mode?: SafeAreaMode;
    offset?: SafeAreaEdgeMap;
    min?: SafeAreaEdgeMap;
    keyboard?: boolean;
    fold?: boolean;
    nested?: boolean;
    motion?: boolean;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export interface SafeAreaProviderProps {
    children?: React.ReactNode;
    syncCssVars?: boolean;
    trackKeyboard?: boolean;
  }
  export function SafeArea(props: SafeAreaProps): React.ReactElement;
  export function SafeAreaProvider(props: SafeAreaProviderProps): React.ReactElement;
  export function useSafeArea(): SafeAreaInsets & { refresh: () => void };
  export function useSafeAreaInsets(): SafeAreaInsets;
  export function getSafeAreaInsets(): SafeAreaInsets;
  export function SafeAreaBottomBar(props: React.HTMLAttributes<HTMLDivElement>): React.ReactElement;
  export function SafeAreaTopBar(props: React.HTMLAttributes<HTMLDivElement>): React.ReactElement;
  export function SafeAreaFab(props: React.HTMLAttributes<HTMLDivElement>): React.ReactElement;
}

declare module "@devkit/Section" {
  import type * as React from "react";
  export type SectionWidth =
    | "full"
    | "form"
    | "reading"
    | "narrow"
    | "modal"
    | "default"
    | "wide"
    | "hero"
    | "dashboard";
  export type SectionBackground =
    | "transparent"
    | "canvas"
    | "base"
    | "subtle"
    | "muted"
    | "surface";
  export type SectionElevation = 0 | 1 | 2 | 3 | 4 | 5;
  export type SectionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
  export interface SectionVisibilityEvent {
    id?: string;
    visible: boolean;
    ratio: number;
    entry: IntersectionObserverEntry;
  }
  export interface SectionEmptyState {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
  }
  export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    footer?: React.ReactNode;
    loading?: boolean;
    empty?: boolean;
    emptyState?: SectionEmptyState | React.ReactNode;
    collapsible?: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    stickyHeader?: boolean;
    stickyOffset?: string | number;
    nested?: boolean;
    compact?: boolean;
    flush?: boolean;
    padded?: boolean;
    width?: SectionWidth;
    background?: SectionBackground;
    elevated?: boolean;
    elevation?: SectionElevation;
    level?: SectionHeadingLevel;
    anchor?: string;
    animate?: boolean;
    lazy?: boolean;
    motion?: boolean;
    visibilityThreshold?: number | number[];
    onVisible?: (event: SectionVisibilityEvent) => void;
    onToggle?: (open: boolean) => void;
    as?: "section" | "div" | "main" | "aside" | "article";
    children?: React.ReactNode;
  }
  export interface SectionHeaderProps extends React.HTMLAttributes<HTMLElement> {
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    sticky?: boolean;
    as?: "header" | "div";
  }
  export interface SectionBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
  export interface SectionFooterProps extends React.HTMLAttributes<HTMLElement> {
    as?: "footer" | "div";
  }
  export function Section(props: SectionProps): React.ReactElement;
  export namespace Section {
    function Header(props: SectionHeaderProps): React.ReactElement;
    function Body(props: SectionBodyProps): React.ReactElement;
    function Footer(props: SectionFooterProps): React.ReactElement;
  }
  export function SectionHeader(props: SectionHeaderProps): React.ReactElement;
  export function SectionBody(props: SectionBodyProps): React.ReactElement;
  export function SectionFooter(props: SectionFooterProps): React.ReactElement;
  export const SectionLevelContext: React.Context<SectionHeadingLevel>;
}

declare module "@devkit/Spacer" {
  import type * as React from "react";
  export type SpacerAxis =
    | "auto"
    | "x"
    | "y"
    | "both"
    | "horizontal"
    | "vertical"
    | "adaptive";
  export type SpacerPreset =
    | "tiny"
    | "small"
    | "medium"
    | "large"
    | "xl"
    | "section"
    | "card"
    | "form"
    | "modal"
    | "nav"
    | "hero"
    | "stack"
    | "inline"
    | "page"
    | "responsive";
  export type SpacerScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
  export type SpacerSafeArea = boolean | "top" | "bottom" | "left" | "right" | "x" | "y";
  export type SpacerBreakpoint = "sm" | "md" | "lg" | "xl";
  export type ResponsiveValue<T> = T | (Partial<Record<SpacerBreakpoint, T>> & { base?: T });
  export interface SpacerProps extends React.HTMLAttributes<HTMLElement> {
    axis?: ResponsiveValue<SpacerAxis>;
    preset?: ResponsiveValue<SpacerPreset>;
    space?: ResponsiveValue<SpacerScale>;
    size?: string;
    grow?: boolean | 0 | 1 | 2 | 3;
    shrink?: boolean | 0 | 1;
    proportion?: number | string;
    separator?: boolean | "strong";
    safeArea?: SpacerSafeArea;
    keyboard?: boolean;
    motion?: boolean;
    as?: "span" | "div" | "hr";
  }
  export function Spacer(props: SpacerProps): React.ReactElement;
  export function FlexGrowSpacer(props: Omit<SpacerProps, "axis" | "grow">): React.ReactElement;
  export function SpacerTiny(props: Omit<SpacerProps, "preset">): React.ReactElement;
  export function SpacerSmall(props: Omit<SpacerProps, "preset">): React.ReactElement;
  export function SpacerMedium(props: Omit<SpacerProps, "preset">): React.ReactElement;
  export function SpacerLarge(props: Omit<SpacerProps, "preset">): React.ReactElement;
  export function SpacerXL(props: Omit<SpacerProps, "preset">): React.ReactElement;
  export function SpacerSection(props: Omit<SpacerProps, "preset">): React.ReactElement;
  export function SpacerCard(props: Omit<SpacerProps, "preset">): React.ReactElement;
  export function SpacerForm(props: Omit<SpacerProps, "preset">): React.ReactElement;
  export function SpacerModal(props: Omit<SpacerProps, "preset">): React.ReactElement;
  export function SpacerNav(props: Omit<SpacerProps, "preset">): React.ReactElement;
  export function SpacerHero(props: Omit<SpacerProps, "preset">): React.ReactElement;
}

declare module "@devkit/FlexLayout" {
  import type * as React from "react";
  export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
  export type FlexWrap = boolean | "wrap" | "nowrap" | "wrap-reverse";
  export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
  export type FlexJustify =
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly"
    | "stretch";
  export type FlexContent =
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly"
    | "stretch";
  export type FlexGap =
    | "none"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "compact"
    | "comfortable"
    | "spacious"
    | "responsive"
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 8
    | (string & {});
  export type FlexOverflow = "visible" | "hidden" | "auto" | "clip" | "x-auto" | "y-auto";
  export type FlexBreakpoint = "sm" | "md" | "lg" | "xl";
  export type ResponsiveValue<T> = T | (Partial<Record<FlexBreakpoint, T>> & { base?: T });
  export type FlexPreset =
    | "navbar"
    | "toolbar"
    | "form-row"
    | "dashboard-summary"
    | "action-group"
    | "profile-header"
    | "card-footer"
    | "filter-bar"
    | "stats-row"
    | "button-group";
  export type FlexBasis =
    | "auto"
    | "0"
    | "full"
    | "content"
    | "max"
    | "min"
    | "fit"
    | (string & {});
  export type FlexItemRole =
    | "label"
    | "control"
    | "avatar"
    | "identity"
    | "actions"
    | "filters"
    | "meta";
  export interface FlexLayoutProps extends React.HTMLAttributes<HTMLElement> {
    direction?: ResponsiveValue<FlexDirection>;
    wrap?: ResponsiveValue<FlexWrap>;
    align?: ResponsiveValue<FlexAlign>;
    justify?: ResponsiveValue<FlexJustify>;
    content?: FlexContent;
    gap?: FlexGap | ResponsiveValue<FlexGap>;
    equal?: boolean;
    inline?: boolean;
    nested?: boolean;
    motion?: boolean;
    overflow?: FlexOverflow;
    preset?: FlexPreset;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export interface FlexItemProps extends React.HTMLAttributes<HTMLElement> {
    grow?: boolean | 0 | 1 | 2 | 3;
    shrink?: boolean | 0 | 1;
    basis?: FlexBasis;
    order?: "first" | "last" | 0 | 1 | 2 | 3 | 4 | 5 | number;
    align?: FlexAlign | "auto";
    flex?: boolean | "auto" | "none" | "initial" | "1";
    minWidth?: string | number;
    maxWidth?: string | number;
    minHeight?: string | number;
    maxHeight?: string | number;
    overflow?: FlexOverflow;
    intrinsic?: boolean;
    flexRole?: FlexItemRole;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function FlexLayout(props: FlexLayoutProps): React.ReactElement;
  export const Flex: typeof FlexLayout;
  export function FlexItem(props: FlexItemProps): React.ReactElement;
  export function FlexSpacer(props: React.HTMLAttributes<HTMLDivElement>): React.ReactElement;
  export function FlexNavbar(props: Omit<FlexLayoutProps, "preset">): React.ReactElement;
  export function FlexToolbar(props: Omit<FlexLayoutProps, "preset">): React.ReactElement;
  export function FlexFormRow(props: Omit<FlexLayoutProps, "preset">): React.ReactElement;
  export function FlexDashboardSummary(props: Omit<FlexLayoutProps, "preset">): React.ReactElement;
  export function FlexActionGroup(props: Omit<FlexLayoutProps, "preset">): React.ReactElement;
  export function FlexProfileHeader(props: Omit<FlexLayoutProps, "preset">): React.ReactElement;
  export function FlexCardFooter(props: Omit<FlexLayoutProps, "preset">): React.ReactElement;
  export function FlexFilterBar(props: Omit<FlexLayoutProps, "preset">): React.ReactElement;
  export function FlexStatsRow(props: Omit<FlexLayoutProps, "preset">): React.ReactElement;
  export function FlexButtonGroup(props: Omit<FlexLayoutProps, "preset">): React.ReactElement;
}

declare module "@devkit/StackLayout" {
  import type * as React from "react";
  export type StackDirection = "vertical" | "horizontal" | "column" | "row";
  export type StackGap =
    | "none"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "equal"
    | "compact"
    | "comfortable"
    | "spacious"
    | "responsive"
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 8
    | 10
    | 12
    | (string & {});
  export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
  export type StackJustify =
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly"
    | "stretch";
  export type StackBreakpoint = "sm" | "md" | "lg" | "xl";
  export type ResponsiveValue<T> = T | (Partial<Record<StackBreakpoint, T>> & { base?: T });
  export type StackSeparator = boolean | "strong" | React.ReactNode;
  export interface StackVirtualOptions {
    itemSize?: number;
    overscan?: number;
    height?: number | string;
  }
  export interface StackLayoutProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
    direction?: ResponsiveValue<StackDirection>;
    gap?: StackGap | ResponsiveValue<StackGap>;
    align?: ResponsiveValue<StackAlign>;
    justify?: StackJustify;
    wrap?: ResponsiveValue<boolean>;
    reverse?: boolean;
    inline?: boolean;
    nested?: boolean;
    separator?: StackSeparator;
    divided?: boolean;
    collapseEmpty?: boolean;
    animate?: boolean;
    stagger?: boolean;
    motion?: boolean;
    lazy?: boolean;
    virtual?: boolean | StackVirtualOptions;
    keyboardNav?: boolean;
    equal?: boolean;
    as?: keyof React.JSX.IntrinsicElements;
    children?: React.ReactNode;
  }
  export function StackLayout(props: StackLayoutProps): React.ReactElement;
  export const Stack: typeof StackLayout;
  export function HStack(props: Omit<StackLayoutProps, "direction" | "inline">): React.ReactElement;
  export function VStack(props: Omit<StackLayoutProps, "direction" | "inline">): React.ReactElement;
  export function InlineStack(props: Omit<StackLayoutProps, "inline" | "direction">): React.ReactElement;
}

declare module "@devkit/DensityProvider" {
  import type * as React from "react";
  export type DensityMode = "compact" | "comfortable" | "spacious";
  export interface DensityProviderProps {
    density?: DensityMode;
    children?: React.ReactNode;
  }
  export function DensityProvider(props: DensityProviderProps): React.ReactElement;
}

declare module "@devkit/Space" {
  import type * as React from "react";
  export type SpaceScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
  export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
    preset?: "page" | "section" | "card" | "form" | "modal" | "nav" | "stack" | "inline";
    p?: SpaceScale;
    px?: SpaceScale;
    py?: SpaceScale;
    m?: SpaceScale;
    mx?: SpaceScale;
    my?: SpaceScale;
    gap?: SpaceScale;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function Space(props: SpaceProps): React.ReactElement;
}

declare module "@devkit/ThemeProvider" {
  import type * as React from "react";
  export type BuiltInTheme =
    | "light"
    | "dark"
    | "high-contrast"
    | "high-contrast-dark"
    | "system";
  export type ThemeId = BuiltInTheme | (string & {});
  export type ColorScheme = "light" | "dark";
  export interface ThemeDefinition {
    id: string;
    label?: string;
    colorScheme?: ColorScheme;
    vars?: Record<string, string>;
    attributes?: Record<string, string>;
  }
  export interface ThemeContextValue {
    theme: ThemeId;
    resolvedTheme: string;
    systemTheme: ColorScheme;
    setTheme: (theme: ThemeId) => void;
    themes: string[];
    registerTheme: (definition: ThemeDefinition) => void;
    setVars: (vars: Record<string, string>) => void;
    clearVars: () => void;
    vars: Record<string, string>;
  }
  export interface ThemeProviderProps {
    children?: React.ReactNode;
    defaultTheme?: ThemeId;
    storageKey?: string;
    themes?: ThemeDefinition[];
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    theme?: ThemeId;
    onThemeChange?: (theme: ThemeId) => void;
  }
  export function ThemeProvider(props: ThemeProviderProps): React.ReactElement;
  export function useTheme(): ThemeContextValue;
  export function getThemeInitScript(storageKey?: string): string;
}

