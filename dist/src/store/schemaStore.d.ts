import { ColumnData, ColumnSchema, InnerReference } from '@/Types';
interface RestrictedNames {
    [name: string]: boolean;
}
export type SchemaStore = {
    [TableName: string]: {
        [ColumnName: string]: ColumnSchema;
    };
};
export type SchemaState = {
    schemaStore: SchemaStore;
    system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL' | 'SQLite';
    history: SchemaStore[];
    historyCounter: number;
    setSchemaStore: (schema: SchemaStore) => void;
    addTableSchema: (tableName: string, columnDataArr: ColumnData[]) => void;
    deleteTableSchema: (tableName: string) => void;
    addColumnSchema: (tableName: string, columnDataArr: ColumnData[]) => void;
    deleteColumnSchema: (tableRef: string, columnRef: string) => void;
    _addHistory: (newState: any) => void;
    undoHandler: () => void;
    redoHandler: () => void;
    addForeignKeySchema: (referenceData: InnerReference) => void;
    setSystem: (system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL' | 'SQLite') => void;
    _checkNameValidity: (...names: string[]) => void;
    _checkTableValidity: (tableName: string, columnDataArr?: ColumnData[]) => void;
    _checkColumnValidity: (tableName: string, columnDataArr: ColumnData[]) => void;
    _checkColumnNamesAndDupes: (ColumnDataArr: ColumnData[]) => void;
    _countPrimaries: (ColumnDataArr: ColumnData[]) => number;
    _addColumns: (newStore: SchemaStore, tableName: string, columnDataArr: ColumnData[]) => SchemaStore;
    _restrictedMySqlNames: RestrictedNames;
    _restrictedPgNames: RestrictedNames;
};
declare const useSchemaStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<SchemaState>, "subscribe"> & {
    subscribe: {
        (listener: (selectedState: SchemaState, previousSelectedState: SchemaState) => void): () => void;
        <U>(selector: (state: SchemaState) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: ((a: U, b: U) => boolean) | undefined;
            fireImmediately?: boolean | undefined;
        } | undefined): () => void;
    };
}, "setState"> & {
    setState<A extends string | {
        type: unknown;
    }>(partial: SchemaState | Partial<SchemaState> | ((state: SchemaState) => SchemaState | Partial<SchemaState>), replace?: boolean | undefined, action?: A | undefined): void;
}>;
export default useSchemaStore;
//# sourceMappingURL=schemaStore.d.ts.map