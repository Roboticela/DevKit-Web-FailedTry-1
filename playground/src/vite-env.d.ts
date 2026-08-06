/// <reference types="vite/client" />

declare module "@devkit/color-tokens.css";
declare module "@devkit/typography-tokens.css";
declare module "@devkit/responsive-grid.css";
declare module "@devkit/responsive-spacing.css";
declare module "@devkit/theme-engine.css";
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
    | "sidebar"
    | "modal"
    | "dashboard"
    | "widget";
  export type SurfaceElevation = 0 | 1 | 2 | 3 | 4;
  export type SurfaceMaterial = "solid" | "glass" | "frosted" | "material";
  export type SurfaceRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  export type SurfacePadding = "none" | "sm" | "md" | "lg" | "xl";
  export type ModalSize = "sm" | "md" | "lg" | "full";
  export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
    variant?: SurfaceVariant;
    elevation?: SurfaceElevation;
    material?: SurfaceMaterial;
    radius?: SurfaceRadius;
    padding?: SurfacePadding;
    quiet?: boolean;
    sunken?: boolean;
    interactive?: boolean;
    flush?: boolean;
    stack?: boolean;
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
  export const SidebarSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const ModalSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const DashboardSurface: React.FC<Omit<SurfaceProps, "variant">>;
  export const WidgetSurface: React.FC<Omit<SurfaceProps, "variant">>;
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

declare module "@devkit/ShadowLayer" {
  import type * as React from "react";
  import type { SurfaceElevation, SurfaceProps } from "@devkit/Surface";
  export interface ShadowLayerProps extends Omit<SurfaceProps, "elevation"> {
    level?: SurfaceElevation;
  }
  export function ShadowLayer(props: ShadowLayerProps): React.ReactElement;
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
  export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: "default" | "fluid" | "narrow" | "wide";
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function Container(props: ContainerProps): React.ReactElement;
}

declare module "@devkit/SafeArea" {
  import type * as React from "react";
  export interface SafeAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    edges?: "all" | "x" | "y" | "top" | "bottom";
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function SafeArea(props: SafeAreaProps): React.ReactElement;
}

declare module "@devkit/Surface" {
  import type * as React from "react";
  export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function Surface(props: SurfaceProps): React.ReactElement;
}

declare module "@devkit/Section" {
  import type * as React from "react";
  export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    compact?: boolean;
    as?: "section" | "div" | "main" | "aside";
  }
  export function Section(props: SectionProps): React.ReactElement;
}

declare module "@devkit/StackLayout" {
  import type * as React from "react";
  export interface StackLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    gap?: string;
    as?: keyof React.JSX.IntrinsicElements;
  }
  export function StackLayout(props: StackLayoutProps): React.ReactElement;
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

