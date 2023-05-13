import { RequestHandler, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

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
  const dbDataSource = await dbConnect(req)
  console.log('req.session: ', req.session)

  try{
  const user: string | undefined = req.session.username;   
  const newDbRowData: {[key: string]: string } = req.body;
  const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${newDbRowData.tableName}"` : newDbRowData.tableName;
  const newSqlRow: {[key: string]: string} = newDbRowData.newRow as {};

    const keys: string = req.session.db_type === 'oracle' ? Object.keys(newSqlRow).map(key => `"${key}"`).join(", ") : Object.keys(newSqlRow).join(", ");
    const values: string = Object.values(newSqlRow).map(val => `'${val}'`).join(", ");

    const dbAddedRow: Promise<unknown> = await dbDataSource.query(`
      INSERT INTO ${tableName} (${keys})
      VALUES (${values})
    `);

    await dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('dbAddedRow in helper: ', dbAddedRow)
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
  const dbDataSource = await dbConnect(req)
  console.log('req.session: ', req.session)

  try{
    const user: string | undefined = req.session.username;
    const updatedDbRowData: { [key: string]: string } = req.body;
    // const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${updatedDbRowData.tableName}"` : updatedDbRowData.tableName;
    const updatedSqlRow: { [key: string]: string } = updatedDbRowData.newRow as {};
    const primaryKeyData: { [key: string]: string } = updatedDbRowData.primaryKey as {};

    console.log('updatedDbRowData: ', updatedDbRowData)

    const schemaName = req.session.db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
    //For Oracle, the special database
      //const newTableName = updatedDbRowData.tableName
      //const slicedTableName = newTableName.slice(7, newTableName.length + 1)
      //console.log('slicedTableName: ', slicedTableName)
      const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${updatedDbRowData.tableName}"` : 
        req.session.db_type === 'mssql' ? `${schemaName[0].SchemaName}.${updatedDbRowData.tableName}` : updatedDbRowData.tableName;

    const updateKeys = Object.keys(updatedSqlRow);
    const updateValues = Object.values(updatedSqlRow);
    let oracleKeyValueString = ''
    for (let i = 0; i < updateKeys.length; i++) {
      oracleKeyValueString += `"${updateKeys[i]}" = '${updateValues[i]}'${i < updateKeys.length - 1 ? ', ' : ''}`
    }

    const keyValueString = oracleKeyValueString.replace(/"/g, '');

    const primaryKeyName = Object.keys(primaryKeyData);
    const primaryKeyValue = Object.values(primaryKeyData);

    const dbUpdatedRow = await dbDataSource.query(`
      UPDATE ${tableName}
      SET ${req.session.db_type === 'oracle' ? oracleKeyValueString : keyValueString }
      WHERE ${req.session.db_type === 'oracle' ? `"${primaryKeyName}"` : primaryKeyName} = ${req.session.db_type === 'oracle' || req.session.db_type === 'mysql' ? `'${primaryKeyValue}'` : primaryKeyValue}
     `);

    await dbDataSource.destroy();
    console.log('Database has been disconnected');
  //   console.log('dbUpdatedRow in helper: ', dbUpdatedRow)
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
  const { db_type, username } = req.session;
  const { tableName, primaryKey, value, deletedRow } = req.body
 
  try{
    let tableNameDelete = '';
    switch (db_type) {
      case 'oracle':
        tableNameDelete = `"${(username as string).toUpperCase()}"."${tableName}"`;
        break;
      case 'mssql':
        const schemaName = db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
        tableNameDelete = `${schemaName}.${tableName}`;
        break;
      default:
        tableNameDelete = tableName;
        break;
    };

    if (primaryKey){
      await dbDataSource.query(`
        DELETE FROM ${tableNameDelete} 
        WHERE ${db_type === 'oracle' ? `"${primaryKey}"` : primaryKey} = ${db_type === 'oracle' || db_type === 'mysql' ? `'${value}'` : value}
        `)

    } else {
      const deleteEntries = Object.entries(deletedRow).filter(([_key, value]) => value !== null);
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
    };

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    // console.log('deletedRow in helper: ', dbDeletedRow);
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
  const dbDataSource = await dbConnect(req)
  console.log('req.session: ', req.session)

  try{
      const user: string | undefined = req.session.username;   
      const dbType: string | undefined = req.session.db_type;   
      const addNewColumnData: {[key: string]: string } = req.body;
      console.log('req.body: ', req.body)

      //For Oracle, the special database
      const oracleTableName = addNewColumnData.tableName.slice(7, addNewColumnData.tableName.length + 1)
      const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${oracleTableName}"` : addNewColumnData.tableName;

      const addedNewColumn: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${tableName}
      ADD${dbType === 'postgres' ? ' COLUMN' : '' } "${addNewColumnData.columnName}" ${addNewColumnData.dataType} ${dbType === 'postgres' ? addNewColumnData.constraintName : null} ${addNewColumnData.constraintExpression}
      `);
      console.log('addedNewColumn: ', addedNewColumn)
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('addedForeignKey in helper: ', addedNewColumn)
    return addedNewColumn; 

  } catch (err: unknown) {
      console.log('Error occurred in the addedForeignKey middleware: ', err);
      dbDataSource.destroy();
      console.log('Database has been disconnected');
      return next(err);
  };
};

//-----------------UPDATE COLUMN---------------------------------------------------------------------------------------------

export const updateDbColumn: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req)
  console.log('req.session: ', req.session)

  try{
      const user: string | undefined = req.session.username;   
      const dbType: string | undefined = req.session.db_type;   
      const updateColumnData: {[key: string]: string } = req.body;
      console.log('req.body: ', req.body)


      const schemaName = req.session.db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
      //For Oracle, the special database
      const slicedTableName = updateColumnData.tableName.slice(7, updateColumnData.tableName.length + 1)
      const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${slicedTableName}"` : 
        req.session.db_type === 'mssql' ? `${schemaName[0].SchemaName}.${slicedTableName}` : updateColumnData.tableName;
    

      const updatedColumn: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${tableName}
      ${dbType === 'postgres' || dbType === 'microsoft' ? 'ALTER COLUMN' : 'MODIFY' } "${updateColumnData.columnName}" ${updateColumnData.dataType} ${dbType === 'postgres' ? updateColumnData.constraintName : null} ${updateColumnData.constraintExpression}
      `);

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('addedForeignKey in helper: ', updatedColumn)
    return updatedColumn; 

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
  console.log('req.session: ', req.session)

  try{
      const dbType: string | undefined = req.session.db_type; 
      const user: string | undefined = req.session.username;    
      const deleteColumnData: {[key: string]: string } = req.body;
      console.log('req.body: ', req.body)

      //For Oracle, the special database
      const oracleTableName = deleteColumnData.tableName.slice(7, deleteColumnData.tableName.length + 1)
      const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${oracleTableName}"` : deleteColumnData.tableName;

      const deletedColumn: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${tableName}
      DROP${dbType !== 'mysql' ? ' COLUMN' : null} ${deleteColumnData.columnName}
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
  console.log('req.session: ', req.session)

  try{
      const user: string | undefined = req.session.username;    
      const newTableData: {[key: string]: string } = req.body;
      console.log('req.body: ', req.body)

      //For Oracle, the special database
      const oracleTableName = newTableData.tableName.slice(7, newTableData.tableName.length + 1)
      const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${oracleTableName}"` : newTableData.tableName;

      let newTableString = '';
    for (const columnName in newTableData) {
      newTableString += `${columnName} ${newTableData.key}, `
    }

      const newTable: Promise<unknown> = await dbDataSource.query(`
      CREATE TABLE ${tableName} (
        ${newTableString}
      )`
      );

    dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('newTable in helper: ', newTable)
    return newTable; 

  } catch (err: unknown) {
      console.log('Error occurred in the addNewTable middleware: ', err);
      dbDataSource.destroy();
      console.log('Database has been disconnected');
      return next(err);
  };
};

//--------------DELETE TABLE---------------------------------------------------------------------------------------------------

export const deleteTable: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req)
  console.log('req.session: ', req.session)

  try{
      const user: string | undefined = req.session.username;    
      const deleteTableData: {[key: string]: string } = req.body;
      console.log('req.body: ', req.body)

      const schemaName = req.session.db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
      //For Oracle, the special database
      const slicedTableName = deleteTableData.tableName.slice(7, deleteTableData.tableName.length + 1)
      const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${slicedTableName}"` : 
        req.session.db_type === 'mssql' ? `${schemaName[0].SchemaName}.${slicedTableName}` : deleteTableData.tableName;

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
  const dbDataSource = await dbConnect(req)
  console.log('req.session: ', req.session)

  try{
      const user: string | undefined = req.session.username;   
      const addForeignKeyData: {[key: string]: string } = req.body;
      console.log('req.body: ', req.body)


      const schemaName = req.session.db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
      // console.log('SchemaName: ', schemaName[0].SchemaName)
      
      //For Oracle, the special database
      const primaryKeyTableName = addForeignKeyData.PrimaryKeyTableName.slice(7, addForeignKeyData.PrimaryKeyTableName.length + 1);
      const foreignKeyTableName = addForeignKeyData.ForeignKeyTableName.slice(7, addForeignKeyData.ForeignKeyTableName.length + 1);
      const microsoftPrimaryTableName = `${schemaName[0].SchemaName}.${primaryKeyTableName}`
      const microsoftForeignTableName = `${schemaName[0].SchemaName}.${foreignKeyTableName}`

      const primaryTableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${primaryKeyTableName}"` :
        req.session.db_type === 'mssql' ? `${microsoftPrimaryTableName}` : addForeignKeyData.tableName;
      const foreignTableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${foreignKeyTableName}"` : 
        req.session.db_type === 'mssql' ? `${microsoftForeignTableName}` : addForeignKeyData.tableName;

      const addedForeignKey: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${foreignTableName}
      ADD CONSTRAINT fk_${addForeignKeyData.ForeignKeyColumnName}_to_${addForeignKeyData.PrimaryKeyColumnName}
      FOREIGN KEY ("${addForeignKeyData.ForeignKeyColumnName}")
      REFERENCES ${primaryTableName} ("${addForeignKeyData.PrimaryKeyColumnName}")
      `);
      console.log('addedForeignKey: ', addedForeignKey)
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('addedForeignKey in helper: ', addedForeignKey)
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
  const dbDataSource = await dbConnect(req)
  console.log('req.session: ', req.session)

  try{
      const user: string | undefined = req.session.username;   
      const removeForeignKeyData: {[key: string]: string } = req.body;
      console.log('req.body: ', req.body)


      const schemaName = req.session.db_type === 'mssql' ? await dbDataSource.query(`SELECT SCHEMA_NAME() AS SchemaName;`) : '';
      
      //For Oracle, the special database
      const foreignKeyTableName = removeForeignKeyData.PrimaryKeyTableName.slice(7, removeForeignKeyData.PrimaryKeyTableName.length + 1);
      const microsoftPrimaryTableName = `${schemaName[0].SchemaName}.${foreignKeyTableName}`


      const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${foreignKeyTableName}"` :
        req.session.db_type === 'mssql' ? `${microsoftPrimaryTableName}` : removeForeignKeyData.tableName;

      const removedForeignKey: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${tableName}
      DROP ${req.session.db_type === 'mysql' ? 'FOREIGN KEY' : 'CONSTRAINT'} ${removeForeignKeyData.constraintName}
      `);

    console.log('removedForeignKey: ', removedForeignKey)
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('addedForeignKey in helper: ', removedForeignKey)
    return removedForeignKey; 

  } catch (err: unknown) {
      console.log('Error occurred in the removedForeignKey middleware: ', err);
      dbDataSource.destroy();
      console.log('Database has been disconnected');
      return next(err);
  };
};

//------------------------------------------------------------------------------------------------------------