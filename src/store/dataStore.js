//
// State Management for Data
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let dataStore = (set) => ({
  dataStore: new Map(),
  setDataStore: (data) => set((state) => ({ ...state, dataStore: data })),
  dataInd: 0,
  setDataInd: (newInd) => set((state) => ({ ...state, dataInd: newInd })),
});

dataStore = devtools(dataStore);
const useDataStore = create(dataStore);

export default useDataStore;


//dataStore is not in use. This can be used for history feature