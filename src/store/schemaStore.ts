//
// State Management for db Schema
//

import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { ColumnData, ColumnSchema } from '../Types';

//reference state (used to add reference to foreign keys)

let schemaStore = (set: (arg0: { (state: any): any; (state: any): any }) => any) => ({
  //schemaStore state
  schemaStore: null,
  setSchemaStore: (schema: any) =>
    set((state: any) => ({ ...state, schemaStore: schema })),
  addTableSchema: (tableName: string) => set((state) => ({ ...state, [tableName]: {} })),
  addColumnSchema: (tableName: string, columnData: ColumnData) =>
    set((state) => {
      // write dield_name const
      const newCol: ColumnSchema = {
        Name: columnData.name,
        Value: columnData.defaultValue,
        TableName: tableName,
        // TODO: see if we can get away with not initializing an empty reference
        References: [
          {
            PrimaryKeyName: '',
            PrimaryKeyTableName: tableName,
            ReferencesPropertyName: '',
            ReferencesTableName: '',
            IsDestination: false,
            constraintName: '',
          },
        ],
        IsPrimaryKey: columnData.isPrimary,
        IsForeignKey: false,
      };
    }),

  setReference: (newRef: any) => set((state: any) => ({ ...state, reference: newRef })),
});

const useSchemaStore = create(devtools(schemaStore));

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
