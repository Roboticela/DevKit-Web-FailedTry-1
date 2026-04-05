interface AddOptions {
    variant?: string;
    dryRun?: boolean;
}
export declare function addCommand(names: string[], opts: AddOptions, cwd?: string): Promise<void>;
export {};
