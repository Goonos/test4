SELECT constraint_name, column_name, position
FROM   user_cons_columns
WHERE  table_name = 'EMPLOYEES'
ORDER BY constraint_name, position;
