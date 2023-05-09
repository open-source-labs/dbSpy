import { RequestHandler, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

//----------------------------------------------------------------------------

// export const addNewDbRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
//     const dbDataSource = await dbConnect(req)
//     console.log('req.session: ', req.session)
//     try{
//     const newDbRowData: {[key: string]: string } = req.body;
//     const tableName = newDbRowData.tableName;
//     const newMysqlRow: {[key: string]: string} = newDbRowData.newRow as {};

//           const keys: string = Object.keys(newMysqlRow).join(", ");
//           console.log("keys: ", keys)
//           const values: string = Object.values(newMysqlRow).map(val => `'${val}'`).join(", ");
//           console.log('values: ', values)
//           const dbAddedRow: Promise<unknown> = await dbDataSource.query(`INSERT INTO ${tableName} (${keys})
//             VALUES (${values})`);

//       dbDataSource.destroy();
//       console.log('Database has been disconnected');
//       console.log('dbAddedRow in helper: ', dbAddedRow)
//       return dbAddedRow;
      

//   } catch (err: unknown) {
//     console.log('Error occurred in the mysqlAddNewRow middleware: ', err);
//     dbDataSource.destroy();
//     console.log('Database has been disconnected');
//     return next(err);
//   };
//   };

  //----------------------------------------------------------------------------

 export const dbConnect = async (req: Request) => {
    const { db_type, hostname, password, port, username, database_name, service_name, file_path } = req.session;
    
    const dbDataSource = new DataSource({
      type: db_type as "mysql" || "mariadb" || "postgres" || "cockroachdb" || "sqlite" || "mssql" || "sap" || "oracle" || "cordova" || "nativescript" || "react-native" || "sqljs" || "mongodb" || "aurora-mysql" || "aurora-postgres" || "expo" || "better-sqlite3" || "capacitor",
      host: hostname as string,
      port: port ? parseInt(port as string) : 1521,
      username: username as string,
      password: password as string,
      database: database_name as string || file_path as string,
      serviceName: service_name ? service_name as string : undefined,
      //filePath: file_path as string,
      synchronize: true,
      logging: true,
      options: {
        encrypt: false,
        }
    });
    console.log('db_type: ', db_type)
   //Start connection with the database
   await dbDataSource.initialize();
   console.log('Data source has been connected');

   return dbDataSource;
  };

  //----------------------------------------------------------------------------