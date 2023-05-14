"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oracleSchemaQuery = void 0;
exports.oracleSchemaQuery = `
SELECT
c.table_name,
c.column_name,
c.data_type,
c.data_default,
c.char_col_decl_length AS character_maximum_length,
c.nullable AS is_nullable,
c.column_id,
cc.constraint_name,
ac.constraint_type,
ar.owner AS r_table_owner,
ar.table_name AS r_table_name,
ar.column_name AS r_column_name
FROM
all_tab_columns c
LEFT JOIN
all_cons_columns cc ON c.owner = cc.owner AND c.table_name = cc.table_name AND c.column_name = cc.column_name
LEFT JOIN
all_constraints ac ON cc.owner = ac.owner AND cc.constraint_name = ac.constraint_name
LEFT JOIN
all_cons_columns ar ON ac.r_owner = ar.owner AND ac.r_constraint_name = ar.constraint_name
  WHERE
    c.owner = 'user'
    AND c.table_name = 'tableName'
`;
//# sourceMappingURL=oracle.queries.js.map