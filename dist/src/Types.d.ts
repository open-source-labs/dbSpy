export type DefaultErr = {
    log: string;
    status: number;
    message: string;
};
export type Props = {
    isActive: boolean;
    setIsActive: (active: boolean) => void;
};
export interface MysqlTableColumn {
    Field?: string;
    Type?: string;
    Null?: string;
    Key?: string;
    Default?: any;
    Extra?: string;
    References?: any[];
    TableName?: string;
    IsForeignKey?: boolean;
    IsPrimaryKey?: boolean;
    Value?: null;
    additional_constraints?: string | null;
    data_type?: string;
    field_name?: string;
    Name?: string;
    [key: string]: any;
}
export interface MysqlTableColumns {
    [columnName: string]: MysqlTableColumn;
}
export interface MysqlTableSchema {
    [tableName: string]: MysqlTableColumns;
}
export interface PostgresTableColumn {
    column_name?: string;
    data_type?: string;
    character_maximum_length?: null;
    is_nullable?: string;
    column_default?: null;
    is_autoincrement?: string;
    additional_constraints?: string;
    IsForeignKey?: boolean;
    IsPrimaryKey?: boolean;
    Value?: null;
    field_name?: string;
    Name?: string;
    References?: any[];
    [key: string]: any;
    update_rule?: string;
    delete_rule?: string;
}
export interface PostgresTableColumns {
    [columnName: string]: PostgresTableColumn;
}
export interface PostgresTableSchema {
    [tableName: string]: PostgresTableColumns;
}
export interface MicrosoftTableColumn {
    column_name?: string;
    data_type?: string;
    character_maximum_length?: null;
    is_nullable?: string;
    column_default?: null;
    is_autoincrement?: string;
    additional_constraints?: string;
    IsForeignKey?: boolean;
    IsPrimaryKey?: boolean;
    Value?: null;
    field_name?: string;
    Name?: string;
    References?: any[];
    [key: string]: any;
    update_rule?: string;
    delete_rule?: string;
}
export interface MicrosoftTableColumns {
    [columnName: string]: PostgresTableColumn;
}
export interface MicrosoftTableSchema {
    [tableName: string]: PostgresTableColumns;
}
export type ColumnData = {
    name: string;
    type: SQLDataType;
    isNullable: boolean;
    isPrimary: boolean;
    defaultValue: string | null;
};
export type Reference = {
    PrimaryKeyName: string;
    PrimaryKeyTableName: string;
    ReferencesPropertyName: string;
    ReferencesTableName: string;
    IsDestination: boolean;
    constraintName: string;
};
export type ColumnSchema = {
    Name: string;
    Value: string | null;
    TableName: string;
    References: Reference[];
    IsPrimaryKey: boolean;
    IsForeignKey: boolean;
    field_name: string;
    data_type: SQLDataType;
    additional_constraints: 'NULL' | 'NOT NULL' | null;
};
export type RowsOfData = {
    [key: string | number]: string | number;
};
export type ColumnDataForDataTable = {
    [key: string | number]: RowsOfData[];
};
export interface Table {
    [key: string]: ColumnSchema;
}
export interface SchemaObject {
    [key: string]: Table;
}
export type SQLDataType = 'AUTO_INCREMENT' | 'SERIAL' | 'SMALLSERIAL' | 'BIGSERIAL' | 'INT' | 'INT2' | 'INT4' | 'INT8' | 'SMALLINT' | 'INTEGER' | 'BIGINT' | 'DECIMAL' | 'NUMERIC' | 'REAL' | 'FLOAT' | 'FLOAT4' | 'FLOAT8' | 'DOUBLE PRECISION' | 'MONEY' | 'CHARACTER VARYING(8)' | 'VARCHAR(255)' | 'CHARACTER(8)' | 'CHAR(8)' | 'TEXT' | 'CITEXT' | 'HSTORE' | 'BYTEA' | 'BIT' | 'VARBIT' | 'BIT VARYING' | 'TIMETZ' | 'TIMESTAMPTZ' | 'TIMESTAMP' | 'TIMESTAMP WITHOUT TIME ZONE' | 'TIMESTAMP WITH TIME ZONE' | 'DATE' | 'TIME' | 'TIME WITHOUT TIME ZONE' | 'TIME WITH TIME ZONE' | 'INTERVAL' | 'BOOL' | 'BOOLEAN' | 'ENUM' | 'POINT' | 'LINE' | 'LSEG' | 'BOX' | 'PATH' | 'POLYGON' | 'CIRCLE' | 'CIDR' | 'INET' | 'MACADDR' | 'TSVECTOR' | 'TSQUERY' | 'UUID' | 'XML' | 'JSON' | 'JSONB' | 'INT4RANGE' | 'INT8RANGE' | 'NUMRANGE' | 'TSRANGE' | 'TSTZRANGE' | 'DATERANGE' | 'GEOMETRY' | 'GEOGRAPHY' | 'CUBE' | 'LTREE';
//# sourceMappingURL=Types.d.ts.map