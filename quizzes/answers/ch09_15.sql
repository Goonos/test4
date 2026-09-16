SELECT department_id
FROM   departments
MINUS
SELECT department_id
FROM   employees
WHERE  department_id IS NOT NULL
ORDER BY department_id;
