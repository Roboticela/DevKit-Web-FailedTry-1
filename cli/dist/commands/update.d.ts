import { type InstallOptions } from "../lib/installer.js";
export declare function updateCommand(nameAtVersion: string, opts?: InstallOptions, cwd?: string): Promise<void>;
export declare function upgradeAllCommand(opts?: InstallOptions, cwd?: string): Promise<void>;
