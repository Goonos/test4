SELECT t.table_name
FROM   user_tables t
WHERE  NOT EXISTS (
    SELECT 1 FROM user_constraints c
    WHERE  c.table_name = t.table_name
    AND    c.constraint_type = 'P'
);
