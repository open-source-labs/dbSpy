//
// State Management for db Schema
//

import { table } from 'console';
import create from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { ColumnData, ColumnSchema } from '../Types';

interface RestrictedNames {
  [name: string]: boolean;
}
export interface SchemaStore {
  [TableName: string]: {
    [ColumnName: string]: ColumnSchema;
  };
}
export interface SchemaState {
  // DATA
  schemaStore: SchemaStore;
  system: 'PostgreSQL' | 'MySQL';

  // DATA SETTERS
  setSchemaStore: (schema: SchemaStore) => void;
  addTableSchema: (tableName: string, columnDataArr: ColumnData[]) => void;
  deleteTableSchema: (tableName: string) => void;
  addColumnSchema: (tableName: string, columnDataArr: ColumnData[]) => void;

  // Helper to add columns to table in schemaStore
  _addColumns: (
    newStore: SchemaStore,
    tableName: string,
    columnDataArr: ColumnData[]
  ) => SchemaStore;

  // VALIDATION HELPER METHODS
  _checkNameValidity: (...names: string[]) => void;
  _checkTableValidity: (tableName: string, columnDataArr?: ColumnData[]) => void;
  _checkColumnValidity: (tableName: string, columnDataArr: ColumnData[]) => void;
  _checkColumnDataDuplicates: (ColumnDataArr: ColumnData[]) => void;

  // VALIDATION CONSTANTS
  _restrictedMySqlNames: RestrictedNames;
  _restrictedPgNames: RestrictedNames;
}

// For Zustand to work nicely with TS, just include store interface as a generic for `create()`
// see https://www.npmjs.com/package/zustand#typescript-usage
const useSchemaStore = create<SchemaState>()(
  // subscribeWithSelector middleware allows components (e.g., Flow.tsx) to listen for changes in store
  subscribeWithSelector(
    // devtools middleware allows use of Redux devtool in chrome
    devtools(
      // store function - 'get' parameter is basically a `this` alias when invoked
      (set, get) => ({
        //schemaStore state
        schemaStore: {},
        system: 'PostgreSQL',
        setSchemaStore: (schema) => set((state) => ({ ...state, schemaStore: schema })),
        addTableSchema: (tableName, columnDataArr) =>
          set((state) => {
            // Check data validity first. If invalid, error is thrown
            get()._checkTableValidity(tableName, columnDataArr);
            const newState = {
              ...state,
              schemaStore: {
                ...state.schemaStore,
                [tableName]: {},
              },
            };
            newState.schemaStore = get()._addColumns(
              newState.schemaStore,
              tableName,
              columnDataArr
            );
            return newState;
          }),
        deleteTableSchema: (tableName) =>
          set((state) => {
            const newState = { ...state };
            delete newState.schemaStore[tableName];
            return newState;
          }),
        addColumnSchema: (tableName, columnDataArr) =>
          set((state) => {
            get()._checkColumnValidity(tableName, columnDataArr);
            // write field_name const
            const newState = { ...state };
            newState.schemaStore = get()._addColumns(
              newState.schemaStore,
              tableName,
              columnDataArr
            );
            return newState;
          }),
        _addColumns: (newStore, tableName, columnDataArr) => {
          for (const columnData of columnDataArr) {
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
            // reassigning newStore so subscriptions pick up on the change
            newStore = {
              ...newStore,
              [tableName]: {
                ...newStore[tableName],
                [columnData.name]: newCol,
              },
            };
          }
          return newStore;
        },
        // TODO: delete setReference after refactoring adding reference functionality
        // setReference: (newRef: any) => set((state: any) => ({ ...state, reference: newRef })),

        // --------------------- Validity Check Helper Functions -------------------------------------
        // validation functions should be run first before adding or editing schema data
        _checkNameValidity(name) {
          const system = get().system;
          const restrictedNames =
            system === 'PostgreSQL'
              ? get()._restrictedPgNames
              : get()._restrictedMySqlNames;
          if (!name || name.length < 1) throw new Error('Names must not be empty');

          if (Object.hasOwn(restrictedNames, name.toUpperCase()))
            throw new Error(
              `Table and column names must not be ${system} syntax (cause: "${name}")`
            );
          if (!name.match(/^[a-zA-Z0-9_]*$/))
            throw new Error(
              `Name must only contain letters, numbers, and underscores (cause: "${name}")`
            );
        },
        _checkTableValidity(tableName, columnDataArr) {
          // Check table name syntax
          const checkNameValidity = get()._checkNameValidity;
          checkNameValidity(tableName);

          // Check against current state
          if (Object.hasOwn(get().schemaStore, tableName))
            throw new Error(`Schema already contains table named "${tableName}"`);

          // If columnDataArr is being passed as arg, that means the table is being initialized
          if (columnDataArr) {
            // Check table has *one* primary key
            const pkCount = columnDataArr.filter((column) => column.isPrimary).length;
            if (pkCount !== 1)
              throw new Error(
                `Table must have one primary key (currently has ${pkCount})`
              );

            // Check name for duplicates
            get()._checkColumnDataDuplicates(columnDataArr);
          }
        },
        _checkColumnValidity(tableName, columnDataArr) {
          console.log({ tableName });
          const currentTable = get().schemaStore[tableName];

          for (const column of columnDataArr) {
            // Check column name syntax
            get()._checkNameValidity(column.name);

            // Check against current state
            console.log({ currentTable });
            if (Object.hasOwn(currentTable, column.name))
              throw new Error(
                `Table "${tableName}" already contains column named "${column.name}"`
              );
          }

          // Check data for duplicate names
          get()._checkColumnDataDuplicates(columnDataArr);
        },
        _checkColumnDataDuplicates(columnDataArr) {
          const nameRegister: { [name: string]: boolean } = {};
          for (const { name } of columnDataArr) {
            // Check column name syntax
            get()._checkNameValidity(name);
            // Add to name register and throw error if duplicate
            if (nameRegister[name])
              throw new Error(`Table contains duplicate names (${name})`);
            else nameRegister[name] = true;
          }
        },
        // TODO: add validity checks for adding foreign keys
        // TODO: add validity checks for editing / deleting tables and columns (can't if part of foreign key)
        // TODO: add validity check for deleting foreign keys
        _restrictedMySqlNames: {
          ACCESSIBLE: true,
          ADD: true,
          ALL: true,
          ALTER: true,
          ANALYZE: true,
          AND: true,
          AS: true,
          ASC: true,
          ASENSITIVE: true,
          BEFORE: true,
          BETWEEN: true,
          BIGINT: true,
          BINARY: true,
          BLOB: true,
          BOTH: true,
          BY: true,
          CALL: true,
          CASCADE: true,
          CASE: true,
          CHANGE: true,
          CHAR: true,
          CHARACTER: true,
          CHECK: true,
          COLLATE: true,
          COLUMN: true,
          CONDITION: true,
          CONSTRAINT: true,
          CONTINUE: true,
          CONVERT: true,
          CREATE: true,
          CROSS: true,
          CUBE: true,
          CUME_DIST: true,
          CURRENT_DATE: true,
          CURRENT_TIME: true,
          CURRENT_TIMESTAMP: true,
          CURRENT_USER: true,
          CURSOR: true,
          DATABASE: true,
          DATABASES: true,
          DAY_HOUR: true,
          DAY_MICROSECOND: true,
          DAY_MINUTE: true,
          DAY_SECOND: true,
          DEC: true,
          DECIMAL: true,
          DECLARE: true,
          DEFAULT: true,
          DELAYED: true,
          DELETE: true,
          DENSE_RANK: true,
          DESC: true,
          DESCRIBE: true,
          DETERMINISTIC: true,
          DISTINCT: true,
          DISTINCTROW: true,
          DIV: true,
          DOUBLE: true,
          DROP: true,
          DUAL: true,
          EACH: true,
          ELSE: true,
          ELSEIF: true,
          EMPTY: true,
          ENCLOSED: true,
          ESCAPED: true,
          EXCEPT: true,
          EXISTS: true,
          EXIT: true,
          EXPLAIN: true,
          FALSE: true,
          FETCH: true,
          FIRST_VALUE: true,
          FLOAT: true,
          FLOAT4: true,
          FLOAT8: true,
          FOR: true,
          FORCE: true,
          FOREIGN: true,
          FROM: true,
          FULLTEXT: true,
          FUNCTION: true,
          GENERATED: true,
          GET: true,
          GRANT: true,
          GROUP: true,
          GROUPING: true,
          GROUPS: true,
          HAVING: true,
          HIGH_PRIORITY: true,
          HOUR_MICROSECOND: true,
          HOUR_MINUTE: true,
          HOUR_SECOND: true,
          IF: true,
          IGNORE: true,
          IN: true,
          INDEX: true,
          INFILE: true,
          INNER: true,
          INOUT: true,
          INSENSITIVE: true,
          INSERT: true,
          INT: true,
          INT1: true,
          INT2: true,
          INT3: true,
          INT4: true,
          INT8: true,
          INTEGER: true,
          INTERSECT: true,
          INTERVAL: true,
          INTO: true,
          IO_AFTER_GTIDS: true,
          IO_BEFORE_GTIDS: true,
          IS: true,
          ITERATE: true,
          JOIN: true,
          JSON_TABLE: true,
          KEY: true,
          KEYS: true,
          KILL: true,
          LAG: true,
          LAST_VALUE: true,
          LATERAL: true,
          LEAD: true,
          LEADING: true,
          LEAVE: true,
          LEFT: true,
          LIKE: true,
          LIMIT: true,
          LINEAR: true,
          LINES: true,
          LOAD: true,
          LOCALTIME: true,
          LOCALTIMESTAMP: true,
          LOCK: true,
          LONG: true,
          LONGBLOB: true,
          LONGTEXT: true,
          LOOP: true,
          LOW_PRIORITY: true,
          MASTER_BIND: true,
          MASTER_SSL_VERIFY_SERVER_CERT: true,
          MATCH: true,
          MAXVALUE: true,
          MEDIUMBLOB: true,
          MEDIUMINT: true,
          MEDIUMTEXT: true,
          MIDDLEINT: true,
          MINUTE_MICROSECOND: true,
          MINUTE_SECOND: true,
          MOD: true,
          MODIFIES: true,
          NATURAL: true,
          NOT: true,
          NO_WRITE_TO_BINLOG: true,
          NTH_VALUE: true,
          NTILE: true,
          NULL: true,
          NUMERIC: true,
          OF: true,
          ON: true,
          OPTIMIZE: true,
          OPTIMIZER_COSTS: true,
          OPTION: true,
          OPTIONALLY: true,
          OR: true,
          ORDER: true,
          OUT: true,
          OUTER: true,
          OUTFILE: true,
          OVER: true,
          PARTITION: true,
          PERCENT_RANK: true,
          PRECISION: true,
          PRIMARY: true,
          PROCEDURE: true,
          PURGE: true,
          RANGE: true,
          RANK: true,
          READ: true,
          READS: true,
          READ_WRITE: true,
          REAL: true,
          RECURSIVE: true,
          REFERENCES: true,
          REGEXP: true,
          RELEASE: true,
          RENAME: true,
          REPEAT: true,
          REPLACE: true,
          REQUIRE: true,
          RESIGNAL: true,
          RESTRICT: true,
          RETURN: true,
          REVOKE: true,
          RIGHT: true,
          RLIKE: true,
          ROW: true,
          ROWS: true,
          ROW_NUMBER: true,
          SCHEMA: true,
          SCHEMAS: true,
          SECOND_MICROSECOND: true,
          SELECT: true,
          SENSITIVE: true,
          SEPARATOR: true,
          SET: true,
          SHOW: true,
          SIGNAL: true,
          SMALLINT: true,
          SPATIAL: true,
          SPECIFIC: true,
          SQL: true,
          SQLEXCEPTION: true,
          SQLSTATE: true,
          SQLWARNING: true,
          SQL_BIG_RESULT: true,
          SQL_CALC_FOUND_ROWS: true,
          SQL_SMALL_RESULT: true,
          SSL: true,
          STARTING: true,
          STORED: true,
          STRAIGHT_JOIN: true,
          SYSTEM: true,
          TABLE: true,
          TERMINATED: true,
          THEN: true,
          TINYBLOB: true,
          TINYINT: true,
          TINYTEXT: true,
          TO: true,
          TRAILING: true,
          TRIGGER: true,
          TRUE: true,
          UNDO: true,
          UNION: true,
          UNIQUE: true,
          UNLOCK: true,
          UNSIGNED: true,
          UPDATE: true,
          USAGE: true,
          USE: true,
          USING: true,
          UTC_DATE: true,
          UTC_TIME: true,
          UTC_TIMESTAMP: true,
          VALUES: true,
          VARBINARY: true,
          VARCHAR: true,
          VARCHARACTER: true,
          VARYING: true,
          VIRTUAL: true,
          WHEN: true,
          WHERE: true,
          WHILE: true,
          WINDOW: true,
          WITH: true,
          WRITE: true,
          XOR: true,
          YEAR_MONTH: true,
          ZEROFILL: true,
        },
        _restrictedPgNames: {
          ALL: true,
          ANALYSE: true,
          ANALYZE: true,
          AND: true,
          ANY: true,
          ARRAY: true,
          AS: true,
          ASC: true,
          ASYMMETRIC: true,
          BOTH: true,
          CASE: true,
          CAST: true,
          CHECK: true,
          COLLATE: true,
          COLUMN: true,
          CONSTRAINT: true,
          CREATE: true,
          CURRENT_CATALOG: true,
          CURRENT_DATE: true,
          CURRENT_ROLE: true,
          CURRENT_TIME: true,
          CURRENT_TIMESTAMP: true,
          CURRENT_USER: true,
          DEFAULT: true,
          DEFERRABLE: true,
          DESC: true,
          DISTINCT: true,
          DO: true,
          ELSE: true,
          END: true,
          EXCEPT: true,
          FALSE: true,
          FETCH: true,
          FOR: true,
          FOREIGN: true,
          FROM: true,
          GRANT: true,
          GROUP: true,
          HAVING: true,
          IN: true,
          INITIALLY: true,
          INTERSECT: true,
          INTO: true,
          LATERAL: true,
          LEADING: true,
          LIMIT: true,
          LOCALTIME: true,
          LOCALTIMESTAMP: true,
          NOT: true,
          NULL: true,
          OFFSET: true,
          ON: true,
          ONLY: true,
          OR: true,
          ORDER: true,
          PLACING: true,
          PRIMARY: true,
          REFERENCES: true,
          RETURNING: true,
          SELECT: true,
          SESSION_USER: true,
          SOME: true,
          SYMMETRIC: true,
          TABLE: true,
          THEN: true,
          TO: true,
          TRAILING: true,
          true: true,
          UNION: true,
          UNIQUE: true,
          USER: true,
          USING: true,
          VARIADIC: true,
          WHEN: true,
          WHERE: true,
          WINDOW: true,
          WITH: true,
        },
      })
    )
  )
);

export default useSchemaStore;
