import { RequestHandler, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

export const addNewDbRow: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try{
      const OracleDataSource = await dbConnect(req)
      const newOracleRowData: {[key: string]: string } = req.params
      const tableName: string = newOracleRowData.tableName
      const newOracleRow: {[key: string]: string} = newOracleRowData.newOracleRow as any ;
      
        const oracleInsertRow = OracleDataSource.createQueryBuilder()
        .insert()
        .into(tableName)
  
        Object.keys(newOracleRow).forEach((key) => {
          oracleInsertRow.values({ [key]: newOracleRow[key] });
        });
  
        const result = await oracleInsertRow.execute()
  
        console.log(`Row: ${newOracleRow} has been added to ${tableName} and this is the result: `, result)
  
        res.locals.newOracleRow = result
  
        OracleDataSource.destroy();
        console.log('Database has been disconnected');
        
        return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleAddNewRow middleware: ', err);
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
      type: db_type as  "mysql" || "mariadb" || "postgres" || "cockroachdb" || "sqlite" || "mssql" || "sap" || "oracle" || "cordova" || "nativescript" || "react-native" || "sqljs" || "mongodb" || "aurora-mysql" || "aurora-postgres" || "expo" || "better-sqlite3" || "capacitor",
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

   //Start connection with the database
   await dbDataSource.initialize();
   console.log('Data source has been connected');

   return dbDataSource;
  }