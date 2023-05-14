"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeForeignKey = exports.addForeignKey = exports.deleteTable = exports.getTableNames = exports.addNewTable = exports.deleteColumn = exports.updateDbColumn = exports.addNewDbColumn = exports.deleteRow = exports.updateRow = exports.addNewDbRow = exports.dbConnect = void 0;
const typeorm_1 = require("typeorm");
//---------------CONNECT TO THE DATABASE-----------------------------------------------------------------------------------------
const dbConnect = async (req) => {
    const { db_type, hostname, password, port, username, database_name, service_name } = req.session;
    if (db_type === 'mysql') {
        const dbDataSource = new typeorm_1.DataSource({
            type: "mysql",
            host: hostname,
            port: port ? parseInt(port) : 3306,
            username: username,
            password: password,
            database: database_name,
            synchronize: true,
            logging: true,
        });
        await dbDataSource.initialize();
        console.log('Data source has been connected');
        return dbDataSource;
    }
    else if (db_type === 'postgres') {
        const dbDataSource = new typeorm_1.DataSource({
            type: "postgres",
            host: hostname,
            port: port ? parseInt(port) : 5432,
            username: username,
            password: password,
            database: database_name,
            synchronize: true,
            logging: true,
        });
        await dbDataSource.initialize();
        console.log('Data source has been connected');
        return dbDataSource;
    }
    else if (db_type === 'mssql') {
        const dbDataSource = new typeorm_1.DataSource({
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
            },
        });
        await dbDataSource.initialize();
        console.log('Data source has been connected');
        return dbDataSource;
    }
    else if (db_type === 'oracle') {
        const dbDataSource = new typeorm_1.DataSource({
            type: "oracle",
            host: hostname,
            port: port ? parseInt(port) : 1521,
            username: username,
            password: password,
            database: database_name,
            synchronize: true,
            logging: true,
            serviceName: service_name,
        });
        await dbDataSource.initialize();
        console.log('Data source has been connected');
        return dbDataSource;
    }
    else {
        const dbDataSource = new typeorm_1.DataSource({
            type: "sqlite",
            database: database_name,
            synchronize: true,
            logging: true,
        });
        await dbDataSource.initialize();
        console.log('Data source has been connected');
        return dbDataSource;
    }
    ;
};
exports.dbConnect = dbConnect;
//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------
const addNewDbRow = async (req, _res, next) => {
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type, username } = req.session;
    const { newRow, tableName } = req.body;
    try {
        //const newDbRowData: {[key: string]: string } = req.body;
        const tableNameAdd = db_type === 'oracle' ? `"${username.toUpperCase()}"."${tableName}"` : tableName;
        const newSqlRow = newRow;
        const keys = db_type === 'oracle' ? Object.keys(newSqlRow).map(key => `"${key}"`).join(", ") : Object.keys(newSqlRow).join(", ");
        const values = Object.values(newSqlRow).map(val => `'${val}'`).join(", ");
        const dbAddedRow = await dbDataSource.query(`
      INSERT INTO ${tableNameAdd} (${keys})
      VALUES (${values})
    `);
        await dbDataSource.destroy();
        console.log('Database has been disconnected');
        console.log('dbAddedRow in helper: ', dbAddedRow);
        return dbAddedRow;
    }
    catch (err) {
        console.log('Error occurred in the addNewDbRow middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    }
    ;
};
exports.addNewDbRow = addNewDbRow;
//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------
const updateRow = async (req, _res, next) => {
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type, username } = req.session;
    const { newRow, tableName, primaryKey } = req.body;
    try {
        const schemaName = db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
        const tableNameUpdate = db_type === 'oracle' ? `"${username.toUpperCase()}"."${tableName}"` :
            db_type === 'mssql' ? `${schemaName[0].SchemaName}.${tableName}` : tableName;
        const updateKeys = Object.keys(newRow);
        const updateValues = Object.values(newRow);
        let oracleKeyValueString = '';
        for (let i = 0; i < updateKeys.length; i++) {
            oracleKeyValueString += `"${updateKeys[i]}" = '${updateValues[i]}'${i < updateKeys.length - 1 ? ', ' : ''}`;
        }
        const keyValueString = oracleKeyValueString.replace(/"/g, '');
        const primaryKeyName = Object.keys(primaryKey);
        const primaryKeyValue = Object.values(primaryKey);
        const dbUpdatedRow = await dbDataSource.query(`
      UPDATE ${tableNameUpdate}
      SET ${db_type === 'oracle' ? oracleKeyValueString : keyValueString}
      WHERE ${db_type === 'oracle' ? `"${primaryKeyName}"` : primaryKeyName} = ${db_type === 'oracle' || db_type === 'mysql' ? `'${primaryKeyValue}'` : primaryKeyValue}
     `);
        await dbDataSource.destroy();
        console.log('Database has been disconnected');
        //   console.log('dbUpdatedRow in helper: ', dbUpdatedRow)
        return dbUpdatedRow;
    }
    catch (err) {
        console.log('Error occurred in the updatedRow middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    }
    ;
};
exports.updateRow = updateRow;
//----------------DELETE ROW----------------------------------------------------------------------------------------------------
const deleteRow = async (req, _res, next) => {
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type, username } = req.session;
    const { tableName, primaryKey, value } = req.body;
    try {
        const schemaName = db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
        const tableNameDelete = db_type === 'oracle' ? `"${username.toUpperCase()}"."${tableName}"` :
            db_type === 'mssql' ? `${schemaName[0].SchemaName}.${tableName}` : tableName;
        const dbDeletedRow = await dbDataSource.query(`
      DELETE FROM ${tableNameDelete}
      WHERE ${db_type === 'oracle' ? `"${primaryKey}"` : primaryKey} = ${db_type === 'oracle' || db_type === 'mysql' ? `'${value}'` : value}
      `);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        console.log('deletedRow in helper: ', dbDeletedRow);
        return dbDeletedRow;
    }
    catch (err) {
        console.log('Error occurred in the deleteRow middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    }
    ;
};
exports.deleteRow = deleteRow;
//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------
const addNewDbColumn = async (req, _res, next) => {
    console.log('inside addNewDbColumn', req.body);
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type, username } = req.session;
    const { defaultValue, isNullable, isPrimary, name, type, tableName } = req.body;
    // try{
    //   const oracleTableName = addNewColumnData.tableName.slice(7, addNewColumnData.tableName.length + 1)
    //   const tableNameAddColumn: string = db_type === 'oracle' ? `"${(username as string).toUpperCase()}"."${oracleTableName}"` : addNewColumnData.tableName;
    //   const addedNewColumn: Promise<unknown> = await dbDataSource.query(`
    //     ALTER TABLE ${tableNameAddColumn}
    //     ADD${db_type === 'postgres' ? ' COLUMN' : '' } "${addNewColumnData.columnName}" ${addNewColumnData.dataType} ${db_type === 'postgres' ? addNewColumnData.constraintName : null} ${addNewColumnData.constraintExpression}
    //     `);
    //   dbDataSource.destroy();
    //   console.log('Database has been disconnected');
    //   console.log('addedForeignKey in helper: ', addedNewColumn);
    //   return addedNewColumn;
    // } catch (err: unknown) {
    //     console.log('Error occurred in the addedForeignKey middleware: ', err);
    //     dbDataSource.destroy();
    //     console.log('Database has been disconnected');
    //     return next(err);
    // };
};
exports.addNewDbColumn = addNewDbColumn;
//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------
const updateDbColumn = async (req, _res, next) => {
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type, username } = req.session;
    try {
        const updateColumnData = req.body;
        const schemaName = db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
        const slicedTableName = updateColumnData.tableName.slice(7, updateColumnData.tableName.length + 1);
        const tableName = db_type === 'oracle' ? `"${username.toUpperCase()}"."${slicedTableName}"` :
            db_type === 'mssql' ? `${schemaName[0].SchemaName}.${slicedTableName}` : updateColumnData.tableName;
        const updatedColumn = await dbDataSource.query(`
      ALTER TABLE ${tableName}
      ${db_type === 'postgres' || db_type === 'microsoft' ? 'ALTER COLUMN' : 'MODIFY'} "${updateColumnData.columnName}" ${updateColumnData.dataType} ${db_type === 'postgres' ? updateColumnData.constraintName : null} ${updateColumnData.constraintExpression}
      `);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        console.log('addedForeignKey in helper: ', updatedColumn);
        return updatedColumn;
    }
    catch (err) {
        console.log('Error occurred in the addedForeignKey middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    }
    ;
};
exports.updateDbColumn = updateDbColumn;
//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------
const deleteColumn = async (req, _res, next) => {
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type, username } = req.session;
    try {
        const deleteColumnData = req.body;
        const oracleTableName = deleteColumnData.tableName.slice(7, deleteColumnData.tableName.length + 1);
        const tableName = db_type === 'oracle' ? `"${username.toUpperCase()}"."${oracleTableName}"` : deleteColumnData.tableName;
        const deletedColumn = await dbDataSource.query(`
      ALTER TABLE ${tableName}
      DROP${db_type !== 'mysql' ? ' COLUMN' : null} ${deleteColumnData.columnName}
      `);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        console.log('deletedColumn in helper: ', deletedColumn);
        return deletedColumn;
    }
    catch (err) {
        console.log('Error occurred in the addNewTable middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    }
    ;
};
exports.deleteColumn = deleteColumn;
//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------
const addNewTable = async (req, _res, next) => {
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type, username } = req.session;
    const { newTableName, newColumns } = req.body;
    try {
        const schemaName = db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
        let tableName = '';
        switch (db_type) {
            case 'oracle':
                tableName = `"${username.toUpperCase()}"."${newTableName}"`;
                break;
            case 'mssql':
                tableName = `${schemaName}.${newTableName}`;
                break;
            default:
                tableName = newTableName;
                break;
        }
        let keyValueString = '';
        newColumns.forEach((el) => {
            //const updateKeys = Object.keys(el);
            keyValueString += `${el.name} ${el.type}${el.isPrimary ? ' PRIMARY KEY' : ''}${el.isNullable ? '' : ' NOT NULL'}, `;
        });
        console.log('keyValueString.slice(0, -1): ', keyValueString.slice(0, -2));
        const newTableColumnString = keyValueString.slice(0, -2);
        console.log('ntcs', newTableColumnString);
        const newTable = await dbDataSource.query(`
      CREATE TABLE ${tableName} (
        ${newTableColumnString}
      )`);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        console.log('newTable in helper: ', newTable);
        return newTable;
    }
    catch (err) {
        console.log('Error occurred in the addNewTable middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    }
    ;
};
exports.addNewTable = addNewTable;
//--------------GET ALL TABLE NAMES--------------------------------------------------------------------------------------------
const getTableNames = async (req, res, next) => {
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type } = req.session;
    ;
    try {
        let query = '';
        switch (db_type) {
            case 'postgres':
                query = 'SELECT tableName FROM pg_catalog.pg_tables WHERE schemaname = \'public\'';
                break;
            case 'mysql':
                query = 'SHOW TABLES';
                break;
            case 'mssql':
                query = 'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES';
                break;
            case 'oracle':
                query = 'SELECT table_name FROM user_tables';
                break;
            default:
                query = "SELECT name FROM sqlite_master WHERE type='table'";
        }
        ;
        const tableNameList = await dbDataSource.query(query);
        const tables = tableNameList.map((obj) => {
            switch (db_type) {
                case 'postgres':
                    return obj.tablename;
                case 'mysql':
                    return obj.Tables_in_user;
                case 'mssql':
                case 'oracle':
                    return obj.TABLE_NAME;
                default:
                    return obj.name; //SQLite
            }
            ;
        });
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return tables;
    }
    catch (err) {
        console.log('Error occurred in the addNewTable middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    }
    ;
};
exports.getTableNames = getTableNames;
//--------------DELETE TABLE---------------------------------------------------------------------------------------------------
const deleteTable = async (req, _res, next) => {
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type, username } = req.session;
    try {
        const deleteTableData = req.body;
        console.log('req.body: ', req.body);
        let tableName = '';
        switch (db_type) {
            case 'oracle':
                //const slicedTableName = deleteTableData.tableName.slice(7, deleteTableData.tableName.length + 1);
                tableName = `"${username.toUpperCase()}"."${deleteTableData.tableName}"`;
                break;
            case 'mssql':
                const schemaName = await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`);
                tableName = `${schemaName[0].SchemaName}.${deleteTableData.tableName}`;
                break;
            default:
                tableName = deleteTableData.tableName;
                break;
        }
        const deletedTable = await dbDataSource.query(`DROP TABLE ${tableName}`);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        console.log('deletedTable in helper: ', deletedTable);
        return deletedTable;
    }
    catch (err) {
        console.log('Error occurred in the addNewTable middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    }
    ;
};
exports.deleteTable = deleteTable;
//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------
const addForeignKey = async (req, _res, next) => {
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type, username } = req.session;
    try {
        const addForeignKeyData = req.body;
        const schemaName = db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
        const primaryKeyTableNameFK = addForeignKeyData.PrimaryKeyTableName.slice(7, addForeignKeyData.PrimaryKeyTableName.length + 1);
        const foreignKeyTableNameFK = addForeignKeyData.ForeignKeyTableName.slice(7, addForeignKeyData.ForeignKeyTableName.length + 1);
        const microsoftPrimaryTableName = `${schemaName[0].SchemaName}.${primaryKeyTableNameFK}`;
        const microsoftForeignTableName = `${schemaName[0].SchemaName}.${foreignKeyTableNameFK}`;
        // const primaryTableName: string = db_type === 'oracle' ? `"${(username as string).toUpperCase()}"."${primaryKeyTableName}"` :
        //   db_type === 'mssql' ? `${microsoftPrimaryTableName}` : addForeignKeyData.tableName;
        // const foreignTableName: string = db_type === 'oracle' ? `"${(username as string).toUpperCase()}"."${foreignKeyTableName}"` :
        //   db_type === 'mssql' ? `${microsoftForeignTableName}` : addForeignKeyData.tableName;
        let primaryTableName = '';
        let foreignTableName = '';
        switch (db_type) {
            case 'oracle':
                primaryTableName = `"${username.toUpperCase()}"."${primaryKeyTableNameFK}"`;
                foreignTableName = `"${username.toUpperCase()}"."${foreignKeyTableNameFK}"`;
                break;
            case 'mssql':
                primaryTableName = `${microsoftPrimaryTableName}`;
                foreignTableName = `${microsoftForeignTableName}`;
                break;
            default:
                primaryTableName = addForeignKeyData.tableName;
                foreignTableName = addForeignKeyData.tableName;
                break;
        }
        ;
        const addedForeignKey = await dbDataSource.query(`
      ALTER TABLE ${foreignTableName}
      ADD CONSTRAINT fk_${addForeignKeyData.ForeignKeyColumnName}_to_${addForeignKeyData.PrimaryKeyColumnName}
      FOREIGN KEY ("${addForeignKeyData.ForeignKeyColumnName}")
      REFERENCES ${primaryTableName} ("${addForeignKeyData.PrimaryKeyColumnName}")
      `);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        console.log('addedForeignKey in helper: ', addedForeignKey);
        return addedForeignKey;
    }
    catch (err) {
        console.log('Error occurred in the addedForeignKey middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    }
    ;
};
exports.addForeignKey = addForeignKey;
//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------
const removeForeignKey = async (req, _res, next) => {
    const dbDataSource = await (0, exports.dbConnect)(req);
    const { db_type, username } = req.session;
    try {
        const removeForeignKeyData = req.body;
        const schemaName = db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
        //For Oracle, the special database
        const foreignKeyTableName = removeForeignKeyData.PrimaryKeyTableName.slice(7, removeForeignKeyData.PrimaryKeyTableName.length + 1);
        const microsoftPrimaryTableName = `${schemaName[0].SchemaName}.${foreignKeyTableName}`;
        const tableName = db_type === 'oracle' ? `"${username.toUpperCase()}"."${foreignKeyTableName}"` :
            db_type === 'mssql' ? `${microsoftPrimaryTableName}` : removeForeignKeyData.tableName;
        const removedForeignKey = await dbDataSource.query(`
      ALTER TABLE ${tableName}
      DROP ${db_type === 'mysql' ? 'FOREIGN KEY' : 'CONSTRAINT'} ${removeForeignKeyData.constraintName}
      `);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        console.log('addedForeignKey in helper: ', removedForeignKey);
        return removedForeignKey;
    }
    catch (err) {
        console.log('Error occurred in the removedForeignKey middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    }
    ;
};
exports.removeForeignKey = removeForeignKey;
//------------------------------------------------------------------------------------------------------------
//# sourceMappingURL=universal.helpers.js.map