//
// State Management for Queries
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let queryStore = (set: (arg0: { (state: any): any; (state: any): any; (state: any): any; }) => any) => ({
    queryStore: new Map(),
    setQueryStore: (queries: any) => set((state: any) => ({ ...state, queryStore: queries })),
    queryList: new Array(),
    setQueryList: (list: any) => set((state: any) => ({ ...state, queryList: list })),
    queryInd: 0,
    setQueryInd: (newInd: any) => set((state: any) => ({ ...state, queryInd: newInd })),
});

const useQueryStore = create(devtools(queryStore))

export default useQueryStore;

//queryStore is not in use. This can be used for SQL query generation functionality.