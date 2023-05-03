import { RowsOfData } from '../Types';
export type DataStore = {
    [TableName: string]: RowsOfData[];
};
export type DataState = {
    dataStore: DataStore;
    system: 'PostgreSQL' | 'MySQL';
    history: DataStore[];
    historyCounter: number;
    setDataStore: (dataInfo: DataStore) => void;
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