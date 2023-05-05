//need to finish building this file#####################

import { DataStore } from '@/Types';
import create from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
// import { DataState } from '@/Types';

// type DataRowArray = Array<string | number | boolean | null>

export type DataState = {
  // DATA
  dataStore: DataStore;
  system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL';
  history: DataStore[];
  historyCounter: number;

  // DATA SETTERS
  setDataStore: (dataInfo: DataStore) => void;
  addTableData: (tableName: string, rowDataArr: any) => void;
        addRow: (tableName: string, rowDataArr: any) => void,
    _addHistory: (newState: any) => void;
  setSystem: (system: DataStore) => void;

  // _checkTableValidity: (tableName: string, rowDataArr?: DataRowArray[]) => void;
    _addRows: (
    newStore: DataStore,
    tableName: string,
    columnDataArr: any
  ) => DataStore;
}

const useDataStore = create<DataState>()(
  // subscribeWithSelector middleware allows components (e.g., Flow.tsx) to listen for changes in store
  subscribeWithSelector(
    // devtools middleware allows use of Redux devtool in chrome
    devtools(
      // store function - 'get' parameter is basically a `this` alias when invoked
      (set, get) => ({
        dataStore: {},
        system: 'PostgreSQL',
        history: [],
        historyCounter: 0,
        setSystem: (system) => set((state) => ({ ...state, system })),
        setDataStore: (dataInfo) => set((state) => ({ ...state, dataStore: dataInfo })),
        addRow: (tableName, rowDataArr) =>
          set((state) => {
            console.log('are we in here??? dataStore',state)
            const newState = { ...state };
            newState.dataStore = get()._addRows(
              newState.dataStore,
              tableName,
              rowDataArr
            );
            get()._addHistory(newState);
            return newState;
          }),
        _addHistory: (newState) => {
          // newState.historyCounter += 1;
          // newState.history[newState.historyCounter] = JSON.parse(  //ERROR!!!
          //   JSON.stringify(newState.dataStore)
          // );
          // if (newState.history[newState.historyCounter + 1]) {
          //   newState.history = newState.history.slice(0, newState.historyCounter + 1);
          // }
          console.log(newState)
        },
        addTableData: (tableName, rowDataArr) => {
          set((state) => {
            // Check data validity first. If invalid, error is thrown
            // get()._checkTableValidity(tableName, rowDataArr);
            const newState = {
              ...state,
              dataStore: {
                ...state.dataStore,
                [tableName]: {},
              },
            };
            newState.dataStore = get()._addRows(
              newState.dataStore,
              tableName,
              rowDataArr
            );
            get()._addHistory(newState);
            return newState;
          });
        },
        _addRows: (newStore, tableName, rowDataArr) => {
          const newRow: rowData = rowDataArr
            // reassigning newStore so subscriptions pick up on the change
          newStore = {
            ...newStore,
            [tableName]: {
              ...newStore[tableName],
              newRow,
            },
          };
        }
          
        
      })
    )
  )
);

export default useDataStore;
