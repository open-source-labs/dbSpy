import { SQLDataType } from '@/Types';

const DataTypeArr: SQLDataType[] = [
  'AUTOINCREMENT',
  'SERIAL',
  'SMALLSERIAL',
  'BIGSERIAL',
  'INT',
  'INT2',
  'INT4',
  'INT8',
  'SMALLINT',
  'INTEGER',
  'BIGINT',
  'DECIMAL',
  'NUMERIC',
  'REAL',
  'FLOAT',
  'FLOAT4',
  'FLOAT8',
  'DOUBLE PRECISION',
  'MONEY',
  'CHARACTER VARYING(8)',
  'VARCHAR(255)',
  'CHARACTER(8)',
  'CHAR(8)',
  'TEXT',
  'CITEXT',
  'HSTORE',
  'BYTEA',
  'BIT',
  'VARBIT',
  'BIT VARYING',
  'TIMETZ',
  'TIMESTAMPTZ',
  'TIMESTAMP',
  'TIMESTAMP WITHOUT TIME ZONE',
  'TIMESTAMP WITH TIME ZONE',
  'DATE',
  'TIME',
  'TIME WITHOUT TIME ZONE',
  'TIME WITH TIME ZONE',
  'INTERVAL',
  'BOOL',
  'BOOLEAN',
  'ENUM',
  'POINT',
  'LINE',
  'LSEG',
  'BOX',
  'PATH',
  'POLYGON',
  'CIRCLE',
  'CIDR',
  'INET',
  'MACADDR',
  'TSVECTOR',
  'TSQUERY',
  'UUID',
  'XML',
  'JSON',
  'JSONB',
  'INT4RANGE',
  'INT8RANGE',
  'NUMRANGE',
  'TSRANGE',
  'TSTZRANGE',
  'DATERANGE',
  'GEOMETRY',
  'GEOGRAPHY',
  'CUBE',
  'LTREE',
];

export default DataTypeArr;