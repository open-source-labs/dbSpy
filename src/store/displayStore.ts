//
// State Management for React Flow
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';



const displayStore = (set) => ({
  //displayStore state
  displayStore: null,
  //schema is an object
  setDisplayStore: (schema) =>
    set((state) => ({ ...state, displayStore: schema })),
});

displayStore = devtools(displayStore);
displayStore = persist(displayStore);
const useDisplayStore = create(displayStore);

export default useDisplayStore;

// Here is the shape of the object in the store
//     {
//       [table]: {
//         [column name]: {
//            Name: string,
//            Value: any,
//            TableName: string,
//            References: [
//              {
//                PrimaryKeyName: string,
//                ReferencesPropertyName: string,
//                PrimaryKeyTableName: string,
//                ReferencesTableName: string,
//                IsDestination: boolean,
//                constrainName: string
//              }
//            ],
//            IsPrimaryKey: boolean,
//            IsForeignKey: boolean,
//            field_name: string,
//            data_type: string,
//            additional_constraints: string
//          }
//       }
//    }
