import { Request, Response, NextFunction } from 'express';
import { TableColumns, TableColumn, TableSchema, OracleSchema, RefObj } from '@/Types';
import { oracleSchemaQuery } from './queries/oracle.queries';
import { dbConnect, addNewDbRow, updateRow, deleteRow, addNewDbColumn, updateDbColumn, deleteColumn, addNewTable, deleteTable, addForeignKey, removeForeignKey, getTableNames } from './helperFunctions/universal.helpers'

// Object containing all of the middleware
const oracleController = {
//----------Function to collect all schema and data from database-----------------------------------------------------------------
  oracleQuery: async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.session
    const OracleDataSource = await dbConnect(req);

    /* 
    * Used for storing Primary Key table and column names that are
    *  part of Foreign Keys to adjust IsDestination to be true.
    */
    const foreignKeyReferenced: RefObj[] = [];

//--------HELPER FUNCTION-----------------------------------
    //function organizing data from queries in to the desired format of the front end
    async function oracleFormatTableSchema(oracleSchema: TableColumn[], tableName: string, user: string): Promise<TableColumn> {
      const tableSchema: TableColumn = {};
    
      for (const column of oracleSchema) {
        const columnName: string = column.COLUMN_NAME;
        const keyString: string = column.CONSTRAINT_TYPE;

        //Creating the format for the Reference property if there is a foreign key
        const references: {[key: string]: string | boolean}[] = [];
        if (column.CONSTRAINT_TYPE === 'R'){
          foreignKeyReferenced.push({
            isDestination: true,
            PrimaryKeyName: column.R_PRIMARY_KEY_COLUMN,
            PrimaryKeyTableName: `"${user}"."${column.R_PRIMARY_KEY_TABLE}"`,
            ReferencesPropertyName: column.COLUMN_NAME,
            ReferencesTableName: `"${user}"."${tableName}"`,
            constraintName: column.CONSTRAINT_NAME,
          });
          references.push({
            isDestination: false,
            PrimaryKeyName: column.R_PRIMARY_KEY_COLUMN,
            PrimaryKeyTableName: `"${user}"."${column.R_PRIMARY_KEY_TABLE}"`,
            ReferencesPropertyName: column.COLUMN_NAME,
            ReferencesTableName: `"${user}"."${tableName}"`,
            constraintName: column.CONSTRAINT_NAME,
          });
        };

        console.log('references: ', references)

        //Formation of the schema data
        tableSchema[columnName] = {
          IsForeignKey: keyString ? keyString.includes('R') ? true : false : false,
          IsPrimaryKey: keyString ? keyString.includes('P') ? true : false : false,
          Name: column.COLUMN_NAME,
          References: column.CONSTRAINT_TYPE === 'R' ? references : [],
          TableName: `"${user}"."${tableName}"`,
          Value: null,
          additional_constraints: column.IS_NULLABLE === 'N' ? 'NOT NULL' : null ,
          data_type: column.DATA_TYPE + `${column.DATA_TYPE.includes('VARCHAR2') ? `(${column.CHARACTER_MAXIMUM_LENGTH})` : ''}`,
          data_default: column.DATA_DEFAULT,
          field_name: column.COLUMN_NAME,
        };
      };
      
      return tableSchema;
    };
//--------HELPER FUNCTION END-----------------------------------

    try {
      
      const tables: [{TABLE_NAME: string}] = await OracleDataSource.query(`SELECT table_name FROM user_tables`);
      //Declare storage objects with their related interfaces
      const tableData: TableColumns = {};
      const schema: TableSchema = {};

      for (const table of tables) {
        const tableName: string = table.TABLE_NAME;
        const user = (username as string).toUpperCase();

        // DATA Create property on tableData object with every loop
        const tableDataQuery: {[key: string]: [] | {}[]} = await OracleDataSource.query(`SELECT * FROM "${user}"."${tableName}"`);
        tableData[`"${user}"."${tableName}"`] = tableDataQuery;
        // SCHEMA Create property on schema object with every loop
        const oracleSchema: OracleSchema[] = await OracleDataSource.query(oracleSchemaQuery.replace('user', user).replace('tableName', tableName));
        schema[`"${user}"."${tableName}"`] = await oracleFormatTableSchema(oracleSchema, tableName, user);
      };

      // Changing the isDestination value for the Foreign Keys
      if (foreignKeyReferenced.length !== 0) {
        for (const element of foreignKeyReferenced) {
          schema[element.PrimaryKeyTableName][element.PrimaryKeyName].References!.push(element)
        };
      };

      // Console.logs to check what the data looks like
      // console.log('table data: ', tableData);
      // console.log('schema data: ', schema);

      // Storage of queried results into res.locals
      res.locals.schema = schema;
      res.locals.data = tableData;
    
      // Disconnecting after data has been received 
      OracleDataSource.destroy();
      console.log('Disconnected from the database');
      return next();
    
    } catch(err) {
      console.log('Error during Data Source: ', err);
      OracleDataSource.destroy();
      console.log('Disconnected from the database');
      return next(err);
    };
  },

//-------------------------------------DATA TABLE ROWS-------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------
  oracleAddNewRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbRow(req, res, next);
      console.log("oracleAddNewRow function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleAddNewRow middleware: ', err);
      return next(err);
    };
  },

//-----------------UPDATE ROW--------------------------------------------------------------
  oracleUpdateRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      updateRow(req, res, next);
      console.log("oracleUpdateRow function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleUpdateRow middleware: ', err);
      return next(err);
    };
  },

//----------------DELETE ROW---------------------------------------------------------------
  oracleDeleteRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      deleteRow(req, res, next);
      console.log("oracleDeleteRow function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleDeleteRow middleware: ', err);
      return next(err);
    };
  },

//-------------------------------------SCHEMA TABLE COLUMNS------------------------------------------
//----------------ADD NEW COLUMN----------------------------------------------------------
  oracleAddNewColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbColumn(req, res, next);
      console.log("oracleAddNewColumn function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleAddNewColumn middleware: ', err);
      return next(err);
    };
  },

//-----------------UPDATE COLUMN--------------------------------------------------------
  oracleUpdateColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      updateDbColumn(req, res, next);
      console.log("oracleUpdateColumn function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleUpdateColumn middleware: ', err);
      return next(err);
    };
  },

//-------------DELETE COLUMN------------------------------------------------------------
  oracleDeleteColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      deleteColumn(req, res, next);
      console.log("oracleDeleteColumn function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleDeleteColumn middleware: ', err);
      return next(err);
    };
  },

//---------------------------DATABASE TABLES--------------------------------------------------------
//--------------ADD NEW TABLE-----------------------------------------------------------
  oracleAddNewTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(addNewTable(req, res, next));
      console.log("oracleAddNewTable function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleAddNewTable middleware: ', err);
      return next(err);
    };
  },

//--------------GET ALL TABLE NAMES-------------------------------------------------------------------
  oracleGetTableNames: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tableNameList = await Promise.resolve(getTableNames(req, res, next));
      console.log("oracleGetTableNames function has concluded");
      res.locals.tableNames = tableNameList;
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleDeleteTable middleware: ', err);
      return next(err);
    };
  },

//--------------DELETE TABLE------------------------------------------------------------
  oracleDeleteTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(deleteTable(req, res, next));
      console.log("oracleDeleteTable function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleDeleteTable middleware: ', err);
      return next(err);
    };
  },

//------------------------------------------FOREIGN KEYS---------------------------------------------
//--------------ADD NEW FOREIGN KEY-----------------------------------------------------
  oracleAddForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addForeignKey(req, res, next);
      console.log("oracleAddForeignKey function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleAddForeignKey middleware: ', err);
      return next(err);
    };
  },

//----------------REMOVE FOREIGN KEY-----------------------------------------------------------------
  oracleRemoveForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    try {
      removeForeignKey(req, res, next);
      console.log("oracleRemoveForeignKey function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the oracleRemoveForeignKey middleware: ', err);
      return next(err);
    };
  },

//---------------------------------------------------------------------------------------------------

};

export default oracleController;