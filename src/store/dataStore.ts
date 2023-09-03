import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { DataStore } from '@/Types';


export type DataObj = {
  [key: string]: string | number | boolean | null
}

export type DataState = {
  // DATA
  dataStore: DataStore;
  system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL' | 'SQLite' | DataStore;
  referenceStore: DataStore;

  // DATA SETTERS
  setDataStore: (dataInfo: DataStore) => void;
  setSystem: (system: DataStore) => void;
  deleteTableData: (tableName: string) => void;
  addTableData: (tableName: string, newRow: DataObj[]) => void;
  setReferencesStore: (dataInfo: DataStore) => void;
  
  // Add _addRow function here
  _addRow: (
    newStore: DataStore,
    tableName: string,
    newRow: DataObj[]
  ) => DataStore;
}


const useDataStore = create<DataState>()(
  // subscribeWithSelector middleware allows components (e.g., Flow.tsx) to listen for changes in store
  subscribeWithSelector(
    // devtools middleware allows use of Redux devtool in chrome
    devtools(
      (set, get) => ({
        referenceStore:{},
        dataStore: {},
        system: 'PostgreSQL',
        setSystem: (system) => 
          set((state) => ({ ...state, system })),
        setDataStore: (dataInfo) =>
          set((state) => ({ ...state, dataStore: dataInfo })),
        setReferencesStore: (dataInfo) =>
          set((state) => ({ ...state, referenceStore: dataInfo })),
        deleteTableData: (tableName) => set((state) => {
          const newState = { ...state };
          delete newState.dataStore[tableName];
          return newState;
        }),
        addTableData: (tableName, newRow) =>
        set((state) => {
          // write field_name const
          const newState = { ...state };
          newState.dataStore = get()._addRow(
            newState.dataStore,
            tableName,
            newRow
          );
          return newState;
        }),

        _addRow: (newStore, tableName, newRow) => {
          if (newRow.length > 0){
          for (const rowData of newRow) {
            // const newRows: DataObj = rowData;
            // reassigning newStore so subscriptions pick up on the change
            newStore = {
              ...newStore,
              [tableName]: {
                ...newStore[tableName],
                [tableName]: rowData,
              },
            };
          }
          } else {
            newStore = {
              ...newStore,
              [tableName]: {
                ...newStore[tableName],
                [tableName]: newRow,
              },
            };
          };
          return newStore;
        },
      })
    )
  )
);

export default useDataStore;
