import { DataStore } from '@/Types';
export type DataState = {
    dataStore: DataStore;
    system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL' | 'SQLite' | DataStore;
    system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL';
    referenceStore: DataStore;
    setDataStore: (dataInfo: DataStore) => void;
    setSystem: (system: DataStore) => void;
    deleteTableData: (tableName: string) => void;
    setReferencesStore: (dataInfo: DataStore) => void;
};
declare const useDataStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<DataState>, "subscribe"> & {
    subscribe: {
        (listener: (selectedState: DataState, previousSelectedState: DataState) => void): () => void;
        <U>(selector: (state: DataState) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: ((a: U, b: U) => boolean) | undefined;
            fireImmediately?: boolean | undefined;
        } | undefined): () => void;
    };
}, "setState"> & {
    setState<A extends string | {
        type: unknown;
    }>(partial: DataState | Partial<DataState> | ((state: DataState) => DataState | Partial<DataState>), replace?: boolean | undefined, action?: A | undefined): void;
}>;
export default useDataStore;
//# sourceMappingURL=dataStore.d.ts.map