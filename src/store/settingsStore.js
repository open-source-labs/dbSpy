//
// State Management for settings (button toggles, view toggles, etc.)
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let settingsStore = (set) => ({
  darkMode: true,
  setDarkMode: () => set((state) => ({ ...state, darkMode: !state.darkMode })),

  sidebarDisplayState: false,

  welcome: true,
  setWelcome: (input) => set((state) => ({ ...state, welcome: input })),

  editRefMode: false,
  setEditRefMode: (input) => set((state) => ({ ...state, editRefMode: input })),
});

settingsStore = devtools(settingsStore);
const useSettingsStore = create(settingsStore);

export default useSettingsStore;
