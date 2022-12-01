//
// State Management for db Schema
//

import create from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { ColumnData, ColumnSchema } from '../Types';

//reference state (used to add reference to foreign keys)

let schemaStore = (set: (arg0: { (state: any): any; (state: any): any }) => any) => ({
  //schemaStore state
  schemaStore: {},
  setSchemaStore: (schema: any) =>
    set((state: any) => ({ ...state, schemaStore: schema })),
  addTableSchema: (tableName: string) =>
    set((state) => {
      console.log('adding table schema');
      const newState = {
        ...state,
        schemaStore: {
          ...state.schemaStore,
          [tableName]: {},
        },
      };
      console.log({ newState });
      return newState;
    }),
  addColumnSchema: (tableName: string, columnData: ColumnData) =>
    set((state) => {
      // write field_name const
      console.log('adding column schema');
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
        field_name: columnData.name.replace(/\s/g, '_'),
        data_type: columnData.type,
        additional_constraints: columnData.isNullable ? 'NULL' : 'NOT NULL',
      };
      const newState = {
        ...state,
        schemaStore: {
          ...state.schemaStore,
          [tableName]: {
            ...state.schemaStore[tableName],
            [columnData.name]: newCol,
          },
        },
      };
      console.log({ newState });
      return newState;
    }),

  setReference: (newRef: any) => set((state: any) => ({ ...state, reference: newRef })),
});

// subscribeWithSelector allows us to listen for changes in store
// listener is in Flow.jsx
const useSchemaStore = create(subscribeWithSelector(devtools(schemaStore)));

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
