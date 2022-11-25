//
// State Management for Queries
//

import create from 'zustand';
import { devtools } from 'zustand/middleware';

let queryStore = (
  set: (arg0: { (state: any): any; (state: any): any; (state: any): any }) => any
) => ({
  queries: [],
  // setQueryStore can potentially be used for undo / redo functionality later
  setQueryStore: (queries: string[]) => set((state: any) => ({ ...state, queries })),
  addTable: (tableName: string) =>
    set((state: any) => {
      const newQuery = `create table "public"."${tableName}" ();`;
      return {
        ...state,
        queries: [...state.queries, newQuery],
      };
    }),
});

const useQueryStore = create(devtools(queryStore));

export default useQueryStore;

//queryStore is not in use. This can be used for SQL query generation functionality.
