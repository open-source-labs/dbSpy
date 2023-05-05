export const sqliteSchemaQuery = 
`SELECT 
    name AS column_name,
    type AS data_type,
    CASE WHEN pk = 1 THEN 'PRIMARY KEY' END AS constraint_type,
    (SELECT 
        GROUP_CONCAT(table || '.' || from || ' -> ' || to)
    FROM 
        pragma_foreign_key_list(name)
    ) AS foreign_keys
FROM 
    pragma_table_info('tableName')`