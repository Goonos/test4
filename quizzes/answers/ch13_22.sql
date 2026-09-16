SELECT c.constraint_name, c.constraint_type,
       i.index_name, i.uniqueness
FROM   user_constraints c
JOIN   user_indexes     i ON c.constraint_name = i.index_name
WHERE  c.table_name = 'EMPLOYEES';
