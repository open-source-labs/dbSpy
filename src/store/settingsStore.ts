//
// State Management for settings (button toggles, view toggles, etc.)
//
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const settingsStore = (
  set: (
    arg0: { (state: any): any; (state: any): any; (state: any): any },
    arg1: boolean,
    arg2: string
  ) => any
) => ({
  displayNavBar: false,
  setDisplayNavBar: () =>
    set(
      (state: { displayNavBar: boolean }) => ({
        ...state,
        displayNavBar: !state.displayNavBar,
      }),
      false,
      'setDisplayNavBar in settingsStore'
    ),
  darkMode: true,
  setDarkMode: () =>
    set(
      (state: { darkMode: boolean }) => ({ ...state, darkMode: !state.darkMode }),
      false,
      'setDarkMode in settingsStore'
    ),

  sidebarDisplayState: false,
  // dbSpy 6.0: Include setter for sidebarDisplayState to open/close sidebar from Connect Database button
  setSidebarDisplayState: () =>
    set(
      (state: { sidebarDisplayState: any }) => ({
        ...state,
        sidebarDisplayState: !state.sidebarDisplayState,
      }),
      false,
      'setSidebarDisplayState in /settingsStore'
    ),

  welcome: true,
  setWelcome: (input: any) =>
    set(
      (state: any) => ({ ...state, welcome: input }),
      false,
      'setWelcome in /settingsStore'
    ),

  currentTable: '',
  currentColumn: '',

  editRefMode: false,
  setEditRefMode: (isEditRefMode: boolean, table: string = '', col: string = '') =>
    set(
      (state: any) => ({
        ...state,
        editRefMode: isEditRefMode,
        currentTable: table,
        currentColumn: col,
      }),
      false,
      'setEditRefMode in /settingsStore'
    ),

  inputModalState: { isOpen: false, mode: '' },
  setInputModalState: (isOpen: boolean, mode: string = '', currentTable: string = '') => {
    set(
      (state) => ({
        ...state,
        currentTable,
        inputModalState: { isOpen, mode },
      }),
      false,
      'setInputModalState in /settingsStore'
    );
  },

  inputDataModalState: { isOpen: false, mode: '' },
  setDataInputModalState: (
    isOpen: boolean,
    mode: string = '',
    currentTable: string = ''
  ) => {
    set(
      (state) => ({
        ...state,
        currentTable,
        inputDataModalState: { isOpen, mode },
      }),
      false,
      'setDataInputModalState in /settingsStore'
    );
  },

  deleteTableModalState: { isOpen: false },
  setDeleteTableModalState: (isOpen: boolean) => {
    set(
      (state) => ({
        ...state,
        deleteTableModalState: { isOpen },
      }),
      false,
      'setDeleteTableModalState in /settingsStore'
    );
  },
dbName: '',
setDBName: (input: string) => {
  set(
    (state) => ({
      ...state, dbName: input,
    }),
    false,
    'setDbName in /settingsStore'
  );
},
  isSchema: true,
  setTableMode: (input: any) =>
    set(
      (state: { isSchema: any }) => ({ ...state, isSchema: !state.isSchema }),
      false,
      'setTableMode in /settingsStore'
    ),
  //!state.isSchema or input??  ##########
});

// settingsStore = devtools(settingsStore);
const useSettingsStore = create(devtools(settingsStore));

export default useSettingsStore;
