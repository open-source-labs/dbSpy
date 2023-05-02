"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlForeignKeyQuery = void 0;
exports.mysqlForeignKeyQuery = `
  SELECT
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME,
    CONSTRAINT_NAME,
    TABLE_NAME
  FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE
    COLUMN_NAME = 'columnName'
    AND REFERENCED_TABLE_NAME IS NOT NULL
    AND TABLE_NAME = 'tableName';
    `;
//# sourceMappingURL=mysql.queries.js.map