//need to finish building this file#####################

import { DataStore } from '@/Types';
import create from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
// import { DataState } from '@/Types';

type DataRowArray = Array<string | number | boolean | null>

export type DataState = {
  // DATA
  dataStore: DataStore;
  system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL';
  history: DataStore[];
  historyCounter: number;

  // DATA SETTERS
  setDataStore: (dataInfo: DataStore) => void;
  addTableData: (tableName: string, rowDataArr: DataRowArray[]) => void;
        addRow: (tableName: string, columnDataArr: DataRowArray[]) => void,
    _addHistory: (newState: any) => void;
  setSystem: (system: DataStore) => void;

  // _checkTableValidity: (tableName: string, rowDataArr?: DataRowArray[]) => void;
    _addRows: (
    newStore: DataStore,
    tableName: string,
    columnDataArr: DataRowArray[]
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
        _addHistory: (newState) => {
          newState.historyCounter += 1;
          newState.history[newState.historyCounter] = JSON.parse(
            JSON.stringify(newState.dataStore)
          );
          if (newState.history[newState.historyCounter + 1]) {
            newState.history = newState.history.slice(0, newState.historyCounter + 1);
          }
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
          const newRow: rowData = rowDataArr[rowDataArr.length-1]
            // reassigning newStore so subscriptions pick up on the change
          newStore = {
            ...newStore,
            [tableName]: {
              ...newStore[tableName],
              [rowData.name]: newRow,
            },
          };
        }
          
        
      })
    )
  )
);

export default useDataStore;
