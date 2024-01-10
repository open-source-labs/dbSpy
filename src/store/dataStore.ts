import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { DataStore } from '@/Types';

export type DataObj = {
  [key: string]: string | number | boolean | null;
};

export type DataState = {
  // DATA
  dataStore: DataStore;
  system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL' | 'SQLite' | DataStore;
  referenceStore: DataStore;

  // DATA SETTERS
  setDataStore: (dataInfo: DataStore) => void;
  setSystem: (system: DataStore) => void;
  deleteTableData: (tableName: string) => void;
  addTableData: (tableName: string, newRow: DataObj) => void;
  setReferencesStore: (dataInfo: DataStore) => void;

  // Add _addRow function here
  _addRow: (newStore: DataStore, tableName: string, newRow: DataObj) => DataStore;
};

const useDataStore = create<DataState>()(
  // subscribeWithSelector middleware allows components (e.g., Flow.tsx) to listen for changes in store
  subscribeWithSelector(
    // devtools middleware allows use of Redux devtool in chrome
    devtools((set, get) => ({
      referenceStore: {},
      dataStore: {},
      system: 'PostgreSQL',
      setSystem: (system) =>
        set((state) => ({ ...state, system }), false, 'setSystem in /dataStore'),
      setDataStore: (dataInfo) =>
        set(
          (state) => ({ ...state, dataStore: dataInfo }),
          false, // boolean that dictates whether or not zustand will overwrite the entire store with what is returned from set's callback (first arg)
          'setDataStore in /dataStore' // the title being assigned to this set function (will display properly in redux toolkit)
        ),
      // dbSpy 6.0: Modify setReferenceStore to set referenceStore instead of dataStore
      setReferencesStore: (dataInfo) =>
        set(
          (state) => ({ ...state, referenceStore: dataInfo }),
          false,
          'setReferencesStore in /dataStore'
        ),
      deleteTableData: (tableName) =>
        set(
          (state) => {
            const newState = { ...state };
            delete newState.dataStore[tableName];
            return newState;
          },
          false,
          'deleteTableData in /dataStore'
        ),
      addTableData: (tableName, newRow) =>
        set(
          (state) => {
            // write field_name const
            const newState = { ...state };
            // console.log('====> INSIDE addTableData ==> newState: ', newState);
            newState.dataStore = get()._addRow(newState.dataStore, tableName, newRow);
            console.log(
              '====> INSIDE addTableData ==> newState.dataStore: ',
              newState.dataStore
            );
            return newState;
          },
          false,
          'addTableData in /dataStore'
        ),
      // dbSpy v7.0 modified _addRow function below to maintain array structure through state
      _addRow: (newStore, tableName, newRow) => {
        if (!newStore[tableName]) {
          newStore[tableName] = [newRow];
        } else {
          newStore[tableName].push(newRow);
        }
        return newStore;
      },

      // ***** Previous version of _addRow before change by dbSpy v7.0 *****
      // _addRow: (newStore, tableName, newRow) => {
      //   console.log('newStore INSIDE OF _addRow : ', newStore);
      //   console.log('tableName INSIDE OF _addRow : ', tableName);
      //   console.log('newRow INSIDE OF _addRow : ', newRow);
      //   console.log('newRow.length INSIDE OF _addRow : ', newRow.length);
      //   if (newRow.length > 0) {
      //     for (const rowData of newRow) {
      //       console.log('rowData of newRow Inside of _addRow', rowData);
      //       const newRows: DataObj = rowData;
      //       // reassigning newStore so subscriptions pick up on the change
      //       newStore = {
      //         ...newStore,
      //         [tableName]: {
      //           ...newStore[tableName],
      //           [tableName]: rowData,
      //         },
      //       };
      //     }
      //   } else {
      //     console.log('MADE IT TO else BLOCK OF _addRow');
      //     newStore = {
      //       ...newStore,
      //       [tableName]: {
      //         ...newStore[tableName],
      //         [tableName]: newRow,
      //       },
      //     };
      //   }
      //   return newStore;
      // },
    }))
  )
);

export default useDataStore;
