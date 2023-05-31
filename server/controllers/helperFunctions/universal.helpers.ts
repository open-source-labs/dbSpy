import { RequestHandler, Request, Response, NextFunction } from 'express';
import { DataSource, DatabaseType } from 'typeorm';


// HELPER FUNCTIONS FOR THE HELPER FUNCTIONS

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
  let dbDataSource: DataSource;

  const commonOptions = {
    ...(db_type !== 'sqlite' ? { host: hostname as string } : {}),
    username: username as string,
    password: password as string,
    database: database_name as string,
    synchronize: true,
    logging: true,
  };

  switch (db_type) {
    case 'mysql':
      dbDataSource = new DataSource({
        type: "mysql",
        port: port ? parseInt(port as string) : 3306,
        ...commonOptions,
      });
      break;

    case 'mssql':
      dbDataSource = new DataSource({
        type: "mssql",
        port: port ? parseInt(port as string) : 1433,
        options: {
          encrypt: false,
        },
        ...commonOptions,
      });
      break;

    case 'oracle':
      dbDataSource = new DataSource({
        type: "oracle",
        port: port ? parseInt(port as string) : 1521,
        serviceName: service_name as string,
        ...commonOptions,
      });
      break;

    case 'sqlite':
      dbDataSource = new DataSource({
        type: "sqlite",
        ...commonOptions,
      });
      break;

    default:
      dbDataSource = new DataSource({
        type: "postgres",
        host: hostname as string,
        port: port ? parseInt(port as string) : 5432,
        ...commonOptions,
      });
      break;
  };

  await dbDataSource.initialize();
  console.log('Data source has been connected');
  return dbDataSource;
};


//-------------------------------------DATA TABLE ROWS----------------------------------------------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------------------------------------

export const addNewDbRow: RequestHandler = async (req: Request, res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type } = req.session;
  const { newRow, tableName } = req.body;

  try{
    const keys: string = db_type === 'oracle' ? Object.keys(newRow).map(key => `"${key}"`).join(", ") : Object.keys(newRow).join(", ");
    const values: string = Object.values(newRow).map(val => `'${val}'`).join(", ");

    console.log('tablename: ', tableName)
    console.log('keys: ', keys)
    console.log('values: ', values)

    const dbAddedRow: Promise<unknown> = await dbDataSource.query(`
      INSERT INTO ${tableName} (${db_type === 'postgres' ? keys.toLowerCase() : keys })
      VALUES (${values})
    `);

    await dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('dbAddedRow in helper: ', dbAddedRow);
    return;

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
  const { db_type } = req.session;
  const { newRow, tableName, primaryKey } = req.body;

  try{
    console.log('req.body: ', req.body)
    const updateKeys = Object.keys(newRow);
    const updateValues = Object.values(newRow);
    let oracleKeyValueString = '';
    for (let i = 0; i < updateKeys.length; i++) {
      oracleKeyValueString += `"${updateKeys[i]}" = '${updateValues[i]}'${i < updateKeys.length - 1 ? ', ' : ''}`
    };

    const keyValueString = oracleKeyValueString.replace(/"/g, '');

    if (primaryKey) {

      const primaryKeyName = Object.keys(primaryKey);
      const primaryKeyValue = Object.values(primaryKey);
      const dbUpdatedRow = await dbDataSource.query(`
        UPDATE ${tableName}
        SET ${db_type === 'oracle' ? oracleKeyValueString : keyValueString }
        WHERE ${db_type === 'oracle' ? `"${primaryKeyName}"` : primaryKeyName} = ${db_type === 'oracle' || db_type === 'mysql' ? `'${primaryKeyValue}'` : primaryKeyValue}
      `);

      await dbDataSource.destroy();
      console.log('Database has been disconnected');
      return dbUpdatedRow;

    } else {

      const dbUpdatedRow = await dbDataSource.query(`
      UPDATE ${tableName}
      SET ${db_type === 'oracle' ? oracleKeyValueString : keyValueString }
      `);

      await dbDataSource.destroy();
      console.log('Database has been disconnected');
      return dbUpdatedRow;
    };

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
  const { value, tableName } = req.body
 
  try{
    const deleteEntries = Object.entries(value).filter(([_key, value]) => value !== null);
    const deleteKeys = deleteEntries.map(([key, _value]) => key);
    const deleteValues = deleteEntries.map(([_key, value]) => value);

    let oracleKeyValueString = '';
    for (let i = 0; i < deleteKeys.length; i++) {
      oracleKeyValueString += `"${deleteKeys[i]}" = '${deleteValues[i]}'${i < deleteKeys.length - 1 ? ' AND ' : ''}`
    };
    const keyValueString = oracleKeyValueString.replace(/"/g, '');

    await dbDataSource.query(`
      DELETE FROM ${tableName} 
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
  const { columnData, tableName } = req.body;

  try{
    let keyValueString: string = '';
    let newColumnString: string = '';

    columnData.forEach((el: NewColumn) => {
      if (db_type === 'mssql') {
        keyValueString += `ALTER TABLE ${tableName} ADD "${el.name}" ${el.type === 'AUTO_INCREMENT' ? 'INT' : el.type}${el.isPrimary ? ' PRIMARY KEY' : ''}${el.isNullable ? '' : ' NOT NULL'}${el.defaultValue ? ` DEFAULT ${el.defaultValue}` : ''}${el.type === 'AUTO_INCREMENT' ? ' AUTO_INCREMENT' : ''}; `
      } else if (db_type === 'oracle') {
        let number: string = '';
        if (el.type.includes('VARCHAR')) {
          const regex = /\((\d+)\)/;
          const match = el.type.match(regex)
          number = (match as RegExpMatchArray)[1]
        }
        keyValueString += `ALTER TABLE ${tableName} ADD(${el.name} ${el.type.includes('VARCHAR') ? `VARCHAR2(${+number})` : el.type}${el.isPrimary ? ' PRIMARY KEY' : ''}${el.isNullable ? '' : ' NOT NULL'}${el.defaultValue ? ` DEFAULT ${el.defaultValue}` : ''}${el.type === 'AUTO_INCREMENT' ? ' AUTO_INCREMENT' : ''}))`
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
        ALTER TABLE ${tableName}
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
// Currently does not work
export const updateDbColumn: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type } = req.session;
  const { columnName, schemaData, columnData, tableName } = req.body;

  try{
      await dbDataSource.query(`
      UPDATE ${tableName}
      ${db_type === 'postgres' || db_type === 'microsoft' ? 'ALTER COLUMN' : 'MODIFY' } "${columnName}" ${db_type} ${ columnData.additional_constraint ? columnData.additional_constraint : ''};
      `);

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return;

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
  const { columnName, tableName, constraintName } = req.body

  try{

    if (constraintName) {
      await dbDataSource.query(`
        ALTER TABLE ${tableName} 
        DROP ${db_type === 'mysql' ? 'FOREIGN KEY' : 'CONSTRAINT'} ${constraintName};
        `)
    };

    const deletedColumn: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${tableName}
      DROP COLUMN ${columnName};
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
  const { newColumns, tableName } = req.body

  try{
    let keyValueString: string = '';
    newColumns.forEach((el: NewColumn) => {
      keyValueString += `${el.name} ${el.type}${el.isPrimary ? ' PRIMARY KEY' : ''}${el.isNullable ? '' : ' NOT NULL'}, `
    });

    const newTableColumnString: string = keyValueString.slice(0, -2); 

    await dbDataSource.query(`
      CREATE TABLE ${tableName} (
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
      case 'mysql':
        query = 'SHOW TABLES';
        break;
      case 'mssql':
        query = 'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES';
        break;
      case 'oracle':
        query = 'SELECT table_name FROM user_tables';
        break;
      case 'sqlite':
        query = "SELECT name FROM sqlite_master WHERE type='table'";
        break;
      default:
        query = 'SELECT tableName FROM pg_catalog.pg_tables WHERE schemaname = \'public\''; // Postgres
    };

    const tableNameList: TableNames[] = await dbDataSource.query(query);

    const tables: (string | undefined)[] = tableNameList.map((obj: TableNames) => {
      switch(db_type) {
        case 'mysql':
          return obj.Tables_in_user;
        case 'mssql':
        case 'oracle':
          return obj.TABLE_NAME;
        case 'sqlite':
          return obj.name;
        default:
          return obj.name; // Postgres
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
  const { tableName } = req.body

  try{
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
  const { db_type } = req.session;
  const { PrimaryKeyTableName, PrimaryKeyColumnName, ForeignKeyTableName, ForeignKeyColumnName, constraintName } = req.body;

  try{

    const addedForeignKey: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${ForeignKeyTableName}
      ADD CONSTRAINT ${constraintName}
      FOREIGN KEY (${db_type === 'mssql' || db_type === 'oracle' ? `"${ForeignKeyColumnName}"` : `${ForeignKeyColumnName}`})
      REFERENCES ${PrimaryKeyTableName} (${ db_type === 'mssql' || db_type === 'oracle' ? `"${PrimaryKeyColumnName}"` : `${PrimaryKeyColumnName}`})
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
// This does not currently work
export const removeForeignKey: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req);
  const { db_type } = req.session;
  const { tableName, constraintName } = req.body

  try{
    const removedForeignKey: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${tableName}
      DROP ${db_type === 'mysql' ? 'FOREIGN KEY' : 'CONSTRAINT'} ${constraintName}
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