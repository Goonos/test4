CREATE INDEX emp_upper_last_idx
ON employees (UPPER(last_name));

SELECT index_name, index_type
FROM   user_indexes
WHERE  index_name = 'EMP_UPPER_LAST_IDX';

SELECT employee_id, last_name
FROM   employees
WHERE  UPPER(last_name) = 'KING';

SELECT employee_id, last_name
FROM   employees
WHERE  last_name = 'King';
