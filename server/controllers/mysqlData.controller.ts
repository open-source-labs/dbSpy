import { Request, Response, NextFunction, RequestHandler } from 'express';
import { TableColumns, TableSchema, TableColumn, ReferenceType } from '@/Types';
import { mysqlForeignKeyQuery } from './queries/mysql.queries';
// import { addNewDbRow } from './helperFunctions/universal.helpers'
import { DataSource } from 'typeorm';


export const dbConnect = async (req: Request) => {
  const { db_type, hostname, password, port, username, database_name } = req.session;
  
  const dbDataSource = new DataSource({
    type: db_type as "mysql", //"mysql" || "mariadb" || "postgres" || "cockroachdb" || "sqlite" || "mssql" || "sap" || "oracle" || "cordova" || "nativescript" || "react-native" || "sqljs" || "mongodb" || "aurora-mysql" || "aurora-postgres" || "expo" || "better-sqlite3" || "capacitor",
    host: hostname as string,
    port: port ? parseInt(port as string) : 1521,
    username: username as string,
    password: password as string,
    database: database_name as string,
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

export const mysqlQuery: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

    async function getForeignKeys(columnName: string, tableName: string): Promise<any[]> {
      return await MysqlDataSource.query(mysqlForeignKeyQuery.replace('columnName', columnName).replace('tableName', tableName));
  };

    async function mysqlFormatTableSchema(mysqlSchemaData: TableColumn[], tableName: string): Promise<TableColumn> {
      const tableSchema: TableColumn = {};
  
      for (const column of mysqlSchemaData) {
          const columnName: any = column.Field;
          //const tableName: any = column.TableName
          const keyString: any = column.Key;
          
          //query for the foreign key data
          const foreignKeys: any = await getForeignKeys(columnName, tableName);
          const foreignKey = foreignKeys.find((fk: any) => fk.COLUMN_NAME === columnName);

          //Creating the format for the Reference property if there is a foreign key
          const references = []

          if (foreignKey){
              references.push({
                  isDestination: false,
                  PrimaryKeyName: foreignKey.COLUMN_NAME,
                  PrimaryKeyTableName: 'public.' + tableName,
                  ReferencesPropertyName: foreignKey.REFERENCED_COLUMN_NAME,
                  ReferencesTableName: 'public.' + foreignKey.REFERENCED_TABLE_NAME,
                  constraintName: foreignKey.CONSTRAINT_NAME,
              });
          };
  
          //Formation of the schema data
          tableSchema[columnName] = {
              IsForeignKey: keyString.includes('MUL'),
              IsPrimaryKey: keyString.includes('PRI'),
              Name: column.Field,
              References: references,
              TableName: 'public.' + tableName,
              Value: null,
              additional_constraints: column.Null === 'NO' ? 'NOT NULL' : null ,
              data_type: column.Type,
              field_name: column.Field,
          };
      };
  
      return tableSchema;
  };

  const MysqlDataSource = await dbConnect(req);
  try {
    //Obtain all table names from the database
    const tables: any[] = await MysqlDataSource.query(`SHOW TABLES`);

    //Declare constants to store results we get back from queries
    const data: TableColumns = {};
    const schema: TableSchema = {};

    //LOOP
    for (const table of tables) {
      const tableName: string = table[`Tables_in_${MysqlDataSource.options.database}`];

      // Getting Data from all tables
      const tableData = await MysqlDataSource.query(`SELECT * FROM ${tableName}`);
      data[tableName] = tableData;
      // Getting Schemas for all tables
      const mysqlSchemaData: any = await MysqlDataSource.query(`DESCRIBE ${MysqlDataSource.options.database}.${tableName}`);
      schema['public.' + tableName] = await mysqlFormatTableSchema(mysqlSchemaData, tableName);
    }

    // Console.logs to check what the data looks like
    // console.log("table data: ", data);
    // console.log("schema data: ", schema);

    // Storage of queried results into res.locals
    res.locals.schema = schema;
    res.locals.data = data;
    

    // Disconnecting after data has been received 
    MysqlDataSource.destroy();
    console.log('Database has been disconnected');

    return next();

  } catch (err: unknown) {
    MysqlDataSource.destroy();
    console.log('Database has been disconnected');
    console.log('Error during Data Source: ', err);
    return next(err);
  };
};

//----------------------------------------------------------------------------

export const mysqlAddNewRow: RequestHandler = async (req: Request, _res: Response, next: NextFunction) => {
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

// // SSL data stored as environment variable for GitHub Actions access
// // Also stored in .cert file because Elastic Beanstalk has a ~4000 char limit for its environment variables
// const SSL_KEY =
//   typeof process.env.SSL_KEY === 'string'
//     ? Buffer.from(process.env.SSL_KEY, 'base64').toString('ascii')
//     : fs.readFileSync('./.cert/key.pem').toString();
// const SSL_CERT =
//   typeof process.env.SSL_CERT === 'string'
//     ? Buffer.from(process.env.SSL_CERT, 'base64').toString('ascii')
//     : fs.readFileSync('./.cert/cert.pem').toString();

// /**
// //  * mySQLdataController.getSchema
// //  * @param {string} hostname - A required string with database hostname
// //  * @param {string} password - A required string with database password
// //  * @param {string} port - A required string with database port
// //  * @param {string} username - A required string with database username
// //  * @param {string} databaseName - A required string with the database name
// //  **/

// export const getSchema = async (req: Request, res: Response, next: NextFunction) => {
//   // // Option 1 - Production
//   //use mysqldump to download mysql db schema
//   log.info('Connecting to mySQL database...');
//   const { hostname, password, port, username, database_name } = req.query;
//   try {
//     const result = await mysqldump({
//       connection: {
//         host: hostname,
//         password,
//         port,
//         user: username,
//         database: database_name,
//         ssl: {
//           key: SSL_KEY,
//           cert: SSL_CERT,
//         },
//       },
//       dumpToFile: '../db_schemas',
//     });
//     res.locals.data = result;
//     //const { tables } = result;
//     next();
//   } catch (error: unknown) {
//     log.info((error as Error).message);
//     next({ message: 'Error with getSchema middleware' });
//   }
// };

// /**
//  * mySQLdataController.objSchema
//  * Iterates through data tables received from mySQL server
//  * Builds object to be returned to front-end
//  */
// export const objSchema = (_req: Request, res: Response, next: NextFunction) => {
//   const db = res.locals.data;
//   const { tables } = db;
//   const results = {};

//   //create Table class
//   class TableModel {
//     [key: string]: any;
//     constructor(public name: string) {}
// }

//   //create Properties class
//   class PropertyModel {
//     Name: string;
//     Value: any = null;
//     data_type: string = 'varchar';
//     TableName: string | null = null;
//     References: string[] = [];
//     IsPrimaryKey: boolean = false;
//     IsForeignKey: boolean = false;
//     additional_constraints: string = 'NA';
//     field_name: string;

//     constructor(name: string) {
//       this.Name = name;
//       this.field_name = name;
//     }
//   }
  
//   // create foreign key class
//   class ForeignKeyModel {
//     PrimaryKeyName: string | null = null; //key name at referenced table
//     PrimaryKeyTableName: string | null = null; //  referenced table name
//     ReferencesPropertyName: string | null = null; //key name at current table
//     ReferencesTableName: string | null = null;//current table name
//     IsDestination: boolean = false;
//     constraintName: string | null = null; //constraint from SQL query
//   }

//   //append tables and table properties to results
//   tables.forEach((table: any) => {
//     //check if table or view
//     if (!table.isView) {
//       //get unique keys
//       let uKeys = table.schema.slice(table.schema.indexOf('UNIQUE KEY'));
//       uKeys = uKeys.slice(uKeys.indexOf('(') + 1, uKeys.indexOf(')'));
//       if (uKeys.includes(',')) uKeys = uKeys.split(', ');
//       else uKeys = [uKeys];
//       const uniqueKeys = uKeys.map((key: string) => key.slice(1, -1));

//       //get primary keys
//       let pKeys = table.schema.slice(table.schema.indexOf('PRIMARY KEY'));
//       pKeys = pKeys.slice(pKeys.indexOf('(') + 1, pKeys.indexOf(')'));
//       if (pKeys.includes(',')) pKeys = pKeys.split(', ');
//       else pKeys = [pKeys];
//       const primaryKeys = pKeys.map((key: string) => key.slice(1, -1));

//       //create foreign key and reference object (foreign key: references)
//       const foreignKeyReferences: any = {};
//       //declare foreign keys/references helper function
//       type ForeignKeysFn = (string: string) => void;
//       const foreignKeys: ForeignKeysFn = function(string = '') {
//         if (string === '') return;
//         let constraint = null;
//         //find constraint name
//         if (string.slice(string.indexOf('CONSTRAINT'))) {
//           string = string.slice(string.indexOf('CONSTRAINT'));
//           string = string.slice(string.indexOf('`') + 1);
//           constraint = string.slice(0, string.indexOf('`'));
//         }
//         //find foreign key
//         string = string.slice(string.indexOf('FOREIGN KEY'));
//         string = string.slice(string.indexOf('(') + 2);
//         const fKey = string.slice(0, string.indexOf(')') - 1);
//         //find primary table name
//         string = string.slice(string.indexOf('REFERENCES'));
//         string = string.slice(string.indexOf('`') + 1);
//         const primaryTable = string.slice(0, string.indexOf('`'));
//         //find primary table name
//         const primaryKey = string.slice(string.indexOf('(') + 2, string.indexOf(')') - 1);
//         //create new ForeignKeyModel and assign properties
//         foreignKeyReferences[fKey] = new ForeignKeyModel();
//         foreignKeyReferences[fKey].ReferencesPropertyName = fKey;
//         foreignKeyReferences[fKey].ReferencesTableName = table.name;
//         foreignKeyReferences[fKey].PrimaryKeyName = primaryKey;
//         foreignKeyReferences[fKey].PrimaryKeyTableName = primaryTable;
//         foreignKeyReferences[fKey].constraintName = constraint;

//         //find additional foreign keys and references
//         return foreignKeys(string);
//       };
//       //invoke foreignKeys function and pass table.schema string
//       foreignKeys(table.schema);

//       //create and assign new table to results object
//       //const results: { [key: string]: TableModel } = {}; ---> We Don't need this? -Stephen


//       //create new table properties
//       table.columnsOrdered.forEach((propName: string) => {
//         const newProp = new PropertyModel(propName);
//         //assign table name
//         newProp.TableName = table.name;
//         //assign field name
//         newProp.field_name = newProp.Name;
//         //assign data type
//         newProp.data_type = table.columns[newProp.Name].type;
//         //assign additional_constraints (primary, unique or not null)
//         if (primaryKeys.includes(newProp.Name))
//           newProp.additional_constraints = 'PRIMARY KEY';
//         else if (uniqueKeys.includes(newProp.Name))
//           newProp.additional_constraints = 'UNIQUE';
//         else if (!table.columns[propName].nullable)
//           newProp.additional_constraints = 'NOT NULL';
//         //check if primary key
//         if (primaryKeys.includes(newProp.Name)) newProp.IsPrimaryKey = true;
//         // check if foreign key and assign references
//         if (foreignKeyReferences[newProp.Name]) {
//           newProp.IsForeignKey = true;
//           newProp.References = [foreignKeyReferences[newProp.Name]];
//         }

//         //assign new property to table
//         const results: {[key: string]: TableModel & {[key: string]: PropertyModel}} = {};
//         if (!results[table.name]) {
//           results[table.name] = new TableModel(table.name);
//         }
//         results[table.name][newProp.Name] = newProp;
//       });
//     }
//   });

//   res.locals.data = results;
//   return next();
// };

// export default mySQLdataController;
