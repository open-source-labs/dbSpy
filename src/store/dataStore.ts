//das is working on it...... help.....
import create from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { DataState } from '@/Types';

const useDataStore = create<DataState>()(
  // subscribeWithSelector middleware allows components (e.g., Flow.tsx) to listen for changes in store
  subscribeWithSelector(
    // devtools middleware allows use of Redux devtool in chrome
    devtools(
      // store function - 'get' parameter is basically a `this` alias when invoked
      (set, _get) => ({
        dataStore: {},
        system: 'PostgreSQL',
        history: [{}],
        historyCounter: 0,
        setSystem: (system: any) => set((state) => ({ ...state, system })),
        setDataStore: (dataInfo) => set((state) => ({ ...state, dataStore: dataInfo })),
      })
    )
  )
);

export default useDataStore;
