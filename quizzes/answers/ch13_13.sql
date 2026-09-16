CREATE INDEX emp_last_name_idx
ON employees (last_name);

SELECT index_name, table_name, uniqueness
FROM   user_indexes
WHERE  table_name = 'EMPLOYEES'
AND    index_name = 'EMP_LAST_NAME_IDX';

