"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemaStore_1 = __importDefault(require("../../src/store/schemaStore"));
const react_1 = require("@testing-library/react");
describe('unit testing schemaStore', () => {
    // Following tests are tightly coupled because the Zustand store does not reset between tests
    // `result` is latest schema state
    // schema state methods that are used in multiple tests are defined here
    let result;
    let addTableSchema;
    let setSystem;
    let addColumnSchema;
    let setSchemaStore;
    beforeEach(() => {
        result = (0, react_1.renderHook)(schemaStore_1.default).result;
        addTableSchema = result.current.addTableSchema;
        setSystem = result.current.setSystem;
        addColumnSchema = result.current.addColumnSchema;
        setSchemaStore = result.current.setSchemaStore;
    });
    describe('schemaState shape', () => {
        it('matches the snapshot', () => {
            const schemaState = (0, react_1.renderHook)(schemaStore_1.default).result.current;
            expect(schemaState).toMatchSnapshot();
        });
    });
    describe('setSchemaStore', () => {
        it('sets state', () => {
            const newSchema = {
                table1: {
                    column1: {
                        Name: 'column1',
                        Value: null,
                        TableName: 'table1',
                        References: [],
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
            (0, react_1.act)(() => setSchemaStore(newSchema));
            const { schemaStore } = result.current;
            expect(schemaStore).toEqual(newSchema);
        });
    });
    describe('setSystem', () => {
        it('sets the system to MySQL or PostgreSQL', () => {
            (0, react_1.act)(() => setSystem('MySQL'));
            const mySqlResult = result.current.system;
            (0, react_1.act)(() => setSystem('PostgreSQL'));
            const pgResult = result.current.system;
            expect(mySqlResult).toBe('MySQL');
            expect(pgResult).toBe('PostgreSQL');
        });
    });
    describe('addTableSchema', () => {
        // this column should never actually be added. Used as argument when error from tableName is expected
        const placeholderCol = [
            {
                name: 'placeHolder',
                type: 'VARCHAR(255)',
                isNullable: false,
                isPrimary: true,
                defaultValue: null,
            },
        ];
        it('adds table schema', () => {
            const newTable = 'table3';
            const newColumn = [
                {
                    name: 'column3',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: true,
                    defaultValue: null,
                },
            ];
            const oldStore = result.current.schemaStore;
            const schemaWithNewTable = {
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
            (0, react_1.act)(() => addTableSchema(newTable, newColumn));
            const newStore = result.current.schemaStore;
            expect(newStore).toEqual(schemaWithNewTable);
        });
        it('throws error for empty table names', () => {
            expect(() => addTableSchema('', placeholderCol)).toThrowError('Names must not be empty');
        });
        it('throws error for table names using MySQL syntax', () => {
            (0, react_1.act)(() => setSystem('MySQL'));
            expect(() => addTableSchema('ACCESSIBLE', placeholderCol)).toThrowError('Table and column names must not be MySQL syntax (cause: "ACCESSIBLE")');
        });
        it('throws error for table names using PostgreSQL syntax', () => {
            (0, react_1.act)(() => setSystem('PostgreSQL'));
            expect(() => addTableSchema('ALL', placeholderCol)).toThrowError('Table and column names must not be PostgreSQL syntax (cause: "ALL")');
        });
        it('throws error for table names not containing only letters, numbers, and underscores', () => {
            expect(() => addTableSchema('name with spaces', placeholderCol)).toThrowError('Name must only contain letters, numbers, and underscores (cause: "name with spaces")');
            expect(() => addTableSchema('name-with-symbols', placeholderCol)).toThrowError('Name must only contain letters, numbers, and underscores (cause: "name-with-symbols")');
        });
        it('throws error for table names already in schemaStore', () => {
            (0, react_1.act)(() => addTableSchema('duplicate', placeholderCol));
            expect(() => addTableSchema('duplicate', placeholderCol)).toThrowError('Schema already contains table named "duplicate"');
        });
        it('throws error for empty column names', () => {
            const emptyCol = [
                {
                    name: '',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: true,
                    defaultValue: null,
                },
            ];
            expect(() => addTableSchema('placeholder', emptyCol)).toThrowError('Names must not be empty');
        });
        it('throws error for column names using MySQL syntax', () => {
            (0, react_1.act)(() => setSystem('MySQL'));
            const syntaxCol = [
                {
                    name: 'explain',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: true,
                    defaultValue: null,
                },
            ];
            expect(() => addTableSchema('placeholder', syntaxCol)).toThrowError('Table and column names must not be MySQL syntax (cause: "explain")');
        });
        it('throws error for column names using PostgreSQL syntax', () => {
            (0, react_1.act)(() => setSystem('PostgreSQL'));
            const syntaxCol = [
                {
                    name: 'end',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: true,
                    defaultValue: null,
                },
            ];
            expect(() => addTableSchema('placeholder', syntaxCol)).toThrowError('Table and column names must not be PostgreSQL syntax (cause: "end")');
        });
        it('throws error for column names not containing only letters, numbers, and underscores', () => {
            const spaceCol = [
                {
                    name: 'col with spaces',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: true,
                    defaultValue: null,
                },
            ];
            const symbolCol = [
                {
                    name: 'col-with-symbols',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: true,
                    defaultValue: null,
                },
            ];
            expect(() => addTableSchema('placeholder', spaceCol)).toThrowError('Name must only contain letters, numbers, and underscores (cause: "col with spaces"');
            expect(() => addTableSchema('placeholder', symbolCol)).toThrowError('Name must only contain letters, numbers, and underscores (cause: "col-with-symbols"');
        });
        it('throws error if table has more or less than one primary key', () => {
            const primaryCols = [
                {
                    name: 'primary1',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: true,
                    defaultValue: null,
                },
                {
                    name: 'primary2',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: true,
                    defaultValue: null,
                },
            ];
            const noPrimaryCols = [
                {
                    name: 'np1',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: false,
                    defaultValue: null,
                },
                {
                    name: 'np2',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            expect(() => addTableSchema('placeholder', primaryCols)).toThrowError('Table must have one primary key (currently has 2)');
            expect(() => addTableSchema('placeholder', noPrimaryCols)).toThrowError('Table must have one primary key (currently has 0)');
        });
        it('throws error if submitted columns contain duplicate names', () => {
            const duplicateNames = [
                {
                    name: 'duplicate',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: true,
                    defaultValue: null,
                },
                {
                    name: 'duplicate',
                    type: 'VARCHAR(255)',
                    isNullable: false,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            expect(() => addTableSchema('placeholder', duplicateNames)).toThrowError('Table must not contain duplicate column names (cause: "duplicate")');
        });
    });
    describe('addForeignKeySchema', () => {
        it('sets reference data formatted exactly like data from sql parser', () => {
            const oldStore = result.current.schemaStore;
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
            const referenceData = {
                PrimaryKeyName: 'column2',
                PrimaryKeyTableName: 'table2',
                ReferencesPropertyName: 'column1',
                ReferencesTableName: 'table1',
                IsDestination: false,
                constraintName: 'table1_fk1',
            };
            const { addForeignKeySchema } = result.current;
            (0, react_1.act)(() => addForeignKeySchema(referenceData));
            const { schemaStore } = result.current;
            expect(schemaStore).toEqual(storeWithFk);
        });
    });
    // undo: modify schemaStore and undoHandler should set pre-mod state
    // redo: restores schemaStore to post-mod state
    describe('undoHandler and redoHandler', () => {
        // setup:storing before and after variables so 'it' blocks have references to different states
        // running addTableSchema. is there another way to change state directly instead?
        let previousStore;
        const undoTable = 'undoTable';
        const undoColumn = [
            {
                name: 'undoCol',
                type: 'VARCHAR(255)',
                isNullable: false,
                isPrimary: true,
                defaultValue: null,
            },
        ];
        let modifiedStore;
        it('reverts schemaStore to previous state', () => {
            previousStore = result.current.schemaStore;
            (0, react_1.act)(() => {
                const { addTableSchema } = result.current;
                addTableSchema(undoTable, undoColumn);
            });
            modifiedStore = result.current.schemaStore;
            (0, react_1.act)(() => {
                const { undoHandler } = result.current;
                undoHandler();
            });
            const { schemaStore } = result.current;
            expect(schemaStore).toEqual(previousStore);
        });
        it('restores schemaStore to modified state', () => {
            (0, react_1.act)(() => {
                const { redoHandler } = result.current;
                redoHandler();
            });
            const { schemaStore } = result.current;
            expect(schemaStore).toEqual(modifiedStore);
        });
    });
    describe('addColumnSchema', () => {
        // To prevent schema from growing too large and unwieldy, reset it with newSchema before each test
        beforeEach(() => {
            const newSchema = {
                table1: {
                    column1: {
                        Name: 'column1',
                        Value: null,
                        TableName: 'table1',
                        References: [],
                        IsPrimaryKey: true,
                        IsForeignKey: false,
                        field_name: 'column1',
                        data_type: 'SERIAL',
                        additional_constraints: 'NOT NULL',
                    },
                },
            };
            (0, react_1.act)(() => setSchemaStore(newSchema));
        });
        it('adds single column schema', () => {
            const addCol = [
                {
                    name: 'add_col',
                    type: 'GEOMETRY',
                    isNullable: true,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            const schemaWithAddCol = {
                table1: {
                    column1: {
                        Name: 'column1',
                        Value: null,
                        TableName: 'table1',
                        References: [],
                        IsPrimaryKey: true,
                        IsForeignKey: false,
                        field_name: 'column1',
                        data_type: 'SERIAL',
                        additional_constraints: 'NOT NULL',
                    },
                    add_col: {
                        Name: 'add_col',
                        Value: null,
                        TableName: 'table1',
                        References: [],
                        IsPrimaryKey: false,
                        IsForeignKey: false,
                        field_name: 'add_col',
                        data_type: 'GEOMETRY',
                        additional_constraints: 'NULL',
                    },
                },
            };
            (0, react_1.act)(() => addColumnSchema('table1', addCol));
            expect(result.current.schemaStore).toEqual(schemaWithAddCol);
        });
        it('adds multiple column schema', () => {
            const addTwoCols = [
                {
                    name: 'add_col1',
                    type: 'GEOMETRY',
                    isNullable: true,
                    isPrimary: false,
                    defaultValue: null,
                },
                {
                    name: 'add_col2',
                    type: 'FLOAT8',
                    isNullable: true,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            const schemaWithAddTwoCols = {
                table1: {
                    column1: {
                        Name: 'column1',
                        Value: null,
                        TableName: 'table1',
                        References: [],
                        IsPrimaryKey: true,
                        IsForeignKey: false,
                        field_name: 'column1',
                        data_type: 'SERIAL',
                        additional_constraints: 'NOT NULL',
                    },
                    add_col1: {
                        Name: 'add_col1',
                        Value: null,
                        TableName: 'table1',
                        References: [],
                        IsPrimaryKey: false,
                        IsForeignKey: false,
                        field_name: 'add_col1',
                        data_type: 'GEOMETRY',
                        additional_constraints: 'NULL',
                    },
                    add_col2: {
                        Name: 'add_col2',
                        Value: null,
                        TableName: 'table1',
                        References: [],
                        IsPrimaryKey: false,
                        IsForeignKey: false,
                        field_name: 'add_col2',
                        data_type: 'FLOAT8',
                        additional_constraints: 'NULL',
                    },
                },
            };
            (0, react_1.act)(() => addColumnSchema('table1', addTwoCols));
            expect(result.current.schemaStore).toEqual(schemaWithAddTwoCols);
        });
        it('throws error for column names using MySQL syntax', () => {
            (0, react_1.act)(() => setSystem('MySQL'));
            const myCol = [
                {
                    name: 'BLOB',
                    type: 'VARCHAR(255)',
                    isNullable: true,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            expect(() => addColumnSchema('table1', myCol)).toThrowError('Table and column names must not be MySQL syntax (cause: "BLOB")');
        });
        it('throws error for column names using PostgreSQL syntax', () => {
            (0, react_1.act)(() => setSystem('PostgreSQL'));
            const pgCol = [
                {
                    name: 'AND',
                    type: 'VARCHAR(255)',
                    isNullable: true,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            expect(() => addColumnSchema('table1', pgCol)).toThrowError('Table and column names must not be PostgreSQL syntax (cause: "AND")');
        });
        it('throws error for empty column names', () => {
            const emptyCol = [
                {
                    name: '',
                    type: 'VARCHAR(255)',
                    isNullable: true,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            expect(() => addColumnSchema('table1', emptyCol)).toThrowError('Names must not be empty');
        });
        it('throws error for table names not containing only letters, numbers, and underscores', () => {
            const spaceCol = [
                {
                    name: 'col with spaces',
                    type: 'VARCHAR(255)',
                    isNullable: true,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            const symbolCol = [
                {
                    name: 'col-with-symbols',
                    type: 'VARCHAR(255)',
                    isNullable: true,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            expect(() => addColumnSchema('table1', spaceCol)).toThrowError('Name must only contain letters, numbers, and underscores (cause: "col with spaces")');
            expect(() => addColumnSchema('table1', symbolCol)).toThrowError('Name must only contain letters, numbers, and underscores (cause: "col-with-symbols")');
        });
        it('throws error if table already contains column with the same name', () => {
            const duplicateCol = [
                {
                    name: 'column1',
                    type: 'VARCHAR(255)',
                    isNullable: true,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            expect(() => addColumnSchema('table1', duplicateCol)).toThrowError('Table "table1" already contains column named "column1"');
        });
        it('throws error if multiple column arguments share the same name', () => {
            const duplicateCols = [
                {
                    name: 'duplicate',
                    type: 'VARCHAR(255)',
                    isNullable: true,
                    isPrimary: false,
                    defaultValue: null,
                },
                {
                    name: 'duplicate',
                    type: 'FLOAT',
                    isNullable: false,
                    isPrimary: false,
                    defaultValue: null,
                },
            ];
            expect(() => addColumnSchema('table1', duplicateCols)).toThrowError('Table must not contain duplicate column names (cause: "duplicate")');
        });
        it('throws error if table already contains primary key', () => {
            const primaryCol = [
                {
                    name: 'primary2',
                    type: 'VARCHAR(255)',
                    isNullable: true,
                    isPrimary: true,
                    defaultValue: null,
                },
            ];
            expect(() => addColumnSchema('table1', primaryCol)).toThrowError('Table must have one primary key (currently has 2)');
        });
    });
});
//# sourceMappingURL=schemaStore.spec.js.map