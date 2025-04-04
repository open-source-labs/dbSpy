import { Request, Response, NextFunction } from 'express';
import { TableColumns, TableColumn, TableSchema, RefObj } from '@/Types';
import { mysqlForeignKeyQuery } from './queries/mysql.queries';
import {
  dbConnect,
  addNewDbRow,
  updateRow,
  deleteRow,
  addNewDbColumn,
  updateDbColumn,
  deleteColumn,
  addNewTable,
  deleteTable,
  addForeignKey,
  removeForeignKey,
  getTableNames,
} from './helperFunctions/universal.helpers';
import { exec } from 'child_process';
import pool from './../models/userModel';

// Object containing all of the middleware
const mysqlController = {
  //----------Function to collect all schema and data from database-----------------------------------------------------------------
  mysqlQuery: async (req: Request, res: Response, next: NextFunction) => {
    const MysqlDataSource = await dbConnect(req);

    /*
     * Used for storing Primary Key table and column names that are
     *  part of Foreign Keys to adjust IsDestination to be true.
     */
    const foreignKeyReferenced: RefObj[] = [];

    //--------HELPER FUNCTION 1-----------------------------------
    // function to query and get all information needed for foreign keys
    async function getForeignKeys(columnName: string, tableName: string): Promise<any[]> {
      return await MysqlDataSource.query(
        mysqlForeignKeyQuery
          .replace('columnName', columnName)
          .replace('tableName', tableName)
      );
    }

    //--------HELPER FUNCTION 2-----------------------------------
    // function organizing data from queries in to the desired format of the front end
    async function mysqlFormatTableSchema(
      mysqlSchemaData: TableColumn[],
      tableName: string
    ): Promise<TableColumn> {
      const tableSchema: TableColumn = {};
      for (const column of mysqlSchemaData) {
        const columnName: string | undefined = column.Field;
        const keyString: string | undefined = column.Key;

        const defaultTypes = await MysqlDataSource.query(`
          SELECT 
            EXTRA, 
            COLUMN_DEFAULT
          FROM 
            INFORMATION_SCHEMA.COLUMNS
          WHERE 
            TABLE_SCHEMA = '${MysqlDataSource.options.database}'
            AND TABLE_NAME = '${tableName}'
            AND COLUMN_NAME = '${columnName}'
        `);

        //query for the foreign key data
        const foreignKeys: TableColumn[] = await getForeignKeys(columnName!, tableName);
        const foreignKey = foreignKeys.find(
          (fk: TableColumn) => fk.COLUMN_NAME === columnName
        );

        //Creating the format for the Reference property if there is a foreign key
        const references: { [key: string]: string | boolean }[] = [];
        if (foreignKey) {
          foreignKeyReferenced.push({
            IsDestination: true,
            PrimaryKeyName: foreignKey.PRIMARY_KEY_COLUMN,
            PrimaryKeyTableName: `${MysqlDataSource.options.database}.${foreignKey.PRIMARY_KEY_TABLE}`,
            ReferencesPropertyName: foreignKey.COLUMN_NAME,
            ReferencesTableName: `${MysqlDataSource.options.database}.${tableName}`,
            constraintName: foreignKey.CONSTRAINT_NAME,
          });
          references.push({
            IsDestination: false,
            PrimaryKeyName: foreignKey.PRIMARY_KEY_COLUMN,
            PrimaryKeyTableName: `${MysqlDataSource.options.database}.${foreignKey.PRIMARY_KEY_TABLE}`,
            ReferencesPropertyName: foreignKey.COLUMN_NAME,
            ReferencesTableName: `${MysqlDataSource.options.database}.${tableName}`,
            constraintName: foreignKey.CONSTRAINT_NAME,
          });
        }

        //Formation of the schema data
        tableSchema[columnName!] = {
          IsForeignKey: keyString!.includes('MUL'),
          IsPrimaryKey: keyString!.includes('PRI'),
          Name: column.Field,
          References: references,
          TableName: `${MysqlDataSource.options.database}.${tableName}`,
          Value: null,
          additional_constraints: column.Null === 'NO' ? 'NOT NULL' : null,
          data_type: column.Type,
          default_type: defaultTypes[0].EXTRA === '' ? null : defaultTypes[0].EXTRA,
          field_name: column.Field,
        };
      }
      return tableSchema;
    }
    //--------HELPER FUNCTIONS END-----------------------------------

    try {
      // Query to retrieve all table names
      const tables: any[] = await MysqlDataSource.query(`SHOW TABLES`);
      //Declare constants to store results we get back from queries
      const data: TableColumns = {};
      const schema: TableSchema = {};

      //LOOP
      for (const table of tables) {
        const tableName: string = table[`Tables_in_${MysqlDataSource.options.database}`];

        // DATA Create property on tableData object with every loop
        const tableData: { [key: string]: [] | {}[] } = await MysqlDataSource.query(
          `SELECT * FROM ${tableName}`
        );
        data[`${MysqlDataSource.options.database}.${tableName}`] = tableData;

        // SCHEMA Create property on tableData object with every loop
        const mysqlSchemaData: TableColumn[] = await MysqlDataSource.query(
          `DESCRIBE ${MysqlDataSource.options.database}.${tableName}`
        );
        schema[`${MysqlDataSource.options.database}.${tableName}`] =
          await mysqlFormatTableSchema(mysqlSchemaData, tableName);
      }

      // Changing the isDestination value for the Foreign Keys
      if (foreignKeyReferenced.length !== 0) {
        console.log('foreignKeyReferenced: ', foreignKeyReferenced);
        for (const element of foreignKeyReferenced) {
          console.log('schema data: ', schema);
          console.log(
            'schema[element.PrimaryKeyTableName][element.PrimaryKeyName]: ',
            schema[element.PrimaryKeyTableName][element.PrimaryKeyName]
          );
          schema[element.PrimaryKeyTableName][element.PrimaryKeyName].References!.push(
            element
          );
        }
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
      console.log('Error during Data Source: ', err);
      MysqlDataSource.destroy();
      console.log('Database has been disconnected');
      return next(err);
    }
  },

  //----------Function to gather query metrics from database-----------------------------------------------------------------
  mysqlGetMetrics: async (req: Request, res: Response, next: NextFunction) => {
    // grab queryString from FE
    console.log('REACHED mysqlGetMetrics MIDDLEWARE');
    console.log('REQ QUERY: ', req.query);
    const { queryString, queryName }: { queryString?: string; queryName?: string } =
      req.query;
    console.log('❓ QUERY FROM FE IS: ', queryString);

    // Declare helper function to run EXPLAIN ANALYZE query and pull execution time
    const measureExecutionTime = async (query: string): Promise<string | void> => {
      // Step 1: Connect to MySQL
      const mysqlGetMetrics = await dbConnect(req);

      try {
        // Step 2: Run EXPLAIN ANALYZE Query
        const [rows] = await mysqlGetMetrics.query(`EXPLAIN ANALYZE ${queryString}`);
        const row = rows['EXPLAIN'];
        console.log('🌟 Rows returned by EXPLAIN ANALYZE:', row);

        // Step 3: Parse the output for actual times
        let totalExecutionTime = 0;

        // Regex to extract actual time values from the EXPLAIN ANALYZE output
        const times = row.match(/actual time=(\d+\.\d+)\.\.(\d+\.\d+)/);
        // console.log('🌟 RESULT OF TIMES', times);

        if (times) {
          // Extract the start and end times (in milliseconds)
          const startTime = parseFloat(times[1]);
          const endTime = parseFloat(times[2]);

          // Calculate the execution time for this step
          const executionTime = endTime - startTime;
          totalExecutionTime += executionTime; // Add to total execution time
        }

        // Step 4: Log the total execution time
        // console.log(`Total Execution Time: ${totalExecutionTime.toFixed(6)} ms`);
        // console log 3 decimals for return to front end
        const executionTime = totalExecutionTime.toFixed(3);
        // console.log(`🌟 Total Execution Time: ${executionTime}`);
        return executionTime;
      } catch (error) {
        console.error('Error executing query:', error);
        // Throw the error to propagate it to the middleware
        throw new Error(`Invalid query or execution error: ${error}`);
      } finally {
        // Step 5: Close the database connection
        await mysqlGetMetrics.destroy();
      }
    };

    try {
      // call helper function to get Execution Time
      const totalExecutionTime = await measureExecutionTime(queryString!);
      console.log('⏰ TOTAL EXECUTION TIME', totalExecutionTime);

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

      // format data with correct strings to pass to FE
      const formattedDate = `Date Run: ${now.toLocaleString('en-US', options)}`;
      const executionTimeFE = `Execution Time: ${totalExecutionTime}ms`;
      const queryStr = `Query: ${queryString}`;
      const queryNme = `Name: ${queryName}`;

      // Send name of query, query string, date, and execution time in response
      res.locals.metrics = [queryNme, queryStr, formattedDate, executionTimeFE];

      return next();
    } catch (error) {
      console.error('Error during query execution: ', error);

      // Send an error response to the client
      res.status(400).json({ error: 'Query execution failed: ', message: error });
    }
  },

  //----------Function to save query metrics from database-----------------------------------------------------------------
  mysqlSaveQuery: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // grab queryString from FE
      console.log('REACHED mysqlSaveQuery MIDDLEWARE');
      console.log('REQ QUERY: ', req.body.params);
      const { query_date, exec_time } = req.body.params.extractedQueryRes;
      const { queryString, queryName, hostname, database_name } =
        req.body.params.dbValues;

      const date = new Date(query_date);
      const formatDateForMySql = date.toISOString().split('T')[0];
      console.log('formatted date: ', formatDateForMySql);

      const insertQueryStr = `INSERT INTO queries (query, db_link, exec_time, db_name, query_date, name) VALUES(?,?,?,?,?,?)`;

      const [saveQuery]: any = await pool.query(insertQueryStr, [
        queryString,
        hostname,
        exec_time,
        database_name,
        formatDateForMySql,
        queryName,
      ]);

      // Check if insertion was successful
      // MySQL2 returns an array [result, fields]
      // result is of type ResultSetHeader for INSERT queries
      // affectedRows is a property of ResultSetHeader
      if (saveQuery.affectedRows > 0) {
        console.log('saveQuery completed!');
        res.locals.savedQuery = [
          queryString,
          hostname,
          exec_time,
          database_name,
          formatDateForMySql,
          queryName,
        ];
        return next();
      } else {
        throw new Error('Database insertion failed. No rows affected.');
      }
    } catch (error) {
      console.error('Error in mysqlSaveQuery: ', error);
      return res.status(500).json({ error: 'Failed to save query to database.' });
    }
  },

  //-------------------------------------DATA TABLE ROWS-------------------------------------------------
  //-------------------ADD NEW ROW-----------------------------------------------------------
  mysqlAddNewRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbRow(req, res, next);
      console.log('mysqlAddNewRow function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlAddNewRow middleware: ', err);
      return next(err);
    }
  },

  //-----------------UPDATE ROW--------------------------------------------------------------
  mysqlUpdateRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      updateRow(req, res, next);
      console.log('mysqlUpdateRow function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlUpdateRow middleware: ', err);
      return next(err);
    }
  },

  //----------------DELETE ROW---------------------------------------------------------------
  mysqlDeleteRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(deleteRow(req, res, next));
      console.log('mysqlDeleteRow function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlDeleteRow middleware: ', err);
      return next(err);
    }
  },

  //-------------------------------------SCHEMA TABLE COLUMNS------------------------------------------
  //----------------ADD NEW COLUMN----------------------------------------------------------
  mysqlAddNewColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbColumn(req, res, next);
      console.log('mysqlAddNewColumn function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlAddNewColumn middleware: ', err);
      return next(err);
    }
  },

  //-----------------UPDATE COLUMN--------------------------------------------------------
  mysqlUpdateColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      updateDbColumn(req, res, next);
      console.log('mysqlUpdateColumn function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlUpdateColumn middleware: ', err);
      return next(err);
    }
  },

  //-------------DELETE COLUMN------------------------------------------------------------
  mysqlDeleteColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      deleteColumn(req, res, next);
      console.log('mysqlDeleteColumn function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlDeleteColumn middleware: ', err);
      return next(err);
    }
  },

  //---------------------------DATABASE TABLES--------------------------------------------------------
  //--------------ADD NEW TABLE-----------------------------------------------------------
  mysqlAddNewTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewTable(req, res, next);
      console.log('mysqlAddNewTable function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlAddNewTable middleware: ', err);
      return next(err);
    }
  },

  //--------------GET ALL TABLE NAMES-------------------------------------------------------------------
  mysqlGetTableNames: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tableNameList = await Promise.resolve(getTableNames(req, res, next));
      console.log('mysqlGetTableNames function has concluded');
      res.locals.tableNames = tableNameList;
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlDeleteTable middleware: ', err);
      return next(err);
    }
  },

  //--------------DELETE TABLE------------------------------------------------------------
  mysqlDeleteTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(deleteTable(req, res, next));
      console.log('mysqlDeleteTable function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlDeleteTable middleware: ', err);
      return next(err);
    }
  },

  //------------------------------------------FOREIGN KEYS---------------------------------------------
  //--------------ADD NEW FOREIGN KEY-----------------------------------------------------
  mysqlAddForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addForeignKey(req, res, next);
      console.log('mysqlAddForeignKey function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlAddForeignKey middleware: ', err);
      return next(err);
    }
  },

  //----------------REMOVE FOREIGN KEY-----------------------------------------------------------------
  mysqlRemoveForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    try {
      removeForeignKey(req, res, next);
      console.log('mysqlRemoveForeignKey function has concluded');
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlRemoveForeignKey middleware: ', err);
      return next(err);
    }
  },

  //---------------------------------------------------------------------------------------------------
};
export default mysqlController;
