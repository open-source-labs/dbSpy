//
// State Management for db Schema
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let schemaStore = (set: (arg0: (state: any) => any) => any) => ({
  //schemaStore state
  schemaStore: null,
  //schema is an object
  setSchemaStore: (schema: any) =>
    set((state: any) => ({ ...state, schemaStore: schema })),
});

// schemaStore = devtools(schemaStore);
// schemaStore = persist(schemaStore);
// const useSchemaStore = create(schemaStore);

const useSchemaStore = create(persist(devtools(schemaStore)));

export default useSchemaStore;

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
