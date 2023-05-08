import { Request, Response, NextFunction, RequestHandler } from 'express';
import { TableColumns, TableColumn, TableSchema, ReferenceType } from '@/Types';
import { microsoftSchemaQuery, microsoftForeignKeyQuery } from './queries/microsoft.queries';
import { addNewDbRow, dbConnect } from './helperFunctions/universal.helpers'

//------------------------------------------------------------------------------------------------------

export const microsoftQuery: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
        const MicrosoftDataSource = await dbConnect(req);
        try{

//-------------------------------------------
    async function microsoftFormatTableSchema(microsoftSchemaData: TableColumn[], tableName: string): Promise<TableColumns> {

        const tableSchema: TableColumn = {};
    
        // console.log('microsoftSchema: ', microsoftSchema)
        for (const column of microsoftSchemaData) {
            const columnName: string = column.COLUMN_NAME;
            // console.log('column: ', columnName)
            //query for the foreign key data


            const foreignKeys: any = await MicrosoftDataSource.query(microsoftForeignKeyQuery);
            const foreignKey = foreignKeys.find((fk: any) => fk.column_name === columnName);
    

            // console.log('foreignKey: ', foreignKey)
            //Creating the format for the Reference property if there is a foreign key
            const references = []
    
            if (foreignKey){
                references.push({
                    isDestination: false,
                    PrimaryKeyName: foreignKey.column_name,
                    PrimaryKeyTableName: 'public.' + tableName,
                    ReferencesPropertyName: foreignKey.referenced_column_name,
                    ReferencesTableName: 'public.' + foreignKey.referenced_table_name,
                    constraintName: foreignKey.constraint_name,
                });
                console.log('references: ', references)

            };
            console.log('references: ', references)
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
                field_name: columnName,
        }};
        return tableSchema;
    };
//-------------------------------------------------

          const tables: [{TABLE_NAME: string}] = await MicrosoftDataSource.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES`);

          const tableData: TableColumns = {};
          const schema: TableSchema = {};

          for (const table of tables) {

            // DATA Create property on tableData object with every loop
            const tableName: string = table.TABLE_NAME;
            const tableDataQuery = await MicrosoftDataSource.query(`SELECT * FROM ${tableName}`);
            tableData[tableName] = tableDataQuery;

            const microsoftSchemaData = await MicrosoftDataSource.query(microsoftSchemaQuery.replace('tableName', tableName));
            //console.log('microsoftSchemaData: ', microsoftSchema)
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
    
};

//------------------------------------------------------------------------------------------------------

export const microsoftAddNewRow: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    addNewDbRow(req, res, next);
    return next();
//     const dbDataSource = await dbConnect(req)
//     console.log('req.session: ', req.session)
//     if (dbDataSource)
// {    try{
//     const newDbRowData: {[key: string]: string } = req.body;
//     const tableName = newDbRowData.tableName;
//     const newMysqlRow: {[key: string]: string} = newDbRowData.newRow as {};

//           const keys: string = Object.keys(newMysqlRow).join(", ");
//           console.log("keys: ", keys)
//           const values: string = Object.values(newMysqlRow).map(val => `'${val}'`).join(", ");
//           console.log('values: ', values)
//           const dbAddedRow: Promise<unknown> = await dbDataSource.query(`INSERT INTO ${tableName} (${keys})
//             VALUES (${values})`);

//       dbDataSource.destroy();
//       console.log('Database has been disconnected');
//       console.log('dbAddedRow in helper: ', dbAddedRow)
//       return dbAddedRow;
      

//   } catch (err: unknown) {
//     console.log('Error occurred in the mysqlAddNewRow middleware: ', err);
//     dbDataSource.destroy();
//     console.log('Database has been disconnected');
//     return next(err);
//   };
// } else {
//     throw new Error('Unable to make connection with database');
// }
  };
  
  //------------------------------------------------------------------------------------------------------