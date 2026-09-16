SELECT c.constraint_name,
       CASE c.constraint_type
           WHEN 'P' THEN 'PRIMARY KEY'
           WHEN 'U' THEN 'UNIQUE'
           WHEN 'R' THEN 'FOREIGN KEY'
           WHEN 'C' THEN
               CASE WHEN c.search_condition LIKE '%IS NOT NULL%'
                    THEN 'NOT NULL'
                    ELSE 'CHECK'
               END
       END AS constraint_desc,
       cc.column_name,
       c.search_condition,
       pc.table_name AS ref_table,
       c.delete_rule,
       c.status
FROM   user_constraints  c
JOIN   user_cons_columns cc  ON c.constraint_name  = cc.constraint_name  AND c.table_name = cc.table_name
LEFT JOIN user_constraints  pc  ON c.r_constraint_name = pc.constraint_name
WHERE  c.table_name = 'EMPLOYEES'
ORDER BY c.constraint_type, cc.position;
