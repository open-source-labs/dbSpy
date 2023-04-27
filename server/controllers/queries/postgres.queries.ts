//
export const postgresForeignKeyQuery = `
    SELECT 
        kcu.table_schema || '.' || kcu.table_name AS table_with_foreign_key, 
        kcu.column_name AS foreign_key_column, 
        rel_tco.table_schema || '.' || rel_tco.table_name AS referenced_table, 
        rco.update_rule, 
        rco.delete_rule,
        rel_kcu.column_name AS referenced_column,
        tco.constraint_name AS constraint_name
    FROM 
        information_schema.table_constraints tco 
    JOIN 
        information_schema.key_column_usage kcu ON tco.constraint_name = 
        kcu.constraint_name 
    JOIN 
        information_schema.referential_constraints rco ON tco.constraint_name 
        = rco.constraint_name 
    JOIN 
        information_schema.table_constraints rel_tco ON 
        rco.unique_constraint_name = rel_tco.constraint_name 
    JOIN 
        information_schema.key_column_usage rel_kcu ON 
        rel_tco.constraint_name = rel_kcu.constraint_name
    AND 
        kcu.ordinal_position = rel_kcu.ordinal_position
    WHERE 
        tco.constraint_type = 'FOREIGN KEY';
    `

export const postgresSchemaQuery = `
    SELECT 
        c.column_name, 
        c.data_type, 
        c.character_maximum_length,
        c.is_nullable,
        c.column_default,
        CASE WHEN c.column_default LIKE 'nextval%' THEN 'YES' ELSE 'NO' END as is_autoincrement,
    CASE WHEN 
        c.column_default IS NOT NULL THEN 'DEFAULT' ELSE '' END ||
    CASE WHEN 
        c.is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
    CASE WHEN 
        tc.constraint_type = 'PRIMARY KEY' THEN ' PRIMARY KEY' ELSE '' END ||
    CASE WHEN 
        tc.constraint_type = 'FOREIGN KEY' THEN ' FOREIGN KEY REFERENCES ' || ccu.table_name || '(' || ccu.column_name || ')' ELSE '' END as additional_constraints
    FROM 
        information_schema.columns c
    LEFT OUTER JOIN 
        information_schema.key_column_usage kcu
        ON 
            c.table_catalog = kcu.table_catalog
        AND 
            c.table_schema = kcu.table_schema
        AND 
            c.table_name = kcu.table_name
        AND 
            c.column_name = kcu.column_name
    LEFT OUTER JOIN 
        information_schema.table_constraints tc
        ON 
            kcu.constraint_catalog = tc.constraint_catalog
        AND 
            kcu.constraint_schema = tc.constraint_schema
        AND 
            kcu.constraint_name = tc.constraint_name
    LEFT OUTER JOIN 
        information_schema.constraint_column_usage ccu
        ON 
            tc.constraint_catalog = ccu.constraint_catalog
        AND 
            tc.constraint_schema = ccu.constraint_schema
        AND 
            tc.constraint_name = ccu.constraint_name
    WHERE 
        c.table_name = 'tableName'
    ORDER BY 
        c.ordinal_position;
    `