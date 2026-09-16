DESCRIBE user_constraints;

SELECT constraint_name, constraint_type,
       search_condition, r_constraint_name,
       delete_rule, status
FROM   user_constraints
WHERE  table_name = 'EMPLOYEES'
ORDER BY constraint_type;
