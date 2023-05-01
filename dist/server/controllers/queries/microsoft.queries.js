"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microsoftForeignKeyQuery = exports.microsoftSchemaQuery = void 0;
exports.microsoftSchemaQuery = `
                SELECT
                    TABLE_NAME,
                    COLUMN_NAME,
                    DATA_TYPE,
                    CHARACTER_MAXIMUM_LENGTH,
                    COLUMN_DEFAULT,
                    IS_NULLABLE
                FROM 
                    INFORMATION_SCHEMA.COLUMNS
                WHERE 
                    TABLE_NAME = 'tableName'
                `;
exports.microsoftForeignKeyQuery = `
                SELECT
                  CONSTRAINT_NAME,
                  TABLE_NAME,
                  COLUMN_NAME,
                  REFERENCED_TABLE_NAME,
                  REFERENCED_COLUMN_NAME
                FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
                WHERE 
                    COLUMN_NAME = 'columnName'
                    AND REFERENCED_TABLE_NAME IS NOT NULL
                    AND TABLE_NAME = 'tableName';
              `;
//# sourceMappingURL=microsoft.queries.js.map