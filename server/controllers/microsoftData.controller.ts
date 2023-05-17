import { Request, Response, NextFunction } from 'express';
import { TableColumns, TableColumn, TableSchema } from '@/Types';
import { microsoftSchemaQuery, microsoftForeignKeyQuery } from './queries/microsoft.queries';
import { dbConnect, addNewDbRow, updateRow, deleteRow, addNewDbColumn, updateDbColumn, deleteColumn, addNewTable, deleteTable, addForeignKey, removeForeignKey, getTableNames } from './helperFunctions/universal.helpers'

//Object containing all of the middleware
const microsoftController = {
//----------Function to collect all schema and data from database-----------------------------------------------------------------
  microsoftQuery: async (req: Request, res: Response, next: NextFunction) => {
    //Create Connection with database
    const MicrosoftDataSource = await dbConnect(req);
    
//--------HELPER FUNCTION-----------------------------------
    //function organizing data from queries in to the desired format of the front end
    async function microsoftFormatTableSchema(microsoftSchemaData: TableColumn[], tableName: string): Promise<TableColumns> {
      const tableSchema: TableColumn = {};

      for (const column of microsoftSchemaData) {
          const columnName: string = column.COLUMN_NAME;

          //query for the foreign key data
          const foreignKeys: any = await MicrosoftDataSource.query(microsoftForeignKeyQuery);
          const foreignKey = foreignKeys.find((fk: any) => fk.column_name === columnName);

          //Creating the format for the Reference property if there is a foreign key
          const references: {[key: string]: string | boolean}[] = []
          if (foreignKey){
            references.push({
              // These got a little mixed up but are in the right place
              isDestination: false,
              PrimaryKeyName: foreignKey.referenced_column_name,
              PrimaryKeyTableName: 'public.' + foreignKey.referenced_table_name,
              ReferencesPropertyName: foreignKey.column_name,
              ReferencesTableName: 'public.' + tableName,
              constraintName: foreignKey.constraint_name,
            });
          };

          //Formation of the schema data
          tableSchema[columnName] = {
            IsForeignKey: foreignKey ? true : false,
            IsPrimaryKey: column.IS_PRIMARY_KEY === 'YES' ? true : false,
            Name: column.COLUMN_NAME,
            References: references,
            TableName: 'public.' + tableName,
            Value: null,
            additional_constraints: column.IS_NULLABLE === 'NO' ? 'NOT NULL' : null ,
            data_type: `${column.DATA_TYPE.toUpperCase()}` + `${column.DATA_TYPE === 'varchar' ? `(${column.CHARACTER_MAXIMUM_LENGTH})` : ''}`,
            default_type: column.IS_IDENTITY === 1 ? 'identity' : null,
            field_name: columnName,
          };
        };
      return tableSchema;
    };
//--------HELPER FUNCTION END-----------------------------------

    try{
      // Query to retrieve all table names
      const tables: [{TABLE_NAME: string}] = await MicrosoftDataSource.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES`);
      // Declare constants to store results we get back from queries
      const tableData: TableColumns = {};
      const schema: TableSchema = {};

      // LOOP
      for (const table of tables) {
        // DATA Create property on tableData object with every loop
        const tableName: string = table.TABLE_NAME;
        console.log('tableName: ', tableName)
        const tableDataQuery = await MicrosoftDataSource.query(`SELECT * FROM ${tableName}`);
        tableData[tableName] = tableDataQuery;

        // SCHEMA Create property on schema object with every loop
        const microsoftSchemaData = await MicrosoftDataSource.query(microsoftSchemaQuery.replace('tableName', tableName));
        schema['public.' + tableName] = await microsoftFormatTableSchema(microsoftSchemaData, tableName);
      }

      // Console.logs to check what the data looks like
      // console.log('table data: ', tableData);
      // console.log('schema data: ', schema);

      // Storage of queried results into res.locals
      res.locals.schema = schema;
      res.locals.data = tableData;

      // Disconnecting after data has been received 
      MicrosoftDataSource.destroy();
      console.log('Database has been disconnected');
      return next();

    } catch(err: unknown) {
        console.log('Error during Data Source: ', err);
        MicrosoftDataSource.destroy();
        console.log('Database has been disconnected');
        return next(err);
    };
  },

//-------------------------------------DATA TABLE ROWS-------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------
  microsoftAddNewRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbRow(req, res, next)
      console.log("microsoftAddNewRow function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftAddNewRow middleware: ', err);
      return next(err);
    };
  },

//-----------------UPDATE ROW--------------------------------------------------------------
  microsoftUpdateRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      updateRow(req, res, next);
      console.log("microsoftUpdateRow function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftUpdateRow middleware: ', err);
      return next(err);
    };
  },

//----------------DELETE ROW---------------------------------------------------------------
  microsoftDeleteRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      deleteRow(req, res, next);
      console.log("microsoftDeleteRow function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftDeleteRow middleware: ', err);
      return next(err);
    };
  },

//-------------------------------------SCHEMA TABLE COLUMNS------------------------------------------
//----------------ADD NEW COLUMN----------------------------------------------------------
  microsoftAddNewColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbColumn(req, res, next);
      console.log("microsoftAddNewColumn function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftAddNewColumn middleware: ', err);
      return next(err);
    };
  },

//-----------------UPDATE COLUMN--------------------------------------------------------
  microsoftUpdateColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      updateDbColumn(req, res, next);
      console.log("microsoftUpdateColumn function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftUpdateColumn middleware: ', err);
      return next(err);
    };
  },

//-------------DELETE COLUMN------------------------------------------------------------
  microsoftDeleteColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(deleteColumn(req, res, next));
      console.log("microsoftDeleteColumn function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftDeleteColumn middleware: ', err);
      return next(err);
    };
  },

//---------------------------DATABASE TABLES--------------------------------------------------------
//--------------ADD NEW TABLE-----------------------------------------------------------
  microsoftAddNewTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(addNewTable(req, res, next));
      console.log("microsoftAddNewTable function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftAddNewTable middleware: ', err);
      return next(err);
    };
  },

//--------------GET ALL TABLE NAMES-------------------------------------------------------------------
  microsoftGetTableNames: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tableNameList = await Promise.resolve(getTableNames(req, res, next));
      console.log("microsoftGetTableNames function has concluded");
      res.locals.tableNames = tableNameList;
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftDeleteTable middleware: ', err);
      return next(err);
    };
  },

//--------------DELETE TABLE------------------------------------------------------------
  microsoftDeleteTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(deleteTable(req, res, next));
      console.log("microsoftDeleteTable function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftDeleteTable middleware: ', err);
      return next(err);
    };
  },

//------------------------------------------FOREIGN KEYS---------------------------------------------
//--------------ADD NEW FOREIGN KEY-----------------------------------------------------
  microsoftAddForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addForeignKey(req, res, next);
      console.log("microsoftAddForeignKey function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftAddForeignKey middleware: ', err);
      return next(err);
    };
  },

//----------------REMOVE FOREIGN KEY-----------------------------------------------------------------
  microsoftRemoveForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    try {
      removeForeignKey(req, res, next);
      console.log("microsoftRemoveForeignKey function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the microsoftRemoveForeignKey middleware: ', err);
      return next(err);
    };
  },

//---------------------------------------------------------------------------------------------------

};

export default microsoftController;