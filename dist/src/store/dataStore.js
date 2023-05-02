"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//das is working on it...... help.....
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
const useDataStore = (0, zustand_1.default)()(
// subscribeWithSelector middleware allows components (e.g., Flow.tsx) to listen for changes in store
(0, middleware_1.subscribeWithSelector)(
// devtools middleware allows use of Redux devtool in chrome
(0, middleware_1.devtools)(
// store function - 'get' parameter is basically a `this` alias when invoked
(set, get) => ({
    dataStore: {},
    system: 'PostgreSQL',
    history: [{}],
    historyCounter: 0,
    setSystem: (system) => set((state) => ({ ...state, system })),
    setDataStore: (dataInfo) => set((state) => ({ ...state, dataStore: dataInfo })),
    // _addHistory: (newState) => {
    //   newState.historyCounter += 1;
    //   newState.history[newState.historyCounter] = JSON.parse(
    //     JSON.stringify(newState.dataStore)
    //   );
    //   if (newState.history[newState.historyCounter + 1]) {
    //     newState.history = newState.history.slice(0, newState.historyCounter + 1);
    //   }
    // },
    // addTable: (tableName, rowsArr) =>
    //   set((state) => {
    //     // Check data validity first. If invalid, error is thrown
    //     get()._checkTableValidity(tableName, rowsArr);
    //     const newState = {
    //       ...state,
    //       dataStore: {
    //         ...state.dataStore,
    //         [tableName]: {},
    //       },
    //     };
    //     newState.dataStore = get()._addColumns(
    //       newState.dataStore,
    //       tableName,
    //       rowsArr
    //     );
    //     get()._addHistory(newState);
    //     return newState;
    //   }),
    // deleteTable: (tableName) =>
    //   set((state) => {
    //     const newState = { ...state };
    //     delete newState.dataStore[tableName];
    //     get()._addHistory(newState);
    //     return newState;
    //   }),
    // addRows: (tableName, rowsArr) =>
    //   set((state) => {
    //     get()._checkRowsValidity(tableName, rowsArr);
    //     // write field_name const
    //     const newState = { ...state };
    //     newState.dataStore = get()._addColumns(
    //       newState.dataStore,
    //       tableName,
    //       rowsArr
    //     );
    //     get()._addHistory(newState);
    //     return newState;
    //   }),
    //  deleteRows: (tableRef, rowRef) =>
    //   set((state) => {
    //     const newState = JSON.parse(JSON.stringify(state));
    //     delete newState.dataStore[tableRef][rowRef];
    //     get()._addHistory(newState);
    //     return newState;
    //   }),
    // undoHandler: () => {
    //   set((state) => {
    //     const newState = { ...state };
    //     if (newState.historyCounter === 1) newState.historyCounter -= 1;
    //     if (newState.history.length === 0 || newState.historyCounter === 0) {
    //       newState.dataStore = {};
    //       return newState;
    //     }
    //     newState.historyCounter -= 1;
    //     newState.dataStore = newState.history[newState.historyCounter];
    //     return newState;
    //   });
    // },
    // redoHandler: () => {
    //   set((state) => {
    //     const newState = { ...state };
    //     if (newState.historyCounter >= newState.history.length - 1) return newState;
    //     newState.historyCounter += 1;
    //     newState.dataStore = newState.history[newState.historyCounter];
    //     return newState;
    //   });
    // },
    //  _addRows: (newStore, tableName, rowsArr) => {
    //   for (const ColumnDataForDataTable of rowsArr) {
    //     const newRow: RowsOfData = {
    //       ColumnName: ColumnDataForDataTable,
    //     };
    //     // reassigning newStore so subscriptions pick up on the change
    //     newStore = {
    //       ...newStore,
    //       [tableName]: {
    //         ...newStore[tableName],
    //         [ColumnDataForDataTable[key]]: newRow,
    //       },
    //     };
    //   }
    //   return newStore;
    // }
}))));
exports.default = useDataStore;
//# sourceMappingURL=dataStore.js.map