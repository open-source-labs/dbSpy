import { Request, Response, NextFunction } from 'express';
import { TableColumns, TableColumn, TableSchema } from '@/Types';
import { mysqlForeignKeyQuery } from './queries/mysql.queries';
import { dbConnect, addNewDbRow, updateRow, deleteRow, addNewDbColumn, updateDbColumn, deleteColumn, addNewTable, deleteTable, addForeignKey, removeForeignKey, getTableNames } from './helperFunctions/universal.helpers'

// Object containing all of the middleware
const mysqlController = {
//----------Function to collect all schema and data from database-----------------------------------------------------------------
  mysqlQuery: async (req: Request, res: Response, next: NextFunction) => {
    const MysqlDataSource = await dbConnect(req);

//--------HELPER FUNCTION 1-----------------------------------
    // function to query and get all information needed for foreign keys
    async function getForeignKeys(columnName: string, tableName: string): Promise<any[]> {
      return await MysqlDataSource.query(mysqlForeignKeyQuery.replace('columnName', columnName).replace('tableName', tableName));
  };

//--------HELPER FUNCTION 2-----------------------------------
    // function organizing data from queries in to the desired format of the front end
    async function mysqlFormatTableSchema(mysqlSchemaData: TableColumn[], tableName: string): Promise<TableColumn> {
      const tableSchema: TableColumn = {};
  
      for (const column of mysqlSchemaData) {
        const columnName: any = column.Field;
        const keyString: any = column.Key;

        const defaultTypes = await MysqlDataSource.query(`
          SELECT EXTRA, COLUMN_DEFAULT
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = '${MysqlDataSource.options.database}'
          AND TABLE_NAME = '${tableName}'
          AND COLUMN_NAME = "${columnName}"
        `);
          
        //query for the foreign key data
        const foreignKeys: any = await getForeignKeys(columnName, tableName);
        const foreignKey = foreignKeys.find((fk: any) => fk.COLUMN_NAME === columnName);

        //Creating the format for the Reference property if there is a foreign key
        const references: {[key: string]: string | boolean}[] = [];
        if (foreignKey){
          references.push({
            // These got a little mixed up but are in the right place
            isDestination: false,
            PrimaryKeyName: foreignKey.REFERENCED_COLUMN_NAME,
            PrimaryKeyTableName: 'public.' + foreignKey.REFERENCED_TABLE_NAME,
            ReferencesPropertyName: foreignKey.COLUMN_NAME,
            ReferencesTableName: 'public.' + tableName,
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
          default_type: defaultTypes[0].EXTRA === '' ? null : defaultTypes[0].EXTRA,
          field_name: column.Field,
        };
      };
  
      return tableSchema;
  };
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
        const tableData = await MysqlDataSource.query(`SELECT * FROM ${tableName}`);
        data[tableName] = tableData;

        // SCHEMA Create property on tableData object with every loop
        const mysqlSchemaData = await MysqlDataSource.query(`DESCRIBE ${MysqlDataSource.options.database}.${tableName}`);
        schema['public.' + tableName] = await mysqlFormatTableSchema(mysqlSchemaData, tableName);
      };

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
    };
  },

//-------------------------------------DATA TABLE ROWS-------------------------------------------------
//-------------------ADD NEW ROW-----------------------------------------------------------
  mysqlAddNewRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbRow(req, res, next)
      console.log("mysqlAddNewRow function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlAddNewRow middleware: ', err);
      return next(err);
    };
  },

//-----------------UPDATE ROW--------------------------------------------------------------
  mysqlUpdateRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      updateRow(req, res, next);
      console.log("mysqlUpdateRow function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlUpdateRow middleware: ', err);
      return next(err);
    };
  },

//----------------DELETE ROW---------------------------------------------------------------
  mysqlDeleteRow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(deleteRow(req, res, next));
      console.log("mysqlDeleteRow function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlDeleteRow middleware: ', err);
      return next(err);
    };
  },

//-------------------------------------SCHEMA TABLE COLUMNS------------------------------------------
//----------------ADD NEW COLUMN----------------------------------------------------------
  mysqlAddNewColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewDbColumn(req, res, next);
      console.log("mysqlAddNewColumn function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlAddNewColumn middleware: ', err);
      return next(err);
    };
  },

//-----------------UPDATE COLUMN--------------------------------------------------------
  mysqlUpdateColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      updateDbColumn(req, res, next);
      console.log("mysqlUpdateColumn function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlUpdateColumn middleware: ', err);
      return next(err);
    };
  },

//-------------DELETE COLUMN------------------------------------------------------------
  mysqlDeleteColumn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      deleteColumn(req, res, next);
      console.log("mysqlDeleteColumn function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlDeleteColumn middleware: ', err);
      return next(err);
    };
  },

//---------------------------DATABASE TABLES--------------------------------------------------------
//--------------ADD NEW TABLE-----------------------------------------------------------
  mysqlAddNewTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addNewTable(req, res, next);
      console.log("mysqlAddNewTable function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlAddNewTable middleware: ', err);
      return next(err);
    };
  },

//--------------GET ALL TABLE NAMES-------------------------------------------------------------------
  mysqlGetTableNames: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tableNameList = await Promise.resolve(getTableNames(req, res, next));
      console.log("mysqlGetTableNames function has concluded");
      res.locals.tableNames = tableNameList;
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlDeleteTable middleware: ', err);
      return next(err);
    };
  },

//--------------DELETE TABLE------------------------------------------------------------
  mysqlDeleteTable: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(deleteTable(req, res, next));
      console.log("mysqlDeleteTable function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlDeleteTable middleware: ', err);
      return next(err);
    };
  },

//------------------------------------------FOREIGN KEYS---------------------------------------------
//--------------ADD NEW FOREIGN KEY-----------------------------------------------------
  mysqlAddForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    try {
      addForeignKey(req, res, next);
      console.log("mysqlAddForeignKey function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlAddForeignKey middleware: ', err);
      return next(err);
    };
  },

//----------------REMOVE FOREIGN KEY-----------------------------------------------------------------
  mysqlRemoveForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    try {
      removeForeignKey(req, res, next);
      console.log("mysqlRemoveForeignKey function has concluded");
      return next();
    } catch (err: unknown) {
      console.log('Error occurred in the mysqlRemoveForeignKey middleware: ', err);
      return next(err);
    };
  },

//---------------------------------------------------------------------------------------------------

};
export default mysqlController;