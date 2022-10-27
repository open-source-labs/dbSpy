// //
// // State Management for settings (button toggles, view toggles, etc.)
// //
// export default useSettingsStore;
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let settingsStore = (set: (arg0: { (state: any): any; (state: any): any; (state: any): any; }) => any) => ({
  darkMode: true,
  setDarkMode: () => set((state: { darkMode: any; }) => ({ ...state, darkMode: !state.darkMode })),

  sidebarDisplayState: false,

  welcome: true,
  setWelcome: (input: any) => set((state: any) => ({ ...state, welcome: input })),

  editRefMode: false,
  setEditRefMode: (input: any) => set((state: any) => ({ ...state, editRefMode: input })),
});

// settingsStore = devtools(settingsStore);
const useSettingsStore = create(devtools(settingsStore));

export default useSettingsStore;


