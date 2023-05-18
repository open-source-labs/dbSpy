import { Request, Response, NextFunction } from 'express';
import { TableColumns, TableColumn, TableSchema } from '@/Types';
import { postgresSchemaQuery, postgresForeignKeyQuery } from './queries/postgres.queries';
import { dbConnect, addNewDbRow, updateRow, deleteRow, addNewDbColumn, updateDbColumn, deleteColumn, addNewTable, getTableNames, deleteTable, addForeignKey, removeForeignKey } from './helperFunctions/universal.helpers'
import { resourceLimits } from 'worker_threads';

// Object containing all of the middleware
const postgresController = {
//----------Function to collect all schema and data from database-----------------------------------------------------------------
  postgresQuery: async (req: Request, res: Response, next: NextFunction) => {
    const PostgresDataSource = await dbConnect(req);


//--------HELPER FUNCTION 1-----------------------------------
    // function to query and get all information needed for foreign keys
    async function getForeignKeys(): Promise<TableColumn[]> {
      return await PostgresDataSource.query(postgresForeignKeyQuery);
    };

//--------HELPER FUNCTION 2-----------------------------------
    // function organizing data from queries in to the desired format of the front end
    async function postgresFormatTableSchema(postgresSchemaData: TableColumn[], tableName: string): Promise<TableColumn> {
      const tableSchema: TableColumn = {};

      for (const column of postgresSchemaData) {
        const columnName: any = column.column_name;
        const keyString: any = column.additional_constraints;

        //query for the foreign key data
        const foreignKeys: any = await getForeignKeys();
        const foreignKey = await foreignKeys.find((fk: any) => fk.foreign_key_column === columnName);

        //Creating the format for the Reference property if there is a foreign key
        const references: {[key: string]: string | boolean}[] = [];
        if (foreignKey){
          references.push({
            // isDestination: false,
            // PrimaryKeyName: foreignKey.foreign_key_column,
            // PrimaryKeyTableName: 'public.' + tableName,
            // ReferencesPropertyName: foreignKey.referenced_column,
            // ReferencesTableName: foreignKey.referenced_table,
            // constraintName: foreignKey.constraint_name
            isDestination: false,
            PrimaryKeyName: foreignKey.referenced_column,
            PrimaryKeyTableName: foreignKey.referenced_table,
            ReferencesPropertyName: foreignKey.foreign_key_column,
            ReferencesTableName: 'public.' + tableName,
            constraintName: foreignKey.constraint_name

          });
        };

        //console.log('references: ', references)

        const additionalConstraints: string | null = keyString.includes('NOT NULL') ? 'NOT NULL'  : null;
        const hasIdentity: string | null = column.has_identity === true ? ' HAS_IDENTITY' : '';

        tableSchema[columnName] = {
          IsForeignKey: keyString.includes('FOREIGN KEY'),
          IsPrimaryKey: keyString.includes('PRIMARY KEY'),
          Name: columnName,
          References: references,
          TableName: 'public.' + tableName,
          Value: null,
          additional_constraints: additionalConstraints + hasIdentity === 'null' ? null : additionalConstraints + hasIdentity,
          data_type: column.data_type,
          default_type: column.default_type,
          field_name: columnName,
        };
      };
      return tableSchema;
    };
//--------HELPER FUNCTIONS END-----------------------------------

    try {
      // Query to retrieve all table names
      const tables = await PostgresDataSource.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\'');
      //Declare storage objects with their related interfaces
      const tableData: TableColumns = {};
      const schema: TableSchema = {};

      // LOOP
      for (const table of tables) {
        // DATA Create property on tableData object with every loop
        const tableName = table.tablename;
        const tableDataQuery = await PostgresDataSource.query(`SELECT * FROM ${tableName}`);
        tableData[tableName] = tableDataQuery;

        // SCHEMAS Create property on schema object with every loop
        const postgresSchemaData = await PostgresDataSource.query(postgresSchemaQuery.replace('tableName', tableName));
        schema['public.' + tableName] = await postgresFormatTableSchema(postgresSchemaData, tableName);
      };

      // Console.logs to check what the data looks like
      // console.log('table data: ', tableData)
      // console.log('schema data: ', schema)

      // Storage of queried results into res.locals
      res.locals.schema = schema;
      res.locals.data = tableData;

      // Disconnecting after data has been received
      PostgresDataSource.destroy();
      console.log('Database has been disconnected');
      return next();

    } catch (err: unknown) {
      console.log('Error during Data Source: ', err);
      PostgresDataSource.destroy();
      console.log('Database has been disconnected');
      return next(err);
    };
  },

//-------------------------------------DATA TABLE ROWS-------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------
  postgresAddNewRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbRow(req, res, next)
      //console.log("postgresAddNewRow function has concluded");
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresAddNewRow middleware: ', err);
      return next(err);
    };
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
    };
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
    };
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
    };
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
    };
  },

//-------------DELETE COLUMN------------------------------------------------------------
  postgresDeleteColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      deleteColumn(req, res, next);
      //console.log("postgresDeleteColumn function has concluded");
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresDeleteColumn middleware: ', err);
      return next(err);
    };
  },

//---------------------------DATABASE TABLES--------------------------------------------------------
//--------------ADD NEW TABLE-----------------------------------------------------------
  postgresAddNewTable: async (req: Request, res: Response, next: NextFunction) => {
    console.log('req body from postGresAddNewTable', req.body.newColumns)
    try {
      await Promise.resolve(addNewTable(req, res, next));
      console.log("postgresAddNewTable function has concluded");
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresAddNewTable middleware: ', err);
      return next(err);
    };
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
    };
  },

//--------------DELETE TABLE------------------------------------------------------------
  postgresDeleteTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(deleteTable(req, res, next));
      //console.log("postgresDeleteTable function has concluded");
      return next();
    } catch (err: unknown) {
      //console.log('Error occurred in the postgresDeleteTable middleware: ', err);
      return next(err);
    };
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
    };
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
    };
  },

//---------------------------------------------------------------------------------------------------
};

export default postgresController;