//
// State Management for Data
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let dataStore = (set: (arg0: { (state: any): any; (state: any): any; }) => any) => ({
    dataStore: new Map(),
    setDataStore: (data: any) => set((state: any) => ({ ...state, dataStore: data })),
    dataInd: 0,
    setDataInd: (newInd: any) => set((state: any) => ({ ...state, dataInd: newInd })),
});


const useDataStore = create(devtools(dataStore))

export default useDataStore;


//dataStore is not in use. This can be used for history feature