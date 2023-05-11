import { Request, Response, NextFunction, RequestHandler } from 'express';
import { TableColumns, TableSchema, TableColumn } from '@/Types';
import { oracleSchemaQuery } from './queries/oracle.queries';
import { dbConnect, addNewDbRow, updateRow, deleteRow, addNewDbColumn, updateDbColumn, deleteColumn, addNewTable, deleteTable, addForeignKey, removeForeignKey } from './helperFunctions/universal.helpers'

const oracleController = {
//----------------------------------------------------------------------------------------------

oracleQuery: async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.query
    const OracleDataSource = await dbConnect(req);

    try {
//--------HELPER FUNCTION-----------------------------------
          async function oracleFormatTableSchema(oracleSchema: TableColumn[], tableName: string): Promise<TableColumn> {
            const tableSchema: TableColumn = {};
      
            for (const column of oracleSchema) {
                const columnName: any = column.COLUMN_NAME;
                const keyString: any = column.CONSTRAINT_TYPE;
        
                //Creating the format for the Reference property if there is a foreign key
                const references = [];

                //Formation of the Reference data
                if (column.CONSTRAINT_TYPE === 'R'){
                    references.push({
                        isDestination: false,
                        PrimaryKeyName: column.COLUMN_NAME,
                        PrimaryKeyTableName: 'public.' + tableName,
                        ReferencesPropertyName: column.R_COLUMN_NAME,
                        ReferencesTableName: 'public.' + column.R_TABLE_NAME,
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
                    TableName: 'public.' + tableName,
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

        const tables: [{TABLE_NAME: string}] = await OracleDataSource.query(`SELECT table_name FROM user_tables`);
        console.log('tables: ', tables)
        //Declare constants to store results we get back from queries
        const tableData: TableColumns = {};
        const schema: TableSchema = {};

            for (const table of tables) {
                const tableName: string = table.TABLE_NAME
                const user: string = username as string

                const tableDataQuery = await OracleDataSource.query(`SELECT * FROM "${user.toUpperCase()}"."${tableName}"`);
                tableData[tableName] = tableDataQuery;

                const oracleSchema = await OracleDataSource.query(oracleSchemaQuery.replace('user', user.toUpperCase()).replace('tableName', tableName));
                console.log('oracleSchema: ', oracleSchema)
                schema['public.' + tableName] = await oracleFormatTableSchema(oracleSchema, tableName);
            };

        // Console.logs to check what the data looks like
        // console.log('table data: ', tableData);
        console.log('schema data: ', schema);

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

//------------------------------------------------------------------------------------------------------

oracleAddNewRow: async (req: Request, res: Response, next: NextFunction) => {
    addNewDbRow(req, res, next)
    console.log("oracleAddNewRow function has concluded")
    return next();
  },
  
  //------------------------------------------------------------------------------------------------------
  
  oracleUpdateRow: async (req: Request, res: Response, next: NextFunction) => {
      updateRow(req, res, next);
      console.log("oracleUpdateRow function has concluded")
      return next();
    },
  
  //--------------------------------------------------------------------------------------------------------
  
  oracleDeleteRow: async (req: Request, res: Response, next: NextFunction) => {
    deleteRow(req, res, next);
    console.log("oracleDeleteRow function has concluded")
      return next();
    },
  
  //--------------------------------------------------------------------------------------------------------
  
  oracleAddNewColumn: async (req: Request, res: Response, next: NextFunction) => {
    addNewDbColumn(req, res, next);
    console.log("oracleAddNewColumn function has concluded")
      return next();
    },
  
  //--------------------------------------------------------------------------------------------------------
  
  oracleUpdateColumn: async (req: Request, res: Response, next: NextFunction) => {
    updateDbColumn(req, res, next);
    console.log("oracleUpdateColumn function has concluded")
      return next();
    },
  
  //--------------------------------------------------------------------------------------------------------
  
  oracleDeleteColumn: async (req: Request, res: Response, next: NextFunction) => {
    deleteColumn(req, res, next);
    console.log("oracleDeleteColumn function has concluded")
      return next();
    },
  
  //--------------------------------------------------------------------------------------------------------
  
  oracleAddNewTable: async (req: Request, res: Response, next: NextFunction) => {
    addNewTable(req, res, next);
    console.log("oracleAddNewTable function has concluded")
      return next();
    },
  
  //--------------------------------------------------------------------------------------------------------
  
  oracleDeleteTable: async (req: Request, res: Response, next: NextFunction) => {
    deleteTable(req, res, next);
    console.log("oracleDeleteTable function has concluded")
      return next();
    },
  
  //--------------------------------------------------------------------------------------------------------
  
  oracleAddForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    addForeignKey(req, res, next);
    console.log("oracleAddForeignKey function has concluded")
    return next();
  },
  
  //--------------------------------------------------------------------------------------------------------
  
  oracleRemoveForeignKey: async (req: Request, res: Response, next: NextFunction) => {
    removeForeignKey(req, res, next);
    console.log("oracleRemoveForeignKey function has concluded")
    return next();
  },
  
  //--------------------------------------------------------------------------------------------------------

};

export default oracleController;