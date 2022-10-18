//
// State Management for Logging
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let logStore = (set) => ({
  //logs state
  logs: null,
  //logEntries is an array
  setLogs: (logEntries) => set((state) => ({ ...state, logs: logEntries })),
});

logStore = devtools(logStore);
logStore = persist(logStore);
const useLogStore = create(logStore);

export default useLogStore;

//Here is the shape of the logStore
//  [
//    { Name: string,
//      Setting: string,
//      Source: string,
//      SourceFile: string,
//      Context: string
//    }
//  ]
