SELECT employee_id
FROM   employees
WHERE  department_id = 90
MINUS
SELECT manager_id
FROM   employees
WHERE  department_id = 80
AND    manager_id IS NOT NULL
ORDER BY employee_id;
