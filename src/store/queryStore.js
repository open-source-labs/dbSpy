//
// State Management for Queries
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let queryStore = (set) => ({
  queryStore: new Map(),
  setQueryStore: (queries) => set((state) => ({ ...state, queryStore: queries })),
  queryList: [],
  setQueryList: (list) => set((state) => ({ ...state, queryList: list })),
  queryInd: 0,
  setQueryInd: (newInd) => set((state) => ({ ...state, queryInd: newInd })),
});

queryStore = devtools(queryStore);
const useQueryStore = create(queryStore);

export default useQueryStore;
