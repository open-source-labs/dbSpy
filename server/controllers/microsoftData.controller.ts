import { Request, Response, NextFunction, RequestHandler } from 'express';
import { TableColumns, TableSchema, ReferenceType } from '@/Types';
import { DataSource } from 'typeorm';
import { microsoftSchemaQuery, microsoftForeignKeyQuery } from './queries/microsoft.queries';
//import { microsoftFormatTableSchema } from './helperFunctions/mysql.functions';


export const microsoftQuery: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { hostname, password, port, username, database_name } = req.query;

        const MicrosoftDataSource = new DataSource({
            type: "mssql",
            host: hostname as string,
            port: port ? parseInt(port as string) : 1433,
            username: username as string,
            password: password as string,
            database: database_name as string,
            synchronize: true,
            logging: true,
            options: {
                encrypt: false,
            }
          });

        await MicrosoftDataSource.initialize();
        console.log('Data Source has been initialized');
      
          async function microsoftFormatTableSchema(microsoftSchema: any, tableName: string): Promise<TableColumns> {
            const tableSchema: TableColumns = {};
      
            // console.log('microsoftSchema: ', microsoftSchema)
            for (const key of microsoftSchema) {
                const columnName: string = key.COLUMN_NAME;
                // console.log('column: ', columnName)
                //query for the foreign key data

                const foreignKeys: any = await MicrosoftDataSource.query(microsoftForeignKeyQuery);
                const foreignKey = foreignKeys.find((fk: any) => fk.column_name === columnName);
        

                // console.log('foreignKey: ', foreignKey)
                //Creating the format for the Reference property if their is a foreign key
                const references: ReferenceType = {
                    length: 0,
                };
        
                if (foreignKey){
                    references[references.length] = {
                        isDestination: false,
                        PrimaryKeyName: foreignKey.column_name,
                        PrimaryKeyTableName: foreignKey.table_name,
                        ReferencesPropertyName: foreignKey.referenced_column_name,
                        ReferencesTableName: foreignKey.referenced_table_name,
                        constraintName: foreignKey.constraint_name,
                    };
                    references.length += 1;
                };
                console.log('references: ', references)
                //Formation of the schema data
                tableSchema[columnName] = {
                    IsForeignKey: foreignKey ? true : false,
                    IsPrimaryKey: key.IS_PRIMARY_KEY === 'YES' ? true : false,
                    Name: key.COLUMN_NAME,
                    References: foreignKey ? [references] : [],
                    TableName: 'public.' + tableName,
                    Value: null,
                    additional_constraints: key.IS_NULLABLE === 'NO' ? 'NOT NULL' : null ,
                    data_type: `${key.DATA_TYPE.toUpperCase()}` + `${key.DATA_TYPE === 'varchar' ? `(${key.CHARACTER_MAXIMUM_LENGTH})` : ''}`,
                    field_name: columnName,
                };
            };
            console.log('tableSchema: ', tableSchema);
            return tableSchema;
        };



          const tables: [{TABLE_NAME: string}] = await MicrosoftDataSource.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES`);

          const tableData: TableColumns = {};
          const schema: TableSchema = {};

          for (const table of tables) {

            // DATA Create property on tableData object with every loop
            const tableName: string = table.TABLE_NAME;
            const tableDataQuery = await MicrosoftDataSource.query(`SELECT * FROM ${tableName}`);
            tableData[tableName] = tableDataQuery;



            // type References = [{
            //     isDestination: boolean,
            //     PrimaryKeyName: string,
            //     PrimaryKeyTableName: string,
            //     ReferencesPropertyName: string,
            //     ReferencesTableName: string,
            //     constraintName: string,
            // }]

            const microsoftSchema = await MicrosoftDataSource.query(microsoftSchemaQuery.replace('tableName', tableName));
            //console.log('microsoftSchemaData: ', microsoftSchema)
            schema['public.' + tableName] = await microsoftFormatTableSchema(microsoftSchema, tableName);

          }

          console.log('Table data: ', tableData);
          console.log('schema: ', schema);





          res.locals.data = tableData;
          res.locals.schema = schema;


        return next();
    } catch(err: unknown) {
        return next(err);
    }
};