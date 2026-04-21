interface ListOptions {
    template?: string;
    installed?: boolean;
    category?: string;
    kind?: string;
}
export declare function listCommand(opts: ListOptions, cwd?: string): Promise<void>;
export {};
