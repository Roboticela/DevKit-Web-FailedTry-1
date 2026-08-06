/// <reference types="vite/client" />

declare module "@devkit/color-tokens.css";
declare module "@devkit/typography-tokens.css";

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
