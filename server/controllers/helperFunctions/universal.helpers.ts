import { RequestHandler, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';



const tableNameFormat = async (req: Request, dbDataSource: DataSource) => {
  const { db_type, username } = req.session;
  const { tableName } = req.body;

  let tableNameFormat = '';
  switch (db_type) {
    case 'oracle':
      tableNameFormat = `"${(username as string).toUpperCase()}"."${tableName}"`;
      break;
    case 'mssql':
      const schemaName: {[SchemaName: string]: string}[] = await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`);
      tableNameFormat = `${schemaName[0].SchemaName}.${tableName}`;
      break;
    default:
      tableNameFormat = tableName;
      break;
  };
  return tableNameFormat;
};

interface NewColumn {
  name: string,
  type: string,
  isNullable: boolean,
  isPrimary: boolean,
  defaultValue: any,
};

//---------------CONNECT TO THE DATABASE-----------------------------------------------------------------------------------------

export const dbConnect = async (req: Request) => {
  const { db_type, hostname, password, port, username, database_name, service_name } = req.session;

  if (db_type === 'mysql') {
    const dbDataSource = new DataSource({
      type: "mysql",
      host: hostname as string,
      port: port ? parseInt(port as string) : 3306,
      username: username as string,
      password: password as string,
      database: database_name as string,
      synchronize: true,
      logging: true,
    });
    await dbDataSource.initialize();
    console.log('Data source has been connected');
    return dbDataSource;
  } else if (db_type === 'postgres') {
    const dbDataSource = new DataSource({
      type: "postgres",
      host: hostname as string,
      port: port ? parseInt(port as string) : 5432,
      username: username as string,
      password: password as string,
      database: database_name as string,
      synchronize: true,
      logging: true,
    });
      await dbDataSource.initialize();
      console.log('Data source has been connected');
      return dbDataSource;
  } else if (db_type === 'mssql') {
    const dbDataSource = new DataSource({
      type: "mssql",
      host: hostname as string,
      port: port ? parseInt(port as string) : 1433,
      username: username as string,
      password: password as string,
      database: database_name as string,
      synchronize: true,
      logging: true,
      options: {
        encrypt: false,
      },
    });
      await dbDataSource.initialize();
      console.log('Data source has been connected');
      return dbDataSource;
  } else if (db_type === 'oracle') {
    const dbDataSource = new DataSource({
      type: "oracle",
      host: hostname as string,
      port: port ? parseInt(port as string) : 1521,
      username: username as string,
      password: password as string,
      database: database_name as string,
      synchronize: true,
      logging: true,
      serviceName: service_name as string,
    });
    await dbDataSource.initialize();
    console.log('Data source has been connected');
    return dbDataSource;
  } else {
    const dbDataSource = new DataSource({
      type: "sqlite",
      database: database_name as string,
      synchronize: true,
      logging: true,
    });
    await dbDataSource.initialize();
    console.log('Data source has been connected');
    return dbDataSource;
  };
};

//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------

export const addNewDbRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type } = req.session;
  const { newRow } = req.body;

  try{
  // const tableNameAdd: string = db_type === 'oracle' ? `"${(username as string).toUpperCase()}"."${tableName}"` : tableName;
  const tableNameAdd = await Promise.resolve(tableNameFormat(req, dbDataSource));
  const newSqlRow: {[key: string]: string} = newRow as {};

    const keys: string = db_type === 'oracle' ? Object.keys(newSqlRow).map(key => `"${key}"`).join(", ") : Object.keys(newSqlRow).join(", ");
    const values: string = Object.values(newSqlRow).map(val => `'${val}'`).join(", ");

    const dbAddedRow: Promise<unknown> = await dbDataSource.query(`
      INSERT INTO ${tableNameAdd} (${keys})
      VALUES (${values})
    `);

    await dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('dbAddedRow in helper: ', dbAddedRow);
    return dbAddedRow;

  } catch (err: unknown) {
    console.log('Error occurred in the addNewDbRow middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
  return next(err);
  };
};

//-----------------UPDATE ROW--------------------------------------------------------------------------------------------------

export const updateRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type, username } = req.session;
  const { newRow, tableName, primaryKey } = req.body;

  try{
    let tableNameUpdate = '';
    switch (db_type) {
      case 'oracle':
        tableNameUpdate = `"${(username as string).toUpperCase()}"."${tableName}"`;
        break;
      case 'mssql':
        const schemaName: {[SchemaName: string]: string}[] = await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`);
        tableNameUpdate = `${schemaName[0].SchemaName}.${tableName}`;
        break;
      default:
        tableNameUpdate = tableName;
        break;
    };

    //const tableNameUpdate = await Promise.resolve(tableNameFormat(req, dbDataSource));

    const updateKeys = Object.keys(newRow);
    const updateValues = Object.values(newRow);
    let oracleKeyValueString = '';
    for (let i = 0; i < updateKeys.length; i++) {
      oracleKeyValueString += `"${updateKeys[i]}" = '${updateValues[i]}'${i < updateKeys.length - 1 ? ', ' : ''}`
    };

    const keyValueString = oracleKeyValueString.replace(/"/g, '');

    const primaryKeyName = Object.keys(primaryKey);
    const primaryKeyValue = Object.values(primaryKey);

    const dbUpdatedRow = await dbDataSource.query(`
      UPDATE ${tableNameUpdate}
      SET ${db_type === 'oracle' ? oracleKeyValueString : keyValueString }
      WHERE ${db_type === 'oracle' ? `"${primaryKeyName}"` : primaryKeyName} = ${db_type === 'oracle' || db_type === 'mysql' ? `'${primaryKeyValue}'` : primaryKeyValue}
     `);

    await dbDataSource.destroy();
    console.log('Database has been disconnected');
    return dbUpdatedRow;

  } catch (err: unknown) {
    console.log('Error occurred in the updatedRow middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
};

//----------------DELETE ROW----------------------------------------------------------------------------------------------------

export const deleteRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type } = req.session;
  const { value } = req.body
 
  try{
    const tableNameDelete = await Promise.resolve(tableNameFormat(req, dbDataSource));

    const deleteEntries = Object.entries(value).filter(([_key, value]) => value !== null);
    const deleteKeys = deleteEntries.map(([key, _value]) => key);
    const deleteValues = deleteEntries.map(([_key, value]) => value);

    let oracleKeyValueString = '';
    for (let i = 0; i < deleteKeys.length; i++) {
      oracleKeyValueString += `"${deleteKeys[i]}" = '${deleteValues[i]}'${i < deleteKeys.length - 1 ? ' AND ' : ''}`
    };
    const keyValueString = oracleKeyValueString.replace(/"/g, '');

    await dbDataSource.query(`
      DELETE FROM ${tableNameDelete} 
      WHERE ${db_type === 'oracle' ? oracleKeyValueString : keyValueString }
      `)

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return; 

  } catch (err: unknown) {
    console.log('Error occurred in the deleteRow middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
};

//-------------------------------------SCHEMA TABLE COLUMNS--------------------------------------------------------------------------------------------
//----------------ADD NEW COLUMN--------------------------------------------------------------------------------------------------

export const addNewDbColumn: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type } = req.session;
  const { columnData } = req.body;
  console.log('req.body: ', req.body)

  try{
    const tableNameAddColumn = await Promise.resolve(tableNameFormat(req, dbDataSource));
    console.log('tableNameAddColumn: ', tableNameAddColumn)

    let keyValueString: string = '';
    let newColumnString: string = ''

    columnData.forEach((el: NewColumn) => {
      if (db_type === 'mssql') {
        keyValueString += `ALTER TABLE ${tableNameAddColumn} ADD "${el.name}" ${el.type === 'AUTO_INCREMENT' ? 'INT' : el.type}${el.isPrimary ? ' PRIMARY KEY' : ''}${el.isNullable ? '' : ' NOT NULL'}${el.defaultValue ? ` DEFAULT ${el.defaultValue}` : ''}${el.type === 'AUTO_INCREMENT' ? ' AUTO_INCREMENT' : ''}; `
      } else if(db_type === 'oracle') {
        let number: string = '';
        if (el.type.includes('VARCHAR')) {
          const regex = /\((\d+)\)/;
          const match = el.type.match(regex)
          number = (match as RegExpMatchArray)[1]
        }
        keyValueString += `ALTER TABLE ${tableNameAddColumn} ADD(${el.name} ${el.type.includes('VARCHAR') ? `VARCHAR2(${+number})` : el.type}${el.isPrimary ? ' PRIMARY KEY' : ''}${el.isNullable ? '' : ' NOT NULL'}${el.defaultValue ? ` DEFAULT ${el.defaultValue}` : ''}${el.type === 'AUTO_INCREMENT' ? ' AUTO_INCREMENT' : ''}))`
     } else {
        keyValueString += `ADD${db_type === 'postgres' ? ' COLUMN' : '' } ${ db_type === 'mysql' ? `${el.name}` : `"${el.name}"`} ${el.type === 'AUTO_INCREMENT' ? 'INT' : el.type}${el.isPrimary ? ' PRIMARY KEY' : ''}${el.isNullable ? '' : ' NOT NULL'}${el.defaultValue ? ` DEFAULT ${el.defaultValue}` : ''}${el.type === 'AUTO_INCREMENT' ? ' AUTO_INCREMENT' : ''}, `
      };
    });

    if (db_type === 'mssql' || db_type === 'oracle') {
      newColumnString = keyValueString.slice(0, -1); 
    } else {
      newColumnString = keyValueString.slice(0, -2); 
    };

    if (db_type === 'mssql' || db_type === 'oracle') {
      const addedNewColumn: Promise<unknown> = await dbDataSource.query(`
        ${newColumnString}
        `);

      await dbDataSource.destroy();
      console.log('Database has been disconnected');
      console.log('addedForeignKey in helper: ', addedNewColumn);
      return addedNewColumn;
    } else {
      const addedNewColumn: Promise<unknown> = await dbDataSource.query(`
        ALTER TABLE ${tableNameAddColumn}
        ${newColumnString}
        `);

      await dbDataSource.destroy();
      console.log('Database has been disconnected');
      console.log('addedForeignKey in helper: ', addedNewColumn);
      return addedNewColumn;
    }
  } catch (err: unknown) {
      console.log('Error occurred in the addedForeignKey middleware: ', err);
      dbDataSource.destroy();
      console.log('Database has been disconnected');
      return next(err);
  };
};

//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------

export const updateDbColumn: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type, username } = req.session;
  const { tableName, columnName, schemaData, columnData } = req.body;

  try{
    const tableNameUpdateColumn = await Promise.resolve(tableNameFormat(req, dbDataSource));
    console.log('schemaData: ', schemaData)
    console.log('columnData: ', columnData)

    // const updatedColumn: Promise<unknown> = await dbDataSource.query(`
    //   ALTER TABLE ${tableNameUpdateColumn}
    //   ${db_type === 'postgres' || db_type === 'microsoft' ? 'ALTER COLUMN' : 'MODIFY' } "${columnName}" ${db_type} ${db_type === 'postgres' ? updateColumnData.constraintName : null} ${updateColumnData.constraintExpression}
    //   `);

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    // console.log('addedForeignKey in helper: ', updatedColumn);
    // return updatedColumn;

  } catch (err: unknown) {
    console.log('Error occurred in the addedForeignKey middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
};

//-------------DELETE COLUMN-------------------------------------------------------------------------------------------------

export const deleteColumn: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req)
  const { db_type } = req.session
  const { columnName } = req.body
console.log('we are in the helper functions: ', req.body)
  try{  
    const columnTableNameDelete = await Promise.resolve(tableNameFormat(req, dbDataSource));

    const deletedColumn: Promise<unknown> = await dbDataSource.query(`
    ALTER TABLE ${columnTableNameDelete}
    DROP${db_type !== 'mysql' ? ' COLUMN' : ''} ${columnName}
    `)

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('deletedColumn in helper: ', deletedColumn)
    return deletedColumn; 

  } catch (err: unknown) {
    console.log('Error occurred in the addNewTable middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
};

//---------------------------DATABASE TABLES--------------------------------------------------------------------------------------------------------
//--------------ADD NEW TABLE--------------------------------------------------------------------------------------------------

export const addNewTable: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req)
  const { newColumns } = req.body

  try{   
    const tableNameNewTable = await Promise.resolve(tableNameFormat(req, dbDataSource));


      let keyValueString: string = '';
      newColumns.forEach((el: NewColumn) => {
        keyValueString += `${el.name} ${el.type}${el.isPrimary ? ' PRIMARY KEY' : ''}${el.isNullable ? '' : ' NOT NULL'}, `
      });

      const newTableColumnString: string = keyValueString.slice(0, -2); 

      await dbDataSource.query(`
        CREATE TABLE ${tableNameNewTable} (
        ${newTableColumnString}
        )`
      );

    await dbDataSource.destroy();
    console.log('Database has been disconnected');
    return;

  } catch (err: unknown) {
    console.log('Error occurred in the addNewTable middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
};

//--------------GET ALL TABLE NAMES--------------------------------------------------------------------------------------------
export const getTableNames: RequestHandler = async (req: Request, res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req)
  const { db_type } = req.session

  interface TableNames {
    tablename?: string | undefined; // Postgres
    Tables_in_user?: string | undefined; // MySQL
    TABLE_NAME?: string | undefined; // Microsoft & Oracle
    name?: string | undefined; // SQLite
  };

  try {
    let query: string = '';
    switch(db_type) {
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
    };

    const tableNameList: TableNames[] = await dbDataSource.query(query);

    const tables: (string | undefined)[] = tableNameList.map((obj: TableNames) => {
      switch(db_type) {
        case 'postgres':
          return obj.tablename;
        case 'mysql':
          return obj.Tables_in_user;
        case 'mssql':
        case 'oracle':
          return obj.TABLE_NAME;
        default:
          return obj.name; //SQLite
      };
    });

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return tables;

  } catch (err: unknown) {
    console.log('Error occurred in the addNewTable middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
};


//--------------DELETE TABLE---------------------------------------------------------------------------------------------------

export const deleteTable: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type, username } = req.session;

  try{
    const deleteTableData: {[key: string]: string } = req.body;

    let tableName = '';
    switch (db_type) {
      case 'oracle':
        tableName = `"${(username as string).toUpperCase()}"."${deleteTableData.tableName}"`;
        break;
      case 'mssql':
        const schemaName: {[SchemaName: string]: string}[] = await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`);
        tableName = `${schemaName[0].SchemaName}.${deleteTableData.tableName}`;
        break;
      default:
        tableName = deleteTableData.tableName;
        break;
    };

    const deletedTable: Promise<unknown> = await dbDataSource.query(`DROP TABLE ${tableName}`)

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('deletedTable in helper: ', deletedTable)
    return deletedTable; 

  } catch (err: unknown) {
    console.log('Error occurred in the addNewTable middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
};

//------------------------------------------FOREIGN KEYS----------------------------------------------------------------------------------------------
//--------------ADD NEW FOREIGN KEY----------------------------------------------------------------------------------------------

export const addForeignKey: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type, username } = req.session;


  try{
    const addForeignKeyData: {[key: string]: string } = req.body;

    const schemaName = db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';

    const primaryKeyTableNameFK = addForeignKeyData.PrimaryKeyTableName.slice(7, addForeignKeyData.PrimaryKeyTableName.length + 1);
    const foreignKeyTableNameFK = addForeignKeyData.ForeignKeyTableName.slice(7, addForeignKeyData.ForeignKeyTableName.length + 1);

    const microsoftPrimaryTableName = `${schemaName[0].SchemaName}.${primaryKeyTableNameFK}`;
    const microsoftForeignTableName = `${schemaName[0].SchemaName}.${foreignKeyTableNameFK}`;

    let primaryTableName: string = '';
    let foreignTableName: string = '';

    switch (db_type) {
      case 'oracle':
        primaryTableName = `"${(username as string).toUpperCase()}"."${primaryKeyTableNameFK}"`;
        foreignTableName = `"${(username as string).toUpperCase()}"."${foreignKeyTableNameFK}"`;
        break;
      case 'mssql':
        primaryTableName = `${microsoftPrimaryTableName}`;
        foreignTableName = `${microsoftForeignTableName}`;
        break;
      default:
        primaryTableName = addForeignKeyData.tableName;
        foreignTableName = addForeignKeyData.tableName;
        break;
    };

    const addedForeignKey: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${foreignTableName}
      ADD CONSTRAINT fk_${addForeignKeyData.ForeignKeyColumnName}_to_${addForeignKeyData.PrimaryKeyColumnName}
      FOREIGN KEY ("${addForeignKeyData.ForeignKeyColumnName}")
      REFERENCES ${primaryTableName} ("${addForeignKeyData.PrimaryKeyColumnName}")
      `);

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('addedForeignKey in helper: ', addedForeignKey);
    return addedForeignKey; 

  } catch (err: unknown) {
    console.log('Error occurred in the addedForeignKey middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
};

//----------------REMOVE FOREIGN KEY--------------------------------------------------------------------------------------------

export const removeForeignKey: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type } = req.session;

  try{
    const removeForeignKeyTableName = await Promise.resolve(tableNameFormat(req, dbDataSource));
    const removeForeignKeyData: {[key: string]: string } = req.body;

    const removedForeignKey: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${removeForeignKeyTableName}
      DROP ${db_type === 'mysql' ? 'FOREIGN KEY' : 'CONSTRAINT'} ${removeForeignKeyData.constraintName}
      `);

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('addedForeignKey in helper: ', removedForeignKey);
    return removedForeignKey; 

  } catch (err: unknown) {
    console.log('Error occurred in the removedForeignKey middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
};

//------------------------------------------------------------------------------------------------------------