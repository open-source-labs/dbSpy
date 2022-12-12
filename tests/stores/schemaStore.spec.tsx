import useSchemaStore from '../../src/store/schemaStore';
import { act, cleanup, renderHook, RenderHookResult } from '@testing-library/react';
import { SchemaState, SchemaStore } from '../../src/store/schemaStore';
import { ColumnData, Reference } from '@/Types';

describe('unit testing schemaStore', () => {
  // Following tests are tightly coupled because the Zustand store does not reset between tests
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
      const schemaState = result.current as SchemaState;
      act(() => schemaState.setSchemaStore(newSchema));
      const { schemaStore } = result.current as SchemaState;
      expect(schemaStore).toEqual(newSchema);
    });
  });

  describe('setSystem', () => {
    it('sets the system to MySQL or PostgreSQL', () => {
      const { setSystem } = result.current as SchemaState;
      act(() => setSystem('MySQL'));
      const mySqlResult = result.current.system;
      act(() => setSystem('PostgreSQL'));
      const pgResult = result.current.system;
      expect(mySqlResult).toBe('MySQL');
      expect(pgResult).toBe('PostgreSQL');
    });
  });

  describe('addTableSchema', () => {
    // this column should never be added. Used as argument when error from tableName is expected
    const placeholderCol: ColumnData[] = [
      {
        name: 'placeHolder',
        type: 'VARCHAR(255)',
        isNullable: false,
        isPrimary: true,
        defaultValue: null,
      },
    ];

    it('adds table schema', () => {
      const newTable: string = 'table3';
      const newColumn: ColumnData[] = [
        {
          name: 'column3',
          type: 'VARCHAR(255)',
          isNullable: false,
          isPrimary: true,
          defaultValue: null,
        },
      ];
      const oldStore = result.current.schemaStore as SchemaStore;

      const schemaWithNewTable: SchemaStore = {
        ...oldStore,
        table3: {
          column3: {
            Name: 'column3',
            Value: null,
            TableName: 'table3',
            References: [],
            IsPrimaryKey: true,
            IsForeignKey: false,
            field_name: 'column3',
            data_type: 'VARCHAR(255)',
            additional_constraints: 'NOT NULL',
          },
        },
      };

      const { addTableSchema } = result.current as SchemaState;
      act(() => addTableSchema(newTable, newColumn));
      const newStore = result.current.schemaStore as SchemaStore;
      expect(newStore).toEqual(schemaWithNewTable);
    });

    it('throws error for empty table names', () => {
      const { addTableSchema } = result.current as SchemaState;
      expect(() => addTableSchema('', placeholderCol)).toThrowError(
        'Names must not be empty'
      );
    });

    it('throws error for table names using MySQL syntax', () => {
      const { setSystem } = result.current as SchemaState;
      setSystem('MySQL');
      const { addTableSchema } = result.current as SchemaState;
      expect(() => addTableSchema('ACCESSIBLE', placeholderCol)).toThrowError(
        'Table and column names must not be MySQL syntax (cause: "ACCESSIBLE")'
      );
    });

    it('throws error for table names using PostgreSQL syntax', () => {
      const { setSystem } = result.current as SchemaState;
      setSystem('PostgreSQL');
      const { addTableSchema } = result.current as SchemaState;
      expect(() => addTableSchema('ALL', placeholderCol)).toThrowError(
        'Table and column names must not be PostgreSQL syntax (cause: "ALL")'
      );
    });

    it('throws error for table names not containing only letters, numbers, and underscores', () => {
      const { addTableSchema } = result.current as SchemaState;
      expect(() => addTableSchema('name with spaces', placeholderCol)).toThrowError(
        'Name must only contain letters, numbers, and underscores (cause: "name with spaces")'
      );
      expect(() => addTableSchema('name-with-symbols', placeholderCol)).toThrowError(
        'Name must only contain letters, numbers, and underscores (cause: "name-with-symbols")'
      );
    });

    it.todo('throws error for table names already in schemaStore');

    it.todo('throws error for empty column names');

    it.todo('throws error for column names using SQL syntax');

    it.todo(
      'throws error for column names not containing only letters, numbers, and underscores'
    );

    it.todo('throws error if table has more than one primary key');

    it.todo('throws error if submitted columns contain duplicate names');
  });

  describe('addForeignKeySchema', () => {
    it('sets reference data formatted exactly like data from sql parser', () => {
      const oldStore = result.current.schemaStore as SchemaStore;
      const storeWithFk = {
        ...oldStore,
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
  // undo: modify schemaStore and undoHandler should set pre-mod state
  // redo: restores schemaStore to post-mod state
  describe('undoHandler and redoHandler', () => {
    // setup:storing before and after variables so 'it' blocks have references to different states
    // running addTableSchema. is there another way to change state directly instead?
    let previousStore: SchemaStore;
    const undoTable: string = 'undoTable';
    const undoColumn: ColumnData[] = [
      {
        name: 'undoCol',
        type: 'VARCHAR(255)',
        isNullable: false,
        isPrimary: true,
        defaultValue: null,
      },
    ];
    let modifiedStore: SchemaStore;

    it('reverts schemaStore to previous state', () => {
      previousStore = result.current.schemaStore as SchemaStore;
      act(() => {
        const { addTableSchema } = result.current as SchemaState;
        addTableSchema(undoTable, undoColumn);
      });
      modifiedStore = result.current.schemaStore as SchemaStore;
      act(() => {
        const { undoHandler } = result.current as SchemaState;
        undoHandler();
      });
      const { schemaStore } = result.current as SchemaState;
      expect(schemaStore).toEqual(previousStore);
    });

    it('restores schemaStore to modified state', () => {
      act(() => {
        const { redoHandler } = result.current as SchemaState;
        redoHandler();
      });
      const { schemaStore } = result.current as SchemaState;
      expect(schemaStore).toEqual(modifiedStore);
    });
  });
});
