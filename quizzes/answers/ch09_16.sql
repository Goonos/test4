SELECT employee_id
FROM   employees
MINUS
SELECT manager_id
FROM   employees
WHERE  manager_id IS NOT NULL
ORDER BY employee_id;
