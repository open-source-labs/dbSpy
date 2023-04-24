"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const dataTypeArr = [
    'AUTO_INCREMENT',
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
function DataTypeOptions() {
    const optionsArr = dataTypeArr.map((dataType) => (
    // populate the options for data type
    // `selected` attribute will default select the type that matches props.type
    react_1.default.createElement("option", { key: dataType, value: dataType }, dataType)));
    return react_1.default.createElement(react_1.default.Fragment, null, optionsArr);
}
exports.default = DataTypeOptions;
//# sourceMappingURL=DataTypeOptions.js.map