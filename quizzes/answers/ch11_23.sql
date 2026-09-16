SELECT c.constraint_name,
       c.constraint_type,
       c.status,
       cc.column_name,
       c.search_condition
FROM   user_constraints c
JOIN   user_cons_columns cc ON c.constraint_name = cc.constraint_name
                            AND c.table_name = cc.table_name
WHERE  c.table_name = 'MY_EMPLOYEES'
ORDER BY c.constraint_type, cc.position;
