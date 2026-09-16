SELECT table_name, constraint_name, search_condition
FROM   user_constraints
WHERE  table_name = 'EMPLOYEES'
AND    constraint_type = 'C'
ORDER BY constraint_name;
