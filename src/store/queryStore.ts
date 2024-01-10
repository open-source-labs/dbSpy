//
// State Management for Queries
//
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const queryStore = (
  set: (
    arg0: { (state: any): any; (state: any): any; (state: any): any },
    arg1?: boolean,
    arg2?: string
  ) => any
) => ({
  queries: [],
  // setQueryStore can potentially be used for undo / redo functionality later
  setQueryStore: (queries: string[]) =>
    set((state: any) => ({ ...state, queries }), false, 'setQueryStore in /queryStore'),
  writeAddTableQuery: (tableName: string) =>
    set(
      (state: any) => {
        const newQuery: string = `create table "public"."${tableName}" ();`;
        return {
          ...state,
          queries: [...state.queries, newQuery],
        };
      },
      false,
      'writeAddTableQuery in /queryStore'
    ),
});

const useQueryStore = create(devtools(queryStore));

export default useQueryStore;
