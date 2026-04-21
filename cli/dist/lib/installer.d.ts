/** Options for installing or updating a component. */
export interface InstallOptions {
    /**
     * When true, replace managed files even if the user edited them since install.
     * Default: keep local edits (skip copy) and retain their hashes in the manifest.
     */
    force?: boolean;
}
export declare function installComponent(name: string, template: string, version: string | undefined, variant: string | undefined, cwd?: string, options?: InstallOptions): Promise<void>;
export declare function removeComponent(name: string, cwd?: string): void;
