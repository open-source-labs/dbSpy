import useSchemaStore from '../../src/store/schemaStore';
import { act, cleanup, renderHook, RenderHookResult } from '@testing-library/react';
import { SchemaState, SchemaStore } from '../../src/store/schemaStore';
import { Reference } from '@/Types';

describe('unit testing schemaStore', () => {
  const newSchema: SchemaStore = {
    table1: {
      column1: {
        Name: 'column1',
        Value: null,
        TableName: 'table1',
        References: [
          {
            PrimaryKeyName: '',
            ReferencesPropertyName: '',
            PrimaryKeyTableName: '',
            ReferencesTableName: '',
            IsDestination: false,
            constraintName: '',
          },
        ],
        IsPrimaryKey: true,
        IsForeignKey: false,
        field_name: 'column1',
        data_type: 'SERIAL',
        additional_constraints: 'NOT NULL',
      },
    },
    table2: {
      column2: {
        Name: 'column2',
        Value: null,
        TableName: 'table2',
        References: [
          {
            PrimaryKeyName: '',
            ReferencesPropertyName: '',
            PrimaryKeyTableName: '',
            ReferencesTableName: '',
            IsDestination: false,
            constraintName: '',
          },
        ],
        IsPrimaryKey: true,
        IsForeignKey: false,
        field_name: 'column2',
        data_type: 'SERIAL',
        additional_constraints: 'NOT NULL',
      },
    },
  };

  let result: any;
  beforeEach(() => {
    result = renderHook(useSchemaStore).result;
  });

  describe('schemaState shape', () => {
    it('matches the snapshot', () => {
      const schemaState = renderHook(useSchemaStore).result.current as SchemaState;
      expect(schemaState).toMatchSnapshot();
    });
  });

  describe('setSchemaStore', () => {
    it('sets state', () => {
      act(() => {
        const schemaState = result.current as SchemaState;
        schemaState.setSchemaStore(newSchema);
      });
      const { schemaStore } = result.current as SchemaState;
      expect(schemaStore).toEqual(newSchema);
    });
  });

  describe('addForeignKeySchema', () => {
    it('sets reference data formatted exactly like data from sql parser', () => {
      const storeWithFk = {
        table1: {
          column1: {
            Name: 'column1',
            Value: null,
            TableName: 'table1',
            References: [
              {
                PrimaryKeyName: 'column1',
                ReferencesPropertyName: 'column1',
                PrimaryKeyTableName: 'table2',
                ReferencesTableName: 'table1',
                IsDestination: false,
                constraintName: 'table1_fk1',
              },
            ],
            IsPrimaryKey: true,
            IsForeignKey: true,
            field_name: 'column1',
            data_type: 'SERIAL',
            additional_constraints: 'NOT NULL',
          },
        },
        table2: {
          column2: {
            Name: 'column2',
            Value: null,
            TableName: 'table2',
            References: [
              {
                PrimaryKeyName: 'column2',
                ReferencesPropertyName: 'column1',
                PrimaryKeyTableName: 'table2',
                ReferencesTableName: 'table1',
                IsDestination: true,
                constraintName: 'table1_fk1',
              },
            ],
            IsPrimaryKey: true,
            IsForeignKey: false,
            field_name: 'column2',
            data_type: 'SERIAL',
            additional_constraints: 'NOT NULL',
          },
        },
      };
      const referenceData: Reference = {
        PrimaryKeyName: 'column2',
        PrimaryKeyTableName: 'table2',
        ReferencesPropertyName: 'column1',
        ReferencesTableName: 'table1',
        IsDestination: false,
        constraintName: 'table1_fk1',
      };
      const { addForeignKeySchema } = result.current as SchemaState;

      act(() => addForeignKeySchema(referenceData));
      const { schemaStore } = result.current as SchemaState;
      expect(schemaStore).toEqual(storeWithFk);
    });
  });
});
