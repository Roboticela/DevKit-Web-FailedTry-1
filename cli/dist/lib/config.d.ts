export interface DevKitConfig {
    $schema?: string;
    devkit: string;
    template: "nextjs-compact" | "vite-express-tauri";
    site: {
        name: string;
        url: string;
        icon?: string;
        description?: string;
    };
    theme?: {
        preset?: string;
        colors?: {
            primary?: string;
            secondary?: string;
        };
        fonts?: {
            sans?: string;
            mono?: string;
            display?: string;
        };
        radius?: string;
        darkMode?: boolean;
        darkModeStrategy?: "class" | "media";
    };
    auth?: Record<string, unknown>;
    subscriptions?: Record<string, unknown>;
    storage?: Record<string, unknown>;
    database?: {
        url?: string;
    };
}
export interface DevKitLock {
    lockVersion: number;
    template: string;
    components: Record<string, {
        version: string;
        variant?: string | null;
        resolved: string;
        integrity?: string;
        installedAt: string;
    }>;
}
export declare function configExists(cwd?: string): boolean;
export declare function readConfig(cwd?: string): DevKitConfig;
export declare function writeConfig(config: DevKitConfig, cwd?: string): void;
export declare function readLock(cwd?: string): DevKitLock;
export declare function writeLock(lock: DevKitLock, cwd?: string): void;
export declare function getInstalledComponents(cwd?: string): string[];
export declare function isComponentInstalled(name: string, cwd?: string): boolean;
export declare function defaultConfig(template: DevKitConfig["template"], siteName: string, siteUrl: string): DevKitConfig;
