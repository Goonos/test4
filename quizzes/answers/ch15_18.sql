SELECT constraint_name, constraint_type,
       status, validated, deferrable, deferred
FROM   user_constraints
WHERE  table_name = 'DEPT2'
ORDER BY constraint_name;
