
export type DefaultErr = {
  log: string,
  status: number,
  message: string,
};

export type Props = {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
};

export interface dbCredentials{
  database_name: string|number|null;
  username: string|number|null;
  password: string|number|null;
  hostname: string|number|null;
  port: string|number|null;
  database_link: string|number|null;
  db_type: string;
}

export interface Data{
  edges: RowsOfData[];
  table: [string, RowsOfData[]];
}

export interface RefObj {
    isDestination: boolean,
    PrimaryKeyName: string,
    PrimaryKeyTableName: string,
    ReferencesPropertyName: string,
    ReferencesTableName: string,
    constraintName: string,
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
};

export interface TableColumns {
  [columnName: string]: TableColumn;
};

export interface TableSchema {
  [tableName: string]: TableColumns;
};

export interface ReferenceType {
  [index: number]: {
    isDestination: boolean,
    PrimaryKeyName: string,
    PrimaryKeyTableName: string,
    ReferencesPropertyName: string,
    ReferencesTableName: string,
    constraintName: string,
  },
  length: number,
};

export type Edge = {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  animated: boolean;
  label: string;
  style: { strokeWidth: number; stroke: string };
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
  position: { x: number; y: number };
  data: {
    table: TableTuple;
    edges: Edge[];
  };
};

export type TableTuple = 
[ TableKey: string, 
  ColumnData: { [ColumnName: string]: ColumnSchema }];

  export interface dataSourceConnection {
    type: string,
    host?: string,
    port?: string | number,
    username?:string,
    password?: string,
    database?: string,
    serviceName?: string,
    synchronize?: boolean,
    logging?: boolean,
}

// ---------------------------------------------------------------------
// ZUSTAND STORE AND FRONT-END TYPES

// ColumnData is input by user and sent to schemaStore
export type ColumnData = {
  name: string;
  type: SQLDataType;
  isNullable: boolean;
  isPrimary: boolean;
  // Using `string | null` instead of optional `?`
  // because default value can be added, which throws controlled type error
  defaultValue: string | null;
};

// ColumnSchema and Reference are used by schemaStore
export type Reference = {
  [tableName: string]: {
    PrimaryKeyName: string;
    PrimaryKeyTableName: string;
    ReferencesPropertyName: string;
    ReferencesTableName: string;
    IsDestination: boolean;
    constraintName: string;
  };
};

export interface ColumnSchema{
  Name: string;
  Value: string | null;
  TableName: string;
  References: Reference;
  IsPrimaryKey: boolean;
  IsForeignKey: boolean;
  field_name: string;
  data_type: SQLDataType;
  additional_constraints: 'NULL' | 'NOT NULL' | 'PRIMARY' | 'UNIQUE' ;
};

// these are for data tables ######################
export type RowsOfData = {
  [key: string | number]: string | number | boolean | null,
};

export type DataStore = {
  [TableName: string]: RowsOfData[];
}

// export type DataState = {
//   // DATA
//   dataStore: DataStore;
//   system: 'PostgreSQL' | 'MySQL' | 'Microsoft SQL' | 'Oracle SQL';
//   history: DataStore[];
//   historyCounter: number;

  

//   // DATA SETTERS
//   setDataStore: (dataInfo: DataStore) => void;
//   setSystem: (system: DataStore) => void;
// }

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
  [key: string | number]: RowsOfData[],
  
};
//######################

export interface Table {
  [key: string]: ColumnSchema;
}

export interface SchemaObject {
  [key: string]: Table;
}

export type SQLDataType = 
  | 'AUTO_INCREMENT'
  | 'SERIAL'
  | 'SMALLSERIAL'
  | 'BIGSERIAL'
  | 'INT'
  | 'INT2'
  | 'INT4'
  | 'INT8'
  | 'SMALLINT'
  | 'INTEGER'
  | 'BIGINT'
  | 'DECIMAL'
  | 'NUMERIC'
  | 'REAL'
  | 'FLOAT'
  | 'FLOAT4'
  | 'FLOAT8'
  | 'DOUBLE PRECISION'
  | 'MONEY'
  | 'CHARACTER VARYING(8)'
  | 'VARCHAR(255)'
  | 'CHARACTER(8)'
  | 'CHAR(8)'
  | 'TEXT'
  | 'CITEXT'
  | 'HSTORE'
  | 'BYTEA'
  | 'BIT'
  | 'VARBIT'
  | 'BIT VARYING'
  | 'TIMETZ'
  | 'TIMESTAMPTZ'
  | 'TIMESTAMP'
  | 'TIMESTAMP WITHOUT TIME ZONE'
  | 'TIMESTAMP WITH TIME ZONE'
  | 'DATE'
  | 'TIME'
  | 'TIME WITHOUT TIME ZONE'
  | 'TIME WITH TIME ZONE'
  | 'INTERVAL'
  | 'BOOL'
  | 'BOOLEAN'
  | 'ENUM'
  | 'POINT'
  | 'LINE'
  | 'LSEG'
  | 'BOX'
  | 'PATH'
  | 'POLYGON'
  | 'CIRCLE'
  | 'CIDR'
  | 'INET'
  | 'MACADDR'
  | 'TSVECTOR'
  | 'TSQUERY'
  | 'UUID'
  | 'XML'
  | 'JSON'
  | 'JSONB'
  | 'INT4RANGE'
  | 'INT8RANGE'
  | 'NUMRANGE'
  | 'TSRANGE'
  | 'TSTZRANGE'
  | 'DATERANGE'
  | 'GEOMETRY'
  | 'GEOGRAPHY'
  | 'CUBE'
  | 'LTREE'

//from canvas.tsx

// export interface CanvasProps {
//   fetchedData: {
//     [key: string]: {
//       [key: string]: {
//         IsForeignKey: boolean;
//         IsPrimaryKey: boolean;
//         Name: string;
//         References: any[];
//         TableName: string;
//         Value: string | boolean | number; //originally any, check if value works
//         additional_constraints: string | null;
//         data_type: string;
//         field_name: string;
//       };
//     };
//   };
//   tableId?: string; //originally any, check if value works
//   isLoadingProps: boolean;
//   isErrorProps: boolean;
//   setFetchedData: (fetchedData: object) => void;
//   setSideBarOpened: (param: boolean) => void;
//   reference: any;
//   setSqlOpen: (sqlOpen: boolean) => void;
//   sqlOpen: boolean;
// }

// //from displayheader.tsx
// export interface DisplayHeaderProps {
//   menuPopUpOpened: boolean;
//   name: string | null;
//   picture: string | null | undefined;
//   setMenuPopUpOpened: (opened: boolean) => void;
//   setUser: (user: object /*originally any */) => void;
// }

// //from featuretab.tsx
// export interface FeatureTabProps {
//   setTablename: (e: string) => void;
//   fetchedData: {};
//   setFetchedData: (e: {}) => void;
//   setSideBarOpened: (param: boolean) => void;
//   screenshot: any;
// }

// //from menupopup.tsx
// export interface MenuPopUpProps {
//   opened: boolean;
//   setOpened: (opened: boolean) => void;
// }

// //from sidebar.tsx
// export interface SideBarProps {
//   isLoadingProps: boolean;
//   isErrorProps: boolean;
//   mutate: (data: object) => void;
//   sideBarOpened: boolean;
//   setSideBarOpened: (param: boolean) => void;
// }

// // from homeloggedinnavbar.tsx
// export interface HomeLoggedInNavbarProps {
//   user: {
//     email: string | null;
//     id: string | null;
//     name: string | null;
//     picture: string | null;
//   };
//   setUser: (user: object /*originally any */) => void;
// }
