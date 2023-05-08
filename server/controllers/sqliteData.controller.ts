import { RequestHandler, Request, Response, NextFunction } from 'express';
import { TableColumns, TableSchema, TableColumn, ReferenceType } from '@/Types';
// import { addNewDbRow } from './helperFunctions/universal.helpers'
import { DataSource } from 'typeorm';


const dbConnect = async (req: Request) => {
  const { db_type, file_path } = req.session;
  
  const dbDataSource = new DataSource({
    type: db_type as "sqlite", // "mysql" || "mariadb" || "postgres" || "cockroachdb" || "sqlite" || "mssql" || "sap" || "oracle" || "cordova" || "nativescript" || "react-native" || "sqljs" || "mongodb" || "aurora-mysql" || "aurora-postgres" || "expo" || "better-sqlite3" || "capacitor",
    // host: hostname as string,
    // port: port ? parseInt(port as string) : 1521,
    // username: username as string,
    // password: password as string,
    database: file_path as string,
    // serviceName: service_name ? service_name as string : undefined,
    // filePath: file_path as string,
    synchronize: true,
    logging: true,
  });
  console.log('db_type: ', db_type)
 //Start connection with the database
 await dbDataSource.initialize();
 console.log('Data source has been connected');

 return dbDataSource;
};

//----------------------------------------------------------------------------

export const sqliteQuery: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      //function organizing data from queries in to the desired format of the front end
      async function sqliteFormatTableSchema(sqliteSchemaData: TableColumn[], tableName: string): Promise<TableColumn> {
      const tableSchema: TableColumn = {};
      
      for (const column of sqliteSchemaData) {
        const columnName: any = column.name
        const keyString: number = column.pk

        //Creating the intial format for the Reference property if there is a foreign key

        //query for the foreign key data
        const foreignKeys = await SqliteDataSource.query(`PRAGMA foreign_key_list(${tableName})`)
        const foreignKey = await foreignKeys.find((fk: any) => fk.from === columnName);
        // console.log('foreignKey before: ', foreignKey)
        
        const references = [];

          if (foreignKey) {
            // console.log('foreignKey after: ', foreignKey)
            references.push({
                isDestination: false,
                PrimaryKeyName: foreignKey.from,
                PrimaryKeyTableName: 'public.' + tableName,
                ReferencesPropertyName: foreignKey.to,
                ReferencesTableName: foreignKey.table,
                constraintName: tableName + '_' + foreignKey.from + '_fkey'
              });
              
              // console.log('[references]: ', [references])
            };
      
        tableSchema[columnName] = {
        IsForeignKey: foreignKey ? true : false,
        IsPrimaryKey: keyString !== 0 ? true : false,
        Name: columnName,
        References: references,
        TableName: 'public.' + tableName,
        Value: column.dflt_value,
        additional_constraints: column.notnull === 1 ? 'NOT NULL' : null,
        data_type: column.type,
        field_name: columnName,
        };
      };
     return tableSchema;
      };

      const SqliteDataSource = await dbConnect(req);

        const tables = await SqliteDataSource.query(`SELECT name FROM sqlite_master WHERE type='table'`)
 
        const tableData: TableColumns = {};
        const schema: TableSchema = {};

                // LOOP
      for (const table of tables) {

        // DATA Create property on tableData object with every loop
        const tableName = table.name;
        const tableDataQuery = await SqliteDataSource.query(`SELECT * FROM ${tableName}`);
        tableData[tableName] = tableDataQuery

        // SCHEMAS Create property on schema object with every loop
          const sqliteSchemaData = await SqliteDataSource.query(`PRAGMA table_info(${tableName})`)
          //console.log('sqliteForeignKeyData', sqliteSchemaData)

        // console.log('sqliteSchemaData: ', sqliteSchemaData)
          schema['public.' + tableName] = await sqliteFormatTableSchema(sqliteSchemaData, tableName);
        };

              // Console.logs to check what the data looks like
    //   console.log('table data: ', tableData)
    //   console.log('schema data: ', schema)


      // Storage of queried results into res.locals
      res.locals.schema = schema;
      res.locals.data = tableData;

      // Disconnecting after data has been received 
      SqliteDataSource.destroy();
      console.log('Database has been disconnected');

      return next();

    } catch (err: unknown) {
        console.log('Error during Data Source: ', err);
        return next(err);
    };
};

//----------------------------------------------------------------------------

export const sqliteAddNewRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction) => {
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