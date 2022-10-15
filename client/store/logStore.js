//
// State Management for Logging
//

import create from 'zustand';

const useLogStore = create((set) => ({
  logStore: null,
  //logs is a string
  setLogStore: (logs) => set((state) => ({ ...state, logStore: [...state.logStore, logs] })),
}));

export default useLogStore;

