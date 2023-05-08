import { RequestHandler, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

//----------------------------------------------------------------------------

export const addNewDbRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
    const dbDataSource = await dbConnect(req)
    console.log('req.session: ', req.session)
    try{
    const newDbRowData: {[key: string]: string } = req.body;
    const tableName = newDbRowData.tableName;
    const newMysqlRow: {[key: string]: string} = newDbRowData.newRow as {};

          const keys: string = Object.keys(newMysqlRow).join(", ");
          console.log("keys: ", keys)
          const values: string = Object.values(newMysqlRow).map(val => `'${val}'`).join(", ");
          console.log('values: ', values)
          const dbAddedRow: Promise<unknown> = await dbDataSource.query(`INSERT INTO ${tableName} (${keys})
            VALUES (${values})`);

      dbDataSource.destroy();
      console.log('Database has been disconnected');
      console.log('dbAddedRow in helper: ', dbAddedRow)
      return dbAddedRow;
      

  } catch (err: unknown) {
    console.log('Error occurred in the mysqlAddNewRow middleware: ', err);
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    return next(err);
  };
  };

  //----------------------------------------------------------------------------

 export const dbConnect = async (req: Request) => {
    const { db_type, hostname, password, port, username, database_name, service_name, file_path } = req.session;    
if (db_type){
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
        //req.session.database = file_path;
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
} else {
    throw new Error('Unable to connect to database')
}
  };

  //----------------------------------------------------------------------------