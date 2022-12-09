import useSchemaStore from '../../src/store/schemaStore';
import { act, renderHook } from '@testing-library/react';
import { SchemaState, SchemaStore } from '../../src/store/schemaStore';

describe('unit testing schemaStore', () => {
  describe('schemaState shape', () => {
    it('should match the snapshot', () => {
      const schemaState = renderHook(useSchemaStore).result.current as SchemaState;
      expect(schemaState).toMatchSnapshot();
    });
  });

  describe('setSchemaStore', () => {
    it('sets state', () => {
      const newSchema: SchemaStore = {
        table1: {
          id: {
            Name: 'id',
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
            field_name: 'id',
            data_type: 'SERIAL',
            additional_constraints: 'NOT NULL',
          },
        },
      };
      const { result } = renderHook(useSchemaStore);

      act(() => {
        const schemaState = result.current as SchemaState;
        schemaState.setSchemaStore(newSchema);
      });
      const { schemaStore } = result.current as SchemaState;
      expect(schemaStore).toEqual(newSchema);
    });
  });

  // describe('addTableSchema', () => {
  //   it('');
  // });
});
