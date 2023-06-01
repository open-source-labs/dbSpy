export type DefaultErr = {
    log: string;
    status: number;
    message: string;
};
export type Props = {
    isActive: boolean;
    setIsActive: (active: boolean) => void;
};
export interface dbCredentials {
    database_name: string | number | null;
    username: string | number | null;
    password: string | number | null;
    hostname: string | number | null;
    port: string | number | null;
    database_link: string | number | null;
    db_type: string;
}
export interface Data {
    edges: RowsOfData[];
    table: [string, RowsOfData[]];
}
export interface RefObj {
    isDestination: boolean;
    PrimaryKeyName: string;
    PrimaryKeyTableName: string;
    ReferencesPropertyName: string;
    ReferencesTableName: string;
    constraintName: string;
}
export interface TableColumn {
    Field?: string;
    Type?: string;
    Null?: string;
    Key?: string;
    Default?: any;
    Extra?: string;
    References?: RefObj[];
    TableName?: string;
    IsForeignKey?: boolean;
    IsPrimaryKey?: boolean;
    Value?: null;
    additional_constraints?: string | null;
    data_type?: string;
    field_name?: string;
    Name?: string;
    [key: string]: any;
    update_rule?: string;
    delete_rule?: string;
    default_type?: string;
}
export interface OracleSchema {
    TABLE_NAME: string;
    COLUMN_NAME: string;
    DATA_TYPE: string;
    DATA_DEFAULT: string | null;
    CHARACTER_MAXIMUM_LENGTH: string | number | null;
    IS_NULLABLE: string;
    COLUMN_ID: number;
    CONSTRAINT_NAME: string;
    CONSTRAINT_TYPE: string;
    R_TABLE_OWNER: string | null;
    R_TABLE_NAME: string | null;
    R_COLUMN_NAME: string | null;
}
export interface TableColumns {
    [columnName: string]: TableColumn;
}
export interface TableSchema {
    [tableName: string]: TableColumns;
}
export interface ReferenceType {
    [index: number]: {
        isDestination: boolean;
        PrimaryKeyName: string;
        PrimaryKeyTableName: string;
        ReferencesPropertyName: string;
        ReferencesTableName: string;
        constraintName: string;
    };
    length: number;
}
export type Edge = {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
    animated: boolean;
    label: string;
    style: {
        strokeWidth: number;
        stroke: string;
    };
    markerEnd: {
        type: string;
        orient: string;
        width: number;
        height: number;
        color: string;
    };
};
export type DataNode = {
    id: string;
    type: 'table';
    position: {
        x: number;
        y: number;
    };
    data: DataNodeData;
};
export interface DataNodeData {
    table: TableTuple;
    edges: Edge[];
}
export type TableTuple = [
    TableKey: string,
    ColumnData: {
        [ColumnName: string]: ColumnSchema;
    } | RowsOfData[] | RowsOfData
];
export interface dataSourceConnection {
    type: string;
    host?: string;
    port?: string | number;
    username?: string;
    password?: string;
    database?: string;
    serviceName?: string;
    synchronize?: boolean;
    logging?: boolean;
}
export type ColumnData = {
    name: string;
    type: SQLDataType;
    isNullable: boolean;
    isPrimary: boolean;
    defaultValue: string | null;
};
export type Reference = {
    [tableName: string]: {
        PrimaryKeyName: string;
        PrimaryKeyTableName: string;
        ReferencesPropertyName: string;
        ReferencesTableName: string;
        isDestination: boolean;
        constraintName: string;
    };
};
export type ForeignKeyData = {
    PrimaryKeyTableName: string;
    PrimaryKeyColumnName: string;
    ForeignKeyTableName: string;
    ForeignKeyColumnName: string;
    constraintName: string;
};
export type InnerReference = {
    PrimaryKeyName: string;
    PrimaryKeyTableName: string;
    ReferencesPropertyName: string;
    ReferencesTableName: string;
    isDestination: boolean;
    constraintName: string;
};
export interface ColumnSchema {
    Name: string;
    Value: string | null;
    TableName: string;
    References: InnerReference[];
    IsPrimaryKey: boolean;
    IsForeignKey: boolean;
    field_name: string;
    data_type: SQLDataType;
    additional_constraints: 'NULL' | 'NOT NULL' | 'PRIMARY' | 'UNIQUE';
}
export type RowsOfData = {
    [key: string | number]: string | number | boolean | null;
};
export type DataStore = {
    [TableName: string]: RowsOfData[];
};
export type SchemaStore = {
    [TableName: string]: {
        [ColumnName: string]: ColumnSchema;
    };
};
export type DataRowArray = Array<string | number | boolean>;
export type FlowState = {
    edges: any[];
    setEdges: (eds: any) => void;
    nodes: any[];
    setNodes: (nds: any) => void;
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (connection: any) => void;
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
export type PostgresDataTypes = 'bigint' | 'bigserial' | 'bit' | 'bit varying' | 'boolean' | 'bool' | 'box' | 'bytea' | 'char' | 'character' | 'character varying' | 'cidr' | 'circle' | 'date' | 'decimal' | 'double precision' | 'float4' | 'float8' | 'inet' | 'int' | 'int2' | 'int4' | 'int8' | 'integer' | 'interval' | 'json' | 'jsonb' | 'line' | 'lseg' | 'macaddr' | 'macaddr8' | 'money' | 'numeric' | 'path' | 'pg_lsn' | 'pg_snapshot' | 'point' | 'polygon' | 'real' | 'serial' | 'serial2' | 'serial4' | 'smallint' | 'smallserial' | 'text' | 'time' | 'timetz' | 'timestamp' | 'timestamptz' | 'tsquery' | 'tsvector' | 'txid_snapshot' | 'uuid' | 'xml';
//# sourceMappingURL=Types.d.ts.map