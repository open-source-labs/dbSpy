"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microsoftQuery = void 0;
const typeorm_1 = require("typeorm");
const microsoft_queries_1 = require("./queries/microsoft.queries");
//import { microsoftFormatTableSchema } from './helperFunctions/mysql.functions';
const microsoftQuery = async (req, res, next) => {
    try {
        const { hostname, password, port, username, database_name } = req.query;
        const MicrosoftDataSource = new typeorm_1.DataSource({
            type: "mssql",
            host: hostname,
            port: port ? parseInt(port) : 1433,
            username: username,
            password: password,
            database: database_name,
            synchronize: true,
            logging: true,
            options: {
                encrypt: false,
            }
        });
        await MicrosoftDataSource.initialize();
        console.log('Data Source has been initialized');
        async function getForeignKeys(columnName, tableName) {
            return await MicrosoftDataSource.query(microsoft_queries_1.microsoftForeignKeyQuery.replace('columnName', columnName).replace('tableName', tableName));
        }
        ;
        async function microsoftFormatTableSchema(microsoftSchema, tableName) {
            const tableSchema = {};
            for (const key of microsoftSchema) {
                const columnName = key.COLUMN_NAME;
                //query for the foreign key data
                const foreignKeys = await getForeignKeys(columnName, tableName);
                const foreignKey = foreignKeys.find((fk) => fk.COLUMN_NAME === columnName);
                console.log('foreignKey: ', foreignKey);
                //Creating the format for the Reference property if their is a foreign key
                const references = {
                    length: 0,
                };
                if (foreignKey) {
                    references[references.length] = {
                        isDestination: false,
                        PrimaryKeyName: foreignKeys.COLUMN_NAME,
                        PrimaryKeyTableName: foreignKeys.TABLE_NAME,
                        ReferencesPropertyName: foreignKeys.REFERENCED_COLUMN_NAME,
                        ReferencesTableName: foreignKeys.REFERENCED_TABLE_NAME,
                        constraintName: foreignKeys.CONSTRAINT_NAME,
                    };
                    references.length += 1;
                }
                ;
                //Formation of the schema data
                tableSchema[columnName] = {
                    // IsForeignKey: keyString.includes('MUL'),
                    // IsPrimaryKey: keyString.includes('PRI'),
                    // Name: column.Field,
                    References: foreignKey ? [references] : [],
                    TableName: 'public.' + tableName,
                    Value: null,
                    // additional_constraints: column.Null === 'NO' ? 'NOT NULL' : null ,
                    // data_type: column.Type,
                    // field_name: column.Field,
                };
            }
            ;
            return tableSchema;
        }
        ;
        const tables = await MicrosoftDataSource.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES`);
        const tableData = {};
        const schema = {}; //MicrosoftTableSchema = {};
        for (const table of tables) {
            // DATA Create property on tableData object with every loop
            const tableName = table.TABLE_NAME;
            const tableDataQuery = await MicrosoftDataSource.query(`SELECT * FROM ${tableName}`);
            tableData[tableName] = tableDataQuery;
            // type References = [{
            //     isDestination: boolean,
            //     PrimaryKeyName: string,
            //     PrimaryKeyTableName: string,
            //     ReferencesPropertyName: string,
            //     ReferencesTableName: string,
            //     constraintName: string,
            // }]
            const microsoftSchema = await MicrosoftDataSource.query(microsoft_queries_1.microsoftSchemaQuery.replace('tableName', tableName));
            //console.log('microsoftSchemaData: ', microsoftSchema)
            schema['public.' + tableName] = await microsoftFormatTableSchema(microsoftSchema, tableName);
        }
        console.log('Table data: ', tableData);
        res.locals.data = tableData;
        return next();
    }
    catch (err) {
        return next(err);
    }
};
exports.microsoftQuery = microsoftQuery;
//# sourceMappingURL=microsoftData.controller.js.map