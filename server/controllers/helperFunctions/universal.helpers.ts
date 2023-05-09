import { RequestHandler, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

  //------------------------------------------------------------------------------------------------------------

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
    } 
 };


//------------------------------------------------------------------------------------------------------------

export const addNewDbRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
    const dbDataSource = await dbConnect(req)
    console.log('req.session: ', req.session)

    try{
    const user: string | undefined = req.session.username;   
    const newDbRowData: {[key: string]: string } = req.body;
    const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${newDbRowData.tableName}"` : newDbRowData.tableName;
    const newSqlRow: {[key: string]: string} = newDbRowData.newRow as {};

        const keys: string = req.session.db_type === 'oracle' ? Object.keys(newSqlRow).map(key => `"${key}"`).join(", ") : Object.keys(newSqlRow).join(", ");
        console.log('keys: ', keys)
        const values: string = Object.values(newSqlRow).map(val => `'${val}'`).join(", ");
        console.log('values: ', values)
        const dbAddedRow: Promise<unknown> = await dbDataSource.query(`INSERT INTO ${tableName} (${keys})
        VALUES (${values})`);

    

      dbDataSource.destroy();
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

  //------------------------------------------------------------------------------------------------------------

  export const updateRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
    const dbDataSource = await dbConnect(req)
    console.log('req.session: ', req.session)

    try{
      const user: string | undefined = req.session.username;
      const updatedDbRowData: { [key: string]: string } = req.body;
      const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${updatedDbRowData.tableName}"` : updatedDbRowData.tableName;
      const updatedSqlRow: { [key: string]: string } = updatedDbRowData.newRow as {};
  
      const keys = Object.keys(updatedSqlRow);
      const values = Object.values(updatedSqlRow);
  
      const updateString = keys.map((key) => `"${key}" = ?`).join(', ');
      const queryParams = [...values];
  
      const dbUpdatedRow = await dbDataSource.query(
        `UPDATE ${tableName} SET ${updateString}`,
        queryParams
      );
  
      dbDataSource.destroy();
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

  //------------------------------------------------------------------------------------------------------------

  export const deleteRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
    const dbDataSource = await dbConnect(req)
    console.log('req.session: ', req.session)

    try{
        const user: string | undefined = req.session.username;   
        const deletedDbRowData: {[key: string]: string } = req.body;
        const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${deletedDbRowData.tableName}"` : deletedDbRowData.tableName;


        const dbDeletedRow: Promise<unknown> = await dbDataSource.query(`
        DELETE FROM ${tableName} 
        WHERE '${deletedDbRowData.primaryKey}' = ${deletedDbRowData.value}
        `);

      dbDataSource.destroy();
      console.log('Database has been disconnected');
      console.log('deletedRow in helper: ', dbDeletedRow)
      return dbDeletedRow; 

    } catch (err: unknown) {
        console.log('Error occurred in the deleteRow middleware: ', err);
        dbDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    };
  };

//------------------------------------------------------------------------------------------------------------

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
        //const foreignKeyTableName = addNewColumnData.ForeignKeyTableName.slice(7, addNewColumnData.ForeignKeyTableName.length + 1)
        const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${oracleTableName}"` : addNewColumnData.tableName;
        //const foreignTableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${foreignKeyTableName}"` : addNewColumnData.ForeignKeyTableName;

        const addedNewColumn: Promise<unknown> = await dbDataSource.query(`
        ALTER TABLE ${tableName}
        ADD ${dbType === 'postgres' ? 'COLUMN' : '' } "${addNewColumnData.columnName}" ${addNewColumnData.dataType} ${dbType === 'postgres' ? addNewColumnData.constraintName : null} ${addNewColumnData.constraintExpression}
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

//------------------------------------------------------------------------------------------------------------

   export const addForeignKey: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
    const dbDataSource = await dbConnect(req)
    console.log('req.session: ', req.session)

    try{
        const user: string | undefined = req.session.username;   
        const addForeignKeyData: {[key: string]: string } = req.body;
        console.log('req.body: ', req.body)

        //For Oracle, the special database
        const primaryKeyTableName = addForeignKeyData.PrimaryKeyTableName.slice(7, addForeignKeyData.PrimaryKeyTableName.length + 1)
        const foreignKeyTableName = addForeignKeyData.ForeignKeyTableName.slice(7, addForeignKeyData.ForeignKeyTableName.length + 1)
        const primaryTableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${primaryKeyTableName}"` : addForeignKeyData.PrimaryKeyTableName;
        const foreignTableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${foreignKeyTableName}"` : addForeignKeyData.ForeignKeyTableName;

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

//------------------------------------------------------------------------------------------------------------

export const updateDbColumn: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
  const dbDataSource = await dbConnect(req)
  console.log('req.session: ', req.session)

  try{
      const user: string | undefined = req.session.username;   
      const dbType: string | undefined = req.session.db_type;   
      const updateColumnData: {[key: string]: string } = req.body;
      console.log('req.body: ', req.body)

      //For Oracle, the special database
      const oracleTableName = updateColumnData.tableName.slice(7, updateColumnData.tableName.length + 1)
      //const foreignKeyTableName = addNewColumnData.ForeignKeyTableName.slice(7, addNewColumnData.ForeignKeyTableName.length + 1)
      const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${oracleTableName}"` : updateColumnData.tableName;
      //const foreignTableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${foreignKeyTableName}"` : addNewColumnData.ForeignKeyTableName;

      const updatedColumn: Promise<unknown> = await dbDataSource.query(`
      ALTER TABLE ${tableName}
      ${dbType === 'postgres' || dbType === 'microsoft' ? 'ALTER COLUMN' : 'MODIFY' } "${updateColumnData.columnName}" ${updateColumnData.dataType} ${dbType === 'postgres' ? updateColumnData.constraintName : null} ${updateColumnData.constraintExpression}
      `);
      console.log('updatedColumn: ', updatedColumn)
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

//------------------------------------------------------------------------------------------------------------

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
