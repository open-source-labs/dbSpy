// //
// // State Management for settings (button toggles, view toggles, etc.)
// //
// export default useSettingsStore;
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let settingsStore = (
  set: (arg0: { (state: any): any; (state: any): any; (state: any): any }) => any
) => ({
  darkMode: true,
  setDarkMode: () =>
    set((state: { darkMode: any }) => ({ ...state, darkMode: !state.darkMode })),

  sidebarDisplayState: false,

  welcome: true,
  setWelcome: (input: any) => set((state: any) => ({ ...state, welcome: input })),

  currentTable: '',
  currentColumn: '',

  editRefMode: false,
  setEditRefMode: (isEditRefMode: boolean, table: string = '', col: string = '') =>
    set((state: any) => ({
      ...state,
      editRefMode: isEditRefMode,
      currentTable: table,
      currentColumn: col,
    })),

  inputModalState: { isOpen: false, mode: '' },
  setInputModalState: (isOpen: boolean, mode: string = '', currentTable: string = '') => {
    set((state) => ({
      ...state,
      currentTable,
      inputModalState: { isOpen, mode },
    }))
  },

  deleteTableModalState: { isOpen: false },
  setDeleteTableModalState: (isOpen: boolean) => {
    set((state) => ({
      ...state,
      deleteTableModalState: { isOpen },
    }))
  },

  isSchema: true,
  setTableMode: (input:any) =>
    set((state: {isSchema: any}) => ({ ...state, isSchema: !state.isSchema })),
    //!state.isSchema or input??  ##########
});

// settingsStore = devtools(settingsStore);
const useSettingsStore = create(devtools(settingsStore));

export default useSettingsStore;
