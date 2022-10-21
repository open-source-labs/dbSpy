//
// State Management for settings (button toggles, view toggles, etc.)
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let settingsStore = (set) => ({
  //darkMode state defaults to true
  darkMode: true,
  sidebarDisplayState: false,
  //toggles darkMode
  setsettingsStore: () => set((state) => ({ darkMode: !state.darkMode })),
});

settingsStore = devtools(settingsStore);
settingsStore = persist(settingsStore);
const useSettingsStore = create(settingsStore);

export default useSettingsStore;
