import { RequestHandler, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

//----------------------------------------------------------------------------

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

  //----------------------------------------------------------------------------

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

  //----------------------------------------------------------------------------

  export const updateRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
    const dbDataSource = await dbConnect(req)
    console.log('req.session: ', req.session)

    try{
    const user: string | undefined = req.session.username;   
    const updatedDbRowData: {[key: string]: string } = req.body;
    const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${updatedDbRowData.tableName}"` : updatedDbRowData.tableName;
    const updatedSqlRow: {[key: string]: string} = updatedDbRowData.updatedRow as {};

        // const keys: string = req.session.db_type === 'oracle' ? Object.keys(updatedSqlRow).map(key => `"${key}"`).join(", ") : Object.keys(updatedSqlRow).join(", ");
        // console.log('keys: ', keys)
        // const values: string = Object.values(updatedSqlRow).map(val => `'${val}'`).join(", ");
        // console.log('values: ', values)
        const dbUpdatedRow: Promise<unknown> = await dbDataSource.query(`
        UPDATE ${tableName} 
        SET ${updatedSqlRow}
        `);

      dbDataSource.destroy();
      console.log('Database has been disconnected');
      console.log('dbUpdatedRow in helper: ', dbUpdatedRow)
      return dbUpdatedRow; 

  } catch (err: unknown) {
    console.log('Error occurred in the updatedRow middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
  };

  export const deleteRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
    const dbDataSource = await dbConnect(req)
    console.log('req.session: ', req.session)

    try{
    const user: string | undefined = req.session.username;   
    const deletedDbRowData: {[key: string]: string } = req.body;
    const tableName: string = req.session.db_type === 'oracle' ? `"${(user as string).toUpperCase()}"."${deletedDbRowData.tableName}"` : updatedDbRowData.tableName;
    const deletedSqlRow: {[key: string]: string} = deletedDbRowData.updatedRow as {};

        // const keys: string = req.session.db_type === 'oracle' ? Object.keys(updatedSqlRow).map(key => `"${key}"`).join(", ") : Object.keys(updatedSqlRow).join(", ");
        // console.log('keys: ', keys)
        // const values: string = Object.values(updatedSqlRow).map(val => `'${val}'`).join(", ");
        // console.log('values: ', values)
        const dbDeletedRow: Promise<unknown> = await dbDataSource.query(`
        DELETE FROM ${tableName} 
        WHERE primary_key_column = ${deletedSqlRow.primary_key_value}
        `);

      dbDataSource.destroy();
      console.log('Database has been disconnected');
      console.log('dbAddedRow in helper: ', dbDeletedRow)
      return dbDeletedRow; 

  } catch (err: unknown) {
    console.log('Error occurred in the deleteRow middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
  };