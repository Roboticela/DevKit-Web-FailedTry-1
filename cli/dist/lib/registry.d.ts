import type { ComponentEntry } from "./component-entry.js";
export type { ComponentEntry };
export declare function listComponents(template?: string): Promise<ComponentEntry[]>;
export declare function getComponentInfo(name: string): Promise<Record<string, unknown>>;
export declare function getManifest(name: string, template: string, version?: string, variant?: string): Promise<{
    name: string;
    template: string;
    version: string;
    variant: string | null;
    manifest: Record<string, unknown>;
}>;
export declare function healthCheck(): Promise<boolean>;
