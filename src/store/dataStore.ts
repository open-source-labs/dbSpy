import { DataStore } from '@/Types';
import create from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export type DataState = {
  // DATA
  dataStore: DataStore;
  system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL' | 'SQLite' | DataStore;
  system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL';
  referenceStore: DataStore;

  // DATA SETTERS
  setDataStore: (dataInfo: DataStore) => void;
  setSystem: (system: DataStore) => void;
  deleteTableData: (tableName: string) => void;
  setReferencesStore: (dataInfo: DataStore) => void;
}

const useDataStore = create<DataState>()(
  // subscribeWithSelector middleware allows components (e.g., Flow.tsx) to listen for changes in store
  subscribeWithSelector(
    // devtools middleware allows use of Redux devtool in chrome
    devtools(
      (set) => ({
        referenceStore:{},
        dataStore: {},
        system: 'PostgreSQL',
        setSystem: (system) => 
          set((state) => ({ ...state, system })),
        setDataStore: (dataInfo) => 
          set((state) => ({ ...state, dataStore: dataInfo })),
        deleteTableData: (tableName) => set((state) => {
          const newState = { ...state };
          delete newState.dataStore[tableName];
          return newState;
        }),
        setReferencesStore: (dataInfo) => set((state) => ({ ...state, referenceStore: dataInfo })),
      })
    )
  )
);

export default useDataStore;
