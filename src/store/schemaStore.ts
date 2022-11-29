//
// State Management for db Schema
//

import create from 'zustand';
import { devtools } from 'zustand/middleware';

let schemaStore = (set: (arg0: { (state: any): any; (state: any): any; }) => any) => ({
  //schemaStore state
  schemaStore: null,
  setSchemaStore: (schema: any) => set((state: any) => ({ ...state, schemaStore: schema })),

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
  setReference: (newRef: any) => set((state: any) => ({ ...state, reference: newRef })),
});

const useSchemaStore = create(devtools(schemaStore))

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


// const schema: SchemaObject = {
//   'testTable': {
//     'testTable': {
//       Name: 'testColumn',
//       Value: 10,
//       TableName: 'testTable',
//       References: [{
//         PrimaryKeyName: "",
//         ReferencesPropertyName: "",
//         PrimaryKeyTableName: "",
//         ReferencesTableName: "",
//         IsDestination: false,
//         constrainName: ""
//       }],
//       IsPrimaryKey: false,
//       IsForeignKey: false,
//       field_name: "uhhh",
//       data_type: 'BigInt',
//       additional_constraints: ""
//     }
//   }
// }