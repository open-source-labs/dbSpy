"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const microsoft_queries_1 = require("./queries/microsoft.queries");
const universal_helpers_1 = require("./helperFunctions/universal.helpers");
//Object containing all of the middleware
const microsoftController = {
    //----------Function to collect all schema and data from database-----------------------------------------------------------------
    microsoftQuery: async (req, res, next) => {
        //Create Connection with database
        const MicrosoftDataSource = await (0, universal_helpers_1.dbConnect)(req);
        /*
        * Used for storing Primary Key table and column names that are
        *  part of Foreign Keys to adjust IsDestination to be true.
        */
        const foreignKeyReferenced = [];
        //--------HELPER FUNCTION-----------------------------------
        //function organizing data from queries in to the desired format of the front end
        async function microsoftFormatTableSchema(microsoftSchemaData, tableName, schemaName) {
            const tableSchema = {};
            for (const column of microsoftSchemaData) {
                const columnName = column.COLUMN_NAME;
                //query for the foreign key data
                const foreignKeys = await MicrosoftDataSource.query(microsoft_queries_1.microsoftForeignKeyQuery);
                const foreignKey = foreignKeys.find((fk) => fk.column_name === columnName);
                //Creating the format for the Reference property if there is a foreign key
                const references = [];
                if (foreignKey) {
                    foreignKeyReferenced.push({
                        isDestination: true,
                        PrimaryKeyName: foreignKey.primary_key_column,
                        PrimaryKeyTableName: `${schemaName}.` + foreignKey.primary_key_table,
                        ReferencesPropertyName: foreignKey.column_name,
                        ReferencesTableName: `${schemaName}.${tableName}`,
                        constraintName: foreignKey.constraint_name,
                    });
                    references.push({
                        isDestination: false,
                        PrimaryKeyName: foreignKey.primary_key_column,
                        PrimaryKeyTableName: `${schemaName}.` + foreignKey.primary_key_table,
                        ReferencesPropertyName: foreignKey.column_name,
                        ReferencesTableName: `${schemaName}.${tableName}`,
                        constraintName: foreignKey.constraint_name,
                    });
                }
                ;
                //Formation of the schema data
                tableSchema[columnName] = {
                    IsForeignKey: foreignKey ? true : false,
                    IsPrimaryKey: column.IS_PRIMARY_KEY === 'YES' ? true : false,
                    Name: column.COLUMN_NAME,
                    References: references,
                    TableName: `${schemaName}.${tableName}`,
                    Value: null,
                    additional_constraints: column.IS_NULLABLE === 'NO' ? 'NOT NULL' : null,
                    data_type: `${column.DATA_TYPE.toUpperCase()}` + `${column.DATA_TYPE === 'varchar' ? `(${column.CHARACTER_MAXIMUM_LENGTH})` : ''}`,
                    default_type: column.IS_IDENTITY === 1 ? 'identity' : null,
                    field_name: columnName,
                };
            }
            ;
            return tableSchema;
        }
        ;
        //--------HELPER FUNCTION END-----------------------------------
        try {
            // Query to retrieve all table names
            const tables = await MicrosoftDataSource.query(`
        SELECT
          SCHEMA_NAME() AS SchemaName,
          TABLE_NAME 
        FROM 
          INFORMATION_SCHEMA.TABLES
        `);
            console.log('tables: ', tables);
            // Declare constants to store results we get back from queries
            const tableData = {};
            const schema = {};
            // LOOP
            for (const table of tables) {
                // DATA Create property on tableData object with every loop
                const tableName = table.TABLE_NAME;
                const schemaName = table.SchemaName;
                console.log('tableName: ', tableName);
                const tableDataQuery = await MicrosoftDataSource.query(`SELECT * FROM ${tableName}`);
                tableData[`${schemaName}.${tableName}`] = tableDataQuery;
                // SCHEMA Create property on schema object with every loop
                const microsoftSchemaData = await MicrosoftDataSource.query(microsoft_queries_1.microsoftSchemaQuery.replace('tableName', tableName));
                schema[`${schemaName}.${tableName}`] = await microsoftFormatTableSchema(microsoftSchemaData, tableName, schemaName);
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
            MicrosoftDataSource.destroy();
            console.log('Database has been disconnected');
            return next();
        }
        catch (err) {
            console.log('Error during Data Source: ', err);
            MicrosoftDataSource.destroy();
            console.log('Database has been disconnected');
            return next(err);
        }
        ;
    },
    //-------------------------------------DATA TABLE ROWS-------------------------------------------------
    //-------------------ADD NEW ROW-----------------------------------------------------------
    microsoftAddNewRow: async (req, res, next) => {
        try {
            (0, universal_helpers_1.addNewDbRow)(req, res, next);
            console.log("microsoftAddNewRow function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftAddNewRow middleware: ', err);
            return next(err);
        }
        ;
    },
    //-----------------UPDATE ROW--------------------------------------------------------------
    microsoftUpdateRow: async (req, res, next) => {
        try {
            await Promise.resolve((0, universal_helpers_1.updateRow)(req, res, next));
            console.log("microsoftUpdateRow function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftUpdateRow middleware: ', err);
            return next(err);
        }
        ;
    },
    //----------------DELETE ROW---------------------------------------------------------------
    microsoftDeleteRow: async (req, res, next) => {
        try {
            (0, universal_helpers_1.deleteRow)(req, res, next);
            console.log("microsoftDeleteRow function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftDeleteRow middleware: ', err);
            return next(err);
        }
        ;
    },
    //-------------------------------------SCHEMA TABLE COLUMNS------------------------------------------
    //----------------ADD NEW COLUMN----------------------------------------------------------
    microsoftAddNewColumn: async (req, res, next) => {
        try {
            (0, universal_helpers_1.addNewDbColumn)(req, res, next);
            console.log("microsoftAddNewColumn function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftAddNewColumn middleware: ', err);
            return next(err);
        }
        ;
    },
    //-----------------UPDATE COLUMN--------------------------------------------------------
    microsoftUpdateColumn: async (req, res, next) => {
        try {
            (0, universal_helpers_1.updateDbColumn)(req, res, next);
            console.log("microsoftUpdateColumn function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftUpdateColumn middleware: ', err);
            return next(err);
        }
        ;
    },
    //-------------DELETE COLUMN------------------------------------------------------------
    microsoftDeleteColumn: async (req, res, next) => {
        try {
            await Promise.resolve((0, universal_helpers_1.deleteColumn)(req, res, next));
            console.log("microsoftDeleteColumn function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftDeleteColumn middleware: ', err);
            return next(err);
        }
        ;
    },
    //---------------------------DATABASE TABLES--------------------------------------------------------
    //--------------ADD NEW TABLE-----------------------------------------------------------
    microsoftAddNewTable: async (req, res, next) => {
        try {
            await Promise.resolve((0, universal_helpers_1.addNewTable)(req, res, next));
            console.log("microsoftAddNewTable function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftAddNewTable middleware: ', err);
            return next(err);
        }
        ;
    },
    //--------------GET ALL TABLE NAMES-------------------------------------------------------------------
    microsoftGetTableNames: async (req, res, next) => {
        try {
            const tableNameList = await Promise.resolve((0, universal_helpers_1.getTableNames)(req, res, next));
            console.log("microsoftGetTableNames function has concluded");
            res.locals.tableNames = tableNameList;
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftDeleteTable middleware: ', err);
            return next(err);
        }
        ;
    },
    //--------------DELETE TABLE------------------------------------------------------------
    microsoftDeleteTable: async (req, res, next) => {
        try {
            await Promise.resolve((0, universal_helpers_1.deleteTable)(req, res, next));
            console.log("microsoftDeleteTable function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftDeleteTable middleware: ', err);
            return next(err);
        }
        ;
    },
    //------------------------------------------FOREIGN KEYS---------------------------------------------
    //--------------ADD NEW FOREIGN KEY-----------------------------------------------------
    microsoftAddForeignKey: async (req, res, next) => {
        try {
            (0, universal_helpers_1.addForeignKey)(req, res, next);
            console.log("microsoftAddForeignKey function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftAddForeignKey middleware: ', err);
            return next(err);
        }
        ;
    },
    //----------------REMOVE FOREIGN KEY-----------------------------------------------------------------
    microsoftRemoveForeignKey: async (req, res, next) => {
        try {
            (0, universal_helpers_1.removeForeignKey)(req, res, next);
            console.log("microsoftRemoveForeignKey function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the microsoftRemoveForeignKey middleware: ', err);
            return next(err);
        }
        ;
    },
    //---------------------------------------------------------------------------------------------------
};
exports.default = microsoftController;
//# sourceMappingURL=microsoftData.controller.js.map