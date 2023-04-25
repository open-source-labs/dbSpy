declare const useQueryStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<{
    queries: never[];
    setQueryStore: (queries: string[]) => any;
    writeAddTableQuery: (tableName: string) => any;
}>, "setState"> & {
    setState<A extends string | {
        type: unknown;
    }>(partial: {
        queries: never[];
        setQueryStore: (queries: string[]) => any;
        writeAddTableQuery: (tableName: string) => any;
    } | Partial<{
        queries: never[];
        setQueryStore: (queries: string[]) => any;
        writeAddTableQuery: (tableName: string) => any;
    }> | ((state: {
        queries: never[];
        setQueryStore: (queries: string[]) => any;
        writeAddTableQuery: (tableName: string) => any;
    }) => {
        queries: never[];
        setQueryStore: (queries: string[]) => any;
        writeAddTableQuery: (tableName: string) => any;
    } | Partial<{
        queries: never[];
        setQueryStore: (queries: string[]) => any;
        writeAddTableQuery: (tableName: string) => any;
    }>), replace?: boolean | undefined, action?: A | undefined): void;
}>;
export default useQueryStore;
//# sourceMappingURL=queryStore.d.ts.map