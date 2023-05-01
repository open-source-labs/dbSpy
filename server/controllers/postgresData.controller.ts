import { RequestHandler, Request, Response, NextFunction } from 'express';
import { PostgresTableColumns, PostgresTableSchema, PostgresTableColumn } from '@/Types';
import { postgresSchemaQuery, postgresForeignKeyQuery } from './queries/postgres.queries';
//import { PostgresDataSource } from '../datasource';
//import { postgresFormatTableSchema } from './helperFunctions/postgres.functions';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config


//----------------------------------------------------------------------------
export const postgresQuery: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hostname, password, port, username, database_name } = req.query;

    console.log(hostname, password, port, username, database_name)
    console.log('DataSource: ', DataSource)

    const PostgresDataSource = new DataSource({
      type: "postgres",
      host: hostname as string,
      port: port ? parseInt(port as string) : 5432,
      username: username as string,
      password: password as string,
      database: database_name as string,
      synchronize: true,
      logging: true,
    });


    //Start connection with the database
      await PostgresDataSource.initialize();
        console.log('Data source has been connected');

        async function getForeignKeys(): Promise<PostgresTableColumn[]> {
          return await PostgresDataSource.query(postgresForeignKeyQuery);
        };
        
        //function organizing data from queries in to the desired format of the front end
        async function postgresFormatTableSchema(columns: PostgresTableColumn[], tableName: string): Promise<PostgresTableColumn> {
        const tableSchema: PostgresTableColumn = {};
        
        for (const column of columns) {
          const columnName: any = column.column_name
          const keyString: any = column.additional_constraints
        
          //query for the foreign key data
          const foreignKeys: any = await getForeignKeys();
          const foreignKey = await foreignKeys.find((fk: any) => fk.foreign_key_column === columnName);
          
          //Creating the format for the Reference property if their is a foreign key
          const references: any = {
            length: 0,
          };
        
          if (foreignKey){
            references[references.length] = {
              idDestination: false,
              PrimaryKeyName: foreignKey.foreign_key_column,
              PrimaryKeyTableName: foreignKey.table_with_foreign_key,
              ReferencesPropertyName: foreignKey.referenced_column,
              ReferencesTableName: foreignKey.referenced_table,
              constraintName: foreignKey.constraint_name
            };
            references.length += 1;
          };
        
          tableSchema[columnName] = {
            IsForeignKey: keyString.includes('FOREIGN KEY'),
            IsPrimaryKey: keyString.includes('PRIMARY KEY'),
            Name: columnName,
            References: foreignKey ? [references] : [],
            TableName: 'public.' + tableName,
            Value: null,
            additional_constraints: keyString.includes('NOT NULL') ? 'NOT NULL' : null,
            data_type: column.data_type,
            field_name: columnName,
          };
        };
        return tableSchema;
        };

        //Retrieve all table names
        const tables = await PostgresDataSource.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
        //Declare storage objects with their related interfaces
        const tableData: PostgresTableColumns = {};
        const schema: PostgresTableSchema = {};

        // LOOP
      for (const table of tables) {

        // DATA Create property on tableData object with every loop
        let tableName = table.tablename;
        const tableDataQuery = await PostgresDataSource.query(`SELECT * FROM ${tableName}`);
        tableData['public.' + tableName] = tableDataQuery

        // SCHEMAS Create property on schema object with every loop
          const postgresSchemaData = await PostgresDataSource.query(postgresSchemaQuery.replace('tableName', tableName))
          schema['public.' + tableName] = await postgresFormatTableSchema(postgresSchemaData, tableName);
        };

      //check to see what things look like with these console.logs
      console.log('schema: ', schema)
      console.log('data: ', tableData)

      //Storage of queried results into res.locals
      res.locals.schema = schema;
      res.locals.data = tableData;
      return next();

  } catch (err: unknown) {
    console.log('Error during Data Source: ', err);
    return next(err);
  }
}
//----------------------------------------------------------------------------

// type ColumnSchema = {
//   table_name: string;
//   column_name: string;
//   data_type: string;
//   is_nullable: 'YES' | 'NO';
// };
// type PgSchema = ColumnSchema[];
// type Key = {
//   constraint_name: string;
//   table_name: string;
//   column_name: string;
//   constraint_type: string;
//   foreign_table_name: string;
//   foreign_column_name: string;
// };
// type PgKeys = Key[];
// /**
//  * Take user input, request schema from database, parse resulting schema, pass parsed data to next middleware.
//  */
// export const getSchema: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
//   log.info('Server received Postgres database URI.');

//   const schemaQuery: string = `SELECT table_name, column_name, data_type, is_nullable
//     FROM information_schema.columns
//     WHERE table_schema = 'public' AND table_name != 'pg_stat_statements'
//     ORDER BY table_name, ordinal_position;`;

//   const keyQuery: string = `SELECT 
//       tc.constraint_name,
//       tc.table_name, 
//       kcu.column_name, 
//       tc.constraint_type,
//       ccu.table_name AS foreign_table_name,
//       ccu.column_name AS foreign_column_name
//     FROM 
//       information_schema.table_constraints tc
//       JOIN information_schema.key_column_usage kcu
//         ON tc.constraint_name = kcu.constraint_name
//       LEFT JOIN information_schema.referential_constraints rc
//         ON tc.constraint_name = rc.constraint_name
//       LEFT JOIN information_schema.constraint_column_usage ccu
//         ON rc.unique_constraint_name = ccu.constraint_name
//     WHERE 
//       tc.constraint_type = 'PRIMARY KEY' OR tc.constraint_type = 'FOREIGN KEY'
//       AND tc.table_schema = 'public';`;

//   const { hostname, password, port, username, database_name } = req.query;
//   if (
//     typeof hostname !== 'string' ||
//     typeof password !== 'string' ||
//     typeof port !== 'string' ||
//     typeof username !== 'string' ||
//     typeof database_name !== 'string'
//   )
//     return next({
//       message: 'TypeError: req.query key values must be strings',
//     });

//   const client = new Client({
//     host: hostname,
//     port: parseInt(port),
//     user: username,
//     password,
//     database: database_name,
//   });

//   try {
//     await client.connect();
//     log.info('Connected to Postgres database');

//     const result = await Promise.all([client.query(schemaQuery), client.query(keyQuery)]);
//     const [schemaResult, keyResult] = result;

//     // append 'public.' to each table name b/c they were pulled from the public schema
//     const pgKeys: PgKeys = keyResult.rows.map((constraint) => ({
//       ...constraint,
//       table_name: `public.${constraint.table_name}`,
//       foreign_table_name: `public.${constraint.foreign_table_name}`,
//     }));
//     const pgSchema: PgSchema = schemaResult.rows.map((column) => ({
//       ...column,
//       table_name: `public.${column.table_name}`,
//     }));

//     res.locals.data = parsePgResult(pgSchema, pgKeys);
//     return next();
//   } catch (error: unknown) {
//     return next({
//       message: 'Error querying database',
//       log: error,
//     });
//   }
// };
// //--------------------------------------------------------------------------------------
// /*
//  * Formats results for frontend schema store
//  */
// function parsePgResult(pgSchema: PgSchema, pgKeys: PgKeys): SchemaStore {
//   const schemaStore: SchemaStore = {};

//   for (let { table_name, column_name, data_type, is_nullable } of pgSchema) {
//     // init property in schemaStore then populate it
//     if (!(table_name in schemaStore)) {
//       schemaStore[table_name] = {};
//     }
//     schemaStore[table_name][column_name] = {
//       Name: column_name,
//       Value: null,
//       TableName: table_name,
//       References: [],
//       IsPrimaryKey: false,
//       IsForeignKey: false,
//       field_name: column_name,
//       data_type:
//         data_type === 'character varying'
//           ? 'VARCHAR(255)'
//           : (data_type.toUpperCase() as SQLDataType),
//       additional_constraints: is_nullable === 'NO' ? 'NOT NULL' : null,
//     };
//   }

//   // add fk and pk data to schemaStore
//   for (const {
//     constraint_name,
//     table_name,
//     column_name,
//     constraint_type,
//     foreign_table_name,
//     //foreign_column_name, COMMENT THIS OUT AS IT DID NOTHING - Stephen
//   } of pgKeys) {
//     const column = schemaStore[table_name][column_name];

//     if (constraint_type === 'PRIMARY KEY') {
//       column.IsPrimaryKey = true;
//     } else {
//       //const foreignColumn = schemaStore[foreign_table_name][foreign_column_name]; COMMENT THIS OUT AS IT DID NOTHING - Stephen
//       // flip IsForeignKey for column
//       column.IsForeignKey = true;
//       // push to column's references
//       // Changes to the format of References will require refactoring many legacy processes
//       column.References.push({
//         PrimaryKeyName: column_name,
//         PrimaryKeyTableName: foreign_table_name,
//         ReferencesPropertyName: column_name,
//         ReferencesTableName: table_name,
//         IsDestination: false,
//         constraintName: constraint_name,
//       });
//     }
//   }

//   return schemaStore;
// }
