"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_queries_1 = require("./queries/mysql.queries");
const universal_helpers_1 = require("./helperFunctions/universal.helpers");
// Object containing all of the middleware
const mysqlController = {
    //----------Function to collect all schema and data from database-----------------------------------------------------------------
    mysqlQuery: async (req, res, next) => {
        const MysqlDataSource = await (0, universal_helpers_1.dbConnect)(req);
        /*
        * Used for storing Primary Key table and column names that are
        *  part of Foreign Keys to adjust IsDestination to be true.
        */
        const foreignKeyReferenced = [];
        //--------HELPER FUNCTION 1-----------------------------------
        // function to query and get all information needed for foreign keys
        async function getForeignKeys(columnName, tableName) {
            return await MysqlDataSource.query(mysql_queries_1.mysqlForeignKeyQuery.replace('columnName', columnName).replace('tableName', tableName));
        }
        ;
        //--------HELPER FUNCTION 2-----------------------------------
        // function organizing data from queries in to the desired format of the front end
        async function mysqlFormatTableSchema(mysqlSchemaData, tableName) {
            const tableSchema = {};
            for (const column of mysqlSchemaData) {
                const columnName = column.Field;
                const keyString = column.Key;
                const defaultTypes = await MysqlDataSource.query(`
          SELECT 
            EXTRA, 
            COLUMN_DEFAULT
          FROM 
            INFORMATION_SCHEMA.COLUMNS
          WHERE 
            TABLE_SCHEMA = '${MysqlDataSource.options.database}'
            AND TABLE_NAME = '${tableName}'
            AND COLUMN_NAME = "${columnName}"
        `);
                //query for the foreign key data
                const foreignKeys = await getForeignKeys(columnName, tableName);
                const foreignKey = foreignKeys.find((fk) => fk.COLUMN_NAME === columnName);
                //Creating the format for the Reference property if there is a foreign key
                const references = [];
                if (foreignKey) {
                    foreignKeyReferenced.push({
                        isDestination: true,
                        PrimaryKeyName: foreignKey.PRIMARY_KEY_COLUMN,
                        PrimaryKeyTableName: `${MysqlDataSource.options.database}.${foreignKey.PRIMARY_KEY_TABLE}`,
                        ReferencesPropertyName: foreignKey.COLUMN_NAME,
                        ReferencesTableName: `${MysqlDataSource.options.database}.${tableName}`,
                        constraintName: foreignKey.CONSTRAINT_NAME,
                    });
                    references.push({
                        isDestination: false,
                        PrimaryKeyName: foreignKey.PRIMARY_KEY_COLUMN,
                        PrimaryKeyTableName: `${MysqlDataSource.options.database}.${foreignKey.PRIMARY_KEY_TABLE}`,
                        ReferencesPropertyName: foreignKey.COLUMN_NAME,
                        ReferencesTableName: `${MysqlDataSource.options.database}.${tableName}`,
                        constraintName: foreignKey.CONSTRAINT_NAME,
                    });
                }
                ;
                //Formation of the schema data
                tableSchema[columnName] = {
                    IsForeignKey: keyString.includes('MUL'),
                    IsPrimaryKey: keyString.includes('PRI'),
                    Name: column.Field,
                    References: references,
                    TableName: `${MysqlDataSource.options.database}.${tableName}`,
                    Value: null,
                    additional_constraints: column.Null === 'NO' ? 'NOT NULL' : null,
                    data_type: column.Type,
                    default_type: defaultTypes[0].EXTRA === '' ? null : defaultTypes[0].EXTRA,
                    field_name: column.Field,
                };
            }
            ;
            return tableSchema;
        }
        ;
        //--------HELPER FUNCTIONS END-----------------------------------
        try {
            // Query to retrieve all table names
            const tables = await MysqlDataSource.query(`SHOW TABLES`);
            //Declare constants to store results we get back from queries
            const data = {};
            const schema = {};
            //LOOP
            for (const table of tables) {
                const tableName = table[`Tables_in_${MysqlDataSource.options.database}`];
                // DATA Create property on tableData object with every loop
                const tableData = await MysqlDataSource.query(`SELECT * FROM ${tableName}`);
                data[`${MysqlDataSource.options.database}.${tableName}`] = tableData;
                // SCHEMA Create property on tableData object with every loop
                const mysqlSchemaData = await MysqlDataSource.query(`DESCRIBE ${MysqlDataSource.options.database}.${tableName}`);
                schema[`${MysqlDataSource.options.database}.${tableName}`] = await mysqlFormatTableSchema(mysqlSchemaData, tableName);
            }
            ;
            // Changing the isDestination value for the Foreign Keys
            if (foreignKeyReferenced.length !== 0) {
                console.log('foreignKeyReferenced: ', foreignKeyReferenced);
                for (const element of foreignKeyReferenced) {
                    console.log("schema data: ", schema);
                    console.log('schema[element.PrimaryKeyTableName][element.PrimaryKeyName]: ', schema[element.PrimaryKeyTableName][element.PrimaryKeyName]);
                    schema[element.PrimaryKeyTableName][element.PrimaryKeyName].References.push(element);
                }
                ;
            }
            ;
            // Console.logs to check what the data looks like
            // console.log("table data: ", data);
            // console.log("schema data: ", schema);
            // Storage of queried results into res.locals
            res.locals.schema = schema;
            res.locals.data = data;
            // Disconnecting after data has been received 
            MysqlDataSource.destroy();
            console.log('Database has been disconnected');
            return next();
        }
        catch (err) {
            console.log('Error during Data Source: ', err);
            MysqlDataSource.destroy();
            console.log('Database has been disconnected');
            return next(err);
        }
        ;
    },
    //-------------------------------------DATA TABLE ROWS-------------------------------------------------
    //-------------------ADD NEW ROW-----------------------------------------------------------
    mysqlAddNewRow: async (req, res, next) => {
        try {
            (0, universal_helpers_1.addNewDbRow)(req, res, next);
            console.log("mysqlAddNewRow function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlAddNewRow middleware: ', err);
            return next(err);
        }
        ;
    },
    //-----------------UPDATE ROW--------------------------------------------------------------
    mysqlUpdateRow: async (req, res, next) => {
        try {
            (0, universal_helpers_1.updateRow)(req, res, next);
            console.log("mysqlUpdateRow function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlUpdateRow middleware: ', err);
            return next(err);
        }
        ;
    },
    //----------------DELETE ROW---------------------------------------------------------------
    mysqlDeleteRow: async (req, res, next) => {
        try {
            await Promise.resolve((0, universal_helpers_1.deleteRow)(req, res, next));
            console.log("mysqlDeleteRow function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlDeleteRow middleware: ', err);
            return next(err);
        }
        ;
    },
    //-------------------------------------SCHEMA TABLE COLUMNS------------------------------------------
    //----------------ADD NEW COLUMN----------------------------------------------------------
    mysqlAddNewColumn: async (req, res, next) => {
        try {
            (0, universal_helpers_1.addNewDbColumn)(req, res, next);
            console.log("mysqlAddNewColumn function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlAddNewColumn middleware: ', err);
            return next(err);
        }
        ;
    },
    //-----------------UPDATE COLUMN--------------------------------------------------------
    mysqlUpdateColumn: async (req, res, next) => {
        try {
            (0, universal_helpers_1.updateDbColumn)(req, res, next);
            console.log("mysqlUpdateColumn function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlUpdateColumn middleware: ', err);
            return next(err);
        }
        ;
    },
    //-------------DELETE COLUMN------------------------------------------------------------
    mysqlDeleteColumn: async (req, res, next) => {
        try {
            (0, universal_helpers_1.deleteColumn)(req, res, next);
            console.log("mysqlDeleteColumn function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlDeleteColumn middleware: ', err);
            return next(err);
        }
        ;
    },
    //---------------------------DATABASE TABLES--------------------------------------------------------
    //--------------ADD NEW TABLE-----------------------------------------------------------
    mysqlAddNewTable: async (req, res, next) => {
        try {
            (0, universal_helpers_1.addNewTable)(req, res, next);
            console.log("mysqlAddNewTable function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlAddNewTable middleware: ', err);
            return next(err);
        }
        ;
    },
    //--------------GET ALL TABLE NAMES-------------------------------------------------------------------
    mysqlGetTableNames: async (req, res, next) => {
        try {
            const tableNameList = await Promise.resolve((0, universal_helpers_1.getTableNames)(req, res, next));
            console.log("mysqlGetTableNames function has concluded");
            res.locals.tableNames = tableNameList;
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlDeleteTable middleware: ', err);
            return next(err);
        }
        ;
    },
    //--------------DELETE TABLE------------------------------------------------------------
    mysqlDeleteTable: async (req, res, next) => {
        try {
            await Promise.resolve((0, universal_helpers_1.deleteTable)(req, res, next));
            console.log("mysqlDeleteTable function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlDeleteTable middleware: ', err);
            return next(err);
        }
        ;
    },
    //------------------------------------------FOREIGN KEYS---------------------------------------------
    //--------------ADD NEW FOREIGN KEY-----------------------------------------------------
    mysqlAddForeignKey: async (req, res, next) => {
        try {
            (0, universal_helpers_1.addForeignKey)(req, res, next);
            console.log("mysqlAddForeignKey function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlAddForeignKey middleware: ', err);
            return next(err);
        }
        ;
    },
    //----------------REMOVE FOREIGN KEY-----------------------------------------------------------------
    mysqlRemoveForeignKey: async (req, res, next) => {
        try {
            (0, universal_helpers_1.removeForeignKey)(req, res, next);
            console.log("mysqlRemoveForeignKey function has concluded");
            return next();
        }
        catch (err) {
            console.log('Error occurred in the mysqlRemoveForeignKey middleware: ', err);
            return next(err);
        }
        ;
    },
    //---------------------------------------------------------------------------------------------------
};
exports.default = mysqlController;
//# sourceMappingURL=mysqlData.controller.js.map