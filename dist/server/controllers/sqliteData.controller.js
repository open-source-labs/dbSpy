"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const universal_helpers_1 = require("./helperFunctions/universal.helpers");
// Object containing all of the middleware
const sqliteController = {
    //----------Function to collect all schema and data from database-----------------------------------------------------------------
    sqliteQuery: async (req, res, next) => {
        const SqliteDataSource = await (0, universal_helpers_1.dbConnect)(req);
        /*
        * Used for storing Primary Key table and column names that are
        *  part of Foreign Keys to adjust IsDestination to be true.
        */
        const foreignKeyReferenced = [];
        //--------HELPER FUNCTION-----------------------------------   
        //function organizing data from queries in to the desired format of the front end
        async function sqliteFormatTableSchema(sqliteSchemaData, tableName) {
            const tableSchema = {};
            for (const column of sqliteSchemaData) {
                const columnName = column.name;
                const keyString = column.pk;
                //query for the foreign key data
                const foreignKeys = await SqliteDataSource.query(`PRAGMA foreign_key_list(${tableName})`);
                const foreignKey = await foreignKeys.find((fk) => fk.from === columnName);
                //Creating the format for the Reference property if there is a foreign key
                const references = [];
                if (foreignKey) {
                    foreignKeyReferenced.push({
                        isDestination: true,
                        PrimaryKeyName: foreignKey.to,
                        PrimaryKeyTableName: foreignKey.table,
                        ReferencesPropertyName: foreignKey.from,
                        ReferencesTableName: 'public.' + tableName,
                        constraintName: tableName + '_' + foreignKey.from + '_fkey'
                    });
                    references.push({
                        isDestination: false,
                        PrimaryKeyName: foreignKey.to,
                        PrimaryKeyTableName: foreignKey.table,
                        ReferencesPropertyName: foreignKey.from,
                        ReferencesTableName: 'public.' + tableName,
                        constraintName: tableName + '_' + foreignKey.from + '_fkey'
                    });
                }
                ;
                tableSchema[columnName] = {
                    IsForeignKey: foreignKey ? true : false,
                    IsPrimaryKey: keyString !== 0 ? true : false,
                    Name: columnName,
                    References: references,
                    TableName: 'public.' + tableName,
                    Value: column.dflt_value,
                    additional_constraints: column.notnull === 1 ? 'NOT NULL' : null,
                    data_type: column.type,
                    field_name: columnName,
                    IsConnectedToForeignKey: false,
                };
            }
            ;
            return tableSchema;
        }
        ;
        //--------HELPER FUNCTION END-----------------------------------
        try {
            // Query to retrieve all table names
            const tables = await SqliteDataSource.query(`SELECT name FROM sqlite_master WHERE type='table'`);
            // Declare storage objects with their related interfaces
            const tableData = {};
            const schema = {};
            // LOOP
            for (const table of tables) {
                // DATA Create property on tableData object with every loop
                const tableName = table.name;
                const tableDataQuery = await SqliteDataSource.query(`SELECT * FROM ${tableName}`);
                tableData[tableName] = tableDataQuery;
                // SCHEMAS Create property on schema object with every loop
                const sqliteSchemaData = await SqliteDataSource.query(`PRAGMA table_info(${tableName})`);
                schema['public.' + tableName] = await sqliteFormatTableSchema(sqliteSchemaData, tableName);
            }
            ;
            // Changing the isDestination value for the Foreign Keys
            if (foreignKeyReferenced.length !== 0) {
                for (const element of foreignKeyReferenced) {
                    schema[element.PrimaryKeyTableName][element.PrimaryKeyName].References.push(element);
                }
                ;
            }
            ;
            // Console.logs to check what the data looks like
            // console.log('table data: ', tableData);
            // console.log('schema data: ', schema);
            // Storage of queried results into res.locals
            res.locals.schema = schema;
            res.locals.data = tableData;
            // Disconnecting after data has been received 
            SqliteDataSource.destroy();
            console.log('Database has been disconnected');
            return next();
        }
        catch (err) {
            console.log('Error during Data Source: ', err);
            SqliteDataSource.destroy();
            console.log('Database has been disconnected');
            return next(err);
        }
        ;
    },
    //-------------------------------------DATA TABLE ROWS-------------------------------------------------
    //-------------------ADD NEW ROW-----------------------------------------------------------
    sqliteAddNewRow: async (req, _res, next) => {
        const dbDataSource = await (0, universal_helpers_1.dbConnect)(req);
        console.log('req.session: ', req.session);
        try {
            const newDbRowData = req.body;
            const tableName = newDbRowData.tableName;
            const newSqliteRow = newDbRowData.newRow;
            const keys = Object.keys(newSqliteRow).join(", ");
            const values = Object.values(newSqliteRow).map(val => `'${val}'`).join(", ");
            const dbAddedRow = await dbDataSource.query(`
        INSERT INTO ${tableName} (${keys})
        VALUES (${values})
      `);
            dbDataSource.destroy();
            console.log('Database has been disconnected');
            ;
            console.log('dbAddedRow in helper: ', dbAddedRow);
            return dbAddedRow;
        }
        catch (err) {
            console.log('Error occurred in the sqliteAddNewRow middleware: ', err);
            dbDataSource.destroy();
            console.log('Database has been disconnected');
            return next(err);
        }
        ;
    },
    //-----------------UPDATE ROW--------------------------------------------------------------
    sqliteUpdateRow: async (req, res, next) => {
        try {
            (0, universal_helpers_1.updateRow)(req, res, next);
            console.log("sqliteUpdateRow function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the sqliteUpdateRow middleware: ', err);
            return next(err);
        }
        ;
    },
    //----------------DELETE ROW---------------------------------------------------------------
    sqliteDeleteRow: async (req, res, next) => {
        try {
            (0, universal_helpers_1.deleteRow)(req, res, next);
            console.log("sqliteDeleteRow function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the sqliteDeleteRow middleware: ', err);
            return next(err);
        }
        ;
    },
    //-------------------------------------SCHEMA TABLE COLUMNS------------------------------------------
    //----------------ADD NEW COLUMN----------------------------------------------------------
    sqliteAddNewColumn: async (req, res, next) => {
        try {
            (0, universal_helpers_1.addNewDbColumn)(req, res, next);
            console.log("sqliteAddNewColumn function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the sqliteAddNewColumn middleware: ', err);
            return next(err);
        }
        ;
    },
    //-----------------UPDATE COLUMN--------------------------------------------------------
    sqliteUpdateColumn: async (req, res, next) => {
        try {
            (0, universal_helpers_1.updateDbColumn)(req, res, next);
            console.log("sqliteUpdateColumn function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the sqliteUpdateColumn middleware: ', err);
            return next(err);
        }
        ;
    },
    //-------------DELETE COLUMN------------------------------------------------------------
    sqliteDeleteColumn: async (req, res, next) => {
        try {
            (0, universal_helpers_1.deleteColumn)(req, res, next);
            console.log("sqliteDeleteColumn function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the sqliteDeleteColumn middleware: ', err);
            return next(err);
        }
        ;
    },
    //---------------------------DATABASE TABLES--------------------------------------------------------
    //--------------ADD NEW TABLE-----------------------------------------------------------
    sqliteAddNewTable: async (req, res, next) => {
        try {
            (0, universal_helpers_1.addNewTable)(req, res, next);
            console.log("sqliteAddNewTable function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the sqliteAddNewTable middleware: ', err);
            return next(err);
        }
        ;
    },
    //--------------GET ALL TABLE NAMES-------------------------------------------------------------------
    sqliteGetTableNames: async (req, res, next) => {
        try {
            const tableNameList = await Promise.resolve((0, universal_helpers_1.getTableNames)(req, res, next));
            console.log("sqliteGetTableNames function has concluded");
            res.locals.tableNames = tableNameList;
            return next();
        }
        catch (err) {
            console.log('Error occurred in the sqliteDeleteTable middleware: ', err);
            return next(err);
        }
        ;
    },
    //--------------DELETE TABLE------------------------------------------------------------
    sqliteDeleteTable: async (req, res, next) => {
        try {
            await Promise.resolve((0, universal_helpers_1.deleteTable)(req, res, next));
            console.log("sqliteDeleteTable function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the sqliteDeleteTable middleware: ', err);
            return next(err);
        }
        ;
    },
    //------------------------------------------FOREIGN KEYS---------------------------------------------
    //--------------ADD NEW FOREIGN KEY-----------------------------------------------------
    sqliteAddForeignKey: async (req, res, next) => {
        try {
            (0, universal_helpers_1.addForeignKey)(req, res, next);
            console.log("sqliteAddForeignKey function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the sqliteAddForeignKey middleware: ', err);
            return next(err);
        }
        ;
    },
    //----------------REMOVE FOREIGN KEY-----------------------------------------------------------------
    sqliteRemoveForeignKey: async (req, res, next) => {
        try {
            (0, universal_helpers_1.removeForeignKey)(req, res, next);
            console.log("sqliteRemoveForeignKey function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the sqliteRemoveForeignKey middleware: ', err);
            return next(err);
        }
        ;
    },
    //---------------------------------------------------------------------------------------------------
};
exports.default = sqliteController;
//# sourceMappingURL=sqliteData.controller.js.map