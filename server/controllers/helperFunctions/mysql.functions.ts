import { mysqlForeignKeyQuery } from '../queries/mysql.queries';
import { MysqlDataSource } from '../../datasource';
import { MysqlTableColumn, MysqlTableColumns } from '@/Types';

//Replacement object for 

//Helper function for mysqlFormatTableSchema that gets all relative data about foreign keys
export async function getForeignKeys(columnName: string, tableName: string): Promise<any[]> {
    return await MysqlDataSource.query(mysqlForeignKeyQuery.replace('columnName', columnName).replace('tableName', tableName));
};

//function organizing data from queries in to the desired format of the front end
export async function mysqlFormatTableSchema(columns: MysqlTableColumn[], tableName: string): Promise<MysqlTableColumns> {
    const tableSchema: MysqlTableColumns = {};

    for (const column of columns) {
        const columnName: any = column.Field;
        //const tableName: any = column.TableName
        const keyString: any = column.Key;
        
        //query for the foreign key data
        const foreignKeys: any = await getForeignKeys(columnName, tableName);
        const foreignKey = foreignKeys.find((fk: any) => fk.COLUMN_NAME === columnName);

        //Creating the format for the Reference property if their is a foreign key
        const references: any = {
            length: 0,
        };

        if (foreignKey){
            references[references.length] = {
                isDestination: false,
                PrimaryKeyName: foreignKeys.COLUMN_NAME,
                PrimaryKeyTableName: foreignKeys.TABLE_NAME,
                ReferencesPropertyName: foreignKeys.REFERENCED_COLUMN_NAME,
                ReferencesTableName: foreignKeys.REFERENCED_TABLE_NAME,
                constraintName: foreignKeys.CONSTRAINT_NAME,
            };
            references.length += 1;
        };

        //Formation of the schema data
        tableSchema[columnName] = {
            IsForeignKey: keyString.includes('MUL'),
            IsPrimaryKey: keyString.includes('PRI'),
            Name: column.Field,
            References: foreignKey ? [references] : [],
            TableName: 'public.' + tableName,
            Value: null,
            additional_constraints: column.Null === 'NO' ? 'NOT NULL' : null ,
            data_type: column.Type,
            field_name: column.Field,
        };
    };

    return tableSchema;
};