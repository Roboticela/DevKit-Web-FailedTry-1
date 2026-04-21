/** Small UI building blocks (buttons, inputs) vs full app features (auth, billing, heroes). */
export type PackageKind = "component" | "scaffold";
export interface ComponentEntry {
    name: string;
    displayName: string;
    description: string;
    /** Topic label (e.g. authentication, marketing, forms). */
    category: string;
    /** `component` = small UI primitives; `scaffold` = full features (routes, APIs, flows). */
    kind: PackageKind;
    templates: string[];
    platforms: string[];
    hasVariants: boolean;
    variants?: {
        id: string;
        label: string;
        description: string;
    }[];
    latestVersion: string;
    tags: string[];
}
export declare function normalizeKind(value: unknown): PackageKind;
/** Filters for listing registry packages (components + scaffolds). */
export interface ListComponentsFilters {
    template?: string;
    kind?: PackageKind;
}
