import { RequestHandler, Request, Response, NextFunction } from 'express';
import { Client } from 'pg';
import { SchemaStore } from '../../src/store/schemaStore';
import { SQLDataType } from '@/Types';
import log from '../logger/index';
import dotenv from 'dotenv'
import { DataSource } from 'typeorm';
//import { UserPost } from '../entities/user.entity'
dotenv.config();


//----------------------------------------------------------------------------
export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.USER_DB_URL_POSTGRES,
  port: 5432,
  username: process.env.USER_DB_USER_POSTGRES,
  password: process.env.USER_DB_PW_POSTGRES,
  database: 'xvcmlhle',
  synchronize: true,
  logging: true,
});

interface TableColumn {
  Field?: string;
  Type?: string;
  Null?: string;
  Key?: string;
  Default?: any;
  Extra?: string;
  References?: any[];
  TableName?: string;
  IsForeignKey?: boolean;
  IsPrimaryKey?: boolean;
  Value?: null;
  additional_constraints?: string;
  data_type?: string;
  field_name?: string;
  Name?: string;
  [key: string]: any;
}


interface TableColumns {
  [columnName: string]: TableColumn;
}

interface TableSchema {
  [tableName: string]: TableColumns;
}

export const postgresQuery: RequestHandler = async (_req: Request, res: Response, next: NextFunction) => {

  try {
      await PostgresDataSource.initialize();
        console.log('Data Source has been initialized');
        const tables = await PostgresDataSource.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
        const data: TableColumns = {};
        const schema = [];

        //DATA FOR FOREIGN KEY INFORMATION 
        const foreignKeyQuery = `
        SELECT 
        kcu.table_schema || '.' || kcu.table_name AS table_with_foreign_key, 
        kcu.column_name AS foreign_key_column, 
        rel_tco.table_schema || '.' || rel_tco.table_name AS referenced_table, 
        rco.update_rule, 
        rco.delete_rule,
        rel_kcu.column_name AS referenced_column,
        tco.constraint_name AS constraint_name
      FROM 
        information_schema.table_constraints tco 
        JOIN information_schema.key_column_usage kcu ON tco.constraint_name = kcu.constraint_name 
        JOIN information_schema.referential_constraints rco ON tco.constraint_name = rco.constraint_name 
        JOIN information_schema.table_constraints rel_tco ON rco.unique_constraint_name = rel_tco.constraint_name 
        JOIN information_schema.key_column_usage rel_kcu ON rel_tco.constraint_name = rel_kcu.constraint_name
                                                          AND kcu.ordinal_position = rel_kcu.ordinal_position
      WHERE 
        tco.constraint_type = 'FOREIGN KEY';
            `
        const foreignKeys = await PostgresDataSource.query(foreignKeyQuery);
    //console.log('foreignKeyQuery: ', foreignKeyQuery)
        // LOOP
      for (const table of tables) {
        // DATA
        // loop through the different tables, query all the information, push it on to the data array
        let tableName = table.tablename;
        const tableData = await PostgresDataSource.query(`SELECT * FROM ${tableName}`);
        data[tableName] = tableData

        // SCHEMAS
        // Have to pull from different innate sources like information_schema and join them together
        const info = await PostgresDataSource.query(`
          SELECT 
            c.column_name, 
            c.data_type, 
            c.character_maximum_length,
            c.is_nullable,
            c.column_default,
            CASE WHEN c.column_default LIKE 'nextval%' THEN 'YES' ELSE 'NO' END as is_autoincrement,
            CASE WHEN c.column_default IS NOT NULL THEN 'DEFAULT' ELSE '' END ||
                CASE WHEN c.is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
                CASE WHEN tc.constraint_type = 'PRIMARY KEY' THEN ' PRIMARY KEY' ELSE '' END ||
                CASE WHEN tc.constraint_type = 'FOREIGN KEY' THEN ' FOREIGN KEY REFERENCES ' || 
                    ccu.table_name || '(' || ccu.column_name || ')' ELSE '' END
                as additional_constraints
          FROM 
            information_schema.columns c
            LEFT OUTER JOIN information_schema.key_column_usage kcu
              ON c.table_catalog = kcu.table_catalog
              AND c.table_schema = kcu.table_schema
              AND c.table_name = kcu.table_name
              AND c.column_name = kcu.column_name
            LEFT OUTER JOIN information_schema.table_constraints tc
              ON kcu.constraint_catalog = tc.constraint_catalog
              AND kcu.constraint_schema = tc.constraint_schema
              AND kcu.constraint_name = tc.constraint_name
            LEFT OUTER JOIN information_schema.constraint_column_usage ccu
              ON tc.constraint_catalog = ccu.constraint_catalog
              AND tc.constraint_schema = ccu.constraint_schema
              AND tc.constraint_name = ccu.constraint_name
          WHERE 
            c.table_name = '${tableName}'
          ORDER BY 
            c.ordinal_position;
          `);
        //push info on to the schema array each loop
          schema.push(info)
        };

      // CONSTRUCTION OF A OBJECT THAT CONFORMS TO WHAT THE FRONT END USUALLY GETS
      // WHY DID I THINK RECONSTRUCTING THE BACKEND WAS A GOOD IDEA?
      // IT'LL BE SIMPLER I SAID, MUCH EASIER I SAID. PAST ME IS A FOOL!

      const publicTableName: any = {};

      schema.forEach((tableColumns, index) => {
        const tableName = tables[index].tablename;
        const tableObject: any = {};
      
        tableColumns.forEach((column: any) => {
          const columnName = column.column_name;
          const dataType = column.data_type;
      
          const columnObject: any = {
            IsForeignKey: false,
            IsPrimaryKey: columnName === 'id',
            Name: columnName,
            References: [],
            TableName: `public.${tableName}`,
            Value: null,
            data_type: dataType,
            field_name: columnName,
          };

          if (column.additional_constraints) {
            columnObject.additional_constraints = column.additional_constraints;
          }
      
          // check if the current column is a foreign key column
          const foreignKey = foreignKeys.find(
            (fk: any) =>
              fk.table_with_foreign_key === `public.${tableName}` &&
              fk.foreign_key_column === columnName
          );

          //console.log('foreignKey: ', foreignKey)




          if (foreignKey) {
            const references: any = {
              length: 0,
            };
            references[references.length] = {
              idDestination: false,
              PrimaryKeyName: foreignKey.foreign_key_column,
              PrimaryKeyTableName: foreignKey.table_with_foreign_key,
              ReferencesPropertyName: foreignKey.referenced_column,
              ReferencesTableName: foreignKey.referenced_table,
              constraintName: foreignKey.constraint_name
            };
            references.length += 1;

            columnObject.IsForeignKey = true;
            columnObject.References = foreignKey ? [references] : [];

            //console.log('columnObject.References: ', columnObject.References)
          }
      
          tableObject[columnName] = columnObject;
        });
      
        publicTableName[`public.${tableName}`] = tableObject;
      });
      
      //console.log('schema: ', publicTableName)
      //console.log('data: ', data)

      res.locals.schema = publicTableName;
      res.locals.data = data;
      return next();

  } catch (err) {
    console.log('Error during Data Source: ', err);
  }
}

//postgresQuery();
//----------------------------------------------------------------------------
//Previous schema query
// SELECT column_name, data_type
// FROM information_schema.columns
// WHERE table_name = '${tableName}'

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
