import { postgresForeignKeyQuery } from '../queries/postgres.queries';
import { PostgresDataSource } from '../../datasource';
import { PostgresTableColumn } from '@/Types';

//Helper function for postgresFormatTableSchema that gets all relative data about foreign keys
async function getForeignKeys(): Promise<PostgresTableColumn[]> {
    return await PostgresDataSource.query(postgresForeignKeyQuery);
};

//function organizing data from queries in to the desired format of the front end
export async function postgresFormatTableSchema(columns: PostgresTableColumn[], tableName: string): Promise<PostgresTableColumn> {
  const tableSchema: PostgresTableColumn = {};
  
  for (const column of columns) {
    const columnName: any = column.column_name
    const keyString: any = column.additional_constraints

    //query for the foreign key data
    const foreignKeys: any = await getForeignKeys();
    const foreignKey = await foreignKeys.find((fk: any) => fk.foreign_key_column === columnName);
    
    //Creating the format for the Reference property if their is a foreign key
    const references: any = {
      length: 0,
    };

    if (foreignKey){
      references[references.length] = {
        idDestination: false,
        PrimaryKeyName: foreignKey.foreign_key_column,
        PrimaryKeyTableName: foreignKey.table_with_foreign_key,
        ReferencesPropertyName: foreignKey.referenced_column,
        ReferencesTableName: foreignKey.referenced_table,
        constraintName: foreignKey.constraint_name
      };
      references.length += 1;
    };

    tableSchema[columnName] = {
      IsForeignKey: keyString.includes('FOREIGN KEY'),
      IsPrimaryKey: keyString.includes('PRIMARY KEY'),
      Name: columnName,
      References: foreignKey ? [references] : [],
      TableName: 'public.' + tableName,
      Value: null,
      additional_constraints: column.additional_constraints,
      data_type: column.data_type,
      field_name: columnName,
    };
  };
  return tableSchema;
};