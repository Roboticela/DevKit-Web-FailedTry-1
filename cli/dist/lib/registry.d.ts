export interface ComponentEntry {
    name: string;
    displayName: string;
    description: string;
    category: string;
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
