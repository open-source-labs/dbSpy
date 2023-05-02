
export const microsoftSchemaQuery = `
        SELECT
            c.TABLE_NAME,
            c.COLUMN_NAME,
            c.DATA_TYPE,
            c.CHARACTER_MAXIMUM_LENGTH,
            c.COLUMN_DEFAULT,
            c.IS_NULLABLE,
            CASE WHEN k.COLUMN_NAME IS NOT NULL THEN 'YES' ELSE 'NO' END AS IS_PRIMARY_KEY
        FROM 
            INFORMATION_SCHEMA.COLUMNS c
        LEFT JOIN
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE k ON c.TABLE_NAME = k.TABLE_NAME AND c.COLUMN_NAME = k.COLUMN_NAME AND k.CONSTRAINT_NAME LIKE '%PK%'
        WHERE 
            c.TABLE_NAME = 'tableName';
            `;
export const microsoftForeignKeyQuery = `
        SELECT
            fk.name AS constraint_name,
            OBJECT_NAME(fk.parent_object_id) AS table_name,
            COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS column_name,
            OBJECT_NAME(fk.referenced_object_id) AS referenced_table_name,
            COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS referenced_column_name
        FROM
            sys.foreign_keys AS fk
        INNER JOIN
            sys.foreign_key_columns AS fkc ON fk.object_id = fkc.constraint_object_id;
            `;