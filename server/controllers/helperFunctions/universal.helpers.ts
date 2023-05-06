import { RequestHandler, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

export const addNewDbRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction,) => {
    const dbDataSource = await dbConnect(req)
    try{
    const newDbRowData: {[key: string]: string } = req.body
    const tableName: string = newDbRowData.tableName
    const newMysqlRow = newDbRowData.newRow as any ;

          const keys = Object.keys(newMysqlRow).join(", ");
          console.log('keys: ', keys)
          const values = Object.values(newMysqlRow).map(val => `'${val}'`).join(", ");
          console.log('values: ', values)
          const dbAddedRow = await dbDataSource.query(`INSERT INTO ${tableName} (${keys})
            VALUES (${values})`);

      dbDataSource.destroy();
      console.log('Database has been disconnected');
      console.log('dbAddedRow in helper: ', dbAddedRow)
      return dbAddedRow;
      

  } catch (err: unknown) {
    dbDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('Error occurred in the mysqlAddNewRow middleware: ', err);
    return next(err);
  };
  };

//   enum Database {
//     MySQL = "mysql",
//     Postgres = "postgres",
//     CockroachDB = "cockroachdb",
//     SAP = "sap",
//     Spanner = "spanner",
//     MariaDB = "mariadb",
//     SQLite = "sqlite",
//     Cordova = "cordova",
//     ReactNative = "react-native",
//     NativeScript = "nativescript",
//     SQLJS = "sqljs",
//     Oracle = "oracle",
//     MSSQL = "mssql",
//     MongoDB = "mongodb",
//     AuroraMySQL = "aurora-mysql",
//     AuroraPostgres = "aurora-postgres",
//     Expo = "expo",
//     BetterSQLite3 = "better-sqlite3",
//     Capacitor = "capacitor"
//   }
  

 export const dbConnect = async (req: Request) => {
    const { db_type, hostname, password, port, username, database_name, service_name, file_path } = req.session;
    
    const dbDataSource = new DataSource({
      type: db_type as "mysql" || "mariadb" || "postgres" || "cockroachdb" || "sqlite" || "mssql" || "sap" || "oracle" || "cordova" || "nativescript" || "react-native" || "sqljs" || "mongodb" || "aurora-mysql" || "aurora-postgres" || "expo" || "better-sqlite3" || "capacitor",
      host: hostname as string,
      port: port ? parseInt(port as string) : 1521,
      username: username as string,
      password: password as string,
      database: database_name as string,
      serviceName: service_name as string,
      filePath: file_path as string,
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
  }