interface ListOptions {
    template?: string;
    installed?: boolean;
    category?: string;
}
export declare function listCommand(opts: ListOptions, cwd?: string): Promise<void>;
export {};
