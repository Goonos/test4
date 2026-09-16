CREATE SYNONYM dept FOR departments;

SELECT department_id, department_name
FROM   dept
ORDER BY department_id;
