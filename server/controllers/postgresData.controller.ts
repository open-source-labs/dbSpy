import { Request, Response, NextFunction } from 'express';
import { TableColumns, TableColumn, TableSchema, RefObj } from '@/Types';
import { postgresSchemaQuery, postgresForeignKeyQuery } from './queries/postgres.queries';
import {
  dbConnect,
  addNewDbRow,
  updateRow,
  deleteRow,
  addNewDbColumn,
  updateDbColumn,
  deleteColumn,
  addNewTable,
  getTableNames,
  deleteTable,
  addForeignKey,
  removeForeignKey,
} from './helperFunctions/universal.helpers';
import { resourceLimits } from 'worker_threads';
import pool from './../models/userModel';
import dotenv from 'dotenv';

dotenv.config();

// Object containing all of the middleware
const postgresController = {
  //----------Function to collect all schema and data from database-----------------------------------------------------------------
  postgresQuery: async (req: Request, res: Response, next: NextFunction) => {
    const PostgresDataSource = await dbConnect(req);
    console.log('postgresQuery REQ: ', req);
    console.log('MADE IT TO postgresQuery MIDDLEWARE');

    /*
     * Used for storing Primary Key table and column names that are
     *  part of Foreign Keys to adjust IsDestination to be true.
     */
    const foreignKeyReferenced: RefObj[] = [];

    //--------HELPER FUNCTION 1-----------------------------------
    // function to query and get all information needed for foreign keys
    async function getForeignKeys(): Promise<TableColumn[]> {
      return await PostgresDataSource.query(postgresForeignKeyQuery);
    }

    //--------HELPER FUNCTION 2-----------------------------------
    // function organizing data from queries in to the desired format of the front end
    async function postgresFormatTableSchema(
      postgresSchemaData: TableColumn[],
      tableName: string
    ): Promise<TableColumn> {
      const tableSchema: TableColumn = {};

      for (const column of postgresSchemaData) {
        const columnName: string = column.column_name;
        const keyString: string | null | undefined = column.additional_constraints;

        //query for the foreign key data
        const foreignKeys: TableColumn[] = await getForeignKeys();
        const foreignKey = foreignKeys.find(
          (fk: TableColumn) => fk.foreign_key_column === columnName
        );

        //Creating the format for the Reference property if there is a foreign key

        const references: RefObj[] = [];
        if (foreignKey) {
          foreignKeyReferenced.push({
            IsDestination: true,
            PrimaryKeyName: foreignKey.primary_key_column,
            PrimaryKeyTableName: foreignKey.primary_key_table,
            ReferencesPropertyName: foreignKey.foreign_key_column,
            ReferencesTableName: 'public.' + tableName,
            constraintName: foreignKey.constraint_name,
          });
          references.push({
            IsDestination: false,
            PrimaryKeyName: foreignKey.primary_key_column,
            PrimaryKeyTableName: foreignKey.primary_key_table,
            ReferencesPropertyName: foreignKey.foreign_key_column,
            ReferencesTableName: 'public.' + tableName,
            constraintName: foreignKey.constraint_name,
          });
        }
        // console.log('references: ', references)

        const additionalConstraints: string | null = keyString!.includes('NOT NULL')
          ? 'NOT NULL'
          : null;
        const hasIdentity: string | null =
          column.has_identity === true ? ' HAS_IDENTITY' : '';

        tableSchema[columnName] = {
          IsForeignKey: keyString!.includes('FOREIGN KEY'),
          IsPrimaryKey: keyString!.includes('PRIMARY KEY'),
          Name: columnName,
          References: references,
          TableName: 'public.' + tableName,
          Value: null,
          additional_constraints:
            additionalConstraints + hasIdentity === 'null'
              ? null
              : additionalConstraints + hasIdentity,
          data_type: column.data_type,
          default_type: column.default_type,
          field_name: columnName,
        };
      }
      return tableSchema;
    }
    //--------HELPER FUNCTIONS END-----------------------------------

    try {
      // Query to retrieve all table names
      const tables = await PostgresDataSource.query(
        "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'"
      );
      //Declare storage objects with their related interfaces

      const tableData: TableColumns = {};
      const schema: TableSchema = {};

      // LOOP
      for (const table of tables) {
        // DATA Create property on tableData object with every loop
        const tableName = table.tablename;
        const tableDataQuery: { [key: string]: [] | {}[] } =
          await PostgresDataSource.query(`SELECT * FROM ${'public.' + tableName}`);
        tableData['public.' + tableName] = tableDataQuery;

        // SCHEMAS Create property on schema object with every loop
        const postgresSchemaData: TableColumn[] = await PostgresDataSource.query(
          postgresSchemaQuery.replace('tableName', tableName)
        );
        schema['public.' + tableName] = await postgresFormatTableSchema(
          postgresSchemaData,
          tableName
        );
      }

      // Changing the isDestination value for the Foreign Keys
      if (foreignKeyReferenced.length !== 0) {
        for (const element of foreignKeyReferenced) {
          schema[element.PrimaryKeyTableName][element.PrimaryKeyName].References!.push(
            element
          );
        }
      }

      // Console.logs to check what the data looks like
      // console.log('table data: ', tableData)
      // console.log('schema data: ', schema)

      // Storage of queried results into res.locals
      res.locals.schema = schema;
      res.locals.data = tableData;
      // res.locals.database_link = req.query.database_link;
      // res.locals.db_connection = PostgresDataSource;

      // Disconnecting after data has been received
      PostgresDataSource.destroy();
      console.log('Database has been disconnected');
      return next();
    } catch (err: unknown) {
      console.log('Error during Data Source: ', err);
      PostgresDataSource.destroy();
      console.log('Database has been disconnected');
      return next(err);
    }
  },

  //----------Function to gather query metrics from database-----------------------------------------------------------------
  postgresGetMetrics: async (req: Request, res: Response, next: NextFunction) => {
    const PostgresGetMetrics = await dbConnect(req);
    console.log('REACHED postgresGetMetrics MIDDLEWARE');
    console.log('REQ QUERY: ', req.query);

    // destructuing the below 2 fields to store to the queries table in mysql db
    const { queryString, queryName, hostname, database_name } = req.query;
    console.log('❓ QUERY FROM FE IS: ', queryString);
    console.log('hostname:', hostname);
    console.log('database_name', database_name);

    // Query string (EXPLAIN) to access performance data
    const testQuery = `EXPLAIN (FORMAT JSON, ANALYZE, VERBOSE, BUFFERS) ${queryString};`;
    // view result of Explain query
    const result = await PostgresGetMetrics.query(testQuery);
    // console.log('🌟 result of testing: ', result);
    console.log('⭐️QUERY PLAN RESULT: ', result[0]['QUERY PLAN']);

    //pull exec time alone for the mysql update when storing queries
    const exec_time = result[0]['QUERY PLAN'][0]['Execution Time'];
    console.log('exec_time:', exec_time);

    // Pull Execution time only
    const executionTime = `Execution Time: ${result[0]['QUERY PLAN'][0]['Execution Time']}ms`;
    const namedQuery = `Query Name: ${queryName}`;
    const queryStr = `Query: ${queryString}`;
    // console.log('⏰ EXECUTION TIME METRIC', executionTime);

    // Create date metric to add to response
    const now = new Date();
    const options: any = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // hour: 'numeric',
      // minute: 'numeric',
      // second: 'numeric',
      // hour12: true, // Use 12-hour time format
      timeZone: 'America/New_York', // Set to US Eastern Time
    };
    const formattedDate = `Date Run: ${now.toLocaleString('en-US', options)}`;
    //console.log(`🗓️ TODAY'S DATE`, formattedDate);

    // console.log('done w getMetrics controller');

    /************* mysql querymetrics db insert for saved query page retrieval ******/
    // creating insert query for mysql query metrics db
    //Todo: figure out how to get the email from the session, if an user logs in and then tests query performance
    //const email = 'https://api.github.com/users/reva2024';
    //const db_link = 'postgresql://postgres.gcfszuopjvbjtllgmenw:store2025@aws-0-us-east-1.pooler.supabase.com:6543/postgres';
    //const db_name = 'dbSpy';

    // Send query string, date, and execution time on response
    res.locals.metrics = [namedQuery, queryStr, formattedDate, executionTime];

    return next();
  },

  //----------Function to save query metrics after running query-----------------------------------------------------------------
  postgresSaveQuery: async (req: Request, res: Response, next: NextFunction) => {
    const PostgresSaveMetrics = await dbConnect(req);
    console.log('REACHED postgresSaveMetrics MIDDLEWARE');
    console.log('REQ BODY: ', req.body.params);

    const { query_date, exec_time } = req.body.params.extractedQueryRes;
    const { queryString, queryName, hostname, database_name } = req.body.params.dbValues;

    // converting date to DATE format (YYYY-MM-DD) for MySQL to insert into queries table
    const date = new Date(query_date);
    const formatDateForMySql = date.toISOString().split('T')[0];
    console.log('formatted date: ', formatDateForMySql);

    const insertQueryStr = `INSERT INTO queries (query, db_link, exec_time, db_name, query_date, name) VALUES(?,?,?,?,?,?)`;

    //connect to mysql pool imorted from userModel and send the query to update table
    const savingQuery = await pool.query(insertQueryStr, [
      queryString,
      hostname,
      exec_time,
      database_name,
      formatDateForMySql,
      queryName,
    ]);

    console.log('savingQuery completed!');

    res.locals.savedQuery = [
      queryString,
      hostname,
      exec_time,
      database_name,
      formatDateForMySql,
      queryName,
    ];
    return next();
  },

  //-------------------------------------DATA TABLE ROWS-------------------------------------------------
  //-------------------ADD NEW ROW-----------------------------------------------------------
  postgresAddNewRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbRow(req, res, next);
      console.log('postgresAddNewRow function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the postgresAddNewRow middleware: ', err);
      return next(err);
    }
  },

  //-----------------UPDATE ROW--------------------------------------------------------------
  postgresUpdateRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      updateRow(req, res, next);
      //console.log("postgresUpdateRow function has concluded");
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresUpdateRow middleware: ', err);
      return next(err);
    }
  },

  //----------------DELETE ROW---------------------------------------------------------------
  postgresDeleteRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      deleteRow(req, res, next);
      //console.log("postgresDeleteRow function has concluded");
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresDeleteRow middleware: ', err);
      return next(err);
    }
  },

  //-------------------------------------SCHEMA TABLE COLUMNS------------------------------------------
  //----------------ADD NEW COLUMN----------------------------------------------------------
  postgresAddNewColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbColumn(req, res, next);
      //console.log("postgresAddNewColumn function has concluded");
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresAddNewColumn middleware: ', err);
      return next(err);
    }
  },

  //-----------------UPDATE COLUMN--------------------------------------------------------
  postgresUpdateColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      updateDbColumn(req, res, next);
      //console.log("postgresUpdateColumn function has concluded");
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresUpdateColumn middleware: ', err);
      return next(err);
    }
  },

  //-------------DELETE COLUMN------------------------------------------------------------
  postgresDeleteColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      deleteColumn(req, res, next);
      console.log('postgresDeleteColumn function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the postgresDeleteColumn middleware: ', err);
      return next(err);
    }
  },

  //---------------------------DATABASE TABLES--------------------------------------------------------
  //--------------ADD NEW TABLE-----------------------------------------------------------
  postgresAddNewTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(addNewTable(req, res, next));
      console.log('postgresAddNewTable function has concluded');
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresAddNewTable middleware: ', err);
      return next(err);
    }
  },
  //--------------GET ALL TABLE NAMES-------------------------------------------------------------------
  postgresGetTableNames: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tableNameList = await Promise.resolve(getTableNames(req, res, next));
      //console.log("postgresGetTableNames function has concluded");
      res.locals.tableNames = tableNameList;
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresDeleteTable middleware: ', err);
      return next(err);
    }
  },

  //--------------DELETE TABLE------------------------------------------------------------
  postgresDeleteTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(deleteTable(req, res, next));
      console.log('postgresDeleteTable function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the postgresDeleteTable middleware: ', err);
      return next(err);
    }
  },

  //------------------------------------------FOREIGN KEYS---------------------------------------------
  //--------------ADD NEW FOREIGN KEY-----------------------------------------------------
  postgresAddForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addForeignKey(req, res, next);
      //console.log("postgresAddForeignKey function has concluded");
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresAddForeignKey middleware: ', err);
      return next(err);
    }
  },

  //----------------REMOVE FOREIGN KEY-----------------------------------------------------------------
  postgresRemoveForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    try {
      removeForeignKey(req, res, next);
      //console.log("postgresRemoveForeignKey function has concluded");
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresRemoveForeignKey middleware: ', err);
      return next(err);
    }
  },

  //---------------------------------------------------------------------------------------------------
};

export default postgresController;
