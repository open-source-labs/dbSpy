//
// State Management for db Schema
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let schemaStore = (set) => ({
  //schemaStore state
  schemaStore: null,
  setSchemaStore: (schema) => set((state) => ({ ...state, schemaStore: schema })),
  //reference state (used to add reference to foreign keys)
  reference: [
    {
      PrimaryKeyName: '',
      ReferencesPropertyName: '',
      PrimaryKeyTableName: '',
      ReferencesTableName: '',
      IsDestination: '',
      constrainName: '',
    },
  ],
  setReference: (newRef) => set((state) => ({ ...state, reference: newRef })),
});

schemaStore = devtools(schemaStore);
const useSchemaStore = create(schemaStore);

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
// row.TableName - row.field_name - IsPrimaryKey
