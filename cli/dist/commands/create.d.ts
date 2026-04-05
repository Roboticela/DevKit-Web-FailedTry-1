interface CreateOptions {
    template?: string;
    preset?: string;
    primary?: string;
    git?: boolean;
    install?: boolean;
    add?: string;
    yes?: boolean;
}
export declare function createCommand(projectName: string | undefined, opts: CreateOptions): Promise<void>;
export {};
